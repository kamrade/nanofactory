"use client";

import { useState } from "react";

import { TypewriterText } from "@/components/ui/typewriter-text";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISlider } from "@/components/ui/slider";
import { UISwitcher } from "@/components/ui/switcher";
import { UITextInput } from "@/components/ui/text-input";

import { useVisibleOnce } from "@/hooks/use-visible-once";
import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "../uikit-sections/types";

const DEFERRED_DELAY = 10_000_000;

type ScrollItemProps = {
  label: string;
  text: string;
  typingSpeed?: number;
  startDelay?: number;
  className?: string;
};

function ScrollItem({ label, text, typingSpeed = 60, startDelay = 0, className }: ScrollItemProps) {
  const { ref, visible } = useVisibleOnce();

  return (
    <div ref={ref} className="flex flex-col gap-2 rounded-xl border border-line bg-surface-alt px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      <p className={className}>
        <TypewriterText
          text={text}
          typingSpeed={typingSpeed}
          deletingSpeed={40}
          startDelay={visible ? startDelay : DEFERRED_DELAY}
          restartKey={visible ? 1 : 0}
          loop={false}
          showCursor
        />
      </p>
    </div>
  );
}

export function TypewriterSection({ uiSize }: { uiSize: UiSize }) {
  const [mode, setMode] = useState<"single" | "multi">("single");
  const [singleText, setSingleText] = useState("Hello, World!");
  const [multiTexts, setMultiTexts] = useState(["Hello, World!", "Type your story.", "Nanofactory."]);
  const [typingSpeed, setTypingSpeed] = useState(60);
  const [deletingSpeed, setDeletingSpeed] = useState(40);
  const [pauseBeforeDelete, setPauseBeforeDelete] = useState(1500);
  const [pauseBeforeNext, setPauseBeforeNext] = useState(500);
  const [startDelay, setStartDelay] = useState(0);
  const [loop, setLoop] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [cursorCharacter, setCursorCharacter] = useState("|");
  const [cursorBlinkSpeed, setCursorBlinkSpeed] = useState(530);
  const [preserveWhitespace, setPreserveWhitespace] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  function updateMultiText(index: number, value: string) {
    setMultiTexts((prev) => prev.map((t, i) => (i === index ? value : t)));
  }

  function addMultiText() {
    setMultiTexts((prev) => [...prev, ""]);
  }

  function removeMultiText(index: number) {
    setMultiTexts((prev) => prev.filter((_, i) => i !== index));
  }

  const sharedProps = {
    typingSpeed,
    deletingSpeed,
    pauseBeforeDelete,
    pauseBeforeNext,
    startDelay,
    loop,
    showCursor,
    cursorCharacter,
    cursorBlinkSpeed,
    preserveWhitespace,
    restartKey,
  };

  return (
    <>
    <UikitSectionAnchor id="typewriter">
      <UICard title="UIKit · TypewriterText">
        <div className="flex min-h-[72px] items-center rounded-xl border border-line bg-surface-alt px-5 py-4">
          <p className="text-h2 font-semibold text-text-main">
            {mode === "single" ? (
              <TypewriterText text={singleText} {...sharedProps} />
            ) : (
              <TypewriterText texts={multiTexts.filter(Boolean)} {...sharedProps} />
            )}
          </p>
        </div>

        <div className="mt-5 grid">
          <UIFormRow label="Mode" borderless>
            <UISegmentedControl
              ariaLabel="Typewriter text mode"
              borderless
              size="sm"
              value={mode}
              onValueChange={setMode}
              options={[
                { value: "single", label: "Single text" },
                { value: "multi", label: "Multi text" },
              ]}
            />
          </UIFormRow>

          {mode === "single" ? (
            <UIFormRow label="Text" htmlFor="tw-text" borderless>
              <UITextInput
                id="tw-text"
                size="sm"
                borderless
                value={singleText}
                onValueChange={setSingleText}
                placeholder="Your text here"
              />
            </UIFormRow>
          ) : (
            <>
              {multiTexts.map((t, i) => (
                <UIFormRow key={i} label={`Text ${i + 1}`} htmlFor={`tw-text-${i}`} borderless>
                  <div className="flex items-center gap-2">
                    <UITextInput
                      id={`tw-text-${i}`}
                      size="sm"
                      borderless
                      value={t}
                      onValueChange={(v) => updateMultiText(i, v)}
                      placeholder={`Text ${i + 1}`}
                    />
                    {multiTexts.length > 1 && (
                      <UIButton
                        type="button"
                        size="sm"
                        theme="danger"
                        variant="text"
                        onClick={() => removeMultiText(i)}
                      >
                        Remove
                      </UIButton>
                    )}
                  </div>
                </UIFormRow>
              ))}
              {multiTexts.length < 6 && (
                <UIFormRow label="" borderless>
                  <UIButton
                    type="button"
                    size="sm"
                    theme="base"
                    variant="outlined"
                    onClick={addMultiText}
                  >
                    Add text
                  </UIButton>
                </UIFormRow>
              )}
            </>
          )}

          <UIFormRow label="Typing speed (ms / char)" borderless>
            <UISlider
              ariaLabel="Typing speed"
              min={0}
              max={1000}
              step={1}
              value={typingSpeed}
              onValueChange={setTypingSpeed}
              showValue
            />
          </UIFormRow>

          <UIFormRow label="Deleting speed (ms / char)" borderless>
            <UISlider
              ariaLabel="Deleting speed"
              min={0}
              max={1000}
              step={1}
              value={deletingSpeed}
              onValueChange={setDeletingSpeed}
              showValue
            />
          </UIFormRow>

          <UIFormRow label="Pause before delete (ms)" borderless>
            <UISlider
              ariaLabel="Pause before delete"
              min={0}
              max={10000}
              step={10}
              value={pauseBeforeDelete}
              onValueChange={setPauseBeforeDelete}
              showValue
            />
          </UIFormRow>

          <UIFormRow label="Pause before next (ms)" borderless>
            <UISlider
              ariaLabel="Pause before next"
              min={0}
              max={10000}
              step={10}
              value={pauseBeforeNext}
              onValueChange={setPauseBeforeNext}
              showValue
            />
          </UIFormRow>

          <UIFormRow label="Start delay (ms)" borderless>
            <UISlider
              ariaLabel="Start delay"
              min={0}
              max={10000}
              step={10}
              value={startDelay}
              onValueChange={setStartDelay}
              showValue
            />
          </UIFormRow>

          <UIFormRow label="Loop" borderless>
            <UISwitcher size="sm" checked={loop} onCheckedChange={setLoop} label="Loop animation" />
          </UIFormRow>

          <UIFormRow label="Show cursor" borderless>
            <UISwitcher size="sm" checked={showCursor} onCheckedChange={setShowCursor} label="Show cursor" />
          </UIFormRow>

          {showCursor && (
            <>
              <UIFormRow label="Cursor character" htmlFor="tw-cursor-char" borderless>
                <UITextInput
                  id="tw-cursor-char"
                  size="sm"
                  borderless
                  value={cursorCharacter}
                  onValueChange={setCursorCharacter}
                  placeholder="|"
                />
              </UIFormRow>
              <UIFormRow label="Cursor blink speed (ms)" borderless>
                <UISlider
                  ariaLabel="Cursor blink speed"
                  min={100}
                  max={1000}
                  step={10}
                  value={cursorBlinkSpeed}
                  onValueChange={setCursorBlinkSpeed}
                  showValue
                />
              </UIFormRow>
            </>
          )}

          <UIFormRow label="Preserve whitespace" borderless>
            <UISwitcher
              size="sm"
              checked={preserveWhitespace}
              onCheckedChange={setPreserveWhitespace}
              label="Preserve whitespace"
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

    <UikitSectionAnchor id="typewriter-scroll">
      <UICard title="UIKit · TypewriterText / Scroll Trigger">
        <p className="text-sm text-text-muted">
          Each text starts typing once its block enters the viewport. Animation plays once and stops.
        </p>
        <div className="mt-5 grid gap-4">
          <ScrollItem
            label="Heading"
            text="Build with purpose."
            typingSpeed={70}
            className="text-h2 font-bold text-text-main"
          />
          <ScrollItem
            label="Tagline"
            text="Ship fast. Stay clean. Never compromise."
            typingSpeed={45}
            startDelay={200}
            className="text-h3 text-text-main"
          />
          <ScrollItem
            label="Body"
            text="TypewriterText animates character by character, respects reduced motion, and stays accessible with a proper aria-label."
            typingSpeed={25}
            startDelay={400}
            className="text-base text-text-main"
          />
          <ScrollItem
            label="Monospace"
            text='const greet = (name: string) => `Hello, ${name}!`;'
            typingSpeed={40}
            startDelay={600}
            className="font-mono text-sm text-text-main"
          />
        </div>
      </UICard>
    </UikitSectionAnchor>
    </>
  );
}
