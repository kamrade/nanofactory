"use client";

import { useState, useSyncExternalStore, useTransition } from "react";

import { createProjectPreviewDraftAction } from "@/app/(protected)/projects/[projectId]/actions";
import { UIButton } from "@/components/ui/button";
import {
  getPreviewDraftContent,
  subscribePreviewDraft,
} from "@/components/editor/preview-draft-store";

function getDraftSnapshot() {
  return getPreviewDraftContent();
}

export function getSelectedThemeKeyFromDocument(
  doc: Pick<Document, "querySelector"> = document
) {
  const themeField = doc.querySelector<HTMLSelectElement>('select[name="themeKey"]');
  const value = themeField?.value?.trim();
  return value ? value : null;
}

export function buildPreviewUrl(
  basePath: string,
  options?: {
    draftToken?: string;
    selectedThemeKey?: string | null;
  }
) {
  const params = new URLSearchParams();

  if (options?.draftToken) {
    params.set("draft", options.draftToken);
  }

  if (options?.selectedThemeKey) {
    params.set("theme", options.selectedThemeKey);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function OpenPreviewButton({ projectId }: { projectId: string }) {
  const content = useSyncExternalStore(subscribePreviewDraft, getDraftSnapshot, () => null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function openPreviewUrl(url: string) {
    window.open(url, "_blank", "noreferrer");
  }

  function handleOpenPreview() {
    const selectedThemeKey = getSelectedThemeKeyFromDocument();

    if (!content) {
      openPreviewUrl(
        buildPreviewUrl(`/projects/${projectId}/preview`, {
          selectedThemeKey,
        })
      );
      return;
    }

    setErrorMessage(null);

    startTransition(async () => {
      try {
        const result = await createProjectPreviewDraftAction(
          projectId,
          JSON.stringify(content)
        );

        if (result.status === "error") {
          setErrorMessage(result.message);
          return;
        }

        openPreviewUrl(
          buildPreviewUrl(`/projects/${projectId}/preview`, {
            draftToken: result.token,
            selectedThemeKey,
          })
        );
      } catch (error) {
        setErrorMessage("Preview failed. Please try again.");
        console.error(error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <UIButton
        type="button"
        onClick={handleOpenPreview}
        disabled={isPending}
        theme="base"
        variant="outlined"
        size="sm"
      >
        {isPending ? "Preparing preview..." : "Open preview"}
      </UIButton>
      {errorMessage ? (
        <span className="text-xs font-medium text-red-700">{errorMessage}</span>
      ) : null}
    </div>
  );
}
