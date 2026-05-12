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
import { formatUiDateTime } from "@/lib/ui-date-time";

type UiSize = "sm" | "lg";

export function DialogDemoCard({ uiSize }: { uiSize: UiSize }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("none");

  return (
    <UICard title="UIKit · Dialog">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <UIDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <UIDialogTrigger>
              <UIButton theme="primary" variant="contained" size={uiSize}>
                Open dialog
              </UIButton>
            </UIDialogTrigger>
            <UIDialogContent>
              <UIDialogHeader>
                <UIDialogTitle>Publish changes</UIDialogTitle>
                <UIDialogDescription>
                  Review content one more time before publishing this section.
                </UIDialogDescription>
              </UIDialogHeader>
              <UIDialogFooter>
                <UIDialogClose>
                  <UIButton theme="base" variant="outlined" size={uiSize}>
                    Cancel
                  </UIButton>
                </UIDialogClose>
                <UIDialogClose>
                  <UIButton
                    theme="primary"
                    variant="contained"
                    size={uiSize}
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
              <UIButton theme="danger" variant="outlined" size={uiSize}>
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
  );
}

export function ModalDemoCard({ uiSize }: { uiSize: UiSize }) {
  const [profileName, setProfileName] = useState("Jane Doe");
  const [profileEmail, setProfileEmail] = useState("jane@example.com");
  const [profileRole, setProfileRole] = useState("Designer");
  const [profileSavedAt, setProfileSavedAt] = useState("never");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  return (
    <UICard title="UIKit · Modal">
      <div className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <UIModal
            size="lg"
            trigger={
              <UIButton theme="base" variant="outlined" size={uiSize}>
                Open content modal
              </UIButton>
            }
            title="Modal content"
            description="Use this modal for rich, scrollable content."
          >
            <div className="grid gap-3 text-sm text-text-muted">
              <p>
                This is a generic content modal. Put any complex composition here:
                long text, lists, previews, or custom layouts.
              </p>
              <p>
                It uses the same dialog foundation with focus trap, escape handling,
                and overlay click close.
              </p>
            </div>
          </UIModal>

          <UIModalForm
            size="md"
            trigger={
              <UIButton theme="primary" variant="contained" size={uiSize}>
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
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-text-main">Name</span>
                <UITextInput
                  value={profileName}
                  onValueChange={setProfileName}
                  size="sm"
                  placeholder="Name"
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-text-main">Email</span>
                <UITextInput
                  type="email"
                  value={profileEmail}
                  onValueChange={setProfileEmail}
                  size="sm"
                  placeholder="Email"
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium text-text-main">Role</span>
                <UISelect
                  size="sm"
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
  );
}

export function MarkdownDemoCard() {
  const [markdownValue, setMarkdownValue] = useState(
    [
      "# Heading 1",
      "## Heading 2",
      "### Heading 3",
      "#### Heading 4",
      "##### Heading 5",
      "###### Heading 6",
      "",
      "Paragraph with **bold**, _italic_, ~~strikethrough~~, and `inline code`.",
      "",
      "> Blockquote: reusable markdown content for project storytelling.",
      "",
      "---",
      "",
      "Unordered list:",
      "- First bullet",
      "- Second bullet",
      "- [x] Task done",
      "- [ ] Task todo",
      "",
      "Ordered list:",
      "1. First item",
      "2. Second item",
      "3. Third item",
      "",
      "[External link](https://example.com)",
      "",
      "```ts",
      "const message = \"Code block example\";",
      "console.log(message);",
      "```",
      "",
      "| Feature | Status |",
      "| --- | --- |",
      "| Headings | Supported |",
      "| Lists | Supported |",
      "| Code | Supported |",
    ].join("\n")
  );

  return (
    <UICard title="UIKit · Markdown Renderer">
      <p className="text-sm text-text-muted">
        Введите Markdown слева и проверьте, как он будет выглядеть в карточке проекта. В примере уже заполнены все поддерживаемые элементы.
      </p>
      <div className="grid items-start gap-4 md:grid-cols-2">
        <label className="grid h-[clamp(18rem,46vh,32rem)] gap-1.5 text-sm">
          <span className="font-medium text-text-main">Markdown input</span>
          <textarea
            value={markdownValue}
            rows={10}
            onChange={(event) => setMarkdownValue(event.target.value)}
            className="h-full rounded-xl border border-line bg-surface px-3 py-2 align-top text-sm leading-6 text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            placeholder="Введите markdown..."
          />
        </label>

        <div className="grid h-[clamp(18rem,46vh,32rem)] gap-1.5 text-sm">
          <span className="font-medium text-text-main">Rendered preview</span>
          <div className="h-full max-h-[32rem] overflow-auto rounded-xl border border-line bg-surface-alt p-3">
            <MdRenderer content={markdownValue} className="text-sm text-text-muted" />
          </div>
        </div>
      </div>
    </UICard>
  );
}
