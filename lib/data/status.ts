import type { Bi } from '../types';

export const STATUS = {
  availability: {
    en: 'Open for 2 new client engagements',
    es: 'Abierto a 2 nuevos engagements',
  } as Bi,
  focus: {
    en: 'Vertical SaaS for accounting firms · AI document automation',
    es: 'SaaS vertical para despachos · Automatización de documentos con IA',
  } as Bi,
  location: {
    en: 'Veracruz, México · CST (UTC-6)',
    es: 'Veracruz, México · CST (UTC-6)',
  } as Bi,
  hours: {
    en: 'Typically 9:00-19:00 CST · overlap with US East / West',
    es: 'Típicamente 9:00-19:00 CST · overlap con US East / West',
  } as Bi,
  response: {
    en: 'Email within 24 hrs · calls scheduled within 3 days',
    es: 'Email en 24 hrs · llamadas en 3 días',
  } as Bi,
  preferredEngagement: {
    en: 'Fractional CTO · Vertical SaaS builds · AI integrations',
    es: 'CTO fraccional · SaaS verticales · Integraciones de IA',
  } as Bi,
};

export const DIFFERENTIATION: { title: Bi; body: Bi }[] = [
  {
    title: { en: '20+ years shipping code', es: '20+ años entregando código' },
    body: {
      en: "Not 5 years pretending to be 10. Real time spent in regulated industries — fiscal, healthcare, legal — where production breakage has real consequences.",
      es: 'No 5 años pretendiendo ser 10. Tiempo real en industrias reguladas — fiscal, salud, legal — donde un bug en producción tiene consecuencias reales.',
    },
  },
  {
    title: { en: 'Full-stack — for real', es: 'Full-stack — de verdad' },
    body: {
      en: 'I architect, build, ship and operate. From DB schema to Nginx config to billing flows. No "I only do frontend" hand-offs that slow you down.',
      es: 'Diseño, construyo, despliego y opero. Desde el schema de DB hasta config de Nginx hasta flujos de billing. Sin handoffs de "yo solo hago frontend" que te frenan.',
    },
  },
  {
    title: { en: 'Vertical SaaS specialist', es: 'Especialista en SaaS vertical' },
    body: {
      en: 'I know the patterns: multi-tenant, billing, auth, audit trails, RBAC, region-aware compliance. Same patterns, different industries.',
      es: 'Conozco los patrones: multi-tenant, billing, auth, audit trails, RBAC, compliance por región. Mismos patrones, distintas industrias.',
    },
  },
  {
    title: { en: 'Regulated-industry fluency', es: 'Fluidez en industrias reguladas' },
    body: {
      en: 'FHIR R4, HL7v2, HIPAA, SAT CFDI 4.0, FIEL, LFT — these stop being abstract words and become things I have shipped in production.',
      es: 'FHIR R4, HL7v2, HIPAA, SAT CFDI 4.0, FIEL, LFT — dejan de ser palabras abstractas y se vuelven cosas que ya envié a producción.',
    },
  },
  {
    title: { en: 'Solo or in lean teams', es: 'Solo o en equipos lean' },
    body: {
      en: 'I work well as the only senior engineer. Founders without a CTO ship faster with me than with a 5-person agency.',
      es: 'Funciono bien como el único senior. Founders sin CTO despachan más rápido conmigo que con una agencia de 5 personas.',
    },
  },
  {
    title: { en: 'Pragmatic over trendy', es: 'Pragmático sobre lo trendy' },
    body: {
      en: "I pick boring tech where it earns its keep. I don't add AI to your menu because it's hype — only when it actually replaces hours of manual work.",
      es: 'Elijo tech aburrida cuando se gana su lugar. No te meto IA al menú porque sea hype — solo cuando reemplaza horas de trabajo manual.',
    },
  },
];

export const CHANGELOG: { date: string; entries: { type: string; text: Bi }[] }[] = [
  {
    date: '2026-05-12',
    entries: [
      { type: 'added',    text: { en: 'Service catalog with `cat services/<name>` detail view', es: 'Catálogo de servicios con detalle `cat services/<name>`' } },
      { type: 'added',    text: { en: 'AI chat command — talk to Claude with portfolio context', es: 'Comando AI chat — habla con Claude con contexto del portafolio' } },
      { type: 'added',    text: { en: 'Inline contact form (no more mailto)', es: 'Formulario de contacto inline (sin mailto)' } },
      { type: 'added',    text: { en: 'void command — WebGL easter egg', es: 'Comando void — easter egg WebGL' } },
      { type: 'added',    text: { en: 'Status, top, why-me, coffee, figlet, changelog commands', es: 'Comandos status, top, why-me, coffee, figlet, changelog' } },
      { type: 'fixed',    text: { en: 'matrix command immediate-close bug', es: 'Bug del matrix cerrándose inmediatamente' } },
      { type: 'changed',  text: { en: 'All project slugs anonymized', es: 'Todos los slugs anonimizados' } },
    ],
  },
  {
    date: '2026-05-11',
    entries: [
      { type: 'added',    text: { en: 'Sidebar command palette with theme/lang switcher', es: 'Sidebar con paleta de comandos y switcher de tema/idioma' } },
      { type: 'added',    text: { en: 'Auto-scroll within terminal (ResizeObserver)', es: 'Auto-scroll dentro del terminal' } },
      { type: 'added',    text: { en: 'Progressive output for all major commands', es: 'Output progresivo en todos los comandos' } },
      { type: 'added',    text: { en: 'repos visualization with animated bar charts', es: 'Visualización repos con barras animadas' } },
      { type: 'changed',  text: { en: 'Layout to full viewport + internal scroll', es: 'Layout full viewport + scroll interno' } },
    ],
  },
  {
    date: '2026-05-10',
    entries: [
      { type: 'added',    text: { en: 'Initial release — terminal portfolio at oscar.iqsit.com', es: 'Release inicial — portafolio terminal en oscar.iqsit.com' } },
      { type: 'added',    text: { en: '5 themes · EN/ES toggle · CV download · easter eggs', es: '5 temas · toggle EN/ES · descarga CV · easter eggs' } },
    ],
  },
];
