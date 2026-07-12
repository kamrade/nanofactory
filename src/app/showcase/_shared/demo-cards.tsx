"use client";

import { useState } from "react";

import { MdRenderer } from "@/components/md-renderer";
import { UIButton } from "@/components/ui/button";
import { UICard } from "@/components/ui/card";
import { UIConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  UIDialog,
  UIDialogClose,
  UIDialogContent,
  UIDialogDescription,
  UIDialogFooter,
  UIDialogHeader,
  UIDialogTitle,
  UIDialogTrigger,
} from "@/components/ui/dialog";
import { UIModal, UIModalForm } from "@/components/ui/modal";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";
import { cx } from "@/lib/cn";
import { formatUiDateTime } from "@/lib/ui-date-time";

import type { UiSize } from "./uikit-sections";
import { UikitSectionAnchor } from "./uikit-sections/section-anchor";

export function DialogDemoCard({
  uiSize,
  borderRadius = "lg",
}: {
  uiSize: UiSize;
  borderRadius?: "none" | "md" | "lg";
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("none");
  const dialogShellClassName =
    uiSize === "sm"
      ? "p-4"
      : uiSize === "md"
        ? "p-5"
        : "p-6";
  const dialogHeaderClassName =
    uiSize === "sm"
      ? "gap-1"
      : uiSize === "md"
        ? "gap-1.5"
        : "gap-2";
  const dialogTitleClassName =
    uiSize === "sm"
      ? "text-base"
      : uiSize === "md"
        ? "text-lg"
        : "text-xl";
  const dialogFooterClassName =
    uiSize === "sm"
      ? "mt-4"
      : uiSize === "md"
        ? "mt-5"
        : "mt-6";

  return (
    <UikitSectionAnchor id="dialog">
      <UICard title="Dialog">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <UIDialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <UIDialogTrigger>
                <UIButton theme="primary" variant="contained" size={uiSize} borderRadius={borderRadius}>
                  Open dialog
                </UIButton>
              </UIDialogTrigger>
              <UIDialogContent
                size={uiSize}
                borderRadius={borderRadius}
                paddingClassName={dialogShellClassName}
              >
                <UIDialogHeader className={dialogHeaderClassName}>
                  <UIDialogTitle className={dialogTitleClassName}>Publish changes</UIDialogTitle>
                  <UIDialogDescription>
                    Review content one more time before publishing this section.
                  </UIDialogDescription>
                </UIDialogHeader>
                <UIDialogFooter className={dialogFooterClassName}>
                  <UIDialogClose>
                    <UIButton theme="base" variant="outlined" size={uiSize} borderRadius={borderRadius}>
                      Cancel
                    </UIButton>
                  </UIDialogClose>
                  <UIDialogClose>
                    <UIButton
                      theme="primary"
                      variant="contained"
                      size={uiSize}
                      borderRadius={borderRadius}
                      onClick={() => setDialogAction("published")}
                    >
                      Publish
                    </UIButton>
                  </UIDialogClose>
                </UIDialogFooter>
              </UIDialogContent>
            </UIDialog>

            <UIConfirmDialog
              trigger={
                <UIButton theme="danger" variant="outlined" size={uiSize} borderRadius={borderRadius}>
                  Open confirm
                </UIButton>
              }
              title="Delete block?"
              description="This action cannot be undone."
              confirmLabel="Delete"
              onConfirm={() => setDialogAction("deleted")}
              confirmTheme="danger"
            />
          </div>

          <p className="text-sm text-text-muted">Dialog action: {dialogAction}</p>
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}

export function ModalDemoCard({
  uiSize,
  borderRadius = "lg",
}: {
  uiSize: UiSize;
  borderRadius?: "none" | "md" | "lg";
}) {
  const fieldLabelClassName =
    uiSize === "sm"
      ? "text-sm"
      : uiSize === "md"
        ? "text-sm"
        : "text-base";
  const [profileName, setProfileName] = useState("Jane Doe");
  const [profileEmail, setProfileEmail] = useState("jane@example.com");
  const [profileRole, setProfileRole] = useState("Designer");
  const [profileSavedAt, setProfileSavedAt] = useState("never");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  return (
    <UikitSectionAnchor id="modal">
      <UICard title="Modal">
        <div className="grid gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <UIModal
              size={uiSize}
              borderRadius={borderRadius}
              trigger={
                <UIButton theme="base" variant="outlined" size={uiSize} borderRadius={borderRadius}>
                  Open content modal
                </UIButton>
              }
              title="Modal content"
              description="Use this modal for rich, scrollable content."
            >
              <div className="grid gap-3 text-sm text-text-muted">
                <p>
                  This is a generic content modal. Put any complex composition here: long text, lists, previews, or
                  custom layouts.
                </p>
                <p>
                  It uses the same dialog foundation with focus trap, escape handling, and overlay click close.
                </p>
              </div>
            </UIModal>

            <UIModalForm
              size={uiSize}
              borderRadius={borderRadius}
              trigger={
                <UIButton theme="primary" variant="contained" size={uiSize} borderRadius={borderRadius}>
                  Open form modal
                </UIButton>
              }
              title="Edit profile"
              description="Collect structured data in a modal form."
              submitLabel="Save profile"
              submitting={isProfileSaving}
              onSubmit={async () => {
                setIsProfileSaving(true);
                await new Promise((resolve) => setTimeout(resolve, 500));
                setIsProfileSaving(false);
                setProfileSavedAt(formatUiDateTime(new Date()));
              }}
            >
              <div className="grid gap-3">
                <label className={cx("grid gap-1.5", fieldLabelClassName)}>
                  <span className="font-medium text-text-main">Name</span>
                  <UITextInput
                    value={profileName}
                    onValueChange={setProfileName}
                    size={uiSize}
                    borderRadius={borderRadius}
                    placeholder="Name"
                  />
                </label>
                <label className={cx("grid gap-1.5", fieldLabelClassName)}>
                  <span className="font-medium text-text-main">Email</span>
                  <UITextInput
                    type="email"
                    value={profileEmail}
                    onValueChange={setProfileEmail}
                    size={uiSize}
                    borderRadius={borderRadius}
                    placeholder="Email"
                  />
                </label>
                <label className={cx("grid gap-1.5", fieldLabelClassName)}>
                  <span className="font-medium text-text-main">Role</span>
                  <UISelect
                    size={uiSize}
                    borderRadius={borderRadius}
                    value={profileRole}
                    onValueChange={setProfileRole}
                    options={[
                      { value: "Designer", label: "Designer" },
                      { value: "Engineer", label: "Engineer" },
                      { value: "Product Manager", label: "Product Manager" },
                    ]}
                  />
                </label>
              </div>
            </UIModalForm>
          </div>

          <p className="text-sm text-text-muted">
            Profile: {profileName} · {profileEmail} · {profileRole} · Saved at: {profileSavedAt}
          </p>
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}

export function MarkdownDemoCard() {
  const [markdownValue, setMarkdownValue] = useState(
    [
      "# Pride and Prejudice",
      "## Chapter I",
      "### It is a truth universally acknowledged",
      "",
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
    ].join("\n")
  );

  return (
    <UikitSectionAnchor id="markdown">
      <UICard title="Markdown">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-muted" htmlFor="markdown-input">
              Markdown source
            </label>
            <textarea
              id="markdown-input"
              value={markdownValue}
              onChange={(event) => setMarkdownValue(event.currentTarget.value)}
              rows={8}
              className="min-h-40 w-full rounded-2xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition placeholder:text-text-placeholder focus:ring-2 focus:ring-focus/50 focus:ring-offset-0 focus:ring-offset-bg"
            />
          </div>

          <div className="grid gap-2">
            <p className="text-sm font-medium text-text-muted">Preview</p>
            <div className="rounded-2xl border border-line bg-surface-alt p-4">
              <MdRenderer content={markdownValue} />
            </div>
          </div>
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}
