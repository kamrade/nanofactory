"use client";

import { ViewportAnimation } from "@/components/motion/viewport-animation";
import { VIEWPORT_WORD_STAGGER_PRESETS } from "@/components/motion/viewport-animation-presets";
import { cx } from "@/lib/cn";

import styles from "./hero-headline.module.css";

type HeroHeadlineProps = {
  text: string;
  variant: "default" | "centered";
  animate?: boolean;
};

export function HeroHeadline({
  text,
  variant,
  animate = false,
}: HeroHeadlineProps) {
  return (
    <h1 className={cx(styles.headline, styles[variant])}>
      {animate ? (
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
