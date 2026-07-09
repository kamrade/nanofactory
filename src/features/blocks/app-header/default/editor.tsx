"use client";

import { useMemo, useState } from "react";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/editor/asset-picker";
import { DebouncedTextInput as UITextInput } from "../../shared/editor/debounced-text-field";
import { UIButton } from "@/components/ui/button";
import { UICheckbox } from "@/components/ui/checkbox";
import { UIFormRow } from "@/components/ui/form-row";
import { UIModalForm } from "@/components/ui/modal";
import { UISelect } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  APP_HEADER_BREAKPOINTS,
  type AppHeaderCollapseBreakpoint,
  readAppHeaderProps,
  type AppHeaderMenuItem as MenuItem,
  type AppHeaderSocialLink as SocialLink,
} from "./model";

export function AppHeaderDefaultEditor({
  block,
  assets,
  onChange,
  availableAnchors = [],
}: BlockEditorProps) {
  const appHeaderProps = readAppHeaderProps(block.props);
  const {
    title,
    logoAssetId: selectedLogoAssetId,
    logoLightAssetId: selectedLogoLightAssetId,
    logoDarkAssetId: selectedLogoDarkAssetId,
    collapseBreakpoint,
    alwaysMobile,
    showModeSwitcher,
    menuItems,
    socialLinks,
  } = appHeaderProps;
  const [draftLabel, setDraftLabel] = useState("");
  const [draftAnchorId, setDraftAnchorId] = useState("");
  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingAnchorId, setEditingAnchorId] = useState("");
  const [draftSocialLabel, setDraftSocialLabel] = useState("");
  const [draftSocialUrl, setDraftSocialUrl] = useState("");
  const [editingSocialIndex, setEditingSocialIndex] = useState<number | null>(null);
  const [editingSocialLabel, setEditingSocialLabel] = useState("");
  const [editingSocialUrl, setEditingSocialUrl] = useState("");

  const anchorOptions = useMemo(
    () =>
      availableAnchors.map((anchor) => ({
        value: anchor.id,
        label: anchor.label,
        textValue: anchor.label,
      })),
    [availableAnchors]
  );
  const breakpointOptions = useMemo(
    () =>
      APP_HEADER_BREAKPOINTS.map((breakpoint) => ({
        value: breakpoint,
        label: breakpoint,
        textValue: breakpoint,
      })),
    []
  );

  function updateMenuItems(nextMenuItems: MenuItem[]) {
    onChange({
      ...block.props,
      menuItems: nextMenuItems,
    });
  }

  function updateSocialLinks(nextSocialLinks: SocialLink[]) {
    onChange({
      ...block.props,
      socialLinks: nextSocialLinks,
    });
  }

  function handleAddMenuItem() {
    const label = draftLabel.trim();
    const anchorId = draftAnchorId.trim();
    if (!label || !anchorId) {
      return;
    }

    updateMenuItems([...menuItems, { label, anchorId }]);
    setDraftLabel("");
    setDraftAnchorId("");
  }

  function openMenuItemEditor(index: number) {
    const item = menuItems[index];
    if (!item) {
      return;
    }

    setEditingMenuIndex(index);
    setEditingLabel(item.label);
    setEditingAnchorId(item.anchorId);
  }

  function closeMenuItemEditor() {
    setEditingMenuIndex(null);
    setEditingLabel("");
    setEditingAnchorId("");
  }

  function saveMenuItemEdit() {
    if (editingMenuIndex === null) {
      return;
    }

    const label = editingLabel.trim();
    const anchorId = editingAnchorId.trim();
    if (!label || !anchorId) {
      return;
    }

    updateMenuItems(
      menuItems.map((item, index) =>
        index === editingMenuIndex
          ? {
              ...item,
              label,
              anchorId,
            }
          : item
      )
    );
    closeMenuItemEditor();
  }

  function handleAddSocialLink() {
    const label = draftSocialLabel.trim();
    const url = draftSocialUrl.trim();
    if (!label || !url) {
      return;
    }

    updateSocialLinks([...socialLinks, { label, url, icon: "link" }]);
    setDraftSocialLabel("");
    setDraftSocialUrl("");
  }

  function openSocialLinkEditor(index: number) {
    const item = socialLinks[index];
    if (!item) {
      return;
    }

    setEditingSocialIndex(index);
    setEditingSocialLabel(item.label);
    setEditingSocialUrl(item.url);
  }

  function closeSocialLinkEditor() {
    setEditingSocialIndex(null);
    setEditingSocialLabel("");
    setEditingSocialUrl("");
  }

  function saveSocialLinkEdit() {
    if (editingSocialIndex === null) {
      return;
    }

    const label = editingSocialLabel.trim();
    const url = editingSocialUrl.trim();
    if (!label || !url) {
      return;
    }

    updateSocialLinks(
      socialLinks.map((item, index) =>
        index === editingSocialIndex
          ? {
              ...item,
              label,
              url,
            }
          : item
      )
    );
    closeSocialLinkEditor();
  }

  const editingMenuItem =
    editingMenuIndex !== null ? menuItems[editingMenuIndex] ?? null : null;
  const editingSocialItem =
    editingSocialIndex !== null ? socialLinks[editingSocialIndex] ?? null : null;

  return (
    <div className="grid gap-3">
      <Card>
        <div>
          <UIFormRow label="Title" htmlFor="app-header-title" borderless>
            <UITextInput
              id="app-header-title"
              size="sm"
              value={title}
              borderless
              onCommit={(nextTitle: string) =>
                onChange({
                  ...block.props,
                  title: nextTitle,
                })
              }
              placeholder="Optional title"
            />
          </UIFormRow>

          <UIFormRow label="Collapse breakpoint" htmlFor="app-header-collapse-breakpoint" borderless>
            <UISelect
              id="app-header-collapse-breakpoint"
              ariaLabel="Header collapse breakpoint"
              size="sm"
              borderless
              className="w-full"
              value={collapseBreakpoint}
              onValueChange={(value) =>
                onChange({
                  ...block.props,
                  collapseBreakpoint: value as AppHeaderCollapseBreakpoint,
                })
              }
              options={breakpointOptions}
            />
          </UIFormRow>

          <UIFormRow label="Always mobile" htmlFor="app-header-always-mobile" borderless>
            <UICheckbox
              id="app-header-always-mobile"
              checked={alwaysMobile}
              onChange={(event) =>
                onChange({
                  ...block.props,
                  alwaysMobile: event.currentTarget.checked,
                })
              }
            />
          </UIFormRow>

          <UIFormRow label="Mode switcher" htmlFor="app-header-show-mode-switcher" borderless>
            <UICheckbox
              id="app-header-show-mode-switcher"
              checked={showModeSwitcher}
              onChange={(event) =>
                onChange({
                  ...block.props,
                  showModeSwitcher: event.currentTarget.checked,
                })
              }
            />
          </UIFormRow>
        </div>
      </Card>
      <div className="grid gap-4 py-5">
        <AssetPicker
          assets={assets}
          selectedAssetId={selectedLogoAssetId}
          onSelect={(assetId) =>
            onChange({
              ...block.props,
              logoAssetId: assetId,
            })
          }
          onClear={() =>
            onChange({
              ...block.props,
              logoAssetId: undefined,
            })
          }
          title="Left: Logo"
          emptyMessage="Upload an image in Project assets first."
          clearLabel="Remove logo"
          selectLabel="Use as logo"
          compact
          wrapped={false}
        />
        <AssetPicker
          assets={assets}
          selectedAssetId={selectedLogoLightAssetId}
          onSelect={(assetId) =>
            onChange({
              ...block.props,
              logoLightAssetId: assetId,
            })
          }
          onClear={() =>
            onChange({
              ...block.props,
              logoLightAssetId: undefined,
            })
          }
          title="Light mode logo"
          emptyMessage="Upload an image in Project assets first."
          clearLabel="Remove light logo"
          selectLabel="Use in light mode"
          compact
          wrapped={false}
        />
        <AssetPicker
          assets={assets}
          selectedAssetId={selectedLogoDarkAssetId}
          onSelect={(assetId) =>
            onChange({
              ...block.props,
              logoDarkAssetId: assetId,
            })
          }
          onClear={() =>
            onChange({
              ...block.props,
              logoDarkAssetId: undefined,
            })
          }
          title="Dark mode logo"
          emptyMessage="Upload an image in Project assets first."
          clearLabel="Remove dark logo"
          selectLabel="Use in dark mode"
          compact
          wrapped={false}
        />
      </div>

      <div className="grid gap-4 py-5">
        <h4 className="text-lg font-semibold text-text-main">Center: Menu</h4>
        {menuItems.length === 0 ? (
          <p className="text-sm text-text-muted">No menu items yet.</p>
        ) : (
          <div className="grid gap-2">
            {menuItems.map((item, index) => (
              <div
                key={`${item.anchorId}-${item.label}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-main">{item.label}</p>
                  <p className="truncate text-xs text-text-muted">{item.anchorId}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <UIButton
                    type="button"
                    size="sm"
                    theme="base"
                    variant="outlined"
                    onClick={() => openMenuItemEditor(index)}
                  >
                    Edit
                  </UIButton>
                  <UIButton
                    type="button"
                    size="sm"
                    theme="danger"
                    variant="outlined"
                    onClick={() =>
                      updateMenuItems(menuItems.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    Remove
                  </UIButton>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid rounded-xl bg-surface border border-line p-3">
          <UIFormRow label="Label" htmlFor="app-header-menu-item-label" borderless>
            <UITextInput
              id="app-header-menu-item-label"
              size="sm"
              value={draftLabel}
              onCommit={setDraftLabel}
              borderless
              placeholder="Menu label"
            />
          </UIFormRow>
          <UIFormRow
            label="Anchor id"
            htmlFor="app-header-menu-item-anchor"
            borderless
            className="mb-3"
          >
            <UISelect
              id="app-header-menu-item-anchor"
              ariaLabel="Anchor id"
              size="sm"
              borderless
              className="w-full"
              value={draftAnchorId}
              onValueChange={(value) => setDraftAnchorId(String(value))}
              placeholder={availableAnchors.length === 0 ? "No anchors available" : "Select anchor"}
              options={anchorOptions}
            />
          </UIFormRow>
          <UIButton
            type="button"
            size="sm"
            theme="base"
            variant="contained"
            disabled={!draftLabel.trim() || !draftAnchorId.trim()}
            onClick={handleAddMenuItem}
          >
            Add item
          </UIButton>
        </div>
      </div>

      <UIModalForm
        open={editingMenuIndex !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeMenuItemEditor();
          }
        }}
        trigger={<button type="button" className="hidden" aria-hidden tabIndex={-1} />}
        title="Edit menu item"
        
        submitLabel="Save changes"
        cancelLabel="Cancel"
        size="md"
        onSubmit={(event) => {
          event.preventDefault();
          saveMenuItemEdit();
        }}
      >
        <div className="grid gap-3">
          <UIFormRow label="Label" htmlFor="app-header-menu-item-edit-label" borderless>
            <UITextInput
              id="app-header-menu-item-edit-label"
              size="sm"
              value={editingLabel}
              onCommit={setEditingLabel}
              borderless
              placeholder="Menu label"
            />
          </UIFormRow>
          <UIFormRow label="Anchor id" htmlFor="app-header-menu-item-edit-anchor" borderless>
            <UISelect
              id="app-header-menu-item-edit-anchor"
              ariaLabel="Anchor id"
              size="sm"
              borderless
              className="w-full"
              value={editingAnchorId}
              onValueChange={(value) => setEditingAnchorId(String(value))}
              placeholder={availableAnchors.length === 0 ? "No anchors available" : "Select anchor"}
              options={anchorOptions}
            />
          </UIFormRow>
        </div>
      </UIModalForm>

      <div className="grid gap-4 py-5">
        <h4 className="text-lg font-semibold text-text-main">Right: Social links</h4>
        {socialLinks.length === 0 ? (
          <p className="text-sm text-text-muted">No social links yet.</p>
        ) : (
          <div className="grid gap-2">
            {socialLinks.map((item, index) => (
              <div
                key={`${item.label}-${item.url}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-main">{item.label}</p>
                  <p className="truncate text-xs text-text-muted">{item.url}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <UIButton
                    type="button"
                    size="sm"
                    theme="base"
                    variant="outlined"
                    onClick={() => openSocialLinkEditor(index)}
                  >
                    Edit
                  </UIButton>
                  <UIButton
                    type="button"
                    size="sm"
                    theme="danger"
                    variant="outlined"
                    onClick={() =>
                      updateSocialLinks(socialLinks.filter((_, itemIndex) => itemIndex !== index))
                    }
                  >
                    Remove
                  </UIButton>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-2 rounded-xl border border-line bg-surface p-3">
          <UIFormRow label="Label" htmlFor="app-header-social-label" borderless>
            <UITextInput
              id="app-header-social-label"
              size="sm"
              value={draftSocialLabel}
              onCommit={setDraftSocialLabel}
              placeholder="Instagram"
              borderless
            />
          </UIFormRow>
          <UIFormRow label="URL" htmlFor="app-header-social-url" borderless>
            <UITextInput
              id="app-header-social-url"
              size="sm"
              value={draftSocialUrl}
              onCommit={setDraftSocialUrl}
              placeholder="https://..."
              borderless
            />
          </UIFormRow>
          <UIButton
            type="button"
            size="sm"
            theme="base"
            variant="contained"
            disabled={!draftSocialLabel.trim() || !draftSocialUrl.trim()}
            onClick={handleAddSocialLink}
          >
            Add social link
          </UIButton>
        </div>
      </div>

      <UIModalForm
        open={editingSocialIndex !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeSocialLinkEditor();
          }
        }}
        trigger={<button type="button" className="hidden" aria-hidden tabIndex={-1} />}
        title="Edit social link"
        description={
          editingSocialItem
            ? `Editing ${editingSocialItem.label} · ${editingSocialItem.url}`
            : "Edit social link"
        }
        submitLabel="Save changes"
        cancelLabel="Cancel"
        size="md"
        onSubmit={(event) => {
          event.preventDefault();
          saveSocialLinkEdit();
        }}
      >
        <div className="grid gap-3">
          <UIFormRow label="Label" htmlFor="app-header-social-edit-label" borderless>
            <UITextInput
              id="app-header-social-edit-label"
              size="sm"
              value={editingSocialLabel}
              onCommit={setEditingSocialLabel}
              borderless
              placeholder="Instagram"
            />
          </UIFormRow>
          <UIFormRow label="URL" htmlFor="app-header-social-edit-url" borderless>
            <UITextInput
              id="app-header-social-edit-url"
              size="sm"
              value={editingSocialUrl}
              onCommit={setEditingSocialUrl}
              borderless
              placeholder="https://..."
            />
          </UIFormRow>
        </div>
      </UIModalForm>
    </div>
  );
}
