"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FiArchive, FiArrowRight, FiCopy, FiEdit2, FiMoreVertical, FiPlus, FiSearch, FiSettings, FiTrash2 } from "react-icons/fi";

import { ProjectRenderer } from "@/components/projects/project-renderer";
import { UIButton } from "@/components/ui/button";
import { UIBadge } from "@/components/ui/badge";
import { UICard } from "@/components/ui/card";
import { UICheckbox } from "@/components/ui/checkbox";
import { UIDivider } from "@/components/ui/divider";
import { UIMenu, UIMenuItem, UIMenuLabel, UIMenuSeparator } from "@/components/ui/menu";
import { UISegmentedControl } from "@/components/ui/segmented-control";
import { UIStickyHeader } from "@/components/ui/sticky-header";
import { UISwitcher } from "@/components/ui/switcher";
import { UITabs } from "@/components/ui/tabs";
import { UITextInput } from "@/components/ui/text-input";
import { UISelect } from "@/components/ui/select";
import { UIMultiSelect } from "@/components/ui/multi-select";
import { UIMultiSelectList } from "@/components/ui/multi-select-list";
import { UIAutocomplete } from "@/components/ui/autocomplete";
import { UIModal, UIModalForm } from "@/components/ui/modal";
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
import { UIConfirmDialog } from "@/components/ui/confirm-dialog";
import type { PageContent } from "@/db/schema";
import { DEFAULT_THEME_KEY, THEME_OPTIONS, type ThemeKey } from "@/lib/themes";

type ShowcaseTab = "uikit" | "sections";
type ShowcaseMode = "light" | "dark";

type ShowcaseClientProps = {
  content: PageContent;
  activeTab: ShowcaseTab;
  initialThemeKey?: ThemeKey;
  initialMode?: ShowcaseMode;
};

