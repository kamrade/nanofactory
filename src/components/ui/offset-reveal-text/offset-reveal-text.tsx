import { createElement, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./offset-reveal-text.css";

export type OffsetRevealTextProps = {
  text?: string;
  children?: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  direction?: "up" | "down" | "left" | "right";
  offset?: string | number;
  duration?: number;
  startDelay?: number;
  fade?: boolean;
  blur?: boolean;
  restartKey?: string | number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onStart?: () => void;
  onComplete?: (value: string) => void;
};

export type OffsetRevealProps = OffsetRevealTextProps;

const toCssLength = (v: string | number): string =>
  typeof v === "number" ? `${v}px` : v;

function offsetToTransform(
  direction: "up" | "down" | "left" | "right",
  offset: string
): { tx: string; ty: string } {
  switch (direction) {
    case "up":
      return { tx: "0px", ty: offset };
    case "down":
      return { tx: "0px", ty: `-${offset}` };
    case "left":
      return { tx: offset, ty: "0px" };
    case "right":
      return { tx: `-${offset}`, ty: "0px" };
  }
}

type Phase = "priming" | "animating" | "end";

export function OffsetReveal({
  text,
  children,
  as = "span",
  direction = "down",
  offset = "24px",
  duration = 900,
  startDelay = 0,
  fade = false,
  blur = false,
  restartKey,
  disabled = false,
  className,
  style,
  onStart,
  onComplete,
}: OffsetRevealProps) {
  // priming   = transition disabled, transform at offset (snap)
  // animating = transition enabled, transform at origin (in-flight)
  // end       = settled at origin
  const [phase, setPhase] = useState<Phase>(disabled ? "end" : "priming");
  const startTimer = useRef<number | null>(null);
  const completeTimer = useRef<number | null>(null);

  const clearTimers = () => {
    if (startTimer.current !== null) {
      window.clearTimeout(startTimer.current);
      startTimer.current = null;
    }
    if (completeTimer.current !== null) {
      window.clearTimeout(completeTimer.current);
      completeTimer.current = null;
    }
  };

  useLayoutEffect(() => {
    clearTimers();
    if (disabled) {
      setPhase("end");
      return;
    }
    setPhase("priming");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restartKey, disabled, direction, offset, fade, blur]);

  useEffect(() => {
    if (disabled) return;
    if (phase !== "priming") return;

    // Two RAFs: first commits the primed (no-transition) offset state,
    // second flips to animating so the transition runs offset -> origin.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        startTimer.current = window.setTimeout(() => {
          onStart?.();
          setPhase("animating");
          completeTimer.current = window.setTimeout(() => {
            setPhase("end");
            onComplete?.(text ?? "");
          }, duration);
        }, Math.max(0, startDelay));
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, disabled, startDelay, duration, text]);

  useEffect(() => () => clearTimers(), []);

  const offsetStr = toCssLength(offset);
  const { tx, ty } = offsetToTransform(direction, offsetStr);

  const atOffset = phase === "priming" && !disabled;

  const cssVars: React.CSSProperties = {
    ["--ort-duration" as never]: `${duration}ms`,
    ["--ort-delay" as never]: `0ms`,
    ["--ort-tx" as never]: atOffset ? tx : "0px",
    ["--ort-ty" as never]: atOffset ? ty : "0px",
    ["--ort-opacity" as never]: fade ? (atOffset ? 0 : 1) : 1,
    ["--ort-filter" as never]: blur && atOffset ? "blur(6px)" : "blur(0px)",
  };

  const mergedStyle: React.CSSProperties = { ...cssVars, ...style };

  return createElement(
    as as string,
    {
      className: [
        "ort-root",
        disabled ? "ort-static" : "",
        phase === "priming" ? "ort-priming" : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style: mergedStyle,
      ...(text ? { "aria-label": text } : {}),
    },
    children ?? text
  );
}

export const OffsetRevealText = OffsetReveal;
export default OffsetRevealText;
