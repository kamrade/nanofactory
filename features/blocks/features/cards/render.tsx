import type { BlockRenderProps } from "../../shared/types";

export function FeaturesCardsRender({ block, theme }: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const items = Array.isArray(block.props.items)
    ? block.props.items.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Features
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">{sectionTitle}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={`${block.id}-${item}`}
            className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm"
          >
            <p className="text-base font-medium text-zinc-900">{item}</p>
            <p className={`mt-3 text-sm leading-6 ${theme.muted}`}>
              Keep the value proposition concise and scannable across the section.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
