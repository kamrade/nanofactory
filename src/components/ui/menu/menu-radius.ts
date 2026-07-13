import type { CSSProperties } from "react";

export type UIMenuBorderRadius = "none" | "md" | "lg";

export type UIMenuRadiusStyle = CSSProperties & {
  "--menu-radius": string;
  "--menu-item-radius": string;
};

const menuRadiusValueMap: Record<UIMenuBorderRadius, string> = {
  none: "0px",
  md: "0.5rem",
  lg: "0.75rem",
};

const menuItemRadiusValueMap: Record<UIMenuBorderRadius, string> = {
  none: "0px",
  md: "0.375rem",
  lg: "0.5rem",
};

export function resolveMenuBorderRadiusValue(borderRadius: UIMenuBorderRadius): string {
  return menuRadiusValueMap[borderRadius];
}

export function resolveMenuBorderItemRadiusValue(borderRadius: UIMenuBorderRadius): string {
  return menuItemRadiusValueMap[borderRadius];
}

export const menuRadiusStyles: Record<UIMenuBorderRadius, UIMenuRadiusStyle> = {
  none: { "--menu-radius": menuRadiusValueMap.none, "--menu-item-radius": menuItemRadiusValueMap.none },
  md: { "--menu-radius": menuRadiusValueMap.md, "--menu-item-radius": menuItemRadiusValueMap.md },
  lg: { "--menu-radius": menuRadiusValueMap.lg, "--menu-item-radius": menuItemRadiusValueMap.lg },
};