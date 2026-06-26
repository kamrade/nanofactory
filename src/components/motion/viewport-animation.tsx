"use client";

import { createElement } from "react";

import { WordStaggerReveal } from "@/components/ui/word-stagger-reveal";
import { useVisibleOnce } from "@/hooks/use-visible-once";
import { cx } from "@/lib/cn";
import {
  VIEWPORT_TRIGGER_THRESHOLD,
  VIEWPORT_WORD_STAGGER_DEFAULTS,
} from "./viewport-animation-presets";

type WordStaggerViewportAnimation = {
  type: "word-stagger";
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  triggerMode?: "viewport" | "immediate";
  direction?: "up" | "down" | "left" | "right";
  offset?: string | number;
  duration?: number;
  stagger?: number;
  startDelay?: number;
  reverse?: boolean;
  fade?: boolean;
  blur?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export type ViewportAnimationProps = {
  threshold?: number;
} & WordStaggerViewportAnimation;

export function ViewportAnimation({
  threshold = VIEWPORT_TRIGGER_THRESHOLD,
  type,
  text,
  as = "span",
  triggerMode = "viewport",
  direction = VIEWPORT_WORD_STAGGER_DEFAULTS.direction,
  offset = VIEWPORT_WORD_STAGGER_DEFAULTS.offset,
  duration = VIEWPORT_WORD_STAGGER_DEFAULTS.duration,
  stagger = VIEWPORT_WORD_STAGGER_DEFAULTS.stagger,
  startDelay = VIEWPORT_WORD_STAGGER_DEFAULTS.startDelay,
  reverse = VIEWPORT_WORD_STAGGER_DEFAULTS.reverse,
  fade = VIEWPORT_WORD_STAGGER_DEFAULTS.fade,
  blur = VIEWPORT_WORD_STAGGER_DEFAULTS.blur,
  className,
  style,
}: ViewportAnimationProps) {
  const { ref, visible } = useVisibleOnce<HTMLElement>({
    threshold,
    enabled: triggerMode === "viewport",
  });

  if (type !== "word-stagger" || !text.trim()) {
    return null;
  }

  return createElement(
    as,
    {
      ref,
      className: cx(className),
      style,
    },
    <WordStaggerReveal
      key={visible ? "visible" : "hidden"}
      as="span"
      text={text}
      active={visible}
      restartKey={visible ? "visible" : "hidden"}
      duration={duration}
      stagger={stagger}
      startDelay={startDelay}
      reverse={reverse}
      fade={fade}
      blur={blur}
      direction={direction}
      offset={offset}
    />,
  );
}
