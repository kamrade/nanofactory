"use client";

import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { UISelect } from "@/components/ui/select";
import type { UiSize } from "@/app/showcase/uikit-sections";
import {
  PROJECT_BORDER_RADIUS_POLICIES,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";

type ShowcaseTabSettingsProps = {
  uiSize: UiSize;
  borderRadiusPolicy: ProjectBorderRadiusPolicy;
  onUiSizeChange: (value: UiSize) => void;
  onBorderRadiusPolicyChange: (value: ProjectBorderRadiusPolicy) => void;
};

function SettingField({
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

export function ShowcaseTabSettings({
  uiSize,
  borderRadiusPolicy,
  onUiSizeChange,
  onBorderRadiusPolicyChange,
}: ShowcaseTabSettingsProps) {
  return (
    
      <div className="grid gap-4 lg:grid-cols-2">
        <SettingField label="Size">
          <UISelect
            ariaLabel="Showcase size"
            size="sm"
            className="w-full"
            value={uiSize}
            onValueChange={(nextValue) => onUiSizeChange(nextValue as UiSize)}
            options={[
              { value: "sm", label: "Small", textValue: "Small" },
              { value: "lg", label: "Large", textValue: "Large" },
            ]}
          />
        </SettingField>

        <SettingField label="Border radius">
          <UISelect
            ariaLabel="Showcase border radius"
            size="sm"
            className="w-full"
            value={borderRadiusPolicy}
            onValueChange={(nextValue) => onBorderRadiusPolicyChange(nextValue as ProjectBorderRadiusPolicy)}
            options={PROJECT_BORDER_RADIUS_POLICIES.map((policy) => ({
              value: policy,
              label: policy,
              textValue: policy,
            }))}
          />
        </SettingField>
      </div>
    
  );
}
