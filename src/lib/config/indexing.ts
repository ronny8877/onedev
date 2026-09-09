import { SITE_ORIGIN } from '$lib/config/site';

export { SITE_ORIGIN };

export const INDEXABLE_TOOLS = [
	'/json/formatter',
	'/jwt/decoder',
	'/regex/tester',
	'/base64/encode-decode',
	'/date/timestamp',
	'/id/uuid-generator',
	'/sql/formatter',
	'/cron/explainer',
	'/yaml/to-json',
	'/csv/to-json',
	'/xml/to-json',
	'/qr/generator',
	'/pdf/compress',
	'/hash/generator',
	'/url/encode-decode',
	'/ai/token-visualizer',
	'/ai/context-estimator',
	'/hash/compare',
	'/jwt/size',
	'/html/dom-visualizer'
] as const;

export type IndexableToolPath = (typeof INDEXABLE_TOOLS)[number];

export const INDEXABLE_TRUST_PAGES = [
	'/about',
	'/privacy',
	'/contact',
	'/editorial-policy',
	'/mcp'
] as const;

export const INDEXABLE_CONTENT_LAST_UPDATED = '2026-08-27';

const HASH_CANONICAL = '/hash/generator';
const JWT_CANONICAL = '/jwt/decoder';

export const HASH_FOLD_EXCEPTIONS = ['/hash/compare'] as const;
export const JWT_FOLD_EXCEPTIONS = ['/jwt/size'] as const;

const HASH_SELF_CANONICAL = new Set<string>([HASH_CANONICAL, ...HASH_FOLD_EXCEPTIONS]);
const JWT_SELF_CANONICAL = new Set<string>([JWT_CANONICAL, ...JWT_FOLD_EXCEPTIONS]);

export const ROBOTS_DISALLOW_PATHS = ['/api/', '/_app/', '/break'] as const;

const INDEXABLE_TOOL_SET = new Set<string>(INDEXABLE_TOOLS);
const INDEXABLE_TRUST_SET = new Set<string>(INDEXABLE_TRUST_PAGES);

export function normalizePath(pathname: string): string {
	if (!pathname) return '/';
	const noQuery = pathname.split('?')[0].split('#')[0];
	if (noQuery === '/') return '/';
	return noQuery.replace(/\/+$/, '') || '/';
}

export function getIndexableCategorySlugs(): string[] {
	const slugs = new Set<string>();
	for (const href of INDEXABLE_TOOLS) {
		const seg = href.split('/')[1];
		if (seg) slugs.add(seg);
	}
	return [...slugs].sort();
}

const INDEXABLE_CATEGORY_SET = new Set(getIndexableCategorySlugs());

export function isIndexableTool(pathname: string): boolean {
	return INDEXABLE_TOOL_SET.has(normalizePath(pathname));
}

export function isIndexableCategoryHub(pathname: string): boolean {
	const path = normalizePath(pathname);
	const parts = path.split('/').filter(Boolean);
	if (parts.length !== 1) return false;
	return INDEXABLE_CATEGORY_SET.has(parts[0]);
}

export function isIndexablePath(pathname: string): boolean {
	const path = normalizePath(pathname);
	if (path === '/') return true;
	if (INDEXABLE_TRUST_SET.has(path)) return true;
	if (INDEXABLE_TOOL_SET.has(path)) return true;
	if (isIndexableCategoryHub(path)) return true;
	return false;
}

export function shouldNoindex(pathname: string): boolean {
	return !isIndexablePath(pathname);
}

export function getCanonicalPath(pathname: string): string {
	const path = normalizePath(pathname);
	if (path.startsWith('/hash/')) {
		if (HASH_SELF_CANONICAL.has(path)) return path;
		return HASH_CANONICAL;
	}
	if (path.startsWith('/jwt/')) {
		if (JWT_SELF_CANONICAL.has(path)) return path;
		return JWT_CANONICAL;
	}
	return path;
}

export function isCanonicalFold(pathname: string): boolean {
	const path = normalizePath(pathname);
	return getCanonicalPath(path) !== path;
}

function absoluteUrl(path: string): string {
	if (path === '/') return `${SITE_ORIGIN}/`;
	return `${SITE_ORIGIN}${path}`;
}

export function getCanonicalUrl(_baseUrl: string, pathname: string): string {
	return getPageCanonicalUrl(pathname) ?? absoluteUrl(getCanonicalPath(pathname));
}

export function getPageCanonicalUrl(pathname: string): string | null {
	const path = normalizePath(pathname);
	if (isIndexablePath(path)) {
		return absoluteUrl(path);
	}
	const folded = getCanonicalPath(path);
	if (folded !== path) {
		return absoluteUrl(folded);
	}
	return null;
}

export function getLastUpdatedForPath(pathname: string, fallback?: string): string | undefined {
	if (isIndexableTool(pathname)) return INDEXABLE_CONTENT_LAST_UPDATED;
	return fallback;
}

export type SitemapEntry = {
	path: string;
	changefreq: 'weekly' | 'monthly';
	priority: string;
};

export function getSitemapEntries(): SitemapEntry[] {
	const entries: SitemapEntry[] = [{ path: '/', changefreq: 'weekly', priority: '1.0' }];
	for (const slug of getIndexableCategorySlugs()) {
		entries.push({ path: `/${slug}`, changefreq: 'weekly', priority: '0.7' });
	}
	for (const href of INDEXABLE_TOOLS) {
		entries.push({ path: href, changefreq: 'monthly', priority: '0.8' });
	}
	for (const path of INDEXABLE_TRUST_PAGES) {
		entries.push({ path, changefreq: 'monthly', priority: '0.5' });
	}
	return entries;
}

export function getIndexableAbsoluteUrls(baseUrl: string = SITE_ORIGIN): string[] {
	return getSitemapEntries().map((entry) =>
		entry.path === '/' ? `${baseUrl}/` : `${baseUrl}${entry.path}`
	);
}

export function getRobotsTxt(sitemapUrl: string = `${SITE_ORIGIN}/sitemap.xml`): string {
	const disallows = ROBOTS_DISALLOW_PATHS.map((p) => `Disallow: ${p}`).join('\n');
	return `# Robots.txt for OneDev Tools
# https://onedev.tools

# Google's ads crawler must be able to read public pages
User-agent: Mediapartners-Google
Allow: /

User-agent: *
Allow: /

# Block non-content paths and entertainment-only rest screens
${disallows}

Sitemap: ${sitemapUrl}
`;
}
