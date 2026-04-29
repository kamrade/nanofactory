import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { BackgroundLibraryManager } from "@/components/assets/background-library-manager";
import type { BackgroundSceneListItem } from "@/components/assets/types";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { requireAdminByUserId, RoleGuardError } from "@/lib/auth/roles";
import { getBackgroundSceneLibrary } from "@/lib/background-scene-library";
import {
  UI_MODE_COOKIE,
  UI_THEME_COOKIE,
  resolveModePreference,
  resolveThemePreference,
} from "@/lib/ui-preferences";

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
  const cookieStore = await cookies();
  const themeKey = resolveThemePreference(cookieStore.get(UI_THEME_COOKIE)?.value);
  const mode = resolveModePreference(cookieStore.get(UI_MODE_COOKIE)?.value);

  return (
    <main className="min-h-screen bg-bg py-6 text-text-main">
      <div className="mx-auto flex container px-4 flex-col gap-6">
        <BackgroundLibraryManager
          initialScenes={initialScenes}
          themeKey={themeKey}
          mode={mode}
        />
      </div>
    </main>
  );
}
