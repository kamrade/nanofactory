import { isPlainObject, readOptionalString, readString } from "../../shared/base";
import type { BlockVariantDefinition } from "../../shared/types";
import { GalleryDefaultEditor } from "./editor";
import { GalleryDefaultRender } from "./render";

type GalleryItem = {
  assetId: string | undefined;
  entryAnchor: string | undefined;
  title: string;
  description: string;
  price: string;
  meta: string;
};

type GalleryImageHeightMode = "fixed" | "natural";

function defaultItems(): GalleryItem[] {
  return [
    {
      assetId: undefined,
      entryAnchor: undefined,
      title: "Featured item",
      description: "Short description for this gallery item.",
      price: "$120",
      meta: "Limited edition",
    },
    {
      assetId: undefined,
      entryAnchor: undefined,
      title: "Second item",
      description: "Another optional description text.",
      price: "$95",
      meta: "In stock",
    },
  ];
}

function readColumns(input: unknown): 1 | 2 | 3 | 4 {
  const raw = Number(input);
  if (raw === 1 || raw === 2 || raw === 3 || raw === 4) {
    return raw;
  }
  return 3;
}

function readItems(input: unknown): GalleryItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (!isPlainObject(item)) {
        return null;
      }

      return {
        assetId: readOptionalString(item.assetId),
        entryAnchor: readOptionalString(item.entryAnchor) ?? readOptionalString(item.imageAnchor),
        title: readString(item.title, ""),
        description: readString(item.description, ""),
        price: readString(item.price, ""),
        meta: readString(item.meta, ""),
      };
    })
    .filter((item): item is GalleryItem => item !== null);
}

function readImageHeightMode(input: unknown): GalleryImageHeightMode {
  return input === "natural" ? "natural" : "fixed";
}

export const galleryDefaultDefinition: BlockVariantDefinition = {
  type: "gallery",
  typeLabel: "Gallery",
  variant: "default",
  label: "Default",
  description: "Image gallery with configurable columns and optional text details.",
  fields: [
    {
      key: "sectionTitle",
      label: "Section title",
      kind: "text",
      placeholder: "Gallery",
    },
    {
      key: "animate",
      label: "Animate title",
      kind: "boolean",
    },
  ],
  Editor: GalleryDefaultEditor,
  createDefaultProps: () => ({
    sectionTitle: "Gallery",
    animate: true,
    columns: 3,
    imageHeightMode: "fixed",
    items: defaultItems(),
  }),
  normalizeProps: (input) => {
    const props = isPlainObject(input) ? input : {};
    const items = readItems(props.items);

    return {
      sectionTitle: readString(props.sectionTitle, "Gallery"),
      animate: typeof props.animate === "boolean" ? props.animate : true,
      columns: readColumns(props.columns),
      imageHeightMode: readImageHeightMode(props.imageHeightMode),
      items: items.length > 0 ? items : defaultItems(),
    };
  },
  Renderer: GalleryDefaultRender,
};
