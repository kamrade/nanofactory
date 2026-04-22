import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { getServerAuthSession } from "@/auth";
import { db } from "@/db";
import { backgroundScenes, projects } from "@/db/schema";
import {
  BackgroundSceneError,
  deleteBackgroundSceneForProject,
  updateBackgroundSceneForProject,
} from "@/lib/background-scenes";
import { validateBackgroundScene } from "@/lib/background-scenes/schema";

type BackgroundSceneRouteProps = {
  params: Promise<{
    projectId: string;
    sceneId: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: BackgroundSceneRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { projectId, sceneId } = await params;

  const [scene] = await db
    .select({
      id: backgroundScenes.id,
      projectId: backgroundScenes.projectId,
      name: backgroundScenes.name,
      sceneJson: backgroundScenes.sceneJson,
      createdAt: backgroundScenes.createdAt,
      updatedAt: backgroundScenes.updatedAt,
    })
    .from(backgroundScenes)
    .innerJoin(projects, eq(projects.id, backgroundScenes.projectId))
    .where(
      and(
        eq(backgroundScenes.id, sceneId),
        eq(backgroundScenes.projectId, projectId),
        eq(projects.userId, session.user.id)
      )
    )
    .limit(1);

  if (!scene) {
    return NextResponse.json({ error: "Background scene not found." }, { status: 404 });
  }

  return NextResponse.json({ scene });
}

export async function PATCH(request: Request, { params }: BackgroundSceneRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { projectId, sceneId } = await params;
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

    const updated = await updateBackgroundSceneForProject({
      sceneId,
      projectId,
      userId: session.user.id,
      name:
        typeof payload.name === "string" && payload.name.trim().length > 0
          ? payload.name
          : validatedScene.name,
      sceneJson: validatedScene,
    });

    return NextResponse.json({ scene: updated });
  } catch (error) {
    if (error instanceof BackgroundSceneError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Background scene update failed", error);
    return NextResponse.json({ error: "Failed to update background scene." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: BackgroundSceneRouteProps) {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { projectId, sceneId } = await params;
    await deleteBackgroundSceneForProject(sceneId, projectId, session.user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof BackgroundSceneError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Background scene delete failed", error);
    return NextResponse.json({ error: "Failed to delete background scene." }, { status: 500 });
  }
}
