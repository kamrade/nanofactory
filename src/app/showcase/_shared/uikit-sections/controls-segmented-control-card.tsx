"use client";

import { useState } from "react";

import { UICard } from "@/components/ui/card";
import { UISegmentedControl } from "@/components/ui/segmented-control";

import type { UiSize } from "./types";

export function ControlsSegmentedControlCard({
  uiSize,
  borderRadius = "lg",
}: {
  uiSize: UiSize;
  borderRadius?: "none" | "md" | "lg";
}) {
  const [segmentedValue, setSegmentedValue] = useState<"light" | "dark">("light");

  return (
    <UICard title="Segmented Control">
      <div className="grid gap-4">
        <p className="text-sm text-text-muted">
          Size follows the shared showcase setting. Border radius follows the shared showcase setting.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <UISegmentedControl
            ariaLabel="Mode"
            size={uiSize}
            borderRadius={borderRadius}
            value={segmentedValue}
            onValueChange={setSegmentedValue}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          />
        </div>
        <p className="text-sm text-text-muted">Selected: {segmentedValue}</p>
      </div>
    </UICard>
  );
}
