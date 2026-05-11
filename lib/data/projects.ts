import type { Project } from '../types';

export const PROJECTS: Project[] = [
  // ============ AI & DOCUMENT ============
  {
    slug: 'vertical-saas-fiscal',
    name: 'vertical-saas-fiscal',
    domain: 'fiscal',
    status: 'mvp',
    year: '2025–Present',
    client: { en: 'Founder · self', es: 'Founder · propio' },
    summary: {
      en: 'Vertical SaaS for Mexican accounting firms.',
      es: 'SaaS vertical para despachos contables mexicanos.',
    },
    description: {
      en: 'Multi-tenant platform Workspace (firm) → Company (client). Full SAT mass-download with multi-state pipeline, CFDI 4.0 parsing across all voucher types with IVA/ISR/IEPS retentions, AES-256-GCM encrypted FIEL credential storage, Claude-assisted fiscal analysis, Excel/PDF reporting.',
      es: 'Plataforma multi-tenant Workspace (despacho) → Company (cliente). Descarga masiva del SAT con máquina de estados completa, parseo CFDI 4.0 en todos los tipos de comprobante con retenciones IVA/ISR/IEPS, almacenamiento cifrado de FIEL con AES-256-GCM, análisis fiscal asistido por Claude, reportes Excel/PDF.',
    },
    stack: ['Next.js 16', 'TypeScript', 'Prisma 6', 'PostgreSQL', 'NextAuth v5', 'Anthropic Claude', '@nodecfdi', 'node-forge', 'ExcelJS', 'React-PDF', 'Vitest'],
    highlights: {
      en: [
        'Multi-tenant Workspace → Company hierarchy',
        '6-state SAT sync pipeline (idempotent, retryable)',
        '5 CFDI voucher types (I/E/T/N/P)',
        'AES-256-GCM encrypted FIEL/CSD storage',
        'Excel reports with formulas (not hard-coded)',
      ],
      es: [
        'Jerarquía multi-tenant Workspace → Company',
        'Pipeline SAT de 6 estados (idempotente, reintentable)',
        '5 tipos de CFDI (I/E/T/N/P)',
        'Almacenamiento FIEL/CSD cifrado con AES-256-GCM',
        'Reportes Excel con fórmulas (no hardcodeado)',
      ],
    },
  },
  {
    slug: 'agentic-rag-legal',
    name: 'agentic-rag-legal',
    domain: 'legal',
    status: 'mvp',
    year: '2025',
    client: { en: 'US consumer-rights law firm', es: 'Firma legal de derechos del consumidor (EE.UU.)' },
    summary: {
      en: 'Agentic RAG for Song-Beverly (lemon law) workflows.',
      es: 'RAG agentic para flujos Song-Beverly (lemon law).',
    },
    description: {
      en: 'Three specialized Pydantic AI agents — refund calculator (Song-Beverly Act formula), compliance checker, NHTSA/NMVTIS vehicle title verifier — integrated with Filevine case management, Slack, and a private web app. Self-hosted Qdrant with hybrid search, Claude (Sonnet for retrieval, Opus for synthesis), attorney-client-privilege-grade RBAC and audit trails (SOC 2 Type II target).',
      es: 'Tres agentes Pydantic AI especializados — calculadora de reembolso (fórmula Song-Beverly), verificador de cumplimiento, verificador de título vehicular (NHTSA/NMVTIS) — integrados con Filevine, Slack y una webapp privada. Qdrant auto-hospedado con búsqueda híbrida, Claude (Sonnet retrieval, Opus síntesis), RBAC nivel attorney-client privilege y audit trails (objetivo SOC 2 Type II).',
    },
    stack: ['React 19', 'TypeScript', 'Vite', 'Pydantic AI', 'Qdrant', 'Claude (Sonnet/Opus)', 'n8n', 'Filevine API', 'Docker', 'Nginx'],
    highlights: {
      en: [
        '3 specialized agents (refund / compliance / title)',
        'Hybrid retrieval (vector + keyword)',
        'Filevine + Slack + web triple-integration',
        'Excel-output refund calculator',
        'Audit trail per query (legal-grade)',
      ],
      es: [
        '3 agentes especializados (refund / compliance / título)',
        'Retrieval híbrido (vector + keyword)',
        'Integración triple: Filevine + Slack + web',
        'Calculadora de reembolso con salida Excel',
        'Audit trail por query (nivel legal)',
      ],
    },
  },
  {
    slug: 'email-to-data-pipeline',
    name: 'email-to-data-pipeline',
    domain: 'ai',
    status: 'production',
    year: '2024–Present',
    client: { en: 'Self-funded SaaS', es: 'SaaS auto-financiado' },
    summary: {
      en: 'Send a PDF by email, get structured data back.',
      es: 'Envía un PDF por email, recibes datos estructurados.',
    },
    description: {
      en: 'Async PDF and Office parsing with pdfplumber, pytesseract, python-docx; LLM extraction (OpenAI + Anthropic); Stripe billing; aiosmtplib for email ingestion; React 19 + Vite frontend. Handles invoices, contracts, payroll, bank statements.',
      es: 'Parseo asíncrono de PDF y Office con pdfplumber, pytesseract, python-docx; extracción LLM (OpenAI + Anthropic); billing con Stripe; ingestión por email con aiosmtplib; frontend React 19 + Vite. Procesa facturas, contratos, nóminas, estados de cuenta.',
    },
    stack: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'OpenAI', 'Anthropic', 'pdfplumber', 'pytesseract', 'Stripe', 'React 19', 'Vite'],
    highlights: {
      en: [
        'Email → structured data pipeline',
        'Hybrid OCR (Tesseract + Vision)',
        'Stripe subscription billing',
        'Production-deployed (PM2)',
      ],
      es: [
        'Pipeline Email → datos estructurados',
        'OCR híbrido (Tesseract + Vision)',
        'Billing por suscripción con Stripe',
        'Desplegado en producción (PM2)',
      ],
    },
  },
  {
    slug: 'multi-tenant-legal-saas',
    name: 'multi-tenant-legal-saas',
    domain: 'legal',
    status: 'mvp',
    year: '2025',
    client: { en: 'B2B SaaS for legal firms', es: 'SaaS B2B para firmas legales' },
    summary: {
      en: 'Multi-tenant legal-doc SaaS with pluggable RAG.',
      es: 'SaaS legal multi-tenant con RAG modular.',
    },
    description: {
      en: 'Next.js frontend + FastAPI backend with pluggable RAG (Qdrant/Chroma), DOCX/PDF generation (docxtpl, WeasyPrint), Alembic migrations, Nginx with multi-tenant subdomains. JWT auth, X-Tenant header injection from HttpOnly cookies.',
      es: 'Frontend Next.js + backend FastAPI con RAG modular (Qdrant/Chroma), generación DOCX/PDF (docxtpl, WeasyPrint), migraciones Alembic, Nginx con multi-tenant por subdominio. Auth JWT, inyección X-Tenant desde cookies HttpOnly.',
    },
    stack: ['FastAPI', 'PostgreSQL', 'SQLAlchemy', 'Alembic', 'JWT', 'docxtpl', 'WeasyPrint', 'Qdrant', 'Chroma', 'Next.js 14'],
    highlights: {
      en: [
        'Multi-tenant by subdomain',
        'Pluggable RAG backend',
        'DOCX template generation',
        'Cookie-based tenant isolation',
      ],
      es: [
        'Multi-tenant por subdominio',
        'Backend RAG modular',
        'Generación de plantillas DOCX',
        'Aislamiento por cookies',
      ],
    },
  },
  {
    slug: 'rag-framework',
    name: 'rag-framework',
    domain: 'ai',
    status: 'production',
    year: '2024',
    client: { en: 'Internal framework', es: 'Framework interno' },
    summary: {
      en: 'Modular RAG framework with n8n integration.',
      es: 'Framework RAG modular con integración n8n.',
    },
    description: {
      en: 'Generic FastAPI + Qdrant/Chroma RAG with multi-backend embeddings, n8n workflow integration, Selenium/Playwright web scraping for ingestion. Re-used across multiple client projects as a base.',
      es: 'RAG genérico FastAPI + Qdrant/Chroma con embeddings multi-backend, integración n8n para workflows, web scraping con Selenium/Playwright para ingestión. Reutilizado como base en múltiples proyectos cliente.',
    },
    stack: ['FastAPI', 'Qdrant', 'PostgreSQL', 'OpenAI', 'sentence-transformers', 'Selenium', 'Playwright', 'n8n'],
    highlights: {
      en: ['Reusable across multiple clients', 'Multi-backend embeddings', 'n8n workflow hooks'],
      es: ['Reutilizable entre múltiples clientes', 'Embeddings multi-backend', 'Hooks de workflow n8n'],
    },
  },
  {
    slug: 'fiscal-chatbot-rag',
    name: 'fiscal-chatbot-rag',
    domain: 'fiscal',
    status: 'mvp',
    year: '2024',
    client: { en: 'Mexican tax advisors', es: 'Asesores fiscales mexicanos' },
    summary: {
      en: 'Mexican fiscal-law RAG chatbot with WhatsApp roadmap.',
      es: 'Chatbot RAG de leyes fiscales mexicanas con roadmap a WhatsApp.',
    },
    description: {
      en: 'Knowledge base of Mexican tax law with Qdrant, FastAPI, multi-tenant analytics, secure auth, WhatsApp Business roadmap. Setup script automates 6 install steps.',
      es: 'Base de conocimiento de leyes fiscales mexicanas con Qdrant, FastAPI, analytics multi-tenant, auth segura, roadmap a WhatsApp Business. Script de setup automatiza 6 pasos de instalación.',
    },
    stack: ['FastAPI', 'Qdrant', 'OpenAI', 'Anthropic', 'Next.js', 'shadcn/ui', 'Docker', 'SQLite/PostgreSQL'],
    highlights: {
      en: ['RAG over Mexican tax codes', 'Multi-tenant analytics', 'Future WhatsApp integration'],
      es: ['RAG sobre códigos fiscales MX', 'Analytics multi-tenant', 'Integración futura con WhatsApp'],
    },
  },
  {
    slug: 'ai-website-generator',
    name: 'ai-website-generator',
    domain: 'saas',
    status: 'mvp',
    year: '2025',
    client: { en: 'Self-funded SaaS', es: 'SaaS auto-financiado' },
    summary: {
      en: 'AI-powered website generator with visual editor.',
      es: 'Generador de sitios con IA y editor visual.',
    },
    description: {
      en: 'NestJS monorepo with Prisma + JWT auth, React + Vite frontend with GrapesJS visual editor, OpenAI content generation per block. Custom blocks, HTML/CSS/JSON storage, one-click deploy.',
      es: 'Monorepo NestJS con Prisma + JWT, frontend React + Vite con editor visual GrapesJS, generación de contenido con OpenAI por bloque. Bloques personalizados, almacenamiento HTML/CSS/JSON, deploy con un click.',
    },
    stack: ['NestJS', 'Prisma', 'PostgreSQL', 'React', 'Vite', 'GrapesJS', 'OpenAI', 'JWT'],
    highlights: {
      en: ['Visual drag-drop editor', 'AI block content', 'Monorepo architecture'],
      es: ['Editor visual drag-drop', 'Contenido por bloque con IA', 'Arquitectura monorepo'],
    },
  },
  {
    slug: 'tts-demo-app',
    name: 'tts-demo-app',
    domain: 'voice',
    status: 'demo',
    year: '2025',
    client: { en: 'Self-funded', es: 'Auto-financiado' },
    summary: {
      en: 'Text-to-speech app with Google Gemini.',
      es: 'App de text-to-speech con Google Gemini.',
    },
    description: {
      en: 'Vite + React 18 + TypeScript frontend integrating Google Cloud TTS and Gemini AI SDK. Minimalist UI focused on demoing voice synthesis quality and Gemini text generation.',
      es: 'Frontend Vite + React 18 + TypeScript integrando Google Cloud TTS y Gemini AI SDK. UI minimalista enfocada en demostrar calidad de síntesis de voz y generación de texto con Gemini.',
    },
    stack: ['Vite', 'React 18', 'TypeScript', 'Google Cloud TTS', 'Gemini SDK', 'Tailwind'],
    highlights: {
      en: ['Gemini AI integration', 'Google Cloud TTS', 'Multi-voice demos'],
      es: ['Integración Gemini AI', 'Google Cloud TTS', 'Demos multi-voz'],
    },
  },

  // ============ HEALTHCARE / EMR ============
  {
    slug: 'emr-platform',
    name: 'emr-platform',
    domain: 'healthcare',
    status: 'production',
    year: '2024–Present',
    client: { en: 'US clinical-genetics company', es: 'Empresa de genética clínica (EE.UU.)' },
    summary: {
      en: 'EMR platform — OpenEMR fork with 27 custom modules.',
      es: 'Plataforma EMR — fork de OpenEMR con 27 módulos custom.',
    },
    description: {
      en: 'Customized fork of OpenEMR with modules for billing, clinical decision rules, FHIR vital-signs services, patient portal with chat (8x8), Twilio SMS, e-prescribing (Weno), USPS, PDF, reports, reminders, and encounter notifications. Modern Next.js 15 frontend with IBM Carbon Design System. ~6,700 files codebase.',
      es: 'Fork customizado de OpenEMR con módulos para facturación, reglas clínicas, servicios FHIR de signos vitales, portal del paciente con chat (8x8), Twilio SMS, e-prescribing (Weno), USPS, PDF, reportes, recordatorios, notificaciones de encuentro. Frontend moderno Next.js 15 con IBM Carbon Design. ~6,700 archivos.',
    },
    stack: ['PHP', 'Next.js 15', 'React 19', 'TypeScript', 'Carbon Design System', 'PostgreSQL', 'CouchDB', 'Docker', 'Mirth Connect', 'Clerk', '8x8', 'Twilio'],
    highlights: {
      en: [
        '27 custom modules on OpenEMR fork',
        'FHIR R4 + HL7v2 (Mirth Connect) interop',
        '8x8 voice + chat integration',
        'PostHog with HIPAA-compliant PHI filtering',
        'Automated CI/CD with HMAC-verified webhooks',
      ],
      es: [
        '27 módulos custom sobre fork OpenEMR',
        'Interop FHIR R4 + HL7v2 (Mirth Connect)',
        'Integración 8x8 voz + chat',
        'PostHog con filtrado PHI HIPAA-compliant',
        'CI/CD automatizado con webhooks HMAC-verificados',
      ],
    },
  },
  {
    slug: 'patient-portal',
    name: 'patient-portal',
    domain: 'healthcare',
    status: 'production',
    year: '2024–Present',
    client: { en: 'US clinical-genetics company', es: 'Empresa de genética clínica (EE.UU.)' },
    summary: {
      en: 'Patient portal — case mgmt, payments, charts.',
      es: 'Portal del paciente — gestión de casos, pagos, gráficas.',
    },
    description: {
      en: 'Patient/case web portal: case tracking, payments, history, document upload. Full Next.js 15.2 + Carbon Design + Clerk auth + Google Maps + D3/Carbon Charts. Includes formal security assessment and implementation docs.',
      es: 'Portal web de pacientes/casos: tracking de casos, pagos, historial, carga de documentos. Next.js 15.2 + Carbon Design + Clerk + Google Maps + D3/Carbon Charts. Incluye assessment formal de seguridad y documentación de implementación.',
    },
    stack: ['Next.js 15', 'React 19', 'TypeScript', 'Carbon Design', 'Clerk', 'D3', 'Google Maps API', 'Tailwind'],
    highlights: {
      en: ['Security-audit-ready', 'Real-time case tracking', 'Integrated payments'],
      es: ['Listo para auditoría de seguridad', 'Tracking de casos en tiempo real', 'Pagos integrados'],
    },
  },
  {
    slug: 'wearable-emr-bridge',
    name: 'wearable-emr-bridge',
    domain: 'healthcare',
    status: 'production',
    year: '2024–Present',
    client: { en: 'Wearable hemodynamic device company', es: 'Empresa de dispositivo hemodinámico wearable' },
    summary: {
      en: 'Wearable device → EMR integration platform.',
      es: 'Plataforma integración dispositivo wearable → EMR.',
    },
    description: {
      en: 'Dockerized integration stack: HAPI FHIR R4 server (Java), Mirth Connect for HL7v2, n8n workflow automation, PostgreSQL, Vault for secrets, Nginx, AWS EC2 with Tailscale networking. Real-time nurse-station dashboard with D3 charts and Next.js. Includes patient-data simulator.',
      es: 'Stack dockerizado: servidor HAPI FHIR R4 (Java), Mirth Connect para HL7v2, n8n para workflows, PostgreSQL, Vault para secretos, Nginx, AWS EC2 con red Tailscale. Dashboard real-time para nurse-station con D3 charts y Next.js. Incluye simulador de datos del paciente.',
    },
    stack: ['HAPI FHIR', 'Mirth Connect', 'Docker Compose', 'PostgreSQL', 'Vault', 'Tailscale', 'AWS EC2', 'n8n', 'Next.js', 'D3'],
    highlights: {
      en: [
        'FHIR R4 + HL7v2 dual-protocol',
        'Vault-managed secrets',
        'Tailscale private networking',
        'Patient-data simulator included',
      ],
      es: [
        'Dual-protocolo FHIR R4 + HL7v2',
        'Secretos gestionados con Vault',
        'Red privada Tailscale',
        'Simulador de datos del paciente incluido',
      ],
    },
  },
  {
    slug: 'hipaa-compliance-suite',
    name: 'hipaa-compliance-suite',
    domain: 'healthcare',
    status: 'production',
    year: '2024',
    client: { en: 'US compliance SaaS', es: 'SaaS de cumplimiento (EE.UU.)' },
    summary: {
      en: 'HIPAA compliance assessment suite with RAG.',
      es: 'Suite de assessment HIPAA con RAG.',
    },
    description: {
      en: 'Four-repo suite: Frontend (React 18 + Vite + Auth0/Clerk), Django REST backend with 13 models and 36+ endpoints, Vercel serverless wrapper. Plus a HipaaWizard-RAG with GPT-4 + text-embedding-3-small + Supabase pgvector + Pydantic AI + Logfire observability. PDF chunking with copyright detection.',
      es: 'Suite de cuatro repos: Frontend (React 18 + Vite + Auth0/Clerk), backend Django REST con 13 modelos y 36+ endpoints, wrapper serverless en Vercel. Más HipaaWizard-RAG con GPT-4 + text-embedding-3-small + Supabase pgvector + Pydantic AI + observabilidad Logfire. Chunking PDF con detección de copyright.',
    },
    stack: ['React 18', 'Django', 'FastAPI', 'PostgreSQL', 'Supabase pgvector', 'OpenAI', 'Pydantic AI', 'Logfire', 'Vercel', 'Auth0', 'Clerk'],
    highlights: {
      en: [
        '4-repo product family',
        'Assessment ⇆ RAG dual surface',
        'Semantic chunking + copyright detection',
        'Hybrid Auth0 + Clerk',
      ],
      es: [
        'Familia de 4 repos',
        'Doble superficie: Assessment ⇆ RAG',
        'Chunking semántico + detección copyright',
        'Híbrido Auth0 + Clerk',
      ],
    },
  },

  // ============ GOVTECH ============
  {
    slug: 'municipal-gov-platform',
    name: 'municipal-gov-platform',
    domain: 'govtech',
    status: 'production',
    year: '2026',
    client: { en: 'Municipal city council (Veracruz)', es: 'Ayuntamiento municipal (Veracruz)' },
    summary: {
      en: 'Municipal government platform with Vision OCR.',
      es: 'Plataforma de gobierno municipal con OCR Vision.',
    },
    description: {
      en: '47 pages (15 public + 32 admin), 14 Prisma models, 28 REST endpoints. Five roles. Petition workflows across 7 categories × 8 origin channels (office, web, brigade, phone, social, leaders, WhatsApp, citizen). Oficios in/out tracking with status workflow. Brigade work with before/after photo evidence. Claude Vision OCR for INE/CURP.',
      es: '47 páginas (15 públicas + 32 admin), 14 modelos Prisma, 28 endpoints REST. Cinco roles. Workflows de peticiones en 7 categorías × 8 canales de origen (oficina, web, brigada, teléfono, redes sociales, líderes, WhatsApp, ciudadano). Tracking de oficios in/out con workflow. Brigadas con evidencia foto antes/después. Claude Vision OCR para INE/CURP.',
    },
    stack: ['Next.js 16', 'TypeScript', 'Prisma 7', 'PostgreSQL', 'NextAuth v5', 'Claude Vision API', 'TipTap', 'shadcn/ui', 'Tailwind 4'],
    highlights: {
      en: [
        'Claude Vision OCR for INE/CURP',
        '5-role RBAC (Admin / Coord / Capturer / Brigade / Leader)',
        'Public + admin web in one codebase',
        'Petition workflow with 7 × 8 matrix',
      ],
      es: [
        'OCR Claude Vision para INE/CURP',
        'RBAC 5 roles (Admin / Coord / Capturista / Brigada / Líder)',
        'Web pública + admin en un solo codebase',
        'Workflow de peticiones con matriz 7 × 8',
      ],
    },
  },
  {
    slug: 'social-program-pwa',
    name: 'social-program-pwa',
    domain: 'govtech',
    status: 'production',
    year: '2024',
    client: { en: 'Municipal social-program office', es: 'Oficina municipal de programas sociales' },
    summary: {
      en: 'Offline-first PWA for social-program beneficiary capture.',
      es: 'PWA offline-first para captura de beneficiarios.',
    },
    description: {
      en: 'Captures beneficiary data in the field. Offline-first IndexedDB, real-time desktop↔mobile sync via Socket.io, hybrid OCR (OpenAI Vision + Tesseract.js fallback with 3 exponential retries), CONEVAL poverty-index scoring, RENAPO integration. Multi-instance configurable per agency. Atomic folio generation per zone.',
      es: 'Captura datos de beneficiarios en campo. IndexedDB offline-first, sync real-time desktop↔móvil con Socket.io, OCR híbrido (OpenAI Vision + fallback Tesseract.js con 3 reintentos exponenciales), scoring índice pobreza CONEVAL, integración RENAPO. Multi-instancia configurable por dependencia. Generación atómica de folios por zona.',
    },
    stack: ['Node.js 18', 'Express 5', 'React 18', 'Vite', 'PostgreSQL 14', 'Socket.io', 'Zustand', 'IndexedDB', 'OpenAI Vision', 'Tesseract.js'],
    highlights: {
      en: [
        'Offline-first PWA',
        'Real-time desktop↔mobile sync',
        'Hybrid OCR with exponential retries',
        'CONEVAL + RENAPO integration',
      ],
      es: [
        'PWA offline-first',
        'Sync real-time desktop↔móvil',
        'OCR híbrido con reintentos exponenciales',
        'Integración CONEVAL + RENAPO',
      ],
    },
  },
  {
    slug: 'port-ops-assignment',
    name: 'port-ops-assignment',
    domain: 'logistics',
    status: 'demo',
    year: '2024',
    client: { en: 'Port operations company', es: 'Empresa de operaciones portuarias' },
    summary: {
      en: 'Daily personnel-assignment automation for port ops.',
      es: 'Automatización de asignación diaria de personal portuario.',
    },
    description: {
      en: 'Demo concept: validates personnel, auto-assigns by experience and shift rules (max 2 consecutive shifts), generates contracts, reports. Models: 10 employees, 5 vessels, 6 operations.',
      es: 'Demo conceptual: valida personal, asigna automáticamente por experiencia y reglas de turno (máximo 2 turnos consecutivos), genera contratos, reportes. Modela 10 empleados, 5 barcos, 6 maniobras.',
    },
    stack: ['React 19', 'TypeScript', 'Vite', 'Tailwind', 'date-fns', 'Heroicons'],
    highlights: {
      en: ['Rule-based assignment engine', 'Contract generation', 'Demo data + mock flow'],
      es: ['Motor de asignación basado en reglas', 'Generación de contratos', 'Demo data + flujo mock'],
    },
  },

  // ============ LEGAL / COMPLIANCE ============
  {
    slug: 'lft-compliance',
    name: 'lft-compliance',
    domain: 'legal',
    status: 'mvp',
    year: '2025',
    client: { en: 'Mexican accounting firms', es: 'Despachos contables mexicanos' },
    summary: {
      en: 'LFT 40-hour-week compliance platform.',
      es: 'Plataforma cumplimiento LFT 40 horas.',
    },
    description: {
      en: 'Electronic time-tracking required by 2026–2030 LFT reform. Immutable hash-chain check-ins. Despacho → Empresa → Empleado hierarchy. Avoids 250–5,000 UMA fines (LFT Art. 994). Three roles: despacho_admin, empresa_admin, empleado. Pilot with Mexican accounting firm.',
      es: 'Registro electrónico de jornada requerido por reforma LFT 2026-2030. Check-ins inmutables (hash-chain). Jerarquía Despacho → Empresa → Empleado. Evita multas 250-5,000 UMA (Art. 994 LFT). Tres roles: despacho_admin, empresa_admin, empleado. Piloto con despacho contable.',
    },
    stack: ['Next.js 15', 'TypeScript', 'Prisma 6', 'PostgreSQL', 'NextAuth v5', 'Tailwind 3', 'Vitest', 'Docker'],
    highlights: {
      en: ['Hash-chain immutable check-ins', 'LFT Art. 132 frac. XXXIV compliance', 'Multi-tenant 3-level hierarchy'],
      es: ['Check-ins inmutables (hash-chain)', 'Cumple LFT Art. 132 frac. XXXIV', 'Jerarquía multi-tenant 3 niveles'],
    },
  },
  {
    slug: 'customs-kyc-platform',
    name: 'customs-kyc-platform',
    domain: 'legal',
    status: 'production',
    year: '2024–2025',
    client: { en: 'Mexican customs-broker KYC platform', es: 'Plataforma KYC para agencias aduanales' },
    summary: {
      en: 'KYC compliance for Mexican customs brokers.',
      es: 'KYC para agentes aduanales mexicanos.',
    },
    description: {
      en: 'Full-stack platform with risk-scoring engine (0–100, YAML-defined rule packs), AI extraction across 25+ fiscal/legal/customs document types, news scraper with AI analysis, and RBAC (Admin/Analyst/Client).',
      es: 'Plataforma full-stack con motor de scoring de riesgo (0–100, reglas YAML), extracción IA en 25+ tipos de documentos fiscales/legales/aduanales, news scraper con análisis IA, RBAC (Admin/Analista/Cliente).',
    },
    stack: ['React 18', 'TypeScript', 'Vite', 'FastAPI', 'SQLAlchemy 2.0', 'PostgreSQL', 'OpenAI GPT-4', 'Docker'],
    highlights: {
      en: [
        'YAML-defined rule packs (0–100 scoring)',
        '25+ document types extracted',
        'News scraper + AI analysis',
        '3-role RBAC',
      ],
      es: [
        'Reglas YAML (scoring 0–100)',
        '25+ tipos de documento extraídos',
        'News scraper + análisis IA',
        'RBAC 3 roles',
      ],
    },
  },

  // ============ VOICE / TRANSCRIPTION ============
  {
    slug: 'transcription-suite',
    name: 'transcription-suite',
    domain: 'voice',
    status: 'production',
    year: '2024–Present',
    client: { en: 'Modular transcription SaaS', es: 'SaaS modular de transcripción' },
    summary: {
      en: 'Seven-component transcription SaaS suite.',
      es: 'Suite SaaS de transcripción de siete componentes.',
    },
    description: {
      en: '7-repo product: marketing site, B2C consumer app, B2B enterprise app, admin dashboard (backend + frontend), and white-label template stack (backend + frontend) for enterprise customers. OpenAI Whisper transcription + FFmpeg audio pipeline + Stripe billing + Clerk multi-tenant auth + Redis sessions + multi-provider email.',
      es: 'Producto de 7 repos: sitio marketing, app B2C consumidor, app B2B enterprise, dashboard admin (backend + frontend), stack template white-label (backend + frontend) para clientes enterprise. Transcripción OpenAI Whisper + FFmpeg + billing Stripe + auth multi-tenant Clerk + sesiones Redis + email multi-proveedor.',
    },
    stack: ['Node.js', 'Express 5', 'TypeScript', 'PostgreSQL', 'Sequelize', 'OpenAI Whisper', 'Stripe', 'Clerk', 'Redis', 'FFmpeg', 'React 18', 'Material-UI', 'Firebase', 'PostHog'],
    highlights: {
      en: [
        '7-repo modular product',
        '4 product surfaces (marketing/B2C/B2B/template)',
        'White-label template for enterprise',
        'FFmpeg audio processing pipeline',
      ],
      es: [
        'Producto modular de 7 repos',
        '4 superficies (marketing/B2C/B2B/template)',
        'Template white-label para enterprise',
        'Pipeline de procesamiento audio con FFmpeg',
      ],
    },
  },

  // ============ LOGISTICS ============
  {
    slug: 'trip-equity-engine',
    name: 'trip-equity-engine',
    domain: 'logistics',
    status: 'production',
    year: '2024',
    client: { en: 'Bulk-cargo transport company', es: 'Empresa de transporte de carga a granel' },
    summary: {
      en: 'AI-powered trip equity engine for transport ops.',
      es: 'Motor de equidad de viajes con IA para transporte.',
    },
    description: {
      en: 'LOGRA system: SQL Server backend, OpenAI GPT-4 predictive analysis, PDF "minutas" parsing on ingest, real-time dashboard. Models 3 rest cycles (25+5, 13+3, 12+2) × 4 unloading types × 3 unit types, with GPS incidents and sanction management. ~98 Express endpoints across 18+ tables.',
      es: 'Sistema LOGRA: backend SQL Server, análisis predictivo OpenAI GPT-4, parseo PDF "minutas" al ingestar, dashboard tiempo real. Modela 3 ciclos descanso (25+5, 13+3, 12+2) × 4 tipos descarga × 3 tipos unidad, con incidencias GPS y gestión de sanciones. ~98 endpoints Express en 18+ tablas.',
    },
    stack: ['Node.js', 'Express 5', 'React 19', 'Vite', 'SQL Server', 'OpenAI GPT-4', 'pdf-parse', 'Recharts'],
    highlights: {
      en: [
        'AI-justified trip assignment',
        '~98 Express endpoints',
        '18+ SQL Server tables',
        'PDF "minuta" auto-parsing',
      ],
      es: [
        'Asignación de viaje justificada con IA',
        '~98 endpoints Express',
        '18+ tablas SQL Server',
        'Parseo automático de "minutas" PDF',
      ],
    },
  },

  // ============ ENTERPRISE ============
  {
    slug: 'mentoring-platform',
    name: 'mentoring-platform',
    domain: 'enterprise',
    status: 'production',
    year: '2022–2024',
    client: { en: 'Enterprise mentor-member platform', es: 'Plataforma enterprise mentor-miembro' },
    summary: {
      en: 'Business mentoring & assessment platform.',
      es: 'Plataforma de mentoría y assessment empresarial.',
    },
    description: {
      en: 'Django + React full-stack platform with ~98 REST endpoints, ~300 frontend components, ~1,163 backend commits. Modules: business assessment, strategic planning, mentor↔member matching, AWS S3 document safe, KPI tracking, engagement metrics. Azure AD (MSAL) auth, PDF processing via PSPDFKit, SendinBlue email.',
      es: 'Plataforma full-stack Django + React con ~98 endpoints REST, ~300 componentes frontend, ~1,163 commits backend. Módulos: assessment empresarial, planeación estratégica, matching mentor↔miembro, document safe AWS S3, KPIs, engagement. Auth Azure AD (MSAL), PDFs vía PSPDFKit, email SendinBlue.',
    },
    stack: ['Django', 'Python', 'JWT', 'React 18', 'Material-UI v6', 'Azure AD (MSAL)', 'AWS S3', 'PSPDFKit', 'SendinBlue'],
    highlights: {
      en: ['Azure AD enterprise auth', '~1,163 backend commits', 'KPI dashboards', 'Document safe (S3)'],
      es: ['Auth Azure AD enterprise', '~1,163 commits backend', 'Dashboards de KPIs', 'Document safe (S3)'],
    },
  },

  // ============ HEALTHCARE PORTAL SUITE ============
  {
    slug: 'healthcare-portal-suite',
    name: 'healthcare-portal-suite',
    domain: 'healthcare',
    status: 'production',
    year: '2023–Present',
    client: { en: 'Healthcare service network (phlebotomy)', es: 'Red de servicios de salud (flebotomía)' },
    summary: {
      en: 'Multi-channel healthcare portal suite (6 repos).',
      es: 'Suite multi-canal de portales de salud (6 repos).',
    },
    description: {
      en: 'Six parallel interfaces of the same product: B2B payor flows (Vue 3), B2C direct-to-consumer service requests, Salesforce-integrated portal, IBM Carbon Design admin (Next.js 16), Salesforce → REST migration tooling. Integrations: Auth0, Clerk, Stripe, Google Maps, Salesforce.',
      es: 'Seis interfaces paralelas del mismo producto: flujos B2B payor (Vue 3), service requests B2C, portal integrado con Salesforce, admin con IBM Carbon Design (Next.js 16), herramienta migración Salesforce → REST. Integraciones: Auth0, Clerk, Stripe, Google Maps, Salesforce.',
    },
    stack: ['Next.js 16', 'React 19', 'Vue 3', 'TypeScript', 'Auth0', 'Clerk', 'Supabase', 'Stripe', 'Salesforce', 'Google Maps', 'Carbon Design'],
    highlights: {
      en: [
        '6-repo product family',
        '3 frameworks (Next, React, Vue)',
        'B2B + B2C + Salesforce-sync',
        'HIPAA/GDPR-aware design',
      ],
      es: [
        'Familia de 6 repos',
        '3 frameworks (Next, React, Vue)',
        'B2B + B2C + sync Salesforce',
        'Diseño HIPAA/GDPR-aware',
      ],
    },
  },

  // ============ B2B ============
  {
    slug: 'b2b-sales-system',
    name: 'b2b-sales-system',
    domain: 'enterprise',
    status: 'production',
    year: '2023',
    client: { en: 'B2B vendor-client sales system', es: 'Sistema de ventas B2B vendor-cliente' },
    summary: {
      en: 'B2B vendor↔client commerce: quotes, orders, vouchers.',
      es: 'Comercio B2B vendor↔cliente: cotizaciones, pedidos, comprobantes.',
    },
    description: {
      en: 'Vendor + client roles. End-to-end: catalog → quotation → order → fiscal voucher → payments. PDF generation (jsPDF + autotable), Excel export (xlsx), QR codes, XML processing, Chart.js dashboards.',
      es: 'Roles vendedor y cliente. End-to-end: catálogo → cotización → pedido → comprobante fiscal → pagos. Generación PDF (jsPDF + autotable), exportación Excel (xlsx), QR, procesamiento XML, dashboards Chart.js.',
    },
    stack: ['React 18.3', 'Vite 6', 'Headless UI', 'jsPDF', 'XLSX', 'Chart.js', 'XML parsing'],
    highlights: {
      en: ['12 pages, 2 roles', 'PDF + Excel + QR + XML exports', 'Multi-region variants'],
      es: ['12 páginas, 2 roles', 'Exportaciones PDF + Excel + QR + XML', 'Variantes multi-región'],
    },
  },

  // ============ ECOMMERCE / PHARMACY ============
  {
    slug: 'telehealth-pharmacy',
    name: 'telehealth-pharmacy',
    domain: 'ecommerce',
    status: 'production',
    year: '2024',
    client: { en: 'Compounding pharmacy (DEA Schedule III)', es: 'Farmacia compounding (DEA Schedule III)' },
    summary: {
      en: 'Twin telehealth + B2B pharmacy sites.',
      es: 'Sitios gemelos telesalud + farmacia B2B.',
    },
    description: {
      en: 'Two Next.js 16 sites: D2C telemedicine intake (HIPAA-aware) and B2B prescriber-only ordering. Same brand, two audiences. Resend for transactional email.',
      es: 'Dos sitios Next.js 16: intake telesalud D2C (HIPAA-aware) y ordering B2B solo prescriptores. Misma marca, dos audiencias. Resend para email transaccional.',
    },
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind 4', 'Resend'],
    highlights: {
      en: ['Twin D2C + B2B sites', 'DEA Schedule III compliance flow', 'HIPAA-aware intake'],
      es: ['Sitios gemelos D2C + B2B', 'Flujo cumplimiento DEA Schedule III', 'Intake HIPAA-aware'],
    },
  },

  // ============ IDENTITY ============
  {
    slug: 'auth-migration-cli',
    name: 'auth-migration-cli',
    domain: 'identity',
    status: 'production',
    year: '2025',
    client: { en: 'Identity migration tool', es: 'Herramienta de migración de identidad' },
    summary: {
      en: 'Clerk → Authentik user-migration CLI.',
      es: 'CLI migración usuarios Clerk → Authentik.',
    },
    description: {
      en: 'Standalone Node.js CLI: migrates users from Clerk to Authentik with metadata preservation. Practical tool that came out of a client migration off Clerk.',
      es: 'CLI standalone Node.js: migra usuarios de Clerk a Authentik preservando metadatos. Herramienta práctica que salió de una migración real.',
    },
    stack: ['Node.js', 'dotenv', 'node-fetch'],
    highlights: {
      en: ['Standalone CLI', 'Metadata preservation', 'Real-world migration'],
      es: ['CLI standalone', 'Preservación de metadatos', 'Migración real'],
    },
  },

  // ============ MORE SAAS / WEBSITES / INTERNAL ============
  {
    slug: 'real-estate-cms',
    name: 'real-estate-cms',
    domain: 'ecommerce',
    status: 'production',
    year: '2024',
    client: { en: 'Real-estate developer', es: 'Desarrolladora inmobiliaria' },
    summary: {
      en: 'Headless-CMS marketing site for a real-estate developer.',
      es: 'Sitio marketing con CMS headless para desarrolladora inmobiliaria.',
    },
    description: {
      en: 'Next.js 15 + React 19 site backed by Payload CMS 3, PostgreSQL, Vercel Blob Storage for media. Resend for transactional email. Framer Motion micro-interactions.',
      es: 'Sitio Next.js 15 + React 19 con backend Payload CMS 3, PostgreSQL, Vercel Blob Storage para media. Resend para email transaccional. Micro-interacciones con Framer Motion.',
    },
    stack: ['Next.js 15', 'React 19', 'Payload CMS 3', 'PostgreSQL', 'Vercel Blob', 'Resend', 'Framer Motion', 'Tailwind 3'],
    highlights: {
      en: ['Headless CMS (Payload)', 'Vercel Blob media', 'Resend email'],
      es: ['CMS headless (Payload)', 'Media en Vercel Blob', 'Email con Resend'],
    },
  },
  {
    slug: 'marketing-builder-saas',
    name: 'marketing-builder-saas',
    domain: 'saas',
    status: 'mvp',
    year: '2024',
    client: { en: 'Marketing-tech SaaS', es: 'SaaS de marketing tech' },
    summary: {
      en: 'Marketing platform with visual page builder + AI.',
      es: 'Plataforma marketing con builder visual + IA.',
    },
    description: {
      en: 'Refine.dev + Supabase + Puck drag-drop builder + OpenAI content generation, React Quill rich text, i18n. End-to-end marketing site composition.',
      es: 'Refine.dev + Supabase + builder drag-drop Puck + generación de contenido OpenAI, editor React Quill, i18n. Composición end-to-end de sitios marketing.',
    },
    stack: ['React 18', 'Refine.dev', 'Supabase', 'Puck', 'OpenAI', 'React Quill', 'Tailwind'],
    highlights: {
      en: ['Drag-drop page builder', 'AI block content', 'Supabase backend'],
      es: ['Page builder drag-drop', 'Contenido IA por bloque', 'Backend Supabase'],
    },
  },
  {
    slug: 'internal-ai-tool',
    name: 'internal-ai-tool',
    domain: 'ai',
    status: 'production',
    year: '2024',
    client: { en: 'B2B internal AI tool', es: 'Herramienta IA B2B interna' },
    summary: {
      en: 'Internal AI tool integrated with Claude SDK.',
      es: 'Herramienta IA interna integrada con Claude SDK.',
    },
    description: {
      en: 'Next.js 14 + TypeScript app integrating Anthropic Claude SDK for internal workflows. Tailwind + CVA for component variants, date-fns-tz for timezone handling.',
      es: 'App Next.js 14 + TypeScript integrando Anthropic Claude SDK para workflows internos. Tailwind + CVA para variantes de componente, date-fns-tz para zonas horarias.',
    },
    stack: ['Next.js 14', 'React 18', 'TypeScript', 'Anthropic SDK', 'Tailwind', 'CVA'],
    highlights: {
      en: ['Claude SDK integration', 'Internal workflow automation'],
      es: ['Integración Claude SDK', 'Automatización workflows internos'],
    },
  },
  {
    slug: 'b2b-calculator',
    name: 'b2b-calculator',
    domain: 'enterprise',
    status: 'production',
    year: '2023',
    client: { en: 'B2B calculations SaaS', es: 'SaaS de cálculos B2B' },
    summary: {
      en: 'Calculation app with PDF/Excel exports.',
      es: 'App de cálculos con exportación PDF/Excel.',
    },
    description: {
      en: 'Frontend (React + Bootstrap + DataTables) + backend with JWT auth. Domain-specific calculations with PDF and tabular exports.',
      es: 'Frontend (React + Bootstrap + DataTables) + backend con JWT. Cálculos de dominio específico con exportación PDF y tabular.',
    },
    stack: ['React 18', 'Bootstrap 5', 'DataTables.net', 'JWT', 'Express'],
    highlights: { en: ['Front + back monorepo', 'PDF + tabular exports'], es: ['Monorepo front + back', 'Exportación PDF + tabular'] },
  },
  {
    slug: 'business-directory',
    name: 'business-directory',
    domain: 'saas',
    status: 'production',
    year: '2023',
    client: { en: 'B2B directory platform', es: 'Plataforma directorio B2B' },
    summary: {
      en: 'Business directory with search, filters, i18n.',
      es: 'Directorio empresarial con búsqueda, filtros, i18n.',
    },
    description: {
      en: 'React 18 + Vite frontend with Supabase backend, TanStack Query, React Hook Form + Yup validation, multilingual. Node/Express API with Vercel Postgres, rate limiting.',
      es: 'Frontend React 18 + Vite con backend Supabase, TanStack Query, React Hook Form + Yup, multilingüe. API Node/Express con Vercel Postgres, rate limiting.',
    },
    stack: ['React 18', 'Vite', 'Supabase', 'TanStack Query', 'Express', 'Vercel Postgres', 'i18n'],
    highlights: { en: ['Multi-language', 'Supabase backend', 'Form validation with Yup'], es: ['Multi-idioma', 'Backend Supabase', 'Validación con Yup'] },
  },
  {
    slug: 'supply-chain-backend',
    name: 'supply-chain-backend',
    domain: 'enterprise',
    status: 'production',
    year: '2023',
    client: { en: 'Internal supply-chain ops', es: 'Operaciones supply-chain internas' },
    summary: {
      en: 'Supply-chain management backend (Vercel Postgres).',
      es: 'Backend de supply-chain (Vercel Postgres).',
    },
    description: {
      en: 'Node/Express backend on Vercel Postgres with JWT auth, rate limiting, internal-tool integrations.',
      es: 'Backend Node/Express sobre Vercel Postgres con auth JWT, rate limiting, integraciones internas.',
    },
    stack: ['Express', 'Vercel Postgres', 'JWT', 'Rate Limit'],
    highlights: { en: ['Internal supply-chain ops', 'Rate-limited API'], es: ['Operaciones supply-chain', 'API con rate limiting'] },
  },
  {
    slug: 'hipaa-marketing-site',
    name: 'hipaa-marketing-site',
    domain: 'healthcare',
    status: 'production',
    year: '2024',
    client: { en: 'HIPAA SaaS marketing site', es: 'Sitio marketing del SaaS HIPAA' },
    summary: {
      en: 'Marketing landing for the HIPAA-Wizard product.',
      es: 'Landing marketing del producto HIPAA-Wizard.',
    },
    description: {
      en: 'React 18 + Vite + Tailwind landing with react-slick carousel, react-router. Sits in front of the HIPAA-Wizard product family.',
      es: 'Landing React 18 + Vite + Tailwind con carrusel react-slick, react-router. Frente del producto HIPAA-Wizard.',
    },
    stack: ['React 18', 'Vite', 'TypeScript', 'Tailwind', 'react-slick', 'React Router'],
    highlights: { en: ['Marketing landing for HIPAA SaaS', 'Carousel + router'], es: ['Landing del SaaS HIPAA', 'Carrusel + router'] },
  },
  {
    slug: 'hipaa-navigation-ui',
    name: 'hipaa-navigation-ui',
    domain: 'healthcare',
    status: 'mvp',
    year: '2024',
    client: { en: 'Compliance UI iteration', es: 'Iteración de UI compliance' },
    summary: {
      en: 'Modern HIPAA-compliance navigation UI (Chakra + Framer).',
      es: 'UI moderna de navegación compliance HIPAA (Chakra + Framer).',
    },
    description: {
      en: 'React 18 + TypeScript + Vite + Chakra UI + Framer Motion + Tailwind. Iteration on the HIPAA navigation UX with smoother transitions.',
      es: 'React 18 + TypeScript + Vite + Chakra UI + Framer Motion + Tailwind. Iteración del UX de navegación HIPAA con transiciones más fluidas.',
    },
    stack: ['React 18', 'TypeScript', 'Vite', 'Chakra UI', 'Framer Motion', 'Tailwind'],
    highlights: { en: ['Chakra + Framer Motion', 'Compliance-focused UX'], es: ['Chakra + Framer Motion', 'UX enfocado a compliance'] },
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getProjectsByDomain(domain: string): Project[] {
  return PROJECTS.filter((p) => p.domain === domain);
}
