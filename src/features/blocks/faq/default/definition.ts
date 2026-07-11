import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { FAQDefaultEditor } from "./editor";
import { FAQDefaultRender } from "./render";

type FaqItem = {
  question: string;
  answer: string;
};

const defaultItems: FaqItem[] = [
  {
    question: "What is Nanofactory for?",
    answer:
      "It is for assembling clear landing pages and content-driven experiences from reusable blocks.",
  },
  {
    question: "Can I edit the questions and answers directly?",
    answer:
      "Yes. Each item is editable in the block settings and can be reordered with the section stack.",
  },
  {
    question: "Does it support a custom layout?",
    answer:
      "The default layout is an accessible accordion-style list, which keeps the block readable on every screen.",
  },
];

function readItems(input: unknown): FaqItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item === "string") {
        const question = readOptionalString(item);
        if (!question) {
          return null;
        }

        return {
          question,
          answer: "",
        };
      }

      if (!isPlainObject(item)) {
        return null;
      }

      const question = readOptionalString(item.question);
      const answer = readOptionalString(item.answer) ?? "";

      if (!question) {
        return null;
      }

      return {
        question,
        answer,
      };
    })
    .filter((item): item is FaqItem => item !== null);
}

export const faqDefaultDefinition: BlockVariantDefinition = {
  type: "faq",
  typeLabel: "FAQ",
  variant: "default",
  label: "Default",
  description: "Accordion-style FAQ list with concise questions and answers.",
  fields: [
    {
      key: "sectionTitle",
      label: "Section title",
      kind: "text",
      placeholder: "Frequently asked questions",
    },
    {
      key: "subtitle",
      label: "Subtitle",
      kind: "textarea",
      placeholder: "Add a short note under the title.",
    },
    {
      key: "animate",
      label: "Animate title",
      kind: "boolean",
    },
  ],
  Editor: FAQDefaultEditor,
  createDefaultProps: () => ({
    sectionTitle: "Frequently asked questions",
    subtitle: "Short answers to the questions people ask most often.",
    animate: true,
    items: defaultItems,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    const items = readItems(props.items);

    return {
      sectionTitle: readString(props.sectionTitle, "Frequently asked questions"),
      subtitle: readString(props.subtitle, "Short answers to the questions people ask most often."),
      animate: typeof props.animate === "boolean" ? props.animate : true,
      items: items.length > 0 ? items : defaultItems,
    };
  },
  Renderer: FAQDefaultRender,
};
