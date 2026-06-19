import type { ReactNode } from "react";

import { cx } from "@/lib/cn";

type UIFormRowProps = {
  label: string;
  labelId?: string;
  htmlFor?: string;
  onLabelClick?: () => void;
  error?: string;
  children: ReactNode;
  underline?: boolean;
  contentClassName?: string;
  className?: string;
  labelClassName?: string;
  borderless?: boolean;
};

export function UIFormRow({
  label,
  labelId,
  htmlFor,
  onLabelClick,
  error,
  children,
  underline = false,
  contentClassName,
  className,
  labelClassName,
  borderless = false,
}: UIFormRowProps) {
  const labelNode = htmlFor ? (
    <label
      id={labelId}
      htmlFor={htmlFor}
      className={cx("py-1 text-sm font-medium text-text-muted", labelClassName)}
    >
      {label}
    </label>
  ) : onLabelClick ? (
    <button
      type="button"
      id={labelId}
      onClick={onLabelClick}
      className={cx("py-1 text-left text-sm font-medium text-text-muted", labelClassName)}
    >
      {label}
    </button>
  ) : (
    <span id={labelId} className={cx("py-1 text-sm font-medium text-text-muted", labelClassName)}>
      {label}
    </span>
  );

  return (
    <div
      className={cx(
        "grid gap-1.5 md:grid-cols-[12rem_minmax(0,1fr)] md:items-start md:gap-4",
        (underline || borderless) && "border-b border-line py-1 transition-colors focus-within:border-neutral-400",
        className
      )}
    >
      {labelNode}
      <div className={cx("w-full max-w-xl", contentClassName)}>
        {children}
        {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
      </div>
    </div>
  );
}
