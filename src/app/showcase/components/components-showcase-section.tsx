"use client";

import { useToast } from "@/hooks/use-toast";

import { DialogDemoCard, MarkdownDemoCard, ModalDemoCard } from "@/app/showcase/demo-cards";
import { SheetCard } from "@/app/showcase/components/sheet-card";
import { ToastCard } from "@/app/showcase/components/toast-card";
import { ShowcaseSidebar } from "@/app/showcase/showcase-sidebar";
import { AutocompleteCard } from "@/app/showcase/components/autocomplete-card";
import { AccordionCard } from "@/app/showcase/uikit-sections/accordion-card";
import { TypographyButtonsCard } from "@/app/showcase/uikit-sections/typography-buttons-card";
import { TypographyBadgesCard } from "@/app/showcase/uikit-sections/typography-badges-card";
import { ControlsCheckboxCard } from "@/app/showcase/uikit-sections/controls-checkbox-card";
import { ControlsSegmentedControlCard } from "@/app/showcase/uikit-sections/controls-segmented-control-card";
import { ControlsSwitcherCard } from "@/app/showcase/uikit-sections/controls-switcher-card";
import { TypographyHeadingsCard } from "@/app/showcase/uikit-sections/typography-headings-card";
import type { UiSize } from "@/app/showcase/uikit-sections";
import { MenuCard } from "@/app/showcase/components/menu-card";
import { MultiSelectDropdownCard } from "@/app/showcase/components/multiselect-dropdown-card";
import { MultiSelectListCard } from "@/app/showcase/components/multiselect-list-card";
import { InputsSelectCard } from "@/app/showcase/uikit-sections/inputs-select-card";
import { InputsSliderCard } from "@/app/showcase/uikit-sections/inputs-slider-card";
import { InputsTextInputCard } from "@/app/showcase/uikit-sections/inputs-text-input-card";

import { componentsSectionNavItems } from "./nav";
import type { ComponentsSectionPageKey } from "./section-pages";

type ComponentsShowcaseSectionProps = {
  activeSection: ComponentsSectionPageKey;
  uiSize: UiSize;
};

export function ComponentsShowcaseSection({ activeSection, uiSize }: ComponentsShowcaseSectionProps) {
  const { showToast, clearToasts } = useToast();

  const content = (() => {
    switch (activeSection) {
      case "typography-headings":
        return <TypographyHeadingsCard />;
      case "typography-buttons":
        return <TypographyButtonsCard uiSize={uiSize} />;
      case "typography-badges":
        return <TypographyBadgesCard uiSize={uiSize} />;
      case "controls-menu":
        return <MenuCard uiSize={uiSize} />;
      case "controls-checkbox":
        return <ControlsCheckboxCard />;
      case "controls-switcher":
        return <ControlsSwitcherCard />;
      case "controls-segmented-control":
        return <ControlsSegmentedControlCard uiSize={uiSize} />;
      case "controls-accordion":
        return <AccordionCard uiSize={uiSize} />;
      case "inputs-text-input":
        return <InputsTextInputCard uiSize={uiSize} />;
      case "inputs-select":
        return <InputsSelectCard uiSize={uiSize} />;
      case "inputs-slider":
        return <InputsSliderCard />;
      case "inputs-multiselect-list":
        return <MultiSelectListCard uiSize={uiSize} />;
      case "inputs-multiselect-dropdown":
        return <MultiSelectDropdownCard uiSize={uiSize} />;
      case "inputs-autocomplete":
        return <AutocompleteCard uiSize={uiSize} />;
      case "feedback-toast":
        return <ToastCard uiSize={uiSize} showToast={showToast} clearToasts={clearToasts} />;
      case "feedback-sheet":
        return <SheetCard uiSize={uiSize} />;
      case "dialog":
        return <DialogDemoCard uiSize={uiSize} />;
      case "modal":
        return <ModalDemoCard uiSize={uiSize} />;
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
          />
          {content}
        </div>
      </div>
    </section>
  );
}
