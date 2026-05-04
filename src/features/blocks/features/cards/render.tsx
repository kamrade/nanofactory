import type { BlockRenderProps } from "../../shared/types";

type FeatureCardItem = {
  title: string;
  content: string;
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
      };
    })
    .filter((item): item is FeatureCardItem => item !== null);
}

export function FeaturesCardsRender({ block, theme }: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const items = readItems(block.props.items);

  return (
    <section className="space-y-6 p-4 md:p-8">
      <div className="space-y-2">
        <p className={`text-sm font-medium uppercase tracking-[0.18em] ${theme.kicker}`}>
          Features
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">{sectionTitle}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={`${block.id}-${item.title}`}
            className="rounded-3xl bg-surface-alt p-5"
          >
            <p className="break-words text-base font-medium text-text-main">{item.title}</p>
            {item.content.trim().length > 0 ? (
              <p className={`mt-3 break-words text-sm leading-6 ${theme.muted}`}>
                {item.content}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
