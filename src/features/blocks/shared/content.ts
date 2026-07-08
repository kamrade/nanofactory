export type SupportedBlockType =
  | "hero"
  | "features"
  | "timeline"
  | "cta"
  | "app-header"
  | "gallery"
  | "footer"
  | "projects-gallery"
  | "testimonials";

export type HeroVariant = "default" | "centered";
export type FeaturesVariant = "default" | "cards";
export type TimelineVariant = "default";
export type CtaVariant = "default";
export type AppHeaderVariant = "default";
export type GalleryVariant = "default";
export type FooterVariant = "default";
export type ProjectsGalleryVariant = "default";
export type TestimonialsVariant = "default";

export type BlockVariant =
  | HeroVariant
  | FeaturesVariant
  | TimelineVariant
  | CtaVariant
  | AppHeaderVariant
  | GalleryVariant
  | FooterVariant
  | ProjectsGalleryVariant
  | TestimonialsVariant;

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
