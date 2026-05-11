'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/lib/types';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactFormOverlay({
  lang,
  onExit,
}: {
  lang: Lang;
  onExit: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => nameRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 200);
    const handler = (e: KeyboardEvent) => {
      if (!armed) return;
      if (e.key === 'Escape') onExit();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit();
    };
    window.addEventListener('keydown', handler);
    return () => {
      clearTimeout(arm);
      window.removeEventListener('keydown', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onExit, name, email, message]);

  async function submit() {
    if (status === 'sending') return;
    setErrorMsg('');
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus('error');
        setErrorMsg(
          data?.error ?? (lang === 'en' ? 'unknown error' : 'error desconocido'),
        );
        return;
      }
      setStatus('sent');
    } catch (e) {
      setStatus('error');
      setErrorMsg(String(e));
    }
  }

  const labels = lang === 'en'
    ? { title: 'compose — new message', name: 'name', email: 'email', message: 'message', send: 'Send', cancel: 'Cancel (ESC)', shortcut: 'Ctrl+Enter to send · ESC to cancel', sending: 'Sending...', sent: 'Sent! I\'ll reply within 24 hours.', errors: { invalid_name: 'Name looks too short.', invalid_email: 'Email looks invalid.', invalid_message: 'Message is too short (10+ chars).', send_failed: 'Email service failed. Try emailing oscar@iqsit.com directly.', server_misconfigured: 'Server not configured. Email oscar@iqsit.com directly.', unexpected: 'Something went wrong. Try again or email oscar@iqsit.com.' } as Record<string, string> }
    : { title: 'compose — nuevo mensaje', name: 'nombre', email: 'email', message: 'mensaje', send: 'Enviar', cancel: 'Cancelar (ESC)', shortcut: 'Ctrl+Enter para enviar · ESC para cancelar', sending: 'Enviando...', sent: '¡Enviado! Te responderé en menos de 24 horas.', errors: { invalid_name: 'El nombre es muy corto.', invalid_email: 'El email no parece válido.', invalid_message: 'El mensaje es muy corto (10+ caracteres).', send_failed: 'Falló el envío. Escribe directo a oscar@iqsit.com.', server_misconfigured: 'Servidor no configurado. Escribe a oscar@iqsit.com.', unexpected: 'Algo salió mal. Inténtalo de nuevo o escribe a oscar@iqsit.com.' } as Record<string, string> };

  return (
    <div className="modal-backdrop" onClick={onExit}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-titlebar">
          <div className="terminal-dots">
            <span /><span /><span />
          </div>
          <div className="modal-title">{labels.title}</div>
          <button className="modal-close" onClick={onExit} aria-label="close">✕</button>
        </div>
        <div className="modal-body">
          {status === 'sent' ? (
            <div className="modal-success fade-in">
              <div style={{ fontSize: 36, marginBottom: 8 }}>✓</div>
              <div className="c-green" style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
                {labels.sent}
              </div>
              <div className="c-dim" style={{ fontSize: 13 }}>
                {lang === 'en' ? 'You can close this window now.' : 'Puedes cerrar esta ventana.'}
              </div>
              <button className="modal-btn primary" style={{ marginTop: 16 }} onClick={onExit}>
                {lang === 'en' ? 'Close' : 'Cerrar'}
              </button>
            </div>
          ) : (
            <>
              <div className="form-row">
                <label className="form-label">{labels.name}</label>
                <input
                  ref={nameRef}
                  className="form-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'en' ? 'Your name' : 'Tu nombre'}
                  maxLength={120}
                  disabled={status === 'sending'}
                />
              </div>
              <div className="form-row">
                <label className="form-label">{labels.email}</label>
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  maxLength={200}
                  disabled={status === 'sending'}
                />
              </div>
              <div className="form-row">
                <label className="form-label">{labels.message}</label>
                <textarea
                  className="form-input form-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={lang === 'en'
                    ? 'Tell me about your project, problem, or just say hi...'
                    : 'Cuéntame del proyecto, el problema, o saluda...'}
                  maxLength={5000}
                  rows={6}
                  disabled={status === 'sending'}
                />
                <div className="form-counter">{message.length}/5000</div>
              </div>

              {status === 'error' && (
                <div className="c-pink form-error">
                  ✕ {labels.errors[errorMsg] ?? errorMsg}
                </div>
              )}

              <div className="modal-actions">
                <button className="modal-btn" onClick={onExit} disabled={status === 'sending'}>
                  {labels.cancel}
                </button>
                <button
                  className="modal-btn primary"
                  onClick={submit}
                  disabled={status === 'sending' || !name.trim() || !email.trim() || !message.trim()}
                >
                  {status === 'sending' ? `▸ ${labels.sending}` : `▸ ${labels.send}`}
                </button>
              </div>
              <div className="form-hint">{labels.shortcut}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
