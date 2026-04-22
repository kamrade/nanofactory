import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { backgroundScenes, projects } from "@/db/schema";
import type { BackgroundScene, BackgroundSceneRecord } from "@/lib/background-scenes/types";
import { validateBackgroundScene } from "@/lib/background-scenes/schema";

export class BackgroundSceneError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "BackgroundSceneError";
    this.status = status;
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function ensureProjectOwner(projectId: string, userId: string) {
  if (!isUuid(projectId)) {
    throw new BackgroundSceneError("Project not found.", 404);
  }

  const [project] = await db
    .select({
      id: projects.id,
      userId: projects.userId,
    })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1);

  if (!project) {
    throw new BackgroundSceneError("Project not found.", 404);
  }

  return project;
}

type CreateBackgroundSceneInput = {
  projectId: string;
  name: string;
  sceneJson: BackgroundScene;
};

type UpdateBackgroundSceneInput = {
  sceneId: string;
  projectId: string;
  userId: string;
  name: string;
  sceneJson: BackgroundScene;
};

export async function createBackgroundSceneForProject(input: CreateBackgroundSceneInput) {
  const validated = validateBackgroundScene(input.sceneJson);

  if (!validated) {
    throw new BackgroundSceneError("Invalid background scene payload.", 400);
  }

  const [scene] = await db
    .insert(backgroundScenes)
    .values({
      projectId: input.projectId,
      name: input.name.trim().length > 0 ? input.name.trim() : validated.name,
      sceneJson: validated,
    })
    .returning({
      id: backgroundScenes.id,
      projectId: backgroundScenes.projectId,
      name: backgroundScenes.name,
      sceneJson: backgroundScenes.sceneJson,
      createdAt: backgroundScenes.createdAt,
      updatedAt: backgroundScenes.updatedAt,
    });

  return scene;
}

export async function getBackgroundScenesByProjectIdForUser(projectId: string, userId: string) {
  if (!isUuid(projectId)) {
    return [];
  }

  const rows = await db
    .select({
      id: backgroundScenes.id,
      projectId: backgroundScenes.projectId,
      name: backgroundScenes.name,
      sceneJson: backgroundScenes.sceneJson,
      createdAt: backgroundScenes.createdAt,
      updatedAt: backgroundScenes.updatedAt,
    })
    .from(backgroundScenes)
    .innerJoin(projects, eq(projects.id, backgroundScenes.projectId))
    .where(and(eq(backgroundScenes.projectId, projectId), eq(projects.userId, userId)))
    .orderBy(desc(backgroundScenes.updatedAt), desc(backgroundScenes.createdAt));

  return rows;
}

export async function getBackgroundScenesByProjectId(projectId: string) {
  if (!isUuid(projectId)) {
    return [];
  }

  const rows = await db
    .select({
      id: backgroundScenes.id,
      projectId: backgroundScenes.projectId,
      name: backgroundScenes.name,
      sceneJson: backgroundScenes.sceneJson,
      createdAt: backgroundScenes.createdAt,
      updatedAt: backgroundScenes.updatedAt,
    })
    .from(backgroundScenes)
    .where(eq(backgroundScenes.projectId, projectId))
    .orderBy(desc(backgroundScenes.updatedAt), desc(backgroundScenes.createdAt));

  return rows;
}

export async function updateBackgroundSceneForProject(input: UpdateBackgroundSceneInput) {
  const validated = validateBackgroundScene(input.sceneJson);

  if (!validated) {
    throw new BackgroundSceneError("Invalid background scene payload.", 400);
  }

  await ensureProjectOwner(input.projectId, input.userId);

  const [scene] = await db
    .update(backgroundScenes)
    .set({
      name: input.name.trim().length > 0 ? input.name.trim() : validated.name,
      sceneJson: validated,
      updatedAt: new Date(),
    })
    .where(and(eq(backgroundScenes.id, input.sceneId), eq(backgroundScenes.projectId, input.projectId)))
    .returning({
      id: backgroundScenes.id,
      projectId: backgroundScenes.projectId,
      name: backgroundScenes.name,
      sceneJson: backgroundScenes.sceneJson,
      createdAt: backgroundScenes.createdAt,
      updatedAt: backgroundScenes.updatedAt,
    });

  if (!scene) {
    throw new BackgroundSceneError("Background scene not found.", 404);
  }

  return scene;
}

export async function deleteBackgroundSceneForProject(
  sceneId: string,
  projectId: string,
  userId: string
) {
  await ensureProjectOwner(projectId, userId);

  const [scene] = await db
    .delete(backgroundScenes)
    .where(and(eq(backgroundScenes.id, sceneId), eq(backgroundScenes.projectId, projectId)))
    .returning({
      id: backgroundScenes.id,
    });

  if (!scene) {
    throw new BackgroundSceneError("Background scene not found.", 404);
  }

  return scene;
}

export async function validateBackgroundSceneReferencesForProject(
  projectId: string,
  userId: string,
  content: {
    blocks: Array<{
      id: string;
      type: string;
      backgroundSceneId?: string;
      props: Record<string, unknown>;
    }>;
  }
) {
  const sceneIds = content.blocks
    .map((block) => block.backgroundSceneId)
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0);

  if (sceneIds.length === 0) {
    return;
  }

  await ensureProjectOwner(projectId, userId);

  const scenes = await getBackgroundScenesByProjectIdForUser(projectId, userId);
  const availableIds = new Set(scenes.map((scene) => scene.id));

  for (const sceneId of sceneIds) {
    if (!availableIds.has(sceneId)) {
      throw new BackgroundSceneError(
        "Selected background scene does not belong to this project.",
        400
      );
    }
  }
}
