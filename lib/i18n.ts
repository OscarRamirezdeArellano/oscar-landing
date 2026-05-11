import type { Lang } from './types';

export const TRANSLATIONS = {
  // boot
  boot: {
    en: [
      '[  OK  ] Initializing oscar.iqsit.com',
      '[  OK  ] Indexed 80+ public repos · 32 curated projects',
      '[  OK  ] Spanning fiscal · legal · healthcare · govtech · logistics',
      '[  OK  ] AI agents online · OpenAI + Anthropic + Gemini ready',
      '[  OK  ] Stack hydrated · 30+ external integrations available',
      '[  OK  ] Welcome message ready',
    ],
    es: [
      '[  OK  ] Inicializando oscar.iqsit.com',
      '[  OK  ] 80+ repos públicos indexados · 32 proyectos curados',
      '[  OK  ] Abarca fiscal · legal · salud · govtech · logística',
      '[  OK  ] Agentes IA listos · OpenAI + Anthropic + Gemini',
      '[  OK  ] Stack hidratado · 30+ integraciones externas',
      '[  OK  ] Mensaje de bienvenida listo',
    ],
  },
  welcome: {
    en: 'Welcome to oscar.iqsit.com',
    es: 'Bienvenido a oscar.iqsit.com',
  },
  hint: {
    en: "Type 'help' to see what you can do, or click any chip below.",
    es: "Escribe 'help' para ver qué puedes hacer, o haz click en cualquier chip.",
  },
  try: { en: 'try', es: 'prueba' },
  notFound: { en: 'command not found:', es: 'comando no encontrado:' },
  tryHelp: { en: "try 'help'", es: "prueba 'help'" },
  langChanged: { en: 'Language set to English.', es: 'Idioma cambiado a Español.' },
  themeChanged: { en: 'Theme:', es: 'Tema:' },
  available: { en: 'Available:', es: 'Disponibles:' },
  pageTitle: {
    en: 'Oscar Ramírez · Full Stack & DevOps · AI / SaaS',
    es: 'Oscar Ramírez · Full Stack & DevOps · IA / SaaS',
  },
  // labels
  labels: {
    role: { en: 'role', es: 'rol' },
    location: { en: 'location', es: 'ubicación' },
    experience: { en: 'experience', es: 'experiencia' },
    available: { en: 'available', es: 'disponible' },
    focus: { en: 'focus', es: 'foco' },
    contact: { en: 'contact', es: 'contacto' },
    status: { en: 'status', es: 'estado' },
    stack: { en: 'stack', es: 'stack' },
    highlights: { en: 'highlights', es: 'lo destacado' },
    client: { en: 'client', es: 'cliente' },
    year: { en: 'year', es: 'año' },
    repo: { en: 'repo', es: 'repo' },
    domain: { en: 'domain', es: 'dominio' },
  },
} as const;

export function t<K extends keyof typeof TRANSLATIONS>(lang: Lang, key: K): typeof TRANSLATIONS[K] {
  return TRANSLATIONS[key];
}
