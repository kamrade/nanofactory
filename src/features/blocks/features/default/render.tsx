import Image from "next/image";
import type { BlockRenderProps } from "../../shared/types";
import { resolveAssetById } from "@/lib/assets/resolution";

type FeatureItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
};

function readItems(input: unknown): FeatureItem[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((item) => {
      if (typeof item === "string") {
        return {
          title: item,
          content: "",
          imageAssetId: undefined,
        };
      }

      if (typeof item !== "object" || item === null) {
        return null;
      }

      const title =
        typeof (item as { title?: unknown }).title === "string"
          ? (item as { title: string }).title
          : "";
      const content =
        typeof (item as { content?: unknown }).content === "string"
          ? (item as { content: string }).content
          : "";

      if (!title) {
        return null;
      }

      return {
        title,
        content,
        imageAssetId:
          typeof (item as { imageAssetId?: unknown }).imageAssetId === "string"
            ? (item as { imageAssetId: string }).imageAssetId
            : undefined,
      };
    })
    .filter((item): item is FeatureItem => item !== null);
}

export function FeaturesDefaultRender({ block, theme, assetMap }: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const items = readItems(block.props.items);

  return (
    <section className="space-y-5 px-4 md:px-8 py-12">
      <h2 className="text-2xl font-semibold tracking-tight">{sectionTitle}</h2>
      <ul className="grid gap-3">
        {items.map((item) => {
          const itemImage = resolveAssetById(item.imageAssetId, assetMap);
          return (
            <li
              key={`${block.id}-${item.title}`}
              className="rounded-2xl bg-surface-alt px-4 py-3"
            >
              <div className="flex items-start gap-3">
                {itemImage ? (
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-line bg-surface">
                  <Image
                    src={itemImage.publicUrl}
                    alt={itemImage.originalFilename}
                    width={40}
                    height={40}
                    unoptimized
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div>
                <p className="break-words text-sm font-medium leading-6 text-text-main">{item.title}</p>
                {item.content.trim().length > 0 ? (
                  <p className={`mt-1 break-words text-sm leading-6 ${theme.muted}`}>
                    {item.content}
                  </p>
                ) : null}
              </div>
            </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
