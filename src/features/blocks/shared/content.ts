export type SupportedBlockType =
  | "hero"
  | "features"
  | "cta"
  | "app-header"
  | "gallery"
  | "footer";

export type HeroVariant = "default" | "centered";
export type FeaturesVariant = "default" | "cards";
export type CtaVariant = "default";
export type AppHeaderVariant = "default";
export type GalleryVariant = "default";
export type FooterVariant = "default";

export type BlockVariant =
  | HeroVariant
  | FeaturesVariant
  | CtaVariant
  | AppHeaderVariant
  | GalleryVariant
  | FooterVariant;

export type PageBlock = {
  id: string;
  type: SupportedBlockType;
  variant?: BlockVariant;
  anchorId?: string;
  backgroundSceneId?: string;
  props: Record<string, unknown>;
};

export type PageContent = {
  blocks: PageBlock[];
};
