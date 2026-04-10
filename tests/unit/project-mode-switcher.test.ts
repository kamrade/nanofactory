import { describe, expect, it, vi } from "vitest";

import {
  applyModeToRoot,
  readModeFromRoot,
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

    expect(node.closest).toHaveBeenCalledWith("main[data-theme]");
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
});
