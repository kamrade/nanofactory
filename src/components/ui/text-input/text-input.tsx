"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cx } from "@/lib/cn";

import styles from "./text-input.module.css";

type ValidationState = "default" | "error" | "success";
type UITextInputSize = "sm" | "md" | "lg";
type UITextInputBorderRadius = "none" | "md" | "lg";

export type UITextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> & {
  size?: UITextInputSize;
  borderRadius?: UITextInputBorderRadius;
  invalid?: boolean;
  validationState?: ValidationState;
  borderless?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  loading?: boolean;
  showPasswordToggle?: boolean;
  onClear?: () => void;
  onValueChange?: (value: string) => void;
  onEnterPress?: (value: string) => void;
  onEscapePress?: (value: string) => void;
};

const sizeClassName = {
  sm: {
    control: styles.controlSm,
    controlPadding: styles.controlPaddingSm,
    icon: styles.iconSm,
    clear: styles.clearSm,
    toggle: styles.toggleSm,
    input: styles.inputSm,
    gap: styles.controlGapSm,
  },
  md: {
    control: styles.controlMd,
    controlPadding: styles.controlPaddingMd,
    icon: styles.iconMd,
    clear: styles.clearMd,
    toggle: styles.toggleMd,
    input: styles.inputMd,
    gap: styles.controlGapMd,
  },
  lg: {
    control: styles.controlLg,
    controlPadding: styles.controlPaddingLg,
    icon: styles.iconLg,
    clear: styles.clearLg,
    toggle: styles.toggleLg,
    input: styles.inputLg,
    gap: styles.controlGapLg,
  },
} as const;

const radiusClassName = {
  none: styles.controlRadiusNone,
  md: styles.controlRadiusMd,
  lg: styles.controlRadiusLg,
} as const;

export const UITextInput = forwardRef<HTMLInputElement, UITextInputProps>(function UITextInput(
  {
    className,
    size = "lg",
    borderRadius = "lg",
    type = "text",
    value,
    defaultValue,
    disabled,
    readOnly,
    invalid = false,
    validationState = "default",
    borderless = false,
    prefix,
    suffix,
    clearable = false,
    loading = false,
    showPasswordToggle = false,
    onChange,
    onKeyDown,
    onValueChange,
    onEnterPress,
    onEscapePress,
    onClear,
    ...props
  },
  ref
) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue === undefined ? "" : String(defaultValue)
  );
  const [passwordVisible, setPasswordVisible] = useState(false);

  const currentValue = isControlled ? String(value ?? "") : uncontrolledValue;
  const isInvalid = invalid || validationState === "error";
  const isSuccess = !isInvalid && validationState === "success";

  const resolvedType = useMemo(() => {
    if (showPasswordToggle && type === "password") {
      return passwordVisible ? "text" : "password";
    }
    return type;
  }, [passwordVisible, showPasswordToggle, type]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }
    onValueChange?.(event.target.value);
    onChange?.(event);
  }

  function handleClear() {
    if (disabled || readOnly) {
      return;
    }

    if (!isControlled) {
      setUncontrolledValue("");
    }
    onValueChange?.("");
    onClear?.();
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Enter") {
      onEnterPress?.(event.currentTarget.value);
    }
    if (event.key === "Escape") {
      onEscapePress?.(event.currentTarget.value);
    }
  }

  const showClearButton = clearable && !disabled && !readOnly && currentValue.length > 0;

  return (
    <div className={styles.root}>
      <div
        data-size={size}
        data-border-radius={borderRadius}
        data-borderless={borderless ? "true" : undefined}
        data-invalid={isInvalid ? "true" : undefined}
        className={cx(
          styles.control,
          borderless ? styles.controlBorderless : styles.controlBordered,
          sizeClassName[size].control,
          sizeClassName[size].controlPadding,
          sizeClassName[size].gap,
          radiusClassName[borderRadius],
          disabled && styles.controlDisabled,
          borderless
            ? styles.controlDefault
            : isInvalid
              ? styles.controlInvalid
              : isSuccess
                ? styles.controlSuccess
                : styles.controlDefault,
          !isInvalid && readOnly && styles.controlReadOnly,
          className
        )}
      >
        {prefix ? (
          <span className={cx(styles.labelIcon, sizeClassName[size].icon)}>{prefix}</span>
        ) : null}

        <input
          {...props}
          ref={inputRef}
          type={resolvedType}
          value={isControlled ? value : uncontrolledValue}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isInvalid || undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cx(
            styles.field,
            sizeClassName[size].input,
            disabled && "cursor-not-allowed"
          )}
        />

        {loading ? (
          <span
            aria-hidden
            className={cx(
              "shrink-0 animate-spin rounded-full border-2 border-line border-t-primary-200",
              sizeClassName[size].icon
            )}
          />
        ) : null}

        {clearable ? (
          <button
            type="button"
            onClick={handleClear}
            className={cx(
              styles.actionButton,
              sizeClassName[size].clear,
              showClearButton ? undefined : styles.actionButtonDisabled
            )}
            aria-label="Clear input"
            tabIndex={showClearButton ? 0 : -1}
          >
            ×
          </button>
        ) : null}

        {showPasswordToggle && type === "password" ? (
          <button
            type="button"
            onClick={() => setPasswordVisible((prev) => !prev)}
            className={cx(styles.actionButton, sizeClassName[size].toggle)}
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        ) : null}

        {suffix ? (
          <span className={cx(styles.labelIcon, sizeClassName[size].icon)}>{suffix}</span>
        ) : null}
      </div>
    </div>
  );
});
