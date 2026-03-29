"use server";

import "server-only";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/auth/current-user";
import { parsePageContentJson } from "@/lib/editor/content";
import { saveProjectContentForUser } from "@/lib/projects";

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
