import Link from "next/link";

type UITabItem = {
  label: string;
  href: string;
  active?: boolean;
};

export type UITabsProps = {
  items: UITabItem[];
  ariaLabel?: string;
  className?: string;
};

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UITabs({ items, ariaLabel = "Tabs", className }: UITabsProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cx(
        "flex w-full items-center gap-1 border-b border-line",
        className
      )}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cx(
            "inline-flex h-9 items-center justify-center px-3 text-sm font-medium transition outline-none",
            "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
            "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus-visible:ring-offset-bg",
            item.active
              ? "text-text-main shadow-[inset_0_-2px_0_var(--primary-200)]"
              : "text-text-muted hover:text-text-main hover:shadow-[inset_0_-2px_0_var(--line)] active:text-text-main"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
