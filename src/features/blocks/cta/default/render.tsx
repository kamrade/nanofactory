import type { CSSProperties } from "react";
import type { BlockRenderProps } from "../../shared/types";
import { BlockSectionTitle } from "../../shared/components/block-section-title/block-section-title";
import styles from "./render.module.css";

export function CtaDefaultRender({
  block,
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";
  const rawButtonHref =
    typeof block.props.buttonHref === "string" ? block.props.buttonHref : "#";
  const buttonHref = rawButtonHref.trim().length > 0 ? rawButtonHref.trim() : "#";

  const effectiveBorderRadius =
    projectBorderRadiusPolicy === "none" ||
    projectBorderRadiusPolicy === "md" ||
    projectBorderRadiusPolicy === "lg"
      ? projectBorderRadiusPolicy
      : "lg";
  const effectiveSpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";

  const radiusVars =
    effectiveBorderRadius === "none"
      ? { "--cta-radius-button": "0px" }
      : effectiveBorderRadius === "md"
        ? { "--cta-radius-button": "0.75rem" }
        : { "--cta-radius-button": "1rem" };

  return (
    <section
      data-spacing-scale={effectiveSpacingScale}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <BlockSectionTitle title={title} />
      <div>
        <a
          href={buttonHref}
          className={styles.button}
          style={{ borderRadius: "var(--cta-radius-button)" }}
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
