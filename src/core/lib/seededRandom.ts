import { lerpRange, type NumberRange } from "./math";

const LCG_MULTIPLIER = 1664525;
const LCG_INCREMENT = 1013904223;
const LCG_MODULUS = 2 ** 32;

export type RandomGenerator = () => number;

export function createSeededRandom(seed: number): RandomGenerator {
  let state = seed % LCG_MODULUS;

  return () => {
    state = (state * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS;

    return state / LCG_MODULUS;
  };
}

export function randomInRange(random: RandomGenerator, range: NumberRange) {
  return lerpRange(range, random());
}
