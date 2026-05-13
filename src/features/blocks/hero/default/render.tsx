"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";

import { resolveAssetById } from "@/lib/assets/resolution";

import type { BlockRenderProps } from "../../shared/types";
type BorderRadiusPolicy = "none" | "md" | "lg";

function getContentPositionClass(contentPosition: string) {
  if (contentPosition === "top") {
    return "items-start";
  }
  if (contentPosition === "bottom") {
    return "items-end";
  }
  if (contentPosition === "stretch") {
    return "items-stretch";
  }
  return "items-center";
}

export function HeroDefaultRender({
  block,
  assetMap,
  theme,
  mode = "light",
  projectBorderRadiusPolicy,
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
  const effectiveBorderRadius: BorderRadiusPolicy =
    projectBorderRadiusPolicy === "none" ||
    projectBorderRadiusPolicy === "md" ||
    projectBorderRadiusPolicy === "lg"
      ? projectBorderRadiusPolicy
      : "lg";
  const radiusVars =
    effectiveBorderRadius === "none"
      ? {
          "--hero-radius-media": "0px",
          "--hero-radius-button": "0px",
          "--hero-radius-panel": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--hero-radius-media": "0.75rem",
            "--hero-radius-button": "0.75rem",
            "--hero-radius-panel": "0.75rem",
          }
        : {
            "--hero-radius-media": "1rem",
            "--hero-radius-button": "1rem",
            "--hero-radius-panel": "1rem",
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
      data-component-id="hero:default"
      className={`grid gap-8 lg:grid-cols-[1.05fr_0.95fr] ${getContentPositionClass(contentPosition)}`}
      style={radiusVars as CSSProperties}
    >
      
      {heroImageAsset ? (
        <div className="overflow-hidden bg-surface-alt [border-radius:var(--hero-radius-media)]">
          <Image
            src={heroImageAsset.publicUrl}
            alt={heroImageAsset.alt ?? heroImageAsset.originalFilename}
            width={1200}
            height={900}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div
        className={`flex min-h-[20rem] flex-col p-4 md:min-h-[26rem] md:p-4 justify-center [border-radius:var(--hero-radius-panel)] ${contentPosition === "stretch" ? "h-full" : ""}`}
      >
        <div className={`space-y-5 py-8 ${contentPosition === "stretch" ? "h-full flex justify-between flex-col" : ""}`}>
          {eyebrow.trim().length > 0 ? (
            <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${theme.kicker}`}>
              {eyebrow}
            </p>
          ) : null}
          <div className="flex flex-col gap-4">
            <h1 className="break-words text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            <p className={`max-w-3xl break-words text-base leading-7 ${theme.muted}`}>
              {subtitle}
            </p>
          </div>
          {buttonAnchor.trim().length > 0 ? (
            <div>
              <a
                href={`#${buttonAnchor}`}
                className={theme.button}
                style={{ borderRadius: "var(--hero-radius-button)" }}
              >
                {buttonText}
              </a>
            </div>
          ) : (
            <div>
              <span className={theme.button} style={{ borderRadius: "var(--hero-radius-button)" }}>
                {buttonText}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
