"use client";

import { useState } from "react";

import { UICard } from "@/components/ui/card";
import { UISwitcher } from "@/components/ui/switcher";
import type { UiSize } from "@/app/showcase/_shared/uikit-sections";

export function ControlsSwitcherCard({ uiSize }: { uiSize: UiSize }) {
  const [switcherEnabled, setSwitcherEnabled] = useState(true);

  return (
    <UICard title="Switcher">
      <p className="text-sm text-text-muted">Size: {uiSize}</p>
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-6">
          <UISwitcher size={uiSize} checked={switcherEnabled} onCheckedChange={setSwitcherEnabled} label="Enabled" />
          <UISwitcher size={uiSize} checked disabled label="Disabled" />
        </div>
      </div>
    </UICard>
  );
}
