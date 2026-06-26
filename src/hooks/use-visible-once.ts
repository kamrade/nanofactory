"use client";

import { useEffect, useRef, useState } from "react";

export function useVisibleOnce(threshold = 0.3) {
  // The caller attaches this ref to the element we want to observe.
  const ref = useRef<HTMLDivElement | null>(null);
  // Once the element enters the viewport, this flips to true and stays true.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    // Observe the element until enough of it is inside the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // This hook is one-way: after the first reveal we stop observing.
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, threshold]);

  return { ref, visible };
}
