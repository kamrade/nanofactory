export const PROJECT_BORDER_RADIUS_POLICIES = ["none", "md", "lg"] as const;

export type ProjectBorderRadiusPolicy = (typeof PROJECT_BORDER_RADIUS_POLICIES)[number];

export function isProjectBorderRadiusPolicy(
  value: unknown
): value is ProjectBorderRadiusPolicy {
  return (
    typeof value === "string" &&
    (PROJECT_BORDER_RADIUS_POLICIES as readonly string[]).includes(value)
  );
}

export function resolveProjectBorderRadiusPolicy(value: unknown): ProjectBorderRadiusPolicy {
  return isProjectBorderRadiusPolicy(value) ? value : "lg";
}
