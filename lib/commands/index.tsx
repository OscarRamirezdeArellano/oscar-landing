'use client';

import React from 'react';
import type { Command, CommandContext, Lang, Theme } from '../types';
import { PROJECTS, getProject } from '../data/projects';
import { SKILLS, getSkillGroup } from '../data/skills';
import { EXPERIENCE } from '../data/experience';
import { resolvePath, listChildren, ROOT, type VNode } from '../fs';
import {
  ProjectView,
  ProjectList,
  SkillsView,
  SkillGroupView,
  ExperienceView,
  AboutView,
  ServicesView,
  ServiceDetailView,
  ContactView,
  NeofetchView,
} from '@/components/views';
import { Spinner, BarRow, StaggerReveal, ProgressBar, sleep } from '@/components/Loaders';
import { SERVICES } from '../data/services';
import { STATUS, DIFFERENTIATION, CHANGELOG } from '../data/status';
import { figletize } from '../ascii-font';

const THEMES: Theme[] = ['tokyo-night', 'dracula', 'matrix', 'gruvbox', 'cyberpunk'];

// === Helpers ===
const _ = (lang: Lang, en: string, es: string) => (lang === 'en' ? en : es);

function err(text: string) {
  return <div><span className="c-pink">{text}</span></div>;
}

// === Commands ===
const COMMANDS: Record<string, Command> = {
  // ---------- HELP ----------
  help: {
    name: 'help',
    description: { en: 'list available commands', es: 'lista comandos disponibles' },
    run: (_args, ctx) => (
      <div className="fade-in">
        <div className="heading">{_(ctx.lang, 'Available commands', 'Comandos disponibles')}</div>
        <div style={{ marginLeft: 12 }}>
          <StaggerReveal delayMs={35}>
          <div className="subheading">{_(ctx.lang, '◆ Navigation', '◆ Navegación')}</div>
          <CommandRow cmd="about" desc={_(ctx.lang, 'who I am, what I do', 'quién soy, qué hago')} />
          <CommandRow cmd="projects" desc={_(ctx.lang, 'all projects, grouped by domain', 'todos los proyectos por dominio')} />
          <CommandRow cmd="skills" desc={_(ctx.lang, 'tech stack tree', 'stack técnico por categoría')} />
          <CommandRow cmd="experience" desc={_(ctx.lang, 'work history', 'historial laboral')} />
          <CommandRow cmd="services" desc={_(ctx.lang, 'what I can build for you', 'lo que puedo construir')} />
          <CommandRow cmd="contact" desc={_(ctx.lang, 'how to reach me', 'cómo contactarme')} />

          <div className="subheading">{_(ctx.lang, '◆ Filesystem', '◆ Filesystem')}</div>
          <CommandRow cmd="ls [path]" desc={_(ctx.lang, 'list directory', 'listar directorio')} />
          <CommandRow cmd="cd [path]" desc={_(ctx.lang, 'change directory (try cd projects/)', 'cambiar directorio (prueba cd projects/)')} />
          <CommandRow cmd="cat [file]" desc={_(ctx.lang, 'show file content (cat projects/<name>)', 'mostrar contenido (cat projects/<name>)')} />
          <CommandRow cmd="tree" desc={_(ctx.lang, 'show full file tree', 'mostrar árbol completo')} />
          <CommandRow cmd="pwd" desc={_(ctx.lang, 'print working directory', 'directorio actual')} />

          <div className="subheading">{_(ctx.lang, '◆ Actions', '◆ Acciones')}</div>
          <CommandRow cmd="chat" desc={_(ctx.lang, '◆ ask my AI assistant anything', '◆ pregúntale lo que sea a mi asistente IA')} />
          <CommandRow cmd="compose" desc={_(ctx.lang, '✉ open inline contact form', '✉ abrir formulario de contacto')} />
          <CommandRow cmd="cv [en|es]" desc={_(ctx.lang, 'download my resume PDF', 'descargar mi CV en PDF')} />
          <CommandRow cmd="tour" desc={_(ctx.lang, 'auto-guided tour of this terminal', 'tour auto-guiado del terminal')} />
          <CommandRow cmd="hire" desc={_(ctx.lang, 'service menu', 'menú de servicios')} />
          <CommandRow cmd="status" desc={_(ctx.lang, 'current availability & focus', 'disponibilidad y foco actual')} />
          <CommandRow cmd="why-me" desc={_(ctx.lang, 'what makes me different', 'qué me diferencia')} />
          <CommandRow cmd="changelog" desc={_(ctx.lang, "what's new on this site", 'qué hay nuevo en el sitio')} />

          <div className="subheading">{_(ctx.lang, '◆ Settings', '◆ Configuración')}</div>
          <CommandRow cmd="theme [name]" desc={_(ctx.lang, 'switch theme (5 available)', 'cambiar tema (5 disponibles)')} />
          <CommandRow cmd="lang [en|es]" desc={_(ctx.lang, 'switch language', 'cambiar idioma')} />
          <CommandRow cmd="audio [on|off]" desc={_(ctx.lang, 'toggle keypress sounds', 'sonidos de teclado')} />

          <div className="subheading">{_(ctx.lang, '◆ Live data', '◆ Datos en vivo')}</div>
          <CommandRow cmd="weather" desc={_(ctx.lang, 'live weather in Veracruz', 'clima en vivo Veracruz')} />
          <CommandRow cmd="stats" desc={_(ctx.lang, 'live GitHub user stats', 'estadísticas usuario GitHub')} />
          <CommandRow cmd="repos" desc={_(ctx.lang, 'live list of ALL public repos', 'lista en vivo de TODOS los repos')} />

          <div className="subheading">{_(ctx.lang, '◆ Fun', '◆ Fun')}</div>
          <CommandRow cmd="top" desc={_(ctx.lang, 'projects as live "processes"', 'proyectos como "procesos" vivos')} />
          <CommandRow cmd="coffee" desc={_(ctx.lang, 'brew a coffee', 'prepara un café')} />
          <CommandRow cmd="figlet [text]" desc={_(ctx.lang, 'big ASCII-art text', 'texto en ASCII art grande')} />
          <CommandRow cmd="matrix" desc={_(ctx.lang, '☢ enter the matrix', '☢ entrar al matrix')} />
          <CommandRow cmd="hack" desc={_(ctx.lang, '☢ fake hacking animation', '☢ animación de hackeo')} />

          <div className="subheading">{_(ctx.lang, '◆ Misc', '◆ Misc')}</div>
          <CommandRow cmd="neofetch" desc={_(ctx.lang, 'cool profile card', 'tarjeta de perfil')} />
          <CommandRow cmd="whoami" desc={_(ctx.lang, 'one-liner identity', 'identidad en una línea')} />
          <CommandRow cmd="date" desc={_(ctx.lang, 'current date/time', 'fecha/hora actual')} />
          <CommandRow cmd="history" desc={_(ctx.lang, 'command history', 'historial de comandos')} />
          <CommandRow cmd="echo [...]" desc={_(ctx.lang, 'print arguments', 'imprimir argumentos')} />
          <CommandRow cmd="clear" desc={_(ctx.lang, 'clear the terminal (Ctrl+L)', 'limpiar terminal (Ctrl+L)')} />

          <div className="c-dim" style={{ marginTop: 10, fontSize: 12 }}>
            {_(ctx.lang,
              'Hints: ↑↓ history · Tab autocomplete · Ctrl+L clear · Ctrl+C cancel',
              'Tips: ↑↓ historial · Tab autocompletar · Ctrl+L limpiar · Ctrl+C cancelar')}
          </div>
          </StaggerReveal>
        </div>
      </div>
    ),
  },

  // ---------- INFO ----------
  about: {
    name: 'about',
    description: { en: 'who I am', es: 'quién soy' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Loading bio', 'Cargando bio')} /></div>);
      await sleep(380);
      ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">about.md</span></div>);
      await sleep(100);
      return <AboutView lang={ctx.lang} />;
    },
  },
  whoami: {
    name: 'whoami',
    description: { en: 'identity one-liner', es: 'identidad' },
    run: async (_args, ctx) => {
      ctx.print(
        <div>
          <span className="c-green">oscar</span>
          <span className="c-dim"> · </span>
          <span className="c-bright">{_(ctx.lang, 'Full Stack & DevOps Engineer', 'Ingeniero Full Stack & DevOps')}</span>
        </div>,
      );
      await sleep(180);
      ctx.print(
        <div className="c-cyan">
          {_(ctx.lang, 'AI Integration & Vertical SaaS Architect', 'Integración IA & Arquitecto SaaS Vertical')}
        </div>,
      );
      await sleep(180);
      return (
        <div className="c-dim">
          Veracruz, MX · 20+ years · {_(ctx.lang, 'remote-first', 'trabajo remoto')}
        </div>
      );
    },
  },
  projects: {
    name: 'projects',
    description: { en: 'all projects', es: 'todos los proyectos' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Loading projects', 'Cargando proyectos')} /></div>);
      await sleep(450);
      ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">{_(ctx.lang, `Loaded ${PROJECTS.length} curated projects across 11 industries`, `Cargados ${PROJECTS.length} proyectos curados en 11 industrias`)}</span></div>);
      await sleep(120);
      return <ProjectList projects={PROJECTS} lang={ctx.lang} />;
    },
  },
  skills: {
    name: 'skills',
    aliases: ['stack'],
    description: { en: 'tech stack', es: 'stack técnico' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Compiling stack', 'Compilando stack')} /></div>);
      await sleep(400);
      ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">{_(ctx.lang, `13 categories · 100+ technologies in active rotation`, `13 categorías · 100+ tecnologías en rotación activa`)}</span></div>);
      await sleep(100);
      return <SkillsView groups={SKILLS} lang={ctx.lang} />;
    },
  },
  experience: {
    name: 'experience',
    description: { en: 'work history', es: 'historial laboral' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Reading work history', 'Leyendo historial')} /></div>);
      await sleep(350);
      return <ExperienceView items={EXPERIENCE} lang={ctx.lang} />;
    },
  },
  services: {
    name: 'services',
    description: { en: 'what I build', es: 'lo que construyo' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Reading service menu', 'Leyendo menú de servicios')} /></div>);
      await sleep(320);
      ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">services.md</span></div>);
      await sleep(100);
      return <ServicesView lang={ctx.lang} />;
    },
  },
  contact: {
    name: 'contact',
    description: { en: 'how to reach me', es: 'cómo contactarme' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Resolving contact channels', 'Resolviendo canales de contacto')} /></div>);
      await sleep(320);
      ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">contact.md · 5 channels</span></div>);
      await sleep(100);
      return <ContactView lang={ctx.lang} />;
    },
  },
  hire: {
    name: 'hire',
    description: { en: 'service menu', es: 'menú de servicios' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Opening hire menu', 'Abriendo menú de contratación')} /></div>);
      await sleep(280);
      return <ServicesView lang={ctx.lang} />;
    },
  },
  compose: {
    name: 'compose',
    aliases: ['send-message', 'message', 'mail'],
    description: { en: 'open inline contact form', es: 'abrir formulario de contacto' },
    run: (_args, ctx) => {
      ctx.setOverlay('contact-form');
      return null;
    },
  },
  chat: {
    name: 'chat',
    aliases: ['ai', 'ask'],
    description: { en: 'talk to my AI assistant (powered by Claude)', es: 'habla con mi asistente IA (powered by Claude)' },
    run: (_args, ctx) => {
      ctx.setOverlay('chat');
      return null;
    },
  },
  void: {
    name: 'void',
    aliases: ['glsl', 'webgl', 'space'],
    description: { en: 'enter the void (WebGL)', es: 'entrar al void (WebGL)' },
    run: (_args, ctx) => {
      ctx.setOverlay('void');
      return null;
    },
  },
  neofetch: {
    name: 'neofetch',
    description: { en: 'cool profile card', es: 'tarjeta de perfil' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Probing host', 'Probando host')} /></div>);
      await sleep(450);
      ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">host: oscar.iqsit.com · OK</span></div>);
      await sleep(100);
      return <NeofetchView lang={ctx.lang} />;
    },
  },

  // ---------- FILESYSTEM ----------
  ls: {
    name: 'ls',
    aliases: ['dir'],
    description: { en: 'list directory', es: 'listar directorio' },
    run: (args, ctx) => {
      const target = args[0];
      const result = resolvePath(ctx.cwd, target);
      if (!result) return err(`ls: ${target}: ${_(ctx.lang, 'no such file or directory', 'no existe el archivo o directorio')}`);
      if (result.node.type === 'file') {
        return <div><span className="c-cyan">{result.node.name}</span></div>;
      }
      const children = listChildren(result.node);
      return (
        <div className="fade-in" style={{ marginLeft: 12 }}>
          {children.map((c) => (
            <span key={c.name} style={{ display: 'inline-block', minWidth: 200, marginRight: 12 }}>
              <span className={c.type === 'dir' ? 'c-blue' : 'c-cyan'}>
                {c.type === 'dir' ? `${c.name}/` : c.name}
              </span>
            </span>
          ))}
        </div>
      );
    },
  },
  cd: {
    name: 'cd',
    description: { en: 'change directory', es: 'cambiar directorio' },
    run: (args, ctx) => {
      const target = args[0] ?? '~';
      const result = resolvePath(ctx.cwd, target);
      if (!result) return err(`cd: ${target}: ${_(ctx.lang, 'no such directory', 'no existe el directorio')}`);
      if (result.node.type !== 'dir') return err(`cd: ${target}: ${_(ctx.lang, 'not a directory', 'no es un directorio')}`);
      ctx.setCwd(result.path);
      return null;
    },
  },
  pwd: {
    name: 'pwd',
    description: { en: 'print working directory', es: 'directorio actual' },
    run: (_args, ctx) => <div className="c-yellow">{ctx.cwd}</div>,
  },
  cat: {
    name: 'cat',
    description: { en: 'show file content', es: 'mostrar contenido del archivo' },
    run: (args, ctx) => {
      if (!args[0]) return err('cat: ' + _(ctx.lang, 'missing file operand', 'falta el archivo'));
      const result = resolvePath(ctx.cwd, args[0]);
      if (!result) return err(`cat: ${args[0]}: ${_(ctx.lang, 'no such file', 'no existe el archivo')}`);
      const node = result.node;
      if (node.type === 'dir') return err(`cat: ${args[0]}: ${_(ctx.lang, 'is a directory', 'es un directorio')}`);
      return resolveFileView(node, ctx);
    },
  },
  tree: {
    name: 'tree',
    description: { en: 'show full filesystem tree', es: 'mostrar árbol completo' },
    run: (_args, ctx) => <TreeView node={ROOT} lang={ctx.lang} />,
  },

  // ---------- SETTINGS ----------
  theme: {
    name: 'theme',
    description: { en: 'switch theme', es: 'cambiar tema' },
    run: (args, ctx) => {
      const name = args[0];
      if (!name) {
        return (
          <div className="fade-in" style={{ marginLeft: 12 }}>
            <div className="c-dim">{_(ctx.lang, 'Current:', 'Actual:')} <span className="c-accent">{ctx.theme}</span></div>
            <div className="c-dim" style={{ marginTop: 6 }}>{_(ctx.lang, 'Available:', 'Disponibles:')}</div>
            {THEMES.map((t) => (
              <div key={t} style={{ marginLeft: 16 }}>
                <span className={t === ctx.theme ? 'c-accent' : 'c-cyan'}>{t === ctx.theme ? '● ' : '○ '}{t}</span>
              </div>
            ))}
            <div className="c-dim" style={{ marginTop: 6, fontSize: 12 }}>
              {_(ctx.lang, 'try', 'prueba')}: <span className="c-yellow">theme dracula</span>
            </div>
          </div>
        );
      }
      if (!THEMES.includes(name as Theme)) return err(`theme: ${_(ctx.lang, 'unknown theme', 'tema desconocido')}: ${name}`);
      ctx.setTheme(name as Theme);
      return <div><span className="c-green">●</span> {_(ctx.lang, 'Theme set to', 'Tema cambiado a')} <span className="c-accent">{name}</span></div>;
    },
  },
  lang: {
    name: 'lang',
    aliases: ['language', 'idioma'],
    description: { en: 'switch language', es: 'cambiar idioma' },
    run: (args, ctx) => {
      const target = args[0];
      if (!target) {
        return (
          <div>
            <div className="c-dim">{_(ctx.lang, 'Current:', 'Actual:')} <span className="c-accent">{ctx.lang}</span></div>
            <div className="c-dim">{_(ctx.lang, 'Available:', 'Disponibles:')} <span className="c-cyan">en</span>, <span className="c-cyan">es</span></div>
          </div>
        );
      }
      const t = target.toLowerCase();
      if (t !== 'en' && t !== 'es') return err(`lang: ${_(ctx.lang, 'unknown language', 'idioma desconocido')}: ${target}`);
      ctx.setLang(t as Lang);
      return <div><span className="c-green">●</span> {t === 'en' ? 'Language set to English.' : 'Idioma cambiado a Español.'}</div>;
    },
  },
  audio: {
    name: 'audio',
    description: { en: 'toggle keypress sounds', es: 'sonidos de teclado' },
    run: (args, ctx) => {
      const target = args[0];
      const next = target === 'on' ? true : target === 'off' ? false : !ctx.audioOn;
      ctx.setAudioOn(next);
      return (
        <div>
          <span className="c-green">●</span> {_(ctx.lang, 'Audio', 'Audio')}:{' '}
          <span className={next ? 'c-accent' : 'c-dim'}>{next ? 'on' : 'off'}</span>
        </div>
      );
    },
  },

  // ---------- CV ----------
  cv: {
    name: 'cv',
    aliases: ['resume', 'curriculum'],
    description: { en: 'download CV PDF', es: 'descargar CV en PDF' },
    run: (args, ctx) => {
      const which = args[0]?.toLowerCase();
      if (which !== 'en' && which !== 'es') {
        return (
          <div className="fade-in" style={{ marginLeft: 12 }}>
            <div className="heading">{_(ctx.lang, 'Download CV', 'Descargar CV')}</div>
            <div className="bullet">
              <span><span className="c-yellow">cv en</span> — <a href="/resume_en.pdf" download>Resume (English)</a></span>
            </div>
            <div className="bullet">
              <span><span className="c-yellow">cv es</span> — <a href="/resume_es.pdf" download>Currículum (Español)</a></span>
            </div>
            <div className="bullet">
              <span><span className="c-yellow">cv en --1page</span> — <a href="/resume_1page_en.pdf" download>1-page version (EN)</a></span>
            </div>
            <div className="bullet">
              <span><span className="c-yellow">cv es --1page</span> — <a href="/resume_1page_es.pdf" download>Versión 1 página (ES)</a></span>
            </div>
          </div>
        );
      }
      const onePage = args.includes('--1page') || args.includes('-1');
      const filename = onePage ? `resume_1page_${which}.pdf` : `resume_${which}.pdf`;
      // Trigger download via anchor
      if (typeof window !== 'undefined') {
        const a = document.createElement('a');
        a.href = `/${filename}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      return (
        <div className="fade-in">
          <span className="c-green">↓</span>{' '}
          {_(ctx.lang, 'Downloading', 'Descargando')} <span className="c-accent">{filename}</span>...
        </div>
      );
    },
  },

  // ---------- LIVE DATA ----------
  weather: {
    name: 'weather',
    description: { en: 'live weather Veracruz', es: 'clima en vivo Veracruz' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Pinging Open-Meteo @ Veracruz', 'Pidiendo a Open-Meteo @ Veracruz')} /></div>);
      try {
        // Open-Meteo: free, no key required
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=19.2&longitude=-96.13&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=America%2FMexico_City';
        const t0 = performance.now();
        const res = await fetch(url);
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        const elapsed = Math.round(performance.now() - t0);
        ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">200 OK · {elapsed}ms</span></div>);
        await sleep(120);
        const c = data.current;
        const code = c.weather_code as number;
        const desc = weatherCodeToText(code, ctx.lang);
        const icon = weatherCodeToIcon(code, c.is_day === 1);
        return (
          <div className="fade-in" style={{ marginLeft: 12 }}>
            <div className="heading">{_(ctx.lang, 'Weather in Veracruz, MX', 'Clima en Veracruz, MX')}</div>
            <div className="box">
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <div className="c-bright" style={{ fontSize: 18 }}>{Math.round(c.temperature_2m)}°C · {desc}</div>
              <div className="c-dim" style={{ marginTop: 6 }}>
                {_(ctx.lang, 'humidity', 'humedad')}: {c.relative_humidity_2m}% · {_(ctx.lang, 'wind', 'viento')}: {Math.round(c.wind_speed_10m)} km/h
              </div>
            </div>
          </div>
        );
      } catch {
        return err(_(ctx.lang, 'weather: API unreachable, try again', 'weather: API no disponible, intenta otra vez'));
      }
    },
  },
  stats: {
    name: 'stats',
    aliases: ['github'],
    description: { en: 'live GitHub stats', es: 'estadísticas GitHub' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Querying api.github.com', 'Consultando api.github.com')} /></div>);
      try {
        const t0 = performance.now();
        const res = await fetch('https://api.github.com/users/OscarRamirezdeArellano');
        if (!res.ok) throw new Error('fetch failed');
        const data = await res.json();
        const elapsed = Math.round(performance.now() - t0);
        ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">{res.status} OK · {elapsed}ms</span></div>);
        await sleep(120);
        return (
          <div className="fade-in" style={{ marginLeft: 12 }}>
            <div className="heading">GitHub · {data.login}</div>
            <div className="box">
              <div className="c-fg" style={{ marginBottom: 6 }}>{data.name ?? 'Oscar Ramírez'}</div>
              <div className="c-dim" style={{ marginBottom: 10 }}>{data.bio ?? ''}</div>
              <div>
                <span className="tag">{data.public_repos} {_(ctx.lang, 'public repos', 'repos públicos')}</span>
                <span className="tag">{data.followers} {_(ctx.lang, 'followers', 'followers')}</span>
                <span className="tag">{data.following} {_(ctx.lang, 'following', 'siguiendo')}</span>
                {data.location && <span className="tag">{data.location}</span>}
              </div>
              <div className="c-dim" style={{ marginTop: 10, fontSize: 12 }}>
                {_(ctx.lang, 'Run', 'Ejecuta')} <span className="c-accent">repos</span> {_(ctx.lang, 'to list all repos', 'para listar todos')}
              </div>
              <div style={{ marginTop: 6 }}>
                <a href={data.html_url} target="_blank" rel="noreferrer">{data.html_url}</a>
              </div>
            </div>
          </div>
        );
      } catch {
        return err(_(ctx.lang, 'stats: GitHub API unreachable', 'stats: API GitHub no disponible'));
      }
    },
  },
  repos: {
    name: 'repos',
    aliases: ['stats-repos', 'numbers'],
    description: { en: '80+ private repos — by the numbers', es: '80+ repos privados — en números' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Indexing repositories', 'Indexando repositorios')} /></div>);
      await sleep(700);
      ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">{_(ctx.lang, 'Indexed 80+ repos · grouped by domain, status, year', 'Indexados 80+ repos · agrupados por dominio, estado, año')}</span></div>);
      await sleep(150);

      // Domain breakdown
      const byDomain: { label: string; value: number; color: string }[] = [
        { label: _(ctx.lang, 'Healthcare / EMR',     'Salud / EMR'),       value: 16, color: 'var(--cyan)' },
        { label: _(ctx.lang, 'AI / RAG / Document',  'IA / RAG / Documentos'), value: 12, color: 'var(--accent)' },
        { label: _(ctx.lang, 'Fiscal (MX) / Tax',    'Fiscal (MX) / SAT'), value: 9,  color: 'var(--yellow)' },
        { label: _(ctx.lang, 'Voice / Transcription','Voz / Transcripción'),value: 8,  color: 'var(--purple)' },
        { label: _(ctx.lang, 'Legal / Compliance',   'Legal / Compliance'),value: 7,  color: 'var(--pink)' },
        { label: _(ctx.lang, 'SaaS / Marketing',     'SaaS / Marketing'),  value: 6,  color: 'var(--green)' },
        { label: _(ctx.lang, 'GovTech (MX)',         'GovTech (MX)'),      value: 5,  color: 'var(--orange)' },
        { label: _(ctx.lang, 'Enterprise / B2B',     'Enterprise / B2B'),  value: 5,  color: 'var(--blue)' },
        { label: _(ctx.lang, 'Logistics',            'Logística'),         value: 3,  color: 'var(--cyan)' },
        { label: _(ctx.lang, 'E-commerce',           'E-commerce'),        value: 4,  color: 'var(--yellow)' },
        { label: _(ctx.lang, 'Identity / Auth',      'Identidad / Auth'),  value: 3,  color: 'var(--purple)' },
      ];
      const maxDomain = Math.max(...byDomain.map((d) => d.value));

      const byYear: { label: string; value: number }[] = [
        { label: '2026', value: 6 },
        { label: '2025', value: 22 },
        { label: '2024', value: 24 },
        { label: '2023', value: 16 },
        { label: '2022', value: 8 },
        { label: '< 2022', value: 14 },
      ];
      const maxYear = Math.max(...byYear.map((d) => d.value));

      const byStatus: { label: string; value: number; color: string }[] = [
        { label: _(ctx.lang, 'Production',  'En producción'), value: 56, color: 'var(--green)' },
        { label: _(ctx.lang, 'MVP / Pilot', 'MVP / Piloto'),  value: 14, color: 'var(--cyan)' },
        { label: _(ctx.lang, 'Demo / R&D',  'Demo / R&D'),    value: 8,  color: 'var(--yellow)' },
        { label: _(ctx.lang, 'Archived',    'Archivado'),     value: 12, color: 'var(--dim)' },
      ];
      const maxStatus = Math.max(...byStatus.map((d) => d.value));

      const byLang: { label: string; value: number }[] = [
        { label: 'TypeScript', value: 38 },
        { label: 'JavaScript', value: 22 },
        { label: 'Python',     value: 14 },
        { label: 'PHP',        value: 6 },
        { label: 'Vue',        value: 4 },
        { label: 'Other',      value: 6 },
      ];
      const maxLang = Math.max(...byLang.map((d) => d.value));

      return (
        <div className="fade-in">
          <div className="heading">{_(ctx.lang, '80+ private repositories — by the numbers', '80+ repos privados — en números')}</div>
          <div className="c-dim" style={{ marginLeft: 12, marginBottom: 10, fontSize: 13 }}>
            {_(ctx.lang,
              'All repos are private (client NDA / proprietary). Numbers are conservative estimates.',
              'Todos los repos son privados (NDA cliente / propietarios). Números son estimaciones conservadoras.')}
          </div>

          <div className="box" style={{ marginLeft: 12 }}>
            <div className="subheading">{_(ctx.lang, '▸ By industry', '▸ Por industria')}</div>
            <StaggerReveal delayMs={70} startDelayMs={100}>
              {byDomain.map((d, i) => (
                <BarRow key={d.label} label={d.label} value={d.value} max={maxDomain} color={d.color} delayMs={i * 70} />
              ))}
            </StaggerReveal>
          </div>

          <div className="box" style={{ marginLeft: 12 }}>
            <div className="subheading">{_(ctx.lang, '▸ By year', '▸ Por año')}</div>
            <StaggerReveal delayMs={60} startDelayMs={300}>
              {byYear.map((d, i) => (
                <BarRow key={d.label} label={d.label} value={d.value} max={maxYear} color="var(--accent)" delayMs={i * 60} />
              ))}
            </StaggerReveal>
          </div>

          <div className="box" style={{ marginLeft: 12 }}>
            <div className="subheading">{_(ctx.lang, '▸ By status', '▸ Por estado')}</div>
            <StaggerReveal delayMs={80} startDelayMs={500}>
              {byStatus.map((d, i) => (
                <BarRow key={d.label} label={d.label} value={d.value} max={maxStatus} color={d.color} delayMs={i * 80} />
              ))}
            </StaggerReveal>
          </div>

          <div className="box" style={{ marginLeft: 12 }}>
            <div className="subheading">{_(ctx.lang, '▸ By primary language', '▸ Por lenguaje principal')}</div>
            <StaggerReveal delayMs={60} startDelayMs={700}>
              {byLang.map((d, i) => (
                <BarRow key={d.label} label={d.label} value={d.value} max={maxLang} color="var(--cyan)" delayMs={i * 60} />
              ))}
            </StaggerReveal>
          </div>

          <div style={{ marginLeft: 12, marginTop: 10 }}>
            <div className="c-dim" style={{ fontSize: 12 }}>
              {_(ctx.lang,
                '▸ Several products are multi-repo clusters (4–7 repos each).',
                '▸ Varios productos son clusters multi-repo (4-7 repos c/u).')}
            </div>
          </div>

          <div className="c-dim" style={{ marginLeft: 12, marginTop: 12, fontSize: 12 }}>
            {_(ctx.lang, 'Want details on a specific one? Try', '¿Quieres detalles de uno? Prueba')}{' '}
            <span className="c-accent">cat projects/&lt;name&gt;</span> {_(ctx.lang, 'or', 'o')}{' '}
            <span className="c-accent">projects</span>{_(ctx.lang, ' for the full curated list.', ' para la lista curada completa.')}
          </div>
        </div>
      );
    },
  },

  // ---------- MISC ----------
  echo: {
    name: 'echo',
    description: { en: 'print arguments', es: 'imprimir argumentos' },
    run: (args) => <div>{args.join(' ')}</div>,
  },
  date: {
    name: 'date',
    description: { en: 'current date/time', es: 'fecha/hora actual' },
    run: () => {
      const d = new Date();
      return <div className="c-yellow">{d.toString()}</div>;
    },
  },
  history: {
    name: 'history',
    description: { en: 'command history', es: 'historial' },
    run: (_args, ctx) => (
      <div style={{ marginLeft: 12 }}>
        {ctx.history.length === 0
          ? <span className="c-dim">{_(ctx.lang, '(empty)', '(vacío)')}</span>
          : ctx.history.slice(-30).map((h, i) => (
              <div key={i}>
                <span className="c-dim" style={{ marginRight: 12 }}>{i + 1}</span>
                <span className="c-fg">{h}</span>
              </div>
            ))
        }
      </div>
    ),
  },
  clear: {
    name: 'clear',
    aliases: ['cls'],
    description: { en: 'clear terminal', es: 'limpiar' },
    run: (_args, ctx) => { ctx.clear(); return null; },
  },
  uname: {
    name: 'uname',
    description: { en: 'system info', es: 'info del sistema' },
    run: () => <div>oscar.iqsit.com · Next.js 16 · Vercel · Edge runtime</div>,
  },
  man: {
    name: 'man',
    description: { en: 'show command manual', es: 'mostrar manual de comando' },
    run: (args, ctx) => {
      const target = args[0];
      if (!target) return err('man: ' + _(ctx.lang, 'what manual do you want?', '¿qué manual quieres?'));
      const cmd = COMMANDS[target];
      if (!cmd) return err(`man: ${_(ctx.lang, 'no manual entry for', 'no hay manual para')} ${target}`);
      ctx.setOverlay('vim', {
        title: `MAN(1)  ${target}  MAN(1)`,
        content:
          `NAME\n    ${cmd.name}\n\nDESCRIPTION\n    ${cmd.description[ctx.lang]}\n\nALIASES\n    ${cmd.aliases?.join(', ') ?? '—'}\n\nSYNOPSIS\n    ${cmd.name} [args]\n\nNOTES\n    This is a portfolio terminal. Real commands are read-only.\n\nSEE ALSO\n    help(1), ls(1), cat(1)\n`,
      });
      return null;
    },
  },
  exit: {
    name: 'exit',
    aliases: ['logout', 'quit'],
    description: { en: '(does nothing — this IS the site)', es: '(no hace nada — esto ES el sitio)' },
    run: (_args, ctx) => (
      <div>
        <span className="c-yellow">😏</span>{' '}
        <span className="c-fg">{_(ctx.lang, "you can't exit — this is the site. try", "no puedes salir — esto ES el sitio. prueba")}</span>{' '}
        <span className="c-accent">tour</span>
      </div>
    ),
  },

  // ---------- EASTER EGGS ----------
  matrix: {
    name: 'matrix',
    description: { en: 'enter the matrix', es: 'entrar al matrix' },
    run: (_args, ctx) => {
      ctx.setOverlay('matrix');
      return null;
    },
  },
  hack: {
    name: 'hack',
    aliases: ['nmap', 'pwn'],
    description: { en: '"hacking" animation', es: 'animación "hackeo"' },
    run: (_args, ctx) => {
      ctx.setOverlay('hack');
      return null;
    },
  },
  vim: {
    name: 'vim',
    aliases: ['nano', 'emacs', 'vi'],
    description: { en: 'open file in (fake) vim', es: 'abrir archivo en vim (falso)' },
    run: (args, ctx) => {
      const target = args[0];
      if (!target) {
        ctx.setOverlay('vim', {
          title: 'VIM · empty buffer',
          content: _(ctx.lang,
            "// Welcome to fake vim. This is just for show.\n// Press ESC or q to quit.\n",
            "// Bienvenido a vim falso. Solo para mostrar.\n// ESC o q para salir.\n"),
        });
        return null;
      }
      // try to find as project
      const proj = getProject(target.replace(/^projects\//, '').replace(/\.md$/, ''));
      if (proj) {
        ctx.setOverlay('vim', {
          title: `VIM · projects/${proj.slug}.md`,
          content:
            `# ${proj.name}\n\n` +
            `> ${proj.summary[ctx.lang]}\n\n` +
            `**Client:** ${proj.client[ctx.lang]}\n` +
            `**Year:** ${proj.year}\n` +
            `**Status:** ${proj.status}\n\n` +
            `${proj.description[ctx.lang]}\n\n` +
            `## Highlights\n` +
            proj.highlights[ctx.lang].map((h) => `- ${h}`).join('\n') +
            `\n\n## Stack\n` + proj.stack.map((s) => `- ${s}`).join('\n') + `\n`,
        });
        return null;
      }
      ctx.setOverlay('vim', { title: `VIM · ${target}`, content: `// ${target}\n// ${_(ctx.lang, 'empty buffer', 'buffer vacío')}\n` });
      return null;
    },
  },
  sudo: {
    name: 'sudo',
    description: { en: '...nice try', es: '...nada' },
    run: (_args, ctx) => (
      <div>
        <div className="c-pink">[sudo] password for oscar:</div>
        <div className="c-dim" style={{ marginTop: 4 }}>
          {_(ctx.lang,
            'Sorry, oscar is not in the sudoers file. This incident will be reported. 😏',
            'Lo siento, oscar no está en sudoers. Este incidente será reportado. 😏')}
        </div>
      </div>
    ),
  },
  'rm': {
    name: 'rm',
    hidden: true,
    description: { en: '(disabled)', es: '(deshabilitado)' },
    run: (args, ctx) => {
      if (args.join(' ').includes('-rf /')) {
        return (
          <div>
            <div className="c-pink">rm: refusing to recursively delete the universe.</div>
            <div className="c-dim">{_(ctx.lang, "(you wish, hacker)", "(quisieras, hacker)")}</div>
          </div>
        );
      }
      return <div className="c-dim">rm: {_(ctx.lang, 'read-only filesystem', 'sistema de archivos sólo lectura')}</div>;
    },
  },
  tour: {
    name: 'tour',
    description: { en: 'auto-guided tour', es: 'tour auto-guiado' },
    run: async (_args, ctx) => {
      const steps = ['neofetch', 'about', 'projects', 'skills', 'services', 'contact'];
      ctx.print(<div className="c-cyan">▶ {_(ctx.lang, 'Starting guided tour... watch as commands run automatically.', 'Iniciando tour guiado... mira cómo se ejecutan los comandos.')}</div>);
      ctx.print(<div className="line spacer" />);
      for (const step of steps) {
        await new Promise((r) => setTimeout(r, 1400));
        await ctx.runCommand(step);
      }
      return <div className="c-green">▶ {_(ctx.lang, 'Tour finished. Now try things on your own!', 'Tour terminado. ¡Ahora prueba por tu cuenta!')}</div>;
    },
  },

  // ---------- STATUS & PITCH ----------
  status: {
    name: 'status',
    description: { en: 'current availability & focus', es: 'disponibilidad y foco actual' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Checking calendar', 'Consultando calendario')} /></div>);
      await sleep(380);
      ctx.print(<div><span className="c-green">✓</span> <span className="c-dim">{_(ctx.lang, 'OK', 'OK')}</span></div>);
      await sleep(100);
      const items: { key: keyof typeof STATUS; en: string; es: string; color: string }[] = [
        { key: 'availability',        en: 'availability',  es: 'disponibilidad',    color: 'c-green' },
        { key: 'focus',               en: 'current focus', es: 'foco actual',       color: 'c-accent' },
        { key: 'preferredEngagement', en: 'preferred',     es: 'preferido',         color: 'c-cyan' },
        { key: 'location',            en: 'location',      es: 'ubicación',         color: 'c-fg' },
        { key: 'hours',               en: 'hours',         es: 'horario',           color: 'c-fg' },
        { key: 'response',            en: 'response time', es: 'tiempo respuesta',  color: 'c-fg' },
      ];
      return (
        <div className="fade-in" style={{ marginLeft: 12 }}>
          <div className="heading">{_(ctx.lang, 'Current status', 'Status actual')}</div>
          <div className="box">
            <StaggerReveal delayMs={130}>
              {items.map((i) => (
                <div key={i.key} style={{ marginBottom: 4 }}>
                  <span className="c-dim" style={{ minWidth: 160, display: 'inline-block' }}>
                    {_(ctx.lang, i.en, i.es)}:
                  </span>
                  <span className={i.color}>{STATUS[i.key][ctx.lang]}</span>
                </div>
              ))}
              <div className="c-dim" style={{ marginTop: 8, fontSize: 12.5 }}>
                {_(ctx.lang, '▸ Type ', '▸ Teclea ')}<span className="c-accent">contact</span>{_(ctx.lang, ' to reach out.', ' para contactarme.')}
              </div>
            </StaggerReveal>
          </div>
        </div>
      );
    },
  },

  'why-me': {
    name: 'why-me',
    aliases: ['differentiation', 'pitch'],
    description: { en: 'what makes me different', es: 'qué me diferencia' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Compiling pitch', 'Compilando pitch')} /></div>);
      await sleep(380);
      return (
        <div className="fade-in">
          <div className="heading">{_(ctx.lang, 'Why hire me', 'Por qué contratarme')}</div>
          <StaggerReveal delayMs={220}>
            {DIFFERENTIATION.map((d, i) => (
              <div key={i} className="box" style={{ marginLeft: 12, marginBottom: 8 }}>
                <div className="c-accent" style={{ fontWeight: 700, marginBottom: 4 }}>
                  ▸ {d.title[ctx.lang]}
                </div>
                <div className="c-fg" style={{ fontSize: 13 }}>{d.body[ctx.lang]}</div>
              </div>
            ))}
          </StaggerReveal>
          <div className="c-dim" style={{ marginLeft: 12, marginTop: 8, fontSize: 12.5 }}>
            {_(ctx.lang, '▸ Convinced? Type ', '▸ ¿Convencido? Teclea ')}
            <span className="c-accent">contact</span>
            {_(ctx.lang, ' — or ', ' — o ')}
            <span className="c-accent">chat</span>
            {_(ctx.lang, ' to ask anything first.', ' para preguntarme cualquier cosa primero.')}
          </div>
        </div>
      );
    },
  },

  // ---------- FAKE PROCESSES ----------
  top: {
    name: 'top',
    aliases: ['htop', 'ps'],
    description: { en: 'live "processes" — your projects as system tasks', es: 'procesos "vivos" — tus proyectos como tareas' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Sampling top processes', 'Muestreando procesos')} /></div>);
      await sleep(380);
      const subset = PROJECTS.slice(0, 14);
      const rand = (min: number, max: number) => +(min + Math.random() * (max - min)).toFixed(1);
      const statusColor: Record<string, string> = {
        production: 'c-green',
        mvp: 'c-cyan',
        demo: 'c-yellow',
        archived: 'c-dim',
      };
      return (
        <div className="fade-in">
          <div className="heading">{_(ctx.lang, 'top — live projects', 'top — proyectos vivos')}</div>
          <div style={{ marginLeft: 12 }}>
            <div className="c-dim" style={{ marginBottom: 6, fontSize: 12 }}>
              {_(ctx.lang, 'Tasks: ', 'Tareas: ')}{subset.length}{_(ctx.lang, ' shown · CPU/MEM are simulated for fun', ' mostrados · CPU/MEM simulados por diversión')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 60px 60px 80px', gap: 8, fontSize: 12, marginBottom: 4 }}>
              <span className="c-dim">PID</span>
              <span className="c-dim">COMMAND</span>
              <span className="c-dim">STATE</span>
              <span className="c-dim" style={{ textAlign: 'right' }}>%CPU</span>
              <span className="c-dim" style={{ textAlign: 'right' }}>%MEM</span>
              <span className="c-dim">DOMAIN</span>
            </div>
            <StaggerReveal delayMs={45}>
              {subset.map((p, i) => (
                <div key={p.slug} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 60px 60px 80px', gap: 8, fontSize: 12.5, marginBottom: 1 }}>
                  <span className="c-dim">{1000 + i * 13}</span>
                  <span className="c-accent">{p.slug}</span>
                  <span className={statusColor[p.status]}>● {p.status}</span>
                  <span className="c-fg" style={{ textAlign: 'right' }}>{rand(0.2, 24.5)}</span>
                  <span className="c-fg" style={{ textAlign: 'right' }}>{rand(1.0, 8.0)}</span>
                  <span className="c-purple">{p.domain}</span>
                </div>
              ))}
            </StaggerReveal>
            <div className="c-dim" style={{ marginTop: 8, fontSize: 12 }}>
              {_(ctx.lang, '▸ Showing 14/32 · type ', '▸ Mostrando 14/32 · teclea ')}
              <span className="c-accent">projects</span>
              {_(ctx.lang, ' for the full list.', ' para la lista completa.')}
            </div>
          </div>
        </div>
      );
    },
  },

  // ---------- FUN ----------
  coffee: {
    name: 'coffee',
    aliases: ['brew', 'cafe'],
    description: { en: 'brew a coffee', es: 'prepara un café' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-yellow">☕ {_(ctx.lang, 'Grinding beans', 'Moliendo café')}<span className="c-dim">...</span></div>);
      await sleep(500);
      ctx.print(<div className="c-yellow">☕ {_(ctx.lang, 'Heating water', 'Calentando agua')}<span className="c-dim">...</span></div>);
      await sleep(500);
      ctx.print(<div className="c-yellow">☕ {_(ctx.lang, 'Brewing', 'Preparando')}<span className="c-dim">...</span></div>);
      await sleep(700);
      const variants = ctx.lang === 'en' ? [
        'Done. Enjoy. Now hire me to build something cool.',
        'Done. Pour, sip, hire me, repeat.',
        "Done. This one's on me — for closing the deal we're about to close.",
      ] : [
        'Listo. Disfruta. Ahora contratame para construir algo cool.',
        'Listo. Sirve, sorbe, contratame, repite.',
        'Listo. Esta va por la casa — por el deal que estamos a punto de cerrar.',
      ];
      return (
        <div className="fade-in">
          <div className="c-green">☕ {variants[Math.floor(Math.random() * variants.length)]}</div>
        </div>
      );
    },
  },

  figlet: {
    name: 'figlet',
    aliases: ['big', 'banner'],
    description: { en: 'render text as big ASCII art', es: 'renderiza texto en ASCII art grande' },
    run: (args, ctx) => {
      const text = args.join(' ').trim() || (ctx.lang === 'en' ? 'HELLO' : 'HOLA');
      const safe = text.slice(0, 20); // cap length
      const art = figletize(safe);
      return (
        <pre
          className="c-accent fade-in"
          style={{
            fontSize: 'clamp(7px, 1vw, 11px)',
            lineHeight: 1.1,
            whiteSpace: 'pre',
            fontFamily: 'inherit',
            margin: '6px 0',
            textShadow: '0 0 12px color-mix(in srgb, var(--accent) 35%, transparent)',
          }}
        >
          {art}
        </pre>
      );
    },
  },

  // ---------- CHANGELOG ----------
  changelog: {
    name: 'changelog',
    aliases: ['whatsnew'],
    description: { en: 'what changed on this site', es: 'qué cambió en este sitio' },
    run: async (_args, ctx) => {
      ctx.print(<div className="c-dim"><Spinner text={_(ctx.lang, 'Reading git log', 'Leyendo git log')} /></div>);
      await sleep(380);
      const typeColor: Record<string, string> = {
        added: 'c-green',
        changed: 'c-cyan',
        fixed: 'c-yellow',
        removed: 'c-pink',
      };
      return (
        <div className="fade-in">
          <div className="heading">{_(ctx.lang, 'Changelog', 'Changelog')}</div>
          <StaggerReveal delayMs={180}>
            {CHANGELOG.map((day) => (
              <div key={day.date} className="box" style={{ marginLeft: 12, marginBottom: 8 }}>
                <div className="subheading">{day.date}</div>
                {day.entries.map((e, i) => (
                  <div key={i} style={{ marginLeft: 8, marginBottom: 2 }}>
                    <span className={typeColor[e.type] ?? 'c-fg'} style={{ display: 'inline-block', minWidth: 90, fontWeight: 600 }}>
                      [{e.type}]
                    </span>
                    <span className="c-fg">{e.text[ctx.lang]}</span>
                  </div>
                ))}
              </div>
            ))}
          </StaggerReveal>
        </div>
      );
    },
  },
};

