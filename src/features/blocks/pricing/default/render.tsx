import type { CSSProperties } from "react";
import { FiCheck } from "react-icons/fi";
import type { BlockRenderProps } from "../../shared/types";
import { BlockSectionTitle } from "@/features/blocks/shared/components/block-section-title/block-section-title";
import styles from "./render.module.css";

type PricingPlan = {
  title: string;
  price: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  includes: string[];
};

function readPlans(input: unknown): PricingPlan[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const record = item as Record<string, unknown>;
      const title = typeof record.title === "string" ? record.title : "";
      const price = typeof record.price === "string" ? record.price : "";
      const description = typeof record.description === "string" ? record.description : "";
      const buttonText = typeof record.buttonText === "string" ? record.buttonText : "";
      const buttonHref = typeof record.buttonHref === "string" ? record.buttonHref : "";

      if (!title && !price && !description) {
        return null;
      }

      return {
        title,
        price,
        description,
        buttonText,
        buttonHref,
        includes: Array.isArray(record.includes)
          ? record.includes.filter((entry) => typeof entry === "string")
          : [],
      };
    })
    .filter((item): item is PricingPlan => item !== null);
}

export function PricingDefaultRender({
  block,
  projectBorderRadiusPolicy,
  projectSpacingScale,
  projectSurfaceStyle,
}: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const subtitle = typeof block.props.subtitle === "string" ? block.props.subtitle : "";
  const featuredIndex =
    typeof block.props.featuredIndex === "number" && Number.isInteger(block.props.featuredIndex)
      ? block.props.featuredIndex
      : 1;
  const plans = readPlans(block.props.plans);
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
      ? {
          "--pricing-radius-card": "0px",
          "--pricing-radius-button": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--pricing-radius-card": "0.75rem",
            "--pricing-radius-button": "0.75rem",
          }
        : {
            "--pricing-radius-card": "1.25rem",
            "--pricing-radius-button": "1.25rem",
          };

  return (
    <section
      data-testid="pricing-feature-block"
      data-spacing-scale={effectiveSpacingScale}
      data-surface-style={projectSurfaceStyle ?? "default"}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <div className={styles.header}>
        <BlockSectionTitle title={sectionTitle} animate />
        {subtitle.trim().length > 0 ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>

      <div className={styles.grid}>
        {plans.map((plan, index) => {
          const isFeatured = index === featuredIndex;
          const buttonText = plan.buttonText.trim();
          const buttonHref = plan.buttonHref.trim();
          const hasButton = buttonText.length > 0 && buttonHref.length > 0;
          const includes = plan.includes.map((item) => item.trim()).filter((item) => item.length > 0);

          return (
            <article
              data-testid="pricing-item"
              key={`${block.id}-${plan.title}-${index}`}
              className={isFeatured ? styles.cardFeatured : styles.card}
              data-featured={isFeatured ? "true" : "false"}
            >
              <div className={styles.contentWrapper}>
                <p className={styles.planTitle}>{plan.title}</p>
                <div className={styles.topRow}>
                  <div className={styles.priceRow}>
                    <p className={styles.price}>{plan.price}</p>
                  </div>
                  {plan.description.trim().length > 0 ? (
                    <p className={styles.description}>{plan.description}</p>
                  ) : null}
                </div>
                {hasButton ? (
                  <a href={buttonHref} className={isFeatured ? styles.buttonFeatured : styles.button}>
                    {buttonText}
                  </a>
                ) : null}

                {includes.length > 0 ? (
                  <div className={styles.includes}>
                    <h3 className={styles.includesTitle}>Includes</h3>
                    <ul className={styles.includesList}>
                      {includes.map((item, itemIndex) => (
                        <li className={styles.includesItem} key={`${block.id}-${index}-include-${itemIndex}`}>
                          <FiCheck aria-hidden="true" className={styles.includesItemIcon} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
