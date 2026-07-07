import type { CSSProperties } from "react";

import type { BlockRenderProps } from "../../shared/types";
import { ViewportAnimation } from "@/components/motion/viewport-animation";
import { VIEWPORT_WORD_STAGGER_PRESETS } from "@/components/motion/viewport-animation-presets";
import { BlockSectionTitle } from "../../shared/components/block-section-title/block-section-title";
import styles from "./render.module.css";

type TimelineItem = {
  meta: string;
  title: string;
  content: string;
};

function readItems(input: unknown): TimelineItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item === "string") {
        const title = item.trim();
        if (!title) {
          return null;
        }

        return {
          meta: "",
          title,
          content: "",
        };
      }

      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const title = typeof record.title === "string" ? record.title : "";

      if (!title) {
        return null;
      }

      return {
        meta: typeof record.meta === "string" ? record.meta : "",
        title,
        content: typeof record.content === "string" ? record.content : "",
      };
    })
    .filter((item): item is TimelineItem => item !== null);
}

export function TimelineDefaultRender({
  block,
  projectBorderRadiusPolicy,
  projectSpacingScale,
  projectSurfaceStyle,
}: BlockRenderProps) {
  const sectionTitle = typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const animate = block.props.animate !== false;
  const items = readItems(block.props.items);

  const effectiveSpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";

  const effectiveBorderRadius = projectBorderRadiusPolicy ?? "lg";

  const radiusVars =
    effectiveBorderRadius === "none"
      ? {
          "--timeline-radius-card": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--timeline-radius-card": "0.875rem",
          }
        : {
            "--timeline-radius-card": "1.25rem",
          };

  return (
    <section
      data-spacing-scale={effectiveSpacingScale}
      data-surface-style={projectSurfaceStyle ?? "default"}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <BlockSectionTitle title={sectionTitle} fontWeight={600} animate={animate} />

      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={`${block.id}-timeline-${index}-${item.title}`} className={styles.item}>
            <span aria-hidden className={styles.marker} />

            <div className={styles.metaWrap}>
              {item.meta.trim().length > 0 ? <p className={styles.meta}>{item.meta}</p> : null}
            </div>

            <article className={styles.card}>
              <h4 className={styles.itemTitle}>
                {animate ? (
                  <ViewportAnimation
                    type="word-stagger"
                    text={item.title}
                    as="span"
                    {...VIEWPORT_WORD_STAGGER_PRESETS.featureCardTitle}
                  />
                ) : (
                  item.title
                )}
              </h4>

              {item.content.trim().length > 0 ? (
                <p className={styles.itemContent}>{item.content}</p>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
