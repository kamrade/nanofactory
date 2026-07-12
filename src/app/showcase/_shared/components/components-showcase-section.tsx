"use client";

import type { ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

import { DialogDemoCard, MarkdownDemoCard, ModalDemoCard } from "@/app/showcase/_shared/demo-cards";
import { SheetCard } from "@/app/showcase/_shared/components/sheet-card";
import { ToastCard } from "@/app/showcase/_shared/components/toast-card";
import { ShowcaseSidebar } from "@/app/showcase/_shared/showcase-sidebar";
import { AutocompleteCard } from "@/app/showcase/_shared/components/autocomplete-card";
import { AccordionCard } from "@/app/showcase/_shared/uikit-sections/accordion-card";
import { DropdownCard } from "@/app/showcase/_shared/components/dropdown-card";
import { TypographyButtonsCard } from "@/app/showcase/_shared/uikit-sections/typography-buttons-card";
import { TypographyBadgesCard } from "@/app/showcase/_shared/uikit-sections/typography-badges-card";
import { ControlsCheckboxCard } from "@/app/showcase/_shared/uikit-sections/controls-checkbox-card";
import { ControlsSegmentedControlCard } from "@/app/showcase/_shared/uikit-sections/controls-segmented-control-card";
import { ControlsSwitcherCard } from "@/app/showcase/_shared/uikit-sections/controls-switcher-card";
import { TypographyHeadingsCard } from "@/app/showcase/_shared/uikit-sections/typography-headings-card";
import type { UiSize } from "@/app/showcase/_shared/uikit-sections";
import { MenuCard } from "@/app/showcase/_shared/components/menu-card";
import { MultiSelectDropdownCard } from "@/app/showcase/_shared/components/multiselect-dropdown-card";
import { MultiSelectListCard } from "@/app/showcase/_shared/components/multiselect-list-card";
import { InputsSelectCard } from "@/app/showcase/_shared/uikit-sections/inputs-select-card";
import { InputsSliderCard } from "@/app/showcase/_shared/uikit-sections/inputs-slider-card";
import { InputsTextInputCard } from "@/app/showcase/_shared/uikit-sections/inputs-text-input-card";

import { componentsSectionNavItems } from "./nav";
import type { ComponentsSectionPageKey } from "./section-pages";

type ComponentsShowcaseSectionProps = {
  activeSection: ComponentsSectionPageKey;
  uiSize: UiSize;
  borderRadius: "none" | "md" | "lg";
  linkSearchParams?: URLSearchParams;
  topContent?: ReactNode;
};

export function ComponentsShowcaseSection({
  activeSection,
  uiSize,
  borderRadius,
  linkSearchParams,
  topContent,
}: ComponentsShowcaseSectionProps) {
  const { showToast, clearToasts } = useToast();

  const content = (() => {
    switch (activeSection) {
      case "typography-headings":
        return <TypographyHeadingsCard />;
      case "typography-buttons":
        return <TypographyButtonsCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "typography-badges":
        return <TypographyBadgesCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "controls-menu":
        return <MenuCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "controls-checkbox":
        return <ControlsCheckboxCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "controls-switcher":
        return <ControlsSwitcherCard uiSize={uiSize} />;
      case "controls-segmented-control":
        return <ControlsSegmentedControlCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "controls-accordion":
        return <AccordionCard uiSize={uiSize} />;
      case "controls-dropdown":
        return <DropdownCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "inputs-text-input":
        return <InputsTextInputCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "inputs-select":
        return <InputsSelectCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "inputs-slider":
        return <InputsSliderCard />;
      case "inputs-multiselect-list":
        return <MultiSelectListCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "inputs-multiselect-dropdown":
        return <MultiSelectDropdownCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "inputs-autocomplete":
        return <AutocompleteCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "feedback-toast":
        return <ToastCard uiSize={uiSize} showToast={showToast} clearToasts={clearToasts} />;
      case "feedback-sheet":
        return <SheetCard uiSize={uiSize} />;
      case "dialog":
        return <DialogDemoCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "modal":
        return <ModalDemoCard uiSize={uiSize} borderRadius={borderRadius} />;
      case "markdown":
        return <MarkdownDemoCard />;
      default:
        return null;
    }
  })();

  return (
    <section className="bg-bg py-8 text-text-main">
      <div className="mx-auto container px-4">
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <ShowcaseSidebar
            sections={componentsSectionNavItems}
            title="Components"
            ariaLabel="Components sections"
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
