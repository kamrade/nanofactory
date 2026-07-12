"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { UIButton } from "@/components/ui/button";
import {
  UISheet,
  UISheetClose,
  UISheetContent,
  UISheetFooter,
  UISheetHeader,
  UISheetTitle,
  UISheetTrigger,
} from "@/components/ui/sheet";
import { cx } from "@/lib/cn";

import type { UikitSectionNavItem } from "./uikit-sections/nav";

type ShowcaseSidebarProps = {
  sections: UikitSectionNavItem[];
  title?: string;
  ariaLabel?: string;
  activeSectionId?: string;
  topContent?: ReactNode;
};

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

function ShowcaseSectionButton({
  section,
  active,
  onSelect,
  onItemClick,
  className,
}: {
  section: UikitSectionNavItem;
  active: boolean;
  onSelect: (id: string) => void;
  onItemClick?: () => void;
  className?: string;
}) {
  const sharedClassName = cx(
    "block w-full rounded-sm text-left text-sm leading-6 transition outline-none",
    "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
    "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus-visible:ring-offset-bg",
    active ? "font-medium text-text-main" : "text-text-muted hover:text-text-main",
    className
  );

  if (section.href) {
    return (
      <Link
        href={section.href}
        aria-current={active ? "page" : undefined}
        onClick={onItemClick}
        className={sharedClassName}
      >
        {section.label}
      </Link>
    );
  }

  return (
    <a
      href={`#${section.id}`}
      onClick={(event) => {
        event.preventDefault();
        onItemClick?.();
        onSelect(section.id);
      }}
      aria-current={active ? "location" : undefined}
      className={sharedClassName}
    >
      {section.label}
    </a>
  );
}

function ShowcaseSidebarList({
  sections,
  activeSectionId,
  onSelect,
  onItemClick,
  compact = false,
}: {
  sections: UikitSectionNavItem[];
  activeSectionId: string;
  onSelect: (id: string) => void;
  onItemClick?: () => void;
  compact?: boolean;
}) {
  return (
    <div className={cx("grid", compact ? "gap-1" : "gap-2")}>
      {sections.map((section) => (
        <ShowcaseSectionButton
          key={section.id}
          section={section}
          active={section.id === activeSectionId}
          onSelect={onSelect}
          onItemClick={onItemClick}
          className={compact ? "text-xs leading-4" : "text-sm leading-5"}
        />
      ))}
    </div>
  );
}

export function ShowcaseSidebar({
  sections,
  title = "UI Kit",
  ariaLabel = "UIKit sections",
  activeSectionId: controlledActiveSectionId,
  topContent,
}: ShowcaseSidebarProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    () => controlledActiveSectionId ?? sections[0]?.id ?? ""
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasLinkedItems = sections.some((section) => Boolean(section.href));

  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    if (controlledActiveSectionId) {
      setActiveSectionId(controlledActiveSectionId);
      return;
    }

    if (hasLinkedItems) {
      return;
    }

    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (targets.length === 0) {
      return;
    }

    const currentHash = window.location.hash.slice(1);
    if (currentHash && sectionIds.includes(currentHash)) {
      window.requestAnimationFrame(() => {
        setActiveSectionId(currentHash);
        document.getElementById(currentHash)?.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        const nextActiveId = visibleEntries[0]?.target.id;
        if (nextActiveId) {
          setActiveSectionId(nextActiveId);
        }
      },
      {
        rootMargin: "-20% 0px -64% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [controlledActiveSectionId, hasLinkedItems, sectionIds]);

  function handleSelect(id: string) {
    setActiveSectionId(id);
    scrollToSection(id);
  }

  return (
    <>
      <div className="lg:hidden">
        <UISheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <UISheetTrigger>
            <UIButton theme="base" variant="outlined" size="sm">
              Menu
            </UIButton>
          </UISheetTrigger>
          <UISheetContent
            side="left"
            ariaLabel={ariaLabel}
            className="p-2.5"
            style={{ maxWidth: "13.5rem" }}
          >
            <UISheetHeader className="space-y-0">
              <UISheetTitle className="text-sm">{title}</UISheetTitle>
            </UISheetHeader>
            <div className="mt-3 grid gap-1">
              <ShowcaseSidebarList
                sections={sections}
                activeSectionId={activeSectionId}
                onSelect={(id) => {
                  handleSelect(id);
                  setMobileOpen(false);
                }}
                onItemClick={() => setMobileOpen(false)}
                compact
              />
            </div>
            <UISheetFooter className="mt-3 justify-start">
              <UISheetClose>
                <UIButton theme="base" variant="outlined" size="sm">
                  Close
                </UIButton>
              </UISheetClose>
            </UISheetFooter>
          </UISheetContent>
        </UISheet>
      </div>

      <aside
        data-testid="uikit-sidebar"
        className="hidden rounded-2xl border border-line bg-surface p-6 text-text-main shadow-sm lg:sticky lg:top-24 lg:block lg:self-start"
      >
        <div className="scrollbar-macos max-h-[70vh] overflow-y-auto p-0.5 pr-4">
          <div className="mb-2.5">
            <p className="mb-5 border-b pb-2 font-bold uppercase tracking-[0.14em] text-text-muted">
              {title}
            </p>
          </div>
          {topContent ? <div className="mb-5 grid gap-4">{topContent}</div> : null}
          <ShowcaseSidebarList
            sections={sections}
            activeSectionId={activeSectionId}
            onSelect={hasLinkedItems ? () => {} : handleSelect}
            onItemClick={hasLinkedItems ? () => setMobileOpen(false) : undefined}
          />
        </div>
      </aside>
    </>
  );
}
