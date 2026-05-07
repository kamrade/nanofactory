"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { OpenPreviewButton } from "@/components/editor/open-preview-button";
import {
  getPreviewDraftContent,
  subscribePreviewDraft,
} from "@/components/editor/preview-draft-store";
import { ProjectModeSwitcher, type ThemeMode } from "@/components/projects/project-mode-switcher";
import { ProjectRenameForm } from "@/components/projects/project-rename-form";
import { ProjectThemeForm } from "@/components/projects/project-theme-form";
import { UIButton } from "@/components/ui/button";
import { UIStickyHeader } from "@/components/ui/sticky-header";
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
  PROJECT_MODE_POLICIES,
  type ProjectModePolicy,
} from "@/lib/projects/mode-policy";

type ProjectHeaderProps = {
  project: {
    id: string;
    name: string;
    slug: string;
    themeKey: string;
    modePolicy: ProjectModePolicy;
    status: "draft" | "published";
    schemaVersion: number;
    publishedAt: Date | null;
  };
  initialMode: ThemeMode;
  publicationAction: () => void | Promise<void>;
  themeAction: (formData: FormData) => void | Promise<void>;
  modePolicyAction: (formData: FormData) => void | Promise<void>;
  nameAction: (formData: FormData) => void | Promise<void>;
  contentShape: string;
};

export function ProjectHeader({
  project,
  initialMode,
  publicationAction,
  themeAction,
  modePolicyAction,
  nameAction,
  contentShape,
}: ProjectHeaderProps) {
  const resolvedThemeKey = resolveThemePreference(project.themeKey);
  const [liveContentShape, setLiveContentShape] = useState(contentShape);

  useEffect(() => {
    setLiveContentShape(contentShape);
  }, [contentShape, project.id]);

  useEffect(() => {
    return subscribePreviewDraft(() => {
      const nextDraft = getPreviewDraftContent();
      if (!nextDraft) {
        return;
      }
      setLiveContentShape(JSON.stringify(nextDraft, null, 2));
    });
  }, []);

  return (
    <UIStickyHeader
      data-testid="ProjectHeader"
      className="bg-surface shadow-xl shadow-black/3"
      contentClassName="py-6"
      revealOnScrollUp
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-placeholder">
            Project
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">{project.name}</h1>
        </div>

        <UIButton asChild theme="base" variant="outlined" size="sm">
          <Link href="/dashboard">
            <FiArrowLeft aria-hidden className="h-4 w-4" />
            <span>Back to dashboard</span>
          </Link>
        </UIButton>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <ProjectThemeForm
          initialThemeKey={resolvedThemeKey}
          options={THEME_OPTIONS}
          action={themeAction}
        />
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span>Mode</span>
          <ProjectModeSwitcher
            initialMode={initialMode}
            inputName="previewMode"
            syncSearchParam="mode"
            policy={project.modePolicy}
          />
        </div>

        <ProjectRenameForm
          initialName={project.name}
          initialSlug={project.slug}
          action={nameAction}
        />
        <UISheet>
          <UISheetTrigger>
            <UIButton type="button" theme="base" variant="outlined" size="sm">
              Info
            </UIButton>
          </UISheetTrigger>
          <UISheetContent side="right">
            <UISheetHeader>
              <UISheetTitle>Project info</UISheetTitle>
              <UISheetDescription>
                Project metadata and publication details.
              </UISheetDescription>
            </UISheetHeader>
            <div className="mt-6 grid gap-5 text-sm text-text-muted">
              <div className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
                <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 border-b border-line px-4 py-3">
                  <span className="font-medium text-text-main">status</span>
                  <span>{project.status}</span>
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
              <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
                <h3 className="text-base font-semibold text-text-main">Actions</h3>
                <form action={modePolicyAction} className="flex flex-wrap items-center gap-2">
                  <label className="text-sm text-text-muted">Mode support</label>
                  <select
                    name="modePolicy"
                    defaultValue={project.modePolicy}
                    className="h-7 rounded-lg border border-line bg-surface px-2 text-sm text-text-main outline-none"
                  >
                    {PROJECT_MODE_POLICIES.map((policy) => (
                      <option key={policy} value={policy}>
                        {policy}
                      </option>
                    ))}
                  </select>
                  <UIButton type="submit" theme="base" variant="outlined" size="sm">
                    Apply mode
                  </UIButton>
                </form>
                <div className="flex flex-wrap items-center gap-3">
                  <form action={publicationAction}>
                    <UIButton
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
              <div className="space-y-2">
                <h3 className="text-base font-semibold text-text-main">Content shape</h3>
                <pre className="max-h-[38vh] max-w-[60vw] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-line bg-surface-alt p-4 text-xs leading-6 text-text-main">
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
    </UIStickyHeader>
  );
}
