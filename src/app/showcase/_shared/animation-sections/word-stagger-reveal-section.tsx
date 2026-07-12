"use client";

import { useState } from "react";

import { WordStaggerReveal } from "@/components/ui/word-stagger-reveal";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISlider } from "@/components/ui/slider";
import { UISwitcher } from "@/components/ui/switcher";
import { UITextInput } from "@/components/ui/text-input";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "../uikit-sections/types";

type Direction = "up" | "down" | "left" | "right";

export function WordStaggerRevealSection({ uiSize }: { uiSize: UiSize }) {
  const [text, setText] = useState("Build pages that read clearly.");
  const [direction, setDirection] = useState<Direction>("up");
  const [offset, setOffset] = useState(18);
  const [duration, setDuration] = useState(700);
  const [stagger, setStagger] = useState(90);
  const [startDelay, setStartDelay] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [fade, setFade] = useState(true);
  const [blur, setBlur] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  return (
    <>
      <UikitSectionAnchor id="word-stagger-reveal">
        <UICard title="UIKit · WordStaggerReveal">
          <div className="flex items-center justify-center rounded-xl border border-line bg-surface-alt px-3 py-6">
            <p className="text-3xl font-bold text-text-main">
              <WordStaggerReveal
                text={text || "Build pages that read clearly."}
                direction={direction}
                offset={`${offset}px`}
                duration={duration}
                stagger={stagger}
                startDelay={startDelay}
                reverse={reverse}
                fade={fade}
                blur={blur}
                disabled={disabled}
                restartKey={restartKey}
              />
            </p>
          </div>

          <div className="mt-5 grid">
            <UIFormRow label="Text" htmlFor="wsr-text" borderless>
              <UITextInput
                id="wsr-text"
                size="sm"
                borderless
                value={text}
                onValueChange={setText}
                placeholder="Build pages that read clearly."
              />
            </UIFormRow>

            <UIFormRow label="Direction" borderless>
              <UISegmentedControl
                ariaLabel="Word stagger direction"
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
                max={10000}
                step={10}
                value={duration}
                onValueChange={setDuration}
                showValue
              />
            </UIFormRow>

            <UIFormRow label="Stagger (ms)" borderless>
              <UISlider
                ariaLabel="Stagger"
                min={0}
                max={1000}
                step={1}
                value={stagger}
                onValueChange={setStagger}
                showValue
              />
            </UIFormRow>

            <UIFormRow label="Start delay (ms)" borderless>
              <UISlider
                ariaLabel="Start delay"
                min={0}
                max={1000}
                step={1}
                value={startDelay}
                onValueChange={setStartDelay}
                showValue
              />
            </UIFormRow>

            <UIFormRow label="Reverse order" borderless>
              <UISwitcher
                size="sm"
                checked={reverse}
                onCheckedChange={setReverse}
                label="Animate last word first"
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
    </>
  );
}
