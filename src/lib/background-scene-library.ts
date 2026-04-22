import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { backgroundSceneLibrary } from "@/db/schema";
import { requireAdminByUserId } from "@/lib/auth/roles";
import { validateBackgroundScene } from "@/lib/background-scenes/schema";
import type {
  BackgroundScene,
  BackgroundSceneLibraryRecord,
} from "@/lib/background-scenes/types";

export class BackgroundSceneLibraryError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "BackgroundSceneLibraryError";
    this.status = status;
  }
}

type CreateLibrarySceneInput = {
  actorUserId: string;
  name: string;
  sceneJson: BackgroundScene;
};

type UpdateLibrarySceneInput = {
  actorUserId: string;
  sceneId: string;
  name: string;
  sceneJson: BackgroundScene;
};

function normalizeName(rawName: string, fallback: string) {
  const trimmed = rawName.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

export async function getBackgroundSceneLibrary(): Promise<BackgroundSceneLibraryRecord[]> {
  return db
    .select({
      id: backgroundSceneLibrary.id,
      name: backgroundSceneLibrary.name,
      sceneJson: backgroundSceneLibrary.sceneJson,
      createdByUserId: backgroundSceneLibrary.createdByUserId,
      sourceProjectId: backgroundSceneLibrary.sourceProjectId,
      createdAt: backgroundSceneLibrary.createdAt,
      updatedAt: backgroundSceneLibrary.updatedAt,
    })
    .from(backgroundSceneLibrary)
    .orderBy(desc(backgroundSceneLibrary.updatedAt), desc(backgroundSceneLibrary.createdAt));
}

export async function getBackgroundSceneLibraryById(
  sceneId: string
): Promise<BackgroundSceneLibraryRecord | null> {
  const [scene] = await db
    .select({
      id: backgroundSceneLibrary.id,
      name: backgroundSceneLibrary.name,
      sceneJson: backgroundSceneLibrary.sceneJson,
      createdByUserId: backgroundSceneLibrary.createdByUserId,
      sourceProjectId: backgroundSceneLibrary.sourceProjectId,
      createdAt: backgroundSceneLibrary.createdAt,
      updatedAt: backgroundSceneLibrary.updatedAt,
    })
    .from(backgroundSceneLibrary)
    .where(eq(backgroundSceneLibrary.id, sceneId))
    .limit(1);

  return scene ?? null;
}

export async function createBackgroundSceneLibraryItem(
  input: CreateLibrarySceneInput
): Promise<BackgroundSceneLibraryRecord> {
  await requireAdminByUserId(input.actorUserId);

  const validated = validateBackgroundScene(input.sceneJson);
  if (!validated) {
    throw new BackgroundSceneLibraryError("Invalid background scene payload.", 400);
  }

  const [scene] = await db
    .insert(backgroundSceneLibrary)
    .values({
      name: normalizeName(input.name, validated.name),
      sceneJson: validated,
      createdByUserId: input.actorUserId,
      sourceProjectId: null,
    })
    .returning({
      id: backgroundSceneLibrary.id,
      name: backgroundSceneLibrary.name,
      sceneJson: backgroundSceneLibrary.sceneJson,
      createdByUserId: backgroundSceneLibrary.createdByUserId,
      sourceProjectId: backgroundSceneLibrary.sourceProjectId,
      createdAt: backgroundSceneLibrary.createdAt,
      updatedAt: backgroundSceneLibrary.updatedAt,
    });

  if (!scene) {
    throw new BackgroundSceneLibraryError("Failed to create scene.", 500);
  }

  return scene;
}

export async function updateBackgroundSceneLibraryItem(
  input: UpdateLibrarySceneInput
): Promise<BackgroundSceneLibraryRecord> {
  await requireAdminByUserId(input.actorUserId);

  const validated = validateBackgroundScene(input.sceneJson);
  if (!validated) {
    throw new BackgroundSceneLibraryError("Invalid background scene payload.", 400);
  }

  const [scene] = await db
    .update(backgroundSceneLibrary)
    .set({
      name: normalizeName(input.name, validated.name),
      sceneJson: validated,
      updatedAt: new Date(),
    })
    .where(eq(backgroundSceneLibrary.id, input.sceneId))
    .returning({
      id: backgroundSceneLibrary.id,
      name: backgroundSceneLibrary.name,
      sceneJson: backgroundSceneLibrary.sceneJson,
      createdByUserId: backgroundSceneLibrary.createdByUserId,
      sourceProjectId: backgroundSceneLibrary.sourceProjectId,
      createdAt: backgroundSceneLibrary.createdAt,
      updatedAt: backgroundSceneLibrary.updatedAt,
    });

  if (!scene) {
    throw new BackgroundSceneLibraryError("Background scene not found.", 404);
  }

  return scene;
}

export async function deleteBackgroundSceneLibraryItem(actorUserId: string, sceneId: string) {
  await requireAdminByUserId(actorUserId);

  const [scene] = await db
    .delete(backgroundSceneLibrary)
    .where(eq(backgroundSceneLibrary.id, sceneId))
    .returning({
      id: backgroundSceneLibrary.id,
    });

  if (!scene) {
    throw new BackgroundSceneLibraryError("Background scene not found.", 404);
  }

  return scene;
}
