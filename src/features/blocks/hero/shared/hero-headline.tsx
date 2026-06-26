"use client";

import { useVisibleOnce } from "@/hooks/use-visible-once";
import { TypewriterText } from "@/components/ui/typewriter-text";

type HeroHeadlineProps = {
  text: string;
  className: string;
  animateMainText?: boolean;
};

export function HeroHeadline({
  text,
  className,
  animateMainText = false,
}: HeroHeadlineProps) {
  const { ref, visible } = useVisibleOnce();

  return (
    <h1 ref={ref} className={className}>
      {animateMainText ? (
        <TypewriterText
          text={text}
          startDelay={visible ? 0 : 10_000_000}
          restartKey={visible ? 1 : 0}
          loop={false}
          showCursor
        />
      ) : (
        text
      )}
    </h1>
  );
}
