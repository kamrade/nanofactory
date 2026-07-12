"use client";

import { useState } from "react";

import { UICard } from "@/components/ui/card";
import { UISwitcher } from "@/components/ui/switcher";

export function ControlsSwitcherCard() {
  const [switcherEnabled, setSwitcherEnabled] = useState(true);

  return (
    <UICard title="Switcher">
      <p className="text-sm text-text-muted">Single size</p>
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-6">
          <UISwitcher checked={switcherEnabled} onCheckedChange={setSwitcherEnabled} label="Enabled" />
          <UISwitcher checked disabled label="Disabled" />
        </div>
      </div>
    </UICard>
  );
}
