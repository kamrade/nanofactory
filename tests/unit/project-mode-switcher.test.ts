import { describe, expect, it, vi } from "vitest";

import {
  applyModeToRoot,
  readModeFromRoot,
} from "@/lib/dom-utils";
import {
  syncModeToCookie,
  syncModeToUrl,
} from "@/components/projects/project-mode-switcher";

describe("project mode switcher helpers", () => {
  it("sets dark mode on the nearest project root", () => {
    const setAttribute = vi.fn();
    const node = {
      closest: vi.fn(() => ({
        setAttribute,
      })),
    };

    applyModeToRoot(node, "dark");

    expect(node.closest).toHaveBeenCalledWith("[data-theme]");
    expect(setAttribute).toHaveBeenCalledWith("data-mode", "dark");
  });

  it("sets light mode on the nearest project root", () => {
    const setAttribute = vi.fn();
    const node = {
      closest: vi.fn(() => ({
        setAttribute,
      })),
    };

    applyModeToRoot(node, "light");

    expect(setAttribute).toHaveBeenCalledWith("data-mode", "light");
  });

  it("reads current mode from root and falls back to light", () => {
    const darkNode = {
      closest: () => ({
        setAttribute: () => undefined,
        getAttribute: () => "dark",
      }),
    };
    const unknownNode = {
      closest: () => ({
        setAttribute: () => undefined,
        getAttribute: () => "sepia",
      }),
    };

    expect(readModeFromRoot(darkNode)).toBe("dark");
    expect(readModeFromRoot(unknownNode)).toBe("light");
    expect(readModeFromRoot(null)).toBe("light");
  });

  it("syncs mode to URL search params via replaceState", () => {
    const originalWindow = (globalThis as { window?: unknown }).window;
    const replaceState = vi.fn();
    (globalThis as { window: unknown }).window = {
      location: {
        href: "https://example.com/p/demo?theme=sunwash#top",
      },
      history: {
        replaceState,
      },
    };

    try {
      syncModeToUrl("mode", "dark");
      expect(replaceState).toHaveBeenCalledWith(
        null,
        "",
        "/p/demo?theme=sunwash&mode=dark#top"
      );
    } finally {
      if (originalWindow === undefined) {
        delete (globalThis as { window?: unknown }).window;
      } else {
        (globalThis as { window: unknown }).window = originalWindow;
      }
    }
  });

  it("syncs mode to cookie", () => {
    const originalDocument = (globalThis as { document?: unknown }).document;
    const cookieWrites: string[] = [];
    (globalThis as { document: unknown }).document = {
      set cookie(value: string) {
        cookieWrites.push(value);
      },
    };

    try {
      syncModeToCookie("dark");
      expect(cookieWrites.at(-1)).toContain("nf_mode=dark");
      expect(cookieWrites.at(-1)).toContain("path=/");
    } finally {
      if (originalDocument === undefined) {
        delete (globalThis as { document?: unknown }).document;
      } else {
        (globalThis as { document: unknown }).document = originalDocument;
      }
    }
  });
});
