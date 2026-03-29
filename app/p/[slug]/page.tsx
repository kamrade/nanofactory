import { notFound } from "next/navigation";

import { ProjectRenderer } from "@/components/projects/project-renderer";
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

  return (
    <ProjectRenderer
      name={project.name}
      themeKey={project.themeKey}
      content={normalizePageContent(project.contentJson)}
    />
  );
}
