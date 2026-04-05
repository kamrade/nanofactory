"use server";

import "server-only";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { AssetUploadError, validateHeroAssetReferencesForProject } from "@/lib/assets";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { parsePageContentJson } from "@/lib/editor/content";
import {
  createProjectPreviewDraftForUser,
  type PreviewDraftState,
} from "@/lib/project-preview";
import {
  publishProjectForUser,
  saveProjectContentForUser,
  unpublishProjectForUser,
} from "@/lib/projects";

export type SaveEditorState = {
  status: "idle" | "success" | "error";
  message: string;
};

type SaveProjectContentDependencies = {
  validateHeroAssetReferencesForProject: typeof validateHeroAssetReferencesForProject;
  saveProjectContentForUser: typeof saveProjectContentForUser;
  revalidatePath: typeof revalidatePath;
};

const saveProjectContentDependencies: SaveProjectContentDependencies = {
  validateHeroAssetReferencesForProject,
  saveProjectContentForUser,
  revalidatePath,
};

export async function saveProjectContentForUserWithDependencies(
  projectId: string,
  userId: string,
  formData: FormData,
  dependencies: SaveProjectContentDependencies
): Promise<SaveEditorState> {
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

  try {
    await dependencies.validateHeroAssetReferencesForProject(
      projectId,
      userId,
      parsedContent.data
    );
  } catch (error) {
    if (error instanceof AssetUploadError) {
      return {
        status: "error",
        message: error.message,
      };
    }

    throw error;
  }

  const savedContent = await dependencies.saveProjectContentForUser(
    projectId,
    userId,
    parsedContent.data
  );

  if (!savedContent) {
    return {
      status: "error",
      message: "Project not found.",
    };
  }

  dependencies.revalidatePath(`/projects/${projectId}`);
  dependencies.revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Project content saved.",
  };
}

export async function saveProjectContentAction(
  projectId: string,
  _prevState: SaveEditorState,
  formData: FormData
): Promise<SaveEditorState> {
  const currentUser = await requireCurrentUser();
  return saveProjectContentForUserWithDependencies(
    projectId,
    currentUser.id,
    formData,
    saveProjectContentDependencies
  );
}

export async function createProjectPreviewDraftAction(
  projectId: string,
  rawContent: string
): Promise<PreviewDraftState> {
  const currentUser = await requireCurrentUser();
  return createProjectPreviewDraftForUser(projectId, currentUser.id, rawContent);
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
