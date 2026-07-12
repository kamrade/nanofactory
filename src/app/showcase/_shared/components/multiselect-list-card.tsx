"use client";

import { useState } from "react";

import { UICard } from "@/components/ui/card";
import { UIMultiSelectList } from "@/components/ui/multi-select-list";

import type { UiSize } from "@/app/showcase/_shared/uikit-sections";

export function MultiSelectListCard({ uiSize }: { uiSize: UiSize }) {
  const [value, setValue] = useState<string[]>(["react", "typescript"]);

  return (
    <UICard title="MultiSelect List">
      <div className="grid gap-4">
        <div className="max-w-xl">
          <UIMultiSelectList
            ariaLabel="Frameworks and tools"
            searchable
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

        <p className="text-sm text-text-muted">Selected: {value.length > 0 ? value.join(", ") : "none"}</p>
      </div>
    </UICard>
  );
}
