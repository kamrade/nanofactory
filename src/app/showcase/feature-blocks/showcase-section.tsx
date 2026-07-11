"use client";

import type { Dispatch, SetStateAction } from "react";

import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import { ProjectRenderer } from "@/components/projects/project-renderer";
import { UikitSidebar } from "@/app/showcase/uikit-sidebar";

import { featureBlocksDemoAssets } from "./demo-assets";
import { featureBlocksSectionNavItems } from "./nav";
import { FeatureBlocksOptionsPanel, type FeatureBlocksOptionState } from "./options-panel";

type FeatureBlocksShowcaseSectionProps = {
  content: PageContent;
  assets?: ProjectAssetRecord[];
  themeKey: string;
  mode: "light" | "dark";
  options: FeatureBlocksOptionState;
  onOptionsChange: Dispatch<SetStateAction<FeatureBlocksOptionState>>;
};

export function FeatureBlocksShowcaseSection({
  content,
  assets = featureBlocksDemoAssets,
  themeKey,
  mode,
  options,
  onOptionsChange,
}: FeatureBlocksShowcaseSectionProps) {
  return (
    <section className="bg-bg py-8 text-text-main">
      <div className="mx-auto container px-4">
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <UikitSidebar
            sections={featureBlocksSectionNavItems}
            title="Feature blocks"
            ariaLabel="Feature blocks sections"
            topContent={
              <FeatureBlocksOptionsPanel value={options} onChange={onOptionsChange} />
            }
          />
          <ProjectRenderer
            name="Component Showcase"
            themeKey={themeKey}
            mode={mode}
            content={content}
            assets={assets}
            borderRadiusPolicy={options.borderRadiusPolicy}
            spacingScale={options.spacingScale}
            surfaceStyle={options.surfaceStyle}
            headingFont={options.headingFont}
          />
        </div>
      </div>
    </section>
  );
}
