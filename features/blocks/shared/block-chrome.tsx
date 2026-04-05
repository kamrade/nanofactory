"use client";

import type { ReactNode } from "react";

type BlockChromeProps = {
  index: number;
  title: string;
  meta: string;
  onDelete: () => void;
  actions?: ReactNode;
  children: ReactNode;
};

export function BlockChrome({
  index,
  title,
  meta,
  onDelete,
  actions,
  children,
}: BlockChromeProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Block {index + 1}
          </p>
          <h3 className="text-base font-semibold text-zinc-950">{title}</h3>
          <p className="text-xs text-zinc-500">{meta}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {actions}
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4">{children}</div>
    </article>
  );
}
