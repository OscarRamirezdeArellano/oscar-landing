<div align="center">

# `oscar-landing`

### Interactive terminal-style portfolio · [oscar.iqsit.com](https://oscar.iqsit.com)

A real shell you can type in. 80+ commands, AI chat with Claude, inline contact form,
bilingual (EN/ES), 5 themes, WebGL easter egg, hidden Linux jokes that mimic real CLI tools.

[![Live](https://img.shields.io/badge/live-oscar.iqsit.com-00D9FF?style=for-the-badge&logo=googlechrome&logoColor=white)](https://oscar.iqsit.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## What is this?

A portfolio site that **looks and feels like a Unix terminal**. Visitors don't scroll
through sections — they type commands, navigate a virtual filesystem, run `cat
projects/<name>` to dive into case studies, ask an AI about my work, send me a message
inline, and discover Easter eggs.

It started as "a portfolio that doesn't look like every other portfolio." It became:

- A **fully working command system** with history, tab autocomplete, virtual filesystem
- An **AI assistant** powered by Claude that knows my entire portfolio context
- An **inline contact form** (no `mailto:` shenanigans) wired to Resend
- **Boot animation, scanlines, 5 themes, EN/ES toggle, CV download, dynamic OG image**
- **40+ hidden Linux commands** so visitors who type `git log` or `ping iqsit.com` get
  real-looking output and wonder if it's a real shell

---

## Try it

```bash
$ oscar.iqsit.com
```

Open it. Type `help`. Or jump straight to one of these:

| Command | What it does |
| --- | --- |
| `projects` | 32 curated projects, grouped by domain |
| `cat projects/<name>` | Deep dive into any project |
| `chat` | Talk to my AI assistant about my work |
| `compose` | Send me a message (inline form) |
| `cv en` / `cv es` | Download my resume |
| `void` | WebGL easter egg |
| `tour` | Auto-guided tour |
| `git log` | Hidden — see what happens |
| `lscpu` | Hidden — also try `ping iqsit.com`, `sl`, `42`, `cowsay hello` |

---

## Stack

**Framework:** Next.js 16 (App Router) · React 19 · TypeScript 5
**Styling:** Tailwind CSS 3 · CSS variables for theming · custom components
**APIs:** [Anthropic Claude](https://www.anthropic.com) (chat) · [Resend](https://resend.com) (contact form) · [Open-Meteo](https://open-meteo.com) (live weather) · [GitHub public API](https://docs.github.com/rest) (stats)
**Graphics:** [Three.js](https://threejs.org) (dynamic-imported for the `void` overlay only)
**Deploy:** [Vercel](https://vercel.com) · custom domain via CNAME

No CMS, no database, no auth. All content lives as TypeScript modules in `lib/data/`.

---

## How it works

```
oscar-landing/
├─ app/
│  ├─ page.tsx               # mounts <Terminal />
│  ├─ layout.tsx             # metadata + dark theme
│  ├─ globals.css            # all themes + components
│  ├─ icon.tsx               # dynamic favicon
│  ├─ opengraph-image.tsx    # dynamic 1200×630 OG card
│  ├─ not-found.tsx          # custom 404
│  ├─ {sitemap, robots, manifest}.ts
│  └─ api/
│     ├─ chat/route.ts       # streams Claude responses
│     └─ contact/route.ts    # validates + sends via Resend
├─ components/
│  ├─ Terminal.tsx           # main interactive component
│  ├─ Sidebar.tsx            # command palette
│  ├─ Markdown.tsx           # mini renderer for streaming chat
│  ├─ Loaders.tsx            # Spinner, BarRow, StaggerReveal
│  ├─ views.tsx              # ProjectView, SkillsView, etc.
│  └─ {Matrix,Vim,Hack,ContactForm,Chat,Void}Overlay.tsx
└─ lib/
   ├─ commands/index.tsx     # command registry + dispatcher (~50 commands)
   ├─ data/
   │  ├─ projects.ts         # 32 projects (anonymized)
   │  ├─ skills.ts, services.ts, experience.ts, status.ts
   │  └─ chat-context.ts     # system prompt for AI chat
   ├─ fs.ts                  # virtual filesystem
   ├─ ascii-font.ts          # 5-row block font for `figlet`
   ├─ audio.ts               # Web Audio API beeps
   ├─ i18n.ts                # EN/ES translations
   └─ types.ts
```

### Key architectural decisions

- **Command system as a registry**, not a switch. Each command is `{name, run, aliases, hidden}`. The dispatcher in `lib/commands/index.tsx` routes input to the right handler. Easy to add new commands.
- **Virtual filesystem** mirrors data shape. `~/projects/`, `~/skills/`, `~/services/` etc. are derived from the data files at build time, so `cat`, `ls`, `cd`, `tree`, and tab autocomplete all work consistently.
- **Stream Claude responses** via a Web ReadableStream. Markdown is parsed token-by-token by a tiny custom renderer (`components/Markdown.tsx`) — no `react-markdown` dependency.
- **Hidden commands** (`hidden: true`) are excluded from `help` and tab autocomplete but still dispatchable. This is what powers the "wait, is this a real terminal?" moment.
- **Dynamic Three.js import** for the `void` easter egg — keeps the main bundle lean.

---

## Run it locally

```bash
git clone https://github.com/OscarRamirezdeArellano/oscar-landing.git
cd oscar-landing
npm install
cp .env.example .env
# Edit .env with your keys (see below)
npm run dev
# → http://localhost:3000
```

### Required env vars

The site works without any keys — chat and contact form will return errors but
everything else runs. To enable them:

| Variable | Purpose | Get a key |
| --- | --- | --- |
| `RESEND_API_KEY` | Contact form (`compose`) | [resend.com/api-keys](https://resend.com/api-keys) |
| `CONTACT_FROM` | Resend "from" address | a verified domain or `onboarding@resend.dev` |
| `CONTACT_TO` | Where messages go | your inbox |
| `ANTHROPIC_API_KEY` | AI chat (`chat`) | [console.anthropic.com](https://console.anthropic.com/settings/keys) |
| `ANTHROPIC_MODEL` | Model for chat | `claude-haiku-4-5-20251001` (cheap default) |

See `.env.example` for the full list with comments.

---

## Deploy your own

Click the button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOscarRamirezdeArellano%2Foscar-landing)

Then add the env vars above in **Settings → Environment Variables** and trigger a
redeploy.

---

## Make it your own

This is a portfolio for **Oscar Ramírez de Arellano**, but the architecture is generic.
To fork and adapt for yourself:

1. Replace data files in `lib/data/`:
   - `projects.ts` — your projects (slug + bilingual summary, description, stack, highlights)
   - `skills.ts`, `services.ts`, `experience.ts`, `status.ts` — same pattern
   - `chat-context.ts` — system prompt for the AI assistant
2. Replace `public/resume_*.pdf` with your own resumes (4 variants: full + 1-page × EN + ES)
3. Update `app/layout.tsx` with your name, URL, social links
4. Update `app/opengraph-image.tsx` with your name + tagline
5. Tweak themes in `app/globals.css` if you want different colors
6. Optional: rename or add commands in `lib/commands/index.tsx`

Everything else (terminal mechanics, autocomplete, themes, animations, AI chat
plumbing) stays the same.

---

## Inspirations & credits

The terminal aesthetic owes obvious debt to [Tokyo Night](https://github.com/tokyo-night)
and [Dracula](https://draculatheme.com), to a long line of `terminal-portfolio`
projects on GitHub, and to every developer who refused to make a portfolio that looks
like a Squarespace template.

The Linux command jokes (`sl`, `cowsay`, `sudo make me a sandwich` → 🥪) are tributes to
[XKCD #149](https://xkcd.com/149/) and the rich tradition of Unix Easter eggs.

The OG image and favicon are generated dynamically with Next.js `next/og`.

---

## License

[MIT](LICENSE) — fork it, adapt it, ship your own.

---

<div align="center">

Built by [Oscar Ramírez de Arellano](https://oscar.iqsit.com) · [LinkedIn](https://linkedin.com/in/ordac) · oscar@iqsit.com

</div>
