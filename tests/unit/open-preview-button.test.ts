import { describe, expect, it } from "vitest";

import {
  buildPreviewUrl,
  getSelectedModeFromDocument,
  getSelectedThemeKeyFromDocument,
} from "@/components/editor/open-preview-button";

describe("open preview url helpers", () => {
  it("reads selected theme from the theme select and trims it", () => {
    const selectedThemeKey = getSelectedThemeKeyFromDocument({
      querySelector: () => ({ value: "  nightfall  " } as HTMLSelectElement),
    });

    const url = buildPreviewUrl("/projects/project-1/preview", {
      selectedThemeKey,
    });

    expect(url).toBe("/projects/project-1/preview?theme=nightfall");
  });

  it("keeps both draft and theme query params in preview url", () => {
    const selectedThemeKey = getSelectedThemeKeyFromDocument({
      querySelector: () => ({ value: "sunwash" } as HTMLSelectElement),
    });

    const url = buildPreviewUrl("/projects/project-1/preview", {
      draftToken: "draft-token-123",
      selectedThemeKey,
    });

    expect(url).toBe("/projects/project-1/preview?draft=draft-token-123&theme=sunwash");
  });

  it("adds mode param when provided", () => {
    const url = buildPreviewUrl("/projects/project-1/preview", {
      selectedMode: "dark",
    });

    expect(url).toBe("/projects/project-1/preview?mode=dark");
  });

  it("reads selected mode from document field", () => {
    const querySelector = (selector: string) => {
      if (selector === '[name="previewMode"]') {
        return { value: "dark" } as HTMLInputElement;
      }
      return null;
    };

    expect(getSelectedModeFromDocument({ querySelector })).toBe("dark");
  });
});
