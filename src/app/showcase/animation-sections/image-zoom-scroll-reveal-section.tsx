"use client";

import { UICard } from "@/components/ui/card";
import { UIImageZoomReveal } from "@/components/ui/image-zoom-reveal";
import { useViewportVisible } from "@/hooks/use-viewport-visible";

import { UikitSectionAnchor } from "./section-anchor";

export function ImageZoomScrollRevealSection() {
  const { ref, visible } = useViewportVisible<HTMLDivElement>({ threshold: 0.35 });

  return (
    <UikitSectionAnchor id="image-zoom-scroll-reveal">
      <UICard title="UIKit · Image Zoom Reveal / Scroll Trigger">
        <div ref={ref} className="overflow-hidden rounded-3xl border border-line bg-surface-alt p-4">
          <UIImageZoomReveal
            src="/showcase/example-image.avif"
            alt="Abstract hero demo image"
            fill
            unoptimized
            mode="transition"
            animate={visible}
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
