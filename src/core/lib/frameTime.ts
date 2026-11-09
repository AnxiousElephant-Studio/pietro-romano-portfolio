const MILLISECONDS_PER_SECOND = 1000;
const MAX_FRAME_DELTA_SECONDS = 0.05;

export function getFrameDeltaSeconds(previousFrameTime: number, frameTime: number) {
  if (!previousFrameTime) {
    return 0;
  }

  return Math.min((frameTime - previousFrameTime) / MILLISECONDS_PER_SECOND, MAX_FRAME_DELTA_SECONDS);
}
