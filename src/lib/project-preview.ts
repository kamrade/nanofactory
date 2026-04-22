import "server-only";

import {
  AssetUploadError,
  validateAssetReferencesForProject,
  validateHeroAssetReferencesForProject,
} from "@/lib/assets";
import {
  BackgroundSceneError,
  validateBackgroundSceneReferencesForProject,
} from "@/lib/background-scenes";
import { parsePageContentJson } from "@/lib/editor/content";
import { createPreviewDraft } from "@/lib/preview-drafts";
import { getProjectByIdForUser } from "@/lib/projects";

export type PreviewDraftState =
  | { status: "success"; token: string }
  | { status: "error"; message: string };

type PreviewDraftDependencies = {
  getProjectByIdForUser: typeof getProjectByIdForUser;
  validateAssetReferencesForProject?: typeof validateAssetReferencesForProject;
  validateHeroAssetReferencesForProject?: typeof validateHeroAssetReferencesForProject;
  validateBackgroundSceneReferencesForProject?: typeof validateBackgroundSceneReferencesForProject;
  createPreviewDraft: typeof createPreviewDraft;
};

const defaultDependencies: PreviewDraftDependencies = {
  getProjectByIdForUser,
  validateAssetReferencesForProject,
  validateBackgroundSceneReferencesForProject,
  createPreviewDraft,
};

export async function createProjectPreviewDraftForUserWithDependencies(
  projectId: string,
  userId: string,
  rawContent: string,
  dependencies: PreviewDraftDependencies
): Promise<PreviewDraftState> {
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

  const project = await dependencies.getProjectByIdForUser(projectId, userId);

  if (!project) {
    return {
      status: "error",
      message: "Project not found.",
    };
  }

  try {
    const validateReferences =
      dependencies.validateAssetReferencesForProject ??
      dependencies.validateHeroAssetReferencesForProject;

    if (!validateReferences) {
      throw new Error("Missing asset validation dependency.");
    }

    await validateReferences(
      projectId,
      userId,
      parsedContent.data
    );

    await dependencies.validateBackgroundSceneReferencesForProject?.(
      projectId,
      userId,
      parsedContent.data
    );
  } catch (error) {
    if (error instanceof AssetUploadError || error instanceof BackgroundSceneError) {
      return {
        status: "error",
        message: error.message,
      };
    }

    throw error;
  }

  const draft = dependencies.createPreviewDraft({
    projectId,
    userId,
    content: parsedContent.data,
  });

  return {
    status: "success",
    token: draft.id,
  };
}

export async function createProjectPreviewDraftForUser(
  projectId: string,
  userId: string,
  rawContent: string
): Promise<PreviewDraftState> {
  return createProjectPreviewDraftForUserWithDependencies(
    projectId,
    userId,
    rawContent,
    defaultDependencies
  );
}
