import type { BlockRenderProps } from "../../shared/types";

export function FeaturesDefaultRender({ block }: BlockRenderProps) {
  const sectionTitle =
    typeof block.props.sectionTitle === "string" ? block.props.sectionTitle : "";
  const items = Array.isArray(block.props.items)
    ? block.props.items.filter((item): item is string => typeof item === "string")
    : [];

  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-semibold tracking-tight">{sectionTitle}</h2>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li
            key={`${block.id}-${item}`}
            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-700"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
