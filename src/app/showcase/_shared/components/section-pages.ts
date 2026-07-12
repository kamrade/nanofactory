export const COMPONENTS_SECTION_PAGE_KEYS = [
  "typography-headings",
  "typography-buttons",
  "typography-badges",
  "controls-menu",
  "controls-checkbox",
  "controls-switcher",
  "controls-segmented-control",
  "controls-accordion",
  "controls-dropdown",
  "inputs-text-input",
  "inputs-select",
  "inputs-slider",
  "inputs-multiselect-list",
  "inputs-multiselect-dropdown",
  "inputs-autocomplete",
  "feedback-toast",
  "feedback-sheet",
  "dialog",
  "modal",
  "markdown",
] as const;

export type ComponentsSectionPageKey = (typeof COMPONENTS_SECTION_PAGE_KEYS)[number];

export const componentsSectionPageNavItems = [
  { id: "typography-headings", label: "Headings", href: "/showcase/components/typography-headings" },
  { id: "typography-buttons", label: "Buttons", href: "/showcase/components/typography-buttons" },
  { id: "typography-badges", label: "Badges", href: "/showcase/components/typography-badges" },
  { id: "controls-menu", label: "Menu", href: "/showcase/components/controls-menu" },
  { id: "controls-checkbox", label: "Checkbox", href: "/showcase/components/controls-checkbox" },
  { id: "controls-switcher", label: "Switcher", href: "/showcase/components/controls-switcher" },
  { id: "controls-segmented-control", label: "Segmented Control", href: "/showcase/components/controls-segmented-control" },
  { id: "controls-accordion", label: "Accordion", href: "/showcase/components/controls-accordion" },
  { id: "controls-dropdown", label: "Dropdown", href: "/showcase/components/controls-dropdown" },
  { id: "inputs-text-input", label: "Text Input", href: "/showcase/components/inputs-text-input" },
  { id: "inputs-select", label: "Select", href: "/showcase/components/inputs-select" },
  { id: "inputs-slider", label: "Slider", href: "/showcase/components/inputs-slider" },
  { id: "inputs-multiselect-list", label: "MultiSelect List", href: "/showcase/components/inputs-multiselect-list" },
  { id: "inputs-multiselect-dropdown", label: "MultiSelect (Dropdown)", href: "/showcase/components/inputs-multiselect-dropdown" },
  { id: "inputs-autocomplete", label: "Autocomplete", href: "/showcase/components/inputs-autocomplete" },
  { id: "feedback-toast", label: "Toast", href: "/showcase/components/feedback-toast" },
  { id: "feedback-sheet", label: "Sheet", href: "/showcase/components/feedback-sheet" },
  { id: "dialog", label: "Dialog", href: "/showcase/components/dialog" },
  { id: "modal", label: "Modal", href: "/showcase/components/modal" },
  { id: "markdown", label: "Markdown", href: "/showcase/components/markdown" },
] as const;

export function isComponentsSectionPageKey(value: unknown): value is ComponentsSectionPageKey {
  return typeof value === "string" && (COMPONENTS_SECTION_PAGE_KEYS as readonly string[]).includes(value);
}

export function resolveComponentsSectionPageKey(value: unknown): ComponentsSectionPageKey {
  return isComponentsSectionPageKey(value) ? value : COMPONENTS_SECTION_PAGE_KEYS[0];
}

export function getComponentsSectionPageTitle(section: ComponentsSectionPageKey): string {
  switch (section) {
    case "typography-headings":
      return "Headings";
    case "typography-buttons":
      return "Buttons";
    case "typography-badges":
      return "Badges";
    case "controls-menu":
      return "Menu";
    case "controls-checkbox":
      return "Checkbox";
    case "controls-switcher":
      return "Switcher";
    case "controls-segmented-control":
      return "Segmented Control";
    case "controls-accordion":
      return "Accordion";
    case "controls-dropdown":
      return "Dropdown";
    case "inputs-text-input":
      return "Text Input";
    case "inputs-select":
      return "Select";
    case "inputs-slider":
      return "Slider";
    case "inputs-multiselect-list":
      return "MultiSelect List";
    case "inputs-multiselect-dropdown":
      return "MultiSelect (Dropdown)";
    case "inputs-autocomplete":
      return "Autocomplete";
    case "feedback-toast":
      return "Toast";
    case "feedback-sheet":
      return "Sheet";
    case "dialog":
      return "Dialog";
    case "modal":
      return "Modal";
    case "markdown":
      return "Markdown";
  }

  return section;
}
