"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { FiLink, FiMenu, FiX } from "react-icons/fi";
import type { IconType } from "react-icons";

import { resolveAssetById } from "@/lib/assets/resolution";
import { ProjectModeSwitcher } from "@/components/projects/project-mode-switcher";
import type { BlockRenderProps } from "../../shared/types";
import type { SocialIconKey } from "./social-icons";
import { readAppHeaderProps } from "./model";
import { normalizeAnchorId } from "@/lib/editor/anchor-id";
import styles from "./render.module.css";

const SOCIAL_ICON_COMPONENTS: Record<SocialIconKey, IconType> = {
  link: FiLink,
  instagram: FaInstagram,
  x: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  facebook: FaFacebook,
  telegram: FaTelegram,
  tiktok: FaTiktok,
};

function renderSocialIcon(icon: SocialIconKey) {
  const Icon = SOCIAL_ICON_COMPONENTS[icon] ?? FiLink;
  return <Icon aria-hidden className="h-4 w-4" />;
}

export function AppHeaderDefaultRender({
  block,
  assetMap,
  mode = "light",
  modePolicy = "switchable",
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [observedMode, setObservedMode] = useState<"light" | "dark" | null>(null);
  const [observedModePolicy, setObservedModePolicy] = useState<
    "switchable" | "light-only" | "dark-only" | null
  >(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    title,
    logoAssetId,
    logoLightAssetId,
    logoDarkAssetId,
    collapseBreakpoint,
    alwaysMobile,
    showModeSwitcher,
    menuItems,
    socialLinks,
  } = readAppHeaderProps(block.props);

  const activeMode = observedMode ?? mode;
  const selectedLogoId =
    activeMode === "dark" ? logoDarkAssetId ?? logoAssetId : logoLightAssetId ?? logoAssetId;
  const logoAsset = resolveAssetById(selectedLogoId, assetMap);
  const hasContent =
    title.trim().length > 0 ||
    Boolean(logoAsset) ||
    menuItems.length > 0 ||
    socialLinks.length > 0;
  const effectiveModePolicy = observedModePolicy ?? modePolicy;
  const canShowModeSwitcher = showModeSwitcher && effectiveModePolicy === "switchable";
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
          "--app-header-radius-shell": "0px",
          "--app-header-radius-panel": "0px",
          "--app-header-radius-control": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--app-header-radius-shell": "0.75rem",
            "--app-header-radius-panel": "0.75rem",
            "--app-header-radius-control": "0.5rem",
          }
        : {
            "--app-header-radius-shell": "1.5rem",
            "--app-header-radius-panel": "1rem",
            "--app-header-radius-control": "0.75rem",
          };

  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, anchorId: string) {
    if (typeof document === "undefined") {
      return;
    }

    const normalizedAnchorId = normalizeAnchorId(anchorId);
    const target =
      document.getElementById(anchorId) ??
      document.getElementById(normalizedAnchorId);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${normalizedAnchorId || anchorId}`);
    }
  }

  useEffect(() => {
    const host = sectionRef.current?.closest("main[data-theme]");
    if (!host) {
      return;
    }

    const syncModeState = () => {
      const nextMode = host.getAttribute("data-mode");
      setObservedMode(nextMode === "dark" ? "dark" : "light");
      const nextModePolicy = host.getAttribute("data-mode-policy");
      setObservedModePolicy(
        nextModePolicy === "light-only" || nextModePolicy === "dark-only" || nextModePolicy === "switchable"
          ? nextModePolicy
          : null
      );
    };

    syncModeState();
    const observer = new MutationObserver(syncModeState);
    observer.observe(host, {
      attributes: true,
      attributeFilter: ["data-mode", "data-mode-policy"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-spacing-scale={effectiveSpacingScale}
      data-collapse-breakpoint={collapseBreakpoint}
      data-always-mobile={alwaysMobile ? "" : undefined}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      {!hasContent ? (
        <div aria-hidden className={styles.emptyState} />
      ) : null}

      <div data-testid="MobileHeader" className={styles.mobileHeader}>
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <FiX aria-hidden className="h-5 w-5" /> : <FiMenu aria-hidden className="h-5 w-5" />}
        </button>

        <div className={styles.mobileLogoWrap}>
          {logoAsset ? (
            <Image
              src={logoAsset.publicUrl}
              alt={logoAsset.id}
              width={120}
              height={48}
              unoptimized
              className={styles.logo}
            />
          ) : null}

          {title.trim().length > 0 ? (
            <h2 className={styles.title}>{title}</h2>
          ) : null}
        </div>
      </div>

      <div
        data-testid="MobileMenu"
        data-open={isMobileMenuOpen ? "true" : "false"}
        aria-hidden={!isMobileMenuOpen}
        className={styles.mobileMenu}
      >
        <div className={styles.mobilePanel}>
          <div className={styles.mobilePanelGrid}>
            {menuItems.length > 0 ? (
              <nav aria-label="Mobile page sections">
                <ul className={styles.mobileNavList}>
                  {menuItems.map((item, index) => (
                    <li key={`${item.anchorId}-${item.label}-mobile-${index}`}>
                      <a
                        href={`#${item.anchorId}`}
                        className={styles.navLink}
                        onClick={(event) => {
                          handleAnchorClick(event, item.anchorId);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {socialLinks.length > 0 ? (
              <div className={styles.mobileSocialWrap}>
                {socialLinks.map((item, index) => (
                  <a
                    key={`${item.url}-${item.label}-mobile-${index}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.socialLink}
                  >
                    {renderSocialIcon(item.icon)}
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}

            {canShowModeSwitcher ? (
              <div className={styles.mobileModeWrap}>
                <ProjectModeSwitcher
                  initialMode={activeMode}
                  syncSearchParam="mode"
                  policy={modePolicy}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div
        data-testid="DesktopHeader"
        className={styles.desktopHeader}
      >
        <div className={styles.desktopLeft}>
          {logoAsset ? (
            <Image
              src={logoAsset.publicUrl}
              alt={logoAsset.id}
              width={120}
              height={48}
              unoptimized
              className={styles.logo}
            />
          ) : null}

          {title.trim().length > 0 ? (
            <h2 className={styles.title}>{title}</h2>
          ) : null}
        </div>

        <nav aria-label="Page sections" className="flex items-center justify-center">
          {menuItems.length > 0 ? (
            <ul className={styles.desktopNavList}>
              {menuItems.map((item, index) => (
                <li key={`${item.anchorId}-${item.label}-${index}`}>
                  <a
                    href={`#${item.anchorId}`}
                    className={styles.navLink}
                    onClick={(event) => handleAnchorClick(event, item.anchorId)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </nav>

        <div className={styles.desktopRight}>
          {socialLinks.map((item, index) => (
            <a
              key={`${item.url}-${item.label}-${index}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={item.label}
              className={styles.socialLink}
            >
              {renderSocialIcon(item.icon)}
              <span className="sr-only">{item.label}</span>
            </a>
          ))}
          {canShowModeSwitcher ? (
            <ProjectModeSwitcher
              initialMode={activeMode}
              syncSearchParam="mode"
              policy={modePolicy}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
