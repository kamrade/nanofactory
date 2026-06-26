import { createElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./word-stagger-reveal.css";

export type WordStaggerRevealProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  direction?: "up" | "down" | "left" | "right";
  offset?: string | number;
  /** Per-word transition duration in ms */
  duration?: number;
  /** Delay between consecutive words in ms */
  stagger?: number;
  /** Initial delay before the first word starts in ms */
  startDelay?: number;
  /** Reverse the stagger order (last word starts first) */
  reverse?: boolean;
  fade?: boolean;
  blur?: boolean;
  restartKey?: string | number;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onStart?: () => void;
  onComplete?: (value: string) => void;
};

const toCssLength = (v: string | number): string =>
  typeof v === "number" ? `${v}px` : v;

function offsetToTransform(
  direction: "up" | "down" | "left" | "right",
  offset: string,
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

export function WordStaggerReveal({
  text,
  as = "span",
  direction = "up",
  offset = "16px",
  duration = 700,
  stagger = 80,
  startDelay = 0,
  reverse = false,
  fade = true,
  blur = false,
  restartKey,
  disabled = false,
  className,
  style,
  onStart,
  onComplete,
}: WordStaggerRevealProps) {
  const [phase, setPhase] = useState<Phase>(disabled ? "end" : "priming");
  const startTimer = useRef<number | null>(null);
  const completeTimer = useRef<number | null>(null);

  const words = useMemo(() => text.split(/(\s+)/), [text]);
  const wordIndices = useMemo(() => {
    const idx: number[] = [];
    let counter = 0;
    for (const token of words) {
      if (/^\s+$/.test(token) || token === "") {
        idx.push(-1);
      } else {
        idx.push(counter++);
      }
    }
    const totalWords = counter;
    return { idx, totalWords };
  }, [words]);

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
  }, [restartKey, disabled, direction, offset, fade, blur, text, reverse, stagger]);

  const totalDuration =
    duration + Math.max(0, wordIndices.totalWords - 1) * stagger;

  useEffect(() => {
    if (disabled) return;
    if (phase !== "priming") return;

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        startTimer.current = window.setTimeout(() => {
          onStart?.();
          setPhase("animating");
          completeTimer.current = window.setTimeout(() => {
            setPhase("end");
            onComplete?.(text);
          }, totalDuration);
        }, Math.max(0, startDelay));
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, disabled, startDelay, totalDuration, text]);

  useEffect(() => () => clearTimers(), []);

  const offsetStr = toCssLength(offset);
  const { tx, ty } = offsetToTransform(direction, offsetStr);
  const atOffset = phase === "priming" && !disabled;

  const totalWords = wordIndices.totalWords;

  return createElement(
    as,
    {
      className: [
        "wsr-root",
        disabled ? "wsr-static" : "",
        phase === "priming" ? "wsr-priming" : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
      style,
      "aria-label": text,
    },
    words.map((token, i) => {
      if (token === "") return null;
      if (/^\s+$/.test(token)) {
        return (
          <span key={i} className="wsr-space" aria-hidden="true">
            {token}
          </span>
        );
      }
      const wIdx = wordIndices.idx[i];
      const order = reverse ? totalWords - 1 - wIdx : wIdx;
      const delayMs = order * stagger;
      const wordStyle: React.CSSProperties = {
        ["--wsr-duration" as never]: `${duration}ms`,
        ["--wsr-delay" as never]: `${delayMs}ms`,
        ["--wsr-tx" as never]: atOffset ? tx : "0px",
        ["--wsr-ty" as never]: atOffset ? ty : "0px",
        ["--wsr-opacity" as never]: fade ? (atOffset ? 0 : 1) : 1,
        ["--wsr-filter" as never]: blur && atOffset ? "blur(6px)" : "blur(0px)",
      };
      return (
        <span key={i} className="wsr-word" style={wordStyle} aria-hidden="true">
          {token}
        </span>
      );
    }),
  );
}

export default WordStaggerReveal;
