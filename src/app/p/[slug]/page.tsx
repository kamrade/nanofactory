import { notFound } from "next/navigation";

import { ProjectRenderer } from "@/components/projects/project-renderer";
import { getAssetsByProjectId } from "@/lib/assets";
import { getBackgroundScenesByProjectId } from "@/lib/background-scenes";
import { normalizePageContent } from "@/lib/editor/content";
import { getPublishedProjectBySlug } from "@/lib/projects";

type PublicProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    mode?: string;
  }>;
};

export default async function PublicProjectPage({
  params,
  searchParams,
}: PublicProjectPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const mode = resolvedSearchParams.mode === "dark" ? "dark" : "light";
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const assets = await getAssetsByProjectId(project.id);
  const backgroundScenes = await getBackgroundScenesByProjectId(project.id);

  return (
    <ProjectRenderer
      name={project.name}
      slug={project.slug}
      themeKey={project.themeKey}
      mode={mode}
      galleryItemLinkMode="relative"
      content={normalizePageContent(project.contentJson)}
      assets={assets}
      backgroundScenes={backgroundScenes}
    />
  );
}
