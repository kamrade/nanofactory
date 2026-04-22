import type { CSSProperties } from "react";

import type { BackgroundScene } from "@/lib/background-scenes/types";

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.trim().replace("#", "");
  const safeHex =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalized;
  const value = Number.parseInt(safeHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha))})`;
}

type LayerPaint = {
  image: string;
  size?: string;
  position?: string;
  repeat?: string;
};

function getLayerPaints(layer: BackgroundScene["layers"][number]): LayerPaint[] {
  if (!layer.visible || layer.opacity <= 0) {
    return [];
  }

  if (layer.type === "stripes") {
    const { stripeColor, stripeWidth, gapWidth, angle } = layer.config;
    const stripe = Math.max(1, stripeWidth);
    const gap = Math.max(1, gapWidth);
    const tinted = hexToRgba(stripeColor, layer.opacity);

    return [
      {
        image: `repeating-linear-gradient(${angle}deg, ${tinted} 0 ${stripe}px, transparent ${stripe}px ${stripe + gap}px)`,
        repeat: "repeat",
      },
    ];
  }

  if (layer.type === "dots") {
    const { dotColor, dotSize, gap } = layer.config;
    const tinted = hexToRgba(dotColor, layer.opacity);
    const pitch = Math.max(2, gap);
    const radius = Math.max(1, dotSize);

    return [
      {
        image: `radial-gradient(circle, ${tinted} ${radius}px, transparent ${radius + 1}px)`,
        size: `${pitch}px ${pitch}px`,
        position: "0 0",
        repeat: "repeat",
      },
    ];
  }

  if (layer.type === "grid") {
    const { lineColor, lineWidth, cellSize } = layer.config;
    const tinted = hexToRgba(lineColor, layer.opacity);
    const width = Math.max(1, lineWidth);
    const size = Math.max(width + 2, cellSize);

    return [
      {
        image: `linear-gradient(${tinted} ${width}px, transparent ${width}px)`,
        size: `${size}px ${size}px`,
        position: "0 0",
        repeat: "repeat",
      },
      {
        image: `linear-gradient(90deg, ${tinted} ${width}px, transparent ${width}px)`,
        size: `${size}px ${size}px`,
        position: "0 0",
        repeat: "repeat",
      },
    ];
  }

  if (layer.type === "gradient") {
    const { colorA, colorB, angle } = layer.config;
    return [
      {
        image: `linear-gradient(${angle}deg, ${hexToRgba(colorA, layer.opacity)}, ${hexToRgba(colorB, layer.opacity)})`,
        repeat: "no-repeat",
      },
    ];
  }

  if (layer.type === "glow") {
    const { glowColor, x, y, radius } = layer.config;
    return [
      {
        image: `radial-gradient(circle at ${x}% ${y}%, ${hexToRgba(
          glowColor,
          layer.opacity
        )} 0%, transparent ${Math.max(5, radius)}%)`,
        repeat: "no-repeat",
      },
    ];
  }

  if (layer.type === "noise") {
    const { intensity, size } = layer.config;
    const alpha = Math.max(0.02, Math.min(0.4, (intensity / 255) * layer.opacity));
    const pitch = Math.max(40, size);
    return [
      {
        image: `repeating-radial-gradient(circle at 0 0, rgba(255,255,255,${alpha}) 0 1px, transparent 1px ${pitch}px)`,
        repeat: "repeat",
      },
    ];
  }

  return [];
}

export function buildBackgroundSceneStyle(scene: BackgroundScene): CSSProperties {
  const paints = scene.layers.flatMap((layer) => getLayerPaints(layer));

  const images = paints.map((paint) => paint.image);
  const sizes = paints.map((paint) => paint.size ?? "auto");
  const positions = paints.map((paint) => paint.position ?? "0% 0%");
  const repeats = paints.map((paint) => paint.repeat ?? "repeat");

  return {
    backgroundColor: scene.canvas.backgroundColor,
    backgroundImage: images.length > 0 ? images.join(", ") : undefined,
    backgroundSize: sizes.length > 0 ? sizes.join(", ") : undefined,
    backgroundPosition: positions.length > 0 ? positions.join(", ") : undefined,
    backgroundRepeat: repeats.length > 0 ? repeats.join(", ") : undefined,
  };
}
