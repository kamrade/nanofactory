"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { FiArrowLeft, FiSettings } from "react-icons/fi";

import type { SaveEditorState } from "@/app/(protected)/projects/[projectId]/actions";
import { EDITOR_ADD_BLOCK_EVENT, type EditorAddBlockEventDetail } from "@/components/editor/editor-events";
import { OpenPreviewButton } from "@/components/editor/open-preview-button";
import {
  getPreviewDraftContent,
  subscribePreviewDraft,
} from "@/components/editor/preview-draft-store";
import { ProjectModeSwitcher, type ThemeMode } from "@/components/projects/project-mode-switcher";
import { ProjectRenameForm } from "@/components/projects/project-rename-form";
import { ProjectThemeForm } from "@/components/projects/project-theme-form";
import { UIButton } from "@/components/ui/button";
import { UIDivider } from "@/components/ui/divider";
import { UIMenu, UIMenuItem, UIMenuLabel } from "@/components/ui/menu";
import { UISelect } from "@/components/ui/select";
import {
  UISheet,
  UISheetClose,
  UISheetContent,
  UISheetDescription,
  UISheetFooter,
  UISheetHeader,
  UISheetTitle,
  UISheetTrigger,
} from "@/components/ui/sheet";
import { THEME_OPTIONS } from "@/lib/themes";
import { formatUiDateTime } from "@/lib/ui-date-time";
import { resolveThemePreference } from "@/lib/ui-preferences";
import {
  PROJECT_BORDER_RADIUS_POLICIES,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";
import {
  PROJECT_MODE_POLICIES,
  type ProjectModePolicy,
} from "@/lib/projects/mode-policy";
import {
  PROJECT_SPACING_SCALES,
  type ProjectSpacingScale,
} from "@/lib/projects/spacing-scale";
import { getBlockTypes, getBlockVariants } from "@/lib/editor/blocks";
import { useToast } from "@/hooks/use-toast";

type ProjectHeaderProps = {
  project: {
    id: string;
    name: string;
    slug: string;
    themeKey: string;
    modePolicy: ProjectModePolicy;
    borderRadiusPolicy: ProjectBorderRadiusPolicy;
    spacingScale: ProjectSpacingScale;
    status: "draft" | "published";
    schemaVersion: number;
    publishedAt: Date | null;
  };
  initialMode: ThemeMode;
  publicationAction: () => void | Promise<void>;
  themeAction: (formData: FormData) => void | Promise<void>;
  modePolicyAction: (formData: FormData) => void | Promise<void>;
  borderRadiusPolicyAction: (formData: FormData) => void | Promise<void>;
  spacingScaleAction: (formData: FormData) => void | Promise<void>;
  nameAction: (formData: FormData) => void | Promise<void>;
  saveAction: (
    state: SaveEditorState,
    payload: FormData
  ) => SaveEditorState | Promise<SaveEditorState>;
  contentShape: string;
};

export function ProjectHeader({
  project,
  initialMode,
  publicationAction,
  themeAction,
  modePolicyAction,
  borderRadiusPolicyAction,
  spacingScaleAction,
  nameAction,
  saveAction,
  contentShape,
}: ProjectHeaderProps) {
  const { showToast } = useToast();
  const resolvedThemeKey = resolveThemePreference(project.themeKey);
  const [, startTransition] = useTransition();
  const [modePolicyValue, setModePolicyValue] = useState<ProjectModePolicy>(project.modePolicy);
  const [borderRadiusValue, setBorderRadiusValue] = useState<ProjectBorderRadiusPolicy>(
    project.borderRadiusPolicy
  );
  const [spacingScaleValue, setSpacingScaleValue] = useState<ProjectSpacingScale>(
    project.spacingScale
  );
  const [liveDraftContentShape, setLiveDraftContentShape] = useState<string | null>(null);
  const initialSaveState: SaveEditorState = {
    status: "idle",
    message: "",
  };
  const [saveState, saveFormAction, isSaving] = useActionState(saveAction, initialSaveState);
  const addBlockGroups = useMemo(
    () =>
      getBlockTypes().map((blockType) => ({
        ...blockType,
        variants: getBlockVariants(blockType.type),
      })),
    []
  );

  useEffect(() => {
    setModePolicyValue(project.modePolicy);
  }, [project.modePolicy]);

  useEffect(() => {
    setBorderRadiusValue(project.borderRadiusPolicy);
  }, [project.borderRadiusPolicy]);

  useEffect(() => {
    setSpacingScaleValue(project.spacingScale);
  }, [project.spacingScale]);

  useEffect(() => {
    return subscribePreviewDraft(() => {
      const nextDraft = getPreviewDraftContent();
      if (!nextDraft) {
        return;
      }
      setLiveDraftContentShape(JSON.stringify(nextDraft, null, 2));
    });
  }, []);

  useEffect(() => {
    if (saveState.status === "idle" || !saveState.message) {
      return;
    }

    showToast({
      tone: saveState.status === "success" ? "default" : "error",
      title: saveState.message,
    });
  }, [saveState.message, saveState.status, showToast]);

  const liveContentShape = liveDraftContentShape ?? contentShape;

  function handleAddBlock(blockType: string, variant: string) {
    window.dispatchEvent(
      new CustomEvent<EditorAddBlockEventDetail>(EDITOR_ADD_BLOCK_EVENT, {
        detail: {
          blockType: blockType as EditorAddBlockEventDetail["blockType"],
          variant: variant as EditorAddBlockEventDetail["variant"],
        },
      })
    );
  }

  return (
    <div
      data-testid="ProjectHeader"
      className="fixed right-4 top-4 z-50 flex flex-col items-end gap-3"
    >
      <UIButton asChild theme="base" variant="outlined" size="lg" iconButton className="rounded-full">
        <Link href="/dashboard" aria-label="Back to dashboard" title="Back to dashboard">
          <FiArrowLeft aria-hidden className="h-5 w-5" />
        </Link>
      </UIButton>
      <UISheet>
        <UISheetTrigger>
          <UIButton
            type="button"
            theme="base"
            variant="contained"
            size="lg"
            iconButton
            aria-label="Settings"
            title="Settings"
            className="rounded-full"
          >
            <FiSettings aria-hidden className="h-5 w-5" />
          </UIButton>
        </UISheetTrigger>
        <UISheetContent side="right">
          <UISheetHeader className="flex-row items-start justify-between gap-3">
            
            <div>
              <UISheetClose>
                <UIButton type="button" theme="base" variant="contained" size="sm">
                  Close
                </UIButton>
              </UISheetClose>
            </div>

            <UIDivider></UIDivider>

          </UISheetHeader>
          <div className="mt-6 grid gap-5 text-sm text-text-muted">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-placeholder">
                Project
              </p>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-2xl font-semibold tracking-tight text-text-main">
                  {project.name}
                </h2>
                <ProjectRenameForm
                  initialName={project.name}
                  initialSlug={project.slug}
                  action={nameAction}
                  iconOnly
                />
              </div>


              <div className="flex gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <UIMenu
                    ariaLabel="Add block"
                    placement="bottom-start"
                    size="sm"
                    trigger={
                      <UIButton type="button" theme="base" variant="contained" size="sm">
                        Add block
                      </UIButton>
                    }
                  >
                    {addBlockGroups.map((group) => (
                      <div key={group.type} className="grid gap-0.5">
                        <UIMenuLabel>{group.label}</UIMenuLabel>
                        {group.variants.map((definition) => (
                          <UIMenuItem
                            key={`${definition.type}:${definition.variant}`}
                            onSelect={() => handleAddBlock(definition.type, definition.variant)}
                            className="grid gap-0.5"
                          >
                            <span className="text-sm font-medium text-text-main">{definition.label}</span>
                            {definition.description ? (
                              <span className="text-xs leading-5 text-text-muted">
                                {definition.description}
                              </span>
                            ) : null}
                          </UIMenuItem>
                        ))}
                      </div>
                    ))}
                  </UIMenu>
                </div>
                <form action={saveFormAction} className="flex items-center gap-3">
                  <input type="hidden" name="content" value={liveContentShape} />
                  <UIButton
                    type="submit"
                    disabled={isSaving}
                    theme="primary"
                    variant="contained"
                    size="sm"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </UIButton>
                </form>
              </div>
            </div>

            <UIDivider spacing="sm" />

            <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
              <h3 className="text-base font-semibold text-text-main">Actions</h3>
              <div className="grid gap-1">
                <label className="text-sm text-text-muted">Mode support</label>
                <div className="flex items-center gap-2">
                  <UISelect
                    ariaLabel="Mode support"
                    size="sm"
                    value={modePolicyValue}
                    onValueChange={(nextValue) => {
                      if (!PROJECT_MODE_POLICIES.includes(nextValue as ProjectModePolicy)) {
                        return;
                      }
                      const nextPolicy = nextValue as ProjectModePolicy;
                      if (nextPolicy === modePolicyValue) {
                        return;
                      }
                      setModePolicyValue(nextPolicy);
                      document
                        .querySelector<HTMLElement>("main[data-theme]")
                        ?.setAttribute("data-mode-policy", nextPolicy);
                      startTransition(() => {
                        const formData = new FormData();
                        formData.set("modePolicy", nextPolicy);
                        void modePolicyAction(formData);
                      });
                    }}
                    options={PROJECT_MODE_POLICIES.map((policy) => ({
                      value: policy,
                      label: policy,
                      textValue: policy,
                    }))}
                    className="min-w-36"
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-text-muted">Border radius</label>
                <div className="flex items-center gap-2">
                  <UISelect
                    ariaLabel="Border radius"
                    size="sm"
                    value={borderRadiusValue}
                    onValueChange={(nextValue) => {
                      if (!PROJECT_BORDER_RADIUS_POLICIES.includes(nextValue as ProjectBorderRadiusPolicy)) {
                        return;
                      }
                      const nextPolicy = nextValue as ProjectBorderRadiusPolicy;
                      if (nextPolicy === borderRadiusValue) {
                        return;
                      }
                      setBorderRadiusValue(nextPolicy);
                      startTransition(() => {
                        const formData = new FormData();
                        formData.set("borderRadiusPolicy", nextPolicy);
                        void borderRadiusPolicyAction(formData);
                      });
                    }}
                    options={PROJECT_BORDER_RADIUS_POLICIES.map((policy) => ({
                      value: policy,
                      label: policy,
                      textValue: policy,
                    }))}
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-text-muted">Spacing scale</label>
                <div className="flex items-center gap-2">
                  <UISelect
                    ariaLabel="Spacing scale"
                    size="sm"
                    value={spacingScaleValue}
                    onValueChange={(nextValue) => {
                      if (!PROJECT_SPACING_SCALES.includes(nextValue as ProjectSpacingScale)) {
                        return;
                      }
                      const nextScale = nextValue as ProjectSpacingScale;
                      if (nextScale === spacingScaleValue) {
                        return;
                      }
                      setSpacingScaleValue(nextScale);
                      document
                        .querySelector<HTMLElement>("main[data-theme]")
                        ?.setAttribute("data-spacing-scale", nextScale);
                      startTransition(() => {
                        const formData = new FormData();
                        formData.set("spacingScale", nextScale);
                        void spacingScaleAction(formData);
                      });
                    }}
                    options={PROJECT_SPACING_SCALES.map((scale) => ({
                      value: scale,
                      label: scale,
                      textValue: scale,
                    }))}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                <ProjectThemeForm
                  initialThemeKey={resolvedThemeKey}
                  options={THEME_OPTIONS}
                  action={themeAction}
                />

                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <ProjectModeSwitcher
                    initialMode={initialMode}
                    inputName="previewMode"
                    syncSearchParam="mode"
                    policy={project.modePolicy}
                  />
                </div>
                
              </div>

              <UIDivider></UIDivider>
                
              <div className="flex flex-wrap items-center gap-3">
                <form action={publicationAction}>
                  <UIButton
                    data-testid={
                      project.status === "published"
                        ? "project-unpublish-button"
                        : "project-publish-button"
                    }
                    type="submit"
                    theme={project.status === "published" ? "danger" : "primary"}
                    variant={project.status === "published" ? "outlined" : "contained"}
                    size="sm"
                  >
                    {project.status === "published" ? "Unpublish" : "Publish"}
                  </UIButton>
                </form>

                <OpenPreviewButton projectId={project.id} />

                {project.status === "published" ? (
                  <UIButton asChild theme="base" variant="contained" size="sm">
                    <Link href={`/p/${project.slug}`} target="_blank" rel="noreferrer">
                      Open public page
                    </Link>
                  </UIButton>
                ) : null}
              </div>
            </div>

            {saveState.status === "error" && saveState.message ? (
              <p className="text-sm text-danger-500">{saveState.message}</p>
            ) : null}
              <div className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3">
                  <span className="font-medium text-text-main">status</span>
                  <span data-testid="project-publish-status">{project.status}</span>
                </div>
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3">
                  <span className="font-medium text-text-main">slug</span>
                  <span className="break-all">{project.slug}</span>
                </div>
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3">
                  <span className="font-medium text-text-main">theme</span>
                  <span>{resolvedThemeKey}</span>
                </div>
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3">
                  <span className="font-medium text-text-main">modePolicy</span>
                  <span>{project.modePolicy}</span>
                </div>
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3">
                  <span className="font-medium text-text-main">borderRadius</span>
                  <span>{project.borderRadiusPolicy}</span>
                </div>
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3">
                  <span className="font-medium text-text-main">spacingScale</span>
                  <span>{project.spacingScale}</span>
                </div>
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3">
                  <span className="font-medium text-text-main">schemaVersion</span>
                  <span>{project.schemaVersion}</span>
                </div>
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 px-4 py-3">
                  <span className="font-medium text-text-main">publishedAt</span>
                  <span>
                    {project.publishedAt ? formatUiDateTime(project.publishedAt) : "Not published"}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-text-main">Content shape</h3>
                <pre className="max-h-[50vh] overflow-auto whitespace-pre-wrap wrap-break-word rounded-2xl border border-line bg-surface-alt p-4 text-xs leading-6 text-text-main">
                  {liveContentShape}
                </pre>
              </div>
          </div>
          <UISheetFooter>
            <UISheetClose>
              <UIButton type="button" theme="base" variant="outlined" size="sm">
                Close
              </UIButton>
            </UISheetClose>
          </UISheetFooter>
        </UISheetContent>
      </UISheet>
    </div>
  );
}
