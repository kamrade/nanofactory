export const LAYOUTS_SECTION_PAGE_KEYS = ["form-layout", "form-layout-borderless-inputs"] as const;

export type LayoutsSectionPageKey = (typeof LAYOUTS_SECTION_PAGE_KEYS)[number];

export const layoutsSectionPageNavItems = [
  { id: "form-layout", label: "Form Layout", href: "/showcase/layouts/form-layout" },
  { id: "form-layout-borderless-inputs", label: "Form Layout / Borderless Inputs", href: "/showcase/layouts/form-layout-borderless-inputs" },
] as const;

export function isLayoutsSectionPageKey(value: unknown): value is LayoutsSectionPageKey {
  return typeof value === "string" && (LAYOUTS_SECTION_PAGE_KEYS as readonly string[]).includes(value);
}

export function resolveLayoutsSectionPageKey(value: unknown): LayoutsSectionPageKey {
  return isLayoutsSectionPageKey(value) ? value : LAYOUTS_SECTION_PAGE_KEYS[0];
}

export function getLayoutsSectionPageTitle(section: LayoutsSectionPageKey): string {
  switch (section) {
    case "form-layout":
      return "Form Layout";
    case "form-layout-borderless-inputs":
      return "Form Layout / Borderless Inputs";
  }

  return section;
}
