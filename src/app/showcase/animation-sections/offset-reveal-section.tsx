"use client";

import { useState } from "react";

import { OffsetReveal, OffsetRevealText } from "@/components/ui/offset-reveal-text";
import { useVisibleOnce } from "@/hooks/use-visible-once";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISlider } from "@/components/ui/slider";
import { UISwitcher } from "@/components/ui/switcher";
import { UITextInput } from "@/components/ui/text-input";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "../uikit-sections/types";

const DEFERRED = 10_000_000;

type Direction = "up" | "down" | "left" | "right";

type ScrollRevealItemProps = {
  label: string;
  children: (visible: boolean, restartKey: number) => React.ReactNode;
};

function ScrollRevealItem({ label, children }: ScrollRevealItemProps) {
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

export function OffsetRevealSection({ uiSize }: { uiSize: UiSize }) {
  const [text, setText] = useState("Ship it.");
  const [direction, setDirection] = useState<Direction>("down");
  const [offset, setOffset] = useState(24);
  const [duration, setDuration] = useState(900);
  const [startDelay, setStartDelay] = useState(0);
  const [fade, setFade] = useState(false);
  const [blur, setBlur] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const [objectRestartKey, setObjectRestartKey] = useState(0);
  const [objectDirection, setObjectDirection] = useState<Direction>("up");
  const [objectOffset, setObjectOffset] = useState(24);
  const [objectDuration, setObjectDuration] = useState(900);
  const [objectStartDelay, setObjectStartDelay] = useState(0);
  const [objectFade, setObjectFade] = useState(true);
  const [objectBlur, setObjectBlur] = useState(false);
  const [objectDisabled, setObjectDisabled] = useState(false);

  return (
    <>
      <UikitSectionAnchor id="offset-reveal">
        <UICard title="UIKit · OffsetRevealText">
          <div className="flex min-h-[96px] items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-alt px-5 py-6">
            <p className="text-h2 font-bold text-text-main">
              <OffsetRevealText
                text={text || "Ship it."}
                direction={direction}
                offset={`${offset}px`}
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

            <UIFormRow label="Offset" borderless>
              <UISlider
                ariaLabel="Offset"
                min={0}
                max={100}
                step={1}
                value={offset}
                onValueChange={setOffset}
                showValue
                valueFormatter={(value) => `${value}px`}
              />
            </UIFormRow>

            <UIFormRow label="Duration (ms)" borderless>
              <UISlider
                ariaLabel="Duration"
                min={0}
                max={5000}
                step={10}
                value={duration}
                onValueChange={setDuration}
                showValue
              />
            </UIFormRow>

            <UIFormRow label="Start delay (ms)" borderless>
              <UISlider
                ariaLabel="Start delay"
                min={0}
                max={1000}
                step={10}
                value={startDelay}
                onValueChange={setStartDelay}
                showValue
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

      <UikitSectionAnchor id="offset-reveal-object">
        <UICard title="UIKit · OffsetReveal">
          <div className="flex min-h-[96px] items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-alt px-5 py-6">
            <OffsetReveal
              key={objectRestartKey}
              as="div"
              direction={objectDirection}
              offset={`${objectOffset}px`}
              duration={objectDuration}
              startDelay={objectStartDelay}
              fade={objectFade}
              blur={objectBlur}
              disabled={objectDisabled}
              restartKey={objectRestartKey}
            >
              <div className="flex w-full max-w-xl items-start gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-400">
                  ●
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-main">OffsetReveal works on any object</p>
                  <p className="mt-1 text-sm text-text-muted">
                    Wrap a card, a button, an icon row, or any composed UI.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-text-muted">
                      Card
                    </span>
                    <span className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-text-muted">
                      Button
                    </span>
                    <span className="rounded-full bg-surface-alt px-2.5 py-1 text-xs font-medium text-text-muted">
                      Badge
                    </span>
                  </div>
                </div>
              </div>
            </OffsetReveal>
          </div>

          <div className="mt-5 grid">
            <UIFormRow label="Direction" borderless>
              <UISegmentedControl
                ariaLabel="Object reveal direction"
                size="sm"
                borderless
                value={objectDirection}
                onValueChange={setObjectDirection}
                options={[
                  { value: "up", label: "Up" },
                  { value: "down", label: "Down" },
                  { value: "left", label: "Left" },
                  { value: "right", label: "Right" },
                ]}
              />
            </UIFormRow>

            <UIFormRow label="Offset" borderless>
              <UISlider
                ariaLabel="Object offset"
                min={0}
                max={100}
                step={1}
                value={objectOffset}
                onValueChange={setObjectOffset}
                showValue
                valueFormatter={(value) => `${value}px`}
              />
            </UIFormRow>

            <UIFormRow label="Duration (ms)" borderless>
              <UISlider
                ariaLabel="Object duration"
                min={0}
                max={5000}
                step={10}
                value={objectDuration}
                onValueChange={setObjectDuration}
                showValue
              />
            </UIFormRow>

            <UIFormRow label="Start delay (ms)" borderless>
              <UISlider
                ariaLabel="Object start delay"
                min={0}
                max={1000}
                step={10}
                value={objectStartDelay}
                onValueChange={setObjectStartDelay}
                showValue
              />
            </UIFormRow>

            <UIFormRow label="Fade" borderless>
              <UISwitcher size="sm" checked={objectFade} onCheckedChange={setObjectFade} label="Fade in" />
            </UIFormRow>

            <UIFormRow label="Blur" borderless>
              <UISwitcher size="sm" checked={objectBlur} onCheckedChange={setObjectBlur} label="Blur in" />
            </UIFormRow>

            <UIFormRow label="Disabled (instant)" borderless>
              <UISwitcher
                size="sm"
                checked={objectDisabled}
                onCheckedChange={setObjectDisabled}
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
              onClick={() => setObjectRestartKey((key) => key + 1)}
            >
              Restart
            </UIButton>
          </div>
        </UICard>
      </UikitSectionAnchor>

      </>
  );
}

export function OffsetRevealScrollSection() {
  return (
    <UikitSectionAnchor id="offset-reveal-scroll">
      <UICard title="UIKit · OffsetRevealText / Scroll Trigger">
        <p className="text-sm text-text-muted">
          Each element animates once when it enters the viewport.
        </p>
        <div className="mt-5 grid gap-4">
          <ScrollRevealItem label="Heading — slide up">
            {(visible, restartKey) => (
              <p className="text-h2 font-bold text-text-main">
                <OffsetRevealText
                  text="Build pages that ship."
                  direction="up"
                  offset="32px"
                  duration={800}
                  fade
                  startDelay={visible ? 0 : DEFERRED}
                  restartKey={visible ? restartKey : 0}
                />
              </p>
            )}
          </ScrollRevealItem>

          <ScrollRevealItem label="Staggered words — slide up">
            {(visible, restartKey) => (
              <p className="text-h2 font-bold text-text-main">
                {["Fast.", "Clean.", "Ready."].map((word, i) => (
                  <span key={word}>
                    <OffsetRevealText
                      text={word}
                      direction="up"
                      offset="24px"
                      duration={700}
                      fade
                      startDelay={visible ? i * 150 : DEFERRED}
                      restartKey={visible ? restartKey : 0}
                    />
                    {i < 2 && "  "}
                  </span>
                ))}
              </p>
            )}
          </ScrollRevealItem>

          <ScrollRevealItem label="Subtitle — slide up + blur">
            {(visible, restartKey) => (
              <p className="text-base text-text-main">
                <OffsetRevealText
                  text="Write the message, pick a layout, and publish — no pipeline needed."
                  direction="up"
                  offset="16px"
                  duration={900}
                  fade
                  blur
                  startDelay={visible ? 200 : DEFERRED}
                  restartKey={visible ? restartKey : 0}
                />
              </p>
            )}
          </ScrollRevealItem>

          <ScrollRevealItem label="Staggered lines">
            {(visible, restartKey) => (
              <div className="flex flex-col gap-1">
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
                      restartKey={visible ? restartKey : 0}
                    />
                  </p>
                ))}
              </div>
            )}
          </ScrollRevealItem>

          <ScrollRevealItem label="Button — as='button'">
            {(visible, restartKey) => (
              <div>
                <OffsetRevealText
                  as="button"
                  text="Get started for free"
                  direction="up"
                  offset="20px"
                  duration={700}
                  fade
                  startDelay={visible ? 100 : DEFERRED}
                  restartKey={visible ? restartKey : 0}
                  className="cursor-pointer rounded-lg bg-accent px-5 py-2.5 text-base font-semibold text-accent-text"
                />
              </div>
            )}
          </ScrollRevealItem>
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}
