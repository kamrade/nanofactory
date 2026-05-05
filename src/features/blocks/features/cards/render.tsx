import Image from "next/image";
import type { BlockRenderProps } from "../../shared/types";
import { resolveAssetById } from "@/lib/assets/resolution";

type FeatureCardItem = {
  title: string;
  content: string;
  imageAssetId: string | undefined;
};

function readItems(input: unknown): FeatureCardItem[] {
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
    .filter((item): item is FeatureCardItem => item !== null);
}

export function FeaturesCardsRender({ block, theme, assetMap }: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const items = readItems(block.props.items);

  return (
    <section className="space-y-6 px-4 md:px-8 py-12">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">{sectionTitle}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const cardImage = resolveAssetById(item.imageAssetId, assetMap);
          return (
          <article
            key={`${block.id}-${item.title}`}
            className="rounded-3xl bg-surface-alt p-5"
          >
            {cardImage ? (
              <div className="mb-3 h-12 w-12 overflow-hidden rounded-lg border border-line bg-surface">
                <Image
                  src={cardImage.publicUrl}
                  alt={cardImage.alt ?? cardImage.originalFilename}
                  width={48}
                  height={48}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
            <p className="break-words text-base font-medium text-text-main">{item.title}</p>
            {item.content.trim().length > 0 ? (
              <p className={`mt-3 break-words text-sm leading-6 ${theme.muted}`}>
                {item.content}
              </p>
            ) : null}
          </article>
          );
        })}
      </div>
    </section>
  );
}
