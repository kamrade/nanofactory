import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectRenderer } from "@/components/projects/project-renderer";
import { getAssetsByProjectIdForUser } from "@/lib/assets";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { normalizePageContent } from "@/lib/editor/content";
import { getProjectByIdForUser } from "@/lib/projects";

type ProjectPreviewPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPreviewPage({ params }: ProjectPreviewPageProps) {
  const currentUser = await requireCurrentUser();
  const { projectId } = await params;
  const project = await getProjectByIdForUser(projectId, currentUser.id);

  if (!project) {
    notFound();
  }

  const assets = await getAssetsByProjectIdForUser(project.id, currentUser.id);

  return (
    <div>
      <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
              Draft preview
            </span>
            <span>Shows last saved content.</span>
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
        content={normalizePageContent(project.contentJson)}
        assets={assets}
      />
    </div>
  );
}
