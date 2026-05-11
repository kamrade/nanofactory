import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MdRendererProps = {
  content: string;
  className?: string;
};

function isExternalHref(href: string | undefined) {
  if (!href) {
    return false;
  }

  return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(href) || /^[a-z][a-z0-9+.-]*:/i.test(href);
}

export function MdRenderer({ content, className }: MdRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ ...props }) => (
            <h1 className="mb-2 mt-0 text-2xl font-semibold tracking-tight text-text-main" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="mb-2 mt-0 text-xl font-semibold tracking-tight text-text-main" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="mb-1.5 mt-0 text-lg font-semibold text-text-main" {...props} />
          ),
          h4: ({ ...props }) => (
            <h4 className="mb-1.5 mt-0 text-base font-semibold text-text-main" {...props} />
          ),
          h5: ({ ...props }) => <h5 className="mb-1 mt-0 text-sm font-semibold text-text-main" {...props} />,
          h6: ({ ...props }) => <h6 className="mb-1 mt-0 text-xs font-semibold uppercase tracking-wide text-text-main" {...props} />,
          p: ({ ...props }) => <p className="my-0 leading-6" {...props} />,
          ul: ({ ...props }) => <ul className="my-0 list-disc space-y-1 pl-5" {...props} />,
          ol: ({ ...props }) => <ol className="my-0 list-decimal space-y-1 pl-5" {...props} />,
          li: ({ ...props }) => <li className="leading-6" {...props} />,
          a: ({ href, ...props }) => {
            const external = isExternalHref(href);
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
