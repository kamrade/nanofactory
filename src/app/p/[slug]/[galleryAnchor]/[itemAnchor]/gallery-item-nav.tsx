import { ModeAwareLink } from "@/components/projects/mode-aware-link";

type GalleryItemNavProps = {
  backHref: string;
  backLabel?: string;
  counterText: string;
  previousHref?: string;
  nextHref?: string;
  showStepNavigation?: boolean;
  radiusClassName?: string;
  controlClassName?: string;
  controlBarClassName?: string;
  /** Overrides default data-testid prefix ("gallery"). */
  testIdPrefix?: string;
};

export function GalleryItemNav({
  backHref,
  backLabel = "Back to gallery",
  counterText,
  previousHref,
  nextHref,
  showStepNavigation = true,
  radiusClassName = "rounded-xl",
  controlClassName = "px-3 py-2 text-sm",
  controlBarClassName = "px-4 py-3",
  testIdPrefix = "gallery",
}: GalleryItemNavProps) {
  const backTestId = `${testIdPrefix}-back-link`;
  const counterTestId = `${testIdPrefix}-counter`;
  const previousTestId = `${testIdPrefix}-nav-previous`;
  const nextTestId = `${testIdPrefix}-nav-next`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ModeAwareLink
          data-testid={backTestId}
          href={backHref}
          className={`inline-flex items-center justify-center border border-line bg-surface font-medium text-text-main transition hover:bg-surface-alt ${controlClassName} ${radiusClassName}`}
        >
          {backLabel}
        </ModeAwareLink>
        <div className={`inline-flex items-center gap-2 border border-line bg-surface text-text-muted ${controlClassName} ${radiusClassName}`}>
          <span data-testid={counterTestId}>{counterText}</span>
        </div>
      </div>

      {showStepNavigation ? (
        <section className={`overflow-hidden border border-line bg-surface-alt ${radiusClassName}`}>
          <div className={`flex items-center justify-between gap-3 border-b border-line bg-surface ${controlBarClassName}`}>
            {previousHref ? (
              <ModeAwareLink
                data-testid={previousTestId}
                href={previousHref}
                className={`inline-flex items-center justify-center border border-line bg-surface font-medium text-text-main transition hover:bg-surface-alt ${controlClassName} ${radiusClassName}`}
              >
                Previous
              </ModeAwareLink>
            ) : (
              <span className={`inline-flex items-center justify-center border border-line bg-surface-alt font-medium text-text-placeholder ${controlClassName} ${radiusClassName}`}>
                Previous
              </span>
            )}

            {nextHref ? (
              <ModeAwareLink
                data-testid={nextTestId}
                href={nextHref}
                className={`inline-flex items-center justify-center border border-line bg-surface font-medium text-text-main transition hover:bg-surface-alt ${controlClassName} ${radiusClassName}`}
              >
                Next
              </ModeAwareLink>
            ) : (
              <span className={`inline-flex items-center justify-center border border-line bg-surface-alt font-medium text-text-placeholder ${controlClassName} ${radiusClassName}`}>
                Next
              </span>
            )}
          </div>
        </section>
      ) : null}
    </>
  );
}
