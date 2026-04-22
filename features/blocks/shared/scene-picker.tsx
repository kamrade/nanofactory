"use client";

import { UIButton } from "@/components/ui/button";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";

type ScenePickerProps = {
  scenes: BackgroundSceneRecord[];
  selectedSceneId?: string;
  onSelect: (sceneId: string) => void;
  onClear: () => void;
  title: string;
  description: string;
  emptyMessage: string;
};

export function ScenePicker({
  scenes,
  selectedSceneId,
  onSelect,
  onClear,
  title,
  description,
  emptyMessage,
}: ScenePickerProps) {
  const selectedScene = scenes.find((scene) => scene.id === selectedSceneId) ?? null;

  return (
    <div className="grid gap-3">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-text-main">{title}</h4>
        <p className="text-sm text-text-muted">{description}</p>
      </div>

      {scenes.length === 0 ? (
        <p className="text-sm text-text-muted">{emptyMessage}</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {scenes.map((scene) => {
            const selected = selectedSceneId === scene.id;
            return (
              <article
                key={scene.id}
                className={
                  selected
                    ? "grid gap-3 rounded-2xl border border-focus bg-surface p-3"
                    : "grid gap-3 rounded-2xl border border-line bg-surface p-3"
                }
              >
                <div className="overflow-hidden rounded-xl border border-line bg-surface-alt">
                  <div className="aspect-[1200/630] w-full" style={buildBackgroundSceneStyle(scene.sceneJson)} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-main">{scene.name}</p>
                    <p className="text-xs text-text-muted">{scene.sceneJson.layers.length} layer(s)</p>
                  </div>
                  <UIButton
                    type="button"
                    theme={selected ? "primary" : "base"}
                    variant={selected ? "contained" : "outlined"}
                    size="sm"
                    onClick={() => onSelect(scene.id)}
                  >
                    {selected ? "Selected" : "Use"}
                  </UIButton>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedScene ? (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface-alt px-4 py-3 text-sm text-text-muted">
          <span>Selected scene: {selectedScene.name}</span>
          <UIButton type="button" theme="base" variant="outlined" size="sm" onClick={onClear}>
            Remove background
          </UIButton>
        </div>
      ) : null}
    </div>
  );
}
