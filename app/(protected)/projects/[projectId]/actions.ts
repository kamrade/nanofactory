"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { parsePageContentJson } from "@/lib/editor/content";
import {
  publishProjectForUser,
  saveProjectContentForUser,
  unpublishProjectForUser,
} from "@/lib/projects";

export type SaveEditorState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function saveProjectContentAction(
  projectId: string,
  _prevState: SaveEditorState,
  formData: FormData
): Promise<SaveEditorState> {
  const currentUser = await requireCurrentUser();
  const rawContent = formData.get("content");

  if (typeof rawContent !== "string") {
    return {
      status: "error",
      message: "Missing content payload.",
    };
  }

  const parsedContent = parsePageContentJson(rawContent);

  if (!parsedContent.success) {
    return {
      status: "error",
      message: parsedContent.error,
    };
  }

  const savedContent = await saveProjectContentForUser(
    projectId,
    currentUser.id,
    parsedContent.data
  );

  if (!savedContent) {
    return {
      status: "error",
      message: "Project not found.",
    };
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Project content saved.",
  };
}

export async function publishProjectAction(projectId: string) {
  const currentUser = await requireCurrentUser();
  const publishedProject = await publishProjectForUser(projectId, currentUser.id);

  if (!publishedProject) {
    redirect("/dashboard");
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/p/${publishedProject.slug}`);
  redirect(`/projects/${projectId}`);
}

export async function unpublishProjectAction(projectId: string) {
  const currentUser = await requireCurrentUser();
  const unpublishedProject = await unpublishProjectForUser(projectId, currentUser.id);

  if (!unpublishedProject) {
    redirect("/dashboard");
  }

  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
  revalidatePath(`/p/${unpublishedProject.slug}`);
  redirect(`/projects/${projectId}`);
}
