export type UikitSectionNavItem = {
  id: string;
  label: string;
};

export const uikitSectionNavItems: UikitSectionNavItem[] = [
  { id: "typography-headings", label: "Typography / Headings" },
  { id: "typography-buttons", label: "Typography / Buttons" },
  { id: "typography-badges", label: "Typography / Badges" },
  { id: "controls-checkbox", label: "Controls / Checkbox" },
  { id: "controls-switcher", label: "Controls / Switcher" },
  { id: "controls-segmented-control", label: "Controls / Segmented Control" },
  { id: "controls-menu", label: "Controls / Menu" },
  { id: "inputs-text-input", label: "Inputs / Text Input" },
  { id: "inputs-select", label: "Inputs / Select" },
  { id: "inputs-multiselect-list", label: "Inputs / MultiSelect List" },
  { id: "inputs-multiselect-dropdown", label: "Inputs / MultiSelect Dropdown" },
  { id: "inputs-autocomplete", label: "Inputs / Autocomplete" },
  { id: "form-layout", label: "Form Layout" },
  { id: "form-layout-borderless-inputs", label: "Form Layout / Borderless Inputs" },
  { id: "feedback-toast", label: "Feedback / Toast" },
  { id: "feedback-sheet", label: "Feedback / Sheet" },
  { id: "dialog", label: "Dialog" },
  { id: "modal", label: "Modal" },
  { id: "markdown", label: "Markdown" },
  { id: "typewriter", label: "TypewriterText" },
  { id: "typewriter-scroll", label: "TypewriterText / Scroll Trigger" },
  { id: "highlight-sweep", label: "HighlightSweepText" },
];

export const animationsSectionNavItems: UikitSectionNavItem[] = [
  { id: "highlight-sweep-scroll", label: "HighlightSweepText / Scroll Trigger" },
  { id: "highlight-sweep-hover", label: "HighlightSweepText / Hover Trigger" },
  { id: "offset-reveal", label: "OffsetRevealText" },
  { id: "offset-reveal-scroll", label: "OffsetRevealText / Scroll Trigger" },
  { id: "word-stagger-reveal", label: "WordStaggerReveal" },
  { id: "word-stagger-reveal-scroll", label: "WordStaggerReveal / Scroll Trigger" },
];
