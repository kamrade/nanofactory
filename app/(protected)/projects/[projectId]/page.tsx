import Link from "next/link";
import { notFound } from "next/navigation";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { getProjectByIdForUser } from "@/lib/projects";

type ProjectPageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const currentUser = await requireCurrentUser();
  const { projectId } = await params;
  const project = await getProjectByIdForUser(projectId, currentUser.id);

  if (!project) {
    notFound();
  }

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

          <div className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
            <p>Status: {project.status}</p>
            <p>Slug: {project.slug}</p>
            <p>Theme: {project.themeKey}</p>
            <p>Schema version: {project.schemaVersion}</p>
          </div>
        </div>

        <section className="rounded-3xl border border-dashed border-zinc-300 bg-white p-6">
          <h2 className="text-lg font-semibold text-zinc-950">Editor placeholder</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            This project route is owner-protected and ready for the editor step.
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Current blocks: {project.contentJson.blocks.length}
          </p>
        </section>
      </div>
    </main>
  );
}
