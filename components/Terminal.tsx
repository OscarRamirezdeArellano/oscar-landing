'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { runCommand, getCommandNames, getCompletions } from '@/lib/commands';
import type { CommandContext, Lang, Theme } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/i18n';
import MatrixOverlay from './MatrixOverlay';
import VimOverlay from './VimOverlay';
import HackOverlay from './HackOverlay';
import ContactFormOverlay from './ContactFormOverlay';
import ChatOverlay from './ChatOverlay';
import VoidOverlay from './VoidOverlay';
import Sidebar from './Sidebar';
import { playKey, playEnter } from '@/lib/audio';

type Line = { id: number; node: React.ReactNode };
type Overlay = { type: 'matrix' | 'vim' | 'hack' | 'contact-form' | 'chat' | 'void'; payload?: unknown } | null;

const ASCII = `
 ██████╗ ███████╗ ██████╗ █████╗ ██████╗     ██████╗  █████╗ ███╗   ███╗██╗██████╗ ███████╗███████╗
██╔═══██╗██╔════╝██╔════╝██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗████╗ ████║██║██╔══██╗██╔════╝╚══███╔╝
██║   ██║███████╗██║     ███████║██████╔╝    ██████╔╝███████║██╔████╔██║██║██████╔╝█████╗    ███╔╝
██║   ██║╚════██║██║     ██╔══██║██╔══██╗    ██╔══██╗██╔══██║██║╚██╔╝██║██║██╔══██╗██╔══╝   ███╔╝
╚██████╔╝███████║╚██████╗██║  ██║██║  ██║    ██║  ██║██║  ██║██║ ╚═╝ ██║██║██║  ██║███████╗███████╗
 ╚═════╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝`;

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lang, setLangState] = useState<Lang>('en');
  const [theme, setThemeState] = useState<Theme>('tokyo-night');
  const [cwd, setCwdState] = useState('~');
  const [audioOn, setAudioOnState] = useState(false);
  const [booted, setBooted] = useState(false);
  const [overlay, setOverlayState] = useState<Overlay>(null);
  const [clock, setClock] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const lineId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bootedRef = useRef(false);
  const initialCmdRef = useRef<string | null>(null);

  // === Persistence + URL state (URL takes precedence) ===
  useEffect(() => {
    // 1. Restore from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem('oscar-terminal') ?? '{}');
      if (saved.lang) setLangState(saved.lang);
      if (saved.theme) setThemeState(saved.theme);
      if (saved.history) setHistory(saved.history);
      if (typeof saved.audioOn === 'boolean') setAudioOnState(saved.audioOn);
    } catch {}

    // 2. Apply URL params (deeplinks like ?cmd=projects&theme=matrix&lang=es)
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    const langParam = params.get('lang');
    const cmdParam = params.get('cmd');
    const validThemes: Theme[] = ['tokyo-night', 'dracula', 'matrix', 'gruvbox', 'cyberpunk'];
    if (themeParam && validThemes.includes(themeParam as Theme)) {
      setThemeState(themeParam as Theme);
    }
    if (langParam === 'en' || langParam === 'es') {
      setLangState(langParam);
    }
    if (cmdParam) {
      initialCmdRef.current = cmdParam.slice(0, 100);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        'oscar-terminal',
        JSON.stringify({ lang, theme, history: history.slice(-50), audioOn }),
      );
    } catch {}
  }, [lang, theme, history, audioOn]);

  // === Theme/lang to DOM ===
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    document.title = TRANSLATIONS.pageTitle[lang];
  }, [lang]);

  // === Clock ===
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const time = d.toLocaleTimeString(lang === 'es' ? 'es-MX' : 'en-US', {
        hour12: false,
        timeZone: 'America/Mexico_City',
      });
      setClock(time);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lang]);

  // === Helpers ===
  const pushLine = useCallback((node: React.ReactNode) => {
    setLines((prev) => [...prev, { id: ++lineId.current, node }]);
  }, []);

  const clearLines = useCallback(() => {
    setLines([]);
  }, []);

  const setOverlay = useCallback(
    (type: 'matrix' | 'vim' | 'hack' | 'contact-form' | 'chat' | 'void' | null, payload?: unknown) => {
      if (type === null) setOverlayState(null);
      else setOverlayState({ type, payload });
    },
    [],
  );

  // === Context for commands ===
  const ctxRef = useRef<CommandContext | null>(null);
  const ctx: CommandContext = useMemo(
    () => ({
      lang,
      theme,
      cwd,
      setLang: setLangState,
      setTheme: setThemeState,
      setCwd: setCwdState,
      clear: clearLines,
      print: pushLine,
      history,
      runCommand: async (cmd: string) => {
        await execute(cmd);
      },
      setOverlay,
      audioOn,
      setAudioOn: setAudioOnState,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang, theme, cwd, history, audioOn],
  );
  ctxRef.current = ctx;

  // === Execute command ===
  const execute = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) return;
      pushLine(<PromptDisplay cwd={cwd} cmd={trimmed} />);
      try {
        const out = await runCommand(trimmed, ctxRef.current!);
        if (out !== null && out !== undefined) {
          pushLine(out);
        }
        pushLine(<div className="line spacer" />);
      } catch (err) {
        pushLine(<div className="c-pink">error: {String(err)}</div>);
      }
      setHistory((prev) => [...prev, trimmed].slice(-100));
      setHistoryIndex(-1);
    },
    [cwd, pushLine],
  );

  // === Boot sequence ===
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    const bootLines = TRANSLATIONS.boot[lang];
    let i = 0;
    const next = () => {
      if (i >= bootLines.length) {
        pushLine(<AnimatedAscii art={ASCII} delayPerLineMs={80} />);
        // Wait for the ASCII to finish revealing before showing welcome
        const asciiLineCount = ASCII.split('\n').filter((l) => l.length > 0).length;
        const asciiDoneMs = asciiLineCount * 80 + 250;
        setTimeout(() => {
          pushLine(<div className="divider">─────────────────────────────────────────────────────────────────────────</div>);
          pushLine(<div className="c-cyan fade-in" style={{ fontSize: 16, fontWeight: 600 }}>{TRANSLATIONS.welcome[lang]}</div>);
          pushLine(
            <div className="fade-in">
              <span className="c-dim">{TRANSLATIONS.hint[lang].split("'")[0]}</span>
              <span className="c-accent">'help'</span>
              <span className="c-dim">{TRANSLATIONS.hint[lang].split("'help'")[1]}</span>
            </div>,
          );
          pushLine(<div className="line spacer" />);
          pushLine(<SuggestionRow lang={lang} onRun={execute} />);
          pushLine(<div className="line spacer" />);
          setBooted(true);
          setTimeout(() => inputRef.current?.focus(), 100);
          // Execute initial command from URL (?cmd=projects)
          if (initialCmdRef.current) {
            const cmd = initialCmdRef.current;
            initialCmdRef.current = null;
            setTimeout(() => execute(cmd), 600);
          }
        }, asciiDoneMs);
        return;
      }
      const text = bootLines[i];
      const isOk = text.includes('OK');
      pushLine(
        <div className="line fade-in">
          {isOk ? (
            <>
              <span className="c-dim">[</span>
              <span className="c-green">  OK  </span>
              <span className="c-dim">]</span>
              <span> {text.replace(/^\[\s+OK\s+\]/, '').trim()}</span>
            </>
          ) : (
            <span>{text}</span>
          )}
        </div>,
      );
      i++;
      setTimeout(next, 180 + Math.random() * 140);
    };
    setTimeout(next, 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Auto-scroll: keep at bottom whenever content height grows ===
  // We use a ResizeObserver because StaggerReveal pushes content over time,
  // and the lines array only updates when a *new* line is added — not when
  // existing components grow internally. This handles both.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    const scrollToBottom = (smooth = true) => {
      body.scrollTo({ top: body.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    };

    // Initial scroll on lines update
    scrollToBottom(true);

    // Watch content growth (StaggerReveal etc.)
    const ro = new ResizeObserver(() => {
      // Only stick to bottom if user is already near the bottom
      const distFromBottom = body.scrollHeight - body.scrollTop - body.clientHeight;
      if (distFromBottom < 300) scrollToBottom(false);
    });
    // Observe all children (they're what grow)
    Array.from(body.children).forEach((child) => ro.observe(child));
    return () => ro.disconnect();
  }, [lines]);

  // === Focus when clicking terminal body ===
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const handler = (e: MouseEvent) => {
      // Only focus if click is in body (not on a link/button)
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button, a')) return;
      inputRef.current?.focus();
    };
    body.addEventListener('click', handler);
    return () => body.removeEventListener('click', handler);
  }, []);

  // === Key handler ===
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (audioOn) playEnter();
      const cmd = input;
      setInput('');
      execute(cmd);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setInput(history[idx] ?? '');
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(idx);
        setInput(history[idx] ?? '');
      }
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const { matches, prefix } = getCompletions(input, cwd);
      if (matches.length === 0) return;
      if (matches.length === 1) {
        const match = matches[0];
        // No trailing space after directories — user often wants to keep typing
        const trailing = match.endsWith('/') ? '' : ' ';
        setInput(prefix + match + trailing);
      } else {
        // Multiple matches → show them and try longest-common-prefix completion
        const lcp = longestCommonPrefix(matches);
        const currentToken = input.slice(prefix.length);
        if (lcp.length > currentToken.length) {
          // Extend input to the LCP so user doesn't retype shared chars
          setInput(prefix + lcp);
        }
        pushLine(<PromptDisplay cwd={cwd} cmd={input} />);
        pushLine(
          <div>
            {matches.map((m, i) => (
              <span key={i} className="chip" onClick={() => setInput(prefix + m + (m.endsWith('/') ? '' : ' '))}>
                {m}
              </span>
            ))}
          </div>,
        );
        pushLine(<div className="line spacer" />);
      }
      return;
    }
    if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      clearLines();
      return;
    }
    if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      pushLine(<PromptDisplay cwd={cwd} cmd={input + '^C'} />);
      setInput('');
      return;
    }
    if (audioOn && e.key.length === 1) playKey();
  };

  return (
    <>
      {overlay?.type === 'matrix' && <MatrixOverlay onExit={() => setOverlayState(null)} />}
      {overlay?.type === 'vim' && (
        <VimOverlay payload={overlay.payload as { title: string; content: string }} onExit={() => setOverlayState(null)} />
      )}
      {overlay?.type === 'hack' && <HackOverlay onExit={() => setOverlayState(null)} />}
      {overlay?.type === 'contact-form' && <ContactFormOverlay lang={lang} onExit={() => setOverlayState(null)} />}
      {overlay?.type === 'chat' && <ChatOverlay lang={lang} onExit={() => setOverlayState(null)} />}
      {overlay?.type === 'void' && <VoidOverlay lang={lang} onExit={() => setOverlayState(null)} />}

      <div className="shell">
        <div className="terminal-window">
          <div className="terminal-titlebar">
            <div className="terminal-dots">
              <span /><span /><span />
            </div>
            <div className="terminal-title">oscar@iqsit — ~ — {cwd === '~' ? 'zsh' : `zsh · ${cwd}`}</div>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="toggle command palette"
            >
              ☰
            </button>
            <div className="lang-toggle" role="group" aria-label="language">
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLangState('en')}
                aria-label="English"
              >
                EN
              </button>
              <button
                className={lang === 'es' ? 'active' : ''}
                onClick={() => setLangState('es')}
                aria-label="Español"
              >
                ES
              </button>
            </div>
            <div className="terminal-info">
              <span><span className="status-dot" />online</span>
              <span>{clock}</span>
            </div>
          </div>
          <div className="terminal-body" ref={bodyRef}>
            {lines.map((l) => (
              <React.Fragment key={l.id}>{l.node}</React.Fragment>
            ))}
            {booted && (
              <div className="prompt-line">
                <Prompt cwd={cwd} />
                <span className="input-wrap" onClick={() => inputRef.current?.focus()}>
                  <input
                    ref={inputRef}
                    className="terminal-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </span>
              </div>
            )}
          </div>
        </div>
        <Sidebar
          lang={lang}
          theme={theme}
          onSetLang={setLangState}
          onSetTheme={setThemeState}
          onRun={execute}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </>
  );
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="prompt">
      <span>oscar</span>
      <span className="prompt-sep">@</span>
      <span className="prompt-host">iqsit</span>
      <span className="prompt-sep">:</span>
      <span className="prompt-path">{cwd}</span>
      <span className="prompt-marker"> $</span>
    </span>
  );
}

