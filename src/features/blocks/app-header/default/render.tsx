import type { BlockRenderProps } from "../../shared/types";

export function AppHeaderDefaultRender({ block, theme }: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const subtitle = typeof block.props.subtitle === "string" ? block.props.subtitle : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";

  return (
    <section className="space-y-5">
      <p className={`text-sm font-medium uppercase tracking-[0.18em] ${theme.kicker}`}>
        App Header
      </p>
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className={`max-w-2xl text-base leading-7 ${theme.muted}`}>{subtitle}</p>
      <div>
        <span className={theme.button}>{buttonText}</span>
      </div>
    </section>
  );
}
