import "server-only";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";

import { getStorageClient } from "@/lib/storage/client";
import { getStorageConfig } from "@/lib/storage/config";
import { buildStorageKey } from "@/lib/storage/keys";
import { buildPublicAssetUrl } from "@/lib/storage/urls";

type PutObjectInput = {
  storageKey: string;
  body: NonNullable<PutObjectCommandInput["Body"]>;
  contentType?: string;
  cacheControl?: string;
  contentDisposition?: string;
};

export async function putObject(input: PutObjectInput) {
  const config = getStorageConfig();
  const client = getStorageClient();

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: input.storageKey,
      Body: input.body,
      ContentType: input.contentType,
      CacheControl: input.cacheControl,
      ContentDisposition: input.contentDisposition,
    })
  );

  return {
    storageKey: input.storageKey,
    publicUrl: buildPublicAssetUrl(input.storageKey),
  };
}

export async function deleteObject(storageKey: string) {
  const config = getStorageConfig();
  const client = getStorageClient();

  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: storageKey,
    })
  );
}

export { buildStorageKey, buildPublicAssetUrl };
