"use client";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";

import type { ToastInput, UiSize } from "../uikit-sections";

export function ToastCard({
  uiSize,
  showToast,
  clearToasts,
}: {
  uiSize: UiSize;
  showToast: (toast: ToastInput) => void;
  clearToasts: () => void;
}) {
  return (
    <UICard title="Toast">
      <div className="flex flex-wrap items-center gap-3">
        <UIButton
          theme="primary"
          variant="contained"
          size={uiSize}
          onClick={() =>
            showToast({
              tone: "default",
              title: "Saved",
              description: "Project settings were saved successfully.",
            })
          }
        >
          Saved toast
        </UIButton>
        <UIButton
          theme="danger"
          variant="outlined"
          size={uiSize}
          onClick={() =>
            showToast({
              tone: "error",
              title: "Upload failed",
              description: "Please try again in a few seconds.",
            })
          }
        >
          Error toast
        </UIButton>
        <UIButton
          theme="base"
          variant="outlined"
          size={uiSize}
          onClick={() =>
            showToast({
              tone: "default",
              title: "New version available",
              description: "Refresh when ready.",
            })
          }
        >
          Info toast
        </UIButton>
        <UIButton theme="base" variant="text" size={uiSize} onClick={clearToasts}>
          Clear all
        </UIButton>
      </div>
    </UICard>
  );
}
