"use client";

import type { Dispatch, SetStateAction } from "react";

import { Card } from "@/components/ui/card";
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
  spacingScale: ProjectSpacingScale;
  surfaceStyle: ProjectSurfaceStyle;
  headingFont: ProjectHeadingFont;
};

type FeatureBlocksOptionsPanelProps = {
  value: FeatureBlocksOptionState;
  onChange: Dispatch<SetStateAction<FeatureBlocksOptionState>>;
};

export function FeatureBlocksOptionsPanel({ value, onChange }: FeatureBlocksOptionsPanelProps) {
  return (
    <Card className="p-4 shadow-sm">
      <div className="grid gap-4">
        <div className="grid gap-1">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
            Border radius
          </span>
          <UISelect
            ariaLabel="Border radius"
            size="sm"
            className="w-full"
            value={value.borderRadiusPolicy}
            onValueChange={(nextValue) =>
              onChange((current) => ({
                ...current,
                borderRadiusPolicy: nextValue as ProjectBorderRadiusPolicy,
              }))
            }
            options={PROJECT_BORDER_RADIUS_POLICIES.map((policy) => ({
              value: policy,
              label: policy,
              textValue: policy,
            }))}
          />
        </div>

        <div className="grid gap-1">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
            Spacing scale
          </span>
          <UISelect
            ariaLabel="Spacing scale"
            size="sm"
            className="w-full"
            value={value.spacingScale}
            onValueChange={(nextValue) =>
              onChange((current) => ({
                ...current,
                spacingScale: nextValue as ProjectSpacingScale,
              }))
            }
            options={PROJECT_SPACING_SCALES.map((scale) => ({
              value: scale,
              label: scale,
              textValue: scale,
            }))}
          />
        </div>

        <div className="grid gap-1">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
            Surface style
          </span>
          <UISelect
            ariaLabel="Surface style"
            size="sm"
            className="w-full"
            value={value.surfaceStyle}
            onValueChange={(nextValue) =>
              onChange((current) => ({
                ...current,
                surfaceStyle: nextValue as ProjectSurfaceStyle,
              }))
            }
            options={PROJECT_SURFACE_STYLES.map((style) => ({
              value: style,
              label: style,
              textValue: style,
            }))}
          />
        </div>

        <div className="grid gap-1">
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
            Heading font
          </span>
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
        </div>
      </div>
    </Card>
  );
}
