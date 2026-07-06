import type { ReactNode } from "react";

import { BackgroundRenderer } from "@/components/projects/background-renderer";
import type { BackgroundScene } from "@/lib/background-scenes/types";
import type { ProjectSurfaceStyle } from "@/lib/projects/surface-style";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";
import { cx } from "@/lib/cn";


type SectionShellProps = {
  containerClassName: string;
  innerRadiusClassName?: string;
  anchorId?: string;
  backgroundScene?: BackgroundScene | null;
  surfaceStyle?: ProjectSurfaceStyle;
  fallbackThemeKey?: ThemeKey;
  fallbackMode?: UiMode;
  children: ReactNode;
};

function renderInnerContent(
  innerRadiusClassName: string | undefined,
  backgroundScene: BackgroundScene | null | undefined,
  surfaceStyle: ProjectSurfaceStyle | undefined,
  fallbackThemeKey: ThemeKey | undefined,
  fallbackMode: UiMode | undefined,
  children: ReactNode
) {
  const isFlat = surfaceStyle === "flat";
  const visibleBackgroundScene = isFlat ? null : backgroundScene;

  return (
    <div
      className={cx(
        "relative overflow-hidden",
        isFlat ? "bg-transparent rounded-none" : "bg-surface",
        isFlat ? "rounded-none" : innerRadiusClassName ?? "rounded-3xl",
        visibleBackgroundScene ? "overflow-hidden" : undefined
      )}
    >
      {visibleBackgroundScene ? (
        <BackgroundRenderer
          scene={visibleBackgroundScene}
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
  surfaceStyle,
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
        surfaceStyle,
        fallbackThemeKey,
        fallbackMode,
        children
      )}
    </section>
  );
}
