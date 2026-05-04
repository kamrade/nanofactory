import type { BlockVariantDefinition } from "../../shared/types";
import { AppHeaderDefaultEditor } from "./editor";
import { AppHeaderDefaultRender } from "./render";
import { readAppHeaderProps } from "./model";

export const appHeaderDefaultDefinition: BlockVariantDefinition = {
  type: "app-header",
  typeLabel: "App Header",
  variant: "default",
  label: "Default",
  description: "Basic App Header block template.",
  fields: [
    {
      key: "title",
      label: "Title",
      kind: "text",
      placeholder: "Optional title",
    },
  ],
  Editor: AppHeaderDefaultEditor,
  createDefaultProps: () => ({
    title: "",
    logoAssetId: undefined,
    logoLightAssetId: undefined,
    logoDarkAssetId: undefined,
    collapseBreakpoint: "md",
    menuItems: [],
    socialLinks: [],
  }),
  normalizeProps: (input) => readAppHeaderProps(input),
  Renderer: AppHeaderDefaultRender,
};
