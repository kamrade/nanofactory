import type { ReactNode } from "react";

import { BackgroundRenderer } from "@/components/projects/background-renderer";
import type { BackgroundScene } from "@/lib/background-scenes/types";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";
import { cx } from "@/lib/cn";


type SectionShellProps = {
  containerClassName: string;
  innerRadiusClassName?: string;
  anchorId?: string;
  backgroundScene?: BackgroundScene | null;
  fallbackThemeKey?: ThemeKey;
  fallbackMode?: UiMode;
  children: ReactNode;
};

function renderInnerContent(
  innerRadiusClassName: string | undefined,
  backgroundScene: BackgroundScene | null | undefined,
  fallbackThemeKey: ThemeKey | undefined,
  fallbackMode: UiMode | undefined,
  children: ReactNode
) {
  return (
    <div
      className={cx(
        "relative bg-surface overflow-hidden",
        innerRadiusClassName ?? "rounded-3xl",
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
  containerClassName,
  innerRadiusClassName,
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
        innerRadiusClassName,
        backgroundScene,
        fallbackThemeKey,
        fallbackMode,
        children
      )}
    </section>
  );
}
