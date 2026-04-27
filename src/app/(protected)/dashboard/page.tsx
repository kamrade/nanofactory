import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { getProjectsByUserId } from "@/lib/projects";

import { createProjectAction } from "./actions";
import { UIButton } from "@/components/ui/button";

export default async function DashboardPage() {
  const currentUser = await requireCurrentUser();
  const userProjects = await getProjectsByUserId(currentUser.id);

  return (
    <main className="min-h-screen bg-bg py-4 text-text-main">
      <div className="mx-auto flex container px-4 flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-placeholder">
              Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
              {currentUser.displayName ? `, ${currentUser.displayName}` : ""}.
            </h1>
            <p className="text-sm text-text-muted">Signed in as {currentUser.email}</p>
          </div>

          <LogoutButton />
        </div>

        <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/showcase/uikit"
              className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface-alt px-4 py-2 text-sm font-medium text-text-main transition hover:border-text-placeholder hover:bg-neutral-100"
            >
              Showcase
            </Link>
            {currentUser.role === "admin" ? (
              <Link
                href="/background-library"
                className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface-alt px-4 py-2 text-sm font-medium text-text-main transition hover:border-text-placeholder hover:bg-neutral-100"
              >
                BG Lab
              </Link>
            ) : null}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-text-main">Create project</h2>
              <p className="text-sm leading-6 text-text-muted">
                Start a new draft project in your workspace.
              </p>
            </div>

            <form action={createProjectAction} className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-text-main">
                  Project name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="My new landing page"
                  className="rounded-2xl border border-line bg-surface-alt px-4 py-3 text-sm text-text-main outline-none transition focus:border-text-placeholder"
                />
              </div>

              <UIButton
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium"
              >
                Create project
              </UIButton>
            </form>
          </section>

          <section className="rounded-3xl border border-line bg-surface p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-text-main">Your projects</h2>
                <p className="mt-1 text-sm leading-6 text-text-muted">
                  Only projects owned by your account are shown here.
                </p>
              </div>
              <p className="text-sm font-medium text-text-placeholder">
                {userProjects.length} total
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              {userProjects.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-text-placeholder">
                  No projects yet. Create your first one from the form on the left.
                </p>
              ) : (
                userProjects.map((project) => (
                  <article
                    key={project.id}
                    className="flex flex-col gap-4 rounded-2xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-text-main">
                        {project.name}
                      </h3>
                      <p className="text-sm text-text-muted">Slug: {project.slug}</p>
                      <p className="text-sm text-text-muted">Status: {project.status}</p>
                      {project.status === "published" ? (
                        <Link
                          href={`/p/${project.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-sm font-medium text-primary-300 transition hover:text-primary-200"
                        >
                          View public page
                        </Link>
                      ) : null}
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-line bg-surface-alt px-4 py-2 text-sm font-medium text-text-main transition hover:border-text-placeholder hover:bg-neutral-100"
                    >
                      Open
                    </Link>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
