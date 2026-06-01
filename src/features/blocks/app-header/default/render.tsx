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

function getResponsiveClasses(collapseBreakpoint: "sm" | "md" | "lg" | "xl") {
  switch (collapseBreakpoint) {
    case "sm":
      return {
        mobileOnly: "sm:hidden",
        desktopOnly: "hidden sm:grid",
      };
    case "lg":
      return {
        mobileOnly: "lg:hidden",
        desktopOnly: "hidden lg:grid",
      };
    case "xl":
      return {
        mobileOnly: "xl:hidden",
        desktopOnly: "hidden xl:grid",
      };
    case "md":
    default:
      return {
        mobileOnly: "md:hidden",
        desktopOnly: "hidden md:grid",
      };
  }
}

type SpacingScale = "sm" | "md" | "lg";

const APP_HEADER_SPACING: Record<
  SpacingScale,
  {
    sectionClassName: string;
    emptyStateClassName: string;
    mobileMenuButtonClassName: string;
    mobileLogoWrapClassName: string;
    logoClassName: string;
    mobileTitleClassName: string;
    mobilePanelClassName: string;
    mobilePanelGridClassName: string;
    mobileNavListClassName: string;
    mobileNavLinkClassName: string;
    mobileSocialWrapClassName: string;
    mobileSocialLinkClassName: string;
    mobileModeWrapClassName: string;
    desktopHeaderClassName: string;
    desktopLeftClassName: string;
    desktopTitleClassName: string;
    desktopNavListClassName: string;
    desktopNavLinkClassName: string;
    desktopRightClassName: string;
    desktopSocialLinkClassName: string;
  }
> = {
  sm: {
    sectionClassName: "p-3 md:py-1 [border-radius:var(--app-header-radius-shell)]",
    emptyStateClassName:
      "h-8 w-full border border-dashed border-line bg-surface-alt [border-radius:var(--app-header-radius-control)]",
    mobileMenuButtonClassName:
      "absolute left-0 inline-flex h-8 w-8 items-center justify-center border border-line bg-surface-alt text-text-main transition hover:bg-surface [border-radius:var(--app-header-radius-control)]",
    mobileLogoWrapClassName: "flex min-w-0 items-center justify-center gap-2 px-10",
    logoClassName: "h-8 w-auto object-contain",
    mobileTitleClassName: "text-lg font-semibold tracking-tight text-text-main",
    mobilePanelClassName: "mb-2 border border-line bg-surface p-3 [border-radius:var(--app-header-radius-panel)]",
    mobilePanelGridClassName: "grid gap-3",
    mobileNavListClassName: "grid gap-1.5",
    mobileNavLinkClassName: "text-xs font-medium transition hover:underline",
    mobileSocialWrapClassName: "flex flex-wrap items-center gap-2 border-t border-line pt-2",
    mobileSocialLinkClassName: "inline-flex items-center gap-1 text-xs font-medium transition hover:underline",
    mobileModeWrapClassName: "border-t border-line pt-2",
    desktopHeaderClassName:
      "items-center gap-3 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
    desktopLeftClassName: "flex items-center gap-2 md:justify-start",
    desktopTitleClassName: "text-lg font-semibold tracking-tight text-text-main",
    desktopNavListClassName: "flex flex-wrap items-center justify-center gap-3",
    desktopNavLinkClassName: "text-xs font-medium transition hover:underline",
    desktopRightClassName: "flex items-center justify-start gap-2 md:justify-end",
    desktopSocialLinkClassName: "inline-flex items-center gap-1 text-xs font-medium transition hover:underline",
  },
  md: {
    sectionClassName: "p-6 md:py-2 [border-radius:var(--app-header-radius-shell)]",
    emptyStateClassName:
      "h-10 w-full border border-dashed border-line bg-surface-alt [border-radius:var(--app-header-radius-control)]",
    mobileMenuButtonClassName:
      "absolute left-0 inline-flex h-9 w-9 items-center justify-center border border-line bg-surface-alt text-text-main transition hover:bg-surface [border-radius:var(--app-header-radius-control)]",
    mobileLogoWrapClassName: "flex min-w-0 items-center justify-center gap-3 px-12",
    logoClassName: "h-10 w-auto object-contain",
    mobileTitleClassName: "text-xl font-semibold tracking-tight text-text-main",
    mobilePanelClassName: "mb-4 border border-line bg-surface p-4 [border-radius:var(--app-header-radius-panel)]",
    mobilePanelGridClassName: "grid gap-4",
    mobileNavListClassName: "grid gap-2",
    mobileNavLinkClassName: "text-sm font-medium transition hover:underline",
    mobileSocialWrapClassName: "flex flex-wrap items-center gap-3 border-t border-line pt-3",
    mobileSocialLinkClassName: "inline-flex items-center gap-1.5 text-sm font-medium transition hover:underline",
    mobileModeWrapClassName: "border-t border-line pt-3",
    desktopHeaderClassName:
      "items-center gap-4 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
    desktopLeftClassName: "flex items-center gap-3 md:justify-start",
    desktopTitleClassName: "text-xl font-semibold tracking-tight text-text-main",
    desktopNavListClassName: "flex flex-wrap items-center justify-center gap-4",
    desktopNavLinkClassName: "text-sm font-medium transition hover:underline",
    desktopRightClassName: "flex items-center justify-start gap-3 md:justify-end",
    desktopSocialLinkClassName: "inline-flex items-center gap-1.5 text-sm font-medium transition hover:underline",
  },
  lg: {
    sectionClassName: "p-8 md:py-3 [border-radius:var(--app-header-radius-shell)]",
    emptyStateClassName:
      "h-12 w-full border border-dashed border-line bg-surface-alt [border-radius:var(--app-header-radius-control)]",
    mobileMenuButtonClassName:
      "absolute left-0 inline-flex h-10 w-10 items-center justify-center border border-line bg-surface-alt text-text-main transition hover:bg-surface [border-radius:var(--app-header-radius-control)]",
    mobileLogoWrapClassName: "flex min-w-0 items-center justify-center gap-4 px-14",
    logoClassName: "h-12 w-auto object-contain",
    mobileTitleClassName: "text-2xl font-semibold tracking-tight text-text-main",
    mobilePanelClassName: "mb-5 border border-line bg-surface p-5 [border-radius:var(--app-header-radius-panel)]",
    mobilePanelGridClassName: "grid gap-5",
    mobileNavListClassName: "grid gap-3",
    mobileNavLinkClassName: "text-base font-medium transition hover:underline",
    mobileSocialWrapClassName: "flex flex-wrap items-center gap-4 border-t border-line pt-4",
    mobileSocialLinkClassName: "inline-flex items-center gap-2 text-base font-medium transition hover:underline",
    mobileModeWrapClassName: "border-t border-line pt-4",
    desktopHeaderClassName:
      "items-center gap-5 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]",
    desktopLeftClassName: "flex items-center gap-4 md:justify-start",
    desktopTitleClassName: "text-2xl font-semibold tracking-tight text-text-main",
    desktopNavListClassName: "flex flex-wrap items-center justify-center gap-5",
    desktopNavLinkClassName: "text-base font-medium transition hover:underline",
    desktopRightClassName: "flex items-center justify-start gap-4 md:justify-end",
    desktopSocialLinkClassName: "inline-flex items-center gap-2 text-base font-medium transition hover:underline",
  },
};

