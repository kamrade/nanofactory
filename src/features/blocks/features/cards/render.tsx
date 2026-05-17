import Image from "next/image";
import type { CSSProperties } from "react";
import type { BlockRenderProps } from "../../shared/types";
import { resolveAssetById } from "@/lib/assets/resolution";

type FeatureCardItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
};

type FeatureBorderRadius = "none" | "md" | "lg";
type SpacingScale = "sm" | "md" | "lg";

const FEATURES_CARDS_SPACING: Record<
  SpacingScale,
  {
    sectionClassName: string;
    sectionHeaderClassName: string;
    titleClassName: string;
    gridClassName: string;
    cardClassName: string;
    mediaClassName: string;
    itemTitleClassName: string;
    itemContentClassName: string;
  }
> = {
  sm: {
    sectionClassName: "space-y-4 px-3 py-8 md:px-5",
    sectionHeaderClassName: "space-y-1",
    titleClassName: "text-xl font-semibold tracking-tight",
    gridClassName: "grid gap-2 md:grid-cols-3",
    cardClassName: "bg-surface-alt p-3 [border-radius:var(--feature-radius-card)]",
    mediaClassName:
      "mb-2 h-9 w-9 overflow-hidden border border-line bg-surface [border-radius:var(--feature-radius-media)]",
    itemTitleClassName: "break-words text-sm font-medium text-text-main",
    itemContentClassName: "mt-2 break-words text-xs leading-5",
  },
  md: {
    sectionClassName: "space-y-6 px-4 py-12 md:px-8",
    sectionHeaderClassName: "space-y-2",
    titleClassName: "text-2xl font-semibold tracking-tight",
    gridClassName: "grid gap-4 md:grid-cols-3",
    cardClassName: "bg-surface-alt p-5 [border-radius:var(--feature-radius-card)]",
    mediaClassName:
      "mb-3 h-12 w-12 overflow-hidden border border-line bg-surface [border-radius:var(--feature-radius-media)]",
    itemTitleClassName: "break-words text-base font-medium text-text-main",
    itemContentClassName: "mt-3 break-words text-sm leading-6",
  },
  lg: {
    sectionClassName: "space-y-8 px-6 py-14 md:px-10",
    sectionHeaderClassName: "space-y-3",
    titleClassName: "text-3xl font-semibold tracking-tight",
    gridClassName: "grid gap-5 md:grid-cols-3",
    cardClassName: "bg-surface-alt p-6 [border-radius:var(--feature-radius-card)]",
    mediaClassName:
      "mb-4 h-14 w-14 overflow-hidden border border-line bg-surface [border-radius:var(--feature-radius-media)]",
    itemTitleClassName: "break-words text-lg font-medium text-text-main",
    itemContentClassName: "mt-4 break-words text-base leading-7",
  },
};

function readItems(input: unknown): FeatureCardItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: item,
          content: "",
          imageAssetId: undefined,
        };
      }

      if (typeof item !== "object" || item === null) {
        return null;
      }

      const title =
        typeof (item as { title?: unknown }).title === "string"
          ? (item as { title: string }).title
          : "";
      const content =
        typeof (item as { content?: unknown }).content === "string"
          ? (item as { content: string }).content
          : "";

      if (!title) {
        return null;
      }

      return {
        title,
        content,
        imageAssetId:
          typeof (item as { imageAssetId?: unknown }).imageAssetId === "string"
            ? (item as { imageAssetId: string }).imageAssetId
            : undefined,
      };
    })
    .filter((item): item is FeatureCardItem => item !== null);
}

export function FeaturesCardsRender({
  block,
  theme,
  assetMap,
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const items = readItems(block.props.items);
  const borderRadius: FeatureBorderRadius =
    block.props.borderRadius === "none" || block.props.borderRadius === "md" || block.props.borderRadius === "lg"
      ? block.props.borderRadius
      : "lg";
  const effectiveBorderRadius = projectBorderRadiusPolicy ?? borderRadius;
  const effectiveSpacingScale: SpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const spacing = FEATURES_CARDS_SPACING[effectiveSpacingScale];

  const radiusVars =
    effectiveBorderRadius === "none"
      ? {
          "--feature-radius-card": "0px",
          "--feature-radius-media": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--feature-radius-card": "0.75rem",
            "--feature-radius-media": "0.5rem",
          }
        : {
            "--feature-radius-card": "1.5rem",
            "--feature-radius-media": "0.75rem",
          };

  return (
    <section className={spacing.sectionClassName} style={radiusVars as CSSProperties}>
      <div className={spacing.sectionHeaderClassName}>
        <h2 className={spacing.titleClassName}>{sectionTitle}</h2>
      </div>

      <div className={spacing.gridClassName}>
        {items.map((item) => {
          const cardImage = resolveAssetById(item.imageAssetId, assetMap);
          return (
          <article
            key={`${block.id}-${item.title}`}
            className={spacing.cardClassName}
          >
            {cardImage ? (
              <div className={spacing.mediaClassName}>
                <Image
                  src={cardImage.publicUrl}
                  alt={cardImage.alt ?? cardImage.originalFilename}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <p className={spacing.itemTitleClassName}>{item.title}</p>
            {item.content.trim().length > 0 ? (
              <p className={`${spacing.itemContentClassName} ${theme.muted}`}>
                {item.content}
              </p>
            ) : null}
          </article>
          );
        })}
      </div>
    </section>
  );
}
