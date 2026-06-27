import Image from "next/image";
import type { CSSProperties } from "react";
import type { BlockRenderProps } from "../../shared/types";
import { resolveAssetById } from "@/lib/assets/resolution";
import { BlockSectionTitle } from "../../shared/components/block-section-title/block-section-title";
import styles from "./render.module.css";

type FeatureItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
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
            "--feature-radius-media": "0.375rem",
          }
        : {
            "--feature-radius-card": "1rem",
            "--feature-radius-media": "0.375rem",
          };

  return (
    <section
      data-spacing-scale={effectiveSpacingScale}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <BlockSectionTitle title={sectionTitle} fontWeight={600} animate={animate} />
      <ul className={styles.list}>
        {items.map((item) => {
          const itemImage = resolveAssetById(item.imageAssetId, assetMap);
          return (
            <li key={`${block.id}-${item.title}`} className={styles.card}>
              <div className={styles.row}>
                {itemImage ? (
                  <div className={styles.media}>
                    <Image
                      src={itemImage.publicUrl}
                      alt={itemImage.originalFilename}
                      width={40}
                      height={40}
                      unoptimized
                      className={styles.mediaImage}
                    />
                  </div>
                ) : null}
                <div>
                  <p className={styles.itemTitle}>
                    <BlockSectionTitle
                      title={item.title}
                      animate={animate}
                      animationPreset="featureCardTitle"
                    />
                  </p>
                  {item.content.trim().length > 0 ? (
                    <p className={styles.itemContent}>{item.content}</p>
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
