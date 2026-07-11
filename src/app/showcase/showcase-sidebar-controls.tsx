"use client";

import { UISelect } from "@/components/ui/select";
import type { UiSize } from "@/app/showcase/uikit-sections";
import {
  PROJECT_BORDER_RADIUS_POLICIES,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";

type ShowcaseSidebarControlsProps = {
  uiSize: UiSize;
  onUiSizeChange: (value: UiSize) => void;
  borderRadiusPolicy: ProjectBorderRadiusPolicy;
  onBorderRadiusPolicyChange: (value: ProjectBorderRadiusPolicy) => void;
};

export function ShowcaseSidebarControls({
  uiSize,
  onUiSizeChange,
  borderRadiusPolicy,
  onBorderRadiusPolicyChange,
}: ShowcaseSidebarControlsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
          Size
        </span>
        <UISelect
          ariaLabel="Showcase size"
          size="sm"
          value={uiSize}
          onValueChange={(value) => onUiSizeChange(value as UiSize)}
          options={[
            { value: "sm", label: "Small", textValue: "Small" },
            { value: "lg", label: "Large", textValue: "Large" },
          ]}
        />
      </div>

      <div className="grid gap-1">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
          Border radius
        </span>
        <UISelect
          ariaLabel="Showcase border radius"
          size="sm"
          value={borderRadiusPolicy}
          onValueChange={(value) => onBorderRadiusPolicyChange(value as ProjectBorderRadiusPolicy)}
          options={PROJECT_BORDER_RADIUS_POLICIES.map((policy) => ({
            value: policy,
            label: policy,
            textValue: policy,
          }))}
        />
      </div>
    </div>
  );
}
