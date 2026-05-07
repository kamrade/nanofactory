"use client";

import { useEffect, useRef, useState } from "react";

import styles from './render.module.css';

import { resolveAssetById } from "@/lib/assets/resolution";

import type { BlockRenderProps } from "../../shared/types";

function getContentPositionClass(contentPosition: string) {
  if (contentPosition === "top") {
    return "justify-start";
  }
  if (contentPosition === "bottom") {
    return "justify-end";
  }
  return "justify-center";
}

export function HeroCenteredRender({ block, assetMap, theme, mode = "light" }: BlockRenderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeMode, setActiveMode] = useState<"light" | "dark">(mode);
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
  const selectedImageId =
    activeMode === "dark" ? darkImageId ?? defaultImageId : lightImageId ?? defaultImageId;
  const heroImageAsset = resolveAssetById(selectedImageId, assetMap);

  useEffect(() => {
    const host = sectionRef.current?.closest("main[data-theme]");
    if (!host) {
      setActiveMode(mode);
      return;
    }

    const syncMode = () => {
      const nextMode = host.getAttribute("data-mode");
      setActiveMode(nextMode === "dark" ? "dark" : "light");
    };

    syncMode();
    const observer = new MutationObserver(syncMode);
    observer.observe(host, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => observer.disconnect();
  }, [mode]);

  return (
    <section 
      ref={sectionRef}
      data-testid="HeroCenteredComponent"
      className={styles.backgroundImage}
      style={heroImageAsset ? { backgroundImage: `url(${heroImageAsset.publicUrl})` } : {}}
    >
      <div
        className={`m-auto flex min-h-[22rem] max-w-3xl flex-col items-center gap-6 py-12 text-center md:min-h-[28rem] ${getContentPositionClass(contentPosition)}`}
        
      >

        <div className="space-y-5">
          {eyebrow.trim().length > 0 ? (
            <p className={`text-sm font-semibold uppercase tracking-[0.14em] ${theme.kicker}`}>
              {eyebrow}
            </p>
          ) : null}
          <h1 className="break-words text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
          <p className={`mx-auto max-w-2xl break-words text-base leading-7 ${theme.muted}`}>
            {subtitle}
          </p>
          {buttonAnchor.trim().length > 0 ? (
            <div>
              <a href={`#${buttonAnchor}`} className={theme.button}>
                {buttonText}
              </a>
            </div>
          ) : (
            <div>
              <span className={theme.button}>{buttonText}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
