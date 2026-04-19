import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";

import { ProjectAssetsPanel } from "@/components/assets/project-assets-panel";
import { ProjectEditor } from "@/components/editor/project-editor";
import { OpenPreviewButton } from "@/components/editor/open-preview-button";
import { ProjectModeSwitcher } from "@/components/projects/project-mode-switcher";
import { ProjectRenameForm } from "@/components/projects/project-rename-form";
import { ProjectThemeForm } from "@/components/projects/project-theme-form";
import { UIDivider } from "@/components/ui/divider";
import { getAssetsByProjectIdForUser } from "@/lib/assets";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { normalizePageContent } from "@/lib/editor/content";
import { getProjectByIdForUser } from "@/lib/projects";
import { THEME_OPTIONS } from "@/lib/themes";
import { formatUiDateTime } from "@/lib/ui-date-time";
import { UIButton } from "@/components/ui/button";
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
      className="min-h-screen bg-bg px-4 py-4 text-text-main"
    >
      <div className="mx-auto flex w-full flex-col gap-8">
        <div data-testid="ProjectHeader" className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 shadow-sm">
          

          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-placeholder">
                Project
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
            </div>

            <UIButton asChild theme="base" variant="outlined" size="sm">
              <Link href="/dashboard">
                <FiArrowLeft aria-hidden className="h-4 w-4" />
                <span>Back to dashboard</span>
              </Link>
            </UIButton>
          </div>


           <div className="flex flex-wrap items-center gap-3">
            <ProjectThemeForm
              initialThemeKey={project.themeKey}
              options={THEME_OPTIONS}
              action={themeAction}
            />
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span>Mode</span>
              <ProjectModeSwitcher
                initialMode={initialMode}
                inputName="previewMode"
                syncSearchParam="mode"
              />
            </div>
            
            <ProjectRenameForm initialName={project.name} action={nameAction} />
          </div>


          <div className="grid gap-3 text-sm text-text-muted sm:grid-cols-2">
            <p>Status: {project.status}</p>
            <p>Slug: {project.slug}</p>
            <p>Theme: {project.themeKey}</p>
            <p>Schema version: {project.schemaVersion}</p>
            <p>
              Published at: {project.publishedAt ? formatUiDateTime(project.publishedAt) : "Not published"}
            </p>
          </div>


          <UIDivider spacing="sm" />


          <div className="flex flex-wrap items-center gap-3">
            <form action={publicationAction}>
              <UIButton
                type="submit"
                theme={project.status === "published" ? "danger" : "primary"}
                variant={project.status === "published" ? "outlined" : "contained"}
                size="sm"
              >
                {project.status === "published" ? "Unpublish" : "Publish"}
              </UIButton>
            </form>

            <OpenPreviewButton projectId={project.id} />

            {project.status === "published" ? (
              <UIButton asChild theme="base" variant="contained" size="sm">
                <Link href={`/p/${project.slug}`} target="_blank" rel="noreferrer">
                  Open public page
                </Link>
              </UIButton>
            ) : null}
          </div>


        </div>

        <ProjectEditor
          project={{
            id: project.id,
            name: project.name,
            slug: project.slug,
            themeKey: project.themeKey,
            status: project.status,
            contentJson: normalizedContent,
          }}
          assets={projectAssets}
        />

        <ProjectAssetsPanel
          projectId={project.id}
          initialAssets={projectAssets.map((asset) => ({
            ...asset,
            createdAt: asset.createdAt.toISOString(),
            updatedAt: asset.updatedAt.toISOString(),
          }))}
        />
      </div>
    </main>
  );
}
