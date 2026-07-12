"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import { UISegmentedControl } from "@/components/ui/segmented-control";
import type { UiSize } from "@/app/showcase/_shared/uikit-sections";

type ComponentsSidebarControlsProps = {
  uiSize: UiSize;
  borderRadius: "none" | "md" | "lg";
  onUiSizeChange: Dispatch<SetStateAction<UiSize>>;
  onBorderRadiusChange: Dispatch<SetStateAction<"none" | "md" | "lg">>;
};

function SidebarField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">{label}</span>
      {children}
    </div>
  );
}

export function ComponentsSidebarControls({
  uiSize,
  borderRadius,
  onUiSizeChange,
  onBorderRadiusChange,
}: ComponentsSidebarControlsProps) {
  return (
    <div className="grid gap-4">
      <SidebarField label="Size">
        <UISegmentedControl
          ariaLabel="Showcase size"
          value={uiSize}
          onValueChange={(nextValue) => onUiSizeChange(nextValue as UiSize)}
          options={[
            { value: "sm", label: "sm" },
            { value: "md", label: "md" },
            { value: "lg", label: "lg" },
          ]}
        />
      </SidebarField>

      <SidebarField label="Border radius">
        <UISegmentedControl
          ariaLabel="Border radius"
          value={borderRadius}
          onValueChange={(nextValue) => onBorderRadiusChange(nextValue as "none" | "md" | "lg")}
          options={[
            { value: "none", label: "none" },
            { value: "md", label: "md" },
            { value: "lg", label: "lg" },
          ]}
        />
      </SidebarField>
    </div>
  );
}
