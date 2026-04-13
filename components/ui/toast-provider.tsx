"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type UIToastTone = "default" | "error";

export type UIToastInput = {
  title: string;
  description?: string;
  tone?: UIToastTone;
  durationMs?: number;
};

type UIToastRecord = UIToastInput & {
  id: string;
  tone: UIToastTone;
};

type UIToastContextValue = {
  showToast: (input: UIToastInput) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

type ThemeAttrs = {
  theme?: string;
  mode?: string;
};

const UIToastContext = createContext<UIToastContextValue | null>(null);

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function UIToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<UIToastRecord[]>([]);
  const [themeAttrs, setThemeAttrs] = useState<ThemeAttrs>({});
  const timersRef = useRef<Map<string, number>>(new Map());
  const seqRef = useRef(0);

  const readThemeAttrs = useCallback(() => {
    if (typeof document === "undefined") {
      return {};
    }

    const scope = document.querySelector<HTMLElement>("[data-theme]");
    return {
      theme: scope?.dataset.theme,
      mode: scope?.dataset.mode,
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (input: UIToastInput) => {
      const id = `toast-${Date.now()}-${seqRef.current++}`;
      const tone = input.tone ?? "default";
      const next: UIToastRecord = {
        ...input,
        id,
        tone,
      };

      setToasts((current) => [next, ...current].slice(0, 5));

      const durationMs = input.durationMs ?? 3500;
      if (durationMs > 0) {
        const timerId = window.setTimeout(() => {
          dismissToast(id);
        }, durationMs);
        timersRef.current.set(id, timerId);
      }

      return id;
    },
    [dismissToast]
  );

  const clearToasts = useCallback(() => {
    timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const contextValue = useMemo<UIToastContextValue>(
    () => ({
      showToast,
      dismissToast,
      clearToasts,
    }),
    [clearToasts, dismissToast, showToast]
  );

  useEffect(() => {
    setThemeAttrs(readThemeAttrs());
  }, [readThemeAttrs]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const observer = new MutationObserver(() => {
      setThemeAttrs(readThemeAttrs());
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-theme", "data-mode"],
    });

    return () => observer.disconnect();
  }, [readThemeAttrs]);

  return (
    <UIToastContext.Provider value={contextValue}>
      {children}
      <div
        data-theme={themeAttrs.theme}
        data-mode={themeAttrs.mode}
        className="pointer-events-none fixed bottom-4 left-1/2 z-[80] flex w-[min(100vw-2rem,24rem)] -translate-x-1/2 flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live={toast.tone === "error" ? "assertive" : "polite"}
            className={cx(
              "pointer-events-auto rounded-xl border px-3 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)]",
              toast.tone === "error" && "border-danger-line bg-danger-100 text-danger",
              toast.tone === "default" && "border-line bg-surface-alt text-text-main"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium leading-5">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm leading-5 text-text-muted">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-muted transition hover:bg-surface-alt hover:text-text-main"
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </UIToastContext.Provider>
  );
}

export function useUIToast() {
  const context = useContext(UIToastContext);
  if (!context) {
    throw new Error("useUIToast must be used inside UIToastProvider.");
  }
  return context;
}
