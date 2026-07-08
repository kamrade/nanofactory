"use client";

import { useEffect, useRef, useState } from "react";

import { UITextInput, type UITextInputProps } from "@/components/ui/text-input";
import { UITextArea, type UITextAreaProps } from "@/components/ui/textarea";

type DebouncedFieldBaseProps = {
  value: string;
  debounceMs?: number;
  onCommit: (value: string) => void;
};

type DebouncedTextInputProps = Omit<UITextInputProps, "value" | "onValueChange"> &
  DebouncedFieldBaseProps;

type DebouncedTextAreaProps = Omit<UITextAreaProps, "value" | "onValueChange" | "onChange"> &
  DebouncedFieldBaseProps;

function useDebouncedDraft(value: string, onCommit: (value: string) => void, debounceMs: number) {
  const [draft, setDraft] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const timerRef = useRef<number | null>(null);
  const draftRef = useRef(value);
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    },
    []
  );

  function clearTimer() {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function commit(nextValue: string) {
    clearTimer();
    draftRef.current = nextValue;
    if (nextValue !== valueRef.current) {
      valueRef.current = nextValue;
      onCommit(nextValue);
    }
  }

  function scheduleCommit(nextValue: string) {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      commit(nextValue);
    }, debounceMs);
  }

  function handleChange(nextValue: string) {
    setDraft(nextValue);
    draftRef.current = nextValue;
    scheduleCommit(nextValue);
  }

  return {
    draft: isFocused ? draft : value,
    handleChange,
    handleFocus: () => {
      setIsFocused(true);
    },
    handleBlur: () => {
      setIsFocused(false);
      commit(draftRef.current);
    },
    flush: () => commit(draftRef.current),
  };
}

export function DebouncedTextInput({
  value,
  debounceMs = 250,
  onCommit,
  onBlur,
  onFocus,
  ...props
}: DebouncedTextInputProps) {
  const { draft, handleChange, handleBlur, handleFocus, flush } = useDebouncedDraft(
    value,
    onCommit,
    debounceMs
  );

  return (
    <UITextInput
      {...props}
      value={draft}
      onFocus={(event) => {
        handleFocus();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        handleBlur();
        onBlur?.(event);
      }}
      onValueChange={handleChange}
      onEnterPress={flush}
    />
  );
}

export function DebouncedTextArea({
  value,
  debounceMs = 350,
  onCommit,
  onBlur,
  onFocus,
  ...props
}: DebouncedTextAreaProps) {
  const { draft, handleChange, handleBlur, handleFocus } = useDebouncedDraft(
    value,
    onCommit,
    debounceMs
  );

  return (
    <UITextArea
      {...props}
      value={draft}
      onFocus={(event) => {
        handleFocus();
        onFocus?.(event);
      }}
      onBlur={(event) => {
        handleBlur();
        onBlur?.(event);
      }}
      onChange={(event) => handleChange(event.target.value)}
    />
  );
}
