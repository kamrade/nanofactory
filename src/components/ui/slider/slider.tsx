"use client";

import { useId, useState, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from "react";

import { cx } from "@/lib/cn";

export type UISliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange"
> & {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label?: ReactNode;
  showValue?: boolean;
  valueFormatter?: (value: number) => ReactNode;
  ariaLabel?: string;
};

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function UISlider({
  id,
  className,
  value,
  defaultValue,
  onValueChange,
  onChange,
  label,
  showValue = false,
  valueFormatter,
  min = 0,
  max = 100,
  step = 1,
  disabled,
  readOnly,
  ariaLabel,
  ...props
}: UISliderProps) {
  const generatedId = useId();
  const sliderId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? (Number(min) || 0));

  const currentValue = isControlled ? Number(value ?? min) : uncontrolledValue;
  const resolvedValue = clampValue(currentValue, Number(min), Number(max));
  const displayedValue = valueFormatter ? valueFormatter(resolvedValue) : resolvedValue;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = Number(event.target.value);
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
    onChange?.(event);
  }

  const slider = (
    <input
      {...props}
      id={sliderId}
      type="range"
      min={min}
      max={max}
      step={step}
      value={isControlled ? resolvedValue : undefined}
      defaultValue={isControlled ? undefined : defaultValue}
      disabled={disabled}
      readOnly={readOnly}
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
      aria-valuetext={showValue ? String(displayedValue) : undefined}
      onChange={handleChange}
      className={cx(
        "h-4 w-full cursor-pointer accent-primary-300 outline-none",
        "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    />
  );

  if (!label && !showValue) {
    return slider;
  }

  return (
    <div className="grid gap-2 text-sm font-medium text-text-main">
      <div className="flex items-center justify-between gap-3">
        {label ? (
          <label htmlFor={sliderId} className="cursor-pointer">
            {label}
          </label>
        ) : (
          <span />
        )}
        {showValue ? <span className="text-text-muted">{displayedValue}</span> : null}
      </div>
      {slider}
    </div>
  );
}
