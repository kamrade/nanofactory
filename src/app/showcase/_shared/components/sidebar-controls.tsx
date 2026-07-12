"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import { UISegmentedControl } from "@/components/ui/segmented-control";
import type { UiSize } from "@/app/showcase/_shared/uikit-sections";
import {
  PROJECT_BORDER_RADIUS_POLICIES,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";

type ComponentsSidebarControlsProps = {
  uiSize: UiSize;
  borderRadiusPolicy: ProjectBorderRadiusPolicy;
  onUiSizeChange: Dispatch<SetStateAction<UiSize>>;
  onBorderRadiusPolicyChange: Dispatch<SetStateAction<ProjectBorderRadiusPolicy>>;
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

function toTitle(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ComponentsSidebarControls({
  uiSize,
  borderRadiusPolicy,
  onUiSizeChange,
  onBorderRadiusPolicyChange,
}: ComponentsSidebarControlsProps) {
  return (
    <div className="grid gap-4">
      <SidebarField label="Size">
        <UISegmentedControl
          ariaLabel="Showcase size"
          value={uiSize}
          onValueChange={(nextValue) => onUiSizeChange(nextValue as UiSize)}
          options={[
            { value: "sm", label: "Small" },
            { value: "lg", label: "Large" },
          ]}
        />
      </SidebarField>

      <SidebarField label="Border radius">
        <UISegmentedControl
          ariaLabel="Showcase border radius"
          value={borderRadiusPolicy}
          onValueChange={(nextValue) => onBorderRadiusPolicyChange(nextValue as ProjectBorderRadiusPolicy)}
          options={PROJECT_BORDER_RADIUS_POLICIES.map((policy) => ({
            value: policy,
            label: toTitle(policy),
          }))}
        />
      </SidebarField>
    </div>
  );
}
