import Link from "next/link";

type GalleryItemNavProps = {
  backHref: string;
  backLabel?: string;
  counterText: string;
  previousHref?: string;
  nextHref?: string;
  /** Overrides default data-testid prefix ("gallery"). */
  testIdPrefix?: string;
};

export function GalleryItemNav({
  backHref,
  backLabel = "Back to gallery",
  counterText,
  previousHref,
  nextHref,
  testIdPrefix = "gallery",
}: GalleryItemNavProps) {
  const backTestId = `${testIdPrefix}-back-link`;
  const counterTestId = `${testIdPrefix}-counter`;
  const previousTestId = `${testIdPrefix}-nav-previous`;
  const nextTestId = `${testIdPrefix}-nav-next`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          data-testid={backTestId}
          href={backHref}
          className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
        >
          {backLabel}
        </Link>
        <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-muted">
          <span data-testid={counterTestId}>{counterText}</span>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface-alt">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
          {previousHref ? (
            <Link
              data-testid={previousTestId}
              href={previousHref}
              className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
            >
              Previous
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center rounded-xl border border-line bg-surface-alt px-3 py-2 text-sm font-medium text-text-placeholder">
              Previous
            </span>
          )}

          {nextHref ? (
            <Link
              data-testid={nextTestId}
              href={nextHref}
              className="inline-flex items-center justify-center rounded-xl border border-line bg-surface px-3 py-2 text-sm font-medium text-text-main transition hover:bg-surface-alt"
            >
              Next
            </Link>
          ) : (
            <span className="inline-flex items-center justify-center rounded-xl border border-line bg-surface-alt px-3 py-2 text-sm font-medium text-text-placeholder">
              Next
            </span>
          )}
        </div>
      </section>
    </>
  );
}
