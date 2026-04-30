import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";
import { AssetUploadError, deleteAssetForProject } from "@/lib/assets";

type DeleteAssetRouteProps = {
  params: Promise<{
    projectId: string;
    assetId: string;
  }>;
};

export const runtime = "nodejs";

export async function DELETE(_request: Request, { params }: DeleteAssetRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId, assetId } = await params;

  try {
    const deletedAsset = await deleteAssetForProject({
      projectId,
      assetId,
      userId: session.user.id,
    });

    return NextResponse.json({ deletedAssetId: deletedAsset.id }, { status: 200 });
  } catch (error) {
    if (error instanceof AssetUploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Asset deletion failed", error);
    return NextResponse.json({ error: "Deletion failed." }, { status: 500 });
  }
}
