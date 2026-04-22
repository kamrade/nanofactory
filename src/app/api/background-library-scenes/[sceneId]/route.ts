import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";
import {
  BackgroundSceneLibraryError,
  deleteBackgroundSceneLibraryItem,
  getBackgroundSceneLibraryById,
  updateBackgroundSceneLibraryItem,
} from "@/lib/background-scene-library";
import { validateBackgroundScene } from "@/lib/background-scenes/schema";

type BackgroundLibrarySceneRouteProps = {
  params: Promise<{
    sceneId: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: BackgroundLibrarySceneRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { sceneId } = await params;
  const scene = await getBackgroundSceneLibraryById(sceneId);

  if (!scene) {
    return NextResponse.json({ error: "Background scene not found." }, { status: 404 });
  }

  return NextResponse.json({ scene });
}

export async function PATCH(request: Request, { params }: BackgroundLibrarySceneRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { sceneId } = await params;
    const payload = (await request.json()) as {
      name?: string;
      sceneJson?: unknown;
    };
    const validatedScene = validateBackgroundScene(payload.sceneJson);

    if (!validatedScene) {
      return NextResponse.json(
        { error: "Invalid background scene payload." },
        { status: 400 }
      );
    }

    const updated = await updateBackgroundSceneLibraryItem({
      actorUserId: session.user.id,
      sceneId,
      name:
        typeof payload.name === "string" && payload.name.trim().length > 0
          ? payload.name
          : validatedScene.name,
      sceneJson: validatedScene,
    });

    return NextResponse.json({ scene: updated });
  } catch (error) {
    if (error instanceof BackgroundSceneLibraryError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Background library scene update failed", error);
    return NextResponse.json(
      { error: "Failed to update library background scene." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: BackgroundLibrarySceneRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { sceneId } = await params;
    await deleteBackgroundSceneLibraryItem(session.user.id, sceneId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof BackgroundSceneLibraryError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Background library scene delete failed", error);
    return NextResponse.json(
      { error: "Failed to delete library background scene." },
      { status: 500 }
    );
  }
}
