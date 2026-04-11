import type { ButtonHTMLAttributes } from "react";

type ButtonTheme = "base" | "primary";
type ButtonVariant = "text" | "contained" | "outlined";
type ButtonSize = "sm" | "lg";

export type UIButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ButtonTheme;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-7 rounded-lg px-3 text-sm",
  lg: "h-10 rounded-lg px-4 text-base",
};

const variantThemeClasses: Record<ButtonVariant, Record<ButtonTheme, string>> = {
  text: {
    base: "border border-transparent bg-transparent text-text-main hover:bg-surface-alt",
    primary:
      "border border-transparent bg-transparent text-primary-300 hover:bg-surface-alt",
  },
  contained: {
    base: "border border-line bg-surface text-text-main hover:bg-surface-alt",
    primary:
      "border border-primary-line bg-primary-300 text-text-inverted-main hover:bg-primary-200",
  },
  outlined: {
    base: "border border-line bg-transparent text-text-main hover:bg-surface-alt",
    primary:
      "border border-primary-line bg-transparent text-primary-300 hover:bg-surface-alt",
  },
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UIButton({
  theme = "base",
  variant = "contained",
  size = "lg",
  className,
  type,
  ...props
}: UIButtonProps) {
  return (
    <button
      type={type ?? "button"}
      className={cx(
        "inline-flex items-center justify-center font-medium transition outline-none",
        "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantThemeClasses[variant][theme],
        className
      )}
      {...props}
    />
  );
}
