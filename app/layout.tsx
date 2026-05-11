import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_URL = 'https://oscar.iqsit.com';

export const viewport: Viewport = {
  themeColor: '#0a0e14',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Oscar Ramírez · Full Stack & DevOps Engineer · AI / SaaS',
    template: '%s · oscar.iqsit.com',
  },
  description:
    'Full-stack & DevOps engineer building AI-powered SaaS for regulated industries — fiscal, legal, healthcare, govtech. 20+ years shipping production code.',
  keywords: [
    'Oscar Ramírez',
    'Full Stack Developer',
    'DevOps Engineer',
    'AI Engineer',
    'SaaS Architect',
    'Fractional CTO',
    'Mexico',
    'Veracruz',
    'Next.js',
    'FastAPI',
    'RAG',
    'OpenAI',
    'Claude',
    'FHIR',
    'HL7',
    'SAT CFDI',
    'Vertical SaaS',
    'Regulated Industries',
  ],
  authors: [{ name: 'Oscar Ramírez de Arellano', url: SITE_URL }],
  creator: 'Oscar Ramírez de Arellano',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Oscar Ramírez — Building AI SaaS for regulated industries',
    description:
      'Full-stack engineer · 20+ years · AI integration, vertical SaaS, EMR/FHIR, Mexican fiscal stack. Interactive terminal portfolio.',
    type: 'website',
    url: SITE_URL,
    siteName: 'oscar.iqsit.com',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oscar Ramírez — AI SaaS for regulated industries',
    description: 'Full-stack engineer · 20+ years · Interactive terminal portfolio.',
    creator: '@OscarRamirezAr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="tokyo-night">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
