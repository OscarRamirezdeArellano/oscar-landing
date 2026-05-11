# oscar-landing

Interactive terminal-style portfolio at **oscar.iqsit.com**.

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS 3
- CSS custom properties for theming (5 themes)
- Web Audio API for keypress sounds (no external files)
- Open-Meteo (live weather) · GitHub public API (stats)
- Deploys to Vercel

## Dev

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Features

- **Real shell experience:** history (↑↓), Tab autocomplete, Ctrl+L clear, Ctrl+C cancel
- **Virtual filesystem:** `ls`, `cd`, `cat`, `tree`, `pwd`
- **32 projects** organized by domain (`cat projects/<name>`)
- **i18n:** instant `lang en|es` toggle
- **5 themes:** tokyo-night (default), dracula, matrix, gruvbox, cyberpunk
- **CV downloads:** `cv en`, `cv es` (also `--1page` variant)
- **Live data:** `weather` (Veracruz, open-meteo), `stats` (GitHub public API)
- **Easter eggs:** `matrix`, `hack`, `sudo`, `vim`, `man <cmd>`
- **Auto-tour:** `tour` types commands automatically for first-time visitors
- **localStorage:** remembers theme, lang, history, audio between sessions

## Deploy to Vercel

```bash
# from this directory
npx vercel
# then add custom domain oscar.iqsit.com in Vercel project settings
```

## Project structure

```
app/
  layout.tsx       # root layout (font loading, html attrs)
  page.tsx         # mounts the Terminal
  globals.css      # all theme variables + component styles
components/
  Terminal.tsx     # main interactive terminal (client)
  views.tsx        # rendered output components
  MatrixOverlay.tsx
  VimOverlay.tsx
  HackOverlay.tsx
lib/
  commands/        # command registry + dispatch
  data/            # projects, skills, experience (bilingual)
  fs.ts            # virtual filesystem
  i18n.ts          # translations
  audio.ts         # Web Audio API blips
  types.ts
public/
  resume_*.pdf     # downloadable CV variants
```

## Commands cheat-sheet

```
help · about · projects · skills · experience · services · contact
ls · cd · cat · tree · pwd · echo · date · history · clear
cv [en|es] · neofetch · whoami · uname · man <cmd>
theme [name] · lang [en|es] · audio [on|off]
weather · stats
tour · matrix · hack · sudo · vim
```

---

Built by Oscar Ramírez · oscar@iqsit.com · [github.com/OscarRamirezdeArellano](https://github.com/OscarRamirezdeArellano)
