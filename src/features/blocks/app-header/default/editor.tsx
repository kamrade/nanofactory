"use client";

import { useMemo, useState } from "react";

import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import { UIButton } from "@/components/ui/button";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";
import {
  SOCIAL_ICON_OPTIONS,
  type SocialIconKey,
} from "./social-icons";
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
    menuItems,
    socialLinks,
  } = appHeaderProps;
  const [draftLabel, setDraftLabel] = useState("");
  const [draftAnchorId, setDraftAnchorId] = useState("");
  const [draftSocialLabel, setDraftSocialLabel] = useState("");
  const [draftSocialUrl, setDraftSocialUrl] = useState("");
  const [draftSocialIcon, setDraftSocialIcon] = useState<SocialIconKey>("link");

  const anchorOptions = useMemo(
    () =>
      availableAnchors.map((anchor) => ({
        value: anchor.id,
        label: anchor.label,
        textValue: anchor.label,
      })),
    [availableAnchors]
  );
  const socialIconOptions = useMemo(
    () =>
      SOCIAL_ICON_OPTIONS.map((option) => ({
        value: option.value,
        label: option.label,
        textValue: option.label,
      })),
    []
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

  function handleAddSocialLink() {
    const label = draftSocialLabel.trim();
    const url = draftSocialUrl.trim();
    if (!label || !url) {
      return;
    }

    updateSocialLinks([...socialLinks, { label, url, icon: draftSocialIcon }]);
    setDraftSocialLabel("");
    setDraftSocialUrl("");
    setDraftSocialIcon("link");
  }

  function handleUpdateSocialIcon(index: number, nextIcon: SocialIconKey) {
    updateSocialLinks(
      socialLinks.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              icon: nextIcon,
            }
          : item
      )
    );
  }

  return (
    <div className="grid gap-5">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Title</span>
        <UITextInput
          size="sm"
          value={title}
          onValueChange={(nextTitle) =>
            onChange({
              ...block.props,
              title: nextTitle,
            })
          }
          placeholder="Optional title"
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Collapse breakpoint</span>
        <UISelect
          ariaLabel="Header collapse breakpoint"
          size="sm"
          value={collapseBreakpoint}
          onValueChange={(value) =>
            onChange({
              ...block.props,
              collapseBreakpoint: value as AppHeaderCollapseBreakpoint,
            })
          }
          options={breakpointOptions}
        />
      </label>

      <div className="grid gap-4 rounded-2xl border border-line bg-surface-alt p-4">
        <p className="text-sm font-semibold text-text-main">Left: Logo</p>
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
          title="Logo image"
          description="Select a project asset to render as the header logo."
          emptyMessage="Upload an image in Project assets first."
          clearLabel="Remove logo"
          selectLabel="Use as logo"
          compact
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
          description="Optional override for light mode."
          emptyMessage="Upload an image in Project assets first."
          clearLabel="Remove light logo"
          selectLabel="Use in light mode"
          compact
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
          description="Optional override for dark mode."
          emptyMessage="Upload an image in Project assets first."
          clearLabel="Remove dark logo"
          selectLabel="Use in dark mode"
          compact
        />
      </div>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
        <p className="text-sm font-semibold text-text-main">Center: Menu</p>
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
            ))}
          </div>
        )}

        <div className="grid gap-2 rounded-xl border border-line bg-surface p-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">Label</span>
            <UITextInput
              size="sm"
              value={draftLabel}
              onValueChange={setDraftLabel}
              placeholder="Menu label"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">Anchor</span>
            <UISelect
              ariaLabel="Anchor id"
              size="sm"
              value={draftAnchorId}
              onValueChange={(value) => setDraftAnchorId(String(value))}
              placeholder={availableAnchors.length === 0 ? "No anchors available" : "Select anchor"}
              options={anchorOptions}
            />
          </label>
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

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
        <p className="text-sm font-semibold text-text-main">Right: Social links</p>
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
                <div className="min-w-[170px]">
                  <UISelect
                    ariaLabel="Social icon"
                    size="sm"
                    value={item.icon}
                    onValueChange={(value) =>
                      handleUpdateSocialIcon(index, value as SocialIconKey)
                    }
                    options={socialIconOptions}
                  />
                </div>
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
            ))}
          </div>
        )}

        <div className="grid gap-2 rounded-xl border border-line bg-surface p-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">Label</span>
            <UITextInput
              size="sm"
              value={draftSocialLabel}
              onValueChange={setDraftSocialLabel}
              placeholder="Instagram"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">URL</span>
            <UITextInput
              size="sm"
              value={draftSocialUrl}
              onValueChange={setDraftSocialUrl}
              placeholder="https://..."
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">Icon</span>
            <UISelect
              ariaLabel="Social icon"
              size="sm"
              value={draftSocialIcon}
              onValueChange={(value) => setDraftSocialIcon(value as SocialIconKey)}
              options={socialIconOptions}
            />
          </label>
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
    </div>
  );
}
