import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { getBlockDefinitions } from "@/lib/editor/blocks";

const TEST_THEME = {
  muted: "muted",
  buttonTone: "button-tone",
  button: "button",
  kicker: "kicker",
};

type BlockDefinition = ReturnType<typeof getBlockDefinitions>[number];

function renderDefinition(definition: BlockDefinition, overrides: Partial<Record<string, unknown>> = {}) {
  const block = {
    id: `block-${definition.type}-${definition.variant}`,
    type: definition.type,
    variant: definition.variant,
    props: {
      ...definition.createDefaultProps(),
      ...overrides,
    },
  };

  return renderToStaticMarkup(
    createElement(definition.Renderer, {
      block,
      assetMap: new Map(),
      theme: TEST_THEME,
      mode: "light",
      modePolicy: "switchable",
      projectBorderRadiusPolicy: "lg",
      projectSpacingScale: "md",
      projectSurfaceStyle: "default",
    })
  );
}

describe("feature block project options", () => {
  it("all feature block renderers react to spacing, surface style, and border radius options", () => {
    const definitions = getBlockDefinitions();

    for (const definition of definitions) {
      const smHtml = renderDefinition(definition, definition.type === "app-header" ? { showModeSwitcher: false } : {});

      const lgHtml = renderToStaticMarkup(
        createElement(definition.Renderer, {
          block: {
            id: `block-${definition.type}-${definition.variant}`,
            type: definition.type,
            variant: definition.variant,
            props: definition.createDefaultProps(),
          },
          assetMap: new Map(),
          theme: TEST_THEME,
          mode: "light",
          modePolicy: "switchable",
          projectBorderRadiusPolicy: "lg",
          projectSpacingScale: "lg",
          projectSurfaceStyle: "default",
        })
      );

      const flatHtml = renderToStaticMarkup(
        createElement(definition.Renderer, {
          block: {
            id: `block-${definition.type}-${definition.variant}`,
            type: definition.type,
            variant: definition.variant,
            props: definition.createDefaultProps(),
          },
          assetMap: new Map(),
          theme: TEST_THEME,
          mode: "light",
          modePolicy: "switchable",
          projectBorderRadiusPolicy: "lg",
          projectSpacingScale: "md",
          projectSurfaceStyle: "flat",
        })
      );

      const noneRadiusHtml = renderToStaticMarkup(
        createElement(definition.Renderer, {
          block: {
            id: `block-${definition.type}-${definition.variant}`,
            type: definition.type,
            variant: definition.variant,
            props: definition.createDefaultProps(),
          },
          assetMap: new Map(),
          theme: TEST_THEME,
          mode: "light",
          modePolicy: "switchable",
          projectBorderRadiusPolicy: "none",
          projectSpacingScale: "md",
          projectSurfaceStyle: "default",
        })
      );

      expect(smHtml).toContain('data-spacing-scale="md"');
      expect(lgHtml).toContain('data-spacing-scale="lg"');
      expect(flatHtml).toContain('data-surface-style="flat"');
      expect(noneRadiusHtml).not.toEqual(lgHtml);
    }
  });
});
