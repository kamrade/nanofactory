import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import { isSocialIconKey, type SocialIconKey } from "./social-icons";
import { isValidAnchorId, normalizeAnchorId } from "@/lib/editor/anchor-id";

export type AppHeaderMenuItem = {
  label: string;
  anchorId: string;
};

export type AppHeaderSocialLink = {
  label: string;
  url: string;
  icon: SocialIconKey;
};

export const APP_HEADER_BREAKPOINTS = ["sm", "md", "lg", "xl"] as const;
export type AppHeaderCollapseBreakpoint = (typeof APP_HEADER_BREAKPOINTS)[number];

function isAppHeaderCollapseBreakpoint(value: unknown): value is AppHeaderCollapseBreakpoint {
  return (
    typeof value === "string" &&
    (APP_HEADER_BREAKPOINTS as readonly string[]).includes(value)
  );
}

export type AppHeaderPropsModel = {
  title: string;
  logoAssetId?: string;
  logoLightAssetId?: string;
  logoDarkAssetId?: string;
  collapseBreakpoint: AppHeaderCollapseBreakpoint;
  alwaysMobile: boolean;
  menuItems: AppHeaderMenuItem[];
  socialLinks: AppHeaderSocialLink[];
};

export function readAppHeaderMenuItems(input: unknown): AppHeaderMenuItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      const label = readOptionalString(item.label);
      const rawAnchorId = readOptionalString(item.anchorId);
      const anchorId = rawAnchorId ? normalizeAnchorId(rawAnchorId) : undefined;

      if (!label || !anchorId || !isValidAnchorId(anchorId)) {
        return null;
      }

      return { label, anchorId };
    })
    .filter((item): item is AppHeaderMenuItem => item !== null);
}

export function readAppHeaderSocialLinks(input: unknown): AppHeaderSocialLink[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      const label = readOptionalString(item.label);
      const url = readOptionalString(item.url);
      const iconCandidate = readOptionalString(item.icon);

      if (!label || !url) {
        return null;
      }

      return {
        label,
        url,
        icon: isSocialIconKey(iconCandidate) ? iconCandidate : "link",
      };
    })
    .filter((item): item is AppHeaderSocialLink => item !== null);
}

export function readAppHeaderProps(input: unknown): AppHeaderPropsModel {
  const props = isPlainObject(input) ? input : {};

  return {
    title: readString(props.title, ""),
    logoAssetId: readOptionalString(props.logoAssetId),
    logoLightAssetId: readOptionalString(props.logoLightAssetId),
    logoDarkAssetId: readOptionalString(props.logoDarkAssetId),
    collapseBreakpoint: isAppHeaderCollapseBreakpoint(props.collapseBreakpoint)
      ? props.collapseBreakpoint
      : "md",
    alwaysMobile: props.alwaysMobile === true,
    menuItems: readAppHeaderMenuItems(props.menuItems),
    socialLinks: readAppHeaderSocialLinks(props.socialLinks),
  };
}
