import type { HTMLAttributes } from "react";

type UIDividerSpacing = "none" | "sm" | "md" | "lg";

export type UIDividerProps = HTMLAttributes<HTMLHRElement> & {
  spacing?: UIDividerSpacing;
  stripped?: boolean;
};

const spacingClasses: Record<UIDividerSpacing, string> = {
  none: "my-0",
  sm: "my-2",
  md: "my-5",
  lg: "my-8",
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UIDivider({
  spacing = "md",
  stripped = false,
  className,
  ...props
}: UIDividerProps) {
  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cx(
        "w-full border-0",
        stripped ? "h-6 ui-divider-striped" : "h-px bg-line",
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  );
}
