import type { ReactNode } from "react";
import { cx } from "@/lib/cn";

type UikitSectionAnchorProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function UikitSectionAnchor({ id, children, className }: UikitSectionAnchorProps) {
  return (
    <section id={id} className={cx("scroll-mt-24 md:scroll-mt-28", className)}>
      {children}
    </section>
  );
}
