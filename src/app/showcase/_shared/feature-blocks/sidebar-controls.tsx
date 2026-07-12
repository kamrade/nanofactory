"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";

import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISelect } from "@/components/ui/select";
import {
  PROJECT_BORDER_RADIUS_POLICIES,
  type ProjectBorderRadiusPolicy,
} from "@/lib/projects/border-radius-policy";
import {
  PROJECT_HEADING_FONTS,
  PROJECT_HEADING_FONT_LABELS,
  type ProjectHeadingFont,
} from "@/lib/projects/heading-font";
import { PROJECT_SPACING_SCALES, type ProjectSpacingScale } from "@/lib/projects/spacing-scale";
import { PROJECT_SURFACE_STYLES, type ProjectSurfaceStyle } from "@/lib/projects/surface-style";

export type FeatureBlocksOptionState = {
  borderRadiusPolicy: ProjectBorderRadiusPolicy;
  size: ProjectSpacingScale;
  surfaceStyle: ProjectSurfaceStyle;
  headingFont: ProjectHeadingFont;
};

type FeatureBlocksSidebarControlsProps = {
  value: FeatureBlocksOptionState;
  onChange: Dispatch<SetStateAction<FeatureBlocksOptionState>>;
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

function toLabel(value: string) {
  return value.toLowerCase();
}

export function FeatureBlocksSidebarControls({ value, onChange }: FeatureBlocksSidebarControlsProps) {
  return (
    <div className="grid gap-4">
      <SidebarField label="Size">
        <UISegmentedControl
          ariaLabel="Size"
          value={value.size}
          onValueChange={(nextValue) =>
            onChange((current) => ({
              ...current,
              size: nextValue as ProjectSpacingScale,
            }))
          }
          options={PROJECT_SPACING_SCALES.map((scale) => ({
            value: scale,
            label: toLabel(scale),
          }))}
        />
      </SidebarField>

      <SidebarField label="Border radius">
        <UISegmentedControl
          ariaLabel="Border radius"
          value={value.borderRadiusPolicy}
          onValueChange={(nextValue) =>
            onChange((current) => ({
              ...current,
              borderRadiusPolicy: nextValue as ProjectBorderRadiusPolicy,
            }))
          }
          options={PROJECT_BORDER_RADIUS_POLICIES.map((policy) => ({
            value: policy,
            label: toLabel(policy),
          }))}
        />
      </SidebarField>

      <SidebarField label="Surface style">
        <UISegmentedControl
          ariaLabel="Surface style"
          value={value.surfaceStyle}
          onValueChange={(nextValue) =>
            onChange((current) => ({
              ...current,
              surfaceStyle: nextValue as ProjectSurfaceStyle,
            }))
          }
          options={PROJECT_SURFACE_STYLES.map((style) => ({
            value: style,
            label: toLabel(style),
          }))}
        />
      </SidebarField>

      <SidebarField label="Heading font">
        <UISelect
          ariaLabel="Heading font"
          size="sm"
          className="w-full"
          value={value.headingFont}
          onValueChange={(nextValue) =>
            onChange((current) => ({
              ...current,
              headingFont: nextValue as ProjectHeadingFont,
            }))
          }
          options={PROJECT_HEADING_FONTS.map((font) => ({
            value: font,
            label: PROJECT_HEADING_FONT_LABELS[font],
            textValue: PROJECT_HEADING_FONT_LABELS[font],
          }))}
        />
      </SidebarField>
    </div>
  );
}
