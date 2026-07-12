"use client";

import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import {
  UISheet,
  UISheetClose,
  UISheetContent,
  UISheetDescription,
  UISheetFooter,
  UISheetHeader,
  UISheetTitle,
  UISheetTrigger,
} from "@/components/ui/sheet";
import { UITextInput } from "@/components/ui/text-input";

import type { UiSize } from "@/app/showcase/_shared/uikit-sections";

export function SheetCard({ uiSize }: { uiSize: UiSize }) {
  return (
    <UICard title="Sheet">
      <div className="flex flex-wrap items-center gap-3">
        <UISheet>
          <UISheetTrigger>
            <UIButton theme="base" variant="outlined" size={uiSize}>
              Open Right Sheet
            </UIButton>
          </UISheetTrigger>
          <UISheetContent side="right">
            <UISheetHeader>
              <UISheetTitle>Sheet from right</UISheetTitle>
              <UISheetDescription>Useful for settings, metadata, and side panel flows.</UISheetDescription>
            </UISheetHeader>
            <div className="mt-6 grid gap-3">
              <UITextInput size={uiSize} placeholder="Panel field" />
              <UITextInput size={uiSize} placeholder="Another field" />
            </div>
            <UISheetFooter>
              <UISheetClose>
                <UIButton theme="base" variant="outlined" size={uiSize}>
                  Close
                </UIButton>
              </UISheetClose>
            </UISheetFooter>
          </UISheetContent>
        </UISheet>

        <UISheet>
          <UISheetTrigger>
            <UIButton theme="primary" variant="contained" size={uiSize}>
              Open Left Sheet
            </UIButton>
          </UISheetTrigger>
          <UISheetContent side="left">
            <UISheetHeader>
              <UISheetTitle>Sheet from left</UISheetTitle>
              <UISheetDescription>Same component with side controlled by a prop.</UISheetDescription>
            </UISheetHeader>
            <div className="mt-6">
              <p className="text-sm text-text-muted">Put any UIKit controls inside this area.</p>
            </div>
            <UISheetFooter>
              <UISheetClose>
                <UIButton theme="base" variant="outlined" size={uiSize}>
                  Done
                </UIButton>
              </UISheetClose>
            </UISheetFooter>
          </UISheetContent>
        </UISheet>
      </div>
    </UICard>
  );
}
