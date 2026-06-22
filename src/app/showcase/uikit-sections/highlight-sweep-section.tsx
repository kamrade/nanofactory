"use client";

import { useState } from "react";

import { HighlightSweepText } from "@/components/ui/highlight-sweep-text";
import { useVisibleOnce } from "@/hooks/use-visible-once";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISwitcher } from "@/components/ui/switcher";
import { UITextInput } from "@/components/ui/text-input";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "./types";

function HoverHighlight({
  text,
  color = "#FFE566",
  duration = 500,
  thickness = "0.6em",
  offsetY = "0.1em",
  rounded = true,
  className,
}: {
  text: string;
  color?: string;
  duration?: number;
  thickness?: string;
  offsetY?: string;
  rounded?: boolean;
  className?: string;
}) {
  const [phase, setPhase] = useState<"in" | "out">("out");

  return (
    <span
      className={className}
      style={{ position: "relative", display: "inline-block", isolation: "isolate", cursor: "default" }}
      onMouseEnter={() => setPhase("in")}
      onMouseLeave={() => setPhase("out")}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "auto",
          bottom: `calc(-1 * ${offsetY})`,
          height: thickness,
          borderRadius: rounded ? "0.15em" : 0,
          pointerEvents: "none",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <span
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            background: color,
            transform: `scaleX(${phase === "in" ? 1 : 0})`,
            transformOrigin: phase === "in" ? "left center" : "right center",
            transition: `transform ${duration}ms cubic-bezier(0.7, 0, 0.3, 1)`,
            willChange: "transform",
          }}
        />
      </span>
      <span style={{ position: "relative", zIndex: 1 }}>{text}</span>
    </span>
  );
}

const PRESET_COLORS = [
  { value: "#FFE566", label: "Yellow" },
  { value: "#6EE7B7", label: "Mint" },
  { value: "#93C5FD", label: "Blue" },
  { value: "#F9A8D4", label: "Pink" },
  { value: "#FDB672", label: "Orange" },
  { value: "currentColor", label: "Current" },
];

type ScrollSweepItemProps = {
  label: string;
  children: (visible: boolean) => React.ReactNode;
};

function ScrollSweepItem({ label, children }: ScrollSweepItemProps) {
  const { ref, visible } = useVisibleOnce();
  return (
    <div ref={ref} className="flex flex-col gap-2 rounded-xl border border-line bg-surface-alt px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
      {children(visible)}
    </div>
  );
}

