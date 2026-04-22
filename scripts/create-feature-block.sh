#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/create-feature-block.sh <block-name>"
  echo "Example: bash scripts/create-feature-block.sh testimonials"
  exit 1
fi

BLOCK_SLUG="$1"

if [[ ! "$BLOCK_SLUG" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "Error: block name must be kebab-case: [a-z][a-z0-9-]*"
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

BLOCK_DIR="features/blocks/${BLOCK_SLUG}"
DEFAULT_DIR="${BLOCK_DIR}/default"
INDEX_FILE="${BLOCK_DIR}/index.ts"
EDITOR_FILE="${DEFAULT_DIR}/editor.tsx"
RENDER_FILE="${DEFAULT_DIR}/render.tsx"
DEFINITION_FILE="${DEFAULT_DIR}/definition.ts"

if [[ -e "$BLOCK_DIR" ]]; then
  echo "Error: ${BLOCK_DIR} already exists."
  exit 1
fi

mkdir -p "$DEFAULT_DIR"

cat > "$EDITOR_FILE" <<EOF
import { GenericBlockEditor } from "../../shared/generic-editor";

export const ${BLOCK_PASCAL}DefaultEditor = GenericBlockEditor;
EOF

cat > "$RENDER_FILE" <<EOF
import type { BlockRenderProps } from "../../shared/types";

export function ${BLOCK_PASCAL}DefaultRender({ block, theme }: BlockRenderProps) {
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
import { ${BLOCK_PASCAL}DefaultEditor } from "./editor";
import { ${BLOCK_PASCAL}DefaultRender } from "./render";

export const ${BLOCK_CAMEL}DefaultDefinition: BlockVariantDefinition = {
  type: "${BLOCK_SLUG}",
  typeLabel: "${BLOCK_LABEL}",
  variant: "default",
  label: "Default",
  description: "Basic ${BLOCK_LABEL} block template.",
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
  Editor: ${BLOCK_PASCAL}DefaultEditor,
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
  Renderer: ${BLOCK_PASCAL}DefaultRender,
};
EOF

cat > "$INDEX_FILE" <<EOF
import { ${BLOCK_CAMEL}DefaultDefinition } from "./default/definition";

export const ${BLOCK_CAMEL}Definitions = [${BLOCK_CAMEL}DefaultDefinition];
EOF

python3 - "$BLOCK_SLUG" "$BLOCK_PASCAL" "$BLOCK_CAMEL" <<'PY'
import re
import sys
from pathlib import Path

slug = sys.argv[1]
pascal = sys.argv[2]
camel = sys.argv[3]

content_path = Path("features/blocks/shared/content.ts")
registry_path = Path("features/blocks/shared/registry.ts")

content = content_path.read_text()

# SupportedBlockType
match = re.search(r'export type SupportedBlockType = (.+);', content)
if not match:
    raise SystemExit("Failed to update SupportedBlockType in content.ts")
supported = match.group(1)
if f'"{slug}"' not in supported:
    content = content.replace(
        match.group(0),
        f'export type SupportedBlockType = {supported} | "{slug}";'
    )

# <Pascal>Variant
variant_type_line = f'export type {pascal}Variant = "default";'
if variant_type_line not in content:
    variant_defs = list(re.finditer(r'export type [A-Za-z0-9]+Variant = ".+?";', content))
    if variant_defs:
        insert_pos = variant_defs[-1].end()
        content = content[:insert_pos] + "\n" + variant_type_line + content[insert_pos:]
    else:
        raise SystemExit("Failed to locate variant type definitions in content.ts")

# BlockVariant union
match = re.search(r'export type BlockVariant = (.+);', content)
if not match:
    raise SystemExit("Failed to update BlockVariant in content.ts")
union = match.group(1)
if f"{pascal}Variant" not in union:
    content = content.replace(
        match.group(0),
        f'export type BlockVariant = {union} | {pascal}Variant;'
    )

content_path.write_text(content)

registry = registry_path.read_text()
import_line = f'import {{ {camel}Definitions }} from "../{slug}";'
if import_line not in registry:
    imports = list(re.finditer(r'^import .+;$', registry, re.MULTILINE))
    if not imports:
        raise SystemExit("Failed to locate imports in registry.ts")
    insert_pos = imports[-1].end()
    registry = registry[:insert_pos] + "\n" + import_line + registry[insert_pos:]

arr_match = re.search(r'const definitions = \[(.+?)\];', registry, re.DOTALL)
if not arr_match:
    raise SystemExit("Failed to locate definitions array in registry.ts")
arr_body = arr_match.group(1)
if f"...{camel}Definitions" not in arr_body:
    arr_body_new = arr_body.rstrip() + f", ...{camel}Definitions"
    registry = registry[:arr_match.start(1)] + arr_body_new + registry[arr_match.end(1):]

registry_path.write_text(registry)
PY

echo "Done."
echo ""
echo "Created:"
echo "  - ${EDITOR_FILE}"
echo "  - ${RENDER_FILE}"
echo "  - ${DEFINITION_FILE}"
echo "  - ${INDEX_FILE}"
echo ""
echo "Updated:"
echo "  - features/blocks/shared/content.ts"
echo "  - features/blocks/shared/registry.ts"
echo ""
echo "Next:"
echo "  1) npm run lint -- features/blocks/${BLOCK_SLUG} features/blocks/shared/content.ts features/blocks/shared/registry.ts"
echo "  2) Open editor and add '${BLOCK_LABEL}' block via Add block"
