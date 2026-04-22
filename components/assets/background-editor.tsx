"use client";

import { useState } from "react";

import { BackgroundEditorInspector } from "@/components/assets/background-editor-inspector";
import { BackgroundEditorLayersPanel } from "@/components/assets/background-editor-layers-panel";
import { downloadJson } from "@/components/assets/background-editor-shared";
import { useBackgroundEditorState } from "@/components/assets/use-background-editor-state";
import type { ProjectBackgroundSceneListItem } from "@/components/assets/types";
import { UIButton } from "@/components/ui/button";
import { UIModal } from "@/components/ui/modal";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";

type BackgroundEditorProps = {
  projectId: string;
  onSceneCreated: (scene: ProjectBackgroundSceneListItem) => void;
};

export function BackgroundEditor({ projectId, onSceneCreated }: BackgroundEditorProps) {
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
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
  } = useBackgroundEditorState();

  async function copyJson() {
    await navigator.clipboard.writeText(prettyJson);
    setMessage("JSON copied to clipboard.");
  }

  async function handleSaveScene() {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/background-scenes`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: scene.name,
          sceneJson: scene,
        }),
      });

      const payload = (await response.json()) as {
        scene?: ProjectBackgroundSceneListItem;
        error?: string;
      };

      if (!response.ok || !payload.scene) {
        throw new Error(payload.error ?? "Failed to save background scene.");
      }

      onSceneCreated({
        ...payload.scene,
        createdAt: new Date(payload.scene.createdAt).toISOString(),
        updatedAt: new Date(payload.scene.updatedAt).toISOString(),
      });
      setMessage(`Saved scene "${payload.scene.name}".`);
      setOpen(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save scene.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-alt p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-text-main">Background editor</h3>
          <p className="max-w-2xl text-sm leading-6 text-text-muted">
            Build CSS-based reusable background scenes from atomic layers and store
            them as JSON on backend.
          </p>
        </div>

        <UIModal
          open={open}
          onOpenChange={setOpen}
          size="xl"
          fullWidth
          title="Create background scene"
          description="Compose layers, preview live, export JSON, then save as project scene."
          trigger={
            <UIButton type="button" theme="primary" variant="contained" size="sm">
              Create background scene
            </UIButton>
          }
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
                {isSaving ? "Saving..." : "Save scene"}
              </UIButton>
            </div>
          }
        >
          <div className="grid gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
              <label className="grid min-w-[260px] gap-1 text-sm">
                <span className="font-medium text-text-main">Project name</span>
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
                <div className="overflow-hidden rounded-[1.5rem] border border-line bg-black/20">
                  <div className="aspect-[1200/630] w-full" style={buildBackgroundSceneStyle(scene)} />
                </div>
              </div>

              <BackgroundEditorInspector
                canvasBackgroundColor={scene.canvas.backgroundColor}
                onCanvasBackgroundColorChange={updateCanvasColor}
                selectedLayer={selectedLayer}
                selectedLayerCss={selectedLayerCss}
                onResetSelectedLayer={resetSelectedLayer}
                onUpdateSelectedLayer={updateSelectedLayer}
              />
            </div>

            {message ? (
              <p className="rounded-2xl border border-primary-line bg-primary-100 px-4 py-3 text-sm text-text-inverted-main">
                {message}
              </p>
            ) : null}
            {error ? (
              <p className="rounded-2xl border border-danger-line bg-danger-100 px-4 py-3 text-sm text-danger">
                {error}
              </p>
            ) : null}
          </div>
        </UIModal>
      </div>
    </div>
  );
}
