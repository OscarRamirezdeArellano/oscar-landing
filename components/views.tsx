'use client';

import React from 'react';
import type { Project, SkillGroup, ExperienceItem, Lang } from '@/lib/types';
import { SERVICES, ENGAGEMENT_MODELS } from '@/lib/data/services';
import { StaggerReveal } from './Loaders';

const STATUS_COLOR: Record<string, string> = {
  production: 'c-green',
  mvp: 'c-cyan',
  demo: 'c-yellow',
  archived: 'c-dim',
};

const DOMAIN_LABEL: Record<string, { en: string; es: string }> = {
  ai: { en: 'AI / RAG', es: 'IA / RAG' },
  healthcare: { en: 'Healthcare', es: 'Salud' },
  fiscal: { en: 'Fiscal (MX)', es: 'Fiscal (MX)' },
  legal: { en: 'Legal', es: 'Legal' },
  govtech: { en: 'GovTech', es: 'GovTech' },
  voice: { en: 'Voice', es: 'Voz' },
  logistics: { en: 'Logistics', es: 'Logística' },
  saas: { en: 'SaaS / Builder', es: 'SaaS / Builder' },
  enterprise: { en: 'Enterprise', es: 'Enterprise' },
  ecommerce: { en: 'E-commerce', es: 'E-commerce' },
  identity: { en: 'Identity', es: 'Identidad' },
};

