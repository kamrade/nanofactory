"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import styles from './render.module.css';

import { TypewriterText } from "@/components/ui/typewriter-text";
import { OffsetRevealText } from "@/components/ui/offset-reveal-text";
import { resolveAssetById } from "@/lib/assets/resolution";
import { useVisibleOnce } from "@/hooks/use-visible-once";

import type { BlockRenderProps } from "../../shared/types";
type BorderRadiusPolicy = "none" | "md" | "lg";

type SpacingScale = "sm" | "md" | "lg";

const HERO_CENTERED_SPACING: Record<
  SpacingScale,
  {
    shellClassName: string;
    contentClassName: string;
    stackClassName: string;
    eyebrowClassName: string;
    headingClassName: string;
    subtitleClassName: string;
    buttonClassName: string;
  }
> = {
  sm: {
    shellClassName: "m-auto flex min-h-[16rem] max-w-2xl flex-col items-center gap-3 py-6 text-center md:min-h-[20rem]",
    contentClassName: "space-y-3",
    stackClassName: "",
    eyebrowClassName: "text-xs font-semibold uppercase tracking-[0.12em]",
    headingClassName: "break-words text-2xl font-semibold tracking-tight sm:text-4xl",
    subtitleClassName: "mx-auto max-w-2xl break-words text-sm leading-6",
    buttonClassName: "px-3 py-2 text-xs",
  },
  md: {
    shellClassName: "m-auto flex min-h-[22rem] max-w-3xl flex-col items-center gap-6 py-12 text-center md:min-h-[28rem]",
    contentClassName: "space-y-5",
    stackClassName: "",
    eyebrowClassName: "text-sm font-semibold uppercase tracking-[0.14em]",
    headingClassName: "break-words text-4xl font-semibold tracking-tight sm:text-6xl",
    subtitleClassName: "mx-auto max-w-2xl break-words text-base leading-7",
    buttonClassName: "px-5 py-3 text-sm",
  },
  lg: {
    shellClassName: "m-auto flex min-h-[26rem] max-w-4xl flex-col items-center gap-8 py-14 text-center md:min-h-[32rem]",
    contentClassName: "space-y-7",
    stackClassName: "",
    eyebrowClassName: "text-base font-semibold uppercase tracking-[0.16em]",
    headingClassName: "break-words text-5xl font-semibold tracking-tight sm:text-7xl",
    subtitleClassName: "mx-auto max-w-3xl break-words text-lg leading-8",
    buttonClassName: "px-7 py-4 text-base",
  },
};

function getContentPositionClass(contentPosition: string) {
  if (contentPosition === "top") {
    return "justify-start";
  }
  if (contentPosition === "bottom") {
    return "justify-end";
  }
  return "justify-center";
}

