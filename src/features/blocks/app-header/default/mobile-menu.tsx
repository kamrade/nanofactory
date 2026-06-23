"use client";

import { useState, type ReactNode } from "react";
import { FiMenu, FiX } from "react-icons/fi";

import { ProjectModeSwitcher } from "@/components/projects/project-mode-switcher";
import type { AppHeaderMenuItem, AppHeaderSocialLink } from "./model";
import type { SocialIconKey } from "./social-icons";
import { renderSocialIcon } from "./social-icon-components";
import styles from "./render.module.css";

type MobileMenuProps = {
  menuItems: AppHeaderMenuItem[];
  socialLinks: AppHeaderSocialLink[];
  canShowModeSwitcher: boolean;
  initialMode: "light" | "dark";
  modePolicy: "switchable" | "light-only" | "dark-only";
  children: ReactNode;
};

export function MobileMenu({
  menuItems,
  socialLinks,
  canShowModeSwitcher,
  initialMode,
  modePolicy,
  children,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div data-testid="MobileHeader" className={styles.mobileHeader}>
        <button
          type="button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          className={styles.mobileMenuButton}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen
            ? <FiX aria-hidden className="h-5 w-5" />
            : <FiMenu aria-hidden className="h-5 w-5" />}
        </button>

        <div className={styles.mobileLogoWrap}>
          {children}
        </div>
      </div>

      <div
        data-testid="MobileMenu"
        data-open={isOpen ? "true" : "false"}
        aria-hidden={!isOpen}
        className={styles.mobileMenu}
      >
        <div className={styles.mobilePanel}>
          <div className={styles.mobilePanelGrid}>
            {menuItems.length > 0 ? (
              <nav aria-label="Mobile page sections">
                <ul className={styles.mobileNavList}>
                  {menuItems.map((item, index) => (
                    <li key={`${item.anchorId}-${item.label}-mobile-${index}`}>
                      <a
                        href={`#${item.anchorId}`}
                        className={styles.navLink}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}

            {socialLinks.length > 0 ? (
              <div className={styles.mobileSocialWrap}>
                {socialLinks.map((item, index) => (
                  <a
                    key={`${item.url}-${item.label}-mobile-${index}`}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.socialLink}
                  >
                    {renderSocialIcon(item.icon as SocialIconKey)}
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}

            {canShowModeSwitcher ? (
              <div className={styles.mobileModeWrap}>
                <ProjectModeSwitcher
                  initialMode={initialMode}
                  syncSearchParam="mode"
                  policy={modePolicy}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
