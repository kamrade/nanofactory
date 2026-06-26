"use client";

import type { ReactNode } from "react";

import { useVisibleOnce } from "@/hooks/use-visible-once";
import { cx } from "@/lib/cn";

type VisibleOnceProps = {
  threshold?: number;
  className?: string;
  hiddenClassName?: string;
  children: ReactNode;
};

export function VisibleOnce({
  threshold = 0.3,
  className,
  hiddenClassName,
  children,
}: VisibleOnceProps) {
  const { ref, visible } = useVisibleOnce(threshold);

  return (
    <div ref={ref} className={cx(className, !visible && hiddenClassName)}>
      {children}
    </div>
  );
}
