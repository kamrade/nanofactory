"use client";

import type { FormEvent, ReactElement, ReactNode } from "react";

import { UIButton } from "@/components/ui/button";
import {
  UIDialog,
  UIDialogClose,
  UIDialogContent,
  UIDialogDescription,
  UIDialogFooter,
  UIDialogHeader,
  UIDialogTitle,
  UIDialogTrigger,
} from "@/components/ui/dialog";

type UIModalSize = "sm" | "md" | "lg" | "xl";
type UIModalBorderRadius = "none" | "md" | "lg";

export type UIModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (nextOpen: boolean) => void;
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  size?: UIModalSize;
  borderRadius?: UIModalBorderRadius;
  fullWidth?: boolean;
  children: ReactNode;
  footer?: ReactNode;
};

const sizeClasses: Record<UIModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const borderRadiusClasses: Record<UIModalBorderRadius, string> = {
  none: "rounded-none",
  md: "rounded-lg",
  lg: "rounded-xl",
};

const modalLayoutClasses: Record<UIModalSize, { header: string; title: string; body: string; footer: string }> = {
  sm: {
    header: "gap-1",
    title: "text-base",
    body: "mt-3 max-h-[calc(100vh-16rem)]",
    footer: "mt-4",
  },
  md: {
    header: "gap-1.5",
    title: "text-lg",
    body: "mt-4 max-h-[calc(100vh-16rem)]",
    footer: "mt-5",
  },
  lg: {
    header: "gap-2",
    title: "text-2xl",
    body: "mt-5 max-h-[calc(100vh-16rem)]",
    footer: "mt-6",
  },
  xl: {
    header: "gap-2",
    title: "text-3xl",
    body: "mt-6 max-h-[calc(100vh-16rem)]",
    footer: "mt-6",
  },
};

const modalPaddingClasses: Record<UIModalSize, string> = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
  xl: "p-7",
};

function resolveModalSize(size: UIModalSize) {
  return size === "xl" ? "lg" : size;
}

export function UIModal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  size = "md",
  borderRadius = "lg",
  fullWidth = false,
  children,
  footer,
}: UIModalProps) {
  return (
    <UIDialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <UIDialogTrigger>{trigger}</UIDialogTrigger>
      <UIDialogContent
        paddingClassName={modalPaddingClasses[size]}
        className={
          `${fullWidth ? "max-w-none w-[calc(100vw-2rem)]" : sizeClasses[size]} ${borderRadiusClasses[borderRadius]}`
        }
      >
        <UIDialogHeader className={modalLayoutClasses[size].header}>
          <UIDialogTitle className={modalLayoutClasses[size].title}>{title}</UIDialogTitle>
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
        </UIDialogHeader>
        <div className={modalLayoutClasses[size].body}>
          {children}
        </div>
        {footer ? <UIDialogFooter className={modalLayoutClasses[size].footer}>{footer}</UIDialogFooter> : null}
      </UIDialogContent>
    </UIDialog>
  );
}

export type UIModalFormProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (nextOpen: boolean) => void;
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  size?: UIModalSize;
  borderRadius?: UIModalBorderRadius;
  fullWidth?: boolean;
  children: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  submitTheme?: "base" | "primary" | "danger";
  submitting?: boolean;
  action?: (formData: FormData) => void | Promise<void>;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
};

export function UIModalForm({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  size = "md",
  borderRadius = "lg",
  fullWidth = false,
  children,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  submitTheme = "primary",
  submitting = false,
  action,
  onSubmit,
}: UIModalFormProps) {
  return (
    <UIDialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <UIDialogTrigger>{trigger}</UIDialogTrigger>
      <UIDialogContent
        paddingClassName={modalPaddingClasses[size]}
        className={
          `${fullWidth ? "max-w-none w-[calc(100vw-2rem)]" : sizeClasses[size]} ${borderRadiusClasses[borderRadius]}`
        }
      >
        <form
          action={action}
          onSubmit={(event) => {
            if (!action) {
              event.preventDefault();
            }
            onSubmit?.(event);
          }}
        >
          <UIDialogHeader className={modalLayoutClasses[size].header}>
            <UIDialogTitle className={modalLayoutClasses[size].title}>{title}</UIDialogTitle>
            {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          </UIDialogHeader>
          <div className={modalLayoutClasses[size].body}>
            {children}
          </div>
          <UIDialogFooter className={modalLayoutClasses[size].footer}>
            <UIDialogClose>
              <UIButton
                theme="base"
                variant="outlined"
                size={resolveModalSize(size)}
                borderRadius={borderRadius}
              >
                {cancelLabel}
              </UIButton>
            </UIDialogClose>
            <UIButton
              type="submit"
              theme={submitTheme}
              variant="contained"
              size={resolveModalSize(size)}
              borderRadius={borderRadius}
              disabled={submitting}
            >
              {submitting ? "Saving..." : submitLabel}
            </UIButton>
          </UIDialogFooter>
        </form>
      </UIDialogContent>
    </UIDialog>
  );
}
