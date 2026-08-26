import { getRobotsTxt, SITE_ORIGIN } from '$lib/config/indexing';

export const prerender = true;

export async function GET() {
	return new Response(getRobotsTxt(`${SITE_ORIGIN}/sitemap.xml`), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
}
