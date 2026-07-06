export const PROJECT_HEADING_FONTS = [
  "onest",
  "playfair-display",
  "ibm-plex-mono",
] as const;

export type ProjectHeadingFont = (typeof PROJECT_HEADING_FONTS)[number];

const DEFAULT_PROJECT_HEADING_FONT: ProjectHeadingFont = "onest";

export const PROJECT_HEADING_FONT_LABELS: Record<ProjectHeadingFont, string> = {
  onest: "Onest",
  "playfair-display": "Playfair Display",
  "ibm-plex-mono": "IBM Plex Mono",
};

export function isProjectHeadingFont(value: string): value is ProjectHeadingFont {
  return PROJECT_HEADING_FONTS.includes(value as ProjectHeadingFont);
}

export function resolveProjectHeadingFont(
  value: ProjectHeadingFont | string | null | undefined
): ProjectHeadingFont {
  return value && isProjectHeadingFont(value) ? value : DEFAULT_PROJECT_HEADING_FONT;
}
