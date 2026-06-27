"use client";

import { UICard } from "@/components/ui/card";
import { useViewportVisible } from "@/hooks/use-viewport-visible";

import { UikitSectionAnchor } from "./section-anchor";

type ViewportRevealItemProps = {
  title: string;
  description: string;
  accent: string;
  index: number;
};

function ViewportRevealItem({ title, description, accent, index }: ViewportRevealItemProps) {
  const { ref, visible } = useViewportVisible<HTMLDivElement>({ threshold: 0.35 });

  return (
    <div
      ref={ref}
      className={[
        "grid gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm",
        "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "translate-y-0 opacity-100 blur-0" : "translate-y-6 opacity-0 blur-sm",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {index}
        </span>
        <div>
          <p className="text-sm font-semibold text-text-main">{title}</p>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {["Appear", "Hold", "Disappear"].map((label) => (
          <div key={label} className="rounded-xl bg-surface-alt px-3 py-2 text-xs font-medium text-text-muted">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ViewportRevealSection() {
  return (
    <UikitSectionAnchor id="viewport-reveal">
      <UICard title="UIKit · Viewport Reveal">
        <p className="text-sm text-text-muted">
          Each block animates in when it enters the viewport and animates out when it leaves.
        </p>

        <div className="mt-5 grid gap-6">
          <ViewportRevealItem
            index={1}
            title="Text block"
            description="A simple card that fades and lifts both ways."
            accent="#7C3AED"
          />
          <ViewportRevealItem
            index={2}
            title="Action block"
            description="Useful for buttons, feature callouts, or any compact object."
            accent="#0EA5E9"
          />
          <ViewportRevealItem
            index={3}
            title="Composite block"
            description="The wrapper is generic, so you can animate full UI chunks."
            accent="#F97316"
          />
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}
