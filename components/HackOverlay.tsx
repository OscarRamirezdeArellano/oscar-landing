'use client';

import React, { useEffect, useRef, useState } from 'react';

const HACK_LINES = [
  'nmap -sV -T4 -O target.local',
  'Starting Nmap 7.94 ( https://nmap.org ) at 2026-05-11 13:42',
  'Initiating Ping Scan at 13:42',
  'Scanning target.local [4 ports]',
  'Completed Ping Scan at 13:42, 0.13s elapsed (1 total hosts)',
  '',
  'Discovered open port 22/tcp on 10.0.0.42',
  'Discovered open port 80/tcp on 10.0.0.42',
  'Discovered open port 443/tcp on 10.0.0.42',
  'Discovered open port 5432/tcp on 10.0.0.42',
  'Discovered open port 11434/tcp on 10.0.0.42 (Ollama)',
  '',
  'Bypassing firewall...    [████████████████████] 100%',
  'Decrypting SSL handshake [████████████████████] 100%',
  'Injecting payload...     [████████████████████] 100%',
  '',
  'Establishing reverse shell on 10.0.0.42:22 ...',
  'oscar@target:~$ whoami',
  'oscar',
  'oscar@target:~$ cat /etc/hire-me',
  'cat: /etc/hire-me: drop me a line at oscar@iqsit.com',
  '',
  '😎 just kidding — this is all fake.',
  '',
  'press any key to exit...',
];

export default function HackOverlay({ onExit }: { onExit: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const idxRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => {
      if (idxRef.current >= HACK_LINES.length) {
        setDone(true);
        return;
      }
      const line = HACK_LINES[idxRef.current];
      setLines((prev) => [...prev, line]);
      idxRef.current++;
      const delay = line === '' ? 80 : 60 + Math.random() * 90;
      setTimeout(tick, delay);
    };
    tick();
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    if (!done) return;
    const handler = () => onExit();
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [done, onExit]);

  return (
    <div className="hack-overlay" ref={containerRef}>
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      {!done && <span style={{ color: '#00ff41' }}>█</span>}
    </div>
  );
}
