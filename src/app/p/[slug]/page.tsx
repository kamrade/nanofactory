import { notFound } from "next/navigation";
import { headers } from "next/headers";

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
  const requestHeaders = await headers();
  const requestHost = requestHeaders.get("host")?.split(":")[0]?.toLowerCase() ?? "";
  const isPlatformHost =
    requestHost === "app.olala.beauty" ||
    requestHost === "localhost" ||
    requestHost === "127.0.0.1";
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
      galleryItemLinkMode={isPlatformHost ? "absolute" : "relative"}
      content={normalizePageContent(project.contentJson)}
      assets={assets}
      backgroundScenes={backgroundScenes}
    />
  );
}
