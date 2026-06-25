import React, { useMemo } from "react";
import { useTypewriter } from "./use-typewriter";
import "./typewriter-text.css";

export type TypewriterTextProps = {
  text?: string;
  texts?: string[];
  as?: keyof React.JSX.IntrinsicElements;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseBeforeDelete?: number;
  pauseBeforeNext?: number;
  startDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorCharacter?: string;
  cursorBlinkSpeed?: number;
  preserveWhitespace?: boolean;
  restartKey?: string | number;
  className?: string;
  style?: React.CSSProperties;
  onTypingStart?: () => void;
  onTypingComplete?: (value: string) => void;
  onDeleteComplete?: (value: string) => void;
  onCycleComplete?: (index: number) => void;
};

function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

export function TypewriterText({
  text,
  texts: textsProp,
  as: Tag = "span",
  typingSpeed = 60,
  deletingSpeed = 40,
  pauseBeforeDelete = 1500,
  pauseBeforeNext = 500,
  startDelay = 0,
  loop = false,
  showCursor = false,
  cursorCharacter = "|",
  cursorBlinkSpeed = 530,
  preserveWhitespace = false,
  restartKey,
  className,
  style,
  onTypingStart,
  onTypingComplete,
  onDeleteComplete,
  onCycleComplete,
}: TypewriterTextProps) {
  const prefersReducedMotion = useReducedMotion();

  const resolvedTexts = useMemo(() => {
    if (text != null) return [text];
    if (textsProp != null && textsProp.length > 0) return textsProp;
    return [""];
  }, [text, textsProp]);

  const { displayText, fullText, phase } = useTypewriter({
    texts: resolvedTexts,
    typingSpeed,
    deletingSpeed,
    pauseBeforeDelete,
    pauseBeforeNext,
    startDelay,
    loop,
    shouldAnimate: !prefersReducedMotion,
    restartKey,
    onTypingStart,
    onTypingComplete,
    onDeleteComplete,
    onCycleComplete,
  });

  const shownText = prefersReducedMotion ? resolvedTexts[0] ?? "" : displayText;
  const ariaLabel = prefersReducedMotion ? shownText : fullText;

  const whiteSpaceStyle: React.CSSProperties | undefined = preserveWhitespace
    ? { whiteSpace: "pre-wrap" }
    : undefined;

  const cursorEl = showCursor && phase !== "done" ? (
    <span
      aria-hidden="true"
      className={`typewriter-cursor${
        phase !== "typing" && phase !== "deleting" ? " typewriter-cursor--blink" : ""
      }`}
      style={{ "--typewriter-blink-speed": `${cursorBlinkSpeed}ms` } as React.CSSProperties}
    >
      {cursorCharacter}
    </span>
  ) : null;

  return React.createElement(
    Tag as string,
    {
      className,
      style: { ...whiteSpaceStyle, ...style },
      "aria-label": ariaLabel,
      role: "text" as string,
    },
    <>
      <span aria-hidden="true">{shownText}</span>
      {cursorEl}
    </>
  );
}

export default TypewriterText;
