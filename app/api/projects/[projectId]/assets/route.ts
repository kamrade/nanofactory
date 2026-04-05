import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";
import {
  AssetUploadError,
  getAssetsByProjectIdForUser,
  uploadAssetForProject,
} from "@/lib/assets";

type AssetRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

type PostAssetDependencies = {
  uploadAssetForProject: typeof uploadAssetForProject;
};

const postAssetDependencies: PostAssetDependencies = {
  uploadAssetForProject,
};

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: AssetRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId } = await params;
  const assets = await getAssetsByProjectIdForUser(projectId, session.user.id);

  return NextResponse.json({ assets });
}

export async function POST(request: Request, { params }: AssetRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const { projectId } = await params;

  return postAssetWithDependencies(projectId, session.user.id, file, postAssetDependencies);
}

export async function postAssetWithDependencies(
  projectId: string,
  userId: string,
  file: File,
  dependencies: PostAssetDependencies
) {
  try {
    const asset = await dependencies.uploadAssetForProject({
      projectId,
      userId,
      file,
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    if (error instanceof AssetUploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Asset upload failed", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "NoSuchBucket"
    ) {
      return NextResponse.json(
        {
          error:
            "R2 bucket was not found. Check R2_BUCKET_NAME and whether R2_ENDPOINT matches the bucket jurisdiction.",
        },
        { status: 500 }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "AccessDenied"
    ) {
      return NextResponse.json(
        {
          error:
            "R2 rejected the request. Check R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and bucket permissions.",
        },
        { status: 500 }
      );
    }

    if (process.env.NODE_ENV !== "production" && error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
