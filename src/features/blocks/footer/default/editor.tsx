"use client";

import { useMemo, useState } from "react";

import { UIButton } from "@/components/ui/button";
import { UISelect } from "@/components/ui/select";
import { UITextInput } from "@/components/ui/text-input";
import { EditorFieldRow } from "@/components/editor/editor-field-row";
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

        <EditorFieldRow label="Title (optional)" htmlFor="footer-left-title">
          <UITextInput
            id="footer-left-title"
            size="sm"
            value={props.leftTitle}
            onValueChange={(value) => update({ leftTitle: value })}
            placeholder="About"
          />
        </EditorFieldRow>

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

        <EditorFieldRow label="Site name (optional)" htmlFor="footer-site-name">
          <UITextInput
            id="footer-site-name"
            size="sm"
            value={props.siteName}
            onValueChange={(value) => update({ siteName: value })}
            placeholder="Project name"
          />
        </EditorFieldRow>

        <div className="grid gap-1.5 md:flex md:items-start md:gap-4">
          <span className="pt-1 text-sm font-medium text-text-main md:w-44 md:shrink-0">
            Site description (optional)
          </span>
          <div className="min-w-0 flex-1">
          <textarea
            value={props.siteDescription}
            rows={3}
            onChange={(event) => update({ siteDescription: event.target.value })}
            className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            placeholder="Short site description"
          />
          </div>
        </div>

        <EditorFieldRow label="Social links title (optional)" htmlFor="footer-social-links-title">
          <UITextInput
            id="footer-social-links-title"
            size="sm"
            value={props.socialLinksTitle}
            onValueChange={(value) => update({ socialLinksTitle: value })}
            placeholder="Follow us"
          />
        </EditorFieldRow>

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
                <div className="grid gap-1.5 md:flex md:items-start md:gap-4">
                  <span className="pt-1 text-sm font-medium text-text-main md:w-44 md:shrink-0">
                    Social icon
                  </span>
                  <div className="min-w-0 flex-1">
                <UISelect
                  ariaLabel={`Social icon ${index + 1}`}
                  size="sm"
                  className="w-full"
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
                  </div>
                </div>
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
            <EditorFieldRow label="Label" htmlFor="footer-social-label">
              <UITextInput
                id="footer-social-label"
                size="sm"
                value={draftSocialLabel}
                onValueChange={setDraftSocialLabel}
                placeholder="Instagram"
              />
            </EditorFieldRow>
            <EditorFieldRow label="URL" htmlFor="footer-social-url">
              <UITextInput
                id="footer-social-url"
                size="sm"
                value={draftSocialUrl}
                onValueChange={setDraftSocialUrl}
                placeholder="https://instagram.com/..."
              />
            </EditorFieldRow>
            <EditorFieldRow label="Icon" htmlFor="footer-social-icon">
              <UISelect
                id="footer-social-icon"
                ariaLabel="New social icon"
                size="sm"
                className="w-full"
                value={draftSocialIcon}
                onValueChange={(value) => setDraftSocialIcon(value as SocialIconKey)}
                options={socialIconOptions}
              />
            </EditorFieldRow>
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

        <EditorFieldRow label="Scroll button label" htmlFor="footer-scroll-button-label">
          <UITextInput
            id="footer-scroll-button-label"
            size="sm"
            value={props.scrollTopLabel}
            onValueChange={(value) => update({ scrollTopLabel: value })}
            placeholder="Scroll to top"
          />
        </EditorFieldRow>
      </div>

      <div className="grid gap-3 rounded-2xl border border-line bg-surface-alt p-4">
        <p className="text-sm font-semibold text-text-main">Right column 1: Page links</p>

        <EditorFieldRow label="Title (optional)" htmlFor="footer-links-column-one-title">
          <UITextInput
            id="footer-links-column-one-title"
            size="sm"
            value={props.navColumnTitle}
            onValueChange={(value) => update({ navColumnTitle: value })}
            placeholder="Navigation"
          />
        </EditorFieldRow>

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
        <EditorFieldRow label="Label" htmlFor="footer-nav-draft-label">
          <UITextInput
            id="footer-nav-draft-label"
            size="sm"
            value={draftNavLabel}
            onValueChange={setDraftNavLabel}
            placeholder="Features"
          />
        </EditorFieldRow>
          <EditorFieldRow label="Anchor id" htmlFor="footer-nav-draft-anchor">
            <UISelect
              id="footer-nav-draft-anchor"
              ariaLabel="Footer anchor id"
              size="sm"
              className="w-full"
              value={draftNavAnchorId}
              onValueChange={setDraftNavAnchorId}
              options={anchorOptions}
              placeholder="Select anchor"
              disabled={anchorOptions.length === 0}
            />
          </EditorFieldRow>
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
        <EditorFieldRow label="Title (optional)" htmlFor="footer-links-column-two-title">
          <UITextInput
            id="footer-links-column-two-title"
            size="sm"
            value={props.linksColumnOneTitle}
            onValueChange={(value) => update({ linksColumnOneTitle: value })}
            placeholder="Resources"
          />
        </EditorFieldRow>

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
        <EditorFieldRow label="Label" htmlFor="footer-external-one-label">
          <UITextInput
            id="footer-external-one-label"
            size="sm"
            value={draftExternalOneLabel}
            onValueChange={setDraftExternalOneLabel}
            placeholder="Docs"
          />
        </EditorFieldRow>
          <EditorFieldRow label="URL" htmlFor="footer-external-one-url">
            <UITextInput
              id="footer-external-one-url"
              size="sm"
              value={draftExternalOneUrl}
              onValueChange={setDraftExternalOneUrl}
              placeholder="https://example.com"
            />
          </EditorFieldRow>
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
        <EditorFieldRow label="Title (optional)" htmlFor="footer-links-column-three-title">
          <UITextInput
            id="footer-links-column-three-title"
            size="sm"
            value={props.linksColumnTwoTitle}
            onValueChange={(value) => update({ linksColumnTwoTitle: value })}
            placeholder="Legal"
          />
        </EditorFieldRow>

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
        <EditorFieldRow label="Label" htmlFor="footer-external-two-label">
          <UITextInput
            id="footer-external-two-label"
            size="sm"
            value={draftExternalTwoLabel}
            onValueChange={setDraftExternalTwoLabel}
            placeholder="Privacy policy"
          />
        </EditorFieldRow>
          <EditorFieldRow label="URL" htmlFor="footer-external-two-url">
            <UITextInput
              id="footer-external-two-url"
              size="sm"
              value={draftExternalTwoUrl}
              onValueChange={setDraftExternalTwoUrl}
              placeholder="https://example.com/privacy"
            />
          </EditorFieldRow>
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
