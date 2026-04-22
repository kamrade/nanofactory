import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";

type BackgroundSceneRouteProps = {
  params: Promise<{
    projectId: string;
    sceneId: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: BackgroundSceneRouteProps) {
  void params;
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Background scene project endpoints are deprecated." },
    { status: 410 }
  );
}

export async function PATCH(request: Request, { params }: BackgroundSceneRouteProps) {
  void request;
  void params;
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Background scene editing was moved to the global library." },
    { status: 410 }
  );
}

export async function DELETE(_request: Request, { params }: BackgroundSceneRouteProps) {
  void params;
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(
    { error: "Background scene editing was moved to the global library." },
    { status: 410 }
  );
}
