"use client";

import { useState } from "react";

import { UIAccordion } from "@/components/ui/accordion";
import { UICard } from "@/components/ui/card";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "./types";

export function AccordionSection({ uiSize }: { uiSize: UiSize }) {
  const [value, setValue] = useState<string | null>("shipping");

  return (
    <UikitSectionAnchor id="controls-accordion">
      <UICard title="UIKit · Accordion">
        <div className="grid gap-4">
          <p className="text-sm text-text-muted">
            Single-open accordion for compact FAQs, settings groups, and disclosure blocks.
          </p>

          <UIAccordion
            ariaLabel="Shipping answers"
            size={uiSize}
            value={value}
            onValueChange={setValue}
            items={[
              {
                id: "shipping",
                title: "How does project publishing work?",
                description: "Draft stays private until you explicitly publish it.",
                content:
                  "Publishing makes the page available at its public slug. Unpublish returns the project to a private draft state without deleting the saved content.",
              },
              {
                id: "preview",
                title: "What is the difference between preview and public page?",
                description: "Preview can include unsaved draft content.",
                content:
                  "Preview opens a temporary draft-aware route. The public page only reflects the latest published version and ignores unsaved editor changes.",
              },
              {
                id: "themes",
                title: "Do theme and mode changes affect the saved content?",
                description: "Theme settings are project-level configuration.",
                content:
                  "Theme, mode policy, border radius, and spacing scale are stored as project settings. They are separate from per-block text and media content.",
              },
            ]}
          />
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}
