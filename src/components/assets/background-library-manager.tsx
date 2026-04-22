"use client";

import { useMemo, useState } from "react";

import { BackgroundEditor } from "@/components/assets/background-editor";
import type { BackgroundSceneListItem } from "@/components/assets/types";
import { UIButton } from "@/components/ui/button";
import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";
import { formatUiDateTime } from "@/lib/ui-date-time";

type BackgroundLibraryManagerProps = {
  initialScenes: BackgroundSceneListItem[];
};

export function BackgroundLibraryManager({ initialScenes }: BackgroundLibraryManagerProps) {
  const [scenes, setScenes] = useState(initialScenes);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingSceneId, setDeletingSceneId] = useState<string | null>(null);

  const sortedScenes = useMemo(
    () =>
      [...scenes].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [scenes]
  );
  const activeScene = useMemo(
    () => sortedScenes.find((scene) => scene.id === activeSceneId) ?? null,
    [activeSceneId, sortedScenes]
  );

  async function handleDeleteScene(scene: BackgroundSceneListItem) {
    if (!confirm(`Delete "${scene.name}"?`)) {
      return;
    }

    setDeletingSceneId(scene.id);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/background-library-scenes/${scene.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to delete scene.");
      }

      setScenes((current) => current.filter((item) => item.id !== scene.id));
      setActiveSceneId((current) => (current === scene.id ? null : current));
      setMessage(`Deleted scene "${scene.name}".`);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Failed to delete scene."
      );
    } finally {
      setDeletingSceneId(null);
    }
  }

  return (
    <section className="grid gap-5 py-6">
      <div className="rounded-2xl border border-line bg-surface-alt p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-text-main">Background library</h2>
            <p className="max-w-2xl text-sm leading-6 text-text-muted">
              Create and manage reusable background scenes for all projects.
            </p>
          </div>

          <UIButton
            type="button"
            theme="base"
            variant="outlined"
            size="sm"
            onClick={() => setActiveSceneId(null)}
          >
            New scene
          </UIButton>
        </div>
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

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <BackgroundEditor
          inline
          apiBasePath="/api/background-library-scenes"
          initialScene={activeScene}
          onSceneSaved={(scene, mode) => {
            setScenes((current) => {
              if (mode === "create") {
                return [scene, ...current];
              }

              return current.map((item) => (item.id === scene.id ? scene : item));
            });
            setActiveSceneId(scene.id);
            setMessage(
              mode === "create"
                ? `Saved scene "${scene.name}".`
                : `Updated scene "${scene.name}".`
            );
            setError(null);
          }}
        />

        <div className="grid h-fit gap-4">
          <h3 className="text-base font-semibold text-text-main">Catalog</h3>
          {sortedScenes.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-line px-4 py-8 text-sm text-text-placeholder">
              No scenes in library yet.
            </p>
          ) : (
            sortedScenes.map((scene) => (
              <article key={scene.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
                    <div
                      className="aspect-[1200/630] w-full"
                      style={buildBackgroundSceneStyle(scene.sceneJson)}
                    />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-text-main">{scene.name}</h4>
                    <p className="text-sm text-text-placeholder">Scene ID: {scene.id}</p>
                    <p className="text-sm text-text-placeholder">
                      Layers: {scene.sceneJson.layers.length}
                    </p>
                    <p className="text-sm text-text-placeholder">
                      Updated: {formatUiDateTime(scene.updatedAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <UIButton
                      type="button"
                      theme="base"
                      variant={activeSceneId === scene.id ? "contained" : "outlined"}
                      size="sm"
                      onClick={() => setActiveSceneId(scene.id)}
                    >
                      {activeSceneId === scene.id ? "Editing" : "Edit in editor"}
                    </UIButton>

                    <UIButton
                      type="button"
                      theme="danger"
                      variant="outlined"
                      size="sm"
                      disabled={deletingSceneId === scene.id}
                      onClick={() => handleDeleteScene(scene)}
                    >
                      {deletingSceneId === scene.id ? "Deleting..." : "Delete"}
                    </UIButton>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
