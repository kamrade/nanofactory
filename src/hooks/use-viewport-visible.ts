"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseViewportVisibleOptions = {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
};

export function useViewportVisible<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.35,
  rootMargin = "0px",
  enabled = true,
}: UseViewportVisibleOptions = {}) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  const setNode = useCallback((node: T | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    if (!enabled) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, threshold, rootMargin]);

  return {
    ref: setNode,
    visible,
  };
}
