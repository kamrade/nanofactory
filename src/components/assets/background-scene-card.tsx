"use client";

import type { ProjectBackgroundSceneListItem } from "@/components/assets/types";
import { UIModal } from "@/components/ui/modal";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";
import { formatUiDateTime } from "@/lib/ui-date-time";

type BackgroundSceneCardProps = {
  scene: ProjectBackgroundSceneListItem;
};

export function BackgroundSceneCard({ scene }: BackgroundSceneCardProps) {
  return (
    <UIModal
      size="lg"
      title={scene.name}
      description="Background details"
      trigger={
        <button
          type="button"
          className="col-span-1 overflow-hidden rounded-2xl border border-line bg-surface-alt transition hover:border-text-placeholder"
        >
          <div className="aspect-[1200/630] w-full" style={buildBackgroundSceneStyle(scene.sceneJson)} />
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
          <div className="aspect-[1200/630] w-full" style={buildBackgroundSceneStyle(scene.sceneJson)} />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-text-placeholder">Scene ID: {scene.id}</p>
          <p className="text-sm text-text-placeholder">Layers: {scene.sceneJson.layers.length}</p>
          <p className="text-sm text-text-placeholder">
            Canvas: {scene.sceneJson.canvas.width} x {scene.sceneJson.canvas.height}
          </p>
          <p className="text-sm text-text-placeholder">Created: {formatUiDateTime(scene.createdAt)}</p>
          <p className="text-sm text-text-placeholder">Updated: {formatUiDateTime(scene.updatedAt)}</p>
        </div>
      </div>
    </UIModal>
  );
}
