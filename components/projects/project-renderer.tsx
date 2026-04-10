import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import { buildAssetMap } from "@/lib/assets/resolution";
import { DEFAULT_THEME_KEY, isThemeKey } from "@/lib/themes";

import { getBlockDefinition } from "@/lib/editor/blocks";

type RenderedProject = {
  name: string;
  themeKey: string;
  content: PageContent;
  assets: ProjectAssetRecord[];
};

function getThemeClasses(themeKey: string) {
  switch (themeKey) {
    case "nightfall":
    case "sunwash":
    default:
      return {
        page: "bg-bg text-text-main",
        heroCard:
          "rounded-[2rem] border border-line bg-surface-alt px-8 py-12 shadow-sm",
        sectionCard: "rounded-[2rem] border border-line bg-surface px-8 py-10 shadow-sm",
        button:
          "inline-flex items-center justify-center rounded-2xl bg-primary-300 px-5 py-3 text-sm font-medium text-text-inverted-main transition hover:bg-primary-200",
        muted: "text-text-muted",
        kicker: "text-text-placeholder",
      };
  }
}

function renderBlock(
  block: PageContent["blocks"][number],
  assetMap: Map<string, ProjectAssetRecord>,
  theme: ReturnType<typeof getThemeClasses>
) {
  const definition = getBlockDefinition(block.type, block.variant);

  if (!definition) {
    return null;
  }

  const Renderer = definition.Renderer;

  return <Renderer block={block} assetMap={assetMap} theme={theme} />;
}

export function ProjectRenderer({ name, themeKey, content, assets }: RenderedProject) {
  const resolvedThemeKey = isThemeKey(themeKey) ? themeKey : DEFAULT_THEME_KEY;
  const theme = getThemeClasses(resolvedThemeKey);
  const assetMap = buildAssetMap(assets);

  return (
    <main
      data-theme={resolvedThemeKey}
      data-mode="light"
      className={`min-h-screen px-4 py-16 ${theme.page}`}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className={theme.heroCard}>
          <p className={`text-sm font-medium uppercase tracking-[0.2em] ${theme.kicker}`}>
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
              {renderBlock(block, assetMap, theme)}
            </section>
          ))
        )}
      </div>
    </main>
  );
}
