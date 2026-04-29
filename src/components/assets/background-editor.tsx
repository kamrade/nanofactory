"use client";

import { type ReactElement, useEffect, useMemo, useRef, useState } from "react";

import { BackgroundEditorInspector } from "@/components/assets/background-editor-inspector";
import { BackgroundEditorLayersPanel } from "@/components/assets/background-editor-layers-panel";
import { downloadJson } from "@/components/assets/background-editor-shared";
import type { BackgroundSceneListItem } from "@/components/assets/types";
import { useBackgroundEditorState } from "@/components/assets/use-background-editor-state";
import { UIButton } from "@/components/ui/button";
import { UIModal } from "@/components/ui/modal";
import { useThemeModeFromDom } from "@/hooks/use-theme-mode-from-dom";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";
import type { BackgroundScene } from "@/lib/background-scenes/types";
import type { ThemeKey } from "@/lib/themes";
import { resolveThemePreference, resolveModePreference, type UiMode } from "@/lib/ui-preferences";

type BackgroundEditorProps = {
  apiBasePath: string;
  initialScene?: BackgroundSceneListItem | null;
  trigger?: ReactElement;
  inline?: boolean;
  initialThemeKey?: ThemeKey;
  initialMode?: UiMode;
  onSceneSaved: (
    scene: BackgroundSceneListItem,
    mode: "create" | "update"
  ) => void;
};

function toEditorScene(input: BackgroundSceneListItem | null | undefined): BackgroundScene | undefined {
  if (!input) {
    return undefined;
  }

  return {
    ...input.sceneJson,
    name: input.name,
  };
}

function normalizeScenePayload(scene: BackgroundSceneListItem): BackgroundSceneListItem {
  return {
    ...scene,
    createdAt: new Date(scene.createdAt).toISOString(),
    updatedAt: new Date(scene.updatedAt).toISOString(),
  };
}

