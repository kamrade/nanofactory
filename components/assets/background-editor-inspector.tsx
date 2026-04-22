"use client";

import { UIButton } from "@/components/ui/button";
import { clamp } from "@/components/assets/background-editor-shared";
import { LayerTypeControls } from "@/components/assets/background-editor-layer-controls";
import type { BackgroundSceneLayer } from "@/lib/background-scenes/types";

type BackgroundEditorInspectorProps = {
  canvasBackgroundColor: string;
  onCanvasBackgroundColorChange: (nextColor: string) => void;
  selectedLayer: BackgroundSceneLayer | null;
  selectedLayerCss: string;
  onResetSelectedLayer: () => void;
  onUpdateSelectedLayer: (
    updater: (layer: BackgroundSceneLayer) => BackgroundSceneLayer
  ) => void;
};

export function BackgroundEditorInspector({
  canvasBackgroundColor,
  onCanvasBackgroundColorChange,
  selectedLayer,
  selectedLayerCss,
  onResetSelectedLayer,
  onUpdateSelectedLayer,
}: BackgroundEditorInspectorProps) {
  return (
    <div className="grid gap-4 rounded-2xl border border-line bg-surface p-4">
      <h4 className="text-sm font-semibold text-text-main">Inspector</h4>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Global background color</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={canvasBackgroundColor}
            onChange={(event) => onCanvasBackgroundColorChange(event.target.value)}
            className="h-9 w-11 rounded border border-line bg-transparent p-1"
          />
          <input
            type="text"
            value={canvasBackgroundColor}
            onChange={(event) => onCanvasBackgroundColorChange(event.target.value)}
            className="w-full rounded-xl border border-line bg-surface-alt px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
          />
        </div>
      </label>

      {selectedLayer ? (
        <div className="grid gap-4 rounded-2xl border border-line bg-surface-alt p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-text-main">{selectedLayer.name}</p>
            <UIButton
              type="button"
              theme="base"
              variant="outlined"
              size="sm"
              onClick={onResetSelectedLayer}
            >
              Reset layer
            </UIButton>
          </div>

          <LayerTypeControls
            layer={selectedLayer}
            onUpdateSelectedLayer={onUpdateSelectedLayer}
          />

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-text-main">
              Opacity: {selectedLayer.opacity.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={selectedLayer.opacity}
                onChange={(event) =>
                  onUpdateSelectedLayer((layer) => ({
                    ...layer,
                    opacity: clamp(Number(event.target.value), 0, 1),
                  }))
                }
                className="w-full accent-primary-300"
              />
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={selectedLayer.opacity}
                onChange={(event) =>
                  onUpdateSelectedLayer((layer) => ({
                    ...layer,
                    opacity: clamp(Number(event.target.value || 0), 0, 1),
                  }))
                }
                className="w-20 rounded-xl border border-line bg-surface px-2 py-1.5 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
              />
            </div>
          </label>

          <div className="grid gap-1.5 rounded-xl border border-line bg-surface p-3">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-text-placeholder">
              Generated CSS
            </p>
            <code className="break-all text-xs text-text-main">{selectedLayerCss}</code>
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-muted">Select a layer to edit controls.</p>
      )}
    </div>
  );
}
