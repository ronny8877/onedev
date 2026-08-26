import type { Handle } from '@sveltejs/kit';
import { shouldNoindex } from '$lib/config/indexing';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	const path = event.url.pathname;
	if (path === '/sitemap.xml' || path === '/robots.txt') {
		return response;
	}
	if (shouldNoindex(path)) {
		response.headers.set('X-Robots-Tag', 'noindex, follow');
	}
	return response;
};
