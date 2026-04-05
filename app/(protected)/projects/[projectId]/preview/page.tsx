import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectRenderer } from "@/components/projects/project-renderer";
import { getAssetsByProjectIdForUser } from "@/lib/assets";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { normalizePageContent } from "@/lib/editor/content";
import { getPreviewDraft } from "@/lib/preview-drafts";
import { getProjectByIdForUser } from "@/lib/projects";

type ProjectPreviewPageProps = {
  params: Promise<{
    projectId: string;
  }>;
  searchParams?: Promise<{
    draft?: string;
  }>;
};

export default async function ProjectPreviewPage({
  params,
  searchParams,
}: ProjectPreviewPageProps) {
  const currentUser = await requireCurrentUser();
  const { projectId } = await params;
  const project = await getProjectByIdForUser(projectId, currentUser.id);

  if (!project) {
    notFound();
  }

  const assets = await getAssetsByProjectIdForUser(project.id, currentUser.id);
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const draftToken = resolvedSearchParams.draft;
  const draft = draftToken ? getPreviewDraft(draftToken) : null;
  const hasValidDraft =
    !!draft &&
    draft.projectId === project.id &&
    draft.userId === currentUser.id;
  const content = hasValidDraft ? draft.content : project.contentJson;
  const bannerTitle = hasValidDraft ? "Draft preview" : "Saved preview";
  const bannerDescription = hasValidDraft
    ? "Shows unsaved changes. Drafts expire after 15 minutes."
    : draftToken
      ? "Draft expired or not found. Showing last saved content."
      : "Shows last saved content.";

  return (
    <div>
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
              {bannerTitle}
            </span>
            <span>{bannerDescription}</span>
          </div>
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            Back to editor
          </Link>
        </div>
      </div>

      <ProjectRenderer
        name={project.name}
        themeKey={project.themeKey}
        content={normalizePageContent(content)}
        assets={assets}
      />
    </div>
  );
}