function PromptDisplay({ cwd, cmd }: { cwd: string; cmd: string }) {
  return (
    <div className="prompt-line">
      <Prompt cwd={cwd} />
      <span className="c-bright">{cmd}</span>
    </div>
  );
}

function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}

function AnimatedAscii({ art, delayPerLineMs = 80 }: { art: string; delayPerLineMs?: number }) {
  const lines = React.useMemo(() => art.split('\n').filter((l) => l.length > 0), [art]);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= lines.length) return;
    const t = setTimeout(() => setShown((v) => v + 1), delayPerLineMs);
    return () => clearTimeout(t);
  }, [shown, lines.length, delayPerLineMs]);
  return (
    <pre className="ascii-art">
      {lines.slice(0, shown).join('\n')}
      {shown < lines.length ? '\n' : ''}
    </pre>
  );
}

function SuggestionRow({ lang, onRun }: { lang: Lang; onRun: (cmd: string) => void }) {
  const labels = ['about', 'projects', 'repos', 'skills', 'services', 'contact', 'cv', 'tour', 'help'];
  return (
    <div>
      <span className="c-dim">{TRANSLATIONS.try[lang]}: </span>
      {labels.map((c) => (
        <span key={c} className="chip" onClick={() => onRun(c)}>
          {c}
        </span>
      ))}
      <span className="c-dim" style={{ marginLeft: 8, fontSize: 12 }}>
        {lang === 'en' ? '· or use the command palette →' : '· o usa la paleta de comandos →'}
      </span>
    </div>
  );
}
