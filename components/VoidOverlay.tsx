'use client';

import React, { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import type { Lang } from '@/lib/types';

/**
 * `void` easter egg — minimalist WebGL scene.
 * Particles, rotating wireframe shapes, mouse parallax.
 * Dynamic-imports three so it isn't in the main bundle.
 */
export default function VoidOverlay({ lang, onExit }: { lang: Lang; onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 200);
    const handler = (e: KeyboardEvent) => {
      if (!armed) return;
      if (e.key === 'Escape' || e.key === 'q' || e.key === 'Q' || e.key === 'Enter') {
        onExit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      clearTimeout(arm);
      window.removeEventListener('keydown', handler);
    };
  }, [onExit]);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      if (cancelled || !canvasRef.current) return;

      setLoading(false);

      const canvas = canvasRef.current;
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x000000, 0.04);

      const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
      camera.position.set(0, 0, 9);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
      renderer.setClearColor(0x000000, 1);

      // === Particles ===
      const COUNT = 1400;
      const positions = new Float32Array(COUNT * 3);
      const colors = new Float32Array(COUNT * 3);
      const PALETTE: [number, number, number][] = [
        [0.0, 0.85, 1.0],     // cyan
        [1.0, 0.18, 0.53],    // pink
        [0.49, 0.23, 0.93],   // purple
        [0.29, 0.87, 0.42],   // green
        [0.88, 0.69, 0.41],   // yellow
      ];
      for (let i = 0; i < COUNT; i++) {
        const r = 6 + Math.random() * 18;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        colors[i * 3]     = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
      }
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geom, mat);
      scene.add(points);

      // === Wireframe shapes ===
      type ShapeUserData = {
        rotX: number;
        rotY: number;
        float: number;
        offset: number;
        origPos: THREE.Vector3;
      };
      type Shape = THREE.Mesh;
      const shapes: Shape[] = [];
      const geometries = [
        () => new THREE.IcosahedronGeometry(0.9, 0),
        () => new THREE.OctahedronGeometry(0.85, 0),
        () => new THREE.TorusGeometry(0.7, 0.18, 16, 48),
        () => new THREE.TetrahedronGeometry(1.0, 0),
        () => new THREE.DodecahedronGeometry(0.85, 0),
      ];
      for (let i = 0; i < 9; i++) {
        const g = geometries[i % geometries.length]();
        const m = new THREE.MeshBasicMaterial({
          color: new THREE.Color(...PALETTE[i % PALETTE.length]),
          wireframe: true,
          transparent: true,
          opacity: 0.55,
        });
        const mesh = new THREE.Mesh(g, m);
        mesh.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 9,
          (Math.random() - 0.5) * 6,
        );
        mesh.userData = {
          rotX: (Math.random() - 0.5) * 0.008,
          rotY: (Math.random() - 0.5) * 0.008,
          float: 0.0015 + Math.random() * 0.0025,
          offset: Math.random() * Math.PI * 2,
          origPos: mesh.position.clone(),
        } satisfies ShapeUserData;
        scene.add(mesh);
        shapes.push(mesh);
      }

      // === Mouse + scroll parallax ===
      const mouse = { x: 0, y: 0 };
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouseMove);

      const onResize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      };
      window.addEventListener('resize', onResize);

      // === Animate ===
      const start = performance.now();
      const animate = () => {
        if (cancelled) return;
        const t = (performance.now() - start) * 0.001;

        points.rotation.y = t * 0.02;
        points.rotation.x = t * 0.01 + mouse.y * 0.1;

        shapes.forEach((s) => {
          const u = s.userData as ShapeUserData;
          s.rotation.x += u.rotX;
          s.rotation.y += u.rotY;
          s.position.y = u.origPos.y + Math.sin(t + u.offset) * 0.6;
          s.position.x = u.origPos.x + Math.cos(t * 0.7 + u.offset) * 0.3;
        });

        // Camera mouse-follow
        camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.04;
        camera.position.y += (-mouse.y * 1.0 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', onResize);
        shapes.forEach((s) => {
          s.geometry.dispose();
          (s.material as THREE.Material).dispose();
        });
        geom.dispose();
        mat.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div className="void-overlay" onClick={onExit}>
      <canvas ref={canvasRef} />
      {loading && (
        <div className="void-loading">
          <span className="c-accent">⠹</span>{' '}
          {lang === 'en' ? 'Entering the void' : 'Entrando al void'}
          <span className="c-dim">...</span>
        </div>
      )}
      <div className="void-hint">
        <span className="c-dim">
          {lang === 'en'
            ? 'You are in the void. Move mouse. ESC, Q, Enter or click to return.'
            : 'Estás en el void. Mueve el mouse. ESC, Q, Enter o click para volver.'}
        </span>
      </div>
    </div>
  );
}
