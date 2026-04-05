"use client";

import { useState, useSyncExternalStore, useTransition } from "react";

import { createProjectPreviewDraftAction } from "@/app/(protected)/projects/[projectId]/actions";
import {
  getPreviewDraftContent,
  subscribePreviewDraft,
} from "@/components/editor/preview-draft-store";

function getDraftSnapshot() {
  return getPreviewDraftContent();
}

export function OpenPreviewButton({ projectId }: { projectId: string }) {
  const content = useSyncExternalStore(subscribePreviewDraft, getDraftSnapshot, () => null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function openPreviewUrl(url: string) {
    window.open(url, "_blank", "noreferrer");
  }

  function handleOpenPreview() {
    if (!content) {
      openPreviewUrl(`/projects/${projectId}/preview`);
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

        openPreviewUrl(`/projects/${projectId}/preview?draft=${result.token}`);
      } catch (error) {
        setErrorMessage("Preview failed. Please try again.");
        console.error(error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleOpenPreview}
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Preparing preview..." : "Open preview"}
      </button>
      {errorMessage ? (
        <span className="text-xs font-medium text-red-700">{errorMessage}</span>
      ) : null}
    </div>
  );
}
