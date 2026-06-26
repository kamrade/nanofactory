import type { BlockVariantDefinition } from "../../shared/types";
import { ProjectsGalleryDefaultEditor } from "./editor";
import {
  createDefaultProjectsGalleryProps,
  readProjectsGalleryProps,
} from "./model";
import { ProjectsGalleryDefaultRender } from "./render";

export const projectsGalleryDefaultDefinition: BlockVariantDefinition = {
  type: "projects-gallery",
  typeLabel: "Projects Gallery",
  variant: "default",
  label: "Default",
  description: "Projects gallery with nested per-project image galleries.",
  fields: [
    {
      key: "sectionTitle",
      label: "Section title",
      kind: "text",
      placeholder: "Projects",
    },
    {
      key: "animate",
      label: "Animate title",
      kind: "boolean",
    },
  ],
  Editor: ProjectsGalleryDefaultEditor,
  createDefaultProps: createDefaultProjectsGalleryProps,
  normalizeProps: (input) => readProjectsGalleryProps(input),
  Renderer: ProjectsGalleryDefaultRender,
};
