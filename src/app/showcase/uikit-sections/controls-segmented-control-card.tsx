"use client";

import { useState } from "react";

import { UICard } from "@/components/ui/card";
import { UISegmentedControl } from "@/components/ui/segmented-control";

import type { UiSize } from "./types";

export function ControlsSegmentedControlCard({ uiSize }: { uiSize: UiSize }) {
  const [segmentedValue, setSegmentedValue] = useState<"light" | "dark">("light");

  return (
    <UICard title="Segmented Control">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <p className="w-10 text-sm text-text-muted">sm</p>
          <UISegmentedControl
            ariaLabel="Mode small"
            size="sm"
            value={segmentedValue}
            onValueChange={setSegmentedValue}
            options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <p className="w-10 text-sm text-text-muted">lg</p>
          <UISegmentedControl
            ariaLabel="Mode large"
            size="lg"
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
