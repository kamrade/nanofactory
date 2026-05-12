import { createId } from "@/lib/id";

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

export function buildStorageKey(input: { projectId: string; extension?: string | null }) {
  const projectId = input.projectId.trim();

  if (!projectId) {
    throw new Error("buildStorageKey requires a projectId");
  }

  const safeProjectId = projectId.replace(/[^a-zA-Z0-9-]/g, "");

  if (!safeProjectId) {
    throw new Error("buildStorageKey requires a safe projectId");
  }

  return `projects/${safeProjectId}/assets/${createId()}${normalizeExtension(input.extension)}`;
}
