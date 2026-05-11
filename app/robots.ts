import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: 'https://oscar.iqsit.com/sitemap.xml',
    host: 'https://oscar.iqsit.com',
  };
}
