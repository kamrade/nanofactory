import type { HTMLAttributes } from "react";

type BadgeTheme = "base" | "primary" | "danger";
type BadgeVariant = "contained" | "outlined";
type BadgeSize = "sm" | "lg";

export type UIBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  theme?: BadgeTheme;
  variant?: BadgeVariant;
  size?: BadgeSize;
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "h-6 rounded-full px-3 text-sm",
  lg: "h-8 rounded-full px-4 text-sm leading-5",
};

const variantThemeClasses: Record<BadgeVariant, Record<BadgeTheme, string>> = {
  contained: {
    base: "border border-transparent bg-neutral-100 text-text-main",
    primary: "border border-primary-line bg-primary-100 text-text-inverted-main",
    danger: "border border-transparent bg-danger-100 text-text-danger",
  },
  outlined: {
    base: "border border-neutral-line bg-transparent text-text-main",
    primary: "border border-primary-line bg-transparent text-text-main",
    danger: "border border-danger-line bg-transparent text-text-danger",
  },
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UIBadge({
  theme = "base",
  variant = "contained",
  size = "sm",
  className,
  ...props
}: UIBadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center gap-[0.375em] font-medium",
        sizeClasses[size],
        variantThemeClasses[variant][theme],
        className
      )}
      {...props}
    />
  );
}
