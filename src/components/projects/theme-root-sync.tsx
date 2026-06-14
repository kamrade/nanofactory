"use client";

import { useLayoutEffect } from "react";

type ThemeRootSyncProps = {
  rootSelector?: string;
};

function readRootScope(rootSelector: string) {
  if (typeof document === "undefined") {
    return null;
  }

  return document.querySelector<HTMLElement>(rootSelector);
}

export function ThemeRootSync({ rootSelector = "main[data-theme][data-mode]" }: ThemeRootSyncProps) {
  useLayoutEffect(() => {
    const scope = readRootScope(rootSelector);
    if (!scope) {
      return;
    }

    const html = document.documentElement;
    const previousTheme = html.getAttribute("data-theme");
    const previousMode = html.getAttribute("data-mode");

    const sync = () => {
      const nextTheme = scope.getAttribute("data-theme");
      const nextMode = scope.getAttribute("data-mode");

      if (nextTheme) {
        html.setAttribute("data-theme", nextTheme);
      } else {
        html.removeAttribute("data-theme");
      }

      if (nextMode) {
        html.setAttribute("data-mode", nextMode);
      } else {
        html.removeAttribute("data-mode");
      }
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(scope, {
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    return () => {
      observer.disconnect();

      if (previousTheme) {
        html.setAttribute("data-theme", previousTheme);
      } else {
        html.removeAttribute("data-theme");
      }

      if (previousMode) {
        html.setAttribute("data-mode", previousMode);
      } else {
        html.removeAttribute("data-mode");
      }
    };
  }, [rootSelector]);

  return null;
}
