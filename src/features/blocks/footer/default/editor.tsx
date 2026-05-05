"use client";

import { useMemo, useState } from "react";

import { UIButton } from "@/components/ui/button";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";
import type { BlockEditorProps } from "../../shared/types";
import { AssetPicker } from "../../shared/asset-picker";
import {
  SOCIAL_ICON_OPTIONS,
  type SocialIconKey,
} from "@/features/blocks/app-header/default/social-icons";
import {
  readFooterProps,
  type FooterAnchorLink,
  type FooterExternalLink,
  type FooterSocialLink,
} from "./model";

export function FooterDefaultEditor({
  block,
  assets,
  onChange,
  availableAnchors = [],
}: BlockEditorProps) {
  const props = readFooterProps(block.props);

  const [draftNavLabel, setDraftNavLabel] = useState("");
  const [draftNavAnchorId, setDraftNavAnchorId] = useState("");

  const [draftExternalOneLabel, setDraftExternalOneLabel] = useState("");
  const [draftExternalOneUrl, setDraftExternalOneUrl] = useState("");
  const [draftExternalTwoLabel, setDraftExternalTwoLabel] = useState("");
  const [draftExternalTwoUrl, setDraftExternalTwoUrl] = useState("");

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

  function update(nextProps: Record<string, unknown>) {
    onChange({
      ...block.props,
      ...nextProps,
    });
  }

  function updateNavLinks(nextLinks: FooterAnchorLink[]) {
    update({ navLinks: nextLinks });
  }

  function updateExternalOne(nextLinks: FooterExternalLink[]) {
    update({ linksColumnOne: nextLinks });
  }

  function updateExternalTwo(nextLinks: FooterExternalLink[]) {
    update({ linksColumnTwo: nextLinks });
  }

  function updateSocialLinks(nextLinks: FooterSocialLink[]) {
    update({ socialLinks: nextLinks });
  }

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
        <p className="text-sm font-semibold text-text-main">Left column</p>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-text-main">Title (optional)</span>
          <UITextInput
            size="sm"
            value={props.leftTitle}
            onValueChange={(value) => update({ leftTitle: value })}
            placeholder="About"
          />
        </label>

        <AssetPicker
          assets={assets}
          selectedAssetId={props.logoAssetId}
          onSelect={(assetId) => update({ logoAssetId: assetId })}
          onClear={() => update({ logoAssetId: undefined })}
          title="Logo image"
          description="Select a project asset for the footer logo."
          emptyMessage="Upload an image in Project assets first."
          clearLabel="Remove logo"
          selectLabel="Use as logo"
          compact
        />

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-text-main">Site name (optional)</span>
          <UITextInput
            size="sm"
            value={props.siteName}
            onValueChange={(value) => update({ siteName: value })}
            placeholder="Project name"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-text-main">Site description (optional)</span>
          <textarea
            value={props.siteDescription}
            rows={3}
            onChange={(event) => update({ siteDescription: event.target.value })}
            className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            placeholder="Short site description"
          />
        </label>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-text-main">Social links title (optional)</span>
          <UITextInput
            size="sm"
            value={props.socialLinksTitle}
            onValueChange={(value) => update({ socialLinksTitle: value })}
            placeholder="Follow us"
          />
        </label>

        <div className="grid gap-2 rounded-xl border border-line bg-surface p-3">
          <p className="text-sm font-medium text-text-main">Social links</p>
          {props.socialLinks.length === 0 ? (
            <p className="text-sm text-text-muted">No social links yet.</p>
          ) : (
            props.socialLinks.map((item, index) => (
              <div
                key={`${item.url}-${item.label}-${index}`}
                className="grid gap-2 rounded-lg border border-line px-3 py-2"
              >
                <p className="text-sm font-medium text-text-main">{item.label}</p>
                <p className="truncate text-xs text-text-muted">{item.url}</p>
                <UISelect
                  ariaLabel={`Social icon ${index + 1}`}
                  size="sm"
                  value={item.icon}
                  onValueChange={(icon) =>
                    updateSocialLinks(
                      props.socialLinks.map((socialLink, socialIndex) =>
                        socialIndex === index
                          ? { ...socialLink, icon: icon as SocialIconKey }
                          : socialLink
                      )
                    )
                  }
                  options={socialIconOptions}
                />
                <UIButton
                  type="button"
                  size="sm"
                  theme="danger"
                  variant="outlined"
                  onClick={() =>
                    updateSocialLinks(
                      props.socialLinks.filter((_, socialIndex) => socialIndex !== index)
                    )
                  }
                >
                  Remove
                </UIButton>
              </div>
            ))
          )}
          <div className="grid gap-2 rounded-lg border border-line p-3">
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
                placeholder="https://instagram.com/..."
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="font-medium text-text-main">Icon</span>
              <UISelect
                ariaLabel="New social icon"
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
              onClick={() => {
                const label = draftSocialLabel.trim();
                const url = draftSocialUrl.trim();
                if (!label || !url) {
                  return;
                }
                updateSocialLinks([
                  ...props.socialLinks,
                  { label, url, icon: draftSocialIcon },
                ]);
                setDraftSocialLabel("");
                setDraftSocialUrl("");
                setDraftSocialIcon("link");
              }}
            >
              Add social link
            </UIButton>
          </div>
        </div>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-text-main">Scroll button label</span>
          <UITextInput
            size="sm"
            value={props.scrollTopLabel}
            onValueChange={(value) => update({ scrollTopLabel: value })}
            placeholder="Scroll to top"
          />
        </label>
      </div>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
        <p className="text-sm font-semibold text-text-main">Right column 1: Page links</p>

        <label className="grid gap-1 text-sm">
          <span className="font-medium text-text-main">Title (optional)</span>
          <UITextInput
            size="sm"
            value={props.navColumnTitle}
            onValueChange={(value) => update({ navColumnTitle: value })}
            placeholder="Navigation"
          />
        </label>

        {props.navLinks.length === 0 ? (
          <p className="text-sm text-text-muted">No links yet.</p>
        ) : (
          <div className="grid gap-2">
            {props.navLinks.map((item, index) => (
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
                    updateNavLinks(props.navLinks.filter((_, linkIndex) => linkIndex !== index))
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
              value={draftNavLabel}
              onValueChange={setDraftNavLabel}
              placeholder="Features"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">Anchor id</span>
            <UISelect
              ariaLabel="Footer anchor id"
              size="sm"
              value={draftNavAnchorId}
              onValueChange={setDraftNavAnchorId}
              options={anchorOptions}
              placeholder="Select anchor"
              disabled={anchorOptions.length === 0}
            />
          </label>
          <UIButton
            type="button"
            size="sm"
            theme="base"
            variant="contained"
            onClick={() => {
              const label = draftNavLabel.trim();
              const anchorId = draftNavAnchorId.trim();
              if (!label || !anchorId) {
                return;
              }
              updateNavLinks([...props.navLinks, { label, anchorId }]);
              setDraftNavLabel("");
              setDraftNavAnchorId("");
            }}
            disabled={anchorOptions.length === 0}
          >
            Add link
          </UIButton>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
        <p className="text-sm font-semibold text-text-main">Right column 2: External links</p>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-text-main">Title (optional)</span>
          <UITextInput
            size="sm"
            value={props.linksColumnOneTitle}
            onValueChange={(value) => update({ linksColumnOneTitle: value })}
            placeholder="Resources"
          />
        </label>

        {props.linksColumnOne.length > 0 ? (
          <div className="grid gap-2">
            {props.linksColumnOne.map((item, index) => (
              <div
                key={`${item.url}-${item.label}-one-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-main">{item.label}</p>
                  <p className="truncate text-xs text-text-muted">{item.url}</p>
                </div>
                <UIButton
                  type="button"
                  size="sm"
                  theme="danger"
                  variant="outlined"
                  onClick={() =>
                    updateExternalOne(
                      props.linksColumnOne.filter((_, linkIndex) => linkIndex !== index)
                    )
                  }
                >
                  Remove
                </UIButton>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No links yet.</p>
        )}

        <div className="grid gap-2 rounded-xl border border-line bg-surface p-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">Label</span>
            <UITextInput
              size="sm"
              value={draftExternalOneLabel}
              onValueChange={setDraftExternalOneLabel}
              placeholder="Docs"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">URL</span>
            <UITextInput
              size="sm"
              value={draftExternalOneUrl}
              onValueChange={setDraftExternalOneUrl}
              placeholder="https://example.com"
            />
          </label>
          <UIButton
            type="button"
            size="sm"
            theme="base"
            variant="contained"
            onClick={() => {
              const label = draftExternalOneLabel.trim();
              const url = draftExternalOneUrl.trim();
              if (!label || !url) {
                return;
              }
              updateExternalOne([...props.linksColumnOne, { label, url }]);
              setDraftExternalOneLabel("");
              setDraftExternalOneUrl("");
            }}
          >
            Add link
          </UIButton>
        </div>
      </div>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
        <p className="text-sm font-semibold text-text-main">Right column 3: External links</p>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-text-main">Title (optional)</span>
          <UITextInput
            size="sm"
            value={props.linksColumnTwoTitle}
            onValueChange={(value) => update({ linksColumnTwoTitle: value })}
            placeholder="Legal"
          />
        </label>

        {props.linksColumnTwo.length > 0 ? (
          <div className="grid gap-2">
            {props.linksColumnTwo.map((item, index) => (
              <div
                key={`${item.url}-${item.label}-two-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-main">{item.label}</p>
                  <p className="truncate text-xs text-text-muted">{item.url}</p>
                </div>
                <UIButton
                  type="button"
                  size="sm"
                  theme="danger"
                  variant="outlined"
                  onClick={() =>
                    updateExternalTwo(
                      props.linksColumnTwo.filter((_, linkIndex) => linkIndex !== index)
                    )
                  }
                >
                  Remove
                </UIButton>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No links yet.</p>
        )}

        <div className="grid gap-2 rounded-xl border border-line bg-surface p-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">Label</span>
            <UITextInput
              size="sm"
              value={draftExternalTwoLabel}
              onValueChange={setDraftExternalTwoLabel}
              placeholder="Privacy policy"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-text-main">URL</span>
            <UITextInput
              size="sm"
              value={draftExternalTwoUrl}
              onValueChange={setDraftExternalTwoUrl}
              placeholder="https://example.com/privacy"
            />
          </label>
          <UIButton
            type="button"
            size="sm"
            theme="base"
            variant="contained"
            onClick={() => {
              const label = draftExternalTwoLabel.trim();
              const url = draftExternalTwoUrl.trim();
              if (!label || !url) {
                return;
              }
              updateExternalTwo([...props.linksColumnTwo, { label, url }]);
              setDraftExternalTwoLabel("");
              setDraftExternalTwoUrl("");
            }}
          >
            Add link
          </UIButton>
        </div>
      </div>
    </div>
  );
}

