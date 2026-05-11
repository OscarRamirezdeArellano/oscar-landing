'use client';

import React, { useEffect } from 'react';

type Payload = { title: string; content: string };

export default function VimOverlay({ payload, onExit }: { payload: Payload; onExit: () => void }) {
  useEffect(() => {
    let buffer = '';
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        buffer = '';
        return;
      }
      if (e.key === ':') {
        buffer = ':';
        return;
      }
      if (buffer.startsWith(':')) {
        if (e.key === 'Enter') {
          if (buffer === ':q' || buffer === ':wq' || buffer === ':q!' || buffer === ':x') {
            onExit();
          }
          buffer = '';
        } else if (e.key === 'Backspace') {
          buffer = buffer.slice(0, -1);
        } else if (e.key.length === 1) {
          buffer += e.key;
        }
        return;
      }
      if (e.key === 'q' || e.key === 'Q') {
        onExit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onExit]);

  const lines = payload.content.split('\n');

  return (
    <div className="vim-overlay">
      <div className="vim-header">{payload.title}</div>
      <div className="vim-content">
        <div className="vim-gutter">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="vim-text">{payload.content}</pre>
      </div>
      <div className="vim-status">NORMAL · type :q to quit · ESC anytime</div>
    </div>
  );
}
