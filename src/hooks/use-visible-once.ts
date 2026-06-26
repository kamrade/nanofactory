"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseVisibleOnceOptions = {
  threshold?: number;
  enabled?: boolean;
};

export function useVisibleOnce<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.3,
  enabled = true,
}: UseVisibleOnceOptions = {}) {
  // The caller attaches this ref to the element we want to observe.
  const ref = useRef<T | null>(null);
  // Once the element enters the viewport, this flips to true and stays true.
  const [visible, setVisible] = useState(!enabled);
  const didRevealRef = useRef(false);

  const markVisible = useCallback(() => {
    if (didRevealRef.current) {
      return;
    }

    didRevealRef.current = true;
    console.log("[viewport] element became visible", { threshold });
    setVisible(true);
  }, [threshold]);

  const setNode = useCallback((node: T | null) => {
    ref.current = node;

    if (!enabled || !node || didRevealRef.current) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleWidth = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);

    if (visibleWidth > 0 && visibleHeight > 0) {
      const visibleArea = visibleWidth * visibleHeight;
      const totalArea = rect.width * rect.height;
      if (totalArea > 0 && visibleArea / totalArea >= threshold) {
        markVisible();
      }
    }
  }, [enabled, markVisible, threshold]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const el = ref.current;
    if (!el || didRevealRef.current) return;

    // Observe the element until enough of it is inside the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // This hook is one-way: after the first reveal we stop observing.
          markVisible();
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, markVisible, threshold]);

  return {
    ref: enabled ? setNode : undefined,
    visible,
  };
}
