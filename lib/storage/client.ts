import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

import { getStorageConfig } from "@/lib/storage/config";

const globalForStorageClient = globalThis as typeof globalThis & {
  r2Client?: S3Client;
};

export function getStorageClient() {
  if (globalForStorageClient.r2Client) {
    return globalForStorageClient.r2Client;
  }

  const config = getStorageConfig();
  const client = new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  if (process.env.NODE_ENV !== "production") {
    globalForStorageClient.r2Client = client;
  }

  return client;
}
