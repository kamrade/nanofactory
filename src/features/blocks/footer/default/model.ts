import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import { isSocialIconKey, type SocialIconKey } from "@/features/blocks/app-header/default/social-icons";

export type FooterAnchorLink = {
  label: string;
  anchorId: string;
};

export type FooterExternalLink = {
  label: string;
  url: string;
};

export type FooterSocialLink = {
  label: string;
  url: string;
  icon: SocialIconKey;
};

export type FooterProps = {
  leftTitle: string;
  logoAssetId: string | undefined;
  siteName: string;
  siteDescription: string;
  socialLinksTitle: string;
  socialLinks: FooterSocialLink[];
  scrollTopLabel: string;
  navColumnTitle: string;
  navLinks: FooterAnchorLink[];
  linksColumnOneTitle: string;
  linksColumnOne: FooterExternalLink[];
  linksColumnTwoTitle: string;
  linksColumnTwo: FooterExternalLink[];
};

function readAnchorLinks(input: unknown): FooterAnchorLink[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      const label = readString(item.label, "").trim();
      const anchorId = readString(item.anchorId, "").trim();
      if (!label || !anchorId) {
        return null;
      }

      return { label, anchorId };
    })
    .filter((item): item is FooterAnchorLink => item !== null);
}

function readExternalLinks(input: unknown): FooterExternalLink[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      const label = readString(item.label, "").trim();
      const url = readString(item.url, "").trim();
      if (!label || !url) {
        return null;
      }

      return { label, url };
    })
    .filter((item): item is FooterExternalLink => item !== null);
}

function readSocialLinks(input: unknown): FooterSocialLink[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      const label = readString(item.label, "").trim();
      const url = readString(item.url, "").trim();
      const icon = isSocialIconKey(item.icon) ? item.icon : "link";

      if (!label || !url) {
        return null;
      }

      return { label, url, icon };
    })
    .filter((item): item is FooterSocialLink => item !== null);
}

export function readFooterProps(input: unknown): FooterProps {
  const props = isPlainObject(input) ? input : {};

  return {
    leftTitle: readString(props.leftTitle, ""),
    logoAssetId: readOptionalString(props.logoAssetId),
    siteName: readString(props.siteName, ""),
    siteDescription: readString(props.siteDescription, ""),
    socialLinksTitle: readString(props.socialLinksTitle, ""),
    socialLinks: readSocialLinks(props.socialLinks),
    scrollTopLabel: readString(props.scrollTopLabel, "Scroll to top"),
    navColumnTitle: readString(props.navColumnTitle, ""),
    navLinks: readAnchorLinks(props.navLinks),
    linksColumnOneTitle: readString(props.linksColumnOneTitle, ""),
    linksColumnOne: readExternalLinks(props.linksColumnOne),
    linksColumnTwoTitle: readString(props.linksColumnTwoTitle, ""),
    linksColumnTwo: readExternalLinks(props.linksColumnTwo),
  };
}

