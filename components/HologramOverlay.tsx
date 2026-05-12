'use client';

import React, { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { runCommand } from '@/lib/commands';
import type { CommandContext, Lang, Theme } from '@/lib/types';

/**
 * `hologram` — orbital terminal floating in space.
 *
 * The user types real commands, but the responses materialize as holographic
 * panels floating in front of a Tron-style WebGL grid scene. The whole
 * content tilts with the mouse for a subtle parallax / "you're really in 3D"
 * effect. Panels stack vertically and scroll.
 *
 * Most regular commands work — overlay-opening commands (vim, matrix, void,
 * hack, contact-form, chat, hologram) print a friendly "exit hologram first"
 * message instead of stacking overlays.
 */

type PanelKind = 'system' | 'prompt' | 'output' | 'error';
type Panel = { id: number; kind: PanelKind; content: React.ReactNode };

const SUGGESTIONS = ['whoami', 'about', 'services', 'projects', 'skills', 'cv en', 'compose', 'help'];

export default function HologramOverlay({
  lang,
  theme,
  onExit,
}: {
  lang: Lang;
  theme: Theme;
  onExit: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelIdRef = useRef(0);
  const tiltRef = useRef({ x: 0, y: 0 });

  const [loading, setLoading] = useState(true);
  const [panels, setPanels] = useState<Panel[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const langRef = useRef<Lang>(lang);
  langRef.current = lang;
  const themeRef = useRef<Theme>(theme);
  themeRef.current = theme;

  const pushPanel = (kind: PanelKind, content: React.ReactNode) => {
    setPanels((prev) => [...prev, { id: ++panelIdRef.current, kind, content }]);
  };

  const resetToWelcome = () => {
    panelIdRef.current = 0;
    setPanels([
      {
        id: ++panelIdRef.current,
        kind: 'system',
        content: <WelcomePanel lang={langRef.current} onSuggestion={(c) => runHere(c)} />,
      },
    ]);
  };

  // === Run a command in hologram context ===
  const runHere = async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd || busy) return;

    // Echo as a prompt panel
    pushPanel(
      'prompt',
      <div className="hg-prompt-line">
        <span className="hg-arrow">▸</span> <span className="hg-cmd">{cmd}</span>
      </div>,
    );

    // Local commands that override the global registry
    if (cmd === 'clear' || cmd === 'cls') {
      resetToWelcome();
      return;
    }
    if (cmd === 'exit' || cmd === 'quit' || cmd === 'logout') {
      onExit();
      return;
    }

    // Build a minimal CommandContext for the global runner
    let overlayBlocked = false;
    const ctx: CommandContext = {
      lang: langRef.current,
      theme: themeRef.current,
      cwd: '~',
      setLang: () => {},
      setTheme: () => {},
      setCwd: () => {},
      clear: resetToWelcome,
      print: (node) => pushPanel('output', node),
      history: [],
      runCommand: async (c) => {
        await runHere(c);
      },
      setOverlay: (type) => {
        if (type !== null) {
          overlayBlocked = true;
          pushPanel(
            'error',
            <div className="hg-error">
              {langRef.current === 'en'
                ? `Can't open '${type}' from inside the hologram. Press ESC first, then run it.`
                : `No puedes abrir '${type}' dentro del hologram. ESC primero, luego córrelo.`}
            </div>,
          );
        }
      },
      audioOn: false,
      setAudioOn: () => {},
    };

    setBusy(true);
    try {
      const out = await runCommand(cmd, ctx);
      if (!overlayBlocked && out !== null && out !== undefined) {
        pushPanel('output', out);
      }
    } catch (err) {
      pushPanel('error', <div className="hg-error">error: {String(err)}</div>);
    } finally {
      setBusy(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  // === Welcome panel on mount ===
  useEffect(() => {
    resetToWelcome();
    setTimeout(() => inputRef.current?.focus(), 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Auto-scroll to latest panel ===
  useEffect(() => {
    const c = containerRef.current;
    if (c) c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
  }, [panels]);

  // === ESC handler (armed after 200ms) ===
  useEffect(() => {
    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 200);
    const handler = (e: KeyboardEvent) => {
      if (!armed) return;
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handler);
    return () => {
      clearTimeout(arm);
      window.removeEventListener('keydown', handler);
    };
  }, [onExit]);

  // === Mouse parallax ===
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      tiltRef.current = { x, y };
      setTilt({ x, y });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // === Three.js background scene: grid floor + particles + fog ===
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      if (cancelled || !canvasRef.current) return;
      setLoading(false);

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000814, 12, 80);

      const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 200);
      camera.position.set(0, 1.5, 10);
      camera.lookAt(0, -2, 0);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
      renderer.setClearColor(0x000814, 1);

      // Tron-style grid floor
      const grid1 = new THREE.GridHelper(120, 60, 0x00d9ff, 0x003a4d);
      (grid1.material as THREE.Material).opacity = 0.55;
      (grid1.material as THREE.Material).transparent = true;
      grid1.position.y = -3;
      scene.add(grid1);

      // Secondary larger grid for depth
      const grid2 = new THREE.GridHelper(300, 30, 0x00d9ff, 0x001a26);
      (grid2.material as THREE.Material).opacity = 0.25;
      (grid2.material as THREE.Material).transparent = true;
      grid2.position.y = -3.001;
      scene.add(grid2);

      // Soft particles drifting
      const PCOUNT = 600;
      const positions = new Float32Array(PCOUNT * 3);
      for (let i = 0; i < PCOUNT; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = Math.random() * 18 - 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      }
      const pgeo = new THREE.BufferGeometry();
      pgeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const pmat = new THREE.PointsMaterial({
        color: 0x00d9ff,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(pgeo, pmat);
      scene.add(points);

      // Distant horizon glow plane
      const glowGeo = new THREE.PlaneGeometry(150, 12);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.04,
        depthWrite: false,
      });
      const horizon = new THREE.Mesh(glowGeo, glowMat);
      horizon.position.set(0, 0, -40);
      scene.add(horizon);

      const onResize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      };
      window.addEventListener('resize', onResize);

      // Animate
      const start = performance.now();
      const animate = () => {
        if (cancelled) return;
        const t = (performance.now() - start) * 0.001;

        // Drift particles slowly upward
        const arr = pgeo.attributes.position.array as Float32Array;
        for (let i = 0; i < PCOUNT; i++) {
          arr[i * 3 + 1] += 0.005;
          if (arr[i * 3 + 1] > 16) arr[i * 3 + 1] = -2;
        }
        pgeo.attributes.position.needsUpdate = true;

        // Subtle camera sway driven by mouse parallax
        const tx = tiltRef.current.x * 0.05;
        const ty = tiltRef.current.y * 0.03;
        camera.position.x += (tx - camera.position.x) * 0.04;
        camera.position.y += (1.5 + ty - camera.position.y) * 0.04;
        camera.lookAt(0, -2 + ty * 0.5, 0);

        // Slowly rotate floor for motion
        grid1.rotation.y = t * 0.02;
        grid2.rotation.y = -t * 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        window.removeEventListener('resize', onResize);
        pgeo.dispose();
        pmat.dispose();
        glowGeo.dispose();
        glowMat.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input;
    setInput('');
    await runHere(cmd);
  };

  return (
    <div className="hologram-overlay">
      <canvas ref={canvasRef} />
      <div className="hologram-vignette" />

      <div className="hologram-titlebar">
        <span className="hg-status-dot" />
        ORBITAL TERMINAL · oscar.iqsit.com · session: holo-{Math.random().toString(36).slice(2, 6)}
        <button className="hg-titlebar-exit" onClick={onExit} aria-label="exit">✕</button>
      </div>

      <div
        className="hologram-content"
        ref={containerRef}
        style={{
          transform: `perspective(1400px) rotateX(${-tilt.y * 0.4}deg) rotateY(${tilt.x * 0.4}deg)`,
        }}
      >
        {loading ? (
          <div className="hologram-loading">
            <span className="c-accent">⠹</span> {lang === 'en' ? 'Materializing terminal' : 'Materializando terminal'}<span className="c-dim">...</span>
          </div>
        ) : (
          panels.map((p) => (
            <div key={p.id} className={`hologram-panel hg-${p.kind}`}>
              <div className="hg-scanlines" />
              <div className="hg-glow-corner hg-tl" />
              <div className="hg-glow-corner hg-tr" />
              <div className="hg-glow-corner hg-bl" />
              <div className="hg-glow-corner hg-br" />
              <div className="hg-panel-content">{p.content}</div>
            </div>
          ))
        )}
      </div>

      <form className="hologram-input-bar" onSubmit={onSubmit}>
        <span className="hg-input-prompt">▸</span>
        <input
          ref={inputRef}
          className="hologram-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === 'en' ? 'type a command — try: whoami, services, projects, compose' : 'teclea un comando — prueba: whoami, services, projects, compose'}
          disabled={busy || loading}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <span className="hg-input-hint">ESC {lang === 'en' ? 'to exit' : 'para salir'}</span>
      </form>
    </div>
  );
}

function WelcomePanel({ lang, onSuggestion }: { lang: Lang; onSuggestion: (cmd: string) => void }) {
  return (
    <div className="hg-welcome">
      <div className="hg-welcome-title">
        ◆ {lang === 'en' ? 'Welcome to the orbital terminal' : 'Bienvenido al terminal orbital'}
      </div>
      <div className="hg-welcome-body">
        {lang === 'en' ? (
          <>
            You are floating somewhere above the void, looking at a holographic
            shell projected from the surface. Type any command — the response
            will materialize as a hologram. Move your mouse to look around.
          </>
        ) : (
          <>
            Estás flotando en algún lugar sobre el void, viendo una shell
            holográfica proyectada desde la superficie. Teclea cualquier
            comando — la respuesta se materializará como holograma. Mueve el
            mouse para mirar alrededor.
          </>
        )}
      </div>
      <div className="hg-welcome-suggestions">
        <span className="c-dim" style={{ fontSize: 11.5, marginRight: 8 }}>
          {lang === 'en' ? 'try:' : 'prueba:'}
        </span>
        {SUGGESTIONS.map((cmd) => (
          <button key={cmd} className="hg-chip" onClick={() => onSuggestion(cmd)}>
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
