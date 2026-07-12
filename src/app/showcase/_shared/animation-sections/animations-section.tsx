"use client";

import type { ReactNode } from "react";

import { ShowcaseSidebar } from "@/app/showcase/_shared/showcase-sidebar";

import { animationsSectionNavItems } from "./nav";
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
  topContent?: ReactNode;
};

export function AnimationsSection({ uiSize, topContent }: AnimationsSectionProps) {
  return (
    <section className="bg-bg py-8 text-text-main">
      <div className="mx-auto container px-4">
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <ShowcaseSidebar
            sections={animationsSectionNavItems}
            title="Animations"
            ariaLabel="Animations sections"
            topContent={topContent}
          />
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
        </div>
      </div>
    </section>
  );
}
