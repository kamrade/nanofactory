"use server";

import { redirect } from "next/navigation";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { createProjectForUser } from "@/lib/projects";

export async function createProjectAction(formData: FormData) {
  const currentUser = await requireCurrentUser();
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    throw new Error("Project name is required");
  }

  const project = await createProjectForUser(currentUser.id, {
    name,
    themeKey: "classic-light",
  });

  redirect(`/projects/${project.id}`);
}
