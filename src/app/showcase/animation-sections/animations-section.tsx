"use client";

import { HighlightSweepSection, HighlightSweepHoverSection, HighlightSweepScrollSection } from "./highlight-sweep-section";
import { ImageZoomScrollRevealSection } from "./image-zoom-scroll-reveal-section";
import { ImageZoomRevealSection } from "./image-zoom-reveal-section";
import { OffsetRevealSection, OffsetRevealScrollSection } from "./offset-reveal-section";
import { TypewriterSection } from "./typewriter-section";
import { TypewriterViewportSection } from "./typewriter-viewport-section";
import { ViewportRevealSection } from "./viewport-reveal-section";
import { WordStaggerRevealSection } from "./word-stagger-reveal-section";
import { WordStaggerRevealScrollSection } from "./word-stagger-reveal-scroll-section";
import type { UiSize } from "../uikit-sections";

type AnimationsSectionProps = {
  uiSize: UiSize;
};

export function AnimationsSection({ uiSize }: AnimationsSectionProps) {
  return (
    <div className="grid gap-8">
      <ImageZoomScrollRevealSection />
      <ImageZoomRevealSection />
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
