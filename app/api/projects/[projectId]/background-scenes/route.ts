import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";
import {
  BackgroundSceneError,
  createBackgroundSceneForProject,
  getBackgroundScenesByProjectIdForUser,
} from "@/lib/background-scenes";
import { validateBackgroundScene } from "@/lib/background-scenes/schema";

type BackgroundScenesRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: BackgroundScenesRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId } = await params;
  const scenes = await getBackgroundScenesByProjectIdForUser(projectId, session.user.id);

  return NextResponse.json({ scenes });
}

export async function POST(request: Request, { params }: BackgroundScenesRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { projectId } = await params;
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

    const created = await createBackgroundSceneForProject({
      projectId,
      name:
        typeof payload.name === "string" && payload.name.trim().length > 0
          ? payload.name
          : validatedScene.name,
      sceneJson: validatedScene,
    });

    return NextResponse.json({ scene: created }, { status: 201 });
  } catch (error) {
    if (error instanceof BackgroundSceneError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Background scene create failed", error);
    return NextResponse.json({ error: "Failed to create background scene." }, { status: 500 });
  }
}
