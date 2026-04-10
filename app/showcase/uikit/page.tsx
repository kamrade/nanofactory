import type { Metadata } from "next";

import { ShowcaseClient } from "@/app/showcase/showcase-client";
import { showcaseContent } from "@/app/showcase/showcase-content";

export const metadata: Metadata = {
  title: "UIKit Showcase · Nanofactory",
  description: "Internal UIKit showcase for Nanofactory components.",
};

export default function ShowcaseUIKitPage() {
  return <ShowcaseClient content={showcaseContent} activeTab="uikit" />;
}
