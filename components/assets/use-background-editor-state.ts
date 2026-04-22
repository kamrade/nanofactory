"use client";

import { useEffect, useMemo, useState } from "react";

import {
  createDefaultBackgroundScene,
  createDefaultDotsLayer,
  createDefaultGlowLayer,
  createDefaultGradientLayer,
  createDefaultGridLayer,
  createDefaultNoiseLayer,
  createDefaultStripesLayer,
} from "@/components/assets/background-scene-defaults";
import {
  createLayerByType,
  createLayerId,
  getLayerCssSnippet,
  normalizeHex,
  type EffectType,
} from "@/components/assets/background-editor-shared";
import type { BackgroundScene, BackgroundSceneLayer } from "@/lib/background-scenes/types";

type UseBackgroundEditorStateResult = {
  scene: BackgroundScene;
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
  resetSelectedLayer: () => void;
};

export function useBackgroundEditorState(): UseBackgroundEditorStateResult {
  const [scene, setScene] = useState<BackgroundScene>(() => createDefaultBackgroundScene());
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

  useEffect(() => {
    if (!selectedLayer && scene.layers.length > 0) {
      setSelectedLayerId(scene.layers[0].id);
    }
  }, [scene.layers, selectedLayer]);

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
    const layer = createLayerByType(type);
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
    const next = createDefaultBackgroundScene();
    setScene(next);
    setSelectedLayerId(next.layers[0]?.id ?? "");
  }

  function resetSelectedLayer() {
    if (!selectedLayer) {
      return;
    }

    updateSelectedLayer((layer) => {
      if (layer.type === "stripes") {
        const defaults = createDefaultStripesLayer();
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }
      if (layer.type === "dots") {
        const defaults = createDefaultDotsLayer();
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }
      if (layer.type === "grid") {
        const defaults = createDefaultGridLayer();
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }
      if (layer.type === "gradient") {
        const defaults = createDefaultGradientLayer();
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }
      if (layer.type === "glow") {
        const defaults = createDefaultGlowLayer();
        return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
      }

      const defaults = createDefaultNoiseLayer();
      return { ...layer, visible: true, opacity: defaults.opacity, config: defaults.config };
    });
  }

  return {
    scene,
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
    resetSelectedLayer,
  };
}
