"use client";

import { useEffect, useRef, useState } from "react";

import styles from './render.module.css';

import { resolveAssetById } from "@/lib/assets/resolution";

import type { BlockRenderProps } from "../../shared/types";

export function HeroCenteredRender({ block, assetMap, theme, mode = "light" }: BlockRenderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeMode, setActiveMode] = useState<"light" | "dark">(mode);
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const subtitle =
    typeof block.props.subtitle === "string" ? block.props.subtitle : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";
  const buttonAnchor =
    typeof block.props.buttonAnchor === "string" ? block.props.buttonAnchor : "";
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
      <div className="m-auto flex max-w-3xl flex-col items-center gap-6 text-center py-12"
        
      >

        <div className="space-y-5">
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
