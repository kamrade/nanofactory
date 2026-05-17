import Image from "next/image";
import type { CSSProperties } from "react";
import type { BlockRenderProps } from "../../shared/types";
import { resolveAssetById } from "@/lib/assets/resolution";

type FeatureItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
};

type FeatureBorderRadius = "none" | "md" | "lg";
type SpacingScale = "sm" | "md" | "lg";

const FEATURES_DEFAULT_SPACING: Record<
  SpacingScale,
  {
    sectionClassName: string;
    titleClassName: string;
    listClassName: string;
    cardClassName: string;
    rowClassName: string;
    mediaClassName: string;
    itemTitleClassName: string;
    itemContentClassName: string;
  }
> = {
  sm: {
    sectionClassName: "space-y-3 px-3 py-8 md:px-5",
    titleClassName: "text-xl font-semibold tracking-tight",
    listClassName: "grid gap-2",
    cardClassName: "bg-surface-alt px-3 py-2 [border-radius:var(--feature-radius-card)]",
    rowClassName: "flex items-start gap-2",
    mediaClassName:
      "h-8 w-8 shrink-0 overflow-hidden border border-line bg-surface [border-radius:var(--feature-radius-media)]",
    itemTitleClassName: "break-words text-xs font-medium leading-5 text-text-main",
    itemContentClassName: "mt-1 break-words text-xs leading-5",
  },
  md: {
    sectionClassName: "space-y-5 px-4 py-12 md:px-8",
    titleClassName: "text-2xl font-semibold tracking-tight",
    listClassName: "grid gap-3",
    cardClassName: "bg-surface-alt px-4 py-3 [border-radius:var(--feature-radius-card)]",
    rowClassName: "flex items-start gap-3",
    mediaClassName:
      "h-10 w-10 shrink-0 overflow-hidden border border-line bg-surface [border-radius:var(--feature-radius-media)]",
    itemTitleClassName: "break-words text-sm font-medium leading-6 text-text-main",
    itemContentClassName: "mt-1 break-words text-sm leading-6",
  },
  lg: {
    sectionClassName: "space-y-7 px-6 py-14 md:px-10",
    titleClassName: "text-3xl font-semibold tracking-tight",
    listClassName: "grid gap-4",
    cardClassName: "bg-surface-alt px-5 py-4 [border-radius:var(--feature-radius-card)]",
    rowClassName: "flex items-start gap-4",
    mediaClassName:
      "h-12 w-12 shrink-0 overflow-hidden border border-line bg-surface [border-radius:var(--feature-radius-media)]",
    itemTitleClassName: "break-words text-base font-medium leading-7 text-text-main",
    itemContentClassName: "mt-1 break-words text-base leading-7",
  },
};

function readItems(input: unknown): FeatureItem[] {
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
    .filter((item): item is FeatureItem => item !== null);
}

export function FeaturesDefaultRender({
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
  const spacing = FEATURES_DEFAULT_SPACING[effectiveSpacingScale];

  const radiusVars =
    effectiveBorderRadius === "none"
      ? {
          "--feature-radius-card": "0px",
          "--feature-radius-media": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--feature-radius-card": "0.75rem",
            "--feature-radius-media": "0.375rem",
          }
        : {
            "--feature-radius-card": "1rem",
            "--feature-radius-media": "0.375rem",
          };

  return (
    <section className={spacing.sectionClassName} style={radiusVars as CSSProperties}>
      <h2 className={spacing.titleClassName}>{sectionTitle}</h2>
      <ul className={spacing.listClassName}>
        {items.map((item) => {
          const itemImage = resolveAssetById(item.imageAssetId, assetMap);
          return (
            <li
              key={`${block.id}-${item.title}`}
              className={spacing.cardClassName}
            >
              <div className={spacing.rowClassName}>
                {itemImage ? (
                  <div className={spacing.mediaClassName}>
                    <Image
                      src={itemImage.publicUrl}
                      alt={itemImage.originalFilename}
                      width={40}
                      height={40}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}
                <div>
                  <p className={spacing.itemTitleClassName}>{item.title}</p>
                  {item.content.trim().length > 0 ? (
                    <p className={`${spacing.itemContentClassName} ${theme.muted}`}>
                      {item.content}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
