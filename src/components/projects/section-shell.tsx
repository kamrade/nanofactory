import type { ReactNode } from "react";

import type { PageBlock } from "@/features/blocks/shared/content";
import { BackgroundRenderer } from "@/components/projects/background-renderer";
import type { BackgroundScene } from "@/lib/background-scenes/types";

type SectionShellProps = {
  block: PageBlock;
  containerClassName: string;
  cardClassName?: string;
  fullBleedClassName?: string;
  backgroundScene?: BackgroundScene | null;
  children: ReactNode;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function renderInnerContent(
  cardClassName: string | undefined,
  backgroundScene: BackgroundScene | null | undefined,
  children: ReactNode
) {
  return (
    <div className={cx("relative", backgroundScene ? "overflow-hidden" : undefined, cardClassName)}>
      {backgroundScene ? <BackgroundRenderer scene={backgroundScene} /> : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SectionShell({
  block,
  containerClassName,
  cardClassName,
  fullBleedClassName = "w-full px-4 sm:px-6",
  backgroundScene,
  children,
}: SectionShellProps) {
  if (block.fullBleed) {
    return (
      <section className={fullBleedClassName}>
        {renderInnerContent(undefined, backgroundScene, children)}
      </section>
    );
  }

  return (
    <section className={containerClassName}>
      {renderInnerContent(cardClassName, backgroundScene, children)}
    </section>
  );
}
