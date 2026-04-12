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

export type UIModalProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (nextOpen: boolean) => void;
  trigger: ReactElement;
  title: ReactNode;
  description?: ReactNode;
  size?: UIModalSize;
  children: ReactNode;
  footer?: ReactNode;
};

const sizeClasses: Record<UIModalSize, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function UIModal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title,
  description,
  size = "md",
  children,
  footer,
}: UIModalProps) {
  return (
    <UIDialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <UIDialogTrigger>{trigger}</UIDialogTrigger>
      <UIDialogContent className={sizeClasses[size]}>
        <UIDialogHeader>
          <UIDialogTitle>{title}</UIDialogTitle>
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
        </UIDialogHeader>
        <div className="mt-4 max-h-[calc(100vh-16rem)] overflow-y-auto overflow-x-visible px-1">
          {children}
        </div>
        {footer ? <UIDialogFooter>{footer}</UIDialogFooter> : null}
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
      <UIDialogContent className={sizeClasses[size]}>
        <form
          action={action}
          onSubmit={(event) => {
            if (!action) {
              event.preventDefault();
            }
            onSubmit?.(event);
          }}
        >
          <UIDialogHeader>
            <UIDialogTitle>{title}</UIDialogTitle>
            {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
          </UIDialogHeader>
          <div className="mt-4 max-h-[calc(100vh-16rem)] overflow-y-auto overflow-x-visible px-1">
            {children}
          </div>
          <UIDialogFooter>
            <UIDialogClose>
              <UIButton theme="base" variant="outlined" size="sm">
                {cancelLabel}
              </UIButton>
            </UIDialogClose>
            <UIButton type="submit" theme={submitTheme} variant="contained" size="sm" disabled={submitting}>
              {submitting ? "Saving..." : submitLabel}
            </UIButton>
          </UIDialogFooter>
        </form>
      </UIDialogContent>
    </UIDialog>
  );
}
