"use client";

import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";

export type UIStickyHeaderProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  children: ReactNode;
  contentClassName?: string;
  revealOnScrollUp?: boolean;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UIStickyHeader({
  children,
  className,
  contentClassName,
  revealOnScrollUp = false,
  ...props
}: UIStickyHeaderProps) {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const delta = 8;

    function onScroll() {
      const currentY = window.scrollY;
      setScrolled(currentY > 8);

      if (!revealOnScrollUp) {
        setHidden(false);
        lastY = currentY;
        return;
      }

      if (currentY <= 8) {
        setHidden(false);
        lastY = currentY;
        return;
      }

      if (currentY - lastY > delta) {
        setHidden(true);
      } else if (lastY - currentY > delta) {
        setHidden(false);
      }

      lastY = currentY;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [revealOnScrollUp]);

  return (
    <header
      className={cx(
        "sticky top-0 z-40 bg-bg/95 text-text-main backdrop-blur transition-transform duration-300 ease-out supports-[backdrop-filter]:bg-bg/85",
        hidden && "pointer-events-none -translate-y-full",
        scrolled && !hidden && "shadow-[0_0_30px_rgba(0,0,0,0.1)]",
        className
      )}
      {...props}
    >
      <div className={cx("mx-auto flex container flex-col gap-3 px-4 py-4", contentClassName)}>
        {children}
      </div>
    </header>
  );
}