export function AppHeaderDefaultRender({
  block,
  assetMap,
  theme,
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
  } =
    readAppHeaderProps(block.props);
  const responsive = getResponsiveClasses(collapseBreakpoint);
  const activeMode = observedMode ?? mode;
  const mobileOnlyClass = alwaysMobile ? "" : responsive.mobileOnly;
  const desktopOnlyClass = alwaysMobile ? "hidden" : responsive.desktopOnly;
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
  const effectiveSpacingScale: SpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const spacing = APP_HEADER_SPACING[effectiveSpacingScale];
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
      className={spacing.sectionClassName}
      style={radiusVars as CSSProperties}
    >
      {!hasContent ? (
        <div
          aria-hidden
          className={spacing.emptyStateClassName}
        />
      ) : null}


      <div data-testid="MobileHeader" className={`relative flex items-center justify-center ${mobileOnlyClass}`}>
        <button
          type="button"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          className={spacing.mobileMenuButtonClassName}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <FiX aria-hidden className="h-5 w-5" /> : <FiMenu aria-hidden className="h-5 w-5" />}
        </button>

        <div className={spacing.mobileLogoWrapClassName}>
          {logoAsset ? (
            <Image
              src={logoAsset.publicUrl}
              alt={logoAsset.id}
              width={120}
              height={48}
              unoptimized
              className={spacing.logoClassName}
            />
          ) : null}

          {title.trim().length > 0 ? (
            <h2 className={spacing.mobileTitleClassName}>{title}</h2>
          ) : null}
        </div>
      </div>

      <div
        data-testid="MobileMenu"
        aria-hidden={!isMobileMenuOpen}
        className={`overflow-hidden transition-all duration-300 ease-out ${mobileOnlyClass} ${
          isMobileMenuOpen
            ? "mt-4 max-h-[24rem] opacity-100 translate-y-0"
            : "mt-0 max-h-0 opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        <div className={spacing.mobilePanelClassName}>
          <div className={spacing.mobilePanelGridClassName}>
            {menuItems.length > 0 ? (
              <nav aria-label="Mobile page sections">
                <ul className={spacing.mobileNavListClassName}>
                  {menuItems.map((item, index) => (
                    <li key={`${item.anchorId}-${item.label}-mobile-${index}`}>
                      <a
                        href={`#${item.anchorId}`}
                        className={`${spacing.mobileNavLinkClassName} ${theme.muted}`}
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
              <div className={spacing.mobileSocialWrapClassName}>
                {socialLinks.map((item, index) => (
                  <a
                    key={`${item.url}-${item.label}-mobile-${index}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`${spacing.mobileSocialLinkClassName} ${theme.muted}`}
                  >
                    {renderSocialIcon(item.icon)}
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}

            {canShowModeSwitcher ? (
              <div className={spacing.mobileModeWrapClassName}>
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
        className={`${desktopOnlyClass} ${spacing.desktopHeaderClassName}`}
      >
        <div className={spacing.desktopLeftClassName}>
          {logoAsset ? (
            <Image
              src={logoAsset.publicUrl}
              alt={logoAsset.id}
              width={120}
              height={48}
              unoptimized
              className={spacing.logoClassName}
            />
          ) : null}

          {title.trim().length > 0 ? (
            <h2 className={spacing.desktopTitleClassName}>{title}</h2>
          ) : null}
        </div>

        <nav aria-label="Page sections" className="flex items-center justify-center">
          {menuItems.length > 0 ? (
            <ul className={spacing.desktopNavListClassName}>
              {menuItems.map((item, index) => (
                <li key={`${item.anchorId}-${item.label}-${index}`}>
                  <a
                    href={`#${item.anchorId}`}
                    className={`${spacing.desktopNavLinkClassName} ${theme.muted}`}
                    onClick={(event) => handleAnchorClick(event, item.anchorId)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </nav>

        <div className={spacing.desktopRightClassName}>
          {socialLinks.map((item, index) => (
            <a
              key={`${item.url}-${item.label}-${index}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
              title={item.label}
              className={`${spacing.desktopSocialLinkClassName} ${theme.muted}`}
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
