import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
} from "react";

import { cx } from "@/lib/cn";

import styles from "./button.module.css";

type ButtonTheme = "base" | "primary" | "danger";
type ButtonVariant = "text" | "contained" | "outlined";
type ButtonSize = "sm" | "md" | "lg";
type ButtonBorderRadius = "none" | "md" | "lg";

export type UIButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  theme?: ButtonTheme;
  variant?: ButtonVariant;
  size?: ButtonSize;
  borderRadius?: ButtonBorderRadius;
  iconButton?: boolean;
  block?: boolean;
  asChild?: boolean;
};

const themeClassName: Record<ButtonTheme, string> = {
  base: styles.themeBase,
  primary: styles.themePrimary,
  danger: styles.themeDanger,
};

const variantClassName: Record<ButtonVariant, string> = {
  text: styles.variantText,
  contained: styles.variantContained,
  outlined: styles.variantOutlined,
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const iconSizeClassName: Record<ButtonSize, string> = {
  sm: styles.iconSm,
  md: styles.iconMd,
  lg: styles.iconLg,
};

const borderRadiusClassName: Record<ButtonBorderRadius, string> = {
  none: styles.radiusNone,
  md: styles.radiusMd,
  lg: styles.radiusLg,
};

export const UIButton = forwardRef<HTMLButtonElement, UIButtonProps>(function UIButton(
  {
    theme = "base",
    variant = "contained",
    size = "lg",
    borderRadius = "lg",
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
    styles.button,
    themeClassName[theme],
    variantClassName[variant],
    iconButton ? iconSizeClassName[size] : sizeClassName[size],
    borderRadiusClassName[borderRadius],
    block && styles.block,
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
      data-testid="ui-button"
      ref={ref}
      type={type ?? "button"}
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  );
});
