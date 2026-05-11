'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/lib/types';
import { CHAT_OPENING } from '@/lib/data/chat-context';
import Markdown from './Markdown';

type Message = { role: 'user' | 'assistant'; content: string };

export default function ChatOverlay({ lang, onExit }: { lang: Lang; onExit: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: CHAT_OPENING[lang] },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  // ESC to close (armed after 200ms to ignore the Enter that opened us)
  useEffect(() => {
    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 200);
    const handler = (e: KeyboardEvent) => {
      if (!armed) return;
      if (e.key === 'Escape') {
        abortRef.current?.abort();
        onExit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      clearTimeout(arm);
      window.removeEventListener('keydown', handler);
    };
  }, [onExit]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setError('');

    const userMsg: Message = { role: 'user', content: text };
    const nextHistory: Message[] = [...messages, userMsg];
    // The API doesn't need the opener (which is hardcoded client-side); skip the first
    // assistant message if it's the opener.
    const apiMessages =
      nextHistory[0]?.role === 'assistant' ? nextHistory.slice(1) : nextHistory;

    setMessages([...nextHistory, { role: 'assistant', content: '' }]);
    setInput('');
    setSending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, lang }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => '');
        setError(text || `HTTP ${res.status}`);
        setMessages((prev) => prev.slice(0, -1));
        setSending(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        acc += chunk;
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: 'assistant', content: acc };
          return copy;
        });
      }
    } catch (e: unknown) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        // user cancelled — no error message
      } else {
        setError(String(e));
        setMessages((prev) => prev.slice(0, -1));
      }
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const labels = lang === 'en'
    ? {
        title: 'chat — talk to my AI assistant',
        placeholder: 'Ask anything about Oscar...',
        send: 'Send',
        close: 'Close (ESC)',
        sending: 'thinking',
        compose: 'compose',
        composeHint: 'to send a real message',
      }
    : {
        title: 'chat — habla con mi asistente IA',
        placeholder: 'Pregunta lo que sea sobre Oscar...',
        send: 'Enviar',
        close: 'Cerrar (ESC)',
        sending: 'pensando',
        compose: 'compose',
        composeHint: 'para enviar un mensaje real',
      };

  return (
    <div className="modal-backdrop" onClick={onExit}>
      <div className="modal-window chat-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-titlebar">
          <div className="terminal-dots">
            <span /><span /><span />
          </div>
          <div className="modal-title">{labels.title}</div>
          <button className="modal-close" onClick={onExit} aria-label="close">✕</button>
        </div>

        <div className="chat-body" ref={bodyRef}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg chat-${m.role}`}>
              <div className="chat-role">
                {m.role === 'user' ? '> you' : '◆ oscar-ai'}
              </div>
              <div className="chat-content">
                {m.content ? (
                  <Markdown text={m.content} />
                ) : sending && i === messages.length - 1 ? (
                  <ThinkingDots label={labels.sending} />
                ) : null}
              </div>
            </div>
          ))}
          {error && (
            <div className="chat-error">
              ✕ {error}
              <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
                {lang === 'en'
                  ? 'You can still email oscar@iqsit.com or type `compose` for a contact form.'
                  : 'Puedes escribir a oscar@iqsit.com o teclear `compose` para el formulario.'}
              </div>
            </div>
          )}
        </div>

        <div className="chat-footer">
          <input
            ref={inputRef}
            className="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={labels.placeholder}
            disabled={sending}
            maxLength={1000}
          />
          <button className="modal-btn primary" onClick={send} disabled={sending || !input.trim()}>
            ▸ {sending ? labels.sending : labels.send}
          </button>
        </div>
      </div>
    </div>
  );
}

function ThinkingDots({ label }: { label: string }) {
  const [n, setN] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v % 3) + 1), 350);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="c-dim" style={{ fontStyle: 'italic' }}>
      {label}
      {'.'.repeat(n)}
    </span>
  );
}
