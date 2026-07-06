import Image from "next/image";
import type { CSSProperties } from "react";

import { resolveAssetById } from "@/lib/assets/resolution";
import { ProjectModeSwitcher } from "@/components/projects/project-mode-switcher";
import type { BlockRenderProps } from "../../shared/types";
import { readAppHeaderProps } from "./model";
import { renderSocialIcon } from "./social-icon-components";
import { MobileMenu } from "./mobile-menu";
import styles from "./render.module.css";

export function AppHeaderDefaultRender({
  block,
  assetMap,
  mode = "light",
  modePolicy = "switchable",
  projectBorderRadiusPolicy,
  projectSpacingScale,
  projectSurfaceStyle,
}: BlockRenderProps) {
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

  const lightLogoAsset = resolveAssetById(logoLightAssetId ?? logoAssetId, assetMap);
  const darkLogoAsset = resolveAssetById(logoDarkAssetId ?? logoAssetId, assetMap);
  const sameLogos = !lightLogoAsset || !darkLogoAsset || lightLogoAsset.id === darkLogoAsset.id;

  const hasContent =
    title.trim().length > 0 ||
    Boolean(lightLogoAsset) ||
    Boolean(darkLogoAsset) ||
    menuItems.length > 0 ||
    socialLinks.length > 0;

  const canShowModeSwitcher = showModeSwitcher && modePolicy === "switchable";

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

  const logoContent = sameLogos ? (
    <>
      {lightLogoAsset ? (
        <Image
          src={lightLogoAsset.publicUrl}
          alt={lightLogoAsset.id}
          width={120}
          height={48}
          unoptimized
          className={styles.logo}
        />
      ) : null}
      {title.trim().length > 0 ? (
        <h2 className={styles.title}>{title}</h2>
      ) : null}
    </>
  ) : (
    <>
      {lightLogoAsset ? (
        <Image
          src={lightLogoAsset.publicUrl}
          alt={lightLogoAsset.id}
          width={120}
          height={48}
          unoptimized
          className={styles.logoLight}
        />
      ) : null}
      {darkLogoAsset ? (
        <Image
          src={darkLogoAsset.publicUrl}
          alt={darkLogoAsset.id}
          width={120}
          height={48}
          unoptimized
          className={styles.logoDark}
        />
      ) : null}
      {title.trim().length > 0 ? (
        <h2 className={styles.title}>{title}</h2>
      ) : null}
    </>
  );

  return (
    <section
      data-spacing-scale={effectiveSpacingScale}
      data-surface-style={projectSurfaceStyle ?? "default"}
      data-collapse-breakpoint={collapseBreakpoint}
      data-always-mobile={alwaysMobile ? "" : undefined}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      {!hasContent ? (
        <div aria-hidden className={styles.emptyState} />
      ) : null}

      <MobileMenu
        menuItems={menuItems}
        socialLinks={socialLinks}
        canShowModeSwitcher={canShowModeSwitcher}
        initialMode={mode}
        modePolicy={modePolicy}
      >
        {logoContent}
      </MobileMenu>

      <div data-testid="DesktopHeader" className={styles.desktopHeader}>
        <div className={styles.desktopLeft}>
          {logoContent}
        </div>

        <nav aria-label="Page sections" className="flex items-center justify-center">
          {menuItems.length > 0 ? (
            <ul className={styles.desktopNavList}>
              {menuItems.map((item, index) => (
                <li key={`${item.anchorId}-${item.label}-${index}`}>
                  <a href={`#${item.anchorId}`} className={styles.navLink}>
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
              initialMode={mode}
              syncSearchParam="mode"
              policy={modePolicy}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
