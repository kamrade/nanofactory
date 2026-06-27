"use client";

import { TypewriterText } from "@/components/ui/typewriter-text";
import { UICard } from "@/components/ui/card";
import { useViewportVisible } from "@/hooks/use-viewport-visible";

import { UikitSectionAnchor } from "./section-anchor";

function ViewportTypewriterPreview() {
  const { ref, visible } = useViewportVisible<HTMLDivElement>({ threshold: 0.35 });
  const shouldAnimate = visible;
  const key = visible ? "in" : "out";

  return (
    <div
      ref={ref}
      className="flex min-h-[120px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-surface-alt px-6 py-8"
    >
      <div className="max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">Viewport trigger</p>
        <p className="mt-3 text-h2 font-bold text-text-main">
          <TypewriterText
            key={key}
            text="TypewriterText types in on enter and deletes on exit."
            direction={visible ? "in" : "out"}
            typingSpeed={42}
            deletingSpeed={26}
            pauseBeforeDelete={700}
            pauseBeforeNext={300}
            startDelay={120}
            loop={false}
            showCursor
            restartKey={key}
            className="inline"
          />
        </p>
        <p className="mt-3 text-sm text-text-muted">
          Scroll the block into view to reveal the text; scroll away to remove it.
        </p>
      </div>
    </div>
  );
}

export function TypewriterViewportSection() {
  return (
    <UikitSectionAnchor id="typewriter-viewport">
      <UICard title="UIKit · TypewriterText / Viewport Trigger">
        <ViewportTypewriterPreview />
      </UICard>
    </UikitSectionAnchor>
  );
}
