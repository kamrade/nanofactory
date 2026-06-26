import type { CSSProperties } from "react";
import { ViewportAnimation } from "@/components/motion/viewport-animation";
import { VIEWPORT_WORD_STAGGER_PRESETS } from "@/components/motion/viewport-animation-presets";
import type { BlockRenderProps } from "../../shared/types";
import titleStyles from "@/features/blocks/shared/components/block-section-title/block-section-title.module.css";
import styles from "./render.module.css";

export function CtaDefaultRender({
  block,
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const titleText = title.trim();
  const animate = typeof block.props.animate === "boolean" ? block.props.animate : true;
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
      <h2 className={titleStyles.title}>
        {animate ? (
          <ViewportAnimation
            type="word-stagger"
            text={titleText}
            {...VIEWPORT_WORD_STAGGER_PRESETS.cta}
          />
        ) : (
          titleText
        )}
      </h2>
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
