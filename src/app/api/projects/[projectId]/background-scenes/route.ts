import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/auth";

type BackgroundScenesRouteProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: BackgroundScenesRouteProps) {
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

export async function POST(request: Request, { params }: BackgroundScenesRouteProps) {
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
