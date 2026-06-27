import { isPlainObject, readOptionalString, readString } from "../../shared/base";

export const HERO_STANDARD_CONTENT_POSITIONS = ["top", "bottom", "centered"] as const;

type HeroCopyDefaults = {
  title: string;
  subtitle: string;
  buttonText: string;
};

type NormalizeHeroPropsOptions = HeroCopyDefaults & {
  contentPositions?: readonly string[];
};

function readHeroContentPosition(
  input: unknown,
  contentPositions: readonly string[]
): string {
  return typeof input === "string" && contentPositions.includes(input)
    ? input
    : "centered";
}

export function createHeroDefaultProps(copyDefaults: HeroCopyDefaults): Record<string, unknown> {
  return {
    eyebrow: "",
    title: copyDefaults.title,
    subtitle: copyDefaults.subtitle,
    buttonText: copyDefaults.buttonText,
    buttonAnchor: "",
    contentPosition: "centered",
    imageAssetId: undefined,
    imageLightAssetId: undefined,
    imageDarkAssetId: undefined,
    animate: false,
  };
}

export function normalizeHeroProps(
  input: unknown,
  {
    title,
    subtitle,
    buttonText,
    contentPositions = HERO_STANDARD_CONTENT_POSITIONS,
  }: NormalizeHeroPropsOptions
): Record<string, unknown> {
  const props = isPlainObject(input) ? input : {};

  return {
    eyebrow: readString(props.eyebrow, ""),
    title: readString(props.title, title),
    subtitle: readString(props.subtitle, subtitle),
    buttonText: readString(props.buttonText, buttonText),
    buttonAnchor: readString(props.buttonAnchor, ""),
    contentPosition: readHeroContentPosition(props.contentPosition, contentPositions),
    imageAssetId: readOptionalString(props.imageAssetId),
    imageLightAssetId: readOptionalString(props.imageLightAssetId),
    imageDarkAssetId: readOptionalString(props.imageDarkAssetId),
    // Backward compat: the flag was previously stored as `animateMainText`.
    animate: props.animate === true || props.animateMainText === true,
  };
}
