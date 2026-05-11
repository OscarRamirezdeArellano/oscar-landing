/**
 * Tiny mechanical-keyboard sound effects using Web Audio API.
 * No external files. Toggleable via `audio on/off`.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function blip(freq: number, durationMs = 35, gain = 0.04) {
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') c.resume();

  const osc = c.createOscillator();
  const g = c.createGain();
  osc.connect(g);
  g.connect(c.destination);

  osc.type = 'square';
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durationMs / 1000);

  osc.start();
  osc.stop(c.currentTime + durationMs / 1000);
}

export function playKey() {
  // Slight variation per call
  const freq = 1800 + Math.random() * 200 - 100;
  blip(freq, 18, 0.025);
}

export function playEnter() {
  blip(900, 60, 0.045);
}
