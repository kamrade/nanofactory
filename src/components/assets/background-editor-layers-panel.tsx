"use client";

import { UIButton } from "@/components/ui/button";
import { UICheckbox } from "@/components/ui/checkbox";
import type { EffectType } from "@/components/assets/background-editor-shared";
import { effectOptions } from "@/components/assets/background-editor-shared";
import type { BackgroundSceneLayer } from "@/lib/background-scenes/types";

type BackgroundEditorLayersPanelProps = {
  layers: BackgroundSceneLayer[];
  selectedLayerId: string;
  onLayerSelect: (layerId: string) => void;
  onAddEffect: (type: EffectType) => void;
  onToggleVisibility: (layerId: string) => void;
  onDuplicateLayer: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
};

export function BackgroundEditorLayersPanel({
  layers,
  selectedLayerId,
  onLayerSelect,
  onAddEffect,
  onToggleVisibility,
  onDuplicateLayer,
  onDeleteLayer,
}: BackgroundEditorLayersPanelProps) {
  return (
    <aside className="grid h-fit gap-3 rounded-2xl border border-line bg-surface p-4">
      <div className="grid gap-2">
        <h4 className="text-sm font-semibold text-text-main">Layers</h4>
        <div className="flex flex-wrap gap-2">
          {effectOptions.map((option) => (
            <UIButton
              key={option.key}
              type="button"
              theme="base"
              variant="outlined"
              size="sm"
              onClick={() => onAddEffect(option.key)}
            >
              + {option.label}
            </UIButton>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        {layers.map((layer) => {
          const selected = selectedLayerId === layer.id;
          return (
            <div
              key={layer.id}
              className={
                selected
                  ? "grid gap-2 rounded-xl border border-focus bg-surface p-3 ring-2 ring-focus/20"
                  : "grid gap-2 rounded-xl border border-line bg-surface-alt p-3 transition hover:border-text-placeholder hover:bg-surface"
              }
            >
              <button
                type="button"
                className="rounded-lg text-left text-sm font-medium text-text-main outline-none transition focus-visible:ring-2 focus-visible:ring-focus/50"
                onClick={() => onLayerSelect(layer.id)}
              >
                {layer.name}
              </button>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <UICheckbox
                  checked={layer.visible}
                  onChange={() => onToggleVisibility(layer.id)}
                  label="Visible"
                  className="text-xs text-text-muted"
                />
                <div className="flex items-center gap-1">
                  <UIButton
                    type="button"
                    theme="base"
                    variant="outlined"
                    size="sm"
                    onClick={() => onDuplicateLayer(layer.id)}
                  >
                    Duplicate
                  </UIButton>
                  <UIButton
                    type="button"
                    theme="danger"
                    variant="outlined"
                    size="sm"
                    disabled={layers.length <= 1}
                    onClick={() => onDeleteLayer(layer.id)}
                  >
                    Delete
                  </UIButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
