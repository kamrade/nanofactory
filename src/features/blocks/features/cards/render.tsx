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
}: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const items = readItems(block.props.items);
  const borderRadius: FeatureBorderRadius =
    block.props.borderRadius === "none" || block.props.borderRadius === "md" || block.props.borderRadius === "lg"
      ? block.props.borderRadius
      : "lg";
  const effectiveBorderRadius = projectBorderRadiusPolicy ?? borderRadius;

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
    <section className="space-y-6 px-4 py-12 md:px-8" style={radiusVars as CSSProperties}>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{sectionTitle}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const cardImage = resolveAssetById(item.imageAssetId, assetMap);
          return (
          <article
            key={`${block.id}-${item.title}`}
            className="bg-surface-alt p-5 [border-radius:var(--feature-radius-card)]"
          >
            {cardImage ? (
              <div className="mb-3 h-12 w-12 overflow-hidden border border-line bg-surface [border-radius:var(--feature-radius-media)]">
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
            <p className="break-words text-base font-medium text-text-main">{item.title}</p>
            {item.content.trim().length > 0 ? (
              <p className={`mt-3 break-words text-sm leading-6 ${theme.muted}`}>
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
