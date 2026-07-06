import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { ProjectRenderer } from "@/components/projects/project-renderer";
import { getAssetsByProjectId } from "@/lib/assets";
import { getBackgroundScenesByProjectId } from "@/lib/background-scenes";
import { normalizePageContent } from "@/lib/editor/content";
import { getPublishedProjectBySlug } from "@/lib/projects";
import { resolveGalleryItemLinkModeByHost } from "@/lib/routing/gallery-link-mode";
import { enforceModeByPolicy } from "@/lib/projects/mode-policy";

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
  const requestHeaders = await headers();
  const galleryItemLinkMode = resolveGalleryItemLinkModeByHost(requestHeaders.get("host"));
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }
  const mode = enforceModeByPolicy(
    project.modePolicy,
    resolvedSearchParams.mode === "dark" ? "dark" : "light"
  );

  const assets = await getAssetsByProjectId(project.id);
  const backgroundScenes = await getBackgroundScenesByProjectId(project.id);

  return (
    <ProjectRenderer
      name={project.name}
      slug={project.slug}
      themeKey={project.themeKey}
      mode={mode}
      modePolicy={project.modePolicy}
      borderRadiusPolicy={project.borderRadiusPolicy}
      spacingScale={project.spacingScale}
      surfaceStyle={project.surfaceStyle}
      galleryItemLinkMode={galleryItemLinkMode}
      content={normalizePageContent(project.contentJson)}
      assets={assets}
      backgroundScenes={backgroundScenes}
    />
  );
}
