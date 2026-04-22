#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: bash scripts/create-feature-variant.sh <block-name> <variant-name>"
  echo "Example: bash scripts/create-feature-variant.sh hero split"
  exit 1
fi

BLOCK_SLUG="$1"
VARIANT_SLUG="$2"

if [[ ! "$BLOCK_SLUG" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Error: block name must be kebab-case: [a-z][a-z0-9-]*"
  exit 1
fi

if [[ ! "$VARIANT_SLUG" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Error: variant name must be kebab-case: [a-z][a-z0-9-]*"
  exit 1
fi

to_pascal() {
  local input="$1"
  local out=""
  IFS='-' read -r -a parts <<< "$input"
  for part in "${parts[@]}"; do
    local first
    local rest
    first="$(printf '%s' "${part:0:1}" | tr '[:lower:]' '[:upper:]')"
    rest="${part:1}"
    out+="${first}${rest}"
  done
  printf "%s" "$out"
}

to_camel() {
  local pascal
  pascal="$(to_pascal "$1")"
  local first
  local rest
  first="$(printf '%s' "${pascal:0:1}" | tr '[:upper:]' '[:lower:]')"
  rest="${pascal:1}"
  printf "%s%s" "$first" "$rest"
}

to_label() {
  local input="$1"
  local out=()
  IFS='-' read -r -a parts <<< "$input"
  for part in "${parts[@]}"; do
    local first
    local rest
    first="$(printf '%s' "${part:0:1}" | tr '[:lower:]' '[:upper:]')"
    rest="${part:1}"
    out+=("${first}${rest}")
  done
  local IFS=' '
  printf "%s" "${out[*]}"
}

BLOCK_PASCAL="$(to_pascal "$BLOCK_SLUG")"
BLOCK_CAMEL="$(to_camel "$BLOCK_SLUG")"
BLOCK_LABEL="$(to_label "$BLOCK_SLUG")"
VARIANT_PASCAL="$(to_pascal "$VARIANT_SLUG")"
VARIANT_LABEL="$(to_label "$VARIANT_SLUG")"

BLOCK_DIR="features/blocks/${BLOCK_SLUG}"
INDEX_FILE="${BLOCK_DIR}/index.ts"
VARIANT_DIR="${BLOCK_DIR}/${VARIANT_SLUG}"
EDITOR_FILE="${VARIANT_DIR}/editor.tsx"
RENDER_FILE="${VARIANT_DIR}/render.tsx"
DEFINITION_FILE="${VARIANT_DIR}/definition.ts"
CONTENT_FILE="features/blocks/shared/content.ts"

if [[ ! -d "$BLOCK_DIR" ]]; then
  echo "Error: block '${BLOCK_SLUG}' does not exist at ${BLOCK_DIR}"
  exit 1
fi

if [[ ! -f "$INDEX_FILE" ]]; then
  echo "Error: missing ${INDEX_FILE}"
  exit 1
fi

if [[ -e "$VARIANT_DIR" ]]; then
  echo "Error: variant '${VARIANT_SLUG}' already exists at ${VARIANT_DIR}"
  exit 1
fi

mkdir -p "$VARIANT_DIR"

cat > "$EDITOR_FILE" <<EOF
import { GenericBlockEditor } from "../../shared/generic-editor";

export const ${BLOCK_PASCAL}${VARIANT_PASCAL}Editor = GenericBlockEditor;
EOF

cat > "$RENDER_FILE" <<EOF
import type { BlockRenderProps } from "../../shared/types";

export function ${BLOCK_PASCAL}${VARIANT_PASCAL}Render({ block, theme }: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const subtitle = typeof block.props.subtitle === "string" ? block.props.subtitle : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";

  return (
    <section className="space-y-5">
      <p className={\`text-sm font-medium uppercase tracking-[0.18em] \${theme.kicker}\`}>
        ${BLOCK_LABEL}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className={\`max-w-2xl text-base leading-7 \${theme.muted}\`}>{subtitle}</p>
      <div>
        <span className={theme.button}>{buttonText}</span>
      </div>
    </section>
  );
}
EOF

cat > "$DEFINITION_FILE" <<EOF
import { isPlainObject, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { ${BLOCK_PASCAL}${VARIANT_PASCAL}Editor } from "./editor";
import { ${BLOCK_PASCAL}${VARIANT_PASCAL}Render } from "./render";

export const ${BLOCK_CAMEL}${VARIANT_PASCAL}Definition: BlockVariantDefinition = {
  type: "${BLOCK_SLUG}",
  typeLabel: "${BLOCK_LABEL}",
  variant: "${VARIANT_SLUG}",
  label: "${VARIANT_LABEL}",
  description: "${BLOCK_LABEL} variant: ${VARIANT_LABEL}.",
  fields: [
    {
      key: "title",
      label: "Title",
      kind: "text",
      placeholder: "${BLOCK_LABEL} title",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      kind: "textarea",
      placeholder: "Add supporting text for this block.",
    },
    {
      key: "buttonText",
      label: "Button text",
      kind: "text",
      placeholder: "Learn more",
    },
  ],
  Editor: ${BLOCK_PASCAL}${VARIANT_PASCAL}Editor,
  createDefaultProps: () => ({
    title: "${BLOCK_LABEL} title",
    subtitle: "Add supporting text for this block.",
    buttonText: "Learn more",
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    return {
      title: readString(props.title, "${BLOCK_LABEL} title"),
      subtitle: readString(props.subtitle, "Add supporting text for this block."),
      buttonText: readString(props.buttonText, "Learn more"),
    };
  },
  Renderer: ${BLOCK_PASCAL}${VARIANT_PASCAL}Render,
};
EOF

python3 - "$BLOCK_SLUG" "$VARIANT_SLUG" "$BLOCK_PASCAL" "$BLOCK_CAMEL" "$VARIANT_PASCAL" <<'PY'
import re
import sys
from pathlib import Path

block_slug = sys.argv[1]
variant_slug = sys.argv[2]
block_pascal = sys.argv[3]
block_camel = sys.argv[4]
variant_pascal = sys.argv[5]

index_path = Path(f"features/blocks/{block_slug}/index.ts")
content_path = Path("features/blocks/shared/content.ts")

definition_var = f"{block_camel}{variant_pascal}Definition"
import_line = f'import {{ {definition_var} }} from "./{variant_slug}/definition";'

index_text = index_path.read_text()

if import_line not in index_text:
    imports = list(re.finditer(r'^import .+;$', index_text, re.MULTILINE))
    if not imports:
        raise SystemExit(f"Failed to find imports in {index_path}")
    insert_pos = imports[-1].end()
    index_text = index_text[:insert_pos] + "\n" + import_line + index_text[insert_pos:]

arr_re = re.compile(
    rf'export const {re.escape(block_camel)}Definitions = \[(.*?)\];',
    re.DOTALL,
)
arr_match = arr_re.search(index_text)
if not arr_match:
    raise SystemExit(f"Failed to find {block_camel}Definitions in {index_path}")

arr_body = arr_match.group(1)
if definition_var not in arr_body:
    arr_body_new = arr_body.rstrip() + f", {definition_var}"
    index_text = index_text[:arr_match.start(1)] + arr_body_new + index_text[arr_match.end(1):]

index_path.write_text(index_text)

content_text = content_path.read_text()
variant_type_name = f"{block_pascal}Variant"
variant_type_re = re.compile(
    rf'export type {re.escape(variant_type_name)} = (.+);'
)
variant_match = variant_type_re.search(content_text)
if not variant_match:
    raise SystemExit(
        f"Failed to find {variant_type_name} in features/blocks/shared/content.ts. "
        "Create the block type first with bash scripts/create-feature-block.sh."
    )

variant_union = variant_match.group(1)
variant_literal = f'"{variant_slug}"'
if variant_literal not in variant_union:
    replacement = f'export type {variant_type_name} = {variant_union} | {variant_literal};'
    content_text = content_text.replace(variant_match.group(0), replacement)

content_path.write_text(content_text)
PY

echo "Done."
echo ""
echo "Created:"
echo "  - ${EDITOR_FILE}"
echo "  - ${RENDER_FILE}"
echo "  - ${DEFINITION_FILE}"
echo ""
echo "Updated:"
echo "  - ${INDEX_FILE}"
echo "  - ${CONTENT_FILE}"
echo ""
echo "Next:"
echo "  1) npm run lint -- ${VARIANT_DIR} ${INDEX_FILE} ${CONTENT_FILE}"
echo "  2) Open editor and add '${BLOCK_LABEL} / ${VARIANT_LABEL}' via Add block"
