"use client";

import { useState } from "react";
import { FiEdit2, FiSearch } from "react-icons/fi";

import { UICard } from "@/components/ui/card";
import { UITextInput } from "@/components/ui/text-input";

import type { UiSize } from "./types";

type InputsTextInputCardProps = {
  uiSize: UiSize;
  borderRadius: "none" | "md" | "lg";
};

export function InputsTextInputCard({ uiSize, borderRadius }: InputsTextInputCardProps) {
  const [searchValue, setSearchValue] = useState("");
  const [emailValue, setEmailValue] = useState("john@");
  const [passwordValue, setPasswordValue] = useState("");
  const [keyboardEventLog, setKeyboardEventLog] = useState("none");

  return (
    <UICard title="UIKit · Text Input">
      <div className="grid gap-4">
        <div className="max-w-xl">
          <UITextInput
            size={uiSize}
            borderRadius={borderRadius}
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
            borderRadius={borderRadius}
            placeholder="Borderless input"
            defaultValue="Borderless example"
            borderless
          />
        </div>

        <div className="max-w-xl">
          <UITextInput
            size={uiSize}
            borderRadius={borderRadius}
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
            borderRadius={borderRadius}
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
          <UITextInput size={uiSize} borderRadius={borderRadius} value="Loading state" readOnly loading />
          <UITextInput size={uiSize} borderRadius={borderRadius} value="Read-only state" readOnly />
          <UITextInput size={uiSize} borderRadius={borderRadius} value="Disabled state" disabled />
        </div>

        <p className="text-sm text-text-muted">Keyboard event: {keyboardEventLog}</p>
      </div>
    </UICard>
  );
}
