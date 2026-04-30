import type { ReactNode } from "react";

import type { PageBlock } from "@/features/blocks/shared/content";
import { BackgroundRenderer } from "@/components/projects/background-renderer";
import type { BackgroundScene } from "@/lib/background-scenes/types";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";

type SectionShellProps = {
  block: PageBlock;
  containerClassName: string;
  cardClassName?: string;
  fullBleedClassName?: string;
  backgroundScene?: BackgroundScene | null;
  fallbackThemeKey?: ThemeKey;
  fallbackMode?: UiMode;
  children: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function renderInnerContent(
  cardClassName: string | undefined,
  backgroundScene: BackgroundScene | null | undefined,
  fallbackThemeKey: ThemeKey | undefined,
  fallbackMode: UiMode | undefined,
  children: ReactNode
) {
  return (
    <div className={cx("relative", backgroundScene ? "overflow-hidden" : undefined, cardClassName)}>
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
  cardClassName,
  fullBleedClassName = "w-full",
  backgroundScene,
  fallbackThemeKey,
  fallbackMode,
  children,
}: SectionShellProps) {
  if (block.fullBleed) {
    return (
      <section data-testid="SectionShellFullBleed" className={fullBleedClassName}>
        {renderInnerContent(
          undefined,
          backgroundScene,
          fallbackThemeKey,
          fallbackMode,
          children
        )}
      </section>
    );
  }

  return (
    <section data-testid="SectionShell" className={containerClassName}>
      {renderInnerContent(
        cardClassName,
        backgroundScene,
        fallbackThemeKey,
        fallbackMode,
        children
      )}
    </section>
  );
}
