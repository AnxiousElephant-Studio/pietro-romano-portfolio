type ComingSoonCardProps = { label: string; title: string; text: string };

export default function ComingSoonCard({ label, title, text }: ComingSoonCardProps) {
  return (
    <div className="card card-coming-soon" aria-label={title}>
      <div className="card-media coming-soon-media" aria-hidden="true">
        <span className="coming-soon-mark">?</span>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="chip">{label}</span>
        </div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
