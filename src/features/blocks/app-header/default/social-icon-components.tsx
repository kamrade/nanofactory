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

import type { SocialIconKey } from "./social-icons";

export const SOCIAL_ICON_COMPONENTS: Record<SocialIconKey, IconType> = {
  link: FiLink,
  instagram: FaInstagram,
  x: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  facebook: FaFacebook,
  telegram: FaTelegram,
  tiktok: FaTiktok,
};

export function renderSocialIcon(icon: SocialIconKey) {
  const Icon = SOCIAL_ICON_COMPONENTS[icon] ?? FiLink;
  return <Icon aria-hidden className="h-4 w-4" />;
}
