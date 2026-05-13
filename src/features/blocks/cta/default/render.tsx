import type { CSSProperties } from "react";
import type { BlockRenderProps } from "../../shared/types";

type BorderRadiusPolicy = "none" | "md" | "lg";

export function CtaDefaultRender({ block, theme, projectBorderRadiusPolicy }: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";
  const effectiveBorderRadius: BorderRadiusPolicy =
    projectBorderRadiusPolicy === "none" ||
    projectBorderRadiusPolicy === "md" ||
    projectBorderRadiusPolicy === "lg"
      ? projectBorderRadiusPolicy
      : "lg";

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

  return (
    <section className="space-y-5 p-4 text-center md:p-8" style={radiusVars as CSSProperties}>
      <h2 className="break-words text-3xl font-semibold tracking-tight">{title}</h2>
      <div>
        <span
          className={theme.button}
          style={{ borderRadius: "var(--cta-radius-button)" }}
        >
          {buttonText}
        </span>
      </div>
    </section>
  );
}
