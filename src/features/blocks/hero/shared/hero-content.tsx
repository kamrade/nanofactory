import { HeroCta, HeroEyebrow, HeroHeadline, HeroSubtitle } from "./content";

type HeroContentProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAnchor: string;
  animateMainText: boolean;
  animateContent: boolean;
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
  animateContent,
  contentStackClassName,
  eyebrowClassName,
  headingGroupClassName,
  headingClassName,
  subtitleClassName,
  buttonClassName,
  buttonRadiusVar,
}: HeroContentProps) {
  const headingAndSubtitle = (
    <>
      <HeroHeadline
        text={title}
        className={headingClassName}
        animateContent={animateContent}
        animateMainText={animateMainText}
      />
      <HeroSubtitle text={subtitle} className={subtitleClassName} />
    </>
  );

  return (
    <div className={contentStackClassName}>
      <HeroEyebrow text={eyebrow} className={eyebrowClassName} />
      {headingGroupClassName ? (
        <div className={headingGroupClassName}>{headingAndSubtitle}</div>
      ) : (
        headingAndSubtitle
      )}
      <div>
        <HeroCta
          buttonText={buttonText}
          buttonAnchor={buttonAnchor}
          buttonClassName={buttonClassName}
          buttonRadiusVar={buttonRadiusVar}
        />
      </div>
    </div>
  );
}
