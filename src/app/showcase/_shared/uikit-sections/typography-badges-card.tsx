"use client";

import { FiPlus, FiSettings, FiTrash2 } from "react-icons/fi";

import { UIBadge } from "@/components/ui/badge";
import { UICard } from "@/components/ui/card";
import { UIDivider } from "@/components/ui/divider";

import type { UiSize } from "./types";

export function TypographyBadgesCard({
  uiSize,
  borderRadius = "lg",
}: {
  uiSize: UiSize;
  borderRadius?: "none" | "md" | "lg";
}) {
  const badgeThemes = ["base", "primary", "danger"] as const;

  return (
    <UICard title="Badges">
      <p className="text-sm text-text-muted">
        Same themes as buttons, variants: <code>contained</code>, <code>outlined</code>, sizes: <code>sm</code>,{" "}
        <code>md</code>, <code>lg</code>, border radius: <code>none</code>, <code>md</code>, <code>lg</code>.
      </p>
      <div className="grid gap-3">
        {badgeThemes.map((badgeTheme) => (
          <div key={badgeTheme} className="flex flex-wrap items-center gap-3">
            {(["contained", "outlined"] as const).map((variant) => (
              <UIBadge
                key={`${badgeTheme}-${variant}-ui`}
                theme={badgeTheme}
                variant={variant}
                size={uiSize}
                borderRadius={borderRadius}
              >
                {badgeTheme} · {variant} · {uiSize}
              </UIBadge>
            ))}
          </div>
        ))}

        <UIDivider spacing="sm" />
        <p className="text-sm font-medium text-text-muted">With Icons</p>
        <div className="flex flex-wrap items-center gap-3">
          <UIBadge theme="primary" variant="contained" size={uiSize} borderRadius={borderRadius}>
            <FiPlus aria-hidden className="h-4 w-4" />
            <span>Create</span>
          </UIBadge>
          <UIBadge theme="base" variant="outlined" size={uiSize} borderRadius={borderRadius}>
            <span>Status</span>
            <FiSettings aria-hidden className="h-4 w-4" />
          </UIBadge>
          <UIBadge theme="danger" variant="contained" size={uiSize} borderRadius={borderRadius}>
            <FiTrash2 aria-hidden className="h-4 w-4" />
            <span>Danger</span>
          </UIBadge>
        </div>
      </div>
    </UICard>
  );
}
