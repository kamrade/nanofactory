"use client";

import { FiPlus, FiSettings, FiTrash2 } from "react-icons/fi";

import { UIBadge } from "@/components/ui/badge";
import { UICard } from "@/components/ui/card";
import { UIDivider } from "@/components/ui/divider";

import type { UiSize } from "./types";

export function TypographyBadgesCard({ uiSize }: { uiSize: UiSize }) {
  const buttonThemes = ["base", "primary", "danger"] as const;

  return (
    <UICard title="Badges">
      <p className="text-sm text-text-muted">
        Same themes as buttons, variants: <code>contained</code>, <code>outlined</code>, with fully rounded corners.
      </p>
      <div className="grid gap-3">
        {buttonThemes.map((badgeTheme) => (
          <div key={badgeTheme} className="flex flex-wrap items-center gap-3">
            {(["contained", "outlined"] as const).map((variant) => (
              <UIBadge key={`${badgeTheme}-${variant}-ui`} theme={badgeTheme} variant={variant} size={uiSize}>
                {badgeTheme} · {variant} · {uiSize}
              </UIBadge>
            ))}
          </div>
        ))}

        <UIDivider spacing="sm" />
        <p className="text-sm font-medium text-text-muted">With Icons</p>
        <div className="flex flex-wrap items-center gap-3">
          <UIBadge theme="primary" variant="contained" size={uiSize}>
            <FiPlus aria-hidden className="h-4 w-4" />
            <span>Create</span>
          </UIBadge>
          <UIBadge theme="base" variant="outlined" size={uiSize}>
            <span>Status</span>
            <FiSettings aria-hidden className="h-4 w-4" />
          </UIBadge>
          <UIBadge theme="danger" variant="contained" size={uiSize}>
            <FiTrash2 aria-hidden className="h-4 w-4" />
            <span>Danger</span>
          </UIBadge>
        </div>
      </div>
    </UICard>
  );
}
