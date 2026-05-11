import type { Bi, BiList } from '../types';

export type Service = {
  slug: string;
  title: Bi;
  forWhom: Bi;
  includes: BiList;
  stack: string[];
  example: Bi;
};

export const SERVICES: Service[] = [
  {
    slug: 'vertical-saas',
    title: {
      en: 'Vertical SaaS — from zero to MVP',
      es: 'SaaS vertical — de cero a MVP',
    },
    forWhom: {
      en: 'Founders or domain experts who need a tech co-pilot',
      es: 'Founders o expertos del dominio que necesitan un co-pilot técnico',
    },
    includes: {
      en: [
        'Architecture & multi-tenant data model',
        'Auth (Clerk / Auth0 / NextAuth) with RBAC',
        'Stripe billing & subscription flows',
        'Admin panels, audit trails, observability',
        'CI/CD + production deploy on Vercel / AWS',
      ],
      es: [
        'Arquitectura y modelo de datos multi-tenant',
        'Auth (Clerk / Auth0 / NextAuth) con RBAC',
        'Stripe billing y flujos de suscripción',
        'Paneles admin, audit trails, observabilidad',
        'CI/CD + deploy productivo en Vercel / AWS',
      ],
    },
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe', 'Clerk', 'Vercel'],
    example: {
      en: 'Multi-tenant SaaS for Mexican accounting firms (SAT + CFDI + Claude)',
      es: 'SaaS multi-tenant para despachos contables mexicanos (SAT + CFDI + Claude)',
    },
  },
  {
    slug: 'ai-rag',
    title: {
      en: 'AI integration & agentic RAG',
      es: 'Integración IA & RAG agentic',
    },
    forWhom: {
      en: 'Companies with documents, knowledge or workflows that should be AI-assisted',
      es: 'Empresas con documentos, conocimiento o flujos que deberían tener IA',
    },
    includes: {
      en: [
        'RAG pipelines (Qdrant / pgvector / Chroma)',
        'LLM provider abstraction (OpenAI / Anthropic / Gemini)',
        'Agentic workflows with Pydantic AI',
        'Evaluation, guardrails, observability (Logfire)',
        'n8n / Zapier integration with existing tools',
      ],
      es: [
        'Pipelines RAG (Qdrant / pgvector / Chroma)',
        'Abstracción multi-proveedor (OpenAI / Anthropic / Gemini)',
        'Workflows agentic con Pydantic AI',
        'Evaluación, guardrails, observabilidad (Logfire)',
        'Integración n8n / Zapier con tus herramientas existentes',
      ],
    },
    stack: ['OpenAI', 'Anthropic', 'Pydantic AI', 'Qdrant', 'n8n', 'Logfire'],
    example: {
      en: 'Agentic RAG for a US consumer-rights law firm (3 specialized agents)',
      es: 'RAG agentic para firma legal de derechos del consumidor en EE.UU. (3 agentes)',
    },
  },
  {
    slug: 'document-ai',
    title: {
      en: 'Document AI pipelines',
      es: 'Pipelines de Document AI',
    },
    forWhom: {
      en: 'Ops-heavy companies (legal, fiscal, healthcare) drowning in PDFs',
      es: 'Empresas con mucha operación (legal, fiscal, salud) ahogadas en PDFs',
    },
    includes: {
      en: [
        'PDF & Office parsing (pdfplumber, docx)',
        'Hybrid OCR (Tesseract + Vision fallback)',
        'LLM structured extraction (JSON output)',
        'Email-to-data ingestion (aiosmtplib)',
        'Excel / DB / webhook delivery',
      ],
      es: [
        'Parseo PDF & Office (pdfplumber, docx)',
        'OCR híbrido (Tesseract + fallback Vision)',
        'Extracción estructurada con LLM (salida JSON)',
        'Ingestión por email (aiosmtplib)',
        'Entrega a Excel / BD / webhook',
      ],
    },
    stack: ['FastAPI', 'pdfplumber', 'pytesseract', 'OpenAI', 'Anthropic', 'Stripe'],
    example: {
      en: 'Email-to-data processor — invoices, contracts, payroll, bank statements',
      es: 'Procesador email-to-data — facturas, contratos, nóminas, estados de cuenta',
    },
  },
  {
    slug: 'emr-healthcare',
    title: {
      en: 'EMR / Healthcare interop',
      es: 'Interop EMR / Salud',
    },
    forWhom: {
      en: 'Healthcare companies, EMR vendors, wearable device makers',
      es: 'Empresas de salud, vendors EMR, fabricantes de dispositivos wearable',
    },
    includes: {
      en: [
        'FHIR R4 servers & clients (HAPI FHIR)',
        'HL7v2 routing with Mirth Connect',
        'OpenEMR customization & module development',
        'HIPAA-aware architecture',
        'Audit trails & PHI filtering (PostHog)',
      ],
      es: [
        'Servidores y clientes FHIR R4 (HAPI FHIR)',
        'Ruteo HL7v2 con Mirth Connect',
        'Customización y desarrollo de módulos OpenEMR',
        'Arquitectura HIPAA-aware',
        'Audit trails y filtrado PHI (PostHog)',
      ],
    },
    stack: ['HAPI FHIR', 'Mirth Connect', 'OpenEMR', 'Docker', 'Vault', 'Tailscale'],
    example: {
      en: 'EMR platform for a US clinical-genetics company (27 custom modules)',
      es: 'Plataforma EMR para empresa de genética clínica EE.UU. (27 módulos custom)',
    },
  },
  {
    slug: 'mexican-fiscal',
    title: {
      en: 'Mexican fiscal automation',
      es: 'Automatización fiscal mexicana',
    },
    forWhom: {
      en: 'Despachos contables, empresas mexicanas with heavy SAT workload',
      es: 'Despachos contables, empresas mexicanas con carga SAT pesada',
    },
    includes: {
      en: [
        'SAT web services (descarga masiva, máquina de estados)',
        'CFDI 4.0 parsing & validation (all voucher types)',
        'FIEL / CSD credential handling (AES-256-GCM)',
        'ISR / IVA / IEPS calculations & reports',
        'LFT compliance (40h reform, hash-chain check-ins)',
      ],
      es: [
        'Servicios SAT (descarga masiva, máquina de estados)',
        'Parseo y validación CFDI 4.0 (todos los tipos)',
        'Manejo de FIEL / CSD (cifrado AES-256-GCM)',
        'Cálculos y reportes ISR / IVA / IEPS',
        'Cumplimiento LFT (reforma 40h, check-ins hash-chain)',
      ],
    },
    stack: ['@nodecfdi', 'node-forge', 'Next.js', 'Prisma', 'ExcelJS', 'Anthropic'],
    example: {
      en: 'Multi-tenant fiscal SaaS for accounting firms (workspace → company → CFDI)',
      es: 'SaaS fiscal multi-tenant para despachos (workspace → empresa → CFDI)',
    },
  },
  {
    slug: 'voice-ai',
    title: {
      en: 'AI call centers & voice automation',
      es: 'Call centers IA & automatización de voz',
    },
    forWhom: {
      en: 'Sales / support teams ready to scale without scaling headcount',
      es: 'Equipos de ventas / soporte listos para escalar sin crecer headcount',
    },
    includes: {
      en: [
        'Twilio Flex setup & customization',
        'WhatsApp Business API integration',
        'AI agents for inbound / outbound',
        'Whisper transcription pipelines',
        'LLM-summarized call notes & CRM sync',
      ],
      es: [
        'Setup y customización Twilio Flex',
        'Integración WhatsApp Business API',
        'Agentes IA para inbound / outbound',
        'Pipelines de transcripción con Whisper',
        'Resumen de llamadas con LLM y sync con CRM',
      ],
    },
    stack: ['Twilio Flex', 'WhatsApp', 'OpenAI Whisper', 'FFmpeg', 'Redis', 'Stripe'],
    example: {
      en: '7-component transcription SaaS suite (marketing, B2C, B2B, admin, template)',
      es: 'Suite SaaS de transcripción de 7 componentes (marketing, B2C, B2B, admin, template)',
    },
  },
  {
    slug: 'modernization',
    title: {
      en: 'System modernization & migrations',
      es: 'Modernización de sistemas y migraciones',
    },
    forWhom: {
      en: 'Legacy systems that need a refresh without a full rewrite',
      es: 'Sistemas legacy que necesitan refresh sin un rewrite completo',
    },
    includes: {
      en: [
        'Auth provider migrations (Clerk ↔ Authentik ↔ Auth0)',
        'Database schema redesign & data migration',
        'Monolith → modular refactors',
        'Infrastructure overhaul (VPS → cloud, manual → IaC)',
        'Documentation & onboarding for new team',
      ],
      es: [
        'Migración entre providers de auth (Clerk ↔ Authentik ↔ Auth0)',
        'Rediseño de schema y migración de datos',
        'Refactorización monolito → modular',
        'Overhaul de infraestructura (VPS → cloud, manual → IaC)',
        'Documentación y onboarding para equipo nuevo',
      ],
    },
    stack: ['Node', 'Python', 'Docker', 'PostgreSQL', 'Nginx', 'GitHub Actions'],
    example: {
      en: 'Clerk → Authentik migration CLI with metadata preservation',
      es: 'CLI de migración Clerk → Authentik preservando metadatos',
    },
  },
  {
    slug: 'audit',
    title: {
      en: 'Technical audit / due diligence',
      es: 'Auditoría técnica / due diligence',
    },
    forWhom: {
      en: 'Founders before a raise, acquirers, investors, decision points',
      es: 'Founders antes de levantar capital, adquirentes, inversionistas, puntos de decisión',
    },
    includes: {
      en: [
        'Architecture & scalability review',
        'Code quality, test coverage, dependency hygiene',
        'Security & compliance assessment',
        'Hiring plan & gap analysis',
        'Written report with findings & prioritized roadmap',
      ],
      es: [
        'Revisión de arquitectura y escalabilidad',
        'Calidad de código, cobertura de tests, dependencias',
        'Assessment de seguridad y cumplimiento',
        'Plan de contratación y análisis de gaps',
        'Reporte escrito con hallazgos y roadmap priorizado',
      ],
    },
    stack: ['—', '(read-only — no code shipped)'],
    example: {
      en: 'Pre-raise architecture review for a vertical-SaaS startup',
      es: 'Revisión de arquitectura pre-ronda para una startup de SaaS vertical',
    },
  },
];

