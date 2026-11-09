import type { NumberRange } from "@/core/lib/math";
import { createSeededRandom, randomInRange } from "@/core/lib/seededRandom";

type Particle = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  opacity: number;
};

const PARTICLE_COUNT = 22;
const PARTICLE_LAYOUT_SEED = 97;
const PARTICLE_RANGES = {
  leftPercent: { min: 0, max: 100 },
  sizePx: { min: 12, max: 58 },
  durationSeconds: { min: 14, max: 30 },
  delaySeconds: { min: 0, max: -30 },
  rotationDegrees: { min: -45, max: 45 },
  opacity: { min: 0.08, max: 0.22 },
} satisfies Record<string, NumberRange>;

const STRINGS_VIEWBOX = { width: 1000, height: 600 };
const STRING_COUNT = 6;
const STRING_SPACING = 34;
const STRING_BASE_THICKNESS = 6;
const STRING_THICKNESS_STEP = 0.8;
const STRING_START = { x: 520, y: 640 };
const STRING_END = { x: 900, y: -40 };

function createParticles(): Particle[] {
  const random = createSeededRandom(PARTICLE_LAYOUT_SEED);
  const randomRounded = (range: NumberRange) => Math.round(randomInRange(random, range));

  return Array.from({ length: PARTICLE_COUNT }, () => ({
    left: randomRounded(PARTICLE_RANGES.leftPercent),
    size: randomRounded(PARTICLE_RANGES.sizePx),
    duration: randomRounded(PARTICLE_RANGES.durationSeconds),
    delay: randomRounded(PARTICLE_RANGES.delaySeconds),
    rotation: randomRounded(PARTICLE_RANGES.rotationDegrees),
    opacity: randomInRange(random, PARTICLE_RANGES.opacity),
  }));
}

const particles = createParticles();
const strings = Array.from({ length: STRING_COUNT }, (_, stringIndex) => ({
  offset: stringIndex * STRING_SPACING,
  thickness: STRING_BASE_THICKNESS - stringIndex * STRING_THICKNESS_STEP,
}));

export default function HeroBackdrop() {
  return (
    <div className="hero-backdrop" aria-hidden="true">
      <svg className="hero-strings" viewBox={`0 0 ${STRINGS_VIEWBOX.width} ${STRINGS_VIEWBOX.height}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hero-string-gradient" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="0.35" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {strings.map((guitarString) => (
          <line
            key={guitarString.offset}
            x1={STRING_START.x + guitarString.offset}
            y1={STRING_START.y}
            x2={STRING_END.x + guitarString.offset}
            y2={STRING_END.y}
            stroke="url(#hero-string-gradient)"
            strokeWidth={guitarString.thickness}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {particles.map((particle, particleIndex) => (
        <span
          key={particleIndex}
          className="hero-particle"
          style={{
            left: `${particle.left}%`,
            width: particle.size,
            height: particle.size,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
            opacity: particle.opacity,
            rotate: `${particle.rotation}deg`,
          }}
        />
      ))}
    </div>
  );
}
