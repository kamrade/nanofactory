export function slugifyProjectName(name: string) {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);

  return baseSlug || "project";
}

export function buildProjectSlugCandidate(baseSlug: string, attempt: number) {
  if (attempt <= 1) {
    return baseSlug;
  }

  return `${baseSlug}-${attempt}`;
}
