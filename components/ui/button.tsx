import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";

type ButtonTheme = "base" | "primary" | "danger";
type ButtonVariant = "text" | "contained" | "outlined";
type ButtonSize = "sm" | "lg";

export type UIButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ButtonTheme;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconButton?: boolean;
  block?: boolean;
  asChild?: boolean;
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-7 rounded-lg px-3 text-sm",
  lg: "h-10 rounded-[12px] px-4 text-sm leading-5",
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: "h-7 w-7 rounded-lg px-0",
  lg: "h-10 w-10 rounded-[12px] px-0",
};

const variantThemeClasses: Record<ButtonVariant, Record<ButtonTheme, string>> = {
  text: {
    base: "border border-transparent bg-transparent text-text-main hover:bg-neutral-200 active:bg-neutral-300",
    primary:
      "border border-transparent bg-transparent text-text-main hover:bg-primary-200 hover:text-text-inverted-main active:bg-primary-300",
    danger:
      "border border-transparent bg-transparent text-text-danger hover:text-text-inverted-danger active:text-text-inverted-danger hover:bg-danger-100 active:bg-danger-200",
  },
  contained: {
    base: "border border-transparent bg-neutral-100 text-text-main hover:bg-neutral-200 active:bg-neutral-300",
    primary:
      "border border-primary-line bg-primary-100 text-text-inverted-main hover:bg-primary-200 active:bg-primary-300",
    danger:
      "border border-transparent bg-danger-100 text-text-danger hover:bg-danger-200 active:bg-danger-300",
  },
  outlined: {
    base: "border border-neutral-line bg-transparent text-text-main hover:bg-neutral-200 active:bg-neutral-300",
    primary:
      "border border-primary-line bg-transparent text-text-main hover:bg-primary-200 hover:text-text-inverted-main active:bg-primary-300",
    danger:
      "border border-danger-line bg-transparent text-text-danger hover:bg-danger-100 active:bg-danger-200",
  },
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const UIButton = forwardRef<HTMLButtonElement, UIButtonProps>(function UIButton(
  {
    theme = "base",
    variant = "contained",
    size = "lg",
    iconButton = false,
    block = false,
    asChild = false,
    className,
    type,
    children,
    ...props
  },
  ref
) {
  const buttonClassName = cx(
    "inline-flex items-center justify-center gap-[0.375em] whitespace-nowrap font-medium transition outline-none",
    "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
    "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus-visible:ring-offset-bg",
    "disabled:pointer-events-none disabled:opacity-50",
    block && "w-full",
    iconButton ? iconSizeClasses[size] : sizeClasses[size],
    variantThemeClasses[variant][theme],
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cx(buttonClassName, child.props.className),
    });
  }

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  );
});
