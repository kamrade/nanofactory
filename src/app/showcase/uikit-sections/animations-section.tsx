"use client";

import { HighlightSweepHoverSection, HighlightSweepScrollSection } from "./highlight-sweep-section";
import { OffsetRevealScrollSection, OffsetRevealSection } from "./offset-reveal-section";
import { WordStaggerRevealSection } from "./word-stagger-reveal-section";
import { WordStaggerRevealScrollSection } from "./word-stagger-reveal-scroll-section";
import type { UiSize } from "./types";

type AnimationsSectionProps = {
  uiSize: UiSize;
};

export function AnimationsSection({ uiSize }: AnimationsSectionProps) {
  return (
    <div className="grid gap-8">
      <HighlightSweepScrollSection />
      <HighlightSweepHoverSection />
      <OffsetRevealSection uiSize={uiSize} />
      <OffsetRevealScrollSection />
      <WordStaggerRevealSection uiSize={uiSize} />
      <WordStaggerRevealScrollSection />
    </div>
  );
}
