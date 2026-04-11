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

type ValidationState = "default" | "error" | "success";
type UITextInputSize = "sm" | "lg";

export type UITextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> & {
  size?: UITextInputSize;
  invalid?: boolean;
  validationState?: ValidationState;
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

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export const UITextInput = forwardRef<HTMLInputElement, UITextInputProps>(function UITextInput(
  {
    className,
    size = "lg",
    type = "text",
    value,
    defaultValue,
    disabled,
    readOnly,
    invalid = false,
    validationState = "default",
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

  const showClearButton =
    clearable && !disabled && !readOnly && currentValue.length > 0;

  const sizeClasses =
    size === "sm"
      ? {
          container: "h-7 rounded-lg px-2",
          icon: "h-3.5 w-3.5",
          clearButton: "h-5 w-5",
          toggleButton: "h-5 min-w-10 px-1.5 text-[11px]",
          input: "text-sm",
          gap: "gap-1.5",
        }
      : {
          container: "h-10 rounded-xl px-3",
          icon: "h-4 w-4",
          clearButton: "h-6 w-6",
          toggleButton: "h-6 min-w-12 px-2 text-xs",
          input: "text-sm",
          gap: "gap-2",
        };

  return (
    <div className="w-full">
      <div
        className={cx(
          "flex w-full items-center border bg-surface transition",
          sizeClasses.container,
          sizeClasses.gap,
          "focus-within:ring-2 focus-within:ring-focus/50 focus-within:ring-offset-2 focus-within:ring-offset-bg",
          disabled && "cursor-not-allowed opacity-60",
          readOnly && "bg-surface-alt",
          isInvalid && "border-danger-line",
          isSuccess && "border-primary-line",
          !isInvalid && !isSuccess && "border-line",
          className
        )}
      >
        {prefix ? (
          <span className={cx("inline-flex shrink-0 items-center justify-center text-text-muted", sizeClasses.icon)}>
            {prefix}
          </span>
        ) : null}

        <input
          {...props}
          ref={inputRef}
          type={resolvedType}
          value={isControlled ? value : uncontrolledValue}
          defaultValue={isControlled ? undefined : defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={isInvalid || undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cx(
            "w-full min-w-0 bg-transparent text-text-main outline-none placeholder:text-text-placeholder",
            sizeClasses.input,
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
            disabled && "cursor-not-allowed"
          )}
        />

        {loading ? (
          <span
            aria-hidden
            className={cx(
              "shrink-0 animate-spin rounded-full border-2 border-line border-t-primary-200",
              sizeClasses.icon
            )}
          />
        ) : null}

        {clearable ? (
          <button
            type="button"
            onClick={handleClear}
            className={cx(
              "inline-flex shrink-0 items-center justify-center rounded-md text-text-muted transition",
              sizeClasses.clearButton,
              showClearButton
                ? "opacity-100 hover:bg-surface-alt hover:text-text-main"
                : "pointer-events-none opacity-0"
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
            className={cx(
              "inline-flex shrink-0 items-center justify-center rounded-md text-text-muted transition hover:bg-surface-alt hover:text-text-main",
              sizeClasses.toggleButton
            )}
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? "Hide" : "Show"}
          </button>
        ) : null}

        {suffix ? (
          <span className={cx("inline-flex shrink-0 items-center justify-center text-text-muted", sizeClasses.icon)}>
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
});
