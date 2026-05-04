import type { BlockRenderProps } from "../../shared/types";

export function CtaDefaultRender({ block, theme }: BlockRenderProps) {
  const title = typeof block.props.title === "string" ? block.props.title : "";
  const buttonText =
    typeof block.props.buttonText === "string" ? block.props.buttonText : "";

  return (
    <section className="space-y-5 text-center p-4 md:p-8">
      <h2 className="break-words text-3xl font-semibold tracking-tight">{title}</h2>
      <div>
        <span className={theme.button}>{buttonText}</span>
      </div>
    </section>
  );
}
