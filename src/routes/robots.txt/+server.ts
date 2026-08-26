import { BASE_URL } from '$lib/config/tools';
import { getRobotsTxt } from '$lib/config/indexing';

export const prerender = true;

export async function GET() {
	return new Response(getRobotsTxt(`${BASE_URL}/sitemap.xml`), {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'max-age=3600'
		}
	});
}
