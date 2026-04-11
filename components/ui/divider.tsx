import type { HTMLAttributes } from "react";

type UIDividerSpacing = "none" | "sm" | "md" | "lg";

export type UIDividerProps = HTMLAttributes<HTMLHRElement> & {
  spacing?: UIDividerSpacing;
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

export function UIDivider({ spacing = "md", className, ...props }: UIDividerProps) {
  return (
    <hr
      role="separator"
      aria-orientation="horizontal"
      className={cx("h-px w-full border-0 bg-line", spacingClasses[spacing], className)}
      {...props}
    />
  );
}
