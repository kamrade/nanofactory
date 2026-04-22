export function isPlainObject(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

export function readString(input: unknown, fallback: string) {
  return typeof input === "string" ? input : fallback;
}

export function readOptionalString(input: unknown) {
  if (typeof input !== "string") {
    return undefined;
  }

  const value = input.trim();
  return value.length > 0 ? value : undefined;
}

export function readStringList(input: unknown, fallback: string[]) {
  if (!Array.isArray(input)) {
    return fallback;
  }

  const items = input
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

export function createBlockId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
