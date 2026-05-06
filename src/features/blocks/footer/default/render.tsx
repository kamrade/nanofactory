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

export function FooterDefaultRender({ block, assetMap, theme }: BlockRenderProps) {
  const props = readFooterProps(block.props);
  const logoAsset = resolveAssetById(props.logoAssetId, assetMap);
  const currentYear = new Date().getFullYear();

  const rightColumns = [
    {
      title: props.navColumnTitle,
      links: props.navLinks,
      renderLink: (item: { label: string; anchorId: string }, index: number) => (
        <li key={`${item.anchorId}-${item.label}-${index}`}>
          <a
            href={`#${item.anchorId}`}
            className={`text-sm transition hover:underline ${theme.muted}`}
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
            className={`text-sm transition hover:underline ${theme.muted}`}
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
            className={`text-sm transition hover:underline ${theme.muted}`}
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
    <section className="px-4 py-8 md:px-8 md:py-12">
      <div className="mb-3 flex gap-3 items-center">
        {logoAsset ? (
          <Image
            src={logoAsset.publicUrl}
            alt={logoAsset.id}
            width={140}
            height={56}
            unoptimized
            className="h-10 w-auto object-contain"
          />
        ) : null}
        {props.siteName.trim().length > 0 ? (
          <p className="text-base font-semibold text-text-main">{props.siteName}</p>
        ) : null}

      </div>

      <div className="grid gap-8 border-t border-line pt-8 md:grid-cols-4">
        {hasLeftContent ? (
          <div className="flex flex-col gap-4 md:col-span-1">

            {props.leftTitle.trim().length > 0 ? (
              <h3 className="text-sm font-semibold uppercase tracking-wide text-text-main">
                {props.leftTitle}
              </h3>
            ) : null}

            

            {props.siteDescription.trim().length > 0 ? (
              <p className={`text-sm ${theme.muted}`}>{props.siteDescription}</p>
            ) : null}

            {props.socialLinksTitle.trim().length > 0 ? (
              <p className="pt-2 text-sm font-medium text-text-main">{props.socialLinksTitle}</p>
            ) : null}

            {props.socialLinks.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3">
                {props.socialLinks.map((item, index) => (
                  <a
                    key={`${item.url}-${item.label}-footer-${index}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`inline-flex items-center gap-2 text-sm transition hover:underline ${theme.muted}`}
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
                className={`mt-auto inline-flex w-fit items-center text-sm font-medium transition hover:underline ${theme.muted}`}
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
            <div className={`grid gap-8 ${getRightGridColsClass(rightColumns.length)}`}>
              {rightColumns.map((column, columnIndex) => (
                <div key={`footer-column-${columnIndex}`} className="grid gap-3">
                  {column.title.trim().length > 0 ? (
                    <h3 className="text-base font-semibold text-text-main">
                      {column.title}
                    </h3>
                  ) : null}

                  {column.links.length > 0 ? (
                    <ul className="grid gap-2">
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

      <div className="mt-8 border-t border-line pt-4">
        <p className={`text-xs ${theme.muted}`}>
          &copy; {currentYear}
          {props.siteName.trim().length > 0 ? ` ${props.siteName}` : ""}
        </p>
      </div>
    </section>
  );
}
