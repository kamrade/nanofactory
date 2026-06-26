import Image from "next/image";
import type { CSSProperties } from "react";
import type { BlockRenderProps } from "../../shared/types";
import { ViewportAnimation } from "@/components/motion/viewport-animation";
import { VIEWPORT_WORD_STAGGER_PRESETS } from "@/components/motion/viewport-animation-presets";
import { resolveAssetById } from "@/lib/assets/resolution";
import titleStyles from "../../shared/components/block-section-title/block-section-title.module.css";
import styles from "./render.module.css";

type FeatureCardItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
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
  assetMap,
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const animate = block.props.animate !== false;
  const items = readItems(block.props.items);

  const borderRadius =
    block.props.borderRadius === "none" || block.props.borderRadius === "md" || block.props.borderRadius === "lg"
      ? block.props.borderRadius
      : "lg";
  const effectiveBorderRadius = projectBorderRadiusPolicy ?? borderRadius;
  const effectiveSpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";

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
    <section
      data-spacing-scale={effectiveSpacingScale}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <div className={styles.sectionHeader}>
        {sectionTitle.trim().length > 0 ? (
          <h2 className={titleStyles.title}>
            {animate ? (
              <ViewportAnimation
                type="word-stagger"
                text={sectionTitle}
                {...VIEWPORT_WORD_STAGGER_PRESETS.cta}
              />
            ) : (
              sectionTitle
            )}
          </h2>
        ) : null}
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const cardImage = resolveAssetById(item.imageAssetId, assetMap);
          return (
            <article key={`${block.id}-${item.title}`} className={styles.card}>
              {cardImage ? (
                <div className={styles.media}>
                  <Image
                    src={cardImage.publicUrl}
                    alt={cardImage.alt ?? cardImage.originalFilename}
                    width={48}
                    height={48}
                    unoptimized
                    className={styles.mediaImage}
                  />
                </div>
              ) : null}
              <p className={styles.itemTitle}>{item.title}</p>
              {item.content.trim().length > 0 ? (
                <p className={styles.itemContent}>{item.content}</p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
