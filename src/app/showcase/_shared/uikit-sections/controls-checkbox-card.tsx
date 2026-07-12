"use client";

import { UICard } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";

export function ControlsCheckboxCard() {
  return (
    <UICard title="Checkbox">
      <div className="flex flex-wrap items-center gap-6">
        <UICheckbox defaultChecked label="Default checkbox" />
        <UICheckbox label="Unchecked checkbox" />
        <UICheckbox defaultChecked disabled label="Disabled" />
      </div>
    </UICard>
  );
}
