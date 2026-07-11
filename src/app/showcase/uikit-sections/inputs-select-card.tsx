"use client";

import { useMemo, useState } from "react";

import { UICard } from "@/components/ui/card";
import { UISelect } from "@/components/ui/select";

import type { UiSize } from "./types";

export function InputsSelectCard({ uiSize }: { uiSize: UiSize }) {
  const [selectValue, setSelectValue] = useState("react");
  const [selectSearchValue, setSelectSearchValue] = useState("typescript");
  const [selectLongValue, setSelectLongValue] = useState("item-18");

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
    <UICard title="UIKit · Select">
      <div className="grid gap-4">
        <div className="max-w-xl">
          <UISelect
            size={uiSize}
            value={selectValue}
            onValueChange={setSelectValue}
            placeholder="Pick framework"
            options={[
              { value: "react", label: "React", textValue: "react" },
              { value: "nextjs", label: "Next.js", textValue: "next js" },
              { value: "svelte", label: "Svelte", textValue: "svelte" },
              { value: "vue", label: "Vue", textValue: "vue" },
              { value: "solid", label: "Solid", textValue: "solid", disabled: true },
            ]}
          />
        </div>

        <div className="max-w-xl">
          <UISelect
            size={uiSize}
            defaultValue="nextjs"
            placeholder="Borderless select"
            borderless
            options={[
              { value: "react", label: "React", textValue: "react" },
              { value: "nextjs", label: "Next.js", textValue: "next js" },
              { value: "svelte", label: "Svelte", textValue: "svelte" },
            ]}
          />
        </div>

        <div className="max-w-xl">
          <UISelect
            size={uiSize}
            value={selectSearchValue}
            onValueChange={setSelectSearchValue}
            placeholder="Search and select language"
            searchable
            clearable
            searchPlaceholder="Find language..."
            options={[
              { value: "typescript", label: "TypeScript", textValue: "typescript" },
              { value: "javascript", label: "JavaScript", textValue: "javascript" },
              { value: "go", label: "Go", textValue: "golang go" },
              { value: "rust", label: "Rust", textValue: "rust" },
              { value: "python", label: "Python", textValue: "python" },
            ]}
          />
        </div>

        <div className="max-w-xl">
          <UISelect
            size={uiSize}
            placeholder="Invalid state"
            invalid
            validationState="error"
            options={[
              { value: "one", label: "Option one" },
              { value: "two", label: "Option two" },
            ]}
          />
        </div>

        <div className="max-w-xl">
          <UISelect
            size={uiSize}
            value={selectLongValue}
            onValueChange={setSelectLongValue}
            placeholder="Long list example"
            searchable
            searchPlaceholder="Search 40 options..."
            options={longListOptions}
          />
        </div>

        <p className="text-sm text-text-muted">
          Selected: {selectValue} · Search select: {selectSearchValue} · Long list: {selectLongValue}
        </p>
      </div>
    </UICard>
  );
}
