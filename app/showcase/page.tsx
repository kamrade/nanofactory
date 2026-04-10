import type { Metadata } from "next";

import type { PageContent } from "@/db/schema";
import { ShowcaseClient } from "@/app/showcase/showcase-client";

const showcaseContent: PageContent = {
  blocks: [
    {
      id: "showcase-hero-default",
      type: "hero",
      variant: "default",
      props: {
        title: "Hero · Split image",
        subtitle:
          "Default hero variant with left-aligned copy and image area on the right.",
        buttonText: "Explore",
        imageAssetId: undefined,
      },
    },
    {
      id: "showcase-hero-centered",
      type: "hero",
      variant: "centered",
      props: {
        title: "Hero · Centered",
        subtitle:
          "Centered hero variant for compact messaging and one primary call to action.",
        buttonText: "See centered variant",
        imageAssetId: undefined,
      },
    },
    {
      id: "showcase-features-default",
      type: "features",
      variant: "default",
      props: {
        sectionTitle: "Features · Default list",
        items: [
          "Clean stacked layout for quick scannability",
          "Keeps copy-first pages easy to maintain",
          "Works well as a supporting section after hero",
        ],
      },
    },
    {
      id: "showcase-features-cards",
      type: "features",
      variant: "cards",
      props: {
        sectionTitle: "Features · Cards",
        items: [
          "Card-based visual grouping for key points",
          "Balanced spacing and readable item rhythm",
          "Designed for short, high-signal feature copy",
        ],
      },
    },
    {
      id: "showcase-cta-default",
      type: "cta",
      variant: "default",
      props: {
        title: "Call to action · Default",
        buttonText: "Start building",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "Component Showcase · Nanofactory",
  description: "Internal showcase page for implemented Nanofactory blocks and variants.",
};

export default function ShowcasePage() {
  return <ShowcaseClient content={showcaseContent} />;
}
