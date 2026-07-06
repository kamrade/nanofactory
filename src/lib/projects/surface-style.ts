export const PROJECT_SURFACE_STYLES = ["default", "flat"] as const;

export type ProjectSurfaceStyle = (typeof PROJECT_SURFACE_STYLES)[number];

export function isProjectSurfaceStyle(value: unknown): value is ProjectSurfaceStyle {
  return (
    typeof value === "string" &&
    (PROJECT_SURFACE_STYLES as readonly string[]).includes(value)
  );
}

export function resolveProjectSurfaceStyle(value: unknown): ProjectSurfaceStyle {
  return isProjectSurfaceStyle(value) ? value : "default";
}