export function ShowcaseClient({
  content,
  activeTab,
  initialThemeKey = DEFAULT_THEME_KEY,
  initialMode = "light",
}: ShowcaseClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [themeKey, setThemeKey] = useState<ThemeKey>(initialThemeKey);
  const [mode, setMode] = useState<ShowcaseMode>(initialMode);
  const [uiSize, setUiSize] = useState<"sm" | "lg">("sm");
  const buttonThemes = ["base", "primary", "danger"] as const;
  const buttonVariants = ["text", "contained", "outlined"] as const;
  const [segmentedValue, setSegmentedValue] = useState<ShowcaseMode>("light");
  const [searchValue, setSearchValue] = useState("");
  const [emailValue, setEmailValue] = useState("john@");
  const [passwordValue, setPasswordValue] = useState("");
  const [selectValue, setSelectValue] = useState("react");
  const [selectSearchValue, setSelectSearchValue] = useState("typescript");
  const [autocompleteValue, setAutocompleteValue] = useState("");
  const [autocompleteSelection, setAutocompleteSelection] = useState("none");
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>(["react", "typescript"]);
  const [multiSelectDropdownValue, setMultiSelectDropdownValue] = useState<string[]>(["nextjs"]);
  const [keyboardEventLog, setKeyboardEventLog] = useState("none");
  const [menuAction, setMenuAction] = useState("none");
  const [manualMenuAction, setManualMenuAction] = useState("none");
  const [inlineMenuAction, setInlineMenuAction] = useState("none");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("none");
  const [profileName, setProfileName] = useState("Jane Doe");
  const [profileEmail, setProfileEmail] = useState("jane@example.com");
  const [profileRole, setProfileRole] = useState("Designer");
  const [profileSavedAt, setProfileSavedAt] = useState("never");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [switcherValues, setSwitcherValues] = useState({
    enabled: true,
  });
  const showcaseQuery = `theme=${themeKey}&mode=${mode}`;

  useEffect(() => {
    const currentTheme = searchParams.get("theme");
    const currentMode = searchParams.get("mode");

    if (currentTheme === themeKey && currentMode === mode) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("theme", themeKey);
    nextParams.set("mode", mode);
    router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
  }, [mode, pathname, router, searchParams, themeKey]);

  return (
    <div data-theme={themeKey} data-mode={mode} className="bg-bg text-text-main">
      <UIStickyHeader revealOnScrollUp>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">Showcase controls</p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <span>Theme</span>
              <UISegmentedControl
                ariaLabel="Showcase theme"
                value={themeKey}
                onValueChange={setThemeKey}
                options={THEME_OPTIONS.map((theme) => ({
                  value: theme.key,
                  label: theme.label,
                }))}
              />
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
              <span>Mode</span>
              <UISegmentedControl
                ariaLabel="Showcase mode"
                value={mode}
                onValueChange={setMode}
                options={[
                  { value: "light", label: "Light" },
                  { value: "dark", label: "Dark" },
                ]}
              />
            </div>

            {activeTab === "uikit" ? (
              <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                <span>Size</span>
                <UISegmentedControl
                  ariaLabel="UIKit size"
                  value={uiSize}
                  onValueChange={setUiSize}
                  options={[
                    { value: "sm", label: "Small" },
                    { value: "lg", label: "Large" },
                  ]}
                />
              </div>
            ) : null}
          </div>
        </div>
      </UIStickyHeader>

      <div className="px-4 pt-4">
        <div className="mx-auto w-full max-w-5xl">
          <UITabs
            ariaLabel="Showcase tabs"
            items={[
              { label: "UIKit", href: `/showcase/uikit?${showcaseQuery}`, active: activeTab === "uikit" },
              { label: "Sections", href: `/showcase/sections?${showcaseQuery}`, active: activeTab === "sections" },
            ]}
          />
        </div>
      </div>

      {activeTab === "uikit" ? (
        <section className="bg-bg px-4 py-8 text-text-main">
          <div className="mx-auto grid w-full max-w-5xl gap-8">
            <UICard title="Typography · Headings">
              <div className="grid gap-3">
                <div>
                  <h1 className="text-h1">Pride and Prejudice</h1>
                </div>
                <div>
                  <h2 className="text-h2 text-text-placeholder">Chapter I</h2>
                </div>
                <div>
                  <h3 className="text-h3">It is a truth universally acknowledged</h3>
                </div>
                <div>
                  <p>It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>
                </div>
              </div>
            </UICard>

            <UICard title="UIKit · Buttons">
              <p className="text-sm text-text-muted">
                Themes: <code>base</code>, <code>primary</code>, <code>danger</code> · Variants: <code>text</code>,{" "}
                <code>contained</code>, <code>outlined</code> · Sizes: <code>sm</code>, <code>lg</code>
              </p>

              {buttonThemes.map((buttonTheme) => (
                <div key={buttonTheme} className="grid gap-3">
                  {buttonVariants.map((variant) => (
                    <div key={`${buttonTheme}-${variant}`} className="flex flex-wrap items-center gap-3">
                      <UIButton
                        key={`${buttonTheme}-${variant}-${uiSize}`}
                        theme={buttonTheme}
                        variant={variant}
                        size={uiSize}
                      >
                        {buttonTheme} · {variant} · {uiSize}
                      </UIButton>
                    </div>
                  ))}
                </div>
              ))}

              <UIDivider spacing="md" stripped />


              <UIDivider spacing="sm" />
              <div className="grid gap-3">
                <p className="text-sm font-medium text-text-muted">With Icons</p>
                <div className="flex flex-wrap items-center gap-3">
                  <UIButton theme="primary" variant="contained" size={uiSize}>
                    <FiPlus aria-hidden className="h-4 w-4" />
                    <span>Create</span>
                  </UIButton>
                  <UIButton theme="base" variant="outlined" size={uiSize}>
                    <span>Continue</span>
                    <FiArrowRight aria-hidden className="h-4 w-4" />
                  </UIButton>
                  <UIButton
                    aria-label="Settings"
                    theme="base"
                    variant="text"
                    size={uiSize}
                    iconButton
                  >
                    <FiSettings aria-hidden className="h-4 w-4" />
                  </UIButton>
                </div>
              </div>

              <UIDivider spacing="md" />
              <div className="grid gap-3">
                <p className="text-sm font-medium text-text-muted">Block</p>
                <UIButton
                  theme="primary"
                  variant="contained"
                  size={uiSize}
                  block
                >
                  Primary Block Button
                </UIButton>
              </div>

              <UIDivider spacing="lg" />
              <div className="grid gap-3">
                <p className="text-sm font-medium text-text-muted">Disabled</p>
                <div className="flex flex-wrap items-center gap-3">
                  <UIButton theme="base" variant="contained" size={uiSize} disabled>
                    Base Disabled
                  </UIButton>
                  <UIButton
                    theme="primary"
                    variant="contained"
                    size={uiSize}
                    disabled
                  >
                    Primary Disabled
                  </UIButton>
                </div>
              </div>
            </UICard>

            <UICard title="UIKit · Badges">
              <p className="text-sm text-text-muted">
                Same themes as buttons, variants: <code>contained</code>, <code>outlined</code>, with fully rounded corners.
              </p>
              <div className="grid gap-3">
                {buttonThemes.map((badgeTheme) => (
                  <div key={badgeTheme} className="flex flex-wrap items-center gap-3">
                    {(["contained", "outlined"] as const).map((variant) => (
                      <UIBadge key={`${badgeTheme}-${variant}-ui`} theme={badgeTheme} variant={variant} size={uiSize}>
                        {badgeTheme} · {variant} · {uiSize}
                      </UIBadge>
                    ))}
                  </div>
                ))}

                <UIDivider spacing="sm" />
                <p className="text-sm font-medium text-text-muted">With Icons</p>
                <div className="flex flex-wrap items-center gap-3">
                  <UIBadge theme="primary" variant="contained" size={uiSize}>
                    <FiPlus aria-hidden className="h-4 w-4" />
                    <span>Create</span>
                  </UIBadge>
                  <UIBadge theme="base" variant="outlined" size={uiSize}>
                    <span>Status</span>
                    <FiSettings aria-hidden className="h-4 w-4" />
                  </UIBadge>
                  <UIBadge theme="danger" variant="contained" size={uiSize}>
                    <FiTrash2 aria-hidden className="h-4 w-4" />
                    <span>Danger</span>
                  </UIBadge>
                </div>
              </div>
            </UICard>

            <UICard title="UIKit · Checkbox">
              <div className="flex flex-wrap items-center gap-6">
                <UICheckbox defaultChecked label="Default checkbox" />
                <UICheckbox label="Unchecked checkbox" />
                <UICheckbox defaultChecked disabled label="Disabled" />
              </div>
            </UICard>

            <UICard title="UIKit · Switcher">
              <p className="text-sm text-text-muted">
                Single size
              </p>

              <div className="grid gap-3">
                <div className="flex flex-wrap items-center gap-6">
                  <UISwitcher
                    checked={switcherValues.enabled}
                    onCheckedChange={(checked) =>
                      setSwitcherValues((prev) => ({ ...prev, enabled: checked }))
                    }
                    label="Enabled"
                  />
                  <UISwitcher checked disabled label="Disabled" />
                </div>
              </div>
            </UICard>

            <UICard title="UIKit · Segmented Control">
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <p className="w-10 text-sm text-text-muted">sm</p>
                  <UISegmentedControl
                    ariaLabel="Mode small"
                    size="sm"
                    value={segmentedValue}
                    onValueChange={setSegmentedValue}
                    options={[
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                    ]}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <p className="w-10 text-sm text-text-muted">lg</p>
                  <UISegmentedControl
                    ariaLabel="Mode large"
                    size="lg"
                    value={segmentedValue}
                    onValueChange={setSegmentedValue}
                    options={[
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                    ]}
                  />
                </div>
                <p className="text-sm text-text-muted">Selected: {segmentedValue}</p>
              </div>
            </UICard>

            <UICard title="UIKit · Menu">
              <div className="grid gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <UIMenu
                    ariaLabel="Card actions"
                    placement="bottom-start"
                    size={uiSize}
                    onAction={setMenuAction}
                    items={[
                      { id: "edit", label: "Edit", textValue: "Edit", icon: <FiEdit2 aria-hidden className="h-4 w-4" /> },
                      {
                        id: "duplicate",
                        label: "Duplicate",
                        textValue: "Duplicate",
                        icon: <FiCopy aria-hidden className="h-4 w-4" />,
                      },
                      {
                        id: "archive",
                        label: "Archive",
                        textValue: "Archive",
                        icon: <FiArchive aria-hidden className="h-4 w-4" />,
                      },
                      {
                        id: "delete",
                        label: "Delete",
                        textValue: "Delete",
                        icon: <FiTrash2 aria-hidden className="h-4 w-4" />,
                        tone: "danger",
                      },
                    ]}
                    trigger={
                      <UIButton aria-label="Open menu" theme="base" variant="outlined" size={uiSize} iconButton>
                        <FiMoreVertical aria-hidden className="h-4 w-4" />
                      </UIButton>
                    }
                  />
                  <p className="text-sm text-text-muted">Dropdown action: {menuAction}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <UIMenu
                    ariaLabel="Card actions manual"
                    placement="bottom-start"
                    size={uiSize}
                    trigger={
                      <UIButton aria-label="Open manual menu" theme="base" variant="outlined" size={uiSize} iconButton>
                        <FiMoreVertical aria-hidden className="h-4 w-4" />
                      </UIButton>
                    }
                  >
                    <UIMenuLabel>Actions</UIMenuLabel>
                    <UIMenuItem icon={<FiEdit2 aria-hidden className="h-4 w-4" />} onSelect={() => setManualMenuAction("edit")}>
                      Edit
                    </UIMenuItem>
                    <UIMenuItem icon={<FiCopy aria-hidden className="h-4 w-4" />} onSelect={() => setManualMenuAction("duplicate")}>
                      Duplicate
                    </UIMenuItem>
                    <UIMenuSeparator />
                    <UIMenuLabel>Danger Zone</UIMenuLabel>
                    <UIMenuItem icon={<FiArchive aria-hidden className="h-4 w-4" />} onSelect={() => setManualMenuAction("archive")}>
                      Archive
                    </UIMenuItem>
                    <UIMenuItem
                      tone="danger"
                      icon={<FiTrash2 aria-hidden className="h-4 w-4" />}
                      onSelect={() => setManualMenuAction("delete")}
                    >
                      Delete
                    </UIMenuItem>
                  </UIMenu>
                  <p className="text-sm text-text-muted">Dropdown manual action: {manualMenuAction}</p>
                </div>

                <UIDivider spacing="sm" />

                <div className="grid gap-3">
                  <p className="text-sm font-medium text-text-muted">Inline Menu List (without Dropdown)</p>
                  <div className="max-w-56">
                    <div className="flex min-w-44 flex-col gap-[2px] rounded-xl border border-line bg-surface p-1" role="menu" aria-label="Inline card actions">
                      <UIMenuLabel size={uiSize}>Actions</UIMenuLabel>
                      <UIMenuItem size={uiSize} icon={<FiEdit2 aria-hidden className="h-4 w-4" />} closeOnSelect={false} onSelect={() => setInlineMenuAction("edit")}>
                        Edit
                      </UIMenuItem>
                      <UIMenuItem size={uiSize} icon={<FiCopy aria-hidden className="h-4 w-4" />} closeOnSelect={false} onSelect={() => setInlineMenuAction("duplicate")}>
                        Duplicate
                      </UIMenuItem>
                      <UIMenuSeparator />
                      <UIMenuLabel size={uiSize}>Danger Zone</UIMenuLabel>
                      <UIMenuItem size={uiSize} icon={<FiArchive aria-hidden className="h-4 w-4" />} closeOnSelect={false} onSelect={() => setInlineMenuAction("archive")}>
                        Archive
                      </UIMenuItem>
                      <UIMenuItem
                        size={uiSize}
                        tone="danger"
                        icon={<FiTrash2 aria-hidden className="h-4 w-4" />}
                        closeOnSelect={false}
                        onSelect={() => setInlineMenuAction("delete")}
                      >
                        Delete
                      </UIMenuItem>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted">Inline action: {inlineMenuAction}</p>
                </div>
              </div>
            </UICard>

            <UICard title="UIKit · Text Input">
              <div className="grid gap-4">
                <div className="max-w-xl">
                  <UITextInput
                    size={uiSize}
                    type="search"
                    placeholder="Search components..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                    clearable
                    onEnterPress={(value) => setKeyboardEventLog(`enter:${value}`)}
                    onEscapePress={(value) => setKeyboardEventLog(`escape:${value}`)}
                    prefix={<FiSearch aria-hidden className="h-4 w-4" />}
                  />
                </div>

                <div className="max-w-xl">
                  <UITextInput
                    size={uiSize}
                    type="email"
                    value={emailValue}
                    onValueChange={setEmailValue}
                    invalid
                    validationState="error"
                    placeholder="Email"
                    suffix={<FiEdit2 aria-hidden className="h-4 w-4" />}
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>

                <div className="max-w-xl">
                  <UITextInput
                    size={uiSize}
                    type="password"
                    value={passwordValue}
                    onValueChange={setPasswordValue}
                    placeholder="Password"
                    showPasswordToggle
                    clearable
                    autoComplete="current-password"
                  />
                </div>

                <div className="grid max-w-xl gap-3">
                  <UITextInput size={uiSize} value="Loading state" readOnly loading />
                  <UITextInput size={uiSize} value="Read-only state" readOnly />
                  <UITextInput size={uiSize} value="Disabled state" disabled />
                </div>

                <p className="text-sm text-text-muted">Keyboard event: {keyboardEventLog}</p>
              </div>
            </UICard>

            <UICard title="UIKit · Select">
              <div className="grid gap-4">
                <div className="max-w-xl">
                  <UISelect
                    size={uiSize}
                    value={selectValue}
                    onValueChange={setSelectValue}
                    placeholder="Pick framework"
                    options={[
                      { value: "react", label: "React", textValue: "react" },
                      { value: "nextjs", label: "Next.js", textValue: "next js" },
                      { value: "svelte", label: "Svelte", textValue: "svelte" },
                      { value: "vue", label: "Vue", textValue: "vue" },
                      { value: "solid", label: "Solid", textValue: "solid", disabled: true },
                    ]}
                  />
                </div>

                <div className="max-w-xl">
                  <UISelect
                    size={uiSize}
                    value={selectSearchValue}
                    onValueChange={setSelectSearchValue}
                    placeholder="Search and select language"
                    searchable
                    clearable
                    searchPlaceholder="Find language..."
                    options={[
                      { value: "typescript", label: "TypeScript", textValue: "typescript" },
                      { value: "javascript", label: "JavaScript", textValue: "javascript" },
                      { value: "go", label: "Go", textValue: "golang go" },
                      { value: "rust", label: "Rust", textValue: "rust" },
                      { value: "python", label: "Python", textValue: "python" },
                    ]}
                  />
                </div>

                <div className="max-w-xl">
                  <UISelect
                    size={uiSize}
                    placeholder="Invalid state"
                    invalid
                    validationState="error"
                    options={[
                      { value: "one", label: "Option one" },
                      { value: "two", label: "Option two" },
                    ]}
                  />
                </div>

                <p className="text-sm text-text-muted">
                  Selected: {selectValue} · Search select: {selectSearchValue}
                </p>
              </div>
            </UICard>

            <UICard title="UIKit · MultiSelect List">
              <div className="grid gap-4">
                <div className="max-w-xl">
                  <UIMultiSelectList
                    ariaLabel="Frameworks and tools"
                    searchable
                    searchPlaceholder="Search options..."
                    size={uiSize}
                    value={multiSelectValue}
                    onValueChange={setMultiSelectValue}
                    options={[
                      { value: "react", label: "React" },
                      { value: "nextjs", label: "Next.js", textValue: "next js" },
                      { value: "typescript", label: "TypeScript" },
                      { value: "tailwind", label: "Tailwind CSS" },
                      { value: "drizzle", label: "Drizzle ORM", disabled: true },
                    ]}
                  />
                </div>

                <p className="text-sm text-text-muted">
                  Selected: {multiSelectValue.length > 0 ? multiSelectValue.join(", ") : "none"}
                </p>
              </div>
            </UICard>

            <UICard title="UIKit · MultiSelect (Dropdown)">
              <div className="grid gap-4">
                <div className="max-w-xl">
                  <UIMultiSelect
                    ariaLabel="Frameworks and tools dropdown"
                    searchable
                    clearable
                    searchPlaceholder="Search options..."
                    size={uiSize}
                    value={multiSelectDropdownValue}
                    onValueChange={setMultiSelectDropdownValue}
                    options={[
                      { value: "react", label: "React" },
                      { value: "nextjs", label: "Next.js", textValue: "next js" },
                      { value: "typescript", label: "TypeScript" },
                      { value: "tailwind", label: "Tailwind CSS" },
                      { value: "drizzle", label: "Drizzle ORM", disabled: true },
                    ]}
                  />
                </div>

                <p className="text-sm text-text-muted">
                  Selected: {multiSelectDropdownValue.length > 0 ? multiSelectDropdownValue.join(", ") : "none"}
                </p>
              </div>
            </UICard>

            <UICard title="UIKit · Autocomplete">
              <div className="grid gap-4">
                <div className="max-w-xl">
                  <UIAutocomplete
                    ariaLabel="Framework autocomplete"
                    size={uiSize}
                    value={autocompleteValue}
                    onValueChange={setAutocompleteValue}
                    onSelect={(item) => setAutocompleteSelection(item.value)}
                    placeholder="Type to filter frameworks..."
                    clearable
                    items={[
                      { value: "react", label: "React" },
                      { value: "nextjs", label: "Next.js", textValue: "next js" },
                      { value: "svelte", label: "Svelte" },
                      { value: "vue", label: "Vue" },
                      { value: "solid", label: "Solid", disabled: true },
                    ]}
                  />
                </div>

                <div className="max-w-xl">
                  <UIAutocomplete
                    ariaLabel="Autocomplete invalid"
                    size={uiSize}
                    placeholder="Invalid state"
                    invalid
                    validationState="error"
                    items={[
                      { value: "typescript", label: "TypeScript" },
                      { value: "javascript", label: "JavaScript" },
                    ]}
                  />
                </div>

                <p className="text-sm text-text-muted">
                  Input: {autocompleteValue || "empty"} · Last selected: {autocompleteSelection}
                </p>
              </div>
            </UICard>

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
                      setProfileSavedAt(new Date().toLocaleTimeString());
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
          </div>
        </section>
      ) : null}

      {activeTab === "sections" ? (
        <ProjectRenderer
          name="Component Showcase"
          themeKey={themeKey}
          mode={mode}
          content={content}
          assets={[]}
          showPublishedBadge={false}
          showProjectMeta={false}
        />
      ) : null}
    </div>
  );
}
