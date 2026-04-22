"use client";

import type { PageContent } from "@/db/schema";

type DraftListener = () => void;

let currentDraft: PageContent | null = null;
const listeners = new Set<DraftListener>();

export function setPreviewDraftContent(nextContent: PageContent) {
  currentDraft = nextContent;
  listeners.forEach((listener) => listener());
}

export function getPreviewDraftContent() {
  return currentDraft;
}

export function subscribePreviewDraft(listener: DraftListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