export type EngagementModel = {
  slug: string;
  title: Bi;
  description: Bi;
};

export const ENGAGEMENT_MODELS: EngagementModel[] = [
  {
    slug: 'project',
    title: { en: 'Project-based', es: 'Por proyecto' },
    description: {
      en: 'Fixed scope, milestones, deliverables. Best for MVPs, integrations, audits.',
      es: 'Alcance fijo, milestones, entregables. Ideal para MVPs, integraciones, auditorías.',
    },
  },
  {
    slug: 'retainer',
    title: { en: 'Retainer', es: 'Retainer mensual' },
    description: {
      en: 'Monthly hours bucket. Predictable cadence, ongoing iteration & maintenance.',
      es: 'Banco de horas mensual. Cadencia predecible, iteración y mantenimiento continuo.',
    },
  },
  {
    slug: 'fractional-cto',
    title: { en: 'Fractional CTO', es: 'CTO fraccional' },
    description: {
      en: 'Strategy + hands-on. Architecture, hiring, vendor decisions, technical direction.',
      es: 'Estrategia + manos en código. Arquitectura, hiring, decisiones de vendors, dirección técnica.',
    },
  },
  {
    slug: 'advisory',
    title: { en: 'Advisory', es: 'Advisory' },
    description: {
      en: 'Sounding board for founders. Async Slack + periodic calls. Low-touch, high-leverage.',
      es: 'Sounding board para founders. Slack async + llamadas periódicas. Low-touch, high-leverage.',
    },
  },
  {
    slug: 'equity',
    title: { en: 'Equity / co-founding partner', es: 'Equity / partner co-founder' },
    description: {
      en: 'Selective. For ambitious products in regulated industries I want to own a piece of.',
      es: 'Selectivo. Para productos ambiciosos en industrias reguladas donde quiero participar.',
    },
  },
];