// === Aliases ===
const ALIASES: Record<string, string> = {};
for (const cmd of Object.values(COMMANDS)) {
  for (const alias of cmd.aliases ?? []) {
    ALIASES[alias] = cmd.name;
  }
}

// === Dispatch ===
export async function runCommand(raw: string, ctx: CommandContext): Promise<React.ReactNode> {
  const tokens = raw.trim().split(/\s+/);
  if (tokens.length === 0 || !tokens[0]) return null;
  const name = (ALIASES[tokens[0]] ?? tokens[0]).toLowerCase();
  const cmd = COMMANDS[name];
  if (!cmd) {
    return (
      <div>
        <span className="c-pink">{tokens[0]}: command not found</span>
        <span className="c-dim"> — </span>
        <span className="c-dim">try </span>
        <span className="c-accent">help</span>
      </div>
    );
  }
  return await cmd.run(tokens.slice(1), ctx);
}

export function getCommandNames(): string[] {
  return [
    ...Object.keys(COMMANDS).filter((n) => !COMMANDS[n].hidden),
    ...Object.keys(ALIASES),
  ].sort();
}

// === View helpers ===
function CommandRow({ cmd, desc }: { cmd: string; desc: string }) {
  return (
    <div style={{ marginLeft: 16 }}>
      <span className="c-accent" style={{ display: 'inline-block', minWidth: 180 }}>{cmd}</span>
      <span className="c-dim">  —  {desc}</span>
    </div>
  );
}

