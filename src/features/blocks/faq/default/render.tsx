import type { CSSProperties } from "react";

import type { BlockRenderProps } from "../../shared/types";
import { BlockSectionTitle } from "@/features/blocks/shared/components/block-section-title/block-section-title";
import styles from "./render.module.css";

type FaqItem = {
  question: string;
  answer: string;
};

function readItems(input: unknown): FaqItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const question = typeof record.question === "string" ? record.question : "";
      const answer = typeof record.answer === "string" ? record.answer : "";

      if (!question) {
        return null;
      }

      return { question, answer };
    })
    .filter((item): item is FaqItem => item !== null);
}

export function FAQDefaultRender({
  block,
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
      ? { "--faq-radius-item": "0px" }
      : effectiveBorderRadius === "md"
        ? { "--faq-radius-item": "0.875rem" }
        : { "--faq-radius-item": "1rem" };

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

      <div className={styles.list}>
        {items.map((item, index) => (
          <details key={`${block.id}-faq-${index}-${item.question}`} className={styles.item} open={index === 0}>
            <summary className={styles.summary}>
              <span className={styles.question}>{item.question}</span>
              <span aria-hidden className={styles.chevron} />
            </summary>
            {item.answer.trim().length > 0 ? <p className={styles.answer}>{item.answer}</p> : null}
          </details>
        ))}
      </div>
    </section>
  );
}
