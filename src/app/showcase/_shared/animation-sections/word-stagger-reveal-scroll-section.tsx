"use client";

import { useState } from "react";

import { WordStaggerReveal } from "@/components/ui/word-stagger-reveal";
import { useVisibleOnce } from "@/hooks/use-visible-once";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";

import { UikitSectionAnchor } from "./section-anchor";

const DEFERRED = 10_000_000;

type ScrollWordRevealItemProps = {
  label: string;
  children: (visible: boolean, restartKey: number) => React.ReactNode;
};

function ScrollWordRevealItem({ label, children }: ScrollWordRevealItemProps) {
  const { ref, visible } = useVisibleOnce();
  const [restartKey, setRestartKey] = useState(0);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-3 rounded-xl border border-line bg-surface-alt px-5 py-4"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
        <UIButton
          type="button"
          size="sm"
          theme="base"
          variant="outlined"
          className="shrink-0"
          onClick={() => setRestartKey((key) => key + 1)}
        >
          Restart
        </UIButton>
      </div>
      {children(visible, restartKey)}
    </div>
  );
}

export function WordStaggerRevealScrollSection() {
  return (
    <UikitSectionAnchor id="word-stagger-reveal-scroll">
      <UICard title="UIKit · WordStaggerReveal / Scroll Trigger">
        <div className="grid gap-4">
          <ScrollWordRevealItem label="Heading — upward stagger">
            {(visible, restartKey) => (
              <p className="text-3xl font-bold text-text-main">
                <WordStaggerReveal
                  text="Build pages that read clearly."
                  direction="up"
                  offset="24px"
                  duration={850}
                  stagger={110}
                  fade
                  startDelay={visible ? 0 : DEFERRED}
                  restartKey={visible ? restartKey : 0}
                />
              </p>
            )}
          </ScrollWordRevealItem>

          <ScrollWordRevealItem label="Subtitle — soft fade with blur">
            {(visible, restartKey) => (
              <p className="overflow-hidden text-base text-text-main">
                <WordStaggerReveal
                  text="Write the message, control the cadence, and let each phrase land with intent."
                  direction="up"
                  offset="14px"
                  duration={900}
                  stagger={70}
                  fade
                  blur
                  startDelay={visible ? 120 : DEFERRED}
                  restartKey={visible ? restartKey : 0}
                />
              </p>
            )}
          </ScrollWordRevealItem>

          <ScrollWordRevealItem label="Reverse order — right to left feel">
            {(visible, restartKey) => (
              <p className="overflow-hidden text-h3 font-semibold text-text-main">
                <WordStaggerReveal
                  text="Last word first can feel unexpectedly sharp."
                  direction="left"
                  offset="20px"
                  duration={800}
                  stagger={95}
                  reverse
                  fade
                  startDelay={visible ? 0 : DEFERRED}
                  restartKey={visible ? restartKey : 0}
                />
              </p>
            )}
          </ScrollWordRevealItem>
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}
