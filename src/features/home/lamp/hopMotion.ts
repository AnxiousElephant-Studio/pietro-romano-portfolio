import { clamp, clamp01, easeInOutQuad, lerp, sinePulse } from "@/core/lib/math";

export type HopMotionFrame = { y: number; squash: number };

export type HopMotion = {
  update: (desiredY: number, deltaSeconds: number) => HopMotionFrame;
  reset: (y: number) => void;
};

type Hop = { fromY: number; toY: number; elapsedSeconds: number; durationSeconds: number; arcHeight: number };

const SETTLE_DISTANCE_PX = 10;
const MAX_HOP_DISTANCE_PX = 340;
const TELEPORT_DISTANCE_PX = 1400;

const ANTICIPATION_SECONDS = 0.09;
const LANDING_SECONDS = 0.16;
const BASE_HOP_SECONDS = 0.32;
const HOP_SPEED_PX_PER_SECOND = 900;

const BASE_ARC_HEIGHT_PX = 26;
const ARC_HEIGHT_PER_DISTANCE = 0.28;

const ANTICIPATION_SQUASH = 0.14;
const AIRBORNE_STRETCH = 0.08;
const LANDING_SQUASH = 0.16;
const REST_SQUASH = 1;

export function createHopMotion(initialY: number): HopMotion {
  let currentY = initialY;
  let activeHop: Hop | null = null;
  let landingElapsedSeconds = LANDING_SECONDS;

  const reset = (y: number) => {
    currentY = y;
    activeHop = null;
    landingElapsedSeconds = LANDING_SECONDS;
  };

  const startHop = (desiredY: number) => {
    const hopDistance = clamp(desiredY - currentY, -MAX_HOP_DISTANCE_PX, MAX_HOP_DISTANCE_PX);
    const absoluteDistance = Math.abs(hopDistance);

    activeHop = {
      fromY: currentY,
      toY: currentY + hopDistance,
      elapsedSeconds: -ANTICIPATION_SECONDS,
      durationSeconds: BASE_HOP_SECONDS + absoluteDistance / HOP_SPEED_PX_PER_SECOND,
      arcHeight: BASE_ARC_HEIGHT_PX + absoluteDistance * ARC_HEIGHT_PER_DISTANCE,
    };
  };

  const updateHop = (hop: Hop, deltaSeconds: number): HopMotionFrame => {
    hop.elapsedSeconds += deltaSeconds;

    if (hop.elapsedSeconds < 0) {
      const crouchProgress = 1 + hop.elapsedSeconds / ANTICIPATION_SECONDS;

      return { y: currentY, squash: REST_SQUASH - ANTICIPATION_SQUASH * sinePulse(crouchProgress) };
    }

    const progress = clamp01(hop.elapsedSeconds / hop.durationSeconds);
    currentY = lerp(hop.fromY, hop.toY, easeInOutQuad(progress));

    if (progress >= 1) {
      activeHop = null;
      landingElapsedSeconds = 0;
    }

    return {
      y: currentY - sinePulse(progress) * hop.arcHeight,
      squash: REST_SQUASH + AIRBORNE_STRETCH * sinePulse(progress),
    };
  };

  const updateLanding = (deltaSeconds: number): HopMotionFrame => {
    landingElapsedSeconds += deltaSeconds;
    const landingProgress = clamp01(landingElapsedSeconds / LANDING_SECONDS);

    return { y: currentY, squash: REST_SQUASH - LANDING_SQUASH * sinePulse(landingProgress) };
  };

  const update = (desiredY: number, deltaSeconds: number): HopMotionFrame => {
    const distanceToTarget = Math.abs(desiredY - currentY);
    const isLanding = landingElapsedSeconds < LANDING_SECONDS;

    if (!activeHop && distanceToTarget > TELEPORT_DISTANCE_PX) {
      reset(desiredY);
    }

    if (!activeHop && !isLanding && distanceToTarget > SETTLE_DISTANCE_PX) {
      startHop(desiredY);
    }

    if (activeHop) {
      return updateHop(activeHop, deltaSeconds);
    }

    if (landingElapsedSeconds < LANDING_SECONDS) {
      return updateLanding(deltaSeconds);
    }

    return { y: currentY, squash: REST_SQUASH };
  };

  return { update, reset };
}
