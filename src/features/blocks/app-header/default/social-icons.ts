export const SOCIAL_ICON_OPTIONS = [
  { value: "link", label: "Link" },
  { value: "instagram", label: "Instagram" },
  { value: "x", label: "X (Twitter)" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "telegram", label: "Telegram" },
  { value: "tiktok", label: "TikTok" },
] as const;

export type SocialIconKey = (typeof SOCIAL_ICON_OPTIONS)[number]["value"];

const SOCIAL_ICON_KEY_SET = new Set<string>(SOCIAL_ICON_OPTIONS.map((option) => option.value));

export function isSocialIconKey(value: unknown): value is SocialIconKey {
  return typeof value === "string" && SOCIAL_ICON_KEY_SET.has(value);
}

export function getSocialIconLabel(key: SocialIconKey) {
  const option = SOCIAL_ICON_OPTIONS.find((candidate) => candidate.value === key);
  return option?.label ?? "Link";
}
