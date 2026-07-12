import type { CSSProperties, HTMLAttributes } from "react";

import { cx } from "@/lib/cn";

import styles from "./badge.module.css";

type BadgeTheme = "base" | "primary" | "danger";
type BadgeVariant = "contained" | "outlined";
type BadgeSize = "sm" | "md" | "lg";
type BadgeBorderRadius = "none" | "md" | "lg";

export type UIBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  theme?: BadgeTheme;
  variant?: BadgeVariant;
  size?: BadgeSize;
  borderRadius?: BadgeBorderRadius;
};

const sizeStyles: Record<BadgeSize, CSSProperties> = {
  sm: {
    height: "1.5rem",
    minWidth: "1.5rem",
    paddingInline: "0.75rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  md: {
    height: "1.75rem",
    minWidth: "1.75rem",
    paddingInline: "0.875rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  lg: {
    height: "2rem",
    minWidth: "2rem",
    paddingInline: "1rem",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const themeClasses: Record<BadgeTheme, string> = {
  base: styles.themeBase,
  primary: styles.themePrimary,
  danger: styles.themeDanger,
};

const variantClasses: Record<BadgeVariant, string> = {
  contained: styles.variantContained,
  outlined: styles.variantOutlined,
};

const borderRadiusStyles: Record<BadgeBorderRadius, CSSProperties> = {
  none: { borderRadius: "0px" },
  md: { borderRadius: "8px" },
  lg: { borderRadius: "20px" },
};

export function UIBadge({
  theme = "base",
  variant = "contained",
  size = "sm",
  borderRadius = "lg",
  className,
  style,
  ...props
}: UIBadgeProps) {
  return (
    <span
      data-size={size}
      data-theme={theme}
      data-variant={variant}
      data-border-radius={borderRadius}
      className={cx(styles.badge, themeClasses[theme], variantClasses[variant], className)}
      style={{ ...sizeStyles[size], ...borderRadiusStyles[borderRadius], ...style }}
      {...props}
    />
  );
}
