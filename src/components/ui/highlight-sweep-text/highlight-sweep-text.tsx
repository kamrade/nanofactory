import { useEffect, useRef, useState, createElement } from "react";
import "./highlight-sweep-text.css";

export type HighlightSweepTextProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  color?: string;
  duration?: number;
  startDelay?: number;
  direction?: "left-to-right" | "right-to-left";
  thickness?: string | number;
  offsetY?: string | number;
  rounded?: boolean;
  restartKey?: string | number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onStart?: () => void;
  onComplete?: (value: string) => void;
};

function toCssSize(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HighlightSweepText({
  text,
  as = "span",
  color = "currentColor",
  duration = 700,
  startDelay = 0,
  direction = "left-to-right",
  thickness = "0.6em",
  offsetY = "0.1em",
  rounded = true,
  restartKey,
  disabled = false,
  className,
  style,
  onStart,
  onComplete,
}: HighlightSweepTextProps) {
  const [active, setActive] = useState(false);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onStartRef = useRef(onStart);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onStartRef.current = onStart;
    onCompleteRef.current = onComplete;
  }, [onStart, onComplete]);

  useEffect(() => {
    if (startTimerRef.current) clearTimeout(startTimerRef.current);
    if (completeTimerRef.current) clearTimeout(completeTimerRef.current);

    if (disabled || prefersReducedMotion()) {
      setActive(true);
      onStartRef.current?.();
      onCompleteRef.current?.(text);
      return;
    }

    setActive(false);

    startTimerRef.current = setTimeout(() => {
      setActive(true);
      onStartRef.current?.();
      completeTimerRef.current = setTimeout(() => {
        onCompleteRef.current?.(text);
      }, duration);
    }, Math.max(0, startDelay));

    return () => {
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      if (completeTimerRef.current) clearTimeout(completeTimerRef.current);
    };
  }, [text, duration, startDelay, disabled, restartKey]);

  const reducedMotion = typeof window !== "undefined" && prefersReducedMotion();
  const isInstant = disabled || reducedMotion;

  const barWrapStyle: React.CSSProperties = {
    height: toCssSize(thickness),
    bottom: `calc(-1 * ${toCssSize(offsetY)})`,
    top: "auto",
    borderRadius: rounded ? "0.15em" : 0,
  };

  const barStyle: React.CSSProperties = {
    background: color,
    transitionDuration: `${duration}ms`,
  };

  const dirClass = direction === "right-to-left" ? "hst-bar--rtl" : "hst-bar--ltr";
  const stateClass = isInstant ? "hst-bar--instant" : active ? "hst-bar--visible" : "";

  const children = [
    createElement(
      "span",
      {
        key: "bar",
        className: "hst-bar-wrap",
        "aria-hidden": true,
        style: barWrapStyle,
      },
      createElement("span", {
        className: `hst-bar ${dirClass} ${stateClass}`.trim(),
        style: barStyle,
      })
    ),
    createElement("span", { key: "text", className: "hst-text" }, text),
  ];

  return createElement(
    as as string,
    {
      className: ["hst-root", className].filter(Boolean).join(" "),
      style,
    },
    children
  );
}