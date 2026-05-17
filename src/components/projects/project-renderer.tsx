import type { PageContent } from "@/db/schema";
import { remapSceneToPalette } from "@/components/assets/background-scene-defaults";
import type { ProjectAssetRecord } from "@/lib/assets";
import { buildAssetMap } from "@/lib/assets/resolution";
import type { BackgroundSceneRecord } from "@/lib/background-scenes/types";
import { DEFAULT_THEME_KEY, isThemeKey } from "@/lib/themes";
import type { GalleryItemLinkMode } from "@/lib/routing/gallery-link-mode";
import { type ProjectBorderRadiusPolicy, resolveProjectBorderRadiusPolicy } from "@/lib/projects/border-radius-policy";
import { type ProjectModePolicy, resolveProjectModePolicy } from "@/lib/projects/mode-policy";
import { type ProjectSpacingScale, resolveProjectSpacingScale } from "@/lib/projects/spacing-scale";
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
  modePolicy?: ProjectModePolicy;
  borderRadiusPolicy?: ProjectBorderRadiusPolicy;
  spacingScale?: ProjectSpacingScale;
  content: PageContent;
  assets: ProjectAssetRecord[];
  backgroundScenes?: BackgroundSceneRecord[];
  galleryItemLinkMode?: GalleryItemLinkMode;
};

type ProjectThemeClasses = ReturnType<typeof getThemeClasses>;

function getThemeClasses(themeKey: string) {
  switch (themeKey) {
    case "nightfall":
    case "sunwash":
    default:
      return {
        page: "bg-bg text-text-main",
        buttonTone:
          "inline-flex items-center justify-center rounded-2xl bg-primary-300 font-medium text-text-inverted-main transition hover:bg-primary-200",
        button:
          "inline-flex items-center justify-center rounded-2xl bg-primary-300 px-5 py-3 text-sm font-medium text-text-inverted-main transition hover:bg-primary-200",
        muted: "text-text-muted",
        kicker: "text-text-placeholder",
      };
  }
}

function buildGalleryItemAnchorMap(
  block: PageContent["blocks"][number],
  effectiveAnchors: ReturnType<typeof buildEffectivePageAnchors>
) {
  if (!(block.type === "gallery" && Array.isArray(block.props.items))) {
    return undefined;
  }

  return new Map(
    block.props.items
      .map((_, index) => [
        index,
        getGalleryItemEffectiveAnchor(effectiveAnchors.galleryItemAnchors, block.id, index),
      ] as const)
      .filter((entry): entry is readonly [number, string] => Boolean(entry[1]))
  );
}

function buildProjectRenderContext(input: {
  themeKey: string;
  mode: "light" | "dark";
  content: PageContent;
  assets: ProjectAssetRecord[];
  backgroundScenes: BackgroundSceneRecord[];
}) {
  const resolvedThemeKey = isThemeKey(input.themeKey) ? input.themeKey : DEFAULT_THEME_KEY;
  const theme = getThemeClasses(resolvedThemeKey);
  const assetMap = buildAssetMap(input.assets);
  const paletteAdjustedScenes = input.backgroundScenes.map((scene) => ({
    ...scene,
    sceneJson: remapSceneToPalette(scene.sceneJson, {
      themeKey: resolvedThemeKey,
      mode: input.mode,
    }),
  }));
  const sceneMap = new Map(paletteAdjustedScenes.map((scene) => [scene.id, scene] as const));
  const effectiveAnchors = buildEffectivePageAnchors(input.content.blocks);

  return {
    resolvedThemeKey,
    theme,
    assetMap,
    sceneMap,
    effectiveAnchors,
  };
}

function renderBlock(
  block: PageContent["blocks"][number],
  publicProjectSlug: string | undefined,
  galleryItemLinkMode: GalleryItemLinkMode,
  modePolicy: ProjectModePolicy,
  borderRadiusPolicy: ProjectBorderRadiusPolicy,
  spacingScale: ProjectSpacingScale,
  anchorId: string | undefined,
  effectiveGalleryItemAnchors: Map<number, string> | undefined,
  assetMap: Map<string, ProjectAssetRecord>,
  sceneMap: Map<string, BackgroundSceneRecord>,
  theme: ProjectThemeClasses,
  fallbackThemeKey: "sunwash" | "nightfall",
  fallbackMode: "light" | "dark"
) {
  const definition = getBlockDefinition(block.type, block.variant);

  if (!definition) {
    return null;
  }

  const Renderer = definition.Renderer;
  const blockShellRadiusClassName =
    block.type === "features" ||
    block.type === "cta" ||
    block.type === "app-header" ||
    block.type === "gallery" ||
    block.type === "hero" ||
    block.type === "projects-gallery" ||
    block.type === "footer"
      ? borderRadiusPolicy === "none"
        ? "rounded-none"
        : borderRadiusPolicy === "md"
          ? "rounded-xl"
          : "rounded-3xl"
      : undefined;
  const backgroundScene =
    typeof block.backgroundSceneId === "string"
      ? sceneMap.get(block.backgroundSceneId)?.sceneJson ?? null
      : null;

  return (
    <SectionShell
      anchorId={anchorId}
      containerClassName="container mx-auto px-4"
      innerRadiusClassName={blockShellRadiusClassName}
      backgroundScene={backgroundScene}
      fallbackThemeKey={fallbackThemeKey}
      fallbackMode={fallbackMode}
    >
      <Renderer
        block={block}
        assetMap={assetMap}
        theme={theme}
        mode={fallbackMode}
        modePolicy={modePolicy}
        projectBorderRadiusPolicy={borderRadiusPolicy}
        projectSpacingScale={spacingScale}
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
  modePolicy = "switchable",
  borderRadiusPolicy = "lg",
  spacingScale = "md",
  content,
  assets,
  backgroundScenes = [],
  galleryItemLinkMode = "absolute",
}: RenderedProject) {
  const renderContext = buildProjectRenderContext({
    themeKey,
    mode,
    content,
    assets,
    backgroundScenes,
  });
  const anchorMap = renderContext.effectiveAnchors.blockAnchors;
  const resolvedModePolicy = resolveProjectModePolicy(modePolicy);
  const resolvedBorderRadiusPolicy = resolveProjectBorderRadiusPolicy(borderRadiusPolicy);
  const resolvedSpacingScale = resolveProjectSpacingScale(spacingScale);
  const containerClass = "container mx-auto px-4";

  return (
    <main
      data-testid="project-mode-container"
      data-theme={renderContext.resolvedThemeKey}
      data-mode={mode}
      data-border-radius={resolvedBorderRadiusPolicy}
      data-spacing-scale={resolvedSpacingScale}
      className={`min-h-screen py-4 ${renderContext.theme.page}`}
    >
      <div className="flex w-full flex-col gap-6">
        {content.blocks.length === 0 ? (
          <section data-testid="ProjectRenderBlock" className={containerClass}>
            <div className="rounded-2xl border border-line bg-surface px-8 py-10 shadow-sm">
              <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
              <p className={`mt-3 text-base leading-7 ${renderContext.theme.muted}`}>
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
                resolvedModePolicy,
                resolvedBorderRadiusPolicy,
                resolvedSpacingScale,
                anchorMap.get(block.id),
                buildGalleryItemAnchorMap(block, renderContext.effectiveAnchors),
                renderContext.assetMap,
                renderContext.sceneMap,
                renderContext.theme,
                renderContext.resolvedThemeKey,
                mode
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
