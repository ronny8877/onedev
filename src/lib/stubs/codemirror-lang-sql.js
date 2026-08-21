// Used only when Wrangler bundles the Cloudflare Worker.
// SQL highlighting loads in the browser from the real @codemirror/lang-sql package.
export function sql() {
	return [];
}

export const PostgreSQL = {};
export const MySQL = {};
export const MariaSQL = {};
export const SQLite = {};
export const MSSQL = {};
export const StandardSQL = {};
