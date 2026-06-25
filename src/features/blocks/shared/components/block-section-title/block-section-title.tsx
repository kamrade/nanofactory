import styles from "./block-section-title.module.css";

type BlockSectionTitleProps = {
  title: string;
  fontWeight?: 400 | 600;
};

export function BlockSectionTitle({ title, fontWeight = 400 }: BlockSectionTitleProps) {
  if (!title.trim()) return null;
  return (
    <h2
      className={styles.title}
      style={fontWeight !== 400 ? { fontWeight } : undefined}
    >
      {title}
    </h2>
  );
}
