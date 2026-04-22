import { buildBackgroundSceneStyle } from "@/lib/background-scenes/css";
import type { BackgroundScene } from "@/lib/background-scenes/types";

type BackgroundRendererProps = {
  scene: BackgroundScene;
};

export function BackgroundRenderer({ scene }: BackgroundRendererProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0"
      style={buildBackgroundSceneStyle(scene)}
    />
  );
}
