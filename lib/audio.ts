/**
 * Tiny mechanical-keyboard sound effects via Web Audio API.
 * No external files. Toggleable via `audio on/off`.
 *
 * Modern browsers require a user gesture to start AudioContext, and
 * `resume()` is async — we await it before each blip so the first
 * sound after enabling audio actually plays.
 */

let ctx: AudioContext | null = null;

async function getReadyCtx(): Promise<AudioContext | null> {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }
  return ctx.state === 'running' ? ctx : null;
}

async function blip(freq: number, durationMs = 35, gain = 0.04) {
  const c = await getReadyCtx();
  if (!c) return;

  const osc = c.createOscillator();
  const g = c.createGain();
  osc.connect(g);
  g.connect(c.destination);

  osc.type = 'square';
  osc.frequency.value = freq;
  // Tiny attack to avoid click, then exponential decay
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(gain, c.currentTime + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durationMs / 1000);

  osc.start();
  osc.stop(c.currentTime + durationMs / 1000);
}

export function playKey(): void {
  // Slight pitch variation per call so it doesn't feel mechanical
  const freq = 1800 + Math.random() * 200 - 100;
  void blip(freq, 18, 0.025);
}

export function playEnter(): void {
  void blip(900, 60, 0.045);
}

/**
 * Warm the AudioContext on a user gesture (e.g., when `audio on` runs).
 * Plays a soft confirmation beep so the user knows audio is enabled
 * AND ensures the context is in 'running' state for subsequent calls.
 */
export function warmAudio(): void {
  void blip(1200, 80, 0.04);
}
