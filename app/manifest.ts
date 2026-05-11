import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Oscar Ramírez — Portfolio',
    short_name: 'oscar.iqsit',
    description:
      'Full Stack & DevOps Engineer · AI / Vertical SaaS · Interactive terminal portfolio.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0e14',
    theme_color: '#0a0e14',
    orientation: 'any',
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
    ],
  };
}
