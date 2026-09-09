// Used only when Wrangler bundles the Cloudflare Worker.
// Formatting runs in the browser via the real sql-formatter package.
/** @param {unknown} query */
export function format(query) {
	return typeof query === 'string' ? query : '';
}
