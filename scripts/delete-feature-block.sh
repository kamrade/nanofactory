#!/usr/bin/env bash
set -euo pipefail

YES_MODE="false"

if [[ "${1:-}" == "--yes" ]]; then
  YES_MODE="true"
  shift
fi

if [[ $# -ne 1 ]]; then
  echo "Usage: bash scripts/delete-feature-block.sh [--yes] <block-name>"
  echo "Example: bash scripts/delete-feature-block.sh testimonials"
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

BLOCK_PASCAL="$(to_pascal "$BLOCK_SLUG")"
BLOCK_CAMEL="$(to_camel "$BLOCK_SLUG")"

BLOCK_DIR="features/blocks/${BLOCK_SLUG}"
CONTENT_FILE="features/blocks/shared/content.ts"
REGISTRY_FILE="features/blocks/shared/registry.ts"

if [[ ! -d "$BLOCK_DIR" ]]; then
  echo "Error: block '${BLOCK_SLUG}' does not exist at ${BLOCK_DIR}"
  exit 1
fi

if [[ ! -f "$CONTENT_FILE" || ! -f "$REGISTRY_FILE" ]]; then
  echo "Error: required files are missing:"
  echo "  - ${CONTENT_FILE}"
  echo "  - ${REGISTRY_FILE}"
  exit 1
fi

if [[ "$YES_MODE" != "true" ]]; then
  echo "This will permanently delete:"
  echo "  - ${BLOCK_DIR}"
  echo ""
  echo "And update:"
  echo "  - ${CONTENT_FILE}"
  echo "  - ${REGISTRY_FILE}"
  echo ""
  read -r -p "Continue? [y/N] " ANSWER
  if [[ ! "$ANSWER" =~ ^[Yy]$ ]]; then
    echo "Canceled."
    exit 0
  fi
fi

python3 - "$BLOCK_SLUG" "$BLOCK_PASCAL" "$BLOCK_CAMEL" <<'PY'
import re
import sys
from pathlib import Path

slug = sys.argv[1]
pascal = sys.argv[2]
camel = sys.argv[3]

content_path = Path("features/blocks/shared/content.ts")
registry_path = Path("features/blocks/shared/registry.ts")

def remove_union_member(union_text: str, member: str) -> str:
    parts = [p.strip() for p in union_text.split("|")]
    filtered = [p for p in parts if p != member]
    if len(filtered) == len(parts):
        return union_text
    if not filtered:
        raise SystemExit(f"Cannot remove {member}: union would become empty")
    return " | ".join(filtered)

content = content_path.read_text()

supported_re = re.compile(r'export type SupportedBlockType = (.+);')
supported_match = supported_re.search(content)
if not supported_match:
    raise SystemExit("Failed to find SupportedBlockType in content.ts")
supported_union = supported_match.group(1)
updated_supported = remove_union_member(supported_union, f'"{slug}"')
content = content.replace(supported_match.group(0), f'export type SupportedBlockType = {updated_supported};')

variant_type_name = f"{pascal}Variant"
variant_line_re = re.compile(rf'^export type {re.escape(variant_type_name)} = .+;$\n?', re.MULTILINE)
content = variant_line_re.sub("", content)

block_variant_re = re.compile(r'export type BlockVariant = (.+);')
block_variant_match = block_variant_re.search(content)
if not block_variant_match:
    raise SystemExit("Failed to find BlockVariant in content.ts")
block_variant_union = block_variant_match.group(1)
updated_block_variant = remove_union_member(block_variant_union, variant_type_name)
content = content.replace(
    block_variant_match.group(0),
    f'export type BlockVariant = {updated_block_variant};'
)

content_path.write_text(content)

registry = registry_path.read_text()
import_line_re = re.compile(
    rf'^\s*import \{{ {re.escape(camel)}Definitions \}} from "\.\./{re.escape(slug)}";\n',
    re.MULTILINE,
)
registry = import_line_re.sub("", registry)

defs_re = re.compile(r'const definitions = \[(.+?)\];', re.DOTALL)
defs_match = defs_re.search(registry)
if not defs_match:
    raise SystemExit("Failed to find definitions array in registry.ts")

entries = [item.strip() for item in defs_match.group(1).split(",") if item.strip()]
target = f"...{camel}Definitions"
entries = [item for item in entries if item != target]
if not entries:
    raise SystemExit("Refusing to remove last block definitions entry")

registry = (
    registry[:defs_match.start(1)]
    + ", ".join(entries)
    + registry[defs_match.end(1):]
)

registry_path.write_text(registry)
PY

rm -rf "$BLOCK_DIR"

echo "Done."
echo ""
echo "Deleted:"
echo "  - ${BLOCK_DIR}"
echo ""
echo "Updated:"
echo "  - ${CONTENT_FILE}"
echo "  - ${REGISTRY_FILE}"
echo ""
echo "Recommended:"
echo "  npm run lint -- ${CONTENT_FILE} ${REGISTRY_FILE}"
