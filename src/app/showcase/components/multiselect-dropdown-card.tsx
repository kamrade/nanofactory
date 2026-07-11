"use client";

import { useMemo, useState } from "react";

import { UICard } from "@/components/ui/card";
import { UIMultiSelect } from "@/components/ui/multi-select";

import type { UiSize } from "../uikit-sections";

export function MultiSelectDropdownCard({ uiSize }: { uiSize: UiSize }) {
  const [value, setValue] = useState<string[]>(["nextjs"]);
  const [borderlessValue, setBorderlessValue] = useState<string[]>(["react"]);

  const longListOptions = useMemo(
    () =>
      Array.from({ length: 40 }, (_, index) => {
        const id = index + 1;
        return {
          value: `item-${id}`,
          label: `Long list item ${id}`,
          textValue: `long list item ${id}`,
        };
      }),
    []
  );

  return (
    <UICard title="MultiSelect (Dropdown)">
      <div className="grid gap-4">
        <div className="max-w-xl">
          <UIMultiSelect
            ariaLabel="Frameworks and tools dropdown"
            searchable
            clearable
            searchPlaceholder="Search options..."
            size={uiSize}
            value={value}
            onValueChange={setValue}
            options={[
              { value: "react", label: "React" },
              { value: "nextjs", label: "Next.js", textValue: "next js" },
              { value: "typescript", label: "TypeScript" },
              { value: "tailwind", label: "Tailwind CSS" },
              { value: "drizzle", label: "Drizzle ORM", disabled: true },
            ]}
          />
        </div>

        <div className="max-w-xl">
          <UIMultiSelect
            ariaLabel="Borderless frameworks and tools dropdown"
            searchable
            clearable
            searchPlaceholder="Search options..."
            size={uiSize}
            borderless
            value={borderlessValue}
            onValueChange={setBorderlessValue}
            options={[
              { value: "react", label: "React" },
              { value: "nextjs", label: "Next.js", textValue: "next js" },
              { value: "typescript", label: "TypeScript" },
              { value: "tailwind", label: "Tailwind CSS" },
              { value: "drizzle", label: "Drizzle ORM", disabled: true },
            ]}
          />
        </div>

        <div className="max-w-xl">
          <UIMultiSelect
            ariaLabel="Long list multi select"
            searchable
            clearable
            searchPlaceholder="Search 40 options..."
            size={uiSize}
            options={longListOptions}
          />
        </div>

        <p className="text-sm text-text-muted">Selected: {value.length > 0 ? value.join(", ") : "none"}</p>
      </div>
    </UICard>
  );
}
