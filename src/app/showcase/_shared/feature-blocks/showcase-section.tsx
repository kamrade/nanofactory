"use client";

import type { ReactNode } from "react";

import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import { ProjectRenderer } from "@/components/projects/project-renderer";
import { ShowcaseSidebar } from "@/app/showcase/_shared/showcase-sidebar";

import { featureBlocksDemoAssets } from "./demo-assets";
import { featureBlocksSectionNavItems } from "./nav";
import type { FeatureBlocksOptionState } from "./options-panel";

type FeatureBlocksShowcaseSectionProps = {
  content: PageContent;
  assets?: ProjectAssetRecord[];
  themeKey: string;
  mode: "light" | "dark";
  options: FeatureBlocksOptionState;
  topContent?: ReactNode;
};

export function FeatureBlocksShowcaseSection({
  content,
  assets = featureBlocksDemoAssets,
  themeKey,
  mode,
  options,
  topContent,
}: FeatureBlocksShowcaseSectionProps) {
  return (
    <section className="bg-bg py-8 text-text-main">
      <div className="mx-auto container px-4">
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <ShowcaseSidebar
            sections={featureBlocksSectionNavItems}
            title="Feature blocks"
            ariaLabel="Feature blocks sections"
            topContent={topContent}
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
