"use client";

import { TypewriterText } from "@/components/ui/typewriter-text";
import { cx } from "@/lib/cn";

import styles from "./hero-headline.module.css";

type HeroHeadlineProps = {
  text: string;
  variant: "default" | "centered";
  animateMainText?: boolean;
};

export function HeroHeadline({
  text,
  variant,
  animateMainText = false,
}: HeroHeadlineProps) {
  return (
    <h1 className={cx(styles.headline, styles[variant])}>
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
