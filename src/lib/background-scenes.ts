import "server-only";

import { and, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import { backgroundSceneLibrary, projects } from "@/db/schema";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";

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
}

function selectLibraryScenesQuery() {
  return db
    .select({
      id: backgroundSceneLibrary.id,
      projectId: backgroundSceneLibrary.sourceProjectId,
      name: backgroundSceneLibrary.name,
      sceneJson: backgroundSceneLibrary.sceneJson,
      createdByUserId: backgroundSceneLibrary.createdByUserId,
      sourceProjectId: backgroundSceneLibrary.sourceProjectId,
      createdAt: backgroundSceneLibrary.createdAt,
      updatedAt: backgroundSceneLibrary.updatedAt,
    })
    .from(backgroundSceneLibrary)
    .orderBy(
      desc(backgroundSceneLibrary.updatedAt),
      desc(backgroundSceneLibrary.createdAt)
    );
}

export async function getBackgroundScenesByProjectIdForUser(
  projectId: string,
  userId: string
): Promise<BackgroundSceneRecord[]> {
  if (!isUuid(projectId)) {
    return [];
  }

  try {
    await ensureProjectOwner(projectId, userId);
  } catch (error) {
    if (error instanceof BackgroundSceneError && error.status === 404) {
      return [];
    }
    throw error;
  }

  return selectLibraryScenesQuery();
}

export async function getBackgroundScenesByProjectId(
  _projectId: string
): Promise<BackgroundSceneRecord[]> {
  return selectLibraryScenesQuery();
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

  const rows = await db
    .select({
      id: backgroundSceneLibrary.id,
    })
    .from(backgroundSceneLibrary)
    .where(inArray(backgroundSceneLibrary.id, sceneIds));

  const availableIds = new Set(rows.map((scene) => scene.id));

  for (const sceneId of sceneIds) {
    if (!availableIds.has(sceneId)) {
      throw new BackgroundSceneError("Selected background scene does not exist.", 400);
    }
  }
}
