import "server-only";

export type StorageConfig = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  endpoint: string;
  publicBaseUrl: string;
};

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required storage env: ${name}`);
  }

  return value;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function normalizeUrl(name: string, value: string) {
  try {
    const url = new URL(value);
    return trimTrailingSlash(url.toString());
  } catch {
    throw new Error(`Invalid URL in storage env: ${name}`);
  }
}

let cachedStorageConfig: StorageConfig | null = null;

export function getStorageConfig(): StorageConfig {
  if (cachedStorageConfig) {
    return cachedStorageConfig;
  }

  const accountId = readRequiredEnv("R2_ACCOUNT_ID");
  const accessKeyId = readRequiredEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = readRequiredEnv("R2_SECRET_ACCESS_KEY");
  const bucketName = readRequiredEnv("R2_BUCKET_NAME");
  const endpoint = normalizeUrl(
    "R2_ENDPOINT",
    process.env.R2_ENDPOINT?.trim() || `https://${accountId}.r2.cloudflarestorage.com`
  );
  const publicBaseUrl = normalizeUrl(
    "R2_PUBLIC_BASE_URL",
    readRequiredEnv("R2_PUBLIC_BASE_URL")
  );

  cachedStorageConfig = {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    endpoint,
    publicBaseUrl,
  };

  return cachedStorageConfig;
}
