"use client";

import { HighlightSweepSection, HighlightSweepHoverSection, HighlightSweepScrollSection } from "./highlight-sweep-section";
import { OffsetRevealSection, OffsetRevealScrollSection } from "./offset-reveal-section";
import { TypewriterViewportSection } from "./typewriter-viewport-section";
import { ViewportRevealSection } from "./viewport-reveal-section";
import { WordStaggerRevealSection } from "./word-stagger-reveal-section";
import { WordStaggerRevealScrollSection } from "./word-stagger-reveal-scroll-section";
import { TypewriterSection } from "./typewriter-section";
import type { UiSize } from "./types";

type AnimationsSectionProps = {
  uiSize: UiSize;
};

export function AnimationsSection({ uiSize }: AnimationsSectionProps) {
  return (
    <div className="grid gap-8">
      <TypewriterSection uiSize={uiSize} />
      <HighlightSweepSection uiSize={uiSize} />
      <HighlightSweepScrollSection />
      <HighlightSweepHoverSection />
      <OffsetRevealSection uiSize={uiSize} />
      <OffsetRevealScrollSection />
      <WordStaggerRevealSection uiSize={uiSize} />
      <WordStaggerRevealScrollSection />
      <TypewriterViewportSection />
      <ViewportRevealSection />
    </div>
  );
}
