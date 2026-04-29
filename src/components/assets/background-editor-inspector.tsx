"use client";

import type { BackgroundDefaultsPalette } from "@/components/assets/background-scene-defaults";
import { UIButton } from "@/components/ui/button";
import { clamp } from "@/components/assets/background-editor-shared";
import { LayerTypeControls } from "@/components/assets/background-editor-layer-controls";
import { UISelect } from "@/components/ui/select";
import type { BackgroundSceneLayer } from "@/lib/background-scenes/types";

type BackgroundEditorInspectorProps = {
  colorChoices: BackgroundDefaultsPalette["colorChoices"];
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
  colorChoices,
  canvasBackgroundColor,
  onCanvasBackgroundColorChange,
  selectedLayer,
  selectedLayerCss,
  onResetSelectedLayer,
  onUpdateSelectedLayer,
}: BackgroundEditorInspectorProps) {
  function buildColorOptions(currentColor?: string) {
    const hasCurrent = currentColor
      ? colorChoices.some((option) => option.value === currentColor)
      : true;
    const values =
      currentColor && !hasCurrent
        ? [{ token: "Custom", value: currentColor }, ...colorChoices]
        : colorChoices;

    return values.map((option) => ({
      value: option.value,
      textValue: option.value,
      label: (
        <span className="inline-flex items-center gap-2">
          <span
            className="h-3.5 w-3.5 rounded-full border border-line"
            style={{ backgroundColor: option.value }}
          />
          <span>{option.token} ({option.value})</span>
        </span>
      ),
    }));
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-line bg-surface p-4">
      <h4 className="text-sm font-semibold text-text-main">Inspector</h4>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Global background color</span>
        <UISelect
          ariaLabel="Global background color"
          size="sm"
          value={canvasBackgroundColor}
          onValueChange={onCanvasBackgroundColorChange}
          options={buildColorOptions(canvasBackgroundColor)}
        />
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
            colorChoices={colorChoices}
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
                className="w-full accent-primary-300 outline-none focus-visible:ring-2 focus-visible:ring-focus/40 focus-visible:rounded-lg"
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
