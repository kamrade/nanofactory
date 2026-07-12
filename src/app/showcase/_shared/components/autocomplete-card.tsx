"use client";

import { useState } from "react";

import { UICard } from "@/components/ui/card";
import { UIAutocomplete } from "@/components/ui/autocomplete";

import type { UiSize } from "@/app/showcase/_shared/uikit-sections";

export function AutocompleteCard({ uiSize }: { uiSize: UiSize }) {
  const [value, setValue] = useState("");
  const [selection, setSelection] = useState("none");
  const [borderlessValue, setBorderlessValue] = useState("");
  const [borderlessSelection, setBorderlessSelection] = useState("none");

  return (
    <UICard title="Autocomplete">
      <div className="grid gap-4">
        <div className="max-w-xl">
          <UIAutocomplete
            ariaLabel="Framework autocomplete"
            size={uiSize}
            value={value}
            onValueChange={setValue}
            onSelect={(item) => setSelection(item.value)}
            placeholder="Type to filter frameworks..."
            clearable
            items={[
              { value: "react", label: "React" },
              { value: "nextjs", label: "Next.js", textValue: "next js" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
              { value: "solid", label: "Solid", disabled: true },
            ]}
          />
        </div>

        <div className="max-w-xl">
          <UIAutocomplete
            ariaLabel="Borderless framework autocomplete"
            size={uiSize}
            borderless
            value={borderlessValue}
            onValueChange={setBorderlessValue}
            onSelect={(item) => setBorderlessSelection(item.value)}
            placeholder="Borderless autocomplete..."
            clearable
            items={[
              { value: "react", label: "React" },
              { value: "nextjs", label: "Next.js", textValue: "next js" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
              { value: "solid", label: "Solid", disabled: true },
            ]}
          />
        </div>

        <div className="max-w-xl">
          <UIAutocomplete
            ariaLabel="Autocomplete invalid"
            size={uiSize}
            placeholder="Invalid state"
            invalid
            validationState="error"
            items={[
              { value: "typescript", label: "TypeScript" },
              { value: "javascript", label: "JavaScript" },
            ]}
          />
        </div>

        <p className="text-sm text-text-muted">
          Input: {value || "empty"} · Last selected: {selection} · Borderless input: {borderlessValue || "empty"} · Borderless selected: {borderlessSelection}
        </p>
      </div>
    </UICard>
  );
}
