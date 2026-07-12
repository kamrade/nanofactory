"use client";

import { useState } from "react";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIFormRow } from "@/components/ui/form-row";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UISlider } from "@/components/ui/slider";
import { UIImageZoomReveal } from "@/components/ui/image-zoom-reveal";

import { UikitSectionAnchor } from "./section-anchor";

type ObjectFit = "cover" | "contain" | "scale-down";

export function ImageZoomRevealSection() {
  const [duration, setDuration] = useState(5600);
  const [startDelay, setStartDelay] = useState(0);
  const [startScale, setStartScale] = useState(1);
  const [endScale, setEndScale] = useState(1);
  const [radius, setRadius] = useState(32);
  const [fit, setFit] = useState<ObjectFit>("cover");
  const [restartKey, setRestartKey] = useState(0);

  return (
    <UikitSectionAnchor id="image-zoom-reveal">
      <UICard title="UIKit · Image Zoom Reveal">
        <p className="text-sm text-text-muted">
          The frame stays fixed while the image gently zooms in and then back out.
        </p>

        <div className="mt-5 overflow-hidden rounded-3xl border border-line bg-surface-alt p-4">
          <UIImageZoomReveal
            key={restartKey}
            src="/showcase/example-image.avif"
            alt="Abstract hero demo image"
            fill
            unoptimized
            restartKey={restartKey}
            duration={duration}
            startDelay={startDelay}
            startScale={startScale}
            endScale={endScale}
            radius={`${radius}px`}
            fit={fit}
            wrapperClassName="aspect-[16/9] w-full"
          />
        </div>

        <div className="mt-5 grid">
          <UIFormRow label="Object fit" borderless>
            <UISegmentedControl
              ariaLabel="Object fit"
              size="sm"
              borderless
              value={fit}
              onValueChange={(value) => setFit(value as ObjectFit)}
              options={[
                { value: "cover", label: "Cover" },
                { value: "contain", label: "Contain" },
                { value: "scale-down", label: "Scale down" },
              ]}
            />
          </UIFormRow>

          <UIFormRow label="Start scale" borderless>
            <UISlider
              ariaLabel="Start scale"
              min={1}
              max={1.2}
              step={0.01}
              value={startScale}
              onValueChange={setStartScale}
              showValue
              valueFormatter={(value) => value.toFixed(2)}
            />
          </UIFormRow>

          <UIFormRow label="End scale" borderless>
            <UISlider
              ariaLabel="End scale"
              min={0.8}
              max={1.2}
              step={0.01}
              value={endScale}
              onValueChange={setEndScale}
              showValue
              valueFormatter={(value) => value.toFixed(2)}
            />
          </UIFormRow>

          <UIFormRow label="Duration (ms)" borderless>
            <UISlider
              ariaLabel="Duration"
              min={1000}
              max={10000}
              step={50}
              value={duration}
              onValueChange={setDuration}
              showValue
            />
          </UIFormRow>

          <UIFormRow label="Start delay (ms)" borderless>
            <UISlider
              ariaLabel="Start delay"
              min={0}
              max={3000}
              step={50}
              value={startDelay}
              onValueChange={setStartDelay}
              showValue
            />
          </UIFormRow>

          <UIFormRow label="Border radius" borderless>
            <UISlider
              ariaLabel="Border radius"
              min={0}
              max={48}
              step={1}
              value={radius}
              onValueChange={setRadius}
              showValue
              valueFormatter={(value) => `${value}px`}
            />
          </UIFormRow>
        </div>

        <div className="mt-4">
          <UIButton
            type="button"
            size="sm"
            theme="base"
            variant="outlined"
            onClick={() => setRestartKey((key) => key + 1)}
          >
            Restart
          </UIButton>
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}
