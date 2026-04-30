import { notFound } from "next/navigation";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectWorkspace } from "@/components/projects/project-workspace";
import { getAssetsByProjectIdForUser } from "@/lib/assets";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { getBackgroundScenesByProjectIdForUser } from "@/lib/background-scenes";
import { normalizePageContent } from "@/lib/editor/content";
import { getProjectByIdForUser } from "@/lib/projects";
import {
  publishProjectAction,
  updateProjectNameAction,
  updateProjectThemeAction,
  unpublishProjectAction,
} from "@/app/(protected)/projects/[projectId]/actions";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams?: Promise<{
    mode?: string;
  }>;
};

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const currentUser = await requireCurrentUser();
  const { projectId } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialMode = resolvedSearchParams.mode === "dark" ? "dark" : "light";
  const project = await getProjectByIdForUser(projectId, currentUser.id);
  const projectAssets = await getAssetsByProjectIdForUser(projectId, currentUser.id);
  const backgroundScenes = await getBackgroundScenesByProjectIdForUser(
    projectId,
    currentUser.id
  );

  if (!project) {
    notFound();
  }

  const normalizedContent = normalizePageContent(project.contentJson);
  const publicationAction =
    project.status === "published"
      ? unpublishProjectAction.bind(null, project.id)
      : publishProjectAction.bind(null, project.id);
  const themeAction = updateProjectThemeAction.bind(null, project.id);
  const nameAction = updateProjectNameAction.bind(null, project.id);

  return (
    <main
      data-theme={project.themeKey}
      data-mode={initialMode}
      className="min-h-screen bg-bg py-4 text-text-main"
    >
      <div className="mx-auto flex w-full flex-col gap-8">
        <ProjectHeader
          project={{
            id: project.id,
            name: project.name,
            slug: project.slug,
            themeKey: project.themeKey,
            status: project.status,
            schemaVersion: project.schemaVersion,
            publishedAt: project.publishedAt,
          }}
          initialMode={initialMode}
          publicationAction={publicationAction}
          themeAction={themeAction}
          nameAction={nameAction}
        />

        <ProjectWorkspace
          project={{
            id: project.id,
            name: project.name,
            slug: project.slug,
            themeKey: project.themeKey,
            status: project.status,
            contentJson: normalizedContent,
          }}
          initialMode={initialMode}
          initialAssets={projectAssets}
          initialBackgroundScenes={backgroundScenes}
        />
      </div>
    </main>
  );
}
