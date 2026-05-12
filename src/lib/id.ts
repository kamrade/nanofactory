/**
 * Generate a unique identifier with an optional prefix.
 * Uses crypto.randomUUID when available, falls back to Date.now() + Math.random().
 */
export function createId(prefix?: string): string {
  const uuid =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  if (!prefix) {
    return uuid;
  }

  return `${prefix}-${uuid}`;
}
