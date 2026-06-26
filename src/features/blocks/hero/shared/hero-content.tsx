import { HeroHeadline } from "./hero-headline";

type HeroContentProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAnchor: string;
  animateMainText: boolean;
  contentStackClassName: string;
  eyebrowClassName: string;
  headingGroupClassName?: string;
  headingClassName: string;
  subtitleClassName: string;
  buttonClassName: string;
  buttonRadiusVar: string;
};

export function HeroContent({
  eyebrow,
  title,
  subtitle,
  buttonText,
  buttonAnchor,
  animateMainText,
  contentStackClassName,
  eyebrowClassName,
  headingGroupClassName,
  headingClassName,
  subtitleClassName,
  buttonClassName,
  buttonRadiusVar,
}: HeroContentProps) {
  const eyebrowNode = eyebrow.trim().length > 0 ? <p className={eyebrowClassName}>{eyebrow}</p> : null;
  const subtitleNode = <p className={subtitleClassName}>{subtitle}</p>;
  const ctaNode =
    buttonAnchor.trim().length > 0 ? (
      <a
        href={`#${buttonAnchor}`}
        className={buttonClassName}
        style={{ borderRadius: `var(${buttonRadiusVar})` }}
      >
        {buttonText}
      </a>
    ) : (
      <span className={buttonClassName} style={{ borderRadius: `var(${buttonRadiusVar})` }}>
        {buttonText}
      </span>
    );

  const headingAndSubtitle = (
    <>
      <HeroHeadline
        text={title}
        className={headingClassName}
        animateMainText={animateMainText}
      />
      {subtitleNode}
    </>
  );

  return (
    <div className={contentStackClassName}>
      {eyebrowNode}
      {headingGroupClassName ? (
        <div className={headingGroupClassName}>{headingAndSubtitle}</div>
      ) : (
        headingAndSubtitle
      )}
      <div>
        {ctaNode}
      </div>
    </div>
  );
}
