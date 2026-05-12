export type Lang = 'en' | 'es';

export type Theme = 'tokyo-night' | 'dracula' | 'matrix' | 'gruvbox' | 'cyberpunk';

export type Bi = { en: string; es: string };
export type BiList = { en: string[]; es: string[] };

export type Domain =
  | 'ai'
  | 'healthcare'
  | 'fiscal'
  | 'legal'
  | 'govtech'
  | 'voice'
  | 'logistics'
  | 'saas'
  | 'enterprise'
  | 'ecommerce'
  | 'identity';

export type Status = 'production' | 'mvp' | 'demo' | 'archived';

export type Project = {
  slug: string;
  name: string;
  domain: Domain;
  status: Status;
  year: string;
  client: Bi;
  summary: Bi;
  description: Bi;
  stack: string[];
  highlights: BiList;
  repo?: string;
  live?: string;
};

export type SkillGroup = {
  slug: string;
  name: Bi;
  items: string[];
};

export type ExperienceItem = {
  period: string;
  role: Bi;
  company: string;
  description: Bi;
  stack: string[];
};

export type CommandContext = {
  lang: Lang;
  theme: Theme;
  cwd: string;
  setLang: (l: Lang) => void;
  setTheme: (t: Theme) => void;
  setCwd: (cwd: string) => void;
  clear: () => void;
  print: (node: React.ReactNode) => void;
  history: string[];
  runCommand: (cmd: string) => Promise<void>;
  setOverlay: (overlay: 'matrix' | 'vim' | 'hack' | 'contact-form' | 'chat' | 'void' | 'hologram' | 'tetris' | null, payload?: unknown) => void;
  audioOn: boolean;
  setAudioOn: (on: boolean) => void;
};

export type Command = {
  name: string;
  aliases?: string[];
  description: Bi;
  hidden?: boolean;
  run: (args: string[], ctx: CommandContext) => Promise<React.ReactNode> | React.ReactNode;
};
