export const PROJECT_SPACING_SCALES = ["sm", "md", "lg"] as const;

export type ProjectSpacingScale = (typeof PROJECT_SPACING_SCALES)[number];

export function isProjectSpacingScale(value: unknown): value is ProjectSpacingScale {
  return (
    typeof value === "string" &&
    (PROJECT_SPACING_SCALES as readonly string[]).includes(value)
  );
}

export function resolveProjectSpacingScale(value: unknown): ProjectSpacingScale {
  return isProjectSpacingScale(value) ? value : "md";
}
