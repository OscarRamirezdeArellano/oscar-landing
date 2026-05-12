'use client';

import React from 'react';
import type { Lang, Theme } from '@/lib/types';

type Props = {
  lang: Lang;
  theme: Theme;
  onSetLang: (l: Lang) => void;
  onSetTheme: (t: Theme) => void;
  onRun: (cmd: string) => void;
  open: boolean;
  onClose: () => void;
};

const THEMES: { id: Theme; label: string }[] = [
  { id: 'tokyo-night', label: 'tokyo' },
  { id: 'dracula', label: 'dracula' },
  { id: 'matrix', label: 'matrix' },
  { id: 'gruvbox', label: 'gruvbox' },
  { id: 'cyberpunk', label: 'cyberpunk' },
];

type CmdEntry = { cmd: string; en: string; es: string };

const SECTIONS: { title: { en: string; es: string }; cmds: CmdEntry[] }[] = [
  {
    title: { en: '◆ Get to know me', es: '◆ Conóceme' },
    cmds: [
      { cmd: 'whoami',     en: 'one-line identity',     es: 'identidad' },
      { cmd: 'about',      en: 'about me',              es: 'sobre mí' },
      { cmd: 'neofetch',   en: 'profile card',          es: 'tarjeta de perfil' },
      { cmd: 'experience', en: 'work history',          es: 'experiencia' },
    ],
  },
  {
    title: { en: '◆ Work', es: '◆ Proyectos' },
    cmds: [
      { cmd: 'projects', en: '32 curated projects',    es: '32 proyectos curados' },
      { cmd: 'repos',    en: '80+ repos · by numbers', es: '80+ repos · en números' },
      { cmd: 'skills',   en: 'tech stack',             es: 'stack técnico' },
      { cmd: 'services', en: 'services offered',       es: 'servicios' },
    ],
  },
  {
    title: { en: '◆ Connect', es: '◆ Conectar' },
    cmds: [
      { cmd: 'chat',    en: '◆ ask my AI anything', es: '◆ pregúntale a mi IA' },
      { cmd: 'compose', en: '✉ send a message',    es: '✉ enviar mensaje' },
      { cmd: 'contact', en: 'all contact channels', es: 'todos los canales' },
      { cmd: 'cv en',   en: 'download CV (EN)',     es: 'CV en inglés' },
      { cmd: 'cv es',   en: 'download CV (ES)',     es: 'CV en español' },
      { cmd: 'hire',    en: 'service menu',         es: 'menú servicios' },
    ],
  },
  {
    title: { en: '◆ Filesystem', es: '◆ Filesystem' },
    cmds: [
      { cmd: 'ls',   en: 'list',          es: 'listar' },
      { cmd: 'tree', en: 'full tree',     es: 'árbol completo' },
      { cmd: 'cd projects', en: 'go to projects/', es: 'ir a projects/' },
      { cmd: 'cat about.md', en: 'view about.md', es: 'ver about.md' },
    ],
  },
  {
    title: { en: '◆ The pitch', es: '◆ El pitch' },
    cmds: [
      { cmd: 'status',    en: 'availability & focus', es: 'disponibilidad y foco' },
      { cmd: 'why-me',    en: 'what makes me different', es: 'qué me diferencia' },
      { cmd: 'changelog', en: "what's new on this site", es: 'qué hay nuevo' },
    ],
  },
  {
    title: { en: '◆ Live & fun', es: '◆ Vivo & fun' },
    cmds: [
      { cmd: 'weather',  en: 'weather Veracruz', es: 'clima Veracruz' },
      { cmd: 'stats',    en: 'GitHub stats',     es: 'stats GitHub' },
      { cmd: 'tour',     en: 'auto-guided tour', es: 'tour auto-guiado' },
      { cmd: 'top',      en: 'projects as procs',es: 'proyectos como procs' },
      { cmd: 'coffee',   en: 'brew a coffee',    es: 'prepara un café' },
      { cmd: 'matrix',   en: '☢ enter the matrix', es: '☢ entrar al matrix' },
      { cmd: 'hack',     en: '☢ fake hack',      es: '☢ hack falso' },
      { cmd: 'void',     en: '☢ enter the void',     es: '☢ entrar al void' },
      { cmd: 'hologram', en: '☢ orbital terminal',   es: '☢ terminal orbital' },
      { cmd: 'sudo',     en: '☢ try it',          es: '☢ pruébalo' },
    ],
  },
];

export default function Sidebar({ lang, theme, onSetLang, onSetTheme, onRun, open, onClose }: Props) {
  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-header">
        <span>{lang === 'en' ? 'COMMAND PALETTE' : 'PALETA DE COMANDOS'}</span>
        <span className="c-dim" style={{ fontSize: 10 }}>{lang === 'en' ? 'click any' : 'click en cualquiera'}</span>
      </div>

      <div className="sidebar-body">
        {SECTIONS.map((sec, i) => (
          <div className="sidebar-section" key={i}>
            <h4>{sec.title[lang]}</h4>
            {sec.cmds.map((c) => (
              <button
                key={c.cmd}
                className="sidebar-cmd"
                onClick={() => {
                  onRun(c.cmd);
                  if (open) onClose();
                }}
              >
                <span className="c-accent">{c.cmd}</span>
                <span className="desc">{lang === 'en' ? c.en : c.es}</span>
              </button>
            ))}
          </div>
        ))}

        <div className="sidebar-section">
          <h4>{lang === 'en' ? '◆ Theme' : '◆ Tema'}</h4>
          <div className="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={t.id === theme ? 'active' : ''}
                onClick={() => onSetTheme(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section">
          <h4>{lang === 'en' ? '◆ Tips' : '◆ Tips'}</h4>
          <div className="c-dim" style={{ fontSize: 11.5, lineHeight: 1.65 }}>
            <div>↑↓ {lang === 'en' ? 'history' : 'historial'}</div>
            <div>Tab {lang === 'en' ? 'autocomplete' : 'autocompletar'}</div>
            <div>Ctrl+L {lang === 'en' ? 'clear' : 'limpiar'}</div>
            <div>Ctrl+C {lang === 'en' ? 'cancel line' : 'cancelar línea'}</div>
            <div>q / ESC {lang === 'en' ? 'exit overlays' : 'salir overlays'}</div>
          </div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="c-dim">oscar@iqsit.com</div>
        <div className="c-dim" style={{ marginTop: 2 }}>
          {lang === 'en' ? 'click anywhere to focus input' : 'click donde sea para enfocar input'}
        </div>
      </div>
    </aside>
  );
}
