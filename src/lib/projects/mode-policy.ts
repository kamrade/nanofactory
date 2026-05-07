export const PROJECT_MODE_POLICIES = [
  "switchable",
  "light-only",
  "dark-only",
] as const;

export type ProjectModePolicy = (typeof PROJECT_MODE_POLICIES)[number];

export function isProjectModePolicy(value: unknown): value is ProjectModePolicy {
  return (
    typeof value === "string" &&
    (PROJECT_MODE_POLICIES as readonly string[]).includes(value)
  );
}

export function resolveProjectModePolicy(value: unknown): ProjectModePolicy {
  return isProjectModePolicy(value) ? value : "switchable";
}

export function enforceModeByPolicy(
  policy: ProjectModePolicy,
  requestedMode: "light" | "dark"
): "light" | "dark" {
  if (policy === "light-only") {
    return "light";
  }
  if (policy === "dark-only") {
    return "dark";
  }
  return requestedMode;
}

