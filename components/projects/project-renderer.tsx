import type { PageContent } from "@/db/schema";

import { getBlockDefinition } from "@/lib/editor/blocks";

type RenderedProject = {
  name: string;
  themeKey: string;
  content: PageContent;
};

function getThemeClasses(themeKey: string) {
  switch (themeKey) {
    case "classic-light":
    default:
      return {
        page: "bg-white text-zinc-950",
        heroCard:
          "rounded-[2rem] border border-zinc-200 bg-zinc-50 px-8 py-12 shadow-sm",
        sectionCard: "rounded-[2rem] border border-zinc-200 bg-white px-8 py-10 shadow-sm",
        button:
          "inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800",
        muted: "text-zinc-600",
      };
  }
}

function renderBlock(block: PageContent["blocks"][number], mutedClassName: string, buttonClassName: string) {
  const definition = getBlockDefinition(block.type);

  if (!definition) {
    return null;
  }

  if (block.type === "hero") {
    const title = typeof block.props.title === "string" ? block.props.title : "";
    const subtitle =
      typeof block.props.subtitle === "string" ? block.props.subtitle : "";
    const buttonText =
      typeof block.props.buttonText === "string" ? block.props.buttonText : "";

    return (
      <section className="space-y-5">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-zinc-500">
          Hero
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className={`max-w-3xl text-base leading-7 ${mutedClassName}`}>{subtitle}</p>
        <div>
          <span className={buttonClassName}>{buttonText}</span>
        </div>
      </section>
    );
  }

  if (block.type === "features") {
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

  if (block.type === "cta") {
    const title = typeof block.props.title === "string" ? block.props.title : "";
    const buttonText =
      typeof block.props.buttonText === "string" ? block.props.buttonText : "";

    return (
      <section className="space-y-5 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
        <div>
          <span className={buttonClassName}>{buttonText}</span>
        </div>
      </section>
    );
  }

  return null;
}

export function ProjectRenderer({ name, themeKey, content }: RenderedProject) {
  const theme = getThemeClasses(themeKey);

  return (
    <main className={`min-h-screen px-4 py-16 ${theme.page}`}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className={theme.heroCard}>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            Published with Nanofactory
          </p>
          <p className={`mt-3 text-sm ${theme.muted}`}>Project: {name}</p>
        </header>

        {content.blocks.length === 0 ? (
          <section className={theme.sectionCard}>
            <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
            <p className={`mt-3 text-base leading-7 ${theme.muted}`}>
              This page has been published, but it does not contain any blocks yet.
            </p>
          </section>
        ) : (
          content.blocks.map((block) => (
            <section key={block.id} className={theme.sectionCard}>
              {renderBlock(block, theme.muted, theme.button)}
            </section>
          ))
        )}
      </div>
    </main>
  );
}
