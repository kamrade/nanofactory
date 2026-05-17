"use client"

import { useEffect } from "react";
import type { CSSProperties } from "react";
import type { BlockRenderProps } from "../../shared/types";

type BorderRadiusPolicy = "none" | "md" | "lg";
type SpacingScale = "sm" | "md" | "lg";

const CTA_SPACING: Record<
  SpacingScale,
  { sectionClassName: string; titleClassName: string; buttonClassName: string }
> = {
  sm: {
    sectionClassName: "space-y-3 p-3 text-center md:p-5",
    titleClassName: "break-words text-2xl font-semibold tracking-tight",
    buttonClassName: "px-3 py-1 text-sm",
  },
  md: {
    sectionClassName: "space-y-5 p-4 text-center md:p-8",
    titleClassName: "break-words text-3xl font-semibold tracking-tight",
    buttonClassName: "px-5 py-3 text-sm",
  },
  lg: {
    sectionClassName: "space-y-7 p-6 text-center md:p-10",
    titleClassName: "break-words text-4xl font-semibold tracking-tight",
    buttonClassName: "px-7 py-4 text-base",
  },
};

export function CtaDefaultRender({
  block,
  theme,
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";
  const rawButtonHref =
    typeof block.props.buttonHref === "string" ? block.props.buttonHref : "#";
  const buttonHref = rawButtonHref.trim().length > 0 ? rawButtonHref.trim() : "#";
  const effectiveBorderRadius: BorderRadiusPolicy =
    projectBorderRadiusPolicy === "none" ||
    projectBorderRadiusPolicy === "md" ||
    projectBorderRadiusPolicy === "lg"
      ? projectBorderRadiusPolicy
      : "lg";
  const effectiveSpacingScale: SpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const spacing = CTA_SPACING[effectiveSpacingScale];

  const radiusVars =
    effectiveBorderRadius === "none"
      ? {
          "--cta-radius-button": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--cta-radius-button": "0.75rem",
          }
        : {
            "--cta-radius-button": "1rem",
          };


  useEffect(() => {
    console.log(theme.button);
  })

  return (
    <section className={spacing.sectionClassName} style={radiusVars as CSSProperties}>
      <h2 className={spacing.titleClassName}>{title}</h2>
      <div>
        <a
          href={buttonHref}
          className={`${theme.buttonTone} ${spacing.buttonClassName}`}
          style={{ borderRadius: "var(--cta-radius-button)" }}
        >
          {buttonText}
        </a>
      </div>
    </section>
  );
}