export function BackgroundEditor({
  apiBasePath,
  initialScene = null,
  trigger,
  inline = false,
  initialThemeKey,
  initialMode,
  onSceneSaved,
}: BackgroundEditorProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fallbackThemeKey = resolveThemePreference(initialThemeKey);
  const fallbackMode = resolveModePreference(initialMode);
  const { themeKey, mode } = useThemeModeFromDom({
    rootSelector: "html[data-theme][data-mode]",
    fallbackThemeKey,
    fallbackMode,
  });
  const editorMode = initialScene ? "update" : "create";
  const initialEditorScene = useMemo(() => toEditorScene(initialScene), [initialScene]);

  const {
    scene,
    colorChoices,
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
  } = useBackgroundEditorState(initialEditorScene, {
    themeKey,
    mode,
  });
  const previousColorChoicesRef = useRef(colorChoices);

  useEffect(() => {
    if (!inline && !open) {
      return;
    }

    syncScenePalette(previousColorChoicesRef.current);
    previousColorChoicesRef.current = colorChoices;
  }, [themeKey, mode, inline, open, syncScenePalette, colorChoices]);

  useEffect(() => {
    if (!inline && !open) {
      return;
    }

    if (initialEditorScene) {
      replaceScene(initialEditorScene);
    } else {
      resetScene();
    }
    setShowExport(false);
    setMessage(null);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inline, open, initialScene?.id, initialScene?.updatedAt]);

  async function copyJson() {
    await navigator.clipboard.writeText(prettyJson);
    setMessage("JSON copied to clipboard.");
  }

  async function handleSaveScene() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const isUpdate = editorMode === "update" && initialScene?.id;
      const endpoint = isUpdate ? `${apiBasePath}/${initialScene.id}` : apiBasePath;
      const method = isUpdate ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: scene.name,
          sceneJson: scene,
        }),
      });

      const payload = (await response.json()) as {
        scene?: BackgroundSceneListItem;
        error?: string;
      };

      if (!response.ok || !payload.scene) {
        throw new Error(payload.error ?? "Failed to save background scene.");
      }

      const normalized = normalizeScenePayload(payload.scene);
      onSceneSaved(normalized, editorMode);
      setMessage(
        editorMode === "create"
          ? `Saved scene "${normalized.name}".`
          : `Updated scene "${normalized.name}".`
      );
      if (!inline) {
        setOpen(false);
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save scene.");
    } finally {
      setIsSaving(false);
    }
  }

  const content = (
    <div className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
          <label className="grid min-w-[260px] gap-1 text-sm">
            <span className="font-medium text-text-main">Scene name</span>
            <input
              type="text"
              value={scene.name}
              onChange={(event) => updateSceneName(event.target.value)}
              className="rounded-xl border border-line bg-surface-alt px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <UIButton
              type="button"
              theme="base"
              variant="outlined"
              size="sm"
              onClick={() => setShowExport((current) => !current)}
            >
              Export JSON
            </UIButton>
            <UIButton
              type="button"
              theme="base"
              variant="outlined"
              size="sm"
              onClick={() => {
                resetScene();
                setShowExport(false);
                setError(null);
              }}
            >
              Reset
            </UIButton>
          </div>
        </div>

        {showExport ? (
          <div className="grid gap-3 rounded-2xl border border-line bg-surface p-4">
            <textarea
              readOnly
              value={prettyJson}
              rows={14}
              className="w-full rounded-xl border border-line bg-surface-alt px-3 py-2 font-mono text-xs leading-5 text-text-main outline-none"
            />
            <div className="flex flex-wrap justify-end gap-2">
              <UIButton type="button" theme="base" variant="outlined" size="sm" onClick={copyJson}>
                Copy JSON
              </UIButton>
              <UIButton
                type="button"
                theme="base"
                variant="outlined"
                size="sm"
                onClick={() => downloadJson(`${scene.name || "background-scene"}.json`, prettyJson)}
              >
                Download .json
              </UIButton>
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)_minmax(0,1fr)]">
          <BackgroundEditorLayersPanel
            layers={scene.layers}
            selectedLayerId={selectedLayerId}
            onLayerSelect={setSelectedLayerId}
            onAddEffect={addEffect}
            onToggleVisibility={toggleLayerVisibility}
            onDuplicateLayer={duplicateLayer}
            onDeleteLayer={deleteLayer}
          />

          <div className="grid h-fit gap-2 rounded-2xl border border-line bg-surface p-4">
            <h4 className="text-sm font-semibold text-text-main">Preview</h4>
            <div className="overflow-hidden rounded-[1.5rem] border border-line bg-surface-alt">
              <div className="aspect-[1200/630] w-full" style={buildBackgroundSceneStyle(scene)} />
            </div>
          </div>

          <BackgroundEditorInspector
            colorChoices={colorChoices}
            canvasBackgroundColor={scene.canvas.backgroundColor}
            onCanvasBackgroundColorChange={updateCanvasColor}
            selectedLayer={selectedLayer}
            selectedLayerCss={selectedLayerCss}
            onResetSelectedLayer={resetSelectedLayer}
            onUpdateSelectedLayer={updateSelectedLayer}
          />
        </div>

        {message ? (
          <p className="rounded-2xl border border-primary-line bg-primary-100 px-4 py-3 text-sm text-text-main">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-2xl border border-danger-line bg-danger-100 px-4 py-3 text-sm text-text-danger">
            {error}
          </p>
        ) : null}
      </div>
  );

  if (inline) {
    return (
      <section data-testid="BackgroundEditor" className="grid gap-4 rounded-2xl border border-line bg-surface-alt p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-text-main">
              {editorMode === "create" ? "Create background scene" : "Edit background scene"}
            </h3>
            <p className="text-sm text-text-muted">
              Compose layers, preview live, export JSON, then save to the global catalog.
            </p>
          </div>
          <UIButton
            type="button"
            onClick={handleSaveScene}
            disabled={isSaving}
            theme="primary"
            variant="contained"
            size="sm"
          >
            {isSaving
              ? "Saving..."
              : editorMode === "create"
                ? "Save scene"
                : "Save changes"}
          </UIButton>
        </div>
        {content}
      </section>
    );
  }

  return (
    <UIModal
      open={open}
      onOpenChange={setOpen}
      size="xl"
      fullWidth
      title={editorMode === "create" ? "Create background scene" : "Edit background scene"}
      description="Compose layers, preview live, export JSON, then save to the global catalog."
      trigger={trigger ?? <span />}
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm text-text-muted">Scene schema: v1</span>
          <UIButton
            type="button"
            onClick={handleSaveScene}
            disabled={isSaving}
            theme="primary"
            variant="contained"
            size="sm"
          >
            {isSaving
              ? "Saving..."
              : editorMode === "create"
                ? "Save scene"
                : "Save changes"}
          </UIButton>
        </div>
      }
    >
      {content}
    </UIModal>
  );
}
