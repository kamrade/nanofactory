"use client";

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

type UikitSidebarProps = {
  sections: UikitSectionNavItem[];
};

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) {
    return;
  }

  element.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

function UikitSectionButton({
  section,
  active,
  onSelect,
  className,
}: {
  section: UikitSectionNavItem;
  active: boolean;
  onSelect: (id: string) => void;
  className?: string;
}) {
  return (
    <a
      href={`#${section.id}`}
      onClick={(event) => {
        event.preventDefault();
        onSelect(section.id);
      }}
      aria-current={active ? "location" : undefined}
      className={cx(
        "block w-full rounded-sm text-left text-sm leading-6 transition outline-none",
        "focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg",
        "focus-visible:ring-2 focus-visible:ring-focus/50 focus-visible:ring-offset-0 focus-visible:ring-offset-bg",
        active ? "font-medium text-text-main" : "text-text-muted hover:text-text-main",
        className
      )}
    >
      {section.label}
    </a>
  );
}

function UikitSidebarList({
  sections,
  activeSectionId,
  onSelect,
  compact = false,
}: {
  sections: UikitSectionNavItem[];
  activeSectionId: string;
  onSelect: (id: string) => void;
  compact?: boolean;
}) {
  return (
    <div className={cx("grid", compact ? "gap-1" : "gap-2")}>
      {sections.map((section) => (
        <UikitSectionButton
          key={section.id}
          section={section}
          active={section.id === activeSectionId}
          onSelect={onSelect}
          className={compact ? "text-[12px] leading-4" : "text-[13px] leading-5"}
        />
      ))}
    </div>
  );
}

export function UikitSidebar({ sections }: UikitSidebarProps) {
  const [activeSectionId, setActiveSectionId] = useState(() => sections[0]?.id ?? "");
  const [mobileOpen, setMobileOpen] = useState(false);

  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
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
  }, [sectionIds]);

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
            ariaLabel="UIKit sections"
            className="p-2.5"
            style={{ maxWidth: "13.5rem" }}
          >
            <UISheetHeader className="space-y-0">
              <UISheetTitle className="text-sm">UIKit sections</UISheetTitle>
            </UISheetHeader>
            <div className="mt-3 grid gap-1">
              <UikitSidebarList
                sections={sections}
                activeSectionId={activeSectionId}
                onSelect={(id) => {
                  handleSelect(id);
                  setMobileOpen(false);
                }}
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

      <aside data-testid="uikit-sidebar" className="hidden lg:block lg:sticky lg:top-24 lg:self-start bg-white p-6 rounded-2xl">
        <div className="p-0.5 max-h-[70vh] overflow-y-auto">
          <div className="mb-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              On this page
            </p>
          </div>
          <UikitSidebarList
            sections={sections}
            activeSectionId={activeSectionId}
            onSelect={handleSelect}
          />
        </div>
      </aside>
    </>
  );
}
