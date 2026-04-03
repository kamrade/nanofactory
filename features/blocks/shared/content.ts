export type SupportedBlockType = "hero" | "features" | "cta";

export type HeroVariant = "default" | "centered";
export type FeaturesVariant = "default" | "cards";
export type CtaVariant = "default";

export type BlockVariant = HeroVariant | FeaturesVariant | CtaVariant;

export type PageBlock = {
  id: string;
  type: SupportedBlockType;
  variant?: BlockVariant;
  props: Record<string, unknown>;
};

export type PageContent = {
  blocks: PageBlock[];
};
