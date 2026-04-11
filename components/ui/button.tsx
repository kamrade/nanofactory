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
    base: "border border-transparent bg-transparent text-text-main hover:bg-neutral-200 active:bg-neutral-300",
    primary:
      "border border-transparent bg-transparent text-text-main hover:bg-primary-200 hover:text-text-inverted-main active:bg-primary-300",
  },
  contained: {
    base: "border border-transparent bg-neutral-100 text-text-main hover:bg-neutral-200 active:bg-neutral-300",
    primary:
      "border border-primary-line bg-primary-100 text-text-inverted-main hover:bg-primary-200 active:bg-primary-300",
  },
  outlined: {
    base: "border border-neutral-line bg-transparent text-text-main hover:bg-neutral-200 active:bg-neutral-300",
    primary:
      "border border-primary-line bg-transparent text-text-main hover:bg-primary-200 hover:text-text-inverted-main active:bg-primary-300",
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
        "focus:ring-2 focus:ring-focus/50 focus:ring-offset-2 focus:ring-offset-bg",
        "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantThemeClasses[variant][theme],
        className
      )}
      {...props}
    />
  );
}