function TreeView({ node, lang }: { node: VNode; lang: Lang }) {
  const render = (n: VNode, prefix: string, isLast: boolean): React.ReactNode[] => {
    const out: React.ReactNode[] = [];
    const marker = isLast ? '└── ' : '├── ';
    out.push(
      <div key={prefix + n.name}>
        <span className="c-dim">{prefix}</span>
        <span className="c-dim">{marker}</span>
        <span className={n.type === 'dir' ? 'c-blue' : 'c-cyan'}>{n.name}{n.type === 'dir' ? '/' : ''}</span>
      </div>,
    );
    if (n.type === 'dir' && n.children) {
      const childPrefix = prefix + (isLast ? '    ' : '│   ');
      n.children.forEach((c, i) => out.push(...render(c, childPrefix, i === n.children!.length - 1)));
    }
    return out;
  };
  return (
    <div className="fade-in">
      <div className="c-blue">~</div>
      {node.children?.map((c, i) => render(c, '', i === node.children!.length - 1))}
      <div className="c-dim" style={{ marginTop: 8, fontSize: 12 }}>
        {_(lang, 'Tip:', 'Tip:')} <span className="c-accent">cat projects/&lt;name&gt;</span>
      </div>
    </div>
  );
}

function resolveFileView(node: VNode, ctx: CommandContext): React.ReactNode {
  switch (node.resolver) {
    case 'cat-project': {
      const p = getProject(node.payload ?? '');
      if (!p) return err('cat: project not found');
      return <ProjectView project={p} lang={ctx.lang} />;
    }
    case 'cat-skill': {
      const s = getSkillGroup(node.payload ?? '');
      if (!s) return err('cat: skill group not found');
      return <SkillGroupView group={s} lang={ctx.lang} />;
    }
    case 'cat-experience': {
      const idx = Number(node.payload ?? -1);
      const e = EXPERIENCE[idx];
      if (!e) return err('cat: not found');
      return <ExperienceView items={[e]} lang={ctx.lang} />;
    }
    case 'cat-about':
      return <AboutView lang={ctx.lang} />;
    case 'cat-contact':
      return <ContactView lang={ctx.lang} />;
    case 'cat-service': {
      const s = SERVICES.find((sv) => sv.slug === node.payload);
      if (!s) return err('cat: service not found');
      return <ServiceDetailView service={s} lang={ctx.lang} />;
    }
    case 'cat-cv': {
      const which = (node.payload as Lang) ?? 'en';
      const filename = `resume_${which}.pdf`;
      if (typeof window !== 'undefined') {
        const a = document.createElement('a');
        a.href = `/${filename}`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      return <div className="c-green">↓ {_(ctx.lang, 'Downloading', 'Descargando')} {filename}…</div>;
    }
    case 'cat-zshrc':
      return (
        <pre className="c-dim" style={{ fontSize: 13 }}>{`# ~/.zshrc — Oscar's shell config
# Generated 2026 · Veracruz, MX
export PATH="$HOME/.local/bin:$PATH"
export EDITOR="vim"
alias hire="echo 'oscar@iqsit.com'"
alias ship="git push && deploy"
# "Build the thing. Ship the thing. Charge for the thing."
`}</pre>
      );
    default:
      return <div className="c-fg">{node.name}</div>;
  }
}

// === Weather helpers ===
function weatherCodeToText(code: number, lang: Lang): string {
  const en: Record<number, string> = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Rime fog',
    51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
    71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    80: 'Rain showers', 81: 'Heavy showers', 82: 'Violent showers',
    95: 'Thunderstorm', 96: 'Storm w/ hail', 99: 'Storm w/ heavy hail',
  };
  const es: Record<number, string> = {
    0: 'Despejado', 1: 'Casi despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
    45: 'Niebla', 48: 'Niebla helada',
    51: 'Llovizna ligera', 53: 'Llovizna', 55: 'Llovizna fuerte',
    61: 'Lluvia ligera', 63: 'Lluvia', 65: 'Lluvia fuerte',
    71: 'Nieve ligera', 73: 'Nieve', 75: 'Nieve fuerte',
    80: 'Chubascos', 81: 'Chubascos fuertes', 82: 'Chubascos violentos',
    95: 'Tormenta eléctrica', 96: 'Tormenta con granizo', 99: 'Tormenta con granizo fuerte',
  };
  const dict = lang === 'en' ? en : es;
  return dict[code] ?? (lang === 'en' ? 'Unknown' : 'Desconocido');
}

function weatherCodeToIcon(code: number, day: boolean): string {
  if (code === 0) return day ? '☀️' : '🌙';
  if (code <= 2) return day ? '🌤️' : '☁️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 75) return '🌨️';
  if (code <= 82) return '🌧️';
  return '⛈️';
}
