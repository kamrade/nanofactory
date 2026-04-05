import "server-only";

import type { PageContent } from "@/db/schema";

type PreviewDraft = {
  id: string;
  projectId: string;
  userId: string;
  content: PageContent;
  createdAt: number;
  expiresAt: number;
};

type PreviewDraftStore = Map<string, PreviewDraft>;

const DEFAULT_TTL_MS = 15 * 60 * 1000;

declare global {
  // eslint-disable-next-line no-var
  var __previewDraftStore: PreviewDraftStore | undefined;
}

function getStore(): PreviewDraftStore {
  if (!globalThis.__previewDraftStore) {
    globalThis.__previewDraftStore = new Map();
  }

  return globalThis.__previewDraftStore;
}

function pruneExpired(store: PreviewDraftStore, now: number) {
  for (const [key, value] of store.entries()) {
    if (value.expiresAt <= now) {
      store.delete(key);
    }
  }
}

export function createPreviewDraft(input: {
  projectId: string;
  userId: string;
  content: PageContent;
  ttlMs?: number;
}) {
  const now = Date.now();
  const store = getStore();
  pruneExpired(store, now);

  const id = crypto.randomUUID();
  const ttlMs = input.ttlMs ?? DEFAULT_TTL_MS;

  store.set(id, {
    id,
    projectId: input.projectId,
    userId: input.userId,
    content: input.content,
    createdAt: now,
    expiresAt: now + ttlMs,
  });

  return {
    id,
    expiresAt: now + ttlMs,
  };
}

export function getPreviewDraft(draftId: string) {
  const store = getStore();
  const now = Date.now();
  const draft = store.get(draftId);

  if (!draft) {
    return null;
  }

  if (draft.expiresAt <= now) {
    store.delete(draftId);
    return null;
  }

  return draft;
}
