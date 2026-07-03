import { MetadataRoute } from 'next';
import { PACKAGES, DESTINATIONS } from '@/constants/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vistaluxe-travel.com';

  const staticUrls = [
    '',
    '/destinations',
    '/packages',
    '/services',
    '/about',
    '/contact',
    '/booking',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const packageUrls = PACKAGES.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const destinationUrls = DESTINATIONS.map((dest) => ({
    url: `${baseUrl}/destinations?country=${dest.country}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...packageUrls, ...destinationUrls];
}
