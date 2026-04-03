import Image from "next/image";

import { resolveAssetById } from "@/lib/assets/resolution";

import type { BlockRenderProps } from "../../shared/types";

export function HeroDefaultRender({ block, assetMap, theme }: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const subtitle =
    typeof block.props.subtitle === "string" ? block.props.subtitle : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";
  const heroImageAsset = resolveAssetById(block.props.imageAssetId, assetMap);

  return (
    <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="space-y-5">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-zinc-500">
          Hero
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className={`max-w-3xl text-base leading-7 ${theme.muted}`}>{subtitle}</p>
        <div>
          <span className={theme.button}>{buttonText}</span>
        </div>
      </div>

      {heroImageAsset ? (
        <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-zinc-100 shadow-sm">
          <Image
            src={heroImageAsset.publicUrl}
            alt={heroImageAsset.alt ?? heroImageAsset.originalFilename}
            width={1200}
            height={900}
            unoptimized
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}
