import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectAssetsPanel } from "@/components/assets/project-assets-panel";
import { ProjectEditor } from "@/components/editor/project-editor";
import { getAssetsByProjectIdForUser } from "@/lib/assets";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { normalizePageContent } from "@/lib/editor/content";
import { getProjectByIdForUser } from "@/lib/projects";
import {
  publishProjectAction,
  unpublishProjectAction,
} from "@/app/(protected)/projects/[projectId]/actions";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const currentUser = await requireCurrentUser();
  const { projectId } = await params;
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

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Project
              </p>
              <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Back to dashboard
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <form action={publicationAction}>
              <button
                type="submit"
                className={
                  project.status === "published"
                    ? "inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
                    : "inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                }
              >
                {project.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </form>

            <Link
              href={`/projects/${project.id}/preview`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Open preview
            </Link>

            {project.status === "published" ? (
              <Link
                href={`/p/${project.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100"
              >
                Open public page
              </Link>
            ) : null}
          </div>

          <div className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
            <p>Status: {project.status}</p>
            <p>Slug: {project.slug}</p>
            <p>Theme: {project.themeKey}</p>
            <p>Schema version: {project.schemaVersion}</p>
            <p>
              Published at: {project.publishedAt ? project.publishedAt.toISOString() : "Not published"}
            </p>
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
