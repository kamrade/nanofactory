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
  fields: [],
  Editor: ProjectsGalleryDefaultEditor,
  createDefaultProps: createDefaultProjectsGalleryProps,
  normalizeProps: (input) => readProjectsGalleryProps(input),
  Renderer: ProjectsGalleryDefaultRender,
};

