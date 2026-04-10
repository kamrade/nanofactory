import type { Metadata } from "next";

import { ShowcaseClient } from "@/app/showcase/showcase-client";
import { showcaseContent } from "@/app/showcase/showcase-content";

export const metadata: Metadata = {
  title: "Sections Showcase · Nanofactory",
  description: "Internal sections showcase for Nanofactory page blocks.",
};

export default function ShowcaseSectionsPage() {
  return <ShowcaseClient content={showcaseContent} activeTab="sections" />;
}
