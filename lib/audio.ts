/**
 * Tiny mechanical-keyboard sound effects via Web Audio API.
 *
 * Browsers require AudioContext to be created/unlocked inside a user gesture.
 * - Chromium/Firefox: AudioContext.resume() must be called within the gesture handler
 * - iOS Safari: needs a silent buffer played on the gesture to fully unlock
 *
 * Strategy: call initAudio() from the very first user interaction (any
 * keydown or click on the page) so by the time the user types `audio on`,
 * the context is already running.
 */

let ctx: AudioContext | null = null;
let initialized = false;

export function initAudio(): void {
  if (initialized) return;
  initialized = true;
  if (typeof window === 'undefined') return;

  try {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();

    // iOS Safari: play a silent 1-sample buffer to unlock audio
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch {
      // ignore — primary unlock is resume()
    }

    if (ctx.state === 'suspended') {
      // Don't await — fire and forget, the gesture is still active
      void ctx.resume();
    }
  } catch {
    ctx = null;
  }
}

async function blip(freq: number, durationMs = 35, gain = 0.08): Promise<void> {
  if (!ctx) initAudio();
  if (!ctx) return;
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return;
    }
  }
  if (ctx.state !== 'running') return;

  try {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.value = freq;
    // Anti-click attack + exponential decay
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(gain, ctx.currentTime + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  } catch {
    // ignore
  }
}

export function playKey(): void {
  // Slight pitch variation so it doesn't feel mechanical
  const freq = 1800 + Math.random() * 200 - 100;
  void blip(freq, 18, 0.06);
}

export function playEnter(): void {
  void blip(900, 60, 0.10);
}

/**
 * Confirmation beep when user enables audio. Also re-warms the context
 * if it was suspended.
 */
export function warmAudio(): void {
  void blip(1200, 100, 0.12);
}
