"use client";

import { useState } from "react";

import { UIButton } from "@/components/ui/button";
import {
  UIDialog,
  UIDialogClose,
  UIDialogContent,
  UIDialogDescription,
  UIDialogFooter,
  UIDialogHeader,
  UIDialogTitle,
  UIDialogTrigger,
} from "@/components/ui/dialog";
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
  const [pickerOpen, setPickerOpen] = useState(false);
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
        <UIDialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <UIDialogTrigger>
            <UIButton type="button" theme="base" variant="outlined" size="sm">
              {selectedScene ? "Change background" : "Use background"}
            </UIButton>
          </UIDialogTrigger>
          <UIDialogContent className="max-w-5xl">
            <UIDialogHeader>
              <UIDialogTitle>{title}</UIDialogTitle>
              <UIDialogDescription>{description}</UIDialogDescription>
            </UIDialogHeader>

            <div className="scrollbar-macos max-h-[68vh] overflow-y-auto pr-1">
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
                        <div
                          className="aspect-[1200/630] w-full"
                          style={buildBackgroundSceneStyle(scene.sceneJson)}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-text-main">
                            {scene.name}
                          </p>
                          <p className="text-xs text-text-muted">
                            {scene.sceneJson.layers.length} layer(s)
                          </p>
                        </div>
                        <UIButton
                          type="button"
                          theme={selected ? "primary" : "base"}
                          variant={selected ? "contained" : "outlined"}
                          size="sm"
                          onClick={() => {
                            onSelect(scene.id);
                            setPickerOpen(false);
                          }}
                        >
                          {selected ? "Selected" : "Use"}
                        </UIButton>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <UIDialogFooter>
              <UIDialogClose>
                <UIButton type="button" theme="base" variant="outlined" size="sm">
                  Close
                </UIButton>
              </UIDialogClose>
            </UIDialogFooter>
          </UIDialogContent>
        </UIDialog>
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
