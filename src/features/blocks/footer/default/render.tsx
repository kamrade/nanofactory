"use client";

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
import { FiLink } from "react-icons/fi";
import type { IconType } from "react-icons";
import type { CSSProperties } from "react";

import type { BlockRenderProps } from "../../shared/types";
import { normalizeAnchorId } from "@/lib/editor/anchor-id";
import { resolveAssetById } from "@/lib/assets/resolution";
import { readFooterProps } from "./model";
import type { SocialIconKey } from "@/features/blocks/app-header/default/social-icons";
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

function hasLinkSection(title: string, links: Array<unknown>) {
  return title.trim().length > 0 || links.length > 0;
}

export function FooterDefaultRender({
  block,
  assetMap,
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const props = readFooterProps(block.props);
  const logoAsset = resolveAssetById(props.logoAssetId, assetMap);
  const currentYear = new Date().getFullYear();

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
      ? { "--footer-radius-control": "0px" }
      : effectiveBorderRadius === "md"
        ? { "--footer-radius-control": "0.5rem" }
        : { "--footer-radius-control": "0.75rem" };

  const rightColumns = [
    {
      title: props.navColumnTitle,
      links: props.navLinks,
      renderLink: (item: { label: string; anchorId: string }, index: number) => (
        <li key={`${item.anchorId}-${item.label}-${index}`}>
          <a
            href={`#${item.anchorId}`}
            className={styles.link}
            onClick={(event) => {
              if (typeof document === "undefined") {
                return;
              }
              const normalized = normalizeAnchorId(item.anchorId);
              const target =
                document.getElementById(item.anchorId) ?? document.getElementById(normalized);
              if (!target) {
                return;
              }
              event.preventDefault();
              target.scrollIntoView({ behavior: "smooth", block: "start" });
              if (typeof window !== "undefined") {
                window.history.replaceState(null, "", `#${normalized || item.anchorId}`);
              }
            }}
          >
            {item.label}
          </a>
        </li>
      ),
    },
    {
      title: props.linksColumnOneTitle,
      links: props.linksColumnOne,
      renderLink: (item: { label: string; url: string }, index: number) => (
        <li key={`${item.url}-${item.label}-col1-${index}`}>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.link}
          >
            {item.label}
          </a>
        </li>
      ),
    },
    {
      title: props.linksColumnTwoTitle,
      links: props.linksColumnTwo,
      renderLink: (item: { label: string; url: string }, index: number) => (
        <li key={`${item.url}-${item.label}-col2-${index}`}>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.link}
          >
            {item.label}
          </a>
        </li>
      ),
    },
  ].filter((column) => hasLinkSection(column.title, column.links));

  const hasLeftContent =
    props.leftTitle.trim().length > 0 ||
    Boolean(logoAsset) ||
    props.siteName.trim().length > 0 ||
    props.siteDescription.trim().length > 0 ||
    props.socialLinksTitle.trim().length > 0 ||
    props.socialLinks.length > 0 ||
    props.scrollTopLabel.trim().length > 0;

  return (
    <section
      data-spacing-scale={effectiveSpacingScale}
      className={styles.root}
      style={radiusVars as CSSProperties}
    >
      <div className={styles.logoRow}>
        {logoAsset ? (
          <Image
            src={logoAsset.publicUrl}
            alt={logoAsset.id}
            width={140}
            height={56}
            unoptimized
            className={styles.logo}
          />
        ) : null}
        {props.siteName.trim().length > 0 ? (
          <p className={styles.siteName}>{props.siteName}</p>
        ) : null}
      </div>

      <div className={styles.contentGrid}>
        {hasLeftContent ? (
          <div className={styles.leftColumn}>
            {props.leftTitle.trim().length > 0 ? (
              <h3 className={styles.leftTitle}>{props.leftTitle}</h3>
            ) : null}

            {props.siteDescription.trim().length > 0 ? (
              <p className={styles.description}>{props.siteDescription}</p>
            ) : null}

            {props.socialLinksTitle.trim().length > 0 ? (
              <p className={styles.socialTitle}>{props.socialLinksTitle}</p>
            ) : null}

            {props.socialLinks.length > 0 ? (
              <div className={styles.socialLinksWrap}>
                {props.socialLinks.map((item, index) => (
                  <a
                    key={`${item.url}-${item.label}-footer-${index}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={styles.socialLink}
                    aria-label={item.label}
                    title={item.label}
                  >
                    {renderSocialIcon(item.icon)}
                    <span className="sr-only">{item.label}</span>
                  </a>
                ))}
              </div>
            ) : null}

            {props.scrollTopLabel.trim().length > 0 ? (
              <button
                type="button"
                className={styles.scrollTopButton}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                {props.scrollTopLabel}
              </button>
            ) : null}
          </div>
        ) : null}

        {rightColumns.length > 0 ? (
          <div className={styles.rightColumnsOuter}>
            <div
              className={styles.rightColumns}
              data-column-count={rightColumns.length}
            >
              {rightColumns.map((column, columnIndex) => (
                <div key={`footer-column-${columnIndex}`} className={styles.column}>
                  {column.title.trim().length > 0 ? (
                    <h3 className={styles.columnTitle}>{column.title}</h3>
                  ) : null}

                  {column.links.length > 0 ? (
                    <ul className={styles.linksList}>
                      {column.links.map((item, linkIndex) =>
                        column.renderLink(item as never, linkIndex)
                      )}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className={styles.bottom}>
        <p className={styles.bottomText}>
          &copy; {currentYear}
          {props.siteName.trim().length > 0 ? ` ${props.siteName}` : ""}
        </p>
      </div>
    </section>
  );
}
