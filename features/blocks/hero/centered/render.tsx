import Image from "next/image";

import { resolveAssetById } from "@/lib/assets/resolution";

import type { BlockRenderProps } from "../../shared/types";

export function HeroCenteredRender({ block, assetMap, theme }: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const subtitle =
    typeof block.props.subtitle === "string" ? block.props.subtitle : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";
  const heroImageAsset = resolveAssetById(block.props.imageAssetId, assetMap);

  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
      {heroImageAsset ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface-alt shadow-sm">
          <Image
            src={heroImageAsset.publicUrl}
            alt={heroImageAsset.alt ?? heroImageAsset.originalFilename}
            width={1200}
            height={720}
            unoptimized
            className="h-72 w-full object-cover"
          />
        </div>
      ) : null}

      <div className="space-y-5">
        <p className="text-text-placeholder text-sm font-medium uppercase tracking-[0.22em]">
          Hero
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>
        <p className={`mx-auto max-w-2xl text-base leading-7 ${theme.muted}`}>{subtitle}</p>
        <div>
          <span className={theme.button}>{buttonText}</span>
        </div>
      </div>
    </section>
  );
}
