"use client";

import { useEffect, useRef, useState } from "react";

import { UICard } from "@/components/ui/card";
import { UIImageZoomReveal } from "@/components/ui/image-zoom-reveal";
import { useViewportVisible } from "@/hooks/use-viewport-visible";

import { UikitSectionAnchor } from "./section-anchor";

export function ImageZoomScrollRevealSection() {
  const { ref, visible } = useViewportVisible<HTMLDivElement>({ threshold: 0.35 });
  const [restartKey, setRestartKey] = useState(0);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    if (visible && !wasVisibleRef.current) {
      setRestartKey((key) => key + 1);
    }

    wasVisibleRef.current = visible;
  }, [visible]);

  return (
    <UikitSectionAnchor id="image-zoom-scroll-reveal">
      <UICard title="UIKit · Image Zoom Reveal / Scroll Trigger">
        <div ref={ref} className="overflow-hidden rounded-3xl border border-line bg-surface-alt p-4">
          <UIImageZoomReveal
            key={restartKey}
            src="/showcase/example-image.avif"
            alt="Abstract hero demo image"
            fill
            unoptimized
            animate={visible}
            restartKey={restartKey}
            duration={5600}
            startScale={1.08}
            endScale={1}
            wrapperClassName="aspect-[16/9] w-full"
          />
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}
