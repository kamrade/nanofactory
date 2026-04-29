"use client";

import { useCallback, useMemo, useState } from "react";

import {
  type BackgroundDefaultsPalette,
  createDefaultBackgroundScene,
  createDefaultDotsLayer,
  createDefaultGlowLayer,
  createDefaultGradientLayer,
  createDefaultGridLayer,
  createDefaultNoiseLayer,
  createDefaultStripesLayer,
  getBackgroundDefaultsPalette,
} from "@/components/assets/background-scene-defaults";
import {
  createLayerByType,
  createLayerId,
  getLayerCssSnippet,
  normalizeHex,
  type EffectType,
} from "@/components/assets/background-editor-shared";
import type { BackgroundScene, BackgroundSceneLayer } from "@/lib/background-scenes/types";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";

type BackgroundDefaultsInput = {
  themeKey: ThemeKey;
  mode: UiMode;
};

type UseBackgroundEditorStateResult = {
  scene: BackgroundScene;
  colorChoices: BackgroundDefaultsPalette["colorChoices"];
  selectedLayerId: string;
  selectedLayer: BackgroundSceneLayer | null;
  prettyJson: string;
  selectedLayerCss: string;
  setSelectedLayerId: (layerId: string) => void;
  updateSceneName: (name: string) => void;
  updateCanvasColor: (nextColor: string) => void;
  addEffect: (type: EffectType) => void;
  duplicateLayer: (layerId: string) => void;
  deleteLayer: (layerId: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  updateSelectedLayer: (
    updater: (layer: BackgroundSceneLayer) => BackgroundSceneLayer
  ) => void;
  resetScene: () => void;
  replaceScene: (nextScene: BackgroundScene) => void;
  syncScenePalette: (
    previousColorChoices?: BackgroundDefaultsPalette["colorChoices"]
  ) => void;
  resetSelectedLayer: () => void;
};

export function useBackgroundEditorState(
  initialScene: BackgroundScene | undefined,
  defaultsInput: BackgroundDefaultsInput
): UseBackgroundEditorStateResult {
  const defaultsPalette = useMemo(
    () =>
      getBackgroundDefaultsPalette({
        themeKey: defaultsInput.themeKey,
        mode: defaultsInput.mode,
      }),
    [defaultsInput.themeKey, defaultsInput.mode]
  );
  const [scene, setScene] = useState<BackgroundScene>(
    () => initialScene ?? createDefaultBackgroundScene(defaultsInput)
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string>(scene.layers[0]?.id ?? "");

  const selectedLayer = useMemo(
    () => scene.layers.find((layer) => layer.id === selectedLayerId) ?? null,
    [scene.layers, selectedLayerId]
  );
  const prettyJson = useMemo(() => JSON.stringify(scene, null, 2), [scene]);
  const selectedLayerCss = useMemo(
    () => (selectedLayer ? getLayerCssSnippet(selectedLayer) : ""),
    [selectedLayer]
  );

  function updateSceneName(name: string) {
    setScene((current) => ({ ...current, name }));
  }

  function updateCanvasColor(nextColor: string) {
    setScene((current) => ({
      ...current,
      canvas: {
        ...current.canvas,
        backgroundColor: normalizeHex(nextColor, current.canvas.backgroundColor),
      },
    }));
  }

  function addEffect(type: EffectType) {
    const layer = createLayerByType(type, defaultsPalette);
    setScene((current) => ({
      ...current,
      layers: [...current.layers, layer],
    }));
    setSelectedLayerId(layer.id);
  }

  function duplicateLayer(layerId: string) {
    const layer = scene.layers.find((item) => item.id === layerId);
    if (!layer) {
      return;
    }

    const duplicate: BackgroundSceneLayer = {
      ...layer,
      id: createLayerId(),
      name: `${layer.name} copy`,
    };

    setScene((current) => ({
      ...current,
      layers: [...current.layers, duplicate],
    }));
    setSelectedLayerId(duplicate.id);
  }

  function deleteLayer(layerId: string) {
    const fallback = scene.layers.find((layer) => layer.id !== layerId);

    setScene((current) => ({
      ...current,
      layers: current.layers.filter((layer) => layer.id !== layerId),
    }));
    setSelectedLayerId((current) => (current === layerId ? fallback?.id ?? "" : current));
  }

  function toggleLayerVisibility(layerId: string) {
    setScene((current) => ({
      ...current,
      layers: current.layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      ),
    }));
  }

  function updateSelectedLayer(
    updater: (layer: BackgroundSceneLayer) => BackgroundSceneLayer
  ) {
    if (!selectedLayer) {
      return;
    }

    setScene((current) => ({
      ...current,
      layers: current.layers.map((layer) =>
        layer.id === selectedLayer.id ? updater(layer) : layer
      ),
    }));
  }

  function resetScene() {
    const next = initialScene ?? createDefaultBackgroundScene(defaultsInput);
    setScene(next);
    setSelectedLayerId(next.layers[0]?.id ?? "");
  }

  function replaceScene(nextScene: BackgroundScene) {
    setScene(nextScene);
    setSelectedLayerId(nextScene.layers[0]?.id ?? "");
  }

  const syncScenePalette = useCallback((
    previousColorChoices?: BackgroundDefaultsPalette["colorChoices"]
  ) => {
    function mapByToken(
      currentValue: string,
      fallbackValue: string
    ) {
      if (!previousColorChoices || previousColorChoices.length === 0) {
        return fallbackValue;
      }

      const previousMatch = previousColorChoices.find(
        (option) => option.value === currentValue
      );

      if (!previousMatch) {
        return fallbackValue;
      }

      const nextMatch = defaultsPalette.colorChoices.find(
        (option) => option.token === previousMatch.token
      );

      return nextMatch?.value ?? fallbackValue;
    }

    setScene((current) => ({
      ...current,
      canvas: {
        ...current.canvas,
        backgroundColor: mapByToken(
          current.canvas.backgroundColor,
          defaultsPalette.canvasBackgroundColor
        ),
      },
      layers: current.layers.map((layer) => {
        if (layer.type === "stripes") {
          return {
            ...layer,
            config: {
              ...layer.config,
              stripeColor: mapByToken(
                layer.config.stripeColor,
                defaultsPalette.layerForegroundColor
              ),
            },
          };
        }
        if (layer.type === "dots") {
          return {
            ...layer,
            config: {
              ...layer.config,
              dotColor: mapByToken(
                layer.config.dotColor,
                defaultsPalette.layerForegroundColor
              ),
            },
          };
        }
        if (layer.type === "grid") {
          return {
            ...layer,
            config: {
              ...layer.config,
              lineColor: mapByToken(
                layer.config.lineColor,
                defaultsPalette.layerForegroundColor
              ),
            },
          };
        }
        if (layer.type === "gradient") {
          return {
            ...layer,
            config: {
              ...layer.config,
              colorA: mapByToken(layer.config.colorA, defaultsPalette.gradientA),
              colorB: mapByToken(layer.config.colorB, defaultsPalette.gradientB),
            },
          };
        }
        if (layer.type === "glow") {
          return {
            ...layer,
            config: {
              ...layer.config,
              glowColor: mapByToken(
                layer.config.glowColor,
                defaultsPalette.layerForegroundColor
              ),
            },
          };
        }
        return layer;
      }),
    }));
  }, [
    defaultsPalette.canvasBackgroundColor,
    defaultsPalette.layerForegroundColor,
    defaultsPalette.gradientA,
    defaultsPalette.gradientB,
    defaultsPalette.colorChoices,
  ]);

  function resetSelectedLayer() {
    if (!selectedLayer) {
      return;
    }

    updateSelectedLayer((layer) => {
      if (layer.type === "stripes") {
        const defaults = createDefaultStripesLayer(defaultsPalette);
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }
      if (layer.type === "dots") {
        const defaults = createDefaultDotsLayer(defaultsPalette);
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }
      if (layer.type === "grid") {
        const defaults = createDefaultGridLayer(defaultsPalette);
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }
      if (layer.type === "gradient") {
        const defaults = createDefaultGradientLayer(defaultsPalette);
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }
      if (layer.type === "glow") {
        const defaults = createDefaultGlowLayer(defaultsPalette);
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }

      const defaults = createDefaultNoiseLayer();
      return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
    });
  }

  return {
    scene,
    colorChoices: defaultsPalette.colorChoices,
    selectedLayerId,
    selectedLayer,
    prettyJson,
    selectedLayerCss,
    setSelectedLayerId,
    updateSceneName,
    updateCanvasColor,
    addEffect,
    duplicateLayer,
    deleteLayer,
    toggleLayerVisibility,
    updateSelectedLayer,
    resetScene,
    replaceScene,
    syncScenePalette,
    resetSelectedLayer,
  };
}
