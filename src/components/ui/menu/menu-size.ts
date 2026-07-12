import styles from "./menu.module.css";

export type UIMenuSize = "sm" | "md" | "lg";

export const UIMenuItemSizeClassName: Record<
  UIMenuSize,
  { item: string; icon: string; label: string }
> = {
  sm: {
    item: styles.itemSm,
    icon: styles.iconSm,
    label: styles.labelSm,
  },
  md: {
    item: styles.itemMd,
    icon: styles.iconMd,
    label: styles.labelMd,
  },
  lg: {
    item: styles.itemLg,
    icon: styles.iconLg,
    label: styles.labelLg,
  },
};

