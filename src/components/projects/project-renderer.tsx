import type { PageContent } from "@/db/schema";
import { remapSceneToPalette } from "@/components/assets/background-scene-defaults";
import type { ProjectAssetRecord } from "@/lib/assets";
import { buildAssetMap } from "@/lib/assets/resolution";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";
import { ProjectModeSwitcher } from "@/components/projects/project-mode-switcher";
import { DEFAULT_THEME_KEY, isThemeKey } from "@/lib/themes";
import { SectionShell } from "@/components/projects/section-shell";
import {
  buildEffectivePageAnchors,
  getGalleryItemEffectiveAnchor,
} from "@/lib/editor/anchor-id";

import { getBlockDefinition } from "@/lib/editor/blocks";

type RenderedProject = {
  name: string;
  slug?: string;
  themeKey: string;
  mode?: "light" | "dark";
  content: PageContent;
  assets: ProjectAssetRecord[];
  backgroundScenes?: BackgroundSceneRecord[];
  showPublishedBadge?: boolean;
  showProjectMeta?: boolean;
  galleryItemLinkMode?: "absolute" | "relative";
};

function getThemeClasses(themeKey: string) {
  switch (themeKey) {
    case "nightfall":
    case "sunwash":
    default:
      return {
        page: "bg-bg text-text-main",
        heroCard: "",
        button:
          "inline-flex items-center justify-center rounded-2xl bg-primary-300 px-5 py-3 text-sm font-medium text-text-inverted-main transition hover:bg-primary-200",
        muted: "text-text-muted",
        kicker: "text-text-placeholder",
      };
  }
}

function renderBlock(
  block: PageContent["blocks"][number],
  publicProjectSlug: string | undefined,
  galleryItemLinkMode: "absolute" | "relative",
  anchorId: string | undefined,
  effectiveGalleryItemAnchors: Map<number, string> | undefined,
  assetMap: Map<string, ProjectAssetRecord>,
  sceneMap: Map<string, BackgroundSceneRecord>,
  theme: ReturnType<typeof getThemeClasses>,
  fallbackThemeKey: "sunwash" | "nightfall",
  fallbackMode: "light" | "dark"
) {
  const definition = getBlockDefinition(block.type, block.variant);

  if (!definition) {
    return null;
  }

  const Renderer = definition.Renderer;
  const backgroundScene =
    typeof block.backgroundSceneId === "string"
      ? sceneMap.get(block.backgroundSceneId)?.sceneJson ?? null
      : null;

  return (
    <SectionShell
      block={block}
      anchorId={anchorId}
      containerClassName="container mx-auto px-4"
      backgroundScene={backgroundScene}
      fallbackThemeKey={fallbackThemeKey}
      fallbackMode={fallbackMode}
    >
      <Renderer
        block={block}
        assetMap={assetMap}
        theme={theme}
        mode={fallbackMode}
        publicProjectSlug={publicProjectSlug}
        galleryItemLinkMode={galleryItemLinkMode}
        effectiveBlockAnchorId={anchorId}
        effectiveGalleryItemAnchors={effectiveGalleryItemAnchors}
      />
    </SectionShell>
  );
}

export function ProjectRenderer({
  name,
  slug,
  themeKey,
  mode = "light",
  content,
  assets,
  backgroundScenes = [],
  showPublishedBadge = true,
  showProjectMeta = true,
  galleryItemLinkMode = "absolute",
}: RenderedProject) {
  const resolvedThemeKey = isThemeKey(themeKey) ? themeKey : DEFAULT_THEME_KEY;
  const theme = getThemeClasses(resolvedThemeKey);
  const assetMap = buildAssetMap(assets);
  const paletteAdjustedScenes = backgroundScenes.map((scene) => ({
    ...scene,
    sceneJson: remapSceneToPalette(scene.sceneJson, {
      themeKey: resolvedThemeKey,
      mode,
    }),
  }));
  const sceneMap = new Map(paletteAdjustedScenes.map((scene) => [scene.id, scene] as const));
  const effectiveAnchors = buildEffectivePageAnchors(content.blocks);
  const anchorMap = effectiveAnchors.blockAnchors;
  const containerClass = "container mx-auto px-4";

  return (
    <main
      data-theme={resolvedThemeKey}
      data-mode={mode}
      className={`min-h-screen py-8 ${theme.page}`}
    >
      <div className="flex w-full flex-col gap-12">
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
                  <ProjectModeSwitcher initialMode={mode} syncSearchParam="mode" />
                </div>
              ) : null}
            </div>
          </header>
        ) : null}

        {content.blocks.length === 0 ? (
          <section data-testid="ProjectRenderBlock" className={containerClass}>
            <div className="rounded-[2rem] border border-line bg-surface px-8 py-10 shadow-sm">
              <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
              <p className={`mt-3 text-base leading-7 ${theme.muted}`}>
                This page has been published, but it does not contain any blocks yet.
              </p>
            </div>
          </section>
        ) : (
          content.blocks.map((block) => (
            <div key={block.id}>
              {renderBlock(
                block,
                slug,
                galleryItemLinkMode,
                anchorMap.get(block.id),
                block.type === "gallery" && Array.isArray(block.props.items)
                  ? new Map(
                      block.props.items
                        .map((_, index) => [
                          index,
                          getGalleryItemEffectiveAnchor(
                            effectiveAnchors.galleryItemAnchors,
                            block.id,
                            index
                          ),
                        ] as const)
                        .filter((entry): entry is readonly [number, string] => Boolean(entry[1]))
                    )
                  : undefined,
                assetMap,
                sceneMap,
                theme,
                resolvedThemeKey,
                mode
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
