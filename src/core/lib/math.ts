export type NumberRange = { min: number; max: number };

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function clamp01(value: number) {
  return clamp(value, 0, 1);
}

export function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

export function lerpRange(range: NumberRange, progress: number) {
  return lerp(range.min, range.max, progress);
}

export function approachExponentially(current: number, target: number, ratePerSecond: number, deltaSeconds: number) {
  const blendFactor = 1 - Math.exp(-ratePerSecond * deltaSeconds);

  return lerp(current, target, blendFactor);
}

export function easeInOutQuad(progress: number) {
  if (progress < 0.5) {
    return 2 * progress * progress;
  }

  return 1 - (-2 * progress + 2) ** 2 / 2;
}

export function sinePulse(progress: number) {
  return Math.sin(Math.PI * clamp01(progress));
}
