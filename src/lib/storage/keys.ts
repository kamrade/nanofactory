function normalizeExtension(extension?: string | null) {
  if (!extension) {
    return "";
  }

  const sanitizedExtension = extension
    .toLowerCase()
    .replace(/^\.+/, "")
    .replace(/[^a-z0-9]/g, "");

  return sanitizedExtension ? `.${sanitizedExtension}` : "";
}

function createStorageId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `asset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildStorageKey(input: { projectId: string; extension?: string | null }) {
  const projectId = input.projectId.trim();

  if (!projectId) {
    throw new Error("buildStorageKey requires a projectId");
  }

  const safeProjectId = projectId.replace(/[^a-zA-Z0-9-]/g, "");

  if (!safeProjectId) {
    throw new Error("buildStorageKey requires a safe projectId");
  }

  return `projects/${safeProjectId}/assets/${createStorageId()}${normalizeExtension(input.extension)}`;
}
