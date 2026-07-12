"use client";

import { UICard } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";

export function ControlsCheckboxCard({
  uiSize,
  borderRadius,
}: {
  uiSize: "sm" | "md" | "lg";
  borderRadius: "none" | "md" | "lg";
}) {
  return (
    <UICard title="Checkbox">
      <div className="flex flex-wrap items-center gap-6">
        <UICheckbox size={uiSize} defaultChecked label="Default checkbox" borderRadius={borderRadius} />
        <UICheckbox size={uiSize} label="Unchecked checkbox" borderRadius={borderRadius} />
        <UICheckbox size={uiSize} defaultChecked disabled label="Disabled" borderRadius={borderRadius} />
      </div>
    </UICard>
  );
}
