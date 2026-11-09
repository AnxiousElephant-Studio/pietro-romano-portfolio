import SadElephant from "./SadElephant";

type EmptyStateProps = { title: string; text: string };

export default function EmptyState({ title, text }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <SadElephant className="empty-state-watermark" />
      <div className="empty-state-copy">
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}
