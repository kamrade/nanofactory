import { redirect } from "next/navigation";

import { BackgroundLibraryManager } from "@/components/assets/background-library-manager";
import type { BackgroundSceneListItem } from "@/components/assets/types";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { requireAdminByUserId, RoleGuardError } from "@/lib/auth/roles";
import { getBackgroundSceneLibrary } from "@/lib/background-scene-library";

function toListItem(
  scene: Awaited<ReturnType<typeof getBackgroundSceneLibrary>>[number]
): BackgroundSceneListItem {
  return {
    id: scene.id,
    projectId: scene.sourceProjectId,
    name: scene.name,
    sceneJson: scene.sceneJson,
    createdByUserId: scene.createdByUserId,
    sourceProjectId: scene.sourceProjectId,
    createdAt: scene.createdAt.toISOString(),
    updatedAt: scene.updatedAt.toISOString(),
  };
}

export default async function BackgroundLibraryPage() {
  const currentUser = await requireCurrentUser();

  try {
    await requireAdminByUserId(currentUser.id);
  } catch (error) {
    if (error instanceof RoleGuardError) {
      redirect("/dashboard");
    }
    throw error;
  }

  const scenes = await getBackgroundSceneLibrary();
  const initialScenes = scenes.map(toListItem);

  return (
    <main className="min-h-screen bg-bg px-4 py-6 text-text-main">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <BackgroundLibraryManager initialScenes={initialScenes} />
      </div>
    </main>
  );
}
