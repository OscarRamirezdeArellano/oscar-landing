'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Spinner: animated character cycling | / - \
 */
export function Spinner({ text = 'Processing', className = 'c-dim' }: { text?: string; className?: string }) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % frames.length), 80);
    return () => clearInterval(id);
  }, [frames.length]);
  return (
    <span className={className}>
      <span className="c-accent">{frames[i]}</span> {text}
      <Dots />
    </span>
  );
}

/**
 * Animated trailing dots
 */
export function Dots() {
  const [n, setN] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v % 3) + 1), 400);
    return () => clearInterval(id);
  }, []);
  return <span>{'.'.repeat(n)}</span>;
}

/**
 * StaggerReveal: shows children one at a time with delay
 */
export function StaggerReveal({
  children,
  delayMs = 60,
  startDelayMs = 0,
}: {
  children: React.ReactNode;
  delayMs?: number;
  startDelayMs?: number;
}) {
  const arr = React.Children.toArray(children);
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const start = setTimeout(() => {
      const tick = (i: number) => {
        if (cancelled) return;
        setVisible(i);
        if (i < arr.length) {
          setTimeout(() => tick(i + 1), delayMs);
        }
      };
      tick(1);
    }, startDelayMs);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arr.length, delayMs, startDelayMs]);

  return (
    <>
      {arr.slice(0, visible).map((child, idx) => (
        <div key={idx} className="fade-in">
          {child}
        </div>
      ))}
    </>
  );
}

/**
 * Animated bar chart row.
 * Renders an ASCII bar that fills up over time.
 */
export function BarRow({
  label,
  value,
  max,
  color = 'var(--accent)',
  width = 22,
  delayMs = 0,
}: {
  label: string;
  value: number;
  max: number;
  color?: string;
  width?: number;
  delayMs?: number;
}) {
  const [animValue, setAnimValue] = useState(0);
  const ratio = value / max;
  const filled = Math.round(animValue * width);
  const empty = width - filled;

  useEffect(() => {
    const start = setTimeout(() => {
      let v = 0;
      const steps = 16;
      const id = setInterval(() => {
        v += 1 / steps;
        if (v >= ratio) {
          setAnimValue(ratio);
          clearInterval(id);
        } else {
          setAnimValue(v);
        }
      }, 28);
    }, delayMs);
    return () => clearTimeout(start);
  }, [ratio, delayMs]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr 60px',
        gap: 10,
        alignItems: 'baseline',
        margin: '2px 0',
      }}
    >
      <span className="c-fg">{label}</span>
      <span style={{ fontFamily: 'inherit', letterSpacing: 0 }}>
        <span style={{ color }}>{'█'.repeat(filled)}</span>
        <span className="c-dim">{'░'.repeat(empty)}</span>
      </span>
      <span className="c-cyan" style={{ textAlign: 'right' }}>
        {Math.round(animValue * max)}
      </span>
    </div>
  );
}

/**
 * TypeOut: types out a string char-by-char
 */
export function TypeOut({
  text,
  speed = 25,
  className = '',
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const [shown, setShown] = useState('');
  const idxRef = useRef(0);

  useEffect(() => {
    idxRef.current = 0;
    setShown('');
    const id = setInterval(() => {
      idxRef.current++;
      setShown(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <span className={className}>{shown}</span>;
}

/**
 * ProgressBar: a one-shot animated progress bar with completion text
 */
export function ProgressBar({
  label,
  durationMs = 600,
  width = 30,
}: {
  label: string;
  durationMs?: number;
  width?: number;
}) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const id = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / durationMs);
      setPct(t);
      if (t >= 1) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [durationMs]);

  const filled = Math.round(pct * width);
  const empty = width - filled;

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
      <span className="c-fg" style={{ minWidth: 200 }}>{label}</span>
      <span>
        <span className="c-dim">[</span>
        <span className="c-accent">{'█'.repeat(filled)}</span>
        <span className="c-dim">{'░'.repeat(empty)}</span>
        <span className="c-dim">]</span>
      </span>
      <span className="c-cyan">{Math.round(pct * 100)}%</span>
    </div>
  );
}

/**
 * Replace a "pending" loader line with a "done" line.
 * Renders a spinner initially, then swaps to a checkmark+text after `afterMs`.
 */
export function LoadThenDone({
  pendingText,
  doneText,
  afterMs = 500,
}: {
  pendingText: string;
  doneText: string;
  afterMs?: number;
}) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), afterMs);
    return () => clearTimeout(t);
  }, [afterMs]);
  return (
    <div>
      {done ? (
        <span>
          <span className="c-green">✓</span> <span className="c-dim">{doneText}</span>
        </span>
      ) : (
        <Spinner text={pendingText} />
      )}
    </div>
  );
}

/**
 * Sleep helper for command authors.
 */
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
