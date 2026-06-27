import Image, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";

import { cx } from "@/lib/cn";

import styles from "./image-zoom-reveal.module.css";

type UIImageZoomRevealProps = Omit<ImageProps, "src" | "alt" | "className" | "style"> & {
  src: ImageProps["src"];
  alt: string;
  wrapperClassName?: string;
  wrapperStyle?: CSSProperties;
  className?: string;
  style?: CSSProperties;
  radius?: string | number;
  fit?: CSSProperties["objectFit"];
  /**
   * - `"keyframe"`: replays a one-shot zoom from start -> end whenever `animate` is true.
   * - `"transition"`: rests at start scale while `animate` is false and smoothly
   *   transitions to end scale when `animate` becomes true (and back again on leave).
   */
  mode?: "keyframe" | "transition";
  animate?: boolean;
  duration?: number;
  startDelay?: number;
  startScale?: number;
  endScale?: number;
  easing?: string;
  restartKey?: string | number;
};

export type { UIImageZoomRevealProps };

function toCssSize(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}

export function UIImageZoomReveal({
  src,
  alt,
  wrapperClassName,
  wrapperStyle,
  className,
  style,
  radius,
  fit = "cover",
  mode = "keyframe",
  animate = true,
  duration = 6000,
  startDelay = 0,
  startScale = 1,
  endScale = 1,
  easing = "cubic-bezier(0.22, 1, 0.36, 1)",
  restartKey,
  ...props
}: UIImageZoomRevealProps) {
  const mergedWrapperStyle: CSSProperties = {
    borderRadius: radius != null ? toCssSize(radius) : undefined,
    ...wrapperStyle,
    ["--image-zoom-duration" as never]: `${duration}ms`,
    ["--image-zoom-delay" as never]: `${startDelay}ms`,
    ["--image-zoom-start" as never]: `${startScale}`,
    ["--image-zoom-end" as never]: `${endScale}`,
    ["--image-zoom-easing" as never]: easing,
  };

  return (
    <div
      key={restartKey}
      className={cx(styles.root, wrapperClassName)}
      style={mergedWrapperStyle}
    >
      <Image
        {...props}
        src={src}
        alt={alt}
        className={cx(
          styles.image,
          mode === "keyframe" && animate && styles.animated,
          mode === "keyframe" && !animate && styles.static,
          mode === "transition" && styles.transition,
          mode === "transition" && animate && styles.transitionRevealed,
          className
        )}
        style={{
          objectFit: fit,
          ...style,
        }}
      />
    </div>
  );
}
