import { SITE_ORIGIN, getSitemapEntries } from '$lib/config/indexing';

export async function GET() {
	const urls = getSitemapEntries().map(
		(entry) => `<url>
    <loc>${entry.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${entry.path}`}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
	);

	const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:news="http://www.sitemaps.org/schemas/sitemap-news/0.9"
  xmlns:image="http://www.sitemaps.org/schemas/sitemap-image/1.1"
  xmlns:video="http://www.sitemaps.org/schemas/sitemap-video/1.1"
>
  ${urls.join('\n  ')}
</urlset>`;

	return new Response(sitemap.trim(), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
