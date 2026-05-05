import type { ReactNode } from "react";

import type { PageBlock } from "@/features/blocks/shared/content";
import { BackgroundRenderer } from "@/components/projects/background-renderer";
import type { BackgroundScene } from "@/lib/background-scenes/types";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";

type SectionShellProps = {
  block: PageBlock;
  containerClassName: string;
  backgroundScene?: BackgroundScene | null;
  fallbackThemeKey?: ThemeKey;
  fallbackMode?: UiMode;
  children: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function renderInnerContent(
  backgroundScene: BackgroundScene | null | undefined,
  fallbackThemeKey: ThemeKey | undefined,
  fallbackMode: UiMode | undefined,
  children: ReactNode
) {
  return (
    <div
      className={cx(
        "relative rounded-3xl bg-surface overflow-hidden",
        backgroundScene ? "overflow-hidden" : undefined
      )}
    >
      {backgroundScene ? (
        <BackgroundRenderer
          scene={backgroundScene}
          fallbackThemeKey={fallbackThemeKey}
          fallbackMode={fallbackMode}
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SectionShell({
  block,
  containerClassName,
  backgroundScene,
  fallbackThemeKey,
  fallbackMode,
  children,
}: SectionShellProps) {
  const sectionAnchorId =
    typeof block.anchorId === "string" && block.anchorId.trim().length > 0
      ? block.anchorId
      : undefined;

  return (
    <section
      id={sectionAnchorId}
      data-testid="SectionShell"
      className={cx("scroll-mt-24", containerClassName)}
    >
      {renderInnerContent(
        backgroundScene,
        fallbackThemeKey,
        fallbackMode,
        children
      )}
    </section>
  );
}
