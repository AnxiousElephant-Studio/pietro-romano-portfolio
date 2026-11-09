export type SwitchSounds = {
  unlock: () => Promise<void>;
  playOn: () => void;
  playOff: () => void;
  dispose: () => void;
};

type ClickTone = { filterFrequency: number; thumpFrequency: number; volume: number };

type PlayedClick = { audioContext: AudioContext; output: GainNode; startTime: number };

const MASTER_VOLUME = 0.18;
const MAX_RESUME_LATENCY_SECONDS = 0.15;
const MILLISECONDS_PER_SECOND = 1000;
const SILENT_GAIN = 0.0001;

const CLICK_NOISE = { durationSeconds: 0.04, decayExponent: 3, filterQuality: 1.4 };

const THUMP = {
  startGain: 0.5,
  endGain: 0.001,
  pitchDropRatio: 0.5,
  pitchDropSeconds: 0.05,
  fadeSeconds: 0.06,
  stopSeconds: 0.07,
};

const HUM = {
  frequency: 120,
  peakGain: 0.06,
  startSeconds: 0.02,
  peakSeconds: 0.06,
  fadeSeconds: 0.35,
  stopSeconds: 0.4,
};

const SWITCH_ON_TONE: ClickTone = { filterFrequency: 1500, thumpFrequency: 180, volume: 1 };
const SWITCH_OFF_TONE: ClickTone = { filterFrequency: 500, thumpFrequency: 120, volume: 0.8 };

function hasUserActivatedPage() {
  return navigator.userActivation?.hasBeenActive ?? false;
}

function createClickNoise(audioContext: AudioContext) {
  const sampleCount = Math.floor(audioContext.sampleRate * CLICK_NOISE.durationSeconds);
  const noiseBuffer = audioContext.createBuffer(1, sampleCount, audioContext.sampleRate);
  const noiseSamples = noiseBuffer.getChannelData(0);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const whiteNoise = Math.random() * 2 - 1;
    const decayEnvelope = (1 - sampleIndex / sampleCount) ** CLICK_NOISE.decayExponent;
    noiseSamples[sampleIndex] = whiteNoise * decayEnvelope;
  }

  return noiseBuffer;
}

export function createSwitchSounds(): SwitchSounds {
  let audioContext: AudioContext | null = null;
  let clickNoise: AudioBuffer | null = null;

  const unlock = async () => {
    if (!audioContext) {
      audioContext = new AudioContext();
      clickNoise = createClickNoise(audioContext);
    }

    if (audioContext.state === "running") {
      return Promise.resolve();
    }

    return audioContext.resume().catch(() => undefined);
  };

  const playWhenRunning = (playSound: () => void) => {
    if (audioContext?.state === "running") {
      playSound();
      return;
    }

    if (!hasUserActivatedPage()) {
      return;
    }

    const requestTime = performance.now();

    unlock().then(() => {
      const waitedSeconds = (performance.now() - requestTime) / MILLISECONDS_PER_SECOND;

      if (waitedSeconds <= MAX_RESUME_LATENCY_SECONDS) {
        playSound();
      }
    });
  };

  const playClick = (tone: ClickTone): PlayedClick | null => {
    if (!audioContext || !clickNoise || audioContext.state !== "running") {
      return null;
    }

    const startTime = audioContext.currentTime;

    const output = audioContext.createGain();
    output.gain.value = MASTER_VOLUME * tone.volume;
    output.connect(audioContext.destination);

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = clickNoise;
    const clickFilter = audioContext.createBiquadFilter();
    clickFilter.type = "bandpass";
    clickFilter.frequency.value = tone.filterFrequency;
    clickFilter.Q.value = CLICK_NOISE.filterQuality;
    noiseSource.connect(clickFilter).connect(output);
    noiseSource.start(startTime);

    const thump = audioContext.createOscillator();
    const thumpGain = audioContext.createGain();
    thump.type = "sine";
    thump.frequency.setValueAtTime(tone.thumpFrequency, startTime);
    thump.frequency.exponentialRampToValueAtTime(
      tone.thumpFrequency * THUMP.pitchDropRatio,
      startTime + THUMP.pitchDropSeconds,
    );
    thumpGain.gain.setValueAtTime(THUMP.startGain, startTime);
    thumpGain.gain.exponentialRampToValueAtTime(THUMP.endGain, startTime + THUMP.fadeSeconds);
    thump.connect(thumpGain).connect(output);
    thump.start(startTime);
    thump.stop(startTime + THUMP.stopSeconds);

    return { audioContext, output, startTime };
  };

  const playHum = ({ audioContext: context, output, startTime }: PlayedClick) => {
    const hum = context.createOscillator();
    const humGain = context.createGain();
    hum.type = "triangle";
    hum.frequency.value = HUM.frequency;
    humGain.gain.setValueAtTime(SILENT_GAIN, startTime + HUM.startSeconds);
    humGain.gain.exponentialRampToValueAtTime(HUM.peakGain, startTime + HUM.peakSeconds);
    humGain.gain.exponentialRampToValueAtTime(SILENT_GAIN, startTime + HUM.fadeSeconds);
    hum.connect(humGain).connect(output);
    hum.start(startTime + HUM.startSeconds);
    hum.stop(startTime + HUM.stopSeconds);
  };

  const playOn = () => {
    playWhenRunning(() => {
      const click = playClick(SWITCH_ON_TONE);

      if (click) {
        playHum(click);
      }
    });
  };

  const playOff = () => {
    playWhenRunning(() => playClick(SWITCH_OFF_TONE));
  };

  const dispose = () => {
    audioContext?.close();
    audioContext = null;
    clickNoise = null;
  };

  return { unlock, playOn, playOff, dispose };
}
