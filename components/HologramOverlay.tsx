'use client';

import React, { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { runCommand } from '@/lib/commands';
import type { CommandContext, Lang, Theme } from '@/lib/types';

/**
 * `hologram` v2 — orbital terminal with floating holographic panels.
 *
 * Inspired by Star Wars / Cyberpunk 2077 holographic UIs.
 * - Real input bar at the bottom (the "keyboard" you type into)
 * - Each command response materializes as a holographic PANEL floating
 *   in 3D space around the input
 * - Panels are arranged in a radial fan: newest in front-center, older
 *   ones tilted to the sides and pushed back into depth
 * - Each panel has a close button and internal scroll for long output
 * - Mouse parallax tilts the whole stage
 */

type Panel = { id: number; kind: 'system' | 'prompt' | 'output' | 'error'; content: React.ReactNode };

const SUGGESTIONS = ['whoami', 'about', 'services', 'projects', 'skills', 'cv en', 'compose', 'help'];

/** Slot positions for each panel index (0 = newest). 6 visible at most. */
const SLOTS: { x: number; y: number; z: number; rotY: number; rotX: number; scale: number; opacity: number }[] = [
  { x:   0, y:    0, z:  120, rotY:   0, rotX:  0, scale: 1.00, opacity: 1.00 }, // 0 — front-center
  { x: 360, y:  -40, z:  -20, rotY: -22, rotX:  0, scale: 0.92, opacity: 0.95 }, // 1 — right-mid
  { x: -360, y: -40, z:  -20, rotY:  22, rotX:  0, scale: 0.92, opacity: 0.95 }, // 2 — left-mid
  { x: 240, y: -200, z: -180, rotY: -28, rotX: 4, scale: 0.78, opacity: 0.7  }, // 3 — far right
  { x: -240, y: -200, z: -180, rotY:  28, rotX: 4, scale: 0.78, opacity: 0.7  }, // 4 — far left
  { x:   0, y: -300, z: -300, rotY:   0, rotX: 8, scale: 0.7,  opacity: 0.55 }, // 5 — far back-up
];

const MAX_PANELS = SLOTS.length;

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

  /** Add a panel to the front (newest), capping at MAX_PANELS. */
  const pushPanel = (kind: Panel['kind'], content: React.ReactNode) => {
    setPanels((prev) => {
      const next: Panel[] = [{ id: ++panelIdRef.current, kind, content }, ...prev];
      return next.slice(0, MAX_PANELS);
    });
  };

  /** Close a panel by id (rest stay in their relative order). */
  const closePanel = (id: number) => {
    setPanels((prev) => prev.filter((p) => p.id !== id));
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

    pushPanel(
      'prompt',
      <div className="hg-prompt-line">
        <span className="hg-arrow">▸</span> <span className="hg-cmd">{cmd}</span>
      </div>,
    );

    if (cmd === 'clear' || cmd === 'cls') {
      resetToWelcome();
      return;
    }
    if (cmd === 'exit' || cmd === 'quit' || cmd === 'logout') {
      onExit();
      return;
    }

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
                ? `Can't open '${type}' from inside the hologram. Press ESC to exit first, then run it.`
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
      const x = (e.clientX / window.innerWidth - 0.5) * 5;
      const y = (e.clientY / window.innerHeight - 0.5) * 5;
      tiltRef.current = { x, y };
      setTilt({ x, y });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // === Three.js background scene ===
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

      const grid1 = new THREE.GridHelper(120, 60, 0x00d9ff, 0x003a4d);
      (grid1.material as THREE.Material).opacity = 0.55;
      (grid1.material as THREE.Material).transparent = true;
      grid1.position.y = -3;
      scene.add(grid1);

      const grid2 = new THREE.GridHelper(300, 30, 0x00d9ff, 0x001a26);
      (grid2.material as THREE.Material).opacity = 0.25;
      (grid2.material as THREE.Material).transparent = true;
      grid2.position.y = -3.001;
      scene.add(grid2);

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

      const horizonGeo = new THREE.PlaneGeometry(150, 12);
      const horizonMat = new THREE.MeshBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.04,
        depthWrite: false,
      });
      const horizon = new THREE.Mesh(horizonGeo, horizonMat);
      horizon.position.set(0, 0, -40);
      scene.add(horizon);

      const onResize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      };
      window.addEventListener('resize', onResize);

      const start = performance.now();
      const animate = () => {
        if (cancelled) return;
        const t = (performance.now() - start) * 0.001;

        const arr = pgeo.attributes.position.array as Float32Array;
        for (let i = 0; i < PCOUNT; i++) {
          arr[i * 3 + 1] += 0.005;
          if (arr[i * 3 + 1] > 16) arr[i * 3 + 1] = -2;
        }
        pgeo.attributes.position.needsUpdate = true;

        const tx = tiltRef.current.x * 0.05;
        const ty = tiltRef.current.y * 0.03;
        camera.position.x += (tx - camera.position.x) * 0.04;
        camera.position.y += (1.5 + ty - camera.position.y) * 0.04;
        camera.lookAt(0, -2 + ty * 0.5, 0);

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
        horizonGeo.dispose();
        horizonMat.dispose();
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

  // Compute panel transform from index (0 = newest)
  const panelStyle = (index: number): React.CSSProperties => {
    const slot = SLOTS[index] ?? SLOTS[SLOTS.length - 1];
    return {
      transform: `translate3d(${slot.x}px, ${slot.y}px, ${slot.z}px) rotateY(${slot.rotY}deg) rotateX(${slot.rotX}deg) scale(${slot.scale})`,
      opacity: slot.opacity,
      zIndex: 100 - index,
    };
  };

  return (
    <div className="hologram-overlay">
      <canvas ref={canvasRef} />
      <div className="hologram-vignette" />

      <div className="hologram-titlebar">
        <span className="hg-status-dot" />
        ORBITAL TERMINAL · oscar.iqsit.com · session: holo-{(panelIdRef.current * 7919).toString(36).slice(-4)}
        <button className="hg-titlebar-exit" onClick={onExit} aria-label="exit">
          ✕ ESC
        </button>
      </div>

      <div
        className="hologram-stage"
        style={{
          transform: `rotateX(${-tilt.y * 0.4}deg) rotateY(${tilt.x * 0.4}deg)`,
        }}
      >
        {loading ? (
          <div className="hologram-loading">
            <span className="c-accent">⠹</span>{' '}
            {lang === 'en' ? 'Materializing terminal' : 'Materializando terminal'}
            <span className="c-dim">...</span>
          </div>
        ) : (
          <div className="hologram-panels">
            {panels.map((p, i) => (
              <div
                key={p.id}
                className={`hologram-panel hg-${p.kind}`}
                style={panelStyle(i)}
              >
                <div className="hg-scanlines" />
                <div className="hg-glow-corner hg-tl" />
                <div className="hg-glow-corner hg-tr" />
                <div className="hg-glow-corner hg-bl" />
                <div className="hg-glow-corner hg-br" />
                <button
                  className="hg-panel-close"
                  onClick={() => closePanel(p.id)}
                  aria-label="close panel"
                  title={lang === 'en' ? 'Close panel' : 'Cerrar panel'}
                >
                  ✕
                </button>
                <div className="hg-panel-content">{p.content}</div>
              </div>
            ))}
          </div>
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
          placeholder={
            lang === 'en'
              ? 'type a command — try: whoami, services, projects, compose'
              : 'teclea un comando — prueba: whoami, services, projects, compose'
          }
          disabled={busy || loading}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <span className="hg-input-hint">{lang === 'en' ? 'ESC to exit' : 'ESC para salir'}</span>
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
            You are floating somewhere above the void. The keyboard at the bottom is real —
            type any command and the response materializes as a holographic panel around you.
            Move your mouse to look around.
          </>
        ) : (
          <>
            Estás flotando sobre el void. El teclado de abajo es real — teclea cualquier
            comando y la respuesta se materializa como panel holográfico a tu alrededor.
            Mueve el mouse para mirar alrededor.
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
      <div className="hg-welcome-footer">
        {lang === 'en' ? '▸ ' : '▸ '}
        <span className="c-dim">
          {lang === 'en'
            ? 'Up to 6 panels float around you · close any with the ✕ · oldest fade as new ones spawn'
            : 'Hasta 6 paneles flotan a tu alrededor · cierra cualquiera con ✕ · los viejos se desvanecen'}
        </span>
      </div>
    </div>
  );
}
