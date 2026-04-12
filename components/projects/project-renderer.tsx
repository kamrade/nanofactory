import type { PageContent } from "@/db/schema";
import type { ProjectAssetRecord } from "@/lib/assets";
import { buildAssetMap } from "@/lib/assets/resolution";
import { ProjectModeSwitcher } from "@/components/projects/project-mode-switcher";
import { DEFAULT_THEME_KEY, isThemeKey } from "@/lib/themes";

import { getBlockDefinition } from "@/lib/editor/blocks";

type RenderedProject = {
  name: string;
  themeKey: string;
  mode?: "light" | "dark";
  content: PageContent;
  assets: ProjectAssetRecord[];
  showPublishedBadge?: boolean;
  showProjectMeta?: boolean;
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

export function ProjectRenderer({
  name,
  themeKey,
  mode = "light",
  content,
  assets,
  showPublishedBadge = true,
  showProjectMeta = true,
}: RenderedProject) {
  const resolvedThemeKey = isThemeKey(themeKey) ? themeKey : DEFAULT_THEME_KEY;
  const theme = getThemeClasses(resolvedThemeKey);
  const assetMap = buildAssetMap(assets);
  const containerClass = "container mx-auto w-full px-4 sm:px-6 lg:px-8";

  return (
    <main
      data-theme={resolvedThemeKey}
      data-mode={mode}
      className={`min-h-screen py-16 ${theme.page}`}
    >
      <div className="flex w-full flex-col gap-8">
        {showPublishedBadge || showProjectMeta ? (
          <header className={containerClass}>
            <div className={theme.heroCard}>
              {showPublishedBadge ? (
                <p className={`text-sm font-medium uppercase tracking-[0.2em] ${theme.kicker}`}>
                  Published with Nanofactory
                </p>
              ) : null}
              {showProjectMeta ? (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className={`text-sm ${theme.muted}`}>Project: {name}</p>
                  <ProjectModeSwitcher />
                </div>
              ) : null}
            </div>
          </header>
        ) : null}

        {content.blocks.length === 0 ? (
          <section className={containerClass}>
            <div className={theme.sectionCard}>
              <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
              <p className={`mt-3 text-base leading-7 ${theme.muted}`}>
                This page has been published, but it does not contain any blocks yet.
              </p>
            </div>
          </section>
        ) : (
          content.blocks.map((block) =>
            block.fullBleed ? (
              <section key={block.id} className="w-full px-4 sm:px-6">
                {renderBlock(block, assetMap, theme)}
              </section>
            ) : (
              <section key={block.id} className={containerClass}>
                <div className={theme.sectionCard}>
                  {renderBlock(block, assetMap, theme)}
                </div>
              </section>
            )
          )
        )}
      </div>
    </main>
  );
}
