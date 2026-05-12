"use client";

import { useMemo, useState } from "react";
import { FiEdit2, FiSearch } from "react-icons/fi";

import { UIAutocomplete } from "@/components/ui/autocomplete";
import { UICard } from "@/components/ui/card";
import { UIMultiSelect } from "@/components/ui/multi-select";
import { UIMultiSelectList } from "@/components/ui/multi-select-list";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";

import type { UiSize } from "./types";

export function InputsSection({ uiSize }: { uiSize: UiSize }) {
  const [searchValue, setSearchValue] = useState("");
  const [emailValue, setEmailValue] = useState("john@");
  const [passwordValue, setPasswordValue] = useState("");
  const [selectValue, setSelectValue] = useState("react");
  const [selectSearchValue, setSelectSearchValue] = useState("typescript");
  const [selectLongValue, setSelectLongValue] = useState("item-18");
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSelection, setAutocompleteSelection] = useState("none");
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(["react", "typescript"]);
  const [multiSelectDropdownValue, setMultiSelectDropdownValue] = useState<string[]>(["nextjs"]);
  const [keyboardEventLog, setKeyboardEventLog] = useState("none");

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
    <>
      <UICard title="UIKit · Text Input">
        <div className="grid gap-4">
          <div className="max-w-xl">
            <UITextInput
              size={uiSize}
              type="search"
              placeholder="Search components..."
              value={searchValue}
              onValueChange={setSearchValue}
              clearable
              onEnterPress={(value) => setKeyboardEventLog(`enter:${value}`)}
              onEscapePress={(value) => setKeyboardEventLog(`escape:${value}`)}
              prefix={<FiSearch aria-hidden className="h-4 w-4" />}
            />
          </div>

          <div className="max-w-xl">
            <UITextInput
              size={uiSize}
              type="email"
              value={emailValue}
              onValueChange={setEmailValue}
              invalid
              validationState="error"
              placeholder="Email"
              suffix={<FiEdit2 aria-hidden className="h-4 w-4" />}
              autoComplete="email"
              inputMode="email"
            />
          </div>

          <div className="max-w-xl">
            <UITextInput
              size={uiSize}
              type="password"
              value={passwordValue}
              onValueChange={setPasswordValue}
              placeholder="Password"
              showPasswordToggle
              clearable
              autoComplete="current-password"
            />
          </div>

          <div className="grid max-w-xl gap-3">
            <UITextInput size={uiSize} value="Loading state" readOnly loading />
            <UITextInput size={uiSize} value="Read-only state" readOnly />
            <UITextInput size={uiSize} value="Disabled state" disabled />
          </div>

          <p className="text-sm text-text-muted">Keyboard event: {keyboardEventLog}</p>
        </div>
      </UICard>

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

          <p className="text-sm text-text-muted">Selected: {selectValue} · Search select: {selectSearchValue} · Long list: {selectLongValue}</p>
        </div>
      </UICard>

      <UICard title="UIKit · MultiSelect List">
        <div className="grid gap-4">
          <div className="max-w-xl">
            <UIMultiSelectList
              ariaLabel="Frameworks and tools"
              searchable
              searchPlaceholder="Search options..."
              size={uiSize}
              value={multiSelectValue}
              onValueChange={setMultiSelectValue}
              options={[
                { value: "react", label: "React" },
                { value: "nextjs", label: "Next.js", textValue: "next js" },
                { value: "typescript", label: "TypeScript" },
                { value: "tailwind", label: "Tailwind CSS" },
                { value: "drizzle", label: "Drizzle ORM", disabled: true },
              ]}
            />
          </div>

          <p className="text-sm text-text-muted">Selected: {multiSelectValue.length > 0 ? multiSelectValue.join(", ") : "none"}</p>
        </div>
      </UICard>

      <UICard title="UIKit · MultiSelect (Dropdown)">
        <div className="grid gap-4">
          <div className="max-w-xl">
            <UIMultiSelect
              ariaLabel="Frameworks and tools dropdown"
              searchable
              clearable
              searchPlaceholder="Search options..."
              size={uiSize}
              value={multiSelectDropdownValue}
              onValueChange={setMultiSelectDropdownValue}
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

          <p className="text-sm text-text-muted">Selected: {multiSelectDropdownValue.length > 0 ? multiSelectDropdownValue.join(", ") : "none"}</p>
        </div>
      </UICard>

      <UICard title="UIKit · Autocomplete">
        <div className="grid gap-4">
          <div className="max-w-xl">
            <UIAutocomplete
              ariaLabel="Framework autocomplete"
              size={uiSize}
              value={autocompleteValue}
              onValueChange={setAutocompleteValue}
              onSelect={(item) => setAutocompleteSelection(item.value)}
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

          <p className="text-sm text-text-muted">Input: {autocompleteValue || "empty"} · Last selected: {autocompleteSelection}</p>
        </div>
      </UICard>
    </>
  );
}
