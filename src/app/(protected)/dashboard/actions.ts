"use server";

import { redirect } from "next/navigation";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { createProjectForUser } from "@/lib/projects";
import { DEFAULT_THEME_KEY } from "@/lib/themes";

type CreateProjectDependencies = {
  requireCurrentUser: typeof requireCurrentUser;
  createProjectForUser: typeof createProjectForUser;
  redirect: typeof redirect;
};

const createProjectDependencies: CreateProjectDependencies = {
  requireCurrentUser,
  createProjectForUser,
  redirect,
};

export async function createProjectActionWithDependencies(
  formData: FormData,
  dependencies: CreateProjectDependencies
) {
  const currentUser = await dependencies.requireCurrentUser();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Project name is required");
  }

  const project = await dependencies.createProjectForUser(currentUser.id, {
    name,
    themeKey: DEFAULT_THEME_KEY,
  });

  dependencies.redirect(`/projects/${project.id}`);
}

export async function createProjectAction(formData: FormData) {
  return createProjectActionWithDependencies(formData, createProjectDependencies);
}
