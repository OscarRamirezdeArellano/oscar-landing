import type { ExperienceItem } from '../types';

export const EXPERIENCE: ExperienceItem[] = [
  {
    period: '2024 – Present',
    role: {
      en: 'Senior Full-Stack Engineer & AI Integration Lead',
      es: 'Senior Full-Stack Engineer & AI Integration Lead',
    },
    company: 'IQ Soluciones Integrales en Tecnología (IQsit)',
    description: {
      en: 'Architected and shipped AI-powered SaaS products across fiscal, legal, healthcare, govtech. Designed RAG pipelines, multi-tenant SaaS with strong auth, full DevOps lifecycle. Solo contributor and fractional tech lead.',
      es: 'Diseñé y entregué productos SaaS con IA en fiscal, legal, salud y govtech. Diseñé pipelines RAG, SaaS multi-tenant con auth robusta, ciclo DevOps completo. Colaborador individual y tech lead fraccional.',
    },
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Anthropic', 'OpenAI', 'AWS', 'Vercel', 'Docker', 'Qdrant', 'n8n'],
  },
  {
    period: '2022 – 2024',
    role: {
      en: 'Senior Full-Stack & DevOps Engineer',
      es: 'Senior Full-Stack & DevOps Engineer',
    },
    company: 'Developers.NET',
    description: {
      en: 'Web applications on modern JS stacks (React, Node.js, Next.js) + Python (Django, FastAPI) for clients across LATAM and USA. CI/CD pipelines (Jenkins, GitHub Actions) and AWS hosting. Early production OpenAI integrations.',
      es: 'Aplicaciones web sobre stacks JS modernos (React, Node, Next.js) + Python (Django, FastAPI) para clientes LATAM y EE.UU. Pipelines CI/CD (Jenkins, GitHub Actions) y hosting AWS. Integraciones OpenAI tempranas en producción.',
    },
    stack: ['React', 'Node.js', 'Django', 'AWS', 'Jenkins', 'Nginx', 'OpenAI'],
  },
  {
    period: '2010 – 2022',
    role: {
      en: 'Lead Developer & Systems Administrator',
      es: 'Lead Developer & Systems Administrator',
    },
    company: 'Rodall Oseguera, S.C.',
    description: {
      en: 'Led development and project management for internal and client-facing applications in the international-trade and customs sector. Designed secure platforms, managed full Linux infrastructure, mail servers, domain administration.',
      es: 'Lideré desarrollo y gestión de proyectos para aplicaciones internas y cara al cliente en comercio internacional y aduanas. Diseñé plataformas seguras, administré infraestructura Linux completa, servidores de correo, dominios.',
    },
    stack: ['Delphi', 'C#', 'PHP', 'Perl', 'JavaScript', 'MySQL', 'MS SQL Server', 'Firebird'],
  },
  {
    period: '2000 – 2010',
    role: { en: 'Earlier career', es: 'Carrera temprana' },
    company: 'SmartSolutia · Tiburon Software · Universidad Empresarial · Rodall Oseguera · Arrecife Dive Service',
    description: {
      en: 'Developer / Webmaster roles building business apps, ERP modules, academic platforms, and dive-shop systems. Foundations in classical web stacks and systems programming.',
      es: 'Roles Developer / Webmaster construyendo apps de negocio, módulos ERP, plataformas académicas, sistemas para tiendas de buceo. Fundamentos en stacks web clásicos y programación de sistemas.',
    },
    stack: ['PHP', 'MySQL', 'JavaScript', 'Delphi', 'C#', 'Perl', 'Java', 'Clipper', 'Flash'],
  },
];
