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
    <section data-testid="UICard" className={cx("grid gap-4 rounded-3xl border border-line bg-surface p-10", className)}>
      <h2 className={cx("mb-6 border-b border-line pb-3 text-lg font-semibold", titleClassName)}>
        {title}
      </h2>
      {children}
    </section>
  );
}

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "alt";
};

export function Card({ children, className, tone = "surface" }: CardProps) {
  return (
    <div
      data-testid="Card"
      className={cx(
        "grid gap-3 rounded-2xl border border-line p-4",
        tone === "surface" ? "bg-surface" : "bg-surface-alt",
        className
      )}
    >
      {children}
    </div>
  );
}
