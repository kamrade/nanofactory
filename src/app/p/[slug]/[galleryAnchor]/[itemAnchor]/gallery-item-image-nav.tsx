"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { ModeAwareLink } from "@/components/projects/mode-aware-link";

type GalleryItemImageNavProps = {
  previousHref?: string;
  nextHref?: string;
  radiusClassName?: string;
  controlClassName?: string;
  /** Overrides default data-testid prefix ("gallery"). */
  testIdPrefix?: string;
};

export function GalleryItemImageNav({
  previousHref,
  nextHref,
  radiusClassName = "rounded-full",
  controlClassName = "size-10",
  testIdPrefix = "gallery",
}: GalleryItemImageNavProps) {
  const previousTestId = `${testIdPrefix}-nav-previous`;
  const nextTestId = `${testIdPrefix}-nav-next`;

  const buttonClassName = `inline-flex items-center justify-center border border-line bg-surface/85 text-text-main backdrop-blur-sm transition hover:bg-surface ${controlClassName} ${radiusClassName}`;
  const disabledClassName = `inline-flex items-center justify-center border border-line bg-surface/40 text-text-placeholder backdrop-blur-sm ${controlClassName} ${radiusClassName}`;

  return (
    <>
      <div className="pointer-events-none absolute inset-y-0 left-2 right-2 hidden items-center justify-between md:flex">
        {previousHref ? (
          <ModeAwareLink
            data-testid={previousTestId}
            href={previousHref}
            aria-label="Previous image"
            className={`pointer-events-auto ${buttonClassName}`}
          >
            <FiChevronLeft aria-hidden className="h-5 w-5" />
          </ModeAwareLink>
        ) : (
          <span aria-hidden className={disabledClassName}>
            <FiChevronLeft className="h-5 w-5" />
          </span>
        )}

        {nextHref ? (
          <ModeAwareLink
            data-testid={nextTestId}
            href={nextHref}
            aria-label="Next image"
            className={`pointer-events-auto ${buttonClassName}`}
          >
            <FiChevronRight aria-hidden className="h-5 w-5" />
          </ModeAwareLink>
        ) : (
          <span aria-hidden className={disabledClassName}>
            <FiChevronRight className="h-5 w-5" />
          </span>
        )}
      </div>
    </>
  );
}
