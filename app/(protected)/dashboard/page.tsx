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
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-950">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Dashboard
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
              {currentUser.displayName ? `, ${currentUser.displayName}` : ""}.
            </h1>
            <p className="text-sm text-zinc-600">Signed in as {currentUser.email}</p>
          </div>

          <LogoutButton />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-zinc-950">Create project</h2>
              <p className="text-sm leading-6 text-zinc-600">
                Start a new draft project in your workspace.
              </p>
            </div>

            <form action={createProjectAction} className="mt-5 grid gap-4">
              <div className="grid gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-zinc-700">
                  Project name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="My new landing page"
                  className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </div>

              <UIButton
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Create project
              </UIButton>
            </form>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Your projects</h2>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  Only projects owned by your account are shown here.
                </p>
              </div>
              <p className="text-sm font-medium text-zinc-500">
                {userProjects.length} total
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              {userProjects.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-sm text-zinc-500">
                  No projects yet. Create your first one from the form on the left.
                </p>
              ) : (
                userProjects.map((project) => (
                  <article
                    key={project.id}
                    className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-zinc-950">
                        {project.name}
                      </h3>
                      <p className="text-sm text-zinc-600">Slug: {project.slug}</p>
                      <p className="text-sm text-zinc-600">Status: {project.status}</p>
                      {project.status === "published" ? (
                        <Link
                          href={`/p/${project.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
                        >
                          View public page
                        </Link>
                      ) : null}
                    </div>

                    <Link
                      href={`/projects/${project.id}`}
                      className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
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
