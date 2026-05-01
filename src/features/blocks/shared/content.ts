export type SupportedBlockType = "hero" | "features" | "cta" | "app-header";

export type HeroVariant = "default" | "centered";
export type FeaturesVariant = "default" | "cards";
export type CtaVariant = "default";
export type AppHeaderVariant = "default";

export type BlockVariant = HeroVariant | FeaturesVariant | CtaVariant | AppHeaderVariant;

export type PageBlock = {
  id: string;
  type: SupportedBlockType;
  variant?: BlockVariant;
  fullBleed?: boolean;
  backgroundSceneId?: string;
  props: Record<string, unknown>;
};

export type PageContent = {
  blocks: PageBlock[];
};
