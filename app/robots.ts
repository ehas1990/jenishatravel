import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vistaluxe-travel.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/booking/confirmation', // Disallow checkout success screens
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
