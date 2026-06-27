import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MdRendererProps = {
  content: string;
  className?: string;
};

const EXTERNAL_SCHEME_WHITELIST = new Set(["http", "https", "mailto", "tel"]);

function isInternalHref(href: string) {
  return (
    href.startsWith("/") ||
    href.startsWith("./") ||
    href.startsWith("../") ||
    href.startsWith("#") ||
    href.startsWith("?")
  );
}

function resolveHrefPolicy(href: string | undefined) {
  if (!href) {
    return { kind: "empty" as const };
  }

  if (isInternalHref(href)) {
    return { kind: "internal" as const };
  }

  const schemeMatch = href.match(/^([a-z][a-z0-9+.-]*):/i);
  if (!schemeMatch) {
    return { kind: "internal" as const };
  }

  const scheme = schemeMatch[1]?.toLowerCase();
  if (scheme && EXTERNAL_SCHEME_WHITELIST.has(scheme)) {
    return { kind: "external" as const };
  }

  return { kind: "blocked" as const };
}

export function MdRenderer({ content, className }: MdRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ ...props }) => (
            <h1 className="mb-2 mt-0 text-h1 text-text-main" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="mb-2 mt-0 text-h2 text-text-placeholder" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="mb-1.5 mt-0 text-h3 text-text-main" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="mb-1.5 mt-0 text-base font-semibold text-text-main" {...props} />
          ),
          h5: ({ ...props }) => <h5 className="mb-1 mt-0 text-sm font-semibold text-text-main" {...props} />,
          h6: ({ ...props }) => <h6 className="mb-1 mt-0 text-xs font-semibold uppercase tracking-wide text-text-main" {...props} />,
          p: ({ ...props }) => <p className="my-0" {...props} />,
          ul: ({ ...props }) => <ul className="my-0 list-disc space-y-1 pl-5" {...props} />,
          ol: ({ ...props }) => <ol className="my-0 list-decimal space-y-1 pl-5" {...props} />,
          li: ({ ...props }) => <li className="leading-6" {...props} />,
          a: ({ href, children, ...props }) => {
            const policy = resolveHrefPolicy(href);
            if (policy.kind === "blocked" || policy.kind === "empty") {
              return (
                <span className="underline underline-offset-2 opacity-70" title="Unsupported link">
                  {children}
                </span>
              );
            }

            const external = policy.kind === "external";
            return (
              <a
                href={href}
                className="underline underline-offset-2 transition hover:opacity-80"
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                {...props}
              />
            );
          },
          blockquote: ({ ...props }) => (
            <blockquote className="my-1 border-l-2 border-line pl-3 italic" {...props} />
          ),
          code: ({ ...props }) => (
            <code
              className="rounded bg-surface px-1 py-0.5 font-mono text-[0.9em] text-text-main"
              {...props}
            />
          ),
          pre: ({ ...props }) => (
            <pre
              className="my-1 overflow-x-auto rounded-xl border border-line bg-surface p-3 text-xs"
              {...props}
            />
          ),
          hr: ({ ...props }) => <hr className="my-2 border-line" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
