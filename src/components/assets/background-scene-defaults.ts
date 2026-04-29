import type { BackgroundScene } from "@/lib/background-scenes/types";
import type {
  DotsLayer,
  GlowLayer,
  GradientLayer,
  GridLayer,
  NoiseLayer,
  StripesLayer,
} from "@/lib/background-scenes/types";
import type { ThemeKey } from "@/lib/themes";
import type { UiMode } from "@/lib/ui-preferences";

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export type BackgroundDefaultsPalette = {
  canvasBackgroundColor: string;
  layerForegroundColor: string;
  gradientA: string;
  gradientB: string;
  colorChoices: Array<{ token: string; value: string }>;
};

type BackgroundDefaultsInput = {
  themeKey: ThemeKey;
  mode: UiMode;
};

export function getBackgroundDefaultsPalette({
  themeKey,
  mode,
}: BackgroundDefaultsInput): BackgroundDefaultsPalette {
  if (themeKey === "nightfall") {
    return mode === "dark"
      ? {
          canvasBackgroundColor: "#0b1020",
          layerForegroundColor: "#d9e0ff",
          gradientA: "#5b7cfa",
          gradientB: "#39d0ff",
          colorChoices: [
            { token: "Canvas / Base", value: "#0b1020" },
            { token: "Canvas / Elevated", value: "#1f2b52" },
            { token: "Foreground / Soft", value: "#d9e0ff" },
            { token: "Gradient / A", value: "#5b7cfa" },
            { token: "Gradient / B", value: "#39d0ff" },
            { token: "Accent / Lift", value: "#93a4ff" },
          ],
        }
      : {
          canvasBackgroundColor: "#dbe7ff",
          layerForegroundColor: "#243b73",
          gradientA: "#7aa2ff",
          gradientB: "#67e8f9",
          colorChoices: [
            { token: "Canvas / Base", value: "#dbe7ff" },
            { token: "Canvas / Elevated", value: "#f1f5ff" },
            { token: "Foreground / Soft", value: "#243b73" },
            { token: "Gradient / A", value: "#7aa2ff" },
            { token: "Gradient / B", value: "#67e8f9" },
            { token: "Accent / Lift", value: "#2563eb" },
          ],
        };
  }

  return mode === "dark"
    ? {
        canvasBackgroundColor: "#2f2417",
        layerForegroundColor: "#fff3dd",
        gradientA: "#f59e0b",
        gradientB: "#f97316",
        colorChoices: [
          { token: "Canvas / Base", value: "#2f2417" },
          { token: "Canvas / Elevated", value: "#4a3520" },
          { token: "Foreground / Soft", value: "#fff3dd" },
          { token: "Gradient / A", value: "#f59e0b" },
          { token: "Gradient / B", value: "#f97316" },
          { token: "Accent / Lift", value: "#fdba74" },
        ],
      }
    : {
        canvasBackgroundColor: "#f6ead9",
        layerForegroundColor: "#6b4a22",
        gradientA: "#f59e0b",
        gradientB: "#fb7185",
        colorChoices: [
          { token: "Canvas / Base", value: "#f6ead9" },
          { token: "Canvas / Elevated", value: "#fef3c7" },
          { token: "Foreground / Soft", value: "#6b4a22" },
          { token: "Gradient / A", value: "#f59e0b" },
          { token: "Gradient / B", value: "#fb7185" },
          { token: "Accent / Lift", value: "#fdba74" },
        ],
      };
}

export function createDefaultStripesLayer(
  palette: BackgroundDefaultsPalette
): StripesLayer {
  return {
    id: createId("layer"),
    type: "stripes" as const,
    name: "Stripes 45°",
    visible: true,
    opacity: 0.35,
    config: {
      stripeColor: palette.layerForegroundColor,
      stripeWidth: 12,
      gapWidth: 12,
      angle: 45,
    },
  };
}

export function createDefaultDotsLayer(palette: BackgroundDefaultsPalette): DotsLayer {
  return {
    id: createId("layer"),
    type: "dots",
    name: "Dots",
    visible: true,
    opacity: 0.28,
    config: {
      dotColor: palette.layerForegroundColor,
      dotSize: 4,
      gap: 20,
    },
  };
}

export function createDefaultGridLayer(palette: BackgroundDefaultsPalette): GridLayer {
  return {
    id: createId("layer"),
    type: "grid",
    name: "Grid",
    visible: true,
    opacity: 0.25,
    config: {
      lineColor: palette.layerForegroundColor,
      lineWidth: 1,
      cellSize: 28,
    },
  };
}

