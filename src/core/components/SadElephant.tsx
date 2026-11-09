type SadElephantProps = { className?: string };

export default function SadElephant({ className }: SadElephantProps) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <g className="sad-elephant-body">
        <ellipse cx="48" cy="86" rx="40" ry="50" />
        <ellipse cx="152" cy="86" rx="40" ry="50" />
        <circle cx="100" cy="84" r="48" />
        <path d="M84 110 C84 148 78 166 62 176 C55 181 58 191 68 188 C94 179 114 158 116 110 Z" />
      </g>
      <g className="sad-elephant-face">
        <path d="M70 76 L88 69" />
        <path d="M130 76 L112 69" />
        <path d="M72 92 Q80 84 88 92" />
        <path d="M128 92 Q120 84 112 92" />
      </g>
      <g className="sad-elephant-tears">
        <path d="M78 100 C74 108 72 113 72 116 A6 6 0 0 0 84 116 C84 113 82 108 78 100 Z" />
        <path d="M122 100 C118 108 116 113 116 116 A6 6 0 0 0 128 116 C128 113 126 108 122 100 Z" />
      </g>
    </svg>
  );
}
