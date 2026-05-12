import type { ReactNode } from "react";
import { cx } from "@/lib/cn";


type UICardProps = {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
};

export function UICard({ title, children, className, titleClassName }: UICardProps) {
  return (
    <section className={cx("grid gap-4 rounded-3xl border border-line bg-surface p-10", className)}>
      <h2 className={cx("mb-6 border-b border-line pb-3 text-lg font-semibold", titleClassName)}>
        {title}
      </h2>
      {children}
    </section>
  );
}
