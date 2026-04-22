import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";
import {
  BackgroundSceneLibraryError,
  createBackgroundSceneLibraryItem,
  getBackgroundSceneLibrary,
} from "@/lib/background-scene-library";
import { validateBackgroundScene } from "@/lib/background-scenes/schema";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const scenes = await getBackgroundSceneLibrary();
  return NextResponse.json({ scenes });
}

export async function POST(request: Request) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
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

    const created = await createBackgroundSceneLibraryItem({
      actorUserId: session.user.id,
      name:
        typeof payload.name === "string" && payload.name.trim().length > 0
          ? payload.name
          : validatedScene.name,
      sceneJson: validatedScene,
    });

    return NextResponse.json({ scene: created }, { status: 201 });
  } catch (error) {
    if (error instanceof BackgroundSceneLibraryError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Background library scene create failed", error);
    return NextResponse.json(
      { error: "Failed to create library background scene." },
      { status: 500 }
    );
  }
}
