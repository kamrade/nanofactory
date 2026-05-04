const ANCHOR_ID_PATTERN = /^[a-z][a-z0-9-]*$/;

export function normalizeAnchorId(value: string) {
  return value.trim().toLowerCase();
}

export function isValidAnchorId(value: string) {
  return ANCHOR_ID_PATTERN.test(value);
}