export function HeroCenteredRender({
  block,
  assetMap,
  theme,
  mode = "light",
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [observedMode, setObservedMode] = useState<"light" | "dark" | null>(null);
  const eyebrow = typeof block.props.eyebrow === "string" ? block.props.eyebrow : "";
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const subtitle =
    typeof block.props.subtitle === "string" ? block.props.subtitle : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";
  const buttonAnchor =
    typeof block.props.buttonAnchor === "string" ? block.props.buttonAnchor : "";
  const contentPosition =
    typeof block.props.contentPosition === "string" ? block.props.contentPosition : "centered";
  const animateMainText = block.props.animateMainText === true;
  const animateContent = block.props.animateContent === true;
  const { ref: visibleRef, visible } = useVisibleOnce();

  const DURATION = 3000;
  const STAGGER = 100;
  const hasEyebrow = eyebrow.trim().length > 0;
  const D = (idx: number) => (animateContent && visible ? idx * STAGGER : 10_000_000);
  const eyebrowDelay = D(0);
  const titleDelay = D(hasEyebrow ? 1 : 0);
  const subtitleDelay = D(hasEyebrow ? 2 : 1);
  const buttonDelay = D(hasEyebrow ? 3 : 2);
  const defaultImageId =
    typeof block.props.imageAssetId === "string" ? block.props.imageAssetId : undefined;
  const lightImageId =
    typeof block.props.imageLightAssetId === "string" ? block.props.imageLightAssetId : undefined;
  const darkImageId =
    typeof block.props.imageDarkAssetId === "string" ? block.props.imageDarkAssetId : undefined;
  const activeMode = observedMode ?? mode;
  const selectedImageId =
    activeMode === "dark" ? darkImageId ?? defaultImageId : lightImageId ?? defaultImageId;
  const heroImageAsset = resolveAssetById(selectedImageId, assetMap);
  const effectiveSpacingScale: SpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const spacing = HERO_CENTERED_SPACING[effectiveSpacingScale];
  const effectiveBorderRadius: BorderRadiusPolicy =
    projectBorderRadiusPolicy === "none" ||
    projectBorderRadiusPolicy === "md" ||
    projectBorderRadiusPolicy === "lg"
      ? projectBorderRadiusPolicy
      : "lg";
  const radiusVars =
    effectiveBorderRadius === "none"
      ? {
          "--hero-centered-radius-shell": "0px",
          "--hero-centered-radius-button": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--hero-centered-radius-shell": "0.75rem",
            "--hero-centered-radius-button": "0.75rem",
          }
        : {
            "--hero-centered-radius-shell": "1rem",
            "--hero-centered-radius-button": "1rem",
          };

  useEffect(() => {
    const host = sectionRef.current?.closest("main[data-theme]");
    if (!host) {
      return;
    }

    const syncMode = () => {
      const nextMode = host.getAttribute("data-mode");
      setObservedMode(nextMode === "dark" ? "dark" : "light");
    };

    syncMode();
    const observer = new MutationObserver(syncMode);
    observer.observe(host, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      data-testid="HeroCenteredComponent"
      className={`${styles.backgroundImage} overflow-hidden [border-radius:var(--hero-centered-radius-shell)]`}
      style={
        {
          ...radiusVars,
          ...(heroImageAsset ? { backgroundImage: `url(${heroImageAsset.publicUrl})` } : {}),
        } as CSSProperties
      }
    >
      <div
        className={`${spacing.shellClassName} ${getContentPositionClass(contentPosition)}`}
        
      >

        <div ref={visibleRef} className={spacing.contentClassName}>
          {eyebrow.trim().length > 0 ? (
            <p className={`${spacing.eyebrowClassName} ${theme.kicker}`}>
              {animateContent ? (
                <OffsetRevealText text={eyebrow} direction="up" duration={DURATION} fade startDelay={eyebrowDelay} restartKey={visible ? 1 : 0} />
              ) : eyebrow}
            </p>
          ) : null}
          <h1 className={spacing.headingClassName}>
            {animateContent ? (
              <OffsetRevealText text={title} direction="up" duration={DURATION} fade startDelay={titleDelay} restartKey={visible ? 1 : 0} />
            ) : animateMainText ? (
              <TypewriterText
                text={title}
                startDelay={visible ? 0 : 10_000_000}
                restartKey={visible ? 1 : 0}
                loop={false}
                showCursor
              />
            ) : title}
          </h1>
          <p className={`${spacing.subtitleClassName} ${theme.muted}`}>
            {animateContent ? (
              <OffsetRevealText text={subtitle} direction="up" duration={DURATION} fade startDelay={subtitleDelay} restartKey={visible ? 1 : 0} />
            ) : subtitle}
          </p>
          <div>
            {animateContent ? (
              <OffsetRevealText text={buttonText} direction="up" duration={DURATION} fade startDelay={buttonDelay} restartKey={visible ? 1 : 0}>
                {buttonAnchor.trim().length > 0 ? (
                  <a href={`#${buttonAnchor}`} className={`${theme.buttonTone} ${spacing.buttonClassName}`} style={{ borderRadius: "var(--hero-centered-radius-button)" }}>
                    {buttonText}
                  </a>
                ) : (
                  <span className={`${theme.buttonTone} ${spacing.buttonClassName}`} style={{ borderRadius: "var(--hero-centered-radius-button)" }}>
                    {buttonText}
                  </span>
                )}
              </OffsetRevealText>
            ) : buttonAnchor.trim().length > 0 ? (
              <a href={`#${buttonAnchor}`} className={`${theme.buttonTone} ${spacing.buttonClassName}`} style={{ borderRadius: "var(--hero-centered-radius-button)" }}>
                {buttonText}
              </a>
            ) : (
              <span className={`${theme.buttonTone} ${spacing.buttonClassName}`} style={{ borderRadius: "var(--hero-centered-radius-button)" }}>
                {buttonText}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
