"use client";

import { ViewportAnimation } from "@/components/motion/viewport-animation";
import { VIEWPORT_WORD_STAGGER_PRESETS } from "@/components/motion/viewport-animation-presets";
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
        <ViewportAnimation
          type="word-stagger"
          text={text}
          triggerMode="immediate"
          {...VIEWPORT_WORD_STAGGER_PRESETS.hero}
        />
      ) : (
        text
      )}
    </h1>
  );
}
