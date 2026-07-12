"use client";

import type { ReactNode } from "react";

type ShowcaseTabToolbarProps = {
  children: ReactNode;
};

export function ShowcaseTabToolbar({ children }: ShowcaseTabToolbarProps) {
  return (
    <div className="pt-4">
      <div className="mx-auto container px-4">{children}</div>
    </div>
  );
}
