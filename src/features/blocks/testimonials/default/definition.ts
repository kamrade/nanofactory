import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { TestimonialsDefaultEditor } from "./editor";
import { TestimonialsDefaultRender } from "./render";

type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  imageAssetId: string | undefined;
};

const defaultItems: TestimonialItem[] = [
  {
    quote:
      "The editor stays simple, so the team can move fast without losing structure.",
    name: "Ava Chen",
    role: "Product designer",
    imageAssetId: undefined,
  },
  {
    quote:
      "We shipped our first version quickly and still have room to grow the page later.",
    name: "Daniel Brooks",
    role: "Founder",
    imageAssetId: undefined,
  },
  {
    quote:
      "Clear sections, clear controls, and no unnecessary complexity in the workflow.",
    name: "Mina Patel",
    role: "Operations lead",
    imageAssetId: undefined,
  },
];

function readItems(input: unknown): TestimonialItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      const quote = readOptionalString(item.quote);
      const name = readOptionalString(item.name);
      const role = readOptionalString(item.role) ?? "";

      if (!quote || !name) {
        return null;
      }

      return {
        quote,
        name,
        role,
        imageAssetId: readOptionalString(item.imageAssetId),
      };
    })
    .filter((item): item is TestimonialItem => item !== null);
}

export const testimonialsDefaultDefinition: BlockVariantDefinition = {
  type: "testimonials",
  typeLabel: "Testimonials",
  variant: "default",
  label: "Default",
  description: "Simple testimonial grid with short quotes and author details.",
  fields: [
    {
      key: "sectionTitle",
      label: "Section title",
      kind: "text",
      placeholder: "What people say",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      kind: "textarea",
      placeholder: "Add a short supporting line under the title.",
    },
  ],
  Editor: TestimonialsDefaultEditor,
  createDefaultProps: () => ({
    sectionTitle: "What people say",
    subtitle: "A simple, readable way to show a few short endorsements.",
    animate: true,
    items: defaultItems,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    const items = readItems(props.items);

    return {
      sectionTitle: readString(props.sectionTitle, "What people say"),
      subtitle: readString(
        props.subtitle,
        "A simple, readable way to show a few short endorsements."
      ),
      animate: typeof props.animate === "boolean" ? props.animate : true,
      items: items.length > 0 ? items : defaultItems,
    };
  },
  Renderer: TestimonialsDefaultRender,
};
