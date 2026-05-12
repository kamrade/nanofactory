"use client";

import { FiArrowRight, FiPlus, FiSettings, FiTrash2 } from "react-icons/fi";

import { UIBadge } from "@/components/ui/badge";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIDivider } from "@/components/ui/divider";

import type { UiSize } from "./types";

export function TypographyButtonsBadgesSection({ uiSize }: { uiSize: UiSize }) {
  const buttonThemes = ["base", "primary", "danger"] as const;
  const buttonVariants = ["text", "contained", "outlined"] as const;

  return (
    <>
      <UICard title="Typography · Headings">
        <div className="grid gap-3">
          <h1 className="text-h1">Pride and Prejudice</h1>
          <h2 className="text-h2 text-text-placeholder">Chapter I</h2>
          <h3 className="text-h3">It is a truth universally acknowledged</h3>
          <p>It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>
        </div>
      </UICard>

      <UICard title="UIKit · Buttons">
        <p className="text-sm text-text-muted">
          Themes: <code>base</code>, <code>primary</code>, <code>danger</code> · Variants: <code>text</code>, <code>contained</code>, <code>outlined</code> · Sizes: <code>sm</code>, <code>lg</code>
        </p>

        {buttonThemes.map((buttonTheme) => (
          <div key={buttonTheme} className="grid gap-3">
            {buttonVariants.map((variant) => (
              <div key={`${buttonTheme}-${variant}`} className="flex flex-wrap items-center gap-3">
                <UIButton key={`${buttonTheme}-${variant}-${uiSize}`} theme={buttonTheme} variant={variant} size={uiSize}>
                  {buttonTheme} · {variant} · {uiSize}
                </UIButton>
              </div>
            ))}
          </div>
        ))}

        <UIDivider spacing="md" stripped />
        <UIDivider spacing="sm" />

        <div className="grid gap-3">
          <p className="text-sm font-medium text-text-muted">With Icons</p>
          <div className="flex flex-wrap items-center gap-3">
            <UIButton theme="primary" variant="contained" size={uiSize}>
              <FiPlus aria-hidden className="h-4 w-4" />
              <span>Create</span>
            </UIButton>
            <UIButton theme="base" variant="outlined" size={uiSize}>
              <span>Continue</span>
              <FiArrowRight aria-hidden className="h-4 w-4" />
            </UIButton>
            <UIButton aria-label="Settings" theme="base" variant="text" size={uiSize} iconButton>
              <FiSettings aria-hidden className="h-4 w-4" />
            </UIButton>
          </div>
        </div>

        <UIDivider spacing="md" />
        <div className="grid gap-3">
          <p className="text-sm font-medium text-text-muted">Block</p>
          <UIButton theme="primary" variant="contained" size={uiSize} block>
            Primary Block Button
          </UIButton>
        </div>

        <UIDivider spacing="lg" />
        <div className="grid gap-3">
          <p className="text-sm font-medium text-text-muted">Disabled</p>
          <div className="flex flex-wrap items-center gap-3">
            <UIButton theme="base" variant="contained" size={uiSize} disabled>
              Base Disabled
            </UIButton>
            <UIButton theme="primary" variant="contained" size={uiSize} disabled>
              Primary Disabled
            </UIButton>
          </div>
        </div>
      </UICard>

      <UICard title="UIKit · Badges">
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
    </>
  );
}
