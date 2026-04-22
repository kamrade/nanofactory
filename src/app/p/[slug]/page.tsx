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
};

export default async function PublicProjectPage({ params }: PublicProjectPageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const assets = await getAssetsByProjectId(project.id);
  const backgroundScenes = await getBackgroundScenesByProjectId(project.id);

  return (
    <ProjectRenderer
      name={project.name}
      themeKey={project.themeKey}
      content={normalizePageContent(project.contentJson)}
      assets={assets}
      backgroundScenes={backgroundScenes}
    />
  );
}
