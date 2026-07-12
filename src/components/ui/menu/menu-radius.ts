import type { CSSProperties } from "react";

export type UIMenuBorderRadius = "none" | "md" | "lg";

export type UIMenuRadiusStyle = CSSProperties & {
  "--menu-radius": string;
  "--menu-item-radius": string;
};

export function resolveMenuBorderRadiusValue(borderRadius: UIMenuBorderRadius): string {
  switch (borderRadius) {
    case "none":
      return "0px";
    case "md":
      return "0.5rem";
    case "lg":
      return "0.75rem";
  }
}

export const menuRadiusStyles: Record<UIMenuBorderRadius, UIMenuRadiusStyle> = {
  none: { "--menu-radius": "0px", "--menu-item-radius": "0px" },
  md: { "--menu-radius": "0.5rem", "--menu-item-radius": "0.5rem" },
  lg: { "--menu-radius": "0.75rem", "--menu-item-radius": "0.75rem" },
};
