import type { ReactNode } from "react";

import type { PageBlock } from "@/features/blocks/shared/content";
import { BackgroundRenderer } from "@/components/projects/background-renderer";
import type { BackgroundScene } from "@/lib/background-scenes/types";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";
import { cx } from "@/lib/cn";


type SectionShellProps = {
  block: PageBlock;
  containerClassName: string;
  anchorId?: string;
  backgroundScene?: BackgroundScene | null;
  fallbackThemeKey?: ThemeKey;
  fallbackMode?: UiMode;
  children: ReactNode;
};

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
  anchorId,
  backgroundScene,
  fallbackThemeKey,
  fallbackMode,
  children,
}: SectionShellProps) {
  return (
    <section
      id={anchorId}
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
