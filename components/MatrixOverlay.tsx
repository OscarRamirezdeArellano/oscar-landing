'use client';

import React, { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function MatrixOverlay({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Defer arming the keydown listener so the Enter key that opened
    // this overlay (when typing 'matrix' + Enter) doesn't immediately close it.
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const fontSize = 16;
    let columns = Math.floor(w / fontSize);
    let drops: number[] = new Array(columns).fill(1);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      columns = Math.floor(w / fontSize);
      drops = new Array(columns).fill(1);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < columns; i++) {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // Bright head, dim trail
        ctx.fillStyle = drops[i] === 1 || Math.random() > 0.97 ? '#aaffaa' : '#00ff41';
        ctx.fillText(ch, x, y);

        if (y > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="matrix-overlay">
      <canvas ref={canvasRef} />
      <div className="matrix-exit-hint">Press ESC, Q, or Enter to exit</div>
    </div>
  );
}
