"use client";

import type { ReactNode } from "react";
import { UIButton } from "@/components/ui/button";
import { UIDivider } from "@/components/ui/divider";

type BlockChromeProps = {
  index: number;
  title: string;
  onDelete: () => void;
  actions?: ReactNode;
  children: ReactNode;
};

export function BlockChrome({
  index,
  title,
  onDelete,
  actions,
  children,
}: BlockChromeProps) {
  return (
    <article className="rounded-2xl border border-line bg-surface-alt p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-text-main">
            Block {index + 1}: {title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {actions}
          <UIButton
            type="button"
            onClick={onDelete}
            theme="danger"
            variant="outlined"
            size="sm"
          >
            Delete
          </UIButton>
        </div>

      </div>

      <UIDivider spacing="sm" />

      <div className="mt-5 grid gap-4">{children}</div>
    </article>
  );
}
