"use client";

import { UIButton } from "@/components/ui/button";
import { clamp, normalizeHex } from "@/components/assets/background-editor-shared";
import type { BackgroundSceneLayer } from "@/lib/background-scenes/types";

type LayerTypeControlsProps = {
  layer: BackgroundSceneLayer;
  onUpdateSelectedLayer: (
    updater: (layer: BackgroundSceneLayer) => BackgroundSceneLayer
  ) => void;
};

export function LayerTypeControls({
  layer,
  onUpdateSelectedLayer,
}: LayerTypeControlsProps) {
  if (layer.type === "stripes") {
    return (
      <>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Stripe color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={layer.config.stripeColor}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "stripes") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      stripeColor: normalizeHex(event.target.value, candidate.config.stripeColor),
                    },
                  };
                })
              }
              className="h-9 w-11 rounded border border-line bg-transparent p-1"
            />
            <input
              type="text"
              value={layer.config.stripeColor}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "stripes") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      stripeColor: normalizeHex(event.target.value, candidate.config.stripeColor),
                    },
                  };
                })
              }
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </div>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">
            Stripe width: {layer.config.stripeWidth}
          </span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={80}
              value={layer.config.stripeWidth}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "stripes") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      stripeWidth: clamp(Number(event.target.value), 1, 80),
                    },
                  };
                })
              }
              className="w-full accent-primary-300"
            />
            <input
              type="number"
              min={1}
              max={80}
              value={layer.config.stripeWidth}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "stripes") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      stripeWidth: clamp(Number(event.target.value || 1), 1, 80),
                    },
                  };
                })
              }
              className="w-20 rounded-xl border border-line bg-surface px-2 py-1.5 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </div>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">
            Gap width: {layer.config.gapWidth}
          </span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={80}
              value={layer.config.gapWidth}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "stripes") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      gapWidth: clamp(Number(event.target.value), 1, 80),
                    },
                  };
                })
              }
              className="w-full accent-primary-300"
            />
            <input
              type="number"
              min={1}
              max={80}
              value={layer.config.gapWidth}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "stripes") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      gapWidth: clamp(Number(event.target.value || 1), 1, 80),
                    },
                  };
                })
              }
              className="w-20 rounded-xl border border-line bg-surface px-2 py-1.5 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </div>
        </label>

        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Angle: {layer.config.angle}°</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={180}
              value={layer.config.angle}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "stripes") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      angle: clamp(Number(event.target.value), 0, 180),
                    },
                  };
                })
              }
              className="w-full accent-primary-300"
            />
            <input
              type="number"
              min={0}
              max={180}
              value={layer.config.angle}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "stripes") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      angle: clamp(Number(event.target.value || 0), 0, 180),
                    },
                  };
                })
              }
              className="w-20 rounded-xl border border-line bg-surface px-2 py-1.5 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[0, 45, 90, 135].map((anglePreset) => (
              <UIButton
                key={anglePreset}
                type="button"
                theme="base"
                variant="outlined"
                size="sm"
                onClick={() =>
                  onUpdateSelectedLayer((candidate) => {
                    if (candidate.type !== "stripes") {
                      return candidate;
                    }

                    return {
                      ...candidate,
                      config: {
                        ...candidate.config,
                        angle: anglePreset,
                      },
                    };
                  })
                }
              >
                {anglePreset}°
              </UIButton>
            ))}
          </div>
        </label>
      </>
    );
  }

  if (layer.type === "dots") {
    return (
      <>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Dot color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={layer.config.dotColor}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "dots") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      dotColor: normalizeHex(event.target.value, candidate.config.dotColor),
                    },
                  };
                })
              }
              className="h-9 w-11 rounded border border-line bg-transparent p-1"
            />
            <input
              type="text"
              value={layer.config.dotColor}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "dots") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      dotColor: normalizeHex(event.target.value, candidate.config.dotColor),
                    },
                  };
                })
              }
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </div>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Dot size: {layer.config.dotSize}</span>
          <input
            type="range"
            min={1}
            max={20}
            value={layer.config.dotSize}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "dots") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: { ...candidate.config, dotSize: clamp(Number(event.target.value), 1, 20) },
                };
              })
            }
            className="w-full accent-primary-300"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Gap: {layer.config.gap}</span>
          <input
            type="range"
            min={4}
            max={80}
            value={layer.config.gap}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "dots") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: { ...candidate.config, gap: clamp(Number(event.target.value), 4, 80) },
                };
              })
            }
            className="w-full accent-primary-300"
          />
        </label>
      </>
    );
  }

  if (layer.type === "grid") {
    return (
      <>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Line color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={layer.config.lineColor}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "grid") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      lineColor: normalizeHex(event.target.value, candidate.config.lineColor),
                    },
                  };
                })
              }
              className="h-9 w-11 rounded border border-line bg-transparent p-1"
            />
            <input
              type="text"
              value={layer.config.lineColor}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "grid") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      lineColor: normalizeHex(event.target.value, candidate.config.lineColor),
                    },
                  };
                })
              }
              className="w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </div>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Line width: {layer.config.lineWidth}</span>
          <input
            type="range"
            min={1}
            max={8}
            value={layer.config.lineWidth}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "grid") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: {
                    ...candidate.config,
                    lineWidth: clamp(Number(event.target.value), 1, 8),
                  },
                };
              })
            }
            className="w-full accent-primary-300"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Cell size: {layer.config.cellSize}</span>
          <input
            type="range"
            min={8}
            max={120}
            value={layer.config.cellSize}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "grid") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: {
                    ...candidate.config,
                    cellSize: clamp(Number(event.target.value), 8, 120),
                  },
                };
              })
            }
            className="w-full accent-primary-300"
          />
        </label>
      </>
    );
  }

  if (layer.type === "gradient") {
    return (
      <>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Color A</span>
          <input
            type="color"
            value={layer.config.colorA}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "gradient") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: {
                    ...candidate.config,
                    colorA: normalizeHex(event.target.value, candidate.config.colorA),
                  },
                };
              })
            }
            className="h-9 w-11 rounded border border-line bg-transparent p-1"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Color B</span>
          <input
            type="color"
            value={layer.config.colorB}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "gradient") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: {
                    ...candidate.config,
                    colorB: normalizeHex(event.target.value, candidate.config.colorB),
                  },
                };
              })
            }
            className="h-9 w-11 rounded border border-line bg-transparent p-1"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Angle: {layer.config.angle}°</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={180}
              value={layer.config.angle}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "gradient") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      angle: clamp(Number(event.target.value), 0, 180),
                    },
                  };
                })
              }
              className="w-full accent-primary-300"
            />
            <input
              type="number"
              min={0}
              max={180}
              value={layer.config.angle}
              onChange={(event) =>
                onUpdateSelectedLayer((candidate) => {
                  if (candidate.type !== "gradient") {
                    return candidate;
                  }

                  return {
                    ...candidate,
                    config: {
                      ...candidate.config,
                      angle: clamp(Number(event.target.value || 0), 0, 180),
                    },
                  };
                })
              }
              className="w-20 rounded-xl border border-line bg-surface px-2 py-1.5 text-sm text-text-main outline-none transition focus:ring-2 focus:ring-focus/50"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[0, 45, 90, 135].map((anglePreset) => (
              <UIButton
                key={anglePreset}
                type="button"
                theme="base"
                variant="outlined"
                size="sm"
                onClick={() =>
                  onUpdateSelectedLayer((candidate) => {
                    if (candidate.type !== "gradient") {
                      return candidate;
                    }

                    return {
                      ...candidate,
                      config: {
                        ...candidate.config,
                        angle: anglePreset,
                      },
                    };
                  })
                }
              >
                {anglePreset}°
              </UIButton>
            ))}
          </div>
        </label>
      </>
    );
  }

  if (layer.type === "glow") {
    return (
      <>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Glow color</span>
          <input
            type="color"
            value={layer.config.glowColor}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "glow") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: {
                    ...candidate.config,
                    glowColor: normalizeHex(event.target.value, candidate.config.glowColor),
                  },
                };
              })
            }
            className="h-9 w-11 rounded border border-line bg-transparent p-1"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">X position: {layer.config.x}%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={layer.config.x}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "glow") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: { ...candidate.config, x: clamp(Number(event.target.value), 0, 100) },
                };
              })
            }
            className="w-full accent-primary-300"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Y position: {layer.config.y}%</span>
          <input
            type="range"
            min={0}
            max={100}
            value={layer.config.y}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "glow") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: { ...candidate.config, y: clamp(Number(event.target.value), 0, 100) },
                };
              })
            }
            className="w-full accent-primary-300"
          />
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium text-text-main">Radius: {layer.config.radius}%</span>
          <input
            type="range"
            min={5}
            max={100}
            value={layer.config.radius}
            onChange={(event) =>
              onUpdateSelectedLayer((candidate) => {
                if (candidate.type !== "glow") {
                  return candidate;
                }

                return {
                  ...candidate,
                  config: {
                    ...candidate.config,
                    radius: clamp(Number(event.target.value), 5, 100),
                  },
                };
              })
            }
            className="w-full accent-primary-300"
          />
        </label>
      </>
    );
  }

  return (
    <>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Intensity: {layer.config.intensity}</span>
        <input
          type="range"
          min={10}
          max={255}
          value={layer.config.intensity}
          onChange={(event) =>
            onUpdateSelectedLayer((candidate) => {
              if (candidate.type !== "noise") {
                return candidate;
              }

              return {
                ...candidate,
                config: {
                  ...candidate.config,
                  intensity: clamp(Number(event.target.value), 10, 255),
                },
              };
            })
          }
          className="w-full accent-primary-300"
        />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium text-text-main">Size: {layer.config.size}</span>
        <input
          type="range"
          min={40}
          max={240}
          value={layer.config.size}
          onChange={(event) =>
            onUpdateSelectedLayer((candidate) => {
              if (candidate.type !== "noise") {
                return candidate;
              }

              return {
                ...candidate,
                config: { ...candidate.config, size: clamp(Number(event.target.value), 40, 240) },
              };
            })
          }
          className="w-full accent-primary-300"
        />
      </label>
    </>
  );
}
