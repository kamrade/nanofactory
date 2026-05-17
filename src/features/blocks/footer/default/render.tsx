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

function getRightGridColsClass(columnCount: number) {
  if (columnCount <= 1) {
    return "grid-cols-1";
  }
  if (columnCount === 2) {
    return "grid-cols-1 sm:grid-cols-2";
  }
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

type BorderRadiusPolicy = "none" | "md" | "lg";
type SpacingScale = "sm" | "md" | "lg";

const FOOTER_SPACING: Record<
  SpacingScale,
  {
    sectionClassName: string;
    logoRowClassName: string;
    logoClassName: string;
    siteNameClassName: string;
    contentGridClassName: string;
    leftColumnClassName: string;
    leftTitleClassName: string;
    descriptionClassName: string;
    socialTitleClassName: string;
    socialLinksWrapClassName: string;
    socialLinkClassName: string;
    scrollTopButtonClassName: string;
    rightColumnsWrapClassName: string;
    columnClassName: string;
    columnTitleClassName: string;
    linksListClassName: string;
    linkClassName: string;
    bottomClassName: string;
    bottomTextClassName: string;
  }
> = {
  sm: {
    sectionClassName: "px-3 py-6 md:px-5 md:py-8",
    logoRowClassName: "mb-2 flex items-center gap-2",
    logoClassName: "h-8 w-auto object-contain",
    siteNameClassName: "text-sm font-semibold text-text-main",
    contentGridClassName: "grid gap-5 border-t border-line pt-5 md:grid-cols-4",
    leftColumnClassName: "flex flex-col gap-3 md:col-span-1",
    leftTitleClassName: "text-xs font-semibold uppercase tracking-wide text-text-main",
    descriptionClassName: "text-xs leading-5",
    socialTitleClassName: "pt-1 text-xs font-medium text-text-main",
    socialLinksWrapClassName: "flex flex-wrap items-center gap-2",
    socialLinkClassName:
      "inline-flex items-center gap-1.5 border border-line bg-surface px-2 py-1 text-xs transition hover:bg-surface-alt [border-radius:var(--footer-radius-control)]",
    scrollTopButtonClassName:
      "mt-auto inline-flex w-fit items-center border border-line bg-surface px-2.5 py-1.5 text-xs font-medium transition hover:bg-surface-alt [border-radius:var(--footer-radius-control)]",
    rightColumnsWrapClassName: "grid gap-5",
    columnClassName: "grid gap-2",
    columnTitleClassName: "text-sm font-semibold text-text-main",
    linksListClassName: "grid gap-1.5",
    linkClassName: "text-xs transition hover:underline",
    bottomClassName: "mt-6 border-t border-line pt-3",
    bottomTextClassName: "text-[11px]",
  },
  md: {
    sectionClassName: "px-4 py-8 md:px-8 md:py-12",
    logoRowClassName: "mb-3 flex items-center gap-3",
    logoClassName: "h-10 w-auto object-contain",
    siteNameClassName: "text-base font-semibold text-text-main",
    contentGridClassName: "grid gap-8 border-t border-line pt-8 md:grid-cols-4",
    leftColumnClassName: "flex flex-col gap-4 md:col-span-1",
    leftTitleClassName: "text-sm font-semibold uppercase tracking-wide text-text-main",
    descriptionClassName: "text-sm",
    socialTitleClassName: "pt-2 text-sm font-medium text-text-main",
    socialLinksWrapClassName: "flex flex-wrap items-center gap-3",
    socialLinkClassName:
      "inline-flex items-center gap-2 border border-line bg-surface px-2 py-1 text-sm transition hover:bg-surface-alt [border-radius:var(--footer-radius-control)]",
    scrollTopButtonClassName:
      "mt-auto inline-flex w-fit items-center border border-line bg-surface px-3 py-2 text-sm font-medium transition hover:bg-surface-alt [border-radius:var(--footer-radius-control)]",
    rightColumnsWrapClassName: "grid gap-8",
    columnClassName: "grid gap-3",
    columnTitleClassName: "text-base font-semibold text-text-main",
    linksListClassName: "grid gap-2",
    linkClassName: "text-sm transition hover:underline",
    bottomClassName: "mt-8 border-t border-line pt-4",
    bottomTextClassName: "text-xs",
  },
  lg: {
    sectionClassName: "px-6 py-10 md:px-10 md:py-14",
    logoRowClassName: "mb-4 flex items-center gap-4",
    logoClassName: "h-12 w-auto object-contain",
    siteNameClassName: "text-lg font-semibold text-text-main",
    contentGridClassName: "grid gap-10 border-t border-line pt-10 md:grid-cols-4",
    leftColumnClassName: "flex flex-col gap-5 md:col-span-1",
    leftTitleClassName: "text-base font-semibold uppercase tracking-wide text-text-main",
    descriptionClassName: "text-base leading-7",
    socialTitleClassName: "pt-2 text-base font-medium text-text-main",
    socialLinksWrapClassName: "flex flex-wrap items-center gap-4",
    socialLinkClassName:
      "inline-flex items-center gap-2 border border-line bg-surface px-3 py-2 text-base transition hover:bg-surface-alt [border-radius:var(--footer-radius-control)]",
    scrollTopButtonClassName:
      "mt-auto inline-flex w-fit items-center border border-line bg-surface px-4 py-2.5 text-base font-medium transition hover:bg-surface-alt [border-radius:var(--footer-radius-control)]",
    rightColumnsWrapClassName: "grid gap-10",
    columnClassName: "grid gap-4",
    columnTitleClassName: "text-lg font-semibold text-text-main",
    linksListClassName: "grid gap-3",
    linkClassName: "text-base transition hover:underline",
    bottomClassName: "mt-10 border-t border-line pt-5",
    bottomTextClassName: "text-sm",
  },
};

export function FooterDefaultRender({
  block,
  assetMap,
  theme,
  projectBorderRadiusPolicy,
  projectSpacingScale,
}: BlockRenderProps) {
  const props = readFooterProps(block.props);
  const logoAsset = resolveAssetById(props.logoAssetId, assetMap);
  const currentYear = new Date().getFullYear();
  const effectiveSpacingScale: SpacingScale =
    projectSpacingScale === "sm" || projectSpacingScale === "md" || projectSpacingScale === "lg"
      ? projectSpacingScale
      : "md";
  const spacing = FOOTER_SPACING[effectiveSpacingScale];
  const effectiveBorderRadius: BorderRadiusPolicy =
    projectBorderRadiusPolicy === "none" ||
    projectBorderRadiusPolicy === "md" ||
    projectBorderRadiusPolicy === "lg"
      ? projectBorderRadiusPolicy
      : "lg";
  const radiusVars =
    effectiveBorderRadius === "none"
      ? {
          "--footer-radius-control": "0px",
        }
      : effectiveBorderRadius === "md"
        ? {
            "--footer-radius-control": "0.5rem",
          }
        : {
            "--footer-radius-control": "0.75rem",
          };

  const rightColumns = [
    {
      title: props.navColumnTitle,
      links: props.navLinks,
      renderLink: (item: { label: string; anchorId: string }, index: number) => (
        <li key={`${item.anchorId}-${item.label}-${index}`}>
          <a
            href={`#${item.anchorId}`}
            className={`${spacing.linkClassName} ${theme.muted}`}
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
            className={`${spacing.linkClassName} ${theme.muted}`}
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
            className={`${spacing.linkClassName} ${theme.muted}`}
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
      className={spacing.sectionClassName}
      style={radiusVars as CSSProperties}
    >
      <div className={spacing.logoRowClassName}>
        {logoAsset ? (
          <Image
            src={logoAsset.publicUrl}
            alt={logoAsset.id}
            width={140}
            height={56}
            unoptimized
            className={spacing.logoClassName}
          />
        ) : null}
        {props.siteName.trim().length > 0 ? (
          <p className={spacing.siteNameClassName}>{props.siteName}</p>
        ) : null}

      </div>

      <div className={spacing.contentGridClassName}>
        {hasLeftContent ? (
          <div className={spacing.leftColumnClassName}>

            {props.leftTitle.trim().length > 0 ? (
              <h3 className={spacing.leftTitleClassName}>
                {props.leftTitle}
              </h3>
            ) : null}

            

            {props.siteDescription.trim().length > 0 ? (
              <p className={`${spacing.descriptionClassName} ${theme.muted}`}>{props.siteDescription}</p>
            ) : null}

            {props.socialLinksTitle.trim().length > 0 ? (
              <p className={spacing.socialTitleClassName}>{props.socialLinksTitle}</p>
            ) : null}

            {props.socialLinks.length > 0 ? (
              <div className={spacing.socialLinksWrapClassName}>
                {props.socialLinks.map((item, index) => (
                  <a
                    key={`${item.url}-${item.label}-footer-${index}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`${spacing.socialLinkClassName} ${theme.muted}`}
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
                className={`${spacing.scrollTopButtonClassName} ${theme.muted}`}
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
          <div className="md:col-span-3">
            <div className={`${spacing.rightColumnsWrapClassName} ${getRightGridColsClass(rightColumns.length)}`}>
              {rightColumns.map((column, columnIndex) => (
                <div key={`footer-column-${columnIndex}`} className={spacing.columnClassName}>
                  {column.title.trim().length > 0 ? (
                    <h3 className={spacing.columnTitleClassName}>
                      {column.title}
                    </h3>
                  ) : null}

                  {column.links.length > 0 ? (
                    <ul className={spacing.linksListClassName}>
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

      <div className={spacing.bottomClassName}>
        <p className={`${spacing.bottomTextClassName} ${theme.muted}`}>
          &copy; {currentYear}
          {props.siteName.trim().length > 0 ? ` ${props.siteName}` : ""}
        </p>
      </div>
    </section>
  );
}
