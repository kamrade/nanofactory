import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { PricingDefaultEditor } from "./editor";
import { PricingDefaultRender } from "./render";

type PricingPlan = {
  title: string;
  price: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  includes: string[];
};

const defaultPlans: PricingPlan[] = [
  {
    title: "Starter",
    price: "$19",
    description: "For small launches that need a clean, focused pricing section.",
    buttonText: "Choose Starter",
    buttonHref: "#",
    includes: ["1 seat", "Basic support", "Core features"],
  },
  {
    title: "Growth",
    price: "$49",
    description: "For teams that want more room to move and keep the page flexible.",
    buttonText: "Choose Growth",
    buttonHref: "#",
    includes: ["5 seats", "Priority support", "Advanced features"],
  },
  {
    title: "Scale",
    price: "$99",
    description: "For projects that need the most flexibility and room to grow.",
    buttonText: "Contact sales",
    buttonHref: "#",
    includes: ["Unlimited seats", "Dedicated support", "Custom setup"],
  },
];

function readPlans(input: unknown): PricingPlan[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      return {
        title: readString(item.title, ""),
        price: readString(item.price, ""),
        description: readString(item.description, ""),
        buttonText: readOptionalString(item.buttonText) ?? "",
        buttonHref: readOptionalString(item.buttonHref) ?? "",
        includes: Array.isArray(item.includes)
          ? item.includes.filter((entry): entry is string => typeof entry === "string")
          : [],
      };
    })
    .filter((item): item is PricingPlan => item !== null);
}

function clampFeaturedIndex(value: unknown, itemsLength: number) {
  const nextIndex = typeof value === "number" && Number.isInteger(value) ? value : 1;
  if (itemsLength <= 0) {
    return 0;
  }
  return Math.min(Math.max(nextIndex, 0), itemsLength - 1);
}

export const pricingDefaultDefinition: BlockVariantDefinition = {
  type: "pricing",
  typeLabel: "Pricing",
  variant: "default",
  label: "Default",
  description: "Simple pricing cards with an optional featured plan and CTA buttons.",
  fields: [
    {
      key: "sectionTitle",
      label: "Section title",
      kind: "text",
      placeholder: "Pricing",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      kind: "textarea",
      placeholder: "A short line under the title that explains the pricing structure.",
    },
  ],
  Editor: PricingDefaultEditor,
  createDefaultProps: () => ({
    sectionTitle: "Pricing",
    subtitle: "Pick a plan that matches where you are today and keeps the next step obvious.",
    featuredIndex: 1,
    plans: defaultPlans,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    const plans = readPlans(props.plans);

    return {
      sectionTitle: readString(props.sectionTitle, "Pricing"),
      subtitle: readString(
        props.subtitle,
        "Pick a plan that matches where you are today and keeps the next step obvious."
      ),
      featuredIndex: clampFeaturedIndex(props.featuredIndex, plans.length || defaultPlans.length),
      plans: plans.length > 0 ? plans : defaultPlans,
    };
  },
  Renderer: PricingDefaultRender,
};
