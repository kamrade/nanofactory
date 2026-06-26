"use client";

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
  return (
    <h1 className={className}>
      {animateMainText ? (
        <TypewriterText
          text={text}
          startDelay={0}
          restartKey={1}
          loop={false}
          showCursor
        />
      ) : (
        text
      )}
    </h1>
  );
}