export function createDefaultGradientLayer(
  palette: BackgroundDefaultsPalette
): GradientLayer {
  return {
    id: createId("layer"),
    type: "gradient",
    name: "Gradient",
    visible: true,
    opacity: 0.5,
    config: {
      colorA: palette.gradientA,
      colorB: palette.gradientB,
      angle: 135,
    },
  };
}

export function createDefaultGlowLayer(palette: BackgroundDefaultsPalette): GlowLayer {
  return {
    id: createId("layer"),
    type: "glow",
    name: "Glow",
    visible: true,
    opacity: 0.42,
    config: {
      glowColor: palette.layerForegroundColor,
      x: 50,
      y: 35,
      radius: 42,
    },
  };
}

export function createDefaultNoiseLayer(): NoiseLayer {
  return {
    id: createId("layer"),
    type: "noise",
    name: "Noise",
    visible: true,
    opacity: 0.14,
    config: {
      intensity: 100,
      size: 140,
    },
  };
}

export function createDefaultBackgroundScene(
  input: BackgroundDefaultsInput
): BackgroundScene {
  const palette = getBackgroundDefaultsPalette(input);
  return {
    version: 1,
    id: createId("bg"),
    name: "Untitled Background",
    canvas: {
      backgroundColor: palette.canvasBackgroundColor,
      width: 1200,
      height: 630,
    },
    layers: [createDefaultStripesLayer(palette)],
  };
}

type PaletteColorChoice = BackgroundDefaultsPalette["colorChoices"][number];

function findTokenByColor(value: string): string | null {
  const normalized = value.toLowerCase();
  const themes: ThemeKey[] = ["sunwash", "nightfall"];
  const modes: UiMode[] = ["light", "dark"];

  for (const themeKey of themes) {
    for (const mode of modes) {
      const palette = getBackgroundDefaultsPalette({ themeKey, mode });
      const match = palette.colorChoices.find(
        (option) => option.value.toLowerCase() === normalized
      );
      if (match) {
        return match.token;
      }
    }
  }

  return null;
}

function resolveColorByToken(
  currentColor: string,
  fallback: string,
  targetChoices: PaletteColorChoice[]
) {
  const token = findTokenByColor(currentColor);
  if (!token) {
    return fallback;
  }

  return targetChoices.find((choice) => choice.token === token)?.value ?? fallback;
}

export function remapSceneToPalette(
  scene: BackgroundScene,
  input: BackgroundDefaultsInput
): BackgroundScene {
  const targetPalette = getBackgroundDefaultsPalette(input);

  return {
    ...scene,
    canvas: {
      ...scene.canvas,
      backgroundColor: resolveColorByToken(
        scene.canvas.backgroundColor,
        targetPalette.canvasBackgroundColor,
        targetPalette.colorChoices
      ),
    },
    layers: scene.layers.map((layer) => {
      if (layer.type === "stripes") {
        return {
          ...layer,
          config: {
            ...layer.config,
            stripeColor: resolveColorByToken(
              layer.config.stripeColor,
              targetPalette.layerForegroundColor,
              targetPalette.colorChoices
            ),
          },
        };
      }
      if (layer.type === "dots") {
        return {
          ...layer,
          config: {
            ...layer.config,
            dotColor: resolveColorByToken(
              layer.config.dotColor,
              targetPalette.layerForegroundColor,
              targetPalette.colorChoices
            ),
          },
        };
      }
      if (layer.type === "grid") {
        return {
          ...layer,
          config: {
            ...layer.config,
            lineColor: resolveColorByToken(
              layer.config.lineColor,
              targetPalette.layerForegroundColor,
              targetPalette.colorChoices
            ),
          },
        };
      }
      if (layer.type === "gradient") {
        return {
          ...layer,
          config: {
            ...layer.config,
            colorA: resolveColorByToken(
              layer.config.colorA,
              targetPalette.gradientA,
              targetPalette.colorChoices
            ),
            colorB: resolveColorByToken(
              layer.config.colorB,
              targetPalette.gradientB,
              targetPalette.colorChoices
            ),
          },
        };
      }
      if (layer.type === "glow") {
        return {
          ...layer,
          config: {
            ...layer.config,
            glowColor: resolveColorByToken(
              layer.config.glowColor,
              targetPalette.layerForegroundColor,
              targetPalette.colorChoices
            ),
          },
        };
      }
      return layer;
    }),
  };
}
