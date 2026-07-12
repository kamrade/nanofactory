"use client";

import type { ReactNode } from "react";

import { ShowcaseSidebar } from "@/app/showcase/_shared/showcase-sidebar";
import { BorderlessFormLayoutSection } from "@/app/showcase/_shared/uikit-sections/borderless-form-layout-section";
import { FormLayoutSection } from "@/app/showcase/_shared/uikit-sections/form-layout-section";
import type { UiSize } from "@/app/showcase/_shared/uikit-sections";

import { layoutsSectionNavItems } from "./nav";
import type { LayoutsSectionPageKey } from "./section-pages";

type LayoutsShowcaseSectionProps = {
  activeSection: LayoutsSectionPageKey;
  uiSize: UiSize;
  linkSearchParams?: URLSearchParams;
  topContent?: ReactNode;
};

export function LayoutsShowcaseSection({
  activeSection,
  uiSize,
  linkSearchParams,
  topContent,
}: LayoutsShowcaseSectionProps) {
  const content = (() => {
    switch (activeSection) {
      case "form-layout":
        return <FormLayoutSection uiSize={uiSize} />;
      case "form-layout-borderless-inputs":
        return <BorderlessFormLayoutSection uiSize={uiSize} />;
      default:
        return null;
    }
  })();

  return (
    <section className="bg-bg py-8 text-text-main">
      <div className="mx-auto container px-4">
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <ShowcaseSidebar
            sections={layoutsSectionNavItems}
            title="Layouts"
            ariaLabel="Layouts sections"
            activeSectionId={activeSection}
            linkSearchParams={linkSearchParams}
            topContent={topContent}
          />
          {content}
        </div>
      </div>
    </section>
  );
}
