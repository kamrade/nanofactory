import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { assets, projects } from "@/db/schema";
import {
  buildPublicAssetUrl,
  buildStorageKey,
  deleteObject,
  putObject,
} from "@/lib/storage/service";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

const allowedMimeTypes = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
} as const;

type AllowedMimeType = keyof typeof allowedMimeTypes;
export type AssetKind = "image";

type CreateAssetInput = {
  projectId: string;
  kind: AssetKind;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
};

export type ProjectAssetRecord = {
  id: string;
  projectId: string;
  kind: AssetKind;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  createdAt: Date;
  updatedAt: Date;
  publicUrl: string;
};

export class AssetUploadError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "AssetUploadError";
    this.status = status;
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function normalizeFilename(filename: string) {
  return filename.trim().replace(/[^\w.\- ]+/g, "");
}

function getFilenameExtension(filename: string) {
  const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
  return match?.[1]?.toLowerCase() ?? "";
}

export function validateAssetFile(file: File) {
  const originalFilename = normalizeFilename(file.name);

  if (!originalFilename) {
    throw new AssetUploadError("File name is required.");
  }

  if (file.size <= 0) {
    throw new AssetUploadError("File is empty.");
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new AssetUploadError("File exceeds the 10 MB size limit.");
  }

  if (!file.type) {
    throw new AssetUploadError("File MIME type is required.");
  }

  if (!(file.type in allowedMimeTypes)) {
    throw new AssetUploadError("Unsupported file type. Allowed: JPEG, PNG, WEBP.");
  }

  const mimeType = file.type as AllowedMimeType;
  const extension = getFilenameExtension(originalFilename);

  if (!extension) {
    throw new AssetUploadError("File extension is required.");
  }

  if (!(allowedMimeTypes[mimeType] as readonly string[]).includes(extension)) {
    throw new AssetUploadError("File extension does not match MIME type.");
  }

  return {
    originalFilename,
    mimeType,
    extension,
    sizeBytes: file.size,
  };
}

async function ensureProjectOwner(projectId: string, userId: string) {
  if (!isUuid(projectId)) {
    throw new AssetUploadError("Project not found.", 404);
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
    throw new AssetUploadError("Project not found.", 404);
  }

  return project;
}

export async function createAssetForProject(
  input: CreateAssetInput
): Promise<ProjectAssetRecord> {
  const [asset] = await db
    .insert(assets)
    .values({
      projectId: input.projectId,
      kind: input.kind,
      storageKey: input.storageKey,
      originalFilename: input.originalFilename,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      width: input.width ?? null,
      height: input.height ?? null,
      alt: input.alt ?? null,
    })
    .returning({
      id: assets.id,
      projectId: assets.projectId,
      kind: assets.kind,
      storageKey: assets.storageKey,
      originalFilename: assets.originalFilename,
      mimeType: assets.mimeType,
      sizeBytes: assets.sizeBytes,
      width: assets.width,
      height: assets.height,
      alt: assets.alt,
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
    });

  return {
    ...asset,
    kind: "image" as const,
    publicUrl: buildPublicAssetUrl(asset.storageKey),
  };
}

export async function getAssetsByProjectIdForUser(
  projectId: string,
  userId: string
): Promise<ProjectAssetRecord[]> {
  if (!isUuid(projectId)) {
    return [];
  }

  const rows = await db
    .select({
      id: assets.id,
      projectId: assets.projectId,
      kind: assets.kind,
      storageKey: assets.storageKey,
      originalFilename: assets.originalFilename,
      mimeType: assets.mimeType,
      sizeBytes: assets.sizeBytes,
      width: assets.width,
      height: assets.height,
      alt: assets.alt,
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
    })
    .from(assets)
    .innerJoin(projects, eq(projects.id, assets.projectId))
    .where(and(eq(assets.projectId, projectId), eq(projects.userId, userId)))
    .orderBy(desc(assets.createdAt), desc(assets.updatedAt));

  return rows.map((asset) => ({
    ...asset,
    kind: "image" as const,
    publicUrl: buildPublicAssetUrl(asset.storageKey),
  }));
}

export async function getAssetsByProjectId(projectId: string): Promise<ProjectAssetRecord[]> {
  if (!isUuid(projectId)) {
    return [];
  }

  const rows = await db
    .select({
      id: assets.id,
      projectId: assets.projectId,
      kind: assets.kind,
      storageKey: assets.storageKey,
      originalFilename: assets.originalFilename,
      mimeType: assets.mimeType,
      sizeBytes: assets.sizeBytes,
      width: assets.width,
      height: assets.height,
      alt: assets.alt,
      createdAt: assets.createdAt,
      updatedAt: assets.updatedAt,
    })
    .from(assets)
    .where(eq(assets.projectId, projectId))
    .orderBy(desc(assets.createdAt), desc(assets.updatedAt));

  return rows.map((asset) => ({
    ...asset,
    kind: "image" as const,
    publicUrl: buildPublicAssetUrl(asset.storageKey),
  }));
}

export async function validateAssetReferencesForProject(
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
  const heroAssetIds = content.blocks
    .filter((block) => block.type === "hero")
    .map((block) => block.props.imageAssetId)
    .filter((assetId): assetId is string => typeof assetId === "string" && assetId.trim().length > 0);
  const referencedAssetIds = [...heroAssetIds];

  if (referencedAssetIds.length === 0) {
    return;
  }

  await ensureProjectOwner(projectId, userId);

  const projectAssets = await getAssetsByProjectIdForUser(projectId, userId);
  const assetsById = new Map(projectAssets.map((asset) => [asset.id, asset] as const));

  for (const assetId of referencedAssetIds) {
    if (!assetsById.has(assetId)) {
      throw new AssetUploadError("Selected asset does not belong to this project.", 400);
    }
  }
}

// Backward-compatible alias for existing tests/integration points.
export async function validateHeroAssetReferencesForProject(
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
  return validateAssetReferencesForProject(projectId, userId, content);
}

export async function uploadAssetForProject(input: {
  projectId: string;
  userId: string;
  file: File;
}) {
  await ensureProjectOwner(input.projectId, input.userId);

  const validatedFile = validateAssetFile(input.file);
  const storageKey = buildStorageKey({
    projectId: input.projectId,
    extension: validatedFile.extension,
  });
  const fileBuffer = Buffer.from(await input.file.arrayBuffer());

  await putObject({
    storageKey,
    body: fileBuffer,
    contentType: validatedFile.mimeType,
    contentDisposition: `inline; filename="${validatedFile.originalFilename}"`,
  });

  try {
    return await createAssetForProject({
      projectId: input.projectId,
      kind: "image",
      storageKey,
      originalFilename: validatedFile.originalFilename,
      mimeType: validatedFile.mimeType,
      sizeBytes: validatedFile.sizeBytes,
      width: null,
      height: null,
      alt: null,
    });
  } catch (error) {
    try {
      await deleteObject(storageKey);
    } catch (cleanupError) {
      console.error("Failed to clean up uploaded object after DB error", cleanupError);
    }
    throw error;
  }
}
