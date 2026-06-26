import { createElement, useMemo } from "react";
import "./word-stagger-reveal.css";

export type WordStaggerRevealProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  direction?: "up" | "down" | "left" | "right";
  offset?: string | number;
  /** Per-word animation duration in ms */
  duration?: number;
  /** Delay between consecutive words in ms */
  stagger?: number;
  /** Initial delay before the first word starts in ms */
  startDelay?: number;
  /** Reverse the stagger order (last word starts first) */
  reverse?: boolean;
  fade?: boolean;
  blur?: boolean;
  active?: boolean;
  disabled?: boolean;
  restartKey?: string | number;
  className?: string;
  style?: React.CSSProperties;
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
  active = true,
  disabled = false,
  restartKey,
  className,
  style,
}: WordStaggerRevealProps) {
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
    return { idx, totalWords: counter };
  }, [words]);

  const offsetStr = toCssLength(offset);
  const { tx, ty } = offsetToTransform(direction, offsetStr);
  const totalWords = wordIndices.totalWords;
  const isActive = active && !disabled;

  return createElement(
    as,
    {
      key: restartKey,
      className: ["wsr-root", isActive ? "wsr-active" : "", disabled ? "wsr-static" : "", className]
        .filter(Boolean)
        .join(" "),
      style,
      "aria-label": text,
      "data-active": isActive ? "true" : "false",
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
      const delayMs = startDelay + order * stagger;
      const wordStyle: React.CSSProperties = {
        ["--wsr-duration" as never]: `${duration}ms`,
        ["--wsr-delay" as never]: `${delayMs}ms`,
        ["--wsr-tx" as never]: tx,
        ["--wsr-ty" as never]: ty,
        ["--wsr-opacity" as never]: fade ? 0 : 1,
        ["--wsr-filter" as never]: blur ? "blur(6px)" : "none",
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
