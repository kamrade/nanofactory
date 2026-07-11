"use client";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "./types";
import { TypographyButtonsCard } from "./typography-buttons-card";
import { TypographyBadgesCard } from "./typography-badges-card";
import { TypographyHeadingsCard } from "./typography-headings-card";

export function TypographyButtonsBadgesSection({ uiSize }: { uiSize: UiSize }) {
  return (
    <>
      <UikitSectionAnchor id="typography-buttons">
        <TypographyButtonsCard uiSize={uiSize} />
      </UikitSectionAnchor>

      <UikitSectionAnchor id="typography-headings">
        <TypographyHeadingsCard />
      </UikitSectionAnchor>

      <UikitSectionAnchor id="typography-badges">
        <TypographyBadgesCard uiSize={uiSize} />
      </UikitSectionAnchor>
    </>
  );
}
