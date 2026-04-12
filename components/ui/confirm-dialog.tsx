"use client";

import type { ReactElement } from "react";

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

type UIConfirmDialogProps = {
  trigger: ReactElement;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmTheme?: "base" | "primary" | "danger";
};

export function UIConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  confirmTheme = "danger",
}: UIConfirmDialogProps) {
  return (
    <UIDialog>
      <UIDialogTrigger>{trigger}</UIDialogTrigger>
      <UIDialogContent>
        <UIDialogHeader>
          <UIDialogTitle>{title}</UIDialogTitle>
          {description ? <UIDialogDescription>{description}</UIDialogDescription> : null}
        </UIDialogHeader>
        <UIDialogFooter>
          <UIDialogClose>
            <UIButton theme="base" variant="outlined" size="sm">
              {cancelLabel}
            </UIButton>
          </UIDialogClose>
          <UIDialogClose>
            <UIButton
              theme={confirmTheme}
              variant="contained"
              size="sm"
              onClick={() => onConfirm?.()}
            >
              {confirmLabel}
            </UIButton>
          </UIDialogClose>
        </UIDialogFooter>
      </UIDialogContent>
    </UIDialog>
  );
}
