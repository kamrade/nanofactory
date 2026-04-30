import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { OpenPreviewButton } from "@/components/editor/open-preview-button";
import { ProjectModeSwitcher, type ThemeMode } from "@/components/projects/project-mode-switcher";
import { ProjectRenameForm } from "@/components/projects/project-rename-form";
import { ProjectThemeForm } from "@/components/projects/project-theme-form";
import { UIButton } from "@/components/ui/button";
import { UIDivider } from "@/components/ui/divider";
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

type ProjectHeaderProps = {
  project: {
    id: string;
    name: string;
    slug: string;
    themeKey: string;
    status: "draft" | "published";
    schemaVersion: number;
    publishedAt: Date | null;
  };
  initialMode: ThemeMode;
  publicationAction: () => void | Promise<void>;
  themeAction: (formData: FormData) => void | Promise<void>;
  nameAction: (formData: FormData) => void | Promise<void>;
};

export function ProjectHeader({
  project,
  initialMode,
  publicationAction,
  themeAction,
  nameAction,
}: ProjectHeaderProps) {
  const resolvedThemeKey = resolveThemePreference(project.themeKey);

  return (
    <div
      data-testid="ProjectHeader"
      className="mx-4 flex flex-col gap-4 rounded-3xl border border-line bg-surface p-6 shadow-sm"
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
            <div className="mt-6 grid gap-3 text-sm text-text-muted">
              <p>Status: {project.status}</p>
              <p>Slug: {project.slug}</p>
              <p>Theme: {resolvedThemeKey}</p>
              <p>Schema version: {project.schemaVersion}</p>
              <p>
                Published at:{" "}
                {project.publishedAt ? formatUiDateTime(project.publishedAt) : "Not published"}
              </p>
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

      <UIDivider spacing="sm" />

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
  );
}
