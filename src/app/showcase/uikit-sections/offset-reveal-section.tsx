"use client";

import { useState } from "react";

import { OffsetRevealText } from "@/components/ui/offset-reveal-text";
import { useVisibleOnce } from "@/hooks/use-visible-once";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISwitcher } from "@/components/ui/switcher";
import { UITextInput } from "@/components/ui/text-input";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "./types";

const DEFERRED = 10_000_000;

type Direction = "up" | "down" | "left" | "right";

type ScrollRevealItemProps = {
  label: string;
  children: (visible: boolean) => React.ReactNode;
};

function ScrollRevealItem({ label, children }: ScrollRevealItemProps) {
  const { ref, visible } = useVisibleOnce();
  return (
    <div
      ref={ref}
      className="flex flex-col gap-3 rounded-xl border border-line bg-surface-alt px-5 py-4"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      {children(visible)}
    </div>
  );
}

export function OffsetRevealSection({ uiSize }: { uiSize: UiSize }) {
  const [text, setText] = useState("Ship it.");
  const [direction, setDirection] = useState<Direction>("down");
  const [offset, setOffset] = useState("24px");
  const [duration, setDuration] = useState(900);
  const [startDelay, setStartDelay] = useState(0);
  const [fade, setFade] = useState(false);
  const [blur, setBlur] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  return (
    <>
      <UikitSectionAnchor id="offset-reveal">
        <UICard title="UIKit · OffsetRevealText">
          <div className="flex min-h-[96px] items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-alt px-5 py-6">
            <p className="text-h2 font-bold text-text-main">
              <OffsetRevealText
                text={text || "Ship it."}
                direction={direction}
                offset={offset}
                duration={duration}
                startDelay={startDelay}
                fade={fade}
                blur={blur}
                disabled={disabled}
                restartKey={restartKey}
              />
            </p>
          </div>

          <div className="mt-5 grid">
            <UIFormRow label="Text" htmlFor="ort-text" borderless>
              <UITextInput
                id="ort-text"
                size="sm"
                borderless
                value={text}
                onValueChange={setText}
                placeholder="Ship it."
              />
            </UIFormRow>

            <UIFormRow label="Direction" borderless>
              <UISegmentedControl
                ariaLabel="Reveal direction"
                size="sm"
                borderless
                value={direction}
                onValueChange={setDirection}
                options={[
                  { value: "up", label: "Up" },
                  { value: "down", label: "Down" },
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ]}
              />
            </UIFormRow>

            <UIFormRow label="Offset" htmlFor="ort-offset" borderless>
              <UITextInput
                id="ort-offset"
                size="sm"
                borderless
                value={offset}
                onValueChange={setOffset}
                placeholder="24px"
              />
            </UIFormRow>

            <UIFormRow label="Duration (ms)" htmlFor="ort-duration" borderless>
              <UITextInput
                id="ort-duration"
                size="sm"
                borderless
                type="number"
                value={String(duration)}
                onValueChange={(v) => setDuration(Math.max(50, Number(v) || 900))}
              />
            </UIFormRow>

            <UIFormRow label="Start delay (ms)" htmlFor="ort-start-delay" borderless>
              <UITextInput
                id="ort-start-delay"
                size="sm"
                borderless
                type="number"
                value={String(startDelay)}
                onValueChange={(v) => setStartDelay(Math.max(0, Number(v) || 0))}
              />
            </UIFormRow>

            <UIFormRow label="Fade" borderless>
              <UISwitcher size="sm" checked={fade} onCheckedChange={setFade} label="Fade in" />
            </UIFormRow>

            <UIFormRow label="Blur" borderless>
              <UISwitcher size="sm" checked={blur} onCheckedChange={setBlur} label="Blur in" />
            </UIFormRow>

            <UIFormRow label="Disabled (instant)" borderless>
              <UISwitcher
                size="sm"
                checked={disabled}
                onCheckedChange={setDisabled}
                label="Skip animation"
              />
            </UIFormRow>
          </div>

          <div className="mt-4">
            <UIButton
              type="button"
              size={uiSize}
              theme="base"
              variant="outlined"
              onClick={() => setRestartKey((k) => k + 1)}
            >
              Restart
            </UIButton>
          </div>
        </UICard>
      </UikitSectionAnchor>

      <UikitSectionAnchor id="offset-reveal-scroll">
        <UICard title="UIKit · OffsetRevealText / Scroll Trigger">
          <p className="text-sm text-text-muted">
            Each element animates once when it enters the viewport.
          </p>
          <div className="mt-5 grid gap-4">
            <ScrollRevealItem label="Heading — slide up">
              {(visible) => (
                <p className="overflow-hidden text-h2 font-bold text-text-main">
                  <OffsetRevealText
                    text="Build pages that ship."
                    direction="up"
                    offset="32px"
                    duration={800}
                    fade
                    startDelay={visible ? 0 : DEFERRED}
                    restartKey={visible ? 1 : 0}
                  />
                </p>
              )}
            </ScrollRevealItem>

            <ScrollRevealItem label="Staggered words — slide up">
              {(visible) => (
                <p className="overflow-hidden text-h2 font-bold text-text-main">
                  {["Fast.", "Clean.", "Ready."].map((word, i) => (
                    <span key={word}>
                      <OffsetRevealText
                        text={word}
                        direction="up"
                        offset="24px"
                        duration={700}
                        fade
                        startDelay={visible ? i * 150 : DEFERRED}
                        restartKey={visible ? 1 : 0}
                      />
                      {i < 2 && "  "}
                    </span>
                  ))}
                </p>
              )}
            </ScrollRevealItem>

            <ScrollRevealItem label="Subtitle — slide up + blur">
              {(visible) => (
                <p className="overflow-hidden text-base text-text-main">
                  <OffsetRevealText
                    text="Write the message, pick a layout, and publish — no pipeline needed."
                    direction="up"
                    offset="16px"
                    duration={900}
                    fade
                    blur
                    startDelay={visible ? 200 : DEFERRED}
                    restartKey={visible ? 1 : 0}
                  />
                </p>
              )}
            </ScrollRevealItem>

            <ScrollRevealItem label="Staggered lines">
              {(visible) => (
                <div className="flex flex-col gap-1 overflow-hidden">
                  {[
                    "→  Pages that load fast",
                    "→  Themes that adapt",
                    "→  Blocks that compose",
                  ].map((line, i) => (
                    <p key={line} className="text-base font-medium text-text-main">
                      <OffsetRevealText
                        text={line}
                        direction="up"
                        offset="20px"
                        duration={600}
                        fade
                        startDelay={visible ? i * 120 : DEFERRED}
                        restartKey={visible ? 1 : 0}
                      />
                    </p>
                  ))}
                </div>
              )}
            </ScrollRevealItem>

            <ScrollRevealItem label="Button — as='button'">
              {(visible) => (
                <div className="overflow-hidden">
                  <OffsetRevealText
                    as="button"
                    text="Get started for free"
                    direction="up"
                    offset="20px"
                    duration={700}
                    fade
                    startDelay={visible ? 100 : DEFERRED}
                    restartKey={visible ? 1 : 0}
                    className="cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-base font-semibold text-accent-text"
                  />
                </div>
              )}
            </ScrollRevealItem>
          </div>
        </UICard>
      </UikitSectionAnchor>
    </>
  );
}
