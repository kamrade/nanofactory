"use client";

import { UIImageZoomReveal } from "@/components/ui/image-zoom-reveal";
import { useViewportVisible } from "@/hooks/use-viewport-visible";

type HeroMediaImage = {
  src: string;
  alt: string;
  /** Optional class for light/dark switching applied to the inner <img>. */
  className?: string;
};

type HeroMediaProps = {
  /** Class for the media container (e.g. the split panel or full-bleed background). */
  panelClassName: string;
  ariaHidden?: boolean;
  /** One image, or a light/dark pair stacked on top of each other. */
  images: HeroMediaImage[];
  /** When true, the image gently zooms from 1.08 -> 1 as it enters the viewport. */
  animate: boolean;
};

export function HeroMedia({ panelClassName, ariaHidden, images, animate }: HeroMediaProps) {
  const { ref, visible } = useViewportVisible<HTMLDivElement>({ threshold: 0.35 });

  return (
    <div ref={ref} className={panelClassName} aria-hidden={ariaHidden}>
      {images.map((image) => (
        <UIImageZoomReveal
          key={image.className ?? image.src}
          src={image.src}
          alt={image.alt}
          fill
          unoptimized
          // When disabled, keyframe + animate:false renders a static scale(1).
          mode={animate ? "transition" : "keyframe"}
          animate={animate ? visible : false}
          duration={5600}
          startScale={1.08}
          endScale={1}
          // The wrapper must fill the media panel; inline style beats the
          // module `.root { position: relative }` so `fill` has a sized parent.
          wrapperStyle={{ position: "absolute", inset: 0 }}
          className={image.className}
        />
      ))}
    </div>
  );
}
