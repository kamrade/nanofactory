"use client";

import { useVisibleOnce } from "@/hooks/use-visible-once";

type HeroAnimationState = {
  visibleRef: ReturnType<typeof useVisibleOnce>["ref"];
  visible: boolean;
  eyebrowDelay: number;
  titleDelay: number;
  subtitleDelay: number;
  buttonDelay: number;
};

export function useHeroAnimationState(
  eyebrow: string,
  animateContent: boolean
): HeroAnimationState {
  const { ref: visibleRef, visible } = useVisibleOnce();
  const hasEyebrow = eyebrow.trim().length > 0;
  const delayFor = (index: number) => (animateContent && visible ? index * 100 : 10_000_000);

  return {
    visibleRef,
    visible,
    eyebrowDelay: delayFor(0),
    titleDelay: delayFor(hasEyebrow ? 1 : 0),
    subtitleDelay: delayFor(hasEyebrow ? 2 : 1),
    buttonDelay: delayFor(hasEyebrow ? 3 : 2),
  };
}