export function ProjectView({ project, lang }: { project: Project; lang: Lang }) {
  return (
    <div className="fade-in">
      <StaggerReveal delayMs={120}>
        <div className="heading">{project.name}</div>
        <div style={{ marginLeft: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <span className="c-dim">{lang === 'en' ? 'summary' : 'resumen'}: </span>
            <span className="c-bright">{project.summary[lang]}</span>
          </div>
          <div className="box">
            <StaggerReveal delayMs={140} startDelayMs={150}>
              <div>
                <span className="c-dim">{lang === 'en' ? 'client' : 'cliente'}: </span>
                <span className="c-cyan">{project.client[lang]}</span>
                {'   '}
                <span className="c-dim">{lang === 'en' ? 'year' : 'año'}: </span>
                <span className="c-yellow">{project.year}</span>
                {'   '}
                <span className="c-dim">{lang === 'en' ? 'status' : 'estado'}: </span>
                <span className={STATUS_COLOR[project.status]}>● {project.status}</span>
                {'   '}
                <span className="c-dim">{lang === 'en' ? 'domain' : 'dominio'}: </span>
                <span className="c-purple">{DOMAIN_LABEL[project.domain][lang]}</span>
              </div>
              <div className="c-fg" style={{ marginTop: 6 }}>{project.description[lang]}</div>
              <div style={{ marginTop: 10 }}>
                <div className="subheading">{lang === 'en' ? 'highlights' : 'lo destacado'}</div>
                <StaggerReveal delayMs={70} startDelayMs={120}>
                  {project.highlights[lang].map((h, i) => (
                    <div key={i} className="bullet"><span>{h}</span></div>
                  ))}
                </StaggerReveal>
              </div>
              <div style={{ marginTop: 10 }}>
                <div className="subheading">stack</div>
                <StaggerReveal delayMs={35} startDelayMs={100}>
                  {project.stack.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </StaggerReveal>
              </div>
            </StaggerReveal>
          </div>
        </div>
      </StaggerReveal>
    </div>
  );
}

export function ProjectList({ projects, lang }: { projects: Project[]; lang: Lang }) {
  const byDomain: Record<string, Project[]> = {};
  for (const p of projects) {
    (byDomain[p.domain] ??= []).push(p);
  }
  const order = ['fiscal', 'legal', 'ai', 'healthcare', 'voice', 'govtech', 'logistics', 'enterprise', 'saas', 'ecommerce', 'identity'];

  return (
    <div className="fade-in">
      <div className="heading">{lang === 'en' ? 'Selected Work' : 'Trabajo Seleccionado'}</div>
      <div className="c-dim" style={{ marginBottom: 4, marginLeft: 12, fontSize: 13 }}>
        {projects.length}{' '}
        {lang === 'en'
          ? 'curated projects — many are clusters of 4–7 repos each.'
          : 'proyectos curados — muchos son clusters de 4-7 repos cada uno.'}
      </div>
      <div className="c-dim" style={{ marginBottom: 8, marginLeft: 12, fontSize: 13 }}>
        {lang === 'en' ? 'Tip: ' : 'Tip: '}
        <span className="c-accent">cat projects/&lt;name&gt;</span>{' '}
        {lang === 'en' ? 'to dive into a project · ' : 'para entrar a un proyecto · '}
        <span className="c-accent">repos</span>{' '}
        {lang === 'en' ? 'for the 80+ repo breakdown by industry.' : 'para el desglose de los 80+ repos por industria.'}
      </div>
      <StaggerReveal delayMs={120}>
        {order.map((d) => {
          const items = byDomain[d];
          if (!items || items.length === 0) return null;
          return (
            <div key={d} style={{ marginLeft: 12, marginTop: 10 }}>
              <div className="subheading">▸ {DOMAIN_LABEL[d][lang]}</div>
              {items.map((p) => (
                <div key={p.slug} style={{ marginLeft: 16, marginBottom: 4 }}>
                  <span className={STATUS_COLOR[p.status]}>●</span>{' '}
                  <span className="c-accent" style={{ minWidth: 24, display: 'inline-block' }}>
                    {p.name}
                  </span>
                  <span className="c-dim">  —  </span>
                  <span className="c-fg">{p.summary[lang]}</span>
                </div>
              ))}
            </div>
          );
        }).filter(Boolean)}
      </StaggerReveal>
    </div>
  );
}

export function SkillsView({ groups, lang }: { groups: SkillGroup[]; lang: Lang }) {
  return (
    <div className="fade-in">
      <div className="heading">{lang === 'en' ? 'Tech Stack' : 'Stack Técnico'}</div>
      <StaggerReveal delayMs={90}>
        {groups.map((g) => (
          <div key={g.slug} style={{ marginLeft: 12, marginBottom: 8 }}>
            <div className="subheading">▸ {g.name[lang]}</div>
            <div style={{ marginLeft: 16 }}>
              {g.items.map((item) => (
                <span key={item} className="tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </StaggerReveal>
    </div>
  );
}

export function SkillGroupView({ group, lang }: { group: SkillGroup; lang: Lang }) {
  return (
    <div className="fade-in">
      <div className="heading">{group.name[lang]}</div>
      <div style={{ marginLeft: 12 }}>
        {group.items.map((item) => (
          <span key={item} className="tag">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ExperienceView({ items, lang }: { items: ExperienceItem[]; lang: Lang }) {
  return (
    <div className="fade-in">
      <div className="heading">{lang === 'en' ? 'Professional Experience' : 'Experiencia Profesional'}</div>
      <StaggerReveal delayMs={180}>
        {items.map((e, i) => (
          <div key={i} className="box" style={{ marginLeft: 12 }}>
            <div className="subheading">{e.role[lang]}</div>
            <div className="c-yellow">{e.company}</div>
            <div className="c-dim" style={{ marginBottom: 6 }}>{e.period}</div>
            <div className="c-fg" style={{ marginBottom: 8 }}>{e.description[lang]}</div>
            <div>
              {e.stack.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </StaggerReveal>
    </div>
  );
}

export function AboutView({ lang }: { lang: Lang }) {
  return (
    <div className="fade-in">
      <StaggerReveal delayMs={140}>
        <div className="heading">{lang === 'en' ? 'About' : 'Acerca de mí'}</div>
        <div className="box" style={{ marginLeft: 12 }}>
          <StaggerReveal delayMs={160} startDelayMs={80}>
            <div style={{ fontSize: 15 }}>
              <span className="c-bright" style={{ fontWeight: 600 }}>Oscar Ramírez de Arellano Castellanos</span>
            </div>
            <div className="c-cyan">
              {lang === 'en'
                ? 'Full Stack & DevOps Engineer · AI Integration & Vertical SaaS Architect'
                : 'Ingeniero Full Stack & DevOps · Arquitecto SaaS Vertical & Integración IA'}
            </div>
            <div className="c-fg" style={{ marginTop: 6 }}>
              {lang === 'en' ? (
                <>
                  I build <span className="c-accent">production systems</span> for regulated industries —
                  fiscal/tax, legal, healthcare, government. Last 3 years focused on{' '}
                  <span className="c-accent">AI integration</span> and{' '}
                  <span className="c-accent">vertical SaaS</span>.
                </>
              ) : (
                <>
                  Construyo <span className="c-accent">sistemas en producción</span> para industrias reguladas —
                  fiscal, legal, salud, gobierno. Últimos 3 años enfocados en{' '}
                  <span className="c-accent">integración de IA</span> y{' '}
                  <span className="c-accent">SaaS vertical</span>.
                </>
              )}
            </div>
            <div className="c-fg" style={{ marginTop: 8 }}>
              {lang === 'en'
                ? 'I take products from zero to MVP in days, then scale them: multi-tenant auth, RAG pipelines, document AI, EMR/FHIR, Mexican fiscal stack (SAT, CFDI 4.0, FIEL).'
                : 'Llevo productos de cero a MVP en días, luego los escalo: auth multi-tenant, pipelines RAG, document AI, EMR/FHIR, stack fiscal mexicano (SAT, CFDI 4.0, FIEL).'}
            </div>
            <div className="c-dim" style={{ marginTop: 10 }}>
              {lang === 'en'
                ? 'Comfortable as solo contributor, tech lead, or fractional CTO. Builder mindset, pragmatic engineering, monetization-first.'
                : 'Cómodo como colaborador individual, tech lead o CTO fraccional. Mentalidad de builder, ingeniería pragmática, enfoque en monetización.'}
            </div>
          </StaggerReveal>
        </div>
      </StaggerReveal>
    </div>
  );
}

export function ServicesView({ lang }: { lang: Lang }) {
  return (
    <div className="fade-in">
      <div className="heading">{lang === 'en' ? 'What I build' : 'Lo que construyo'}</div>

      <div style={{ marginLeft: 12, marginBottom: 4 }}>
        <div className="c-fg" style={{ fontSize: 13.5, marginBottom: 6 }}>
          {lang === 'en'
            ? 'Areas I work in most often — not a closed catalog. If you have a clear problem, I can build the solution. If you have a problem but no clear solution, that\'s what Advisory & Fractional CTO engagements exist for.'
            : 'Áreas en las que trabajo más seguido — no es un catálogo cerrado. Si tienes un problema claro, construyo la solución. Si tienes un problema pero no tienes clara la solución, para eso existen los engagements de Advisory y CTO fraccional.'}
        </div>
        <div className="c-dim" style={{ fontSize: 12.5, marginBottom: 10 }}>
          {lang === 'en' ? 'Tip: ' : 'Tip: '}
          <span className="c-accent">cat services/&lt;name&gt;</span>
          {lang === 'en' ? ' for the full breakdown (scope, stack, real example).' : ' para detalle completo (alcance, stack, ejemplo real).'}
        </div>
      </div>

      <div style={{ marginLeft: 12, marginBottom: 14 }}>
        <div className="subheading">{lang === 'en' ? '▸ Common workstreams' : '▸ Áreas de trabajo comunes'}</div>
        <StaggerReveal delayMs={70}>
          {SERVICES.map((s) => (
            <div key={s.slug} style={{ marginLeft: 16, marginBottom: 4 }}>
              <span className="c-accent" style={{ minWidth: 200, display: 'inline-block' }}>{s.slug}</span>
              <span className="c-dim">  —  </span>
              <span className="c-fg">{s.title[lang]}</span>
            </div>
          ))}
        </StaggerReveal>
      </div>

      <div style={{ marginLeft: 12, marginBottom: 14 }}>
        <div className="subheading">{lang === 'en' ? '▸ How I work — engagement models' : '▸ Cómo trabajo — modelos de engagement'}</div>
        <StaggerReveal delayMs={90} startDelayMs={SERVICES.length * 70}>
          {ENGAGEMENT_MODELS.map((e) => (
            <div key={e.slug} style={{ marginLeft: 16, marginBottom: 4 }}>
              <span className="c-accent" style={{ minWidth: 200, display: 'inline-block' }}>{e.slug}</span>
              <span className="c-dim">  —  </span>
              <span className="c-fg">{e.title[lang]}</span>
              <div className="c-dim" style={{ marginLeft: 220, fontSize: 12.5 }}>
                {e.description[lang]}
              </div>
            </div>
          ))}
        </StaggerReveal>
      </div>

      <div className="box" style={{ marginLeft: 12 }}>
        <div className="c-yellow" style={{ marginBottom: 4, fontWeight: 600 }}>
          {lang === 'en' ? "▸ Don't see what you need?" : '▸ ¿No ves lo que necesitas?'}
        </div>
        <div className="c-fg" style={{ fontSize: 13 }}>
          {lang === 'en'
            ? 'The list above is what I do most often, not the only things I do. With 20+ years across many stacks I can build pretty much anything — and if the path isn\'t obvious yet, that\'s what '
            : 'Lo de arriba es lo que más hago, no lo único. Con 20+ años en muchos stacks puedo construir prácticamente cualquier cosa — y si el camino aún no es claro, para eso está '}
          <span className="c-accent">advisory</span>
          {lang === 'en' ? ' and ' : ' y '}
          <span className="c-accent">fractional-cto</span>
          {lang === 'en' ? '.' : '.'}
        </div>
        <div className="c-dim" style={{ marginTop: 8, fontSize: 13 }}>
          {lang === 'en' ? 'Just describe the problem — ' : 'Solo describe el problema — '}
          <span className="c-accent">contact</span>
          {lang === 'en' ? ' or ' : ' o '}
          <a href="mailto:oscar@iqsit.com?subject=Project%20inquiry">oscar@iqsit.com</a>
        </div>
      </div>
    </div>
  );
}

export function ServiceDetailView({ service, lang }: { service: import('@/lib/data/services').Service; lang: Lang }) {
  return (
    <div className="fade-in">
      <StaggerReveal delayMs={120}>
        <div className="heading">{service.title[lang]}</div>
        <div className="box" style={{ marginLeft: 12 }}>
          <StaggerReveal delayMs={140} startDelayMs={100}>
            <div>
              <span className="c-dim" style={{ minWidth: 80, display: 'inline-block' }}>{lang === 'en' ? 'for:' : 'para:'}</span>
              <span className="c-fg">{service.forWhom[lang]}</span>
            </div>
            <div style={{ marginTop: 6 }}>
              <div className="c-dim" style={{ marginBottom: 2 }}>{lang === 'en' ? 'includes:' : 'incluye:'}</div>
              <StaggerReveal delayMs={50} startDelayMs={50}>
                {service.includes[lang].map((item, i) => (
                  <div key={i} className="bullet" style={{ marginLeft: 4 }}>
                    <span className="c-fg">{item}</span>
                  </div>
                ))}
              </StaggerReveal>
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="c-dim" style={{ minWidth: 80, display: 'inline-block' }}>{lang === 'en' ? 'stack:' : 'stack:'}</span>
              {service.stack.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="c-dim" style={{ minWidth: 80, display: 'inline-block' }}>{lang === 'en' ? 'example:' : 'ejemplo:'}</span>
              <span className="c-yellow" style={{ fontStyle: 'italic' }}>{service.example[lang]}</span>
            </div>
          </StaggerReveal>
        </div>
        <div className="c-dim" style={{ marginLeft: 12, marginTop: 8, fontSize: 12.5 }}>
          {lang === 'en' ? 'Interested? Type ' : '¿Te interesa? Teclea '}
          <span className="c-accent">contact</span>
          {lang === 'en' ? ' or email ' : ' o escribe a '}
          <a href="mailto:oscar@iqsit.com?subject=Service%20inquiry">oscar@iqsit.com</a>
        </div>
      </StaggerReveal>
    </div>
  );
}

export function ContactView({ lang }: { lang: Lang }) {
  return (
    <div className="fade-in">
      <div className="heading">{lang === 'en' ? "Let's talk" : 'Hablemos'}</div>
      <div className="box" style={{ marginLeft: 12 }}>
        <StaggerReveal delayMs={130}>
        <div className="bullet">
          <span>
            <span className="c-yellow" style={{ fontWeight: 600 }}>{lang === 'en' ? '✉ Quickest: ' : '✉ Lo más rápido: '}</span>
            <span className="c-dim">{lang === 'en' ? 'type ' : 'teclea '}</span>
            <span className="c-accent">compose</span>
            <span className="c-dim">{lang === 'en' ? ' for an inline form (no email client needed)' : ' para un formulario inline (sin abrir email)'}</span>
          </span>
        </div>
        <div className="bullet">
          <span>
            <span className="c-accent">{lang === 'en' ? 'Hire me for a project' : 'Contrátame para un proyecto'}</span>
            <span className="c-dim"> → </span>
            <a href="mailto:oscar@iqsit.com?subject=Project%20inquiry%20via%20oscar.iqsit.com">oscar@iqsit.com</a>
          </span>
        </div>
        <div className="bullet">
          <span>
            <span className="c-accent">{lang === 'en' ? 'Available for full-time work' : 'Disponible para trabajo full-time'}</span>
            <span className="c-dim"> → </span>
            <a href="mailto:oscar@iqsit.com?subject=Job%20opportunity%20via%20oscar.iqsit.com">oscar@iqsit.com</a>
          </span>
        </div>
        <div className="bullet">
          <span>
            <span className="c-accent">LinkedIn</span>
            <span className="c-dim"> → </span>
            <a href="https://linkedin.com/in/ordac" target="_blank" rel="noreferrer">
              linkedin.com/in/ordac
            </a>
          </span>
        </div>
        <div className="bullet">
          <span>
            <span className="c-accent">GitHub</span>
            <span className="c-dim"> → </span>
            <a href="https://github.com/OscarRamirezdeArellano" target="_blank" rel="noreferrer">
              github.com/OscarRamirezdeArellano
            </a>
          </span>
        </div>
        <div className="bullet">
          <span>
            <span className="c-accent">{lang === 'en' ? 'Download CV' : 'Descargar CV'}</span>
            <span className="c-dim"> → </span>
            <span className="c-dim">{lang === 'en' ? "type" : "teclea"} </span>
            <span className="c-yellow">cv en</span>
            <span className="c-dim"> {lang === 'en' ? 'or' : 'o'} </span>
            <span className="c-yellow">cv es</span>
          </span>
        </div>
        </StaggerReveal>
      </div>
    </div>
  );
}

const NEOFETCH_LOGO = String.raw`
       .--.
      |o_o |    oscar@iqsit
      |:_/ |    ─────────────────
     //   \ \   role:     Full Stack & DevOps Engineer
    (|     | )  location: Veracruz, MX
   /'\_   _/'\\ exp:      20+ years
   \___)=(___/  focus:    AI integration · Vertical SaaS
                stack:    Next.js · FastAPI · Anthropic
                avail:    hiring / projects
`;

export function NeofetchView({ lang }: { lang: Lang }) {
  return (
    <div className="fade-in">
      <StaggerReveal delayMs={70}>
        <pre
          style={{
            color: 'var(--accent)',
            fontSize: 'clamp(9px, 1vw, 12px)',
            lineHeight: 1.3,
            fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
            fontFeatureSettings: '"liga" 0',
            whiteSpace: 'pre',
            overflowX: 'auto',
            textShadow: '0 0 12px color-mix(in srgb, var(--accent) 35%, transparent)',
          }}
        >
          {NEOFETCH_LOGO}
        </pre>
        <div style={{ marginLeft: 12, marginTop: 6 }} className="c-dim">
          {lang === 'en' ? "type 'help' for commands · 'tour' for guided tour" : "teclea 'help' para comandos · 'tour' para tour guiado"}
        </div>
      </StaggerReveal>
    </div>
  );
}
