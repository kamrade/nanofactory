export type BackgroundSceneLayerType =
  | "stripes"
  | "dots"
  | "grid"
  | "gradient"
  | "glow"
  | "noise";

type BackgroundSceneLayerBase = {
  id: string;
  type: BackgroundSceneLayerType;
  name: string;
  visible: boolean;
  opacity: number;
};

export type StripesLayer = BackgroundSceneLayerBase & {
  type: "stripes";
  config: {
    stripeColor: string;
    stripeWidth: number;
    gapWidth: number;
    angle: number;
  };
};

export type DotsLayer = BackgroundSceneLayerBase & {
  type: "dots";
  config: {
    dotColor: string;
    dotSize: number;
    gap: number;
  };
};

export type GridLayer = BackgroundSceneLayerBase & {
  type: "grid";
  config: {
    lineColor: string;
    lineWidth: number;
    cellSize: number;
  };
};

export type GradientLayer = BackgroundSceneLayerBase & {
  type: "gradient";
  config: {
    colorA: string;
    colorB: string;
    angle: number;
  };
};

export type GlowLayer = BackgroundSceneLayerBase & {
  type: "glow";
  config: {
    glowColor: string;
    x: number;
    y: number;
    radius: number;
  };
};

export type NoiseLayer = BackgroundSceneLayerBase & {
  type: "noise";
  config: {
    intensity: number;
    size: number;
  };
};

export type BackgroundSceneLayer =
  | StripesLayer
  | DotsLayer
  | GridLayer
  | GradientLayer
  | GlowLayer
  | NoiseLayer;

export type BackgroundScene = {
  version: 1;
  id: string;
  name: string;
  canvas: {
    backgroundColor: string;
    width: number;
    height: number;
  };
  layers: BackgroundSceneLayer[];
};

export type BackgroundSceneRecord = {
  id: string;
  projectId: string;
  name: string;
  sceneJson: BackgroundScene;
  createdAt: Date;
  updatedAt: Date;
};
