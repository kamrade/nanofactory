import Image from "next/image";
import type { CSSProperties } from "react";

import type { BlockRenderProps } from "../../shared/types";
import { BlockSectionTitle } from "@/features/blocks/shared/components/block-section-title/block-section-title";
import { resolveAssetById } from "@/lib/assets/resolution";
import styles from "./render.module.css";

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  imageAssetId: string | undefined;
};

function readItems(input: unknown): TestimonialItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const quote = typeof record.quote === "string" ? record.quote : "";
      const name = typeof record.name === "string" ? record.name : "";
      const role = typeof record.role === "string" ? record.role : "";
      const imageAssetId =
        typeof record.imageAssetId === "string" ? record.imageAssetId : undefined;

      if (!quote || !name) {
        return null;
      }

      return {
        quote,
        name,
        role,
        imageAssetId,
      };
    })
    .filter((item): item is TestimonialItem => item !== null);
}

export function TestimonialsDefaultRender({
  block,
  assetMap,
  projectBorderRadiusPolicy,
  projectSpacingScale,
  projectSurfaceStyle,
}: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const subtitle = typeof block.props.subtitle === "string" ? block.props.subtitle : "";
  const animate = block.props.animate !== false;
  const items = readItems(block.props.items);
  const effectiveSpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const effectiveBorderRadius =
    projectBorderRadiusPolicy === "none" ||
    projectBorderRadiusPolicy === "md" ||
    projectBorderRadiusPolicy === "lg"
      ? projectBorderRadiusPolicy
      : "lg";
  const radiusVars =
    effectiveBorderRadius === "none"
      ? { "--testimonials-radius-card": "0px" }
      : effectiveBorderRadius === "md"
        ? { "--testimonials-radius-card": "0.875rem" }
        : { "--testimonials-radius-card": "1.25rem" };

  return (
    <section
      data-spacing-scale={effectiveSpacingScale}
      data-surface-style={projectSurfaceStyle ?? "default"}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <div className={styles.header}>
        <BlockSectionTitle title={sectionTitle} animate={animate} />
        {subtitle.trim().length > 0 ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>

      <div className={styles.grid}>
        {items.map((item) => {
          const portrait = resolveAssetById(item.imageAssetId, assetMap);

          return (
            <article key={`${block.id}-${item.name}-${item.quote}`} className={styles.card}>
              <p className={styles.quote}>"{item.quote}"</p>

              <div className={styles.person}>
                {portrait ? (
                  <div className={styles.portrait}>
                    <Image
                      src={portrait.publicUrl}
                      alt={portrait.alt ?? portrait.originalFilename}
                      width={96}
                      height={96}
                      unoptimized
                      className={styles.portraitImage}
                    />
                  </div>
                ) : null}

                <div className={styles.personMeta}>
                  <p className={styles.name}>{item.name}</p>
                  {item.role.trim().length > 0 ? <p className={styles.role}>{item.role}</p> : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
