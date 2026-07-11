import { UICard } from "@/components/ui/card";
import { TimelineDefaultRender } from "@/features/blocks/timeline/default/render";
import type { ProjectBorderRadiusPolicy } from "@/lib/projects/border-radius-policy";

import { UikitSectionAnchor } from "./section-anchor";
import type { UiSize } from "./types";

const demoTheme = {
  muted: "text-text-muted",
  buttonTone: "text-text-inverted-main",
  button: "bg-primary-300",
  kicker: "text-text-placeholder",
};

export function TimelineSection({
  uiSize,
  borderRadiusPolicy = "lg",
}: {
  uiSize: UiSize;
  borderRadiusPolicy?: ProjectBorderRadiusPolicy;
}) {
  return (
    <UikitSectionAnchor id="features-timeline">
      <UICard title="UIKit · Timeline">
        <div className="grid gap-4">
          <p className="text-sm text-text-muted">
            A compact timeline for roadmaps, onboarding flows, and step-by-step processes.
          </p>

          <TimelineDefaultRender
            block={{
              id: "timeline-demo",
              type: "timeline",
              variant: "default",
              props: {
                sectionTitle: "Our process",
                animate: true,
                items: [
                  {
                    meta: "Phase 01",
                    title: "Align on the scope",
                    content: "Define the outcome, the constraints, and the path users should take.",
                  },
                  {
                    meta: "Phase 02",
                    title: "Build the core flow",
                    content: "Turn the steps into a clear sequence with minimal friction between stages.",
                  },
                  {
                    meta: "Phase 03",
                    title: "Launch and iterate",
                    content: "Ship the first version, watch the drop-offs, and improve the weak spots.",
                  },
                ],
              },
            }}
            assetMap={new Map()}
            theme={demoTheme}
            mode="light"
            projectSpacingScale={uiSize === "sm" ? "sm" : "lg"}
            projectBorderRadiusPolicy={borderRadiusPolicy}
            projectSurfaceStyle="default"
          />
        </div>
      </UICard>
    </UikitSectionAnchor>
  );
}
