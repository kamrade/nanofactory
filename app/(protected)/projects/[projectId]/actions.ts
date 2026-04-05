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

type PublishProjectDependencies = {
  requireCurrentUser: typeof requireCurrentUser;
  publishProjectForUser: typeof publishProjectForUser;
  revalidatePath: typeof revalidatePath;
  redirect: typeof redirect;
};

type UnpublishProjectDependencies = {
  requireCurrentUser: typeof requireCurrentUser;
  unpublishProjectForUser: typeof unpublishProjectForUser;
  revalidatePath: typeof revalidatePath;
  redirect: typeof redirect;
};

const publishProjectDependencies: PublishProjectDependencies = {
  requireCurrentUser,
  publishProjectForUser,
  revalidatePath,
  redirect,
};

const unpublishProjectDependencies: UnpublishProjectDependencies = {
  requireCurrentUser,
  unpublishProjectForUser,
  revalidatePath,
  redirect,
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
  return publishProjectActionWithDependencies(
    projectId,
    publishProjectDependencies
  );
}

export async function publishProjectActionWithDependencies(
  projectId: string,
  dependencies: PublishProjectDependencies
) {
  const currentUser = await dependencies.requireCurrentUser();
  const publishedProject = await dependencies.publishProjectForUser(
    projectId,
    currentUser.id
  );

  if (!publishedProject) {
    dependencies.redirect("/dashboard");
  }

  dependencies.revalidatePath(`/projects/${projectId}`);
  dependencies.revalidatePath("/dashboard");
  dependencies.revalidatePath(`/p/${publishedProject.slug}`);
  dependencies.redirect(`/projects/${projectId}`);
}

export async function unpublishProjectAction(projectId: string) {
  return unpublishProjectActionWithDependencies(
    projectId,
    unpublishProjectDependencies
  );
}

export async function unpublishProjectActionWithDependencies(
  projectId: string,
  dependencies: UnpublishProjectDependencies
) {
  const currentUser = await dependencies.requireCurrentUser();
  const unpublishedProject = await dependencies.unpublishProjectForUser(
    projectId,
    currentUser.id
  );

  if (!unpublishedProject) {
    dependencies.redirect("/dashboard");
  }

  dependencies.revalidatePath(`/projects/${projectId}`);
  dependencies.revalidatePath("/dashboard");
  dependencies.revalidatePath(`/p/${unpublishedProject.slug}`);
  dependencies.redirect(`/projects/${projectId}`);
}
