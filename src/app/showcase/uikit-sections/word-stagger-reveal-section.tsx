"use client";

import { useState } from "react";

import { WordStaggerReveal } from "@/components/ui/word-stagger-reveal";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISwitcher } from "@/components/ui/switcher";
import { UITextInput } from "@/components/ui/text-input";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "./types";

type Direction = "up" | "down" | "left" | "right";

export function WordStaggerRevealSection({ uiSize }: { uiSize: UiSize }) {
  const [text, setText] = useState("Build pages that read clearly.");
  const [direction, setDirection] = useState<Direction>("up");
  const [offset, setOffset] = useState("18px");
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
                offset={offset}
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

            <UIFormRow label="Offset" htmlFor="wsr-offset" borderless>
              <UITextInput
                id="wsr-offset"
                size="sm"
                borderless
                value={offset}
                onValueChange={setOffset}
                placeholder="18px"
              />
            </UIFormRow>

            <UIFormRow label="Duration (ms)" htmlFor="wsr-duration" borderless>
              <UITextInput
                id="wsr-duration"
                size="sm"
                borderless
                type="number"
                value={String(duration)}
                onValueChange={(v) => setDuration(Math.max(50, Number(v) || 700))}
              />
            </UIFormRow>

            <UIFormRow label="Stagger (ms)" htmlFor="wsr-stagger" borderless>
              <UITextInput
                id="wsr-stagger"
                size="sm"
                borderless
                type="number"
                value={String(stagger)}
                onValueChange={(v) => setStagger(Math.max(0, Number(v) || 90))}
              />
            </UIFormRow>

            <UIFormRow label="Start delay (ms)" htmlFor="wsr-start-delay" borderless>
              <UITextInput
                id="wsr-start-delay"
                size="sm"
                borderless
                type="number"
                value={String(startDelay)}
                onValueChange={(v) => setStartDelay(Math.max(0, Number(v) || 0))}
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
