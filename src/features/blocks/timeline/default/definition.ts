import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { TimelineDefaultEditor } from "./editor";
import { TimelineDefaultRender } from "./render";

type TimelineItem = {
  meta: string;
  date: string;
  status: string;
  title: string;
  content: string;
};

const defaultItems: TimelineItem[] = [
  {
    meta: "01",
    date: "Q1 2026",
    status: "Planned",
    title: "Plan the flow",
    content: "Define the steps, the audience, and the outcome you want the user to reach.",
  },
  {
    meta: "02",
    date: "Q2 2026",
    status: "In progress",
    title: "Build the structure",
    content: "Create the sequence of blocks or tasks and keep the labels short and clear.",
  },
  {
    meta: "03",
    date: "Q3 2026",
    status: "Done",
    title: "Launch and improve",
    content: "Ship the first version, observe where people pause, and refine the steps over time.",
  },
];

function readItems(input: unknown): TimelineItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item === "string") {
        const title = readOptionalString(item);
        if (!title) {
          return null;
        }

        return {
          meta: "",
          date: "",
          status: "",
          title,
          content: "",
        };
      }

      if (!isPlainObject(item)) {
        return null;
      }

      return {
        meta: readOptionalString(item.meta) ?? "",
        date: readOptionalString(item.date) ?? "",
        status: readOptionalString(item.status) ?? "",
        title: readOptionalString(item.title) ?? "",
        content: readOptionalString(item.content) ?? "",
      };
    })
    .filter((item): item is TimelineItem => item !== null);
}

export const timelineDefaultDefinition: BlockVariantDefinition = {
  type: "timeline",
  typeLabel: "Timeline",
  variant: "default",
  label: "Default",
  description: "Step-by-step sequence for processes, roadmaps, and onboarding flows.",
  fields: [
    {
      key: "sectionTitle",
      label: "Section title",
      kind: "text",
      placeholder: "How it works",
    },
    {
      key: "animate",
      label: "Animate title",
      kind: "boolean",
    },
  ],
  Editor: TimelineDefaultEditor,
  createDefaultProps: () => ({
    sectionTitle: "How it works",
    animate: true,
    items: defaultItems,
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    const items = readItems(props.items);

    return {
      sectionTitle: readString(props.sectionTitle, "How it works"),
      animate: typeof props.animate === "boolean" ? props.animate : true,
      items: items.length > 0 ? items : defaultItems,
    };
  },
  Renderer: TimelineDefaultRender,
};
