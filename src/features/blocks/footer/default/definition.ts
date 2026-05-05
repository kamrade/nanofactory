import type { BlockVariantDefinition } from "../../shared/types";
import { FooterDefaultEditor } from "./editor";
import { readFooterProps } from "./model";
import { FooterDefaultRender } from "./render";

export const footerDefaultDefinition: BlockVariantDefinition = {
  type: "footer",
  typeLabel: "Footer",
  variant: "default",
  label: "Default",
  description: "Footer with navigation, social links, and external links.",
  fields: [],
  Editor: FooterDefaultEditor,
  createDefaultProps: () => ({
    leftTitle: "",
    logoAssetId: undefined,
    siteName: "",
    siteDescription: "",
    socialLinksTitle: "",
    socialLinks: [],
    scrollTopLabel: "Scroll to top",
    navColumnTitle: "",
    navLinks: [],
    linksColumnOneTitle: "",
    linksColumnOne: [],
    linksColumnTwoTitle: "",
    linksColumnTwo: [],
  }),
  normalizeProps: (input) => readFooterProps(input),
  Renderer: FooterDefaultRender,
};

