'use client';

import React, { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { PROJECTS } from '@/lib/data/projects';
import type { Lang, Project } from '@/lib/types';

/**
 * `void` — interactive 3D star map of Oscar's portfolio.
 *
 * Each project is a star in 3D space:
 *   - color = domain (fiscal=yellow, healthcare=cyan, legal=pink, ...)
 *   - size  = status (production = bigger, demo = smaller)
 *
 * Hover a star → label appears at the cursor.
 * Click a star → camera zooms in, constellation lines connect to all
 *                projects in the same domain, a card slides in with
 *                the project's summary, stack, and a "back" action.
 * ESC / Q / click the close button → return to the terminal.
 */

const DOMAIN_COLORS: Record<string, number> = {
  ai:         0x00d9ff, // cyan
  healthcare: 0x7dcfff, // light blue (HIPAA-y)
  fiscal:     0xe0af68, // yellow
  legal:      0xf7768e, // pink
  govtech:    0xff9e64, // orange
  voice:      0xbb9af7, // purple
  logistics:  0x9ece6a, // green
  saas:       0x4ade80, // emerald
  enterprise: 0x7aa2f7, // blue
  ecommerce:  0xffd700, // gold
  identity:   0xc0caf5, // silver
};

const DOMAIN_LABEL: Record<string, { en: string; es: string }> = {
  ai:         { en: 'AI / RAG',     es: 'IA / RAG' },
  healthcare: { en: 'Healthcare',   es: 'Salud' },
  fiscal:     { en: 'Fiscal (MX)',  es: 'Fiscal (MX)' },
  legal:      { en: 'Legal',        es: 'Legal' },
  govtech:    { en: 'GovTech',      es: 'GovTech' },
  voice:      { en: 'Voice',        es: 'Voz' },
  logistics:  { en: 'Logistics',    es: 'Logística' },
  saas:       { en: 'SaaS',         es: 'SaaS' },
  enterprise: { en: 'Enterprise',   es: 'Enterprise' },
  ecommerce:  { en: 'E-commerce',   es: 'E-commerce' },
  identity:   { en: 'Identity',     es: 'Identidad' },
};

const STATUS_SIZE: Record<string, number> = {
  production: 0.65,
  mvp:        0.50,
  demo:       0.38,
  archived:   0.32,
};

/** Even distribution on a sphere — Fibonacci spiral. */
function fibonacciSphere(samples: number, radius: number): { x: number; y: number; z: number }[] {
  const points: { x: number; y: number; z: number }[] = [];
  const phi = Math.PI * (Math.sqrt(5) - 1);
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / Math.max(1, samples - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push({ x: Math.cos(theta) * r * radius, y: y * radius, z: Math.sin(theta) * r * radius });
  }
  return points;
}

export default function VoidOverlay({ lang, onExit }: { lang: Lang; onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<{ project: Project; x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  // Refs for animation loop to read latest state without re-binding handlers
  const selectedRef = useRef<Project | null>(null);
  selectedRef.current = selected;

  // Keyboard exit (ESC, Q, Enter) — armed after 200ms
  useEffect(() => {
    let armed = false;
    const arm = setTimeout(() => { armed = true; }, 200);
    const handler = (e: KeyboardEvent) => {
      if (!armed) return;
      if (e.key === 'Escape') {
        if (selectedRef.current) setSelected(null);
        else onExit();
      } else if (e.key === 'q' || e.key === 'Q') {
        onExit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      clearTimeout(arm);
      window.removeEventListener('keydown', handler);
    };
  }, [onExit]);

  // Three.js scene setup
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      if (cancelled || !canvasRef.current) return;
      setLoading(false);

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.018);

      const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 200);
      const cameraDist = 50;
      camera.position.set(0, 0, cameraDist);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
      renderer.setClearColor(0x000000, 1);

      // === Soft white particles for star-field background ===
      const STAR_COUNT = 800;
      const starPos = new Float32Array(STAR_COUNT * 3);
      for (let i = 0; i < STAR_COUNT; i++) {
        const r = 60 + Math.random() * 40;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPos[i * 3 + 2] = r * Math.cos(phi);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        size: 0.08,
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const starField = new THREE.Points(starGeo, starMat);
      scene.add(starField);

      // === Soft glow texture for project sprites ===
      const glow = (() => {
        const c = document.createElement('canvas');
        c.width = c.height = 128;
        const ctx = c.getContext('2d')!;
        const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        g.addColorStop(0,    'rgba(255,255,255,1)');
        g.addColorStop(0.25, 'rgba(255,255,255,0.7)');
        g.addColorStop(0.6,  'rgba(255,255,255,0.15)');
        g.addColorStop(1,    'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
      })();

      // === Project sprites ===
      type StarSprite = THREE.Sprite & { userData: { project: Project; basePulse: number } };
      const positions = fibonacciSphere(PROJECTS.length, 28);
      const stars: StarSprite[] = [];

      PROJECTS.forEach((project, i) => {
        const color = DOMAIN_COLORS[project.domain] ?? 0xffffff;
        const size = STATUS_SIZE[project.status] ?? 0.4;
        const mat = new THREE.SpriteMaterial({
          map: glow,
          color,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.95,
        });
        const sprite = new THREE.Sprite(mat) as StarSprite;
        const p = positions[i];
        sprite.position.set(p.x, p.y, p.z);
        sprite.scale.setScalar(size * 2.5);
        sprite.userData = { project, basePulse: Math.random() * Math.PI * 2 };
        scene.add(sprite);
        stars.push(sprite);
      });

      // === Constellation lines (created/updated when a star is selected) ===
      let constellation: THREE.LineSegments | null = null;
      const buildConstellation = (selProject: Project) => {
        // Connect selected to all stars in same domain
        const sel = stars.find((s) => s.userData.project.slug === selProject.slug);
        if (!sel) return;
        const same = stars.filter((s) =>
          s.userData.project.domain === selProject.domain && s.userData.project.slug !== selProject.slug,
        );
        const verts: number[] = [];
        same.forEach((s) => {
          verts.push(sel.position.x, sel.position.y, sel.position.z);
          verts.push(s.position.x, s.position.y, s.position.z);
        });
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
        const mat = new THREE.LineBasicMaterial({
          color: DOMAIN_COLORS[selProject.domain] ?? 0xffffff,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const lines = new THREE.LineSegments(geo, mat);
        scene.add(lines);
        return lines;
      };
      const clearConstellation = () => {
        if (constellation) {
          scene.remove(constellation);
          constellation.geometry.dispose();
          (constellation.material as THREE.Material).dispose();
          constellation = null;
        }
      };

      // === Mouse / raycaster ===
      const raycaster = new THREE.Raycaster();
      const mouseNDC = new THREE.Vector2(0, 0);
      const mouseScreen = { x: innerWidth / 2, y: innerHeight / 2 };
      let hoveredStar: StarSprite | null = null;
      let isDragging = false;
      const dragStart = { x: 0, y: 0 };
      const cameraTarget = new THREE.Vector3(0, 0, cameraDist);

      const onMouseMove = (e: MouseEvent) => {
        mouseNDC.x = (e.clientX / innerWidth) * 2 - 1;
        mouseNDC.y = -(e.clientY / innerHeight) * 2 + 1;
        mouseScreen.x = e.clientX;
        mouseScreen.y = e.clientY;
        if (isDragging) {
          // Drag rotates the whole scene
          const dx = (e.clientX - dragStart.x) * 0.005;
          const dy = (e.clientY - dragStart.y) * 0.005;
          dragStart.x = e.clientX;
          dragStart.y = e.clientY;
          rotation.y -= dx;
          rotation.x -= dy;
          rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, rotation.x));
        }
      };
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
      };
      const onMouseUp = (e: MouseEvent) => {
        const wasDragging = isDragging && (Math.abs(e.clientX - dragStart.x) > 4 || Math.abs(e.clientY - dragStart.y) > 4);
        isDragging = false;
        if (wasDragging) return;
        // It was a click — check if a star was hit
        raycaster.setFromCamera(mouseNDC, camera);
        const hits = raycaster.intersectObjects(stars, false);
        if (hits.length > 0) {
          const star = hits[0].object as StarSprite;
          setSelected(star.userData.project);
          // Trigger camera focus + constellation
          clearConstellation();
          constellation = buildConstellation(star.userData.project) ?? null;
          // Animate camera toward the star (offset so it's not inside)
          const target = star.position.clone();
          const dir = target.clone().normalize();
          cameraTarget.copy(target).add(dir.multiplyScalar(8));
        } else if (selectedRef.current) {
          // Click on empty space deselects
          setSelected(null);
          clearConstellation();
          cameraTarget.set(0, 0, cameraDist);
        }
      };
      const onResize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('resize', onResize);

      // === Animation loop ===
      const start = performance.now();
      const rotation = { x: 0, y: 0 };
      const sceneGroup = new THREE.Group();

      const animate = () => {
        if (cancelled) return;
        const t = (performance.now() - start) * 0.001;

        // Slow auto-rotate of star sprites group when nothing selected
        if (!selectedRef.current && !isDragging) {
          rotation.y += 0.0015;
        }

        // Apply rotation to all stars and starfield
        starField.rotation.x = rotation.x;
        starField.rotation.y = rotation.y;
        // For project stars we rotate by transforming the camera around origin instead
        const camRadius = camera.position.length();
        const desiredCam = new THREE.Vector3(
          Math.sin(rotation.y) * Math.cos(rotation.x) * camRadius,
          Math.sin(rotation.x) * camRadius,
          Math.cos(rotation.y) * Math.cos(rotation.x) * camRadius,
        );
        // Actually: simpler is to keep cam radius from cameraTarget magnitude
        const tgtLen = cameraTarget.length() || cameraDist;
        const desired = new THREE.Vector3(
          Math.sin(rotation.y) * Math.cos(rotation.x) * tgtLen,
          Math.sin(rotation.x) * tgtLen,
          Math.cos(rotation.y) * Math.cos(rotation.x) * tgtLen,
        );
        // If a star is selected, blend toward that focus position; else use rotation orbit
        const targetPos = selectedRef.current ? cameraTarget : desired;
        camera.position.lerp(targetPos, 0.06);
        camera.lookAt(0, 0, 0);

        // Pulse stars subtly (selected = brighter pulse)
        stars.forEach((s) => {
          const isSelected = selectedRef.current?.slug === s.userData.project.slug;
          const isInDomain = selectedRef.current?.domain === s.userData.project.domain;
          const pulse = 0.85 + Math.sin(t * 1.5 + s.userData.basePulse) * 0.15;
          (s.material as THREE.SpriteMaterial).opacity = selectedRef.current
            ? (isSelected ? 1.0 : isInDomain ? 0.95 : 0.18)
            : pulse * 0.95;
        });

        // Constellation fade-in
        if (constellation) {
          const m = constellation.material as THREE.LineBasicMaterial;
          m.opacity = Math.min(0.6, m.opacity + 0.04);
        }

        // Hover detection
        if (!isDragging) {
          raycaster.setFromCamera(mouseNDC, camera);
          const hits = raycaster.intersectObjects(stars, false);
          const newHover = hits[0]?.object as StarSprite | undefined;
          if (newHover && newHover !== hoveredStar) {
            hoveredStar = newHover;
            setHovered({
              project: newHover.userData.project,
              x: mouseScreen.x,
              y: mouseScreen.y,
            });
          } else if (!newHover && hoveredStar) {
            hoveredStar = null;
            setHovered(null);
          } else if (newHover && hoveredStar) {
            // Update tooltip position as mouse moves
            setHovered({
              project: newHover.userData.project,
              x: mouseScreen.x,
              y: mouseScreen.y,
            });
          }
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);

      cleanup = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', onResize);
        clearConstellation();
        stars.forEach((s) => {
          (s.material as THREE.Material).dispose();
        });
        starGeo.dispose();
        starMat.dispose();
        glow.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  // Deselect handler
  const onBack = () => setSelected(null);

  return (
    <div className="void-overlay">
      <canvas ref={canvasRef} />
      {loading && (
        <div className="void-loading">
          <span className="c-accent">⠹</span>{' '}
          {lang === 'en' ? 'Mapping the void' : 'Mapeando el void'}
          <span className="c-dim">...</span>
        </div>
      )}

      {/* Top-left legend */}
      {!loading && !selected && (
        <div className="void-legend">
          <div className="void-legend-title">
            {lang === 'en' ? 'Project Map · 32 stars' : 'Mapa de Proyectos · 32 estrellas'}
          </div>
          <div className="void-legend-domains">
            {Object.entries(DOMAIN_COLORS).map(([dom, color]) => {
              const cssColor = '#' + color.toString(16).padStart(6, '0');
              return (
                <div key={dom} className="void-legend-row">
                  <span className="void-dot" style={{ background: cssColor, boxShadow: `0 0 8px ${cssColor}` }} />
                  <span>{DOMAIN_LABEL[dom]?.[lang] ?? dom}</span>
                </div>
              );
            })}
          </div>
          <div className="void-legend-hint">
            {lang === 'en'
              ? '▸ hover to identify · click to focus · drag to orbit'
              : '▸ hover para identificar · click para enfocar · drag para orbitar'}
          </div>
        </div>
      )}

      {/* Hover tooltip */}
      {hovered && !selected && (
        <div
          className="void-tooltip"
          style={{
            left: hovered.x + 14,
            top: hovered.y + 14,
            borderColor: '#' + (DOMAIN_COLORS[hovered.project.domain] ?? 0xffffff).toString(16).padStart(6, '0'),
          }}
        >
          <div className="void-tooltip-name">{hovered.project.name}</div>
          <div className="void-tooltip-domain">{DOMAIN_LABEL[hovered.project.domain]?.[lang] ?? hovered.project.domain}</div>
        </div>
      )}

      {/* Selected project card */}
      {selected && (
        <div
          className="void-card fade-in"
          style={{
            borderColor: '#' + (DOMAIN_COLORS[selected.domain] ?? 0xffffff).toString(16).padStart(6, '0'),
          }}
        >
          <div className="void-card-header">
            <span
              className="void-dot"
              style={{
                background: '#' + (DOMAIN_COLORS[selected.domain] ?? 0xffffff).toString(16).padStart(6, '0'),
                boxShadow: `0 0 10px #${(DOMAIN_COLORS[selected.domain] ?? 0xffffff).toString(16).padStart(6, '0')}`,
              }}
            />
            <span className="void-card-domain">{DOMAIN_LABEL[selected.domain]?.[lang] ?? selected.domain}</span>
            <button className="void-card-close" onClick={onBack} aria-label="back">✕</button>
          </div>
          <div className="void-card-name">{selected.name}</div>
          <div className="void-card-summary">{selected.summary[lang]}</div>
          <div className="void-card-meta">
            <span className="c-dim">{lang === 'en' ? 'client:' : 'cliente:'}</span>{' '}
            <span className="c-cyan">{selected.client[lang]}</span>
            <span className="c-dim">  ·  {lang === 'en' ? 'year:' : 'año:'}</span>{' '}
            <span className="c-yellow">{selected.year}</span>
            <span className="c-dim">  ·  {lang === 'en' ? 'status:' : 'estado:'}</span>{' '}
            <span style={{ color: '#' + (DOMAIN_COLORS[selected.domain] ?? 0xffffff).toString(16).padStart(6, '0') }}>● {selected.status}</span>
          </div>
          <div className="void-card-stack">
            {selected.stack.slice(0, 8).map((s) => (
              <span key={s} className="void-card-tag">{s}</span>
            ))}
          </div>
          <div className="void-card-hint">
            {lang === 'en' ? '▸ Lines connect projects in the same domain · ESC or click empty space to go back' : '▸ Las líneas conectan proyectos del mismo dominio · ESC o click en vacío para volver'}
          </div>
        </div>
      )}

      <div className="void-hint">
        <span className="c-dim">
          {lang === 'en'
            ? 'You are in the void. ESC, Q, or click ✕ to return.'
            : 'Estás en el void. ESC, Q o click en ✕ para volver.'}
        </span>
        <button className="void-exit-btn" onClick={onExit} aria-label="exit">✕</button>
      </div>
    </div>
  );
}