export function HighlightSweepSection({ uiSize }: { uiSize: UiSize }) {
  const [text, setText] = useState("Ship it.");
  const [color, setColor] = useState("#FFE566");
  const [customColor, setCustomColor] = useState("");
  const [duration, setDuration] = useState(700);
  const [startDelay, setStartDelay] = useState(0);
  const [direction, setDirection] = useState<"left-to-right" | "right-to-left">("left-to-right");
  const [thickness, setThickness] = useState("0.6em");
  const [offsetY, setOffsetY] = useState("0.1em");
  const [rounded, setRounded] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  const resolvedColor = customColor.trim() || color;

  return (
    <>
      <UikitSectionAnchor id="highlight-sweep">
        <UICard title="UIKit · HighlightSweepText">
          <div className="flex min-h-[96px] items-center justify-center rounded-xl border border-line bg-surface-alt px-5 py-6">
            <p className="text-h2 font-bold text-text-main">
              <HighlightSweepText
                text={text || "Ship it."}
                color={resolvedColor}
                duration={duration}
                startDelay={startDelay}
                direction={direction}
                thickness={thickness}
                offsetY={offsetY}
                rounded={rounded}
                disabled={disabled}
                restartKey={restartKey}
              />
            </p>
          </div>

          <div className="mt-5 grid">
            <UIFormRow label="Text" htmlFor="hst-text" borderless>
              <UITextInput
                id="hst-text"
                size="sm"
                borderless
                value={text}
                onValueChange={setText}
                placeholder="Ship it."
              />
            </UIFormRow>

            <UIFormRow label="Color preset" borderless>
              <UISegmentedControl
                ariaLabel="Highlight color preset"
                size="sm"
                borderless
                value={color}
                onValueChange={setColor}
                options={PRESET_COLORS.map((c) => ({ value: c.value, label: c.label }))}
              />
            </UIFormRow>

            <UIFormRow label="Custom color" htmlFor="hst-custom-color" borderless>
              <UITextInput
                id="hst-custom-color"
                size="sm"
                borderless
                value={customColor}
                onValueChange={setCustomColor}
                placeholder="#FFE566 or rgba(…) — overrides preset"
              />
            </UIFormRow>

            <UIFormRow label="Duration (ms)" htmlFor="hst-duration" borderless>
              <UITextInput
                id="hst-duration"
                size="sm"
                borderless
                type="number"
                value={String(duration)}
                onValueChange={(v) => setDuration(Math.max(50, Number(v) || 700))}
              />
            </UIFormRow>

            <UIFormRow label="Start delay (ms)" htmlFor="hst-start-delay" borderless>
              <UITextInput
                id="hst-start-delay"
                size="sm"
                borderless
                type="number"
                value={String(startDelay)}
                onValueChange={(v) => setStartDelay(Math.max(0, Number(v) || 0))}
              />
            </UIFormRow>

            <UIFormRow label="Direction" borderless>
              <UISegmentedControl
                ariaLabel="Sweep direction"
                size="sm"
                borderless
                value={direction}
                onValueChange={setDirection}
                options={[
                  { value: "left-to-right", label: "Left → Right" },
                  { value: "right-to-left", label: "Right ← Left" },
                ]}
              />
            </UIFormRow>

            <UIFormRow label="Thickness" htmlFor="hst-thickness" borderless>
              <UITextInput
                id="hst-thickness"
                size="sm"
                borderless
                value={thickness}
                onValueChange={setThickness}
                placeholder="0.6em"
              />
            </UIFormRow>

            <UIFormRow label="Offset Y" htmlFor="hst-offset-y" borderless>
              <UITextInput
                id="hst-offset-y"
                size="sm"
                borderless
                value={offsetY}
                onValueChange={setOffsetY}
                placeholder="0.1em"
              />
            </UIFormRow>

            <UIFormRow label="Rounded" borderless>
              <UISwitcher size="sm" checked={rounded} onCheckedChange={setRounded} label="Rounded bar" />
            </UIFormRow>

            <UIFormRow label="Disabled (instant)" borderless>
              <UISwitcher size="sm" checked={disabled} onCheckedChange={setDisabled} label="Skip animation" />
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

      <UikitSectionAnchor id="highlight-sweep-scroll">
        <UICard title="UIKit · HighlightSweepText / Scroll Trigger">
          <p className="text-sm text-text-muted">
            Each highlight animates once when its block enters the viewport.
          </p>
          <div className="mt-5 grid gap-4">
            <ScrollSweepItem label="Single word highlight">
              {(visible) => (
                <p className="text-h2 font-bold text-text-main">
                  Build pages that{" "}
                  <HighlightSweepText
                    text="ship."
                    color="#FFE566"
                    duration={600}
                    startDelay={visible ? 200 : 10_000_000}
                    restartKey={visible ? 1 : 0}
                  />
                </p>
              )}
            </ScrollSweepItem>

            <ScrollSweepItem label="Staggered multi-word">
              {(visible) => (
                <p className="text-h2 font-bold text-text-main">
                  <HighlightSweepText
                    text="Fast."
                    color="#6EE7B7"
                    duration={500}
                    startDelay={visible ? 0 : 10_000_000}
                    restartKey={visible ? 1 : 0}
                  />
                  {"  "}
                  <HighlightSweepText
                    text="Clean."
                    color="#93C5FD"
                    duration={500}
                    startDelay={visible ? 350 : 10_000_000}
                    restartKey={visible ? 1 : 0}
                  />
                  {"  "}
                  <HighlightSweepText
                    text="Ready."
                    color="#F9A8D4"
                    duration={500}
                    startDelay={visible ? 700 : 10_000_000}
                    restartKey={visible ? 1 : 0}
                  />
                </p>
              )}
            </ScrollSweepItem>

            <ScrollSweepItem label="Inline emphasis">
              {(visible) => (
                <p className="text-h3 text-text-main">
                  Write the message, pick the layout,{" "}
                  <HighlightSweepText
                    text="publish in minutes"
                    color="#FDB672"
                    duration={800}
                    thickness="0.45em"
                    startDelay={visible ? 300 : 10_000_000}
                    restartKey={visible ? 1 : 0}
                  />
                  {" "}— no build pipeline needed.
                </p>
              )}
            </ScrollSweepItem>

            <ScrollSweepItem label="Right-to-left direction">
              {(visible) => (
                <p className="text-h2 font-bold text-text-main">
                  <HighlightSweepText
                    text="Ship backwards."
                    color="#93C5FD"
                    direction="right-to-left"
                    duration={700}
                    startDelay={visible ? 200 : 10_000_000}
                    restartKey={visible ? 1 : 0}
                  />
                </p>
              )}
            </ScrollSweepItem>
          </div>
        </UICard>
      </UikitSectionAnchor>
      <UikitSectionAnchor id="highlight-sweep-hover">
        <UICard title="UIKit · HighlightSweepText / Hover Trigger">
          <p className="text-sm text-text-muted">
            Hover over any item — the sweep replays each time you enter.
          </p>

          <div className="mt-5 grid gap-6">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Navigation</p>
              <nav className="flex flex-wrap gap-6">
                {["Features", "Pricing", "Docs", "Blog", "Contact"].map((item) => (
                  <span key={item} className="text-base font-medium text-text-main">
                    <HoverHighlight text={item} color="#FFE566" duration={400} thickness="0.55em" />
                  </span>
                ))}
              </nav>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">Inline emphasis</p>
              <p className="text-h3 leading-snug text-text-main">
                We help teams build{" "}
                <HoverHighlight text="faster" color="#6EE7B7" duration={500} />,{" "}
                stay{" "}
                <HoverHighlight text="focused" color="#93C5FD" duration={500} />,{" "}
                and ship{" "}
                <HoverHighlight text="confidently" color="#F9A8D4" duration={600} />.
              </p>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-text-muted">CTA links</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Start building for free", color: "#FFE566" },
                  { label: "See how it works", color: "#6EE7B7" },
                  { label: "Read the docs", color: "#93C5FD" },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-2 text-lg font-semibold text-text-main">
                    <HoverHighlight
                      text={item.label}
                      color={item.color}
                      duration={550}
                      thickness="0.5em"
                      offsetY="0.05em"
                    />
                    <span className="text-text-muted">→</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </UICard>
      </UikitSectionAnchor>
    </>
  );
}
