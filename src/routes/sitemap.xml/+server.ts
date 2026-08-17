import { getAllActiveTools, getActiveCategories, getCategorySlug, BASE_URL } from '$lib/config/tools';

// Keep in sync with static/robots.txt Disallow and X-Robots-Tag noindex pages
const NOINDEX_PATHS = new Set(['/break/ambient', '/break/zen-motion', '/break/clock']);

export async function GET() {
	const tools = getAllActiveTools().filter((tool) => !NOINDEX_PATHS.has(tool.href));
	const categories = getActiveCategories();

	// Static info/trust pages (good signals for search + ad review)
	const staticPages = ['/about', '/privacy', '/contact', '/editorial-policy'];

	const urls = [
		// Homepage
		`<url>
    <loc>${BASE_URL}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
		// Category hub pages
		...categories.map(category => `<url>
    <loc>${BASE_URL}/${getCategorySlug(category)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`),
		// All active tools
		...tools.map(tool => `<url>
    <loc>${BASE_URL}${tool.href}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`),
		// Info / trust pages
		...staticPages.map(path => `<url>
    <loc>${BASE_URL}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`)
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
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
