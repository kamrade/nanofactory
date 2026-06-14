import { notFound } from "next/navigation";
import { ProjectSettings } from "@/components/projects/project-settings";
import { ProjectWorkspace } from "@/components/projects/project-workspace";
import { getAssetsByProjectIdForUser } from "@/lib/assets";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { getBackgroundScenesByProjectIdForUser } from "@/lib/background-scenes";
import { normalizePageContent } from "@/lib/editor/content";
import { getProjectByIdForUser } from "@/lib/projects";
import {
  publishProjectAction,
  saveProjectContentAction,
  updateProjectBorderRadiusPolicyAction,
  updateProjectSpacingScaleAction,
  updateProjectNameAction,
  updateProjectModePolicyAction,
  updateProjectThemeAction,
  unpublishProjectAction,
} from "@/app/(protected)/projects/[projectId]/actions";
import { enforceModeByPolicy } from "@/lib/projects/mode-policy";

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
  const project = await getProjectByIdForUser(projectId, currentUser.id);
  const projectAssets = await getAssetsByProjectIdForUser(projectId, currentUser.id);
  const backgroundScenes = await getBackgroundScenesByProjectIdForUser(
    projectId,
    currentUser.id
  );

  if (!project) {
    notFound();
  }
  const initialMode = enforceModeByPolicy(
    project.modePolicy,
    resolvedSearchParams.mode === "dark" ? "dark" : "light"
  );

  const normalizedContent = normalizePageContent(project.contentJson);
  const publicationAction =
    project.status === "published"
      ? unpublishProjectAction.bind(null, project.id)
      : publishProjectAction.bind(null, project.id);
  const themeAction = updateProjectThemeAction.bind(null, project.id);
  const nameAction = updateProjectNameAction.bind(null, project.id);
  const modePolicyAction = updateProjectModePolicyAction.bind(null, project.id);
  const borderRadiusPolicyAction = updateProjectBorderRadiusPolicyAction.bind(
    null,
    project.id
  );
  const saveAction = saveProjectContentAction.bind(null, project.id);

  return (
    <main
      data-theme={project.themeKey}
      data-mode={initialMode}
      data-mode-policy={project.modePolicy}
      data-border-radius={project.borderRadiusPolicy}
      data-spacing-scale={project.spacingScale}
      className="min-h-screen bg-bg pb-4 text-text-main"
    >
      <div className="mx-auto flex w-full flex-col gap-8">
        <ProjectSettings
          project={{
            id: project.id,
            name: project.name,
            slug: project.slug,
            themeKey: project.themeKey,
            modePolicy: project.modePolicy,
            borderRadiusPolicy: project.borderRadiusPolicy,
            spacingScale: project.spacingScale,
            status: project.status,
            schemaVersion: project.schemaVersion,
            publishedAt: project.publishedAt,
          }}
          initialMode={initialMode}
          publicationAction={publicationAction}
          themeAction={themeAction}
          nameAction={nameAction}
          modePolicyAction={modePolicyAction}
          borderRadiusPolicyAction={borderRadiusPolicyAction}
          spacingScaleAction={updateProjectSpacingScaleAction.bind(null, project.id)}
          saveAction={saveAction}
          contentShape={JSON.stringify(normalizedContent, null, 2)}
        />

        <ProjectWorkspace
          project={{
            id: project.id,
            name: project.name,
            slug: project.slug,
            themeKey: project.themeKey,
            modePolicy: project.modePolicy,
            borderRadiusPolicy: project.borderRadiusPolicy,
            spacingScale: project.spacingScale,
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
