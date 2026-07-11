"use client";

import { FiArrowRight, FiPlus, FiSettings } from "react-icons/fi";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIDivider } from "@/components/ui/divider";

import type { UiSize } from "./types";

export function TypographyButtonsCard({ uiSize }: { uiSize: UiSize }) {
  const buttonThemes = ["base", "primary", "danger"] as const;
  const buttonVariants = ["text", "contained", "outlined"] as const;

  return (
    <UICard title="Buttons">
      <p className="text-sm text-text-muted">
        Themes: <code>base</code>, <code>primary</code>, <code>danger</code> · Variants: <code>text</code>,{" "}
        <code>contained</code>, <code>outlined</code> · Sizes: <code>sm</code>, <code>lg</code>
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
  );
}
