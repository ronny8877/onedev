/**
 * Client-side SQL helpers. Formatting uses sql-formatter in this tab.
 * Queries are never uploaded.
 */

import { format as formatSqlLib, type SqlLanguage } from 'sql-formatter';

export type SqlDialect =
	| 'postgresql'
	| 'mysql'
	| 'mariadb'
	| 'sqlite'
	| 'transactsql'
	| 'bigquery'
	| 'snowflake'
	| 'sql';

export function editorDialect(
	dialect: SqlDialect
): 'postgresql' | 'mysql' | 'mariadb' | 'sqlite' | 'transactsql' | 'standard' {
	if (
		dialect === 'postgresql' ||
		dialect === 'mysql' ||
		dialect === 'mariadb' ||
		dialect === 'sqlite' ||
		dialect === 'transactsql'
	) {
		return dialect;
	}
	return 'standard';
}

export const SQL_DIALECTS: { value: SqlDialect; label: string }[] = [
	{ value: 'postgresql', label: 'PostgreSQL' },
	{ value: 'mysql', label: 'MySQL' },
	{ value: 'mariadb', label: 'MariaDB' },
	{ value: 'sqlite', label: 'SQLite' },
	{ value: 'transactsql', label: 'SQL Server' },
	{ value: 'bigquery', label: 'BigQuery' },
	{ value: 'snowflake', label: 'Snowflake' },
	{ value: 'sql', label: 'Standard SQL' }
];

export interface SqlError {
	message: string;
	line?: number;
	column?: number;
}

export const SAMPLE_SQL = `select u.id,u.name,count(*) as order_count from users u left join orders o on o.user_id=u.id where u.created_at>='2024-01-01' and u.active=true group by u.id,u.name having count(*)>1 order by order_count desc limit 10;`;

export const SAMPLE_SQL_PRETTY = `SELECT
  u.id,
  u.name,
  COUNT(*) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at >= '2024-01-01'
  AND u.active = TRUE
GROUP BY u.id, u.name
HAVING COUNT(*) > 1
ORDER BY order_count DESC
LIMIT 10;`;

export type KeywordCase = 'preserve' | 'upper' | 'lower';

export interface FormatSqlOptions {
	dialect?: SqlDialect;
	tabWidth?: number;
	keywordCase?: KeywordCase;
	indentStyle?: 'standard' | 'tabularLeft';
}

function dialectToLanguage(dialect: SqlDialect): SqlLanguage {
	return dialect as SqlLanguage;
}

function lineCol(input: string, index: number): { line: number; column: number } {
	let line = 1;
	let column = 1;
	for (let i = 0; i < index && i < input.length; i++) {
		if (input[i] === '\n') {
			line++;
			column = 1;
		} else {
			column++;
		}
	}
	return { line, column };
}

function parseFormatterError(message: string, input: string): SqlError {
	const loc = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
	if (loc) {
		return { message: message.split('\n')[0] ?? message, line: Number(loc[1]), column: Number(loc[2]) };
	}
	const unexpected = message.match(/Unexpected "([^"]*)"/);
	if (unexpected?.[1]) {
		const idx = input.indexOf(unexpected[1]);
		if (idx >= 0) {
			const { line, column } = lineCol(input, idx);
			return { message: message.split('\n')[0] ?? message, line, column };
		}
	}
	return { message: message.split('\n')[0] ?? message };
}

export function formatSql(
	input: string,
	options: FormatSqlOptions = {}
): { ok: boolean; output: string; error: SqlError | null } {
	const trimmed = input.trim();
	if (!trimmed) {
		return { ok: true, output: '', error: null };
	}

	const dialect = options.dialect ?? 'postgresql';
	try {
		const output = formatSqlLib(trimmed, {
			language: dialectToLanguage(dialect),
			tabWidth: Number(options.tabWidth) || 2,
			keywordCase: options.keywordCase ?? 'upper',
			dataTypeCase: options.keywordCase === 'preserve' ? 'preserve' : options.keywordCase ?? 'upper',
			functionCase: options.keywordCase === 'preserve' ? 'preserve' : options.keywordCase ?? 'upper',
			indentStyle: options.indentStyle ?? 'standard',
			linesBetweenQueries: 1,
			expressionWidth: 60
		});
		return { ok: true, output: output + '\n', error: null };
	} catch (e) {
		return { ok: false, output: '', error: parseFormatterError((e as Error).message || 'Could not format SQL', trimmed) };
	}
}

type ScanKind = 'code' | 'string' | 'comment';

interface ScanPiece {
	kind: ScanKind;
	value: string;
}

/**
 * Split SQL into code, strings, and comments so minify/LIKE/explain
 * do not touch literals.
 */
export function scanSql(input: string): ScanPiece[] {
	const pieces: ScanPiece[] = [];
	let i = 0;
	let buf = '';
	const flush = (kind: ScanKind) => {
		if (buf) {
			pieces.push({ kind, value: buf });
			buf = '';
		}
	};

	while (i < input.length) {
		const c = input[i];
		const next = input[i + 1];

		if (c === '-' && next === '-') {
			flush('code');
			let j = i + 2;
			while (j < input.length && input[j] !== '\n') j++;
			if (j < input.length && input[j] === '\n') j++;
			pieces.push({ kind: 'comment', value: input.slice(i, j) });
			i = j;
			continue;
		}

		if (c === '/' && next === '*') {
			flush('code');
			let j = i + 2;
			while (j < input.length && !(input[j] === '*' && input[j + 1] === '/')) j++;
			j = Math.min(input.length, j + 2);
			pieces.push({ kind: 'comment', value: input.slice(i, j) });
			i = j;
			continue;
		}

		if (c === "'") {
			flush('code');
			let j = i + 1;
			while (j < input.length) {
				if (input[j] === "'" && input[j + 1] === "'") {
					j += 2;
					continue;
				}
				if (input[j] === '\\' && j + 1 < input.length) {
					j += 2;
					continue;
				}
				if (input[j] === "'") {
					j++;
					break;
				}
				j++;
			}
			pieces.push({ kind: 'string', value: input.slice(i, j) });
			i = j;
			continue;
		}

		if (c === '"') {
			flush('code');
			let j = i + 1;
			while (j < input.length) {
				if (input[j] === '"' && input[j + 1] === '"') {
					j += 2;
					continue;
				}
				if (input[j] === '"') {
					j++;
					break;
				}
				j++;
			}
			pieces.push({ kind: 'string', value: input.slice(i, j) });
			i = j;
			continue;
		}

		if (c === '`') {
			flush('code');
			let j = i + 1;
			while (j < input.length && input[j] !== '`') j++;
			if (j < input.length) j++;
			pieces.push({ kind: 'string', value: input.slice(i, j) });
			i = j;
			continue;
		}

		if (c === '[') {
			flush('code');
			let j = i + 1;
			while (j < input.length && input[j] !== ']') j++;
			if (j < input.length) j++;
			pieces.push({ kind: 'string', value: input.slice(i, j) });
			i = j;
			continue;
		}

		if (c === '$' && /[A-Za-z0-9_]*\$/.test(input.slice(i + 1, i + 64))) {
			const tagMatch = input.slice(i).match(/^(\$[A-Za-z0-9_]*\$)/);
			if (tagMatch) {
				flush('code');
				const tag = tagMatch[1];
				const end = input.indexOf(tag, i + tag.length);
				const j = end >= 0 ? end + tag.length : input.length;
				pieces.push({ kind: 'string', value: input.slice(i, j) });
				i = j;
				continue;
			}
		}

		buf += c;
		i++;
	}
	flush('code');
	return pieces;
}

export function minifySql(
	input: string,
	options: { stripComments?: boolean } = {}
): { ok: boolean; output: string; error: SqlError | null } {
	const trimmed = input.trim();
	if (!trimmed) {
		return { ok: true, output: '', error: null };
	}

	const balance = checkBalance(trimmed);
	if (!balance.ok) {
		return { ok: false, output: '', error: balance.error };
	}

	const stripComments = options.stripComments !== false;
	const pieces = scanSql(trimmed);
	let out = '';
	for (const piece of pieces) {
		if (piece.kind === 'comment') {
			if (!stripComments) out += piece.value.endsWith('\n') ? piece.value : piece.value + ' ';
			continue;
		}
		if (piece.kind === 'string') {
			out += piece.value;
			continue;
		}
		out += piece.value
			.replace(/\s+/g, ' ')
			.replace(/\s*,\s*/g, ', ')
			.replace(/\s*;\s*/g, '; ')
			.replace(/\s*\(\s*/g, '(')
			.replace(/\s*\)\s*/g, ')');
	}
	return { ok: true, output: out.trim().replace(/\s+;/g, ';') + (out.trim().endsWith(';') ? '\n' : '\n'), error: null };
}

export function checkBalance(input: string): { ok: boolean; error: SqlError | null } {
	const pieces = scanSql(input);
	let depth = 0;
	let lastOpen = 0;
	let pos = 0;
	for (const piece of pieces) {
		if (piece.kind !== 'code') {
			pos += piece.value.length;
			continue;
		}
		for (let i = 0; i < piece.value.length; i++) {
			const ch = piece.value[i];
			if (ch === '(') {
				if (depth === 0) lastOpen = pos + i;
				depth++;
			} else if (ch === ')') {
				depth--;
				if (depth < 0) {
					const { line, column } = lineCol(input, pos + i);
					return { ok: false, error: { message: 'Unmatched closing parenthesis.', line, column } };
				}
			}
		}
		pos += piece.value.length;
	}

	if (depth > 0) {
		const { line, column } = lineCol(input, lastOpen);
		return { ok: false, error: { message: 'Unclosed parenthesis.', line, column } };
	}

	const last = pieces[pieces.length - 1];
	if (last && last.kind === 'string' && !isClosedQuote(last.value)) {
		const idx = input.length - last.value.length;
		const { line, column } = lineCol(input, idx);
		return { ok: false, error: { message: 'Unclosed quoted string or identifier.', line, column } };
	}
	if (last && last.kind === 'comment' && last.value.startsWith('/*') && !last.value.includes('*/')) {
		const idx = input.lastIndexOf('/*');
		const { line, column } = lineCol(input, idx);
		return { ok: false, error: { message: 'Unclosed block comment.', line, column } };
	}

	return { ok: true, error: null };
}

function isClosedQuote(value: string): boolean {
	if (value.startsWith("'")) return value.length >= 2 && value.endsWith("'");
	if (value.startsWith('"')) return value.length >= 2 && value.endsWith('"');
	if (value.startsWith('`')) return value.length >= 2 && value.endsWith('`');
	if (value.startsWith('[')) return value.endsWith(']');
	if (value.startsWith('$')) {
		const tag = value.match(/^(\$[A-Za-z0-9_]*\$)/);
		if (!tag) return false;
		return value.length > tag[1].length * 2 && value.endsWith(tag[1]);
	}
	return true;
}

export interface SqlStats {
	statements: number;
	lines: number;
	comments: number;
	tables: string[];
	joins: number;
	selects: number;
}

export function sqlStats(input: string): SqlStats {
	const pieces = scanSql(input);
	const code = pieces
		.filter((p) => p.kind === 'code')
		.map((p) => p.value)
		.join(' ')
		.replace(/\s+/g, ' ');
	const comments = pieces.filter((p) => p.kind === 'comment').length;
	const statements = code
		.split(';')
		.map((s) => s.trim())
		.filter(Boolean).length;
	const tables = uniqueKeepOrder(extractTables(code));
	const joins = (code.match(/\bJOIN\b/gi) || []).length;
	const selects = (code.match(/\bSELECT\b/gi) || []).length;
	return {
		statements,
		lines: input ? input.split('\n').length : 0,
		comments,
		tables,
		joins,
		selects
	};
}

function uniqueKeepOrder(items: string[]): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const item of items) {
		const key = item.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(item);
	}
	return out;
}

function extractTables(code: string): string[] {
	const tables: string[] = [];
	const re =
		/\b(?:FROM|JOIN|INTO|UPDATE|TABLE)\s+(?:ONLY\s+)?("[\w]+"|`[\w]+`|\[[\w]+\]|[A-Za-z_][\w.]*)/gi;
	let match: RegExpExecArray | null;
	while ((match = re.exec(code))) {
		tables.push(stripIdent(match[1]));
	}
	return tables;
}

function stripIdent(raw: string): string {
	return raw.replace(/^["`\[ ]+|["`\] ]+$/g, '');
}

export function validateSql(
	input: string,
	dialect: SqlDialect = 'postgresql'
): { ok: boolean; error: SqlError | null; stats: SqlStats | null } {
	const trimmed = input.trim();
	if (!trimmed) {
		return { ok: false, error: { message: 'Paste some SQL first.' }, stats: null };
	}

	const balance = checkBalance(trimmed);
	if (!balance.ok) {
		return { ok: false, error: balance.error, stats: sqlStats(trimmed) };
	}

	const formatted = formatSql(trimmed, { dialect });
	if (!formatted.ok) {
		return { ok: false, error: formatted.error, stats: sqlStats(trimmed) };
	}

	return { ok: true, error: null, stats: sqlStats(trimmed) };
}

export function quoteIdentifier(name: string, dialect: SqlDialect): string {
	const inner = name.replace(/^["`\[\]]+|["`\[\]]+$/g, '');
	if (dialect === 'mysql' || dialect === 'mariadb' || dialect === 'bigquery' || dialect === 'snowflake') {
		return '`' + inner.replace(/`/g, '``') + '`';
	}
	if (dialect === 'transactsql') {
		return '[' + inner.replace(/]/g, ']]') + ']';
	}
	return '"' + inner.replace(/"/g, '""') + '"';
}

export function escapeStringLiteral(value: string, dialect: SqlDialect = 'postgresql'): string {
	if (dialect === 'mysql' || dialect === 'mariadb') {
		const escaped = value
			.replace(/\\/g, '\\\\')
			.replace(/'/g, "\\'")
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t');
		return `'${escaped}'`;
	}
	return `'${value.replace(/'/g, "''")}'`;
}

export function unescapeStringLiteral(value: string, dialect: SqlDialect = 'postgresql'): string {
	let inner = value.trim();
	if ((inner.startsWith("'") && inner.endsWith("'")) || (inner.startsWith('"') && inner.endsWith('"'))) {
		inner = inner.slice(1, -1);
	}
	if (dialect === 'mysql' || dialect === 'mariadb') {
		return inner
			.replace(/\\'/g, "'")
			.replace(/\\n/g, '\n')
			.replace(/\\r/g, '\r')
			.replace(/\\t/g, '\t')
			.replace(/\\\\/g, '\\')
			.replace(/''/g, "'");
	}
	return inner.replace(/''/g, "'");
}

export function quoteSqlText(
	value: string,
	mode: 'string' | 'identifier',
	dialect: SqlDialect
): string {
	if (mode === 'identifier') return quoteIdentifier(value, dialect);
	return escapeStringLiteral(value, dialect);
}

export function unquoteSqlText(value: string, dialect: SqlDialect): string {
	const trimmed = value.trim();
	if (
		(trimmed.startsWith('`') && trimmed.endsWith('`')) ||
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith('[') && trimmed.endsWith(']'))
	) {
		return stripIdent(trimmed).replace(/""/g, '"').replace(/``/g, '`').replace(/]]/g, ']');
	}
	return unescapeStringLiteral(trimmed, dialect);
}

function toSnake(name: string): string {
	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		.replace(/[^A-Za-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '')
		.toLowerCase() || 'col';
}

function sqlTypeFor(values: unknown[], dialect: SqlDialect): string {
	const present = values.filter((v) => v !== null && v !== undefined);
	if (present.length === 0) return dialectText(dialect);
	if (present.every((v) => typeof v === 'boolean')) return dialectBool(dialect);
	if (present.every((v) => typeof v === 'number' && Number.isInteger(v))) return dialectInt(dialect);
	if (present.every((v) => typeof v === 'number')) return dialectFloat(dialect);
	if (present.every((v) => typeof v === 'object')) return dialectJson(dialect);
	if (present.every((v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v))) return dialectTimestamp(dialect);
	if (present.every((v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v))) {
		return dialect === 'bigquery' ? 'DATE' : dialect === 'transactsql' ? 'DATE' : 'DATE';
	}
	return dialectText(dialect);
}

function dialectText(d: SqlDialect): string {
	if (d === 'transactsql') return 'NVARCHAR(MAX)';
	if (d === 'bigquery') return 'STRING';
	if (d === 'mysql' || d === 'mariadb') return 'VARCHAR(255)';
	return 'TEXT';
}

function dialectInt(d: SqlDialect): string {
	if (d === 'bigquery') return 'INT64';
	if (d === 'transactsql') return 'INT';
	return 'INTEGER';
}

function dialectFloat(d: SqlDialect): string {
	if (d === 'bigquery') return 'FLOAT64';
	if (d === 'transactsql') return 'FLOAT';
	if (d === 'postgresql') return 'DOUBLE PRECISION';
	return 'REAL';
}

function dialectBool(d: SqlDialect): string {
	if (d === 'mysql' || d === 'mariadb') return 'TINYINT(1)';
	if (d === 'transactsql') return 'BIT';
	if (d === 'sqlite') return 'INTEGER';
	return 'BOOLEAN';
}

function dialectJson(d: SqlDialect): string {
	if (d === 'postgresql') return 'JSONB';
	if (d === 'mysql' || d === 'mariadb' || d === 'sqlite' || d === 'bigquery' || d === 'snowflake') return 'JSON';
	return 'NVARCHAR(MAX)';
}

function dialectTimestamp(d: SqlDialect): string {
	if (d === 'mysql' || d === 'mariadb') return 'DATETIME';
	if (d === 'transactsql') return 'DATETIME2';
	if (d === 'sqlite') return 'TEXT';
	return 'TIMESTAMP';
}

function sqlValue(value: unknown, dialect: SqlDialect): string {
	if (value === null || value === undefined) return 'NULL';
	if (typeof value === 'boolean') {
		if (dialect === 'mysql' || dialect === 'mariadb' || dialect === 'sqlite' || dialect === 'transactsql') {
			return value ? '1' : '0';
		}
		return value ? 'TRUE' : 'FALSE';
	}
	if (typeof value === 'number' && Number.isFinite(value)) return String(value);
	if (typeof value === 'object') return escapeStringLiteral(JSON.stringify(value), dialect);
	return escapeStringLiteral(String(value), dialect);
}

export const SAMPLE_JSON_ROWS = `[
  { "id": 1, "name": "Ada Lovelace", "active": true, "signup": "2024-01-15" },
  { "id": 2, "name": "Alan Turing", "active": false, "signup": "2024-03-02" },
  { "id": 3, "name": "Grace Hopper", "active": true, "signup": "2024-06-20" }
]`;

export function jsonToSql(
	input: string,
	options: {
		tableName?: string;
		dialect?: SqlDialect;
		includeCreate?: boolean;
		snakeCase?: boolean;
	} = {}
): { ok: boolean; output: string; error: SqlError | null; rows: number } {
	const dialect = options.dialect ?? 'postgresql';
	const tableRaw = options.tableName?.trim() || 'data';
	let parsed: unknown;
	try {
		parsed = JSON.parse(input);
	} catch (e) {
		return { ok: false, output: '', error: { message: (e as Error).message || 'Invalid JSON' }, rows: 0 };
	}

	let rows: Record<string, unknown>[];
	if (Array.isArray(parsed)) {
		if (parsed.length === 0) {
			return { ok: false, output: '', error: { message: 'JSON array is empty.' }, rows: 0 };
		}
		if (parsed.some((row) => row === null || typeof row !== 'object' || Array.isArray(row))) {
			return { ok: false, output: '', error: { message: 'JSON must be an array of objects.' }, rows: 0 };
		}
		rows = parsed as Record<string, unknown>[];
	} else if (parsed && typeof parsed === 'object') {
		rows = [parsed as Record<string, unknown>];
	} else {
		return { ok: false, output: '', error: { message: 'JSON must be an object or an array of objects.' }, rows: 0 };
	}

	const keys = uniqueKeepOrder(rows.flatMap((row) => Object.keys(row)));
	if (keys.length === 0) {
		return { ok: false, output: '', error: { message: 'Objects have no keys.' }, rows: 0 };
	}

	const cols = keys.map((key) => (options.snakeCase ? toSnake(key) : key.replace(/[^\w$]/g, '_') || 'col'));
	const table = quoteIdentifier(options.snakeCase ? toSnake(tableRaw) : tableRaw, dialect);
	const quotedCols = cols.map((c) => quoteIdentifier(c, dialect));

	const parts: string[] = [];
	if (options.includeCreate) {
		const colDefs = keys.map((key, i) => {
			const values = rows.map((row) => row[key]);
			return `  ${quotedCols[i]} ${sqlTypeFor(values, dialect)}`;
		});
		parts.push(`CREATE TABLE ${table} (\n${colDefs.join(',\n')}\n);`);
	}

	for (const row of rows) {
		const values = keys.map((key) => sqlValue(row[key] ?? null, dialect)).join(', ');
		parts.push(`INSERT INTO ${table} (${quotedCols.join(', ')}) VALUES (${values});`);
	}

	return { ok: true, output: parts.join('\n') + '\n', error: null, rows: rows.length };
}

export type JoinKind = 'inner' | 'left' | 'right' | 'full' | 'cross' | 'left-semi' | 'left-anti';

export const JOIN_KINDS: { value: JoinKind; label: string; sql: string }[] = [
	{ value: 'inner', label: 'INNER JOIN', sql: 'INNER JOIN' },
	{ value: 'left', label: 'LEFT JOIN', sql: 'LEFT JOIN' },
	{ value: 'right', label: 'RIGHT JOIN', sql: 'RIGHT JOIN' },
	{ value: 'full', label: 'FULL OUTER JOIN', sql: 'FULL OUTER JOIN' },
	{ value: 'cross', label: 'CROSS JOIN', sql: 'CROSS JOIN' },
	{ value: 'left-semi', label: 'LEFT SEMI (EXISTS)', sql: 'WHERE EXISTS' },
	{ value: 'left-anti', label: 'LEFT ANTI (NOT EXISTS)', sql: 'WHERE NOT EXISTS' }
];

export const JOIN_USERS = [
	{ id: 1, name: 'Alice' },
	{ id: 2, name: 'Bob' },
	{ id: 3, name: 'Carol' }
];

export const JOIN_ORDERS = [
	{ id: 10, user_id: 1, total: 20 },
	{ id: 11, user_id: 1, total: 35 },
	{ id: 12, user_id: 4, total: 50 }
];

export interface JoinResultRow {
	user_id: number | null;
	name: string | null;
	order_id: number | null;
	total: number | null;
}

export function runJoin(kind: JoinKind): {
	sql: string;
	rows: JoinResultRow[];
	description: string;
	leftMatched: Set<number>;
	rightMatched: Set<number>;
} {
	const users = JOIN_USERS;
	const orders = JOIN_ORDERS;
	const leftMatched = new Set<number>();
	const rightMatched = new Set<number>();
	const rows: JoinResultRow[] = [];

	const innerPairs: { u: (typeof users)[0]; o: (typeof orders)[0] }[] = [];
	for (const u of users) {
		for (const o of orders) {
			if (u.id === o.user_id) {
				innerPairs.push({ u, o });
				leftMatched.add(u.id);
				rightMatched.add(o.id);
			}
		}
	}

	if (kind === 'inner') {
		for (const { u, o } of innerPairs) {
			rows.push({ user_id: u.id, name: u.name, order_id: o.id, total: o.total });
		}
		return {
			sql: `SELECT u.id AS user_id, u.name, o.id AS order_id, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id;`,
			rows,
			description: 'Only rows that match on both sides. Bob, Carol, and the orphan order drop out.',
			leftMatched,
			rightMatched
		};
	}

	if (kind === 'left') {
		for (const u of users) {
			const matches = orders.filter((o) => o.user_id === u.id);
			if (matches.length === 0) {
				rows.push({ user_id: u.id, name: u.name, order_id: null, total: null });
			} else {
				for (const o of matches) rows.push({ user_id: u.id, name: u.name, order_id: o.id, total: o.total });
			}
		}
		return {
			sql: `SELECT u.id AS user_id, u.name, o.id AS order_id, o.total
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;`,
			rows,
			description: 'Every user is kept. Users without orders get NULL order columns.',
			leftMatched,
			rightMatched
		};
	}

	if (kind === 'right') {
		for (const o of orders) {
			const u = users.find((user) => user.id === o.user_id) ?? null;
			rows.push({ user_id: u?.id ?? null, name: u?.name ?? null, order_id: o.id, total: o.total });
		}
		return {
			sql: `SELECT u.id AS user_id, u.name, o.id AS order_id, o.total
FROM users u
RIGHT JOIN orders o ON o.user_id = u.id;`,
			rows,
			description: 'Every order is kept. The order for missing user 4 has NULL user columns.',
			leftMatched,
			rightMatched
		};
	}

	if (kind === 'full') {
		for (const u of users) {
			const matches = orders.filter((o) => o.user_id === u.id);
			if (matches.length === 0) {
				rows.push({ user_id: u.id, name: u.name, order_id: null, total: null });
			} else {
				for (const o of matches) rows.push({ user_id: u.id, name: u.name, order_id: o.id, total: o.total });
			}
		}
		for (const o of orders) {
			if (!users.some((u) => u.id === o.user_id)) {
				rows.push({ user_id: null, name: null, order_id: o.id, total: o.total });
			}
		}
		return {
			sql: `SELECT u.id AS user_id, u.name, o.id AS order_id, o.total
FROM users u
FULL OUTER JOIN orders o ON o.user_id = u.id;`,
			rows,
			description: 'Users without orders and orders without users both appear, with NULLs on the missing side.',
			leftMatched,
			rightMatched
		};
	}

	if (kind === 'cross') {
		for (const u of users) {
			for (const o of orders) {
				rows.push({ user_id: u.id, name: u.name, order_id: o.id, total: o.total });
			}
		}
		return {
			sql: `SELECT u.id AS user_id, u.name, o.id AS order_id, o.total
FROM users u
CROSS JOIN orders o;`,
			rows,
			description: 'Cartesian product. 3 users × 3 orders = 9 rows. No ON clause.',
			leftMatched: new Set(users.map((u) => u.id)),
			rightMatched: new Set(orders.map((o) => o.id))
		};
	}

	if (kind === 'left-semi') {
		for (const u of users) {
			if (orders.some((o) => o.user_id === u.id)) {
				rows.push({ user_id: u.id, name: u.name, order_id: null, total: null });
			}
		}
		return {
			sql: `SELECT u.id AS user_id, u.name
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);`,
			rows,
			description: 'Users that have at least one order. One row per user, not per order. Same idea as INNER JOIN then DISTINCT on the left key.',
			leftMatched,
			rightMatched
		};
	}

	for (const u of users) {
		if (!orders.some((o) => o.user_id === u.id)) {
			rows.push({ user_id: u.id, name: u.name, order_id: null, total: null });
		}
	}
	return {
		sql: `SELECT u.id AS user_id, u.name
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);`,
		rows,
		description: 'Users with no matching order. Same idea as LEFT JOIN ... WHERE o.id IS NULL.',
		leftMatched,
		rightMatched
	};
}

export function likeToRegExp(
	pattern: string,
	options: { caseInsensitive?: boolean; escape?: string } = {}
): { ok: boolean; regex: RegExp | null; error: string | null } {
	if (pattern === '') {
		return { ok: false, regex: null, error: 'Enter a LIKE pattern such as %smith% or a_c.' };
	}
	const escape = options.escape ?? '';
	if (escape.length > 1) {
		return { ok: false, regex: null, error: 'ESCAPE must be a single character.' };
	}

	let source = '^';
	for (let i = 0; i < pattern.length; i++) {
		const ch = pattern[i];
		if (escape && ch === escape) {
			const next = pattern[i + 1];
			if (next === undefined) {
				return { ok: false, regex: null, error: 'LIKE pattern ends with the ESCAPE character.' };
			}
			source += next.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			i++;
			continue;
		}
		if (ch === '%') {
			source += '.*';
			continue;
		}
		if (ch === '_') {
			source += '.';
			continue;
		}
		source += ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}
	source += '$';

	try {
		const flags = options.caseInsensitive ? 'is' : 's';
		return { ok: true, regex: new RegExp(source, flags), error: null };
	} catch (e) {
		return { ok: false, regex: null, error: (e as Error).message };
	}
}

export function testLike(
	pattern: string,
	haystack: string,
	options: { caseInsensitive?: boolean; escape?: string } = {}
): { ok: boolean; matches: { line: string; matched: boolean }[]; error: string | null; matchCount: number } {
	const compiled = likeToRegExp(pattern, options);
	if (!compiled.ok || !compiled.regex) {
		return { ok: false, matches: [], error: compiled.error, matchCount: 0 };
	}
	const lines = haystack.split(/\r?\n/);
	const matches = lines.map((line) => ({ line, matched: compiled.regex!.test(line) }));
	return {
		ok: true,
		matches,
		error: null,
		matchCount: matches.filter((m) => m.matched).length
	};
}

export const SAMPLE_LIKE_ROWS = `Alice
Bob
Carol
alan@example.com
support@onedev.tools
file_backup.sql
file-backup.sql
100
10
1`;

export interface SqlExplainStep {
	title: string;
	detail: string;
}

export interface SqlExplanation {
	kind: string;
	summary: string;
	steps: SqlExplainStep[];
}

const CLAUSE_RE =
	/\b(WITH|SELECT|INSERT\s+INTO|INSERT|UPDATE|DELETE\s+FROM|DELETE|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|MERGE|FROM|((?:LEFT|RIGHT|FULL)(?:\s+OUTER)?\s+)?INNER\s+JOIN|(?:LEFT|RIGHT|FULL)(?:\s+OUTER)?\s+JOIN|CROSS\s+JOIN|JOIN|WHERE|GROUP\s+BY|HAVING|WINDOW|ORDER\s+BY|LIMIT|OFFSET|FETCH|UNION(?:\s+ALL)?|INTERSECT|EXCEPT|VALUES|SET|RETURNING)\b/gi;

function splitStatements(input: string): string[] {
	const pieces = scanSql(input);
	let rebuilt = '';
	const marks: boolean[] = [];
	for (const piece of pieces) {
		for (const ch of piece.value) {
			rebuilt += ch;
			marks.push(piece.kind === 'code');
		}
	}
	const stmts: string[] = [];
	let start = 0;
	for (let i = 0; i < rebuilt.length; i++) {
		if (rebuilt[i] === ';' && marks[i]) {
			const part = rebuilt.slice(start, i).trim();
			if (part) stmts.push(part);
			start = i + 1;
		}
	}
	const tail = rebuilt.slice(start).trim();
	if (tail) stmts.push(tail);
	return stmts;
}

function clausesOf(sql: string): { name: string; body: string }[] {
	const pieces = scanSql(sql);
	let codeMask = '';
	const kinds: ScanKind[] = [];
	for (const piece of pieces) {
		for (const ch of piece.value) {
			codeMask += ch;
			kinds.push(piece.kind);
		}
	}

	const hits: { name: string; index: number }[] = [];
	const re = new RegExp(CLAUSE_RE.source, 'gi');
	let match: RegExpExecArray | null;
	while ((match = re.exec(codeMask))) {
		const idx = match.index;
		if (kinds[idx] !== 'code') continue;
		const depth = parenDepth(codeMask, kinds, idx);
		if (depth !== 0) continue;
		hits.push({ name: match[1].replace(/\s+/g, ' ').toUpperCase(), index: idx });
	}

	const clauses: { name: string; body: string }[] = [];
	for (let i = 0; i < hits.length; i++) {
		const from = hits[i].index + hits[i].name.length;
		const to = i + 1 < hits.length ? hits[i + 1].index : codeMask.length;
		clauses.push({ name: hits[i].name, body: codeMask.slice(from, to).trim().replace(/;+$/, '').trim() });
	}
	return clauses;
}

function parenDepth(text: string, kinds: ScanKind[], at: number): number {
	let depth = 0;
	for (let i = 0; i < at; i++) {
		if (kinds[i] !== 'code') continue;
		if (text[i] === '(') depth++;
		else if (text[i] === ')') depth = Math.max(0, depth - 1);
	}
	return depth;
}

function explainOne(sql: string): SqlExplanation {
	const clauses = clausesOf(sql);
	const names = clauses.map((c) => c.name);
	const find = (label: string) => clauses.filter((c) => c.name === label || c.name.startsWith(label));
	const first = (label: string) => find(label)[0]?.body ?? '';

	let kind = 'STATEMENT';
	if (names.includes('WITH') || names.includes('SELECT')) kind = 'SELECT';
	if (names.some((n) => n.startsWith('INSERT'))) kind = 'INSERT';
	if (names.includes('UPDATE')) kind = 'UPDATE';
	if (names.some((n) => n.startsWith('DELETE'))) kind = 'DELETE';
	if (names.some((n) => n.startsWith('CREATE'))) kind = 'CREATE';
	if (names.some((n) => n.startsWith('ALTER'))) kind = 'ALTER';
	if (names.some((n) => n.startsWith('DROP'))) kind = 'DROP';
	if (names.includes('MERGE')) kind = 'MERGE';

	const steps: SqlExplainStep[] = [];

	const withBody = first('WITH');
	if (withBody) {
		steps.push({
			title: 'Common table expressions',
			detail: `Defines named subqueries first: ${withBody.slice(0, 180)}${withBody.length > 180 ? '...' : ''}`
		});
	}

	if (kind === 'SELECT') {
		const cols = first('SELECT') || '*';
		steps.push({
			title: 'Select list',
			detail: cols.trim() === '*' ? 'Returns every column from the result rows.' : `Projects: ${cols}`
		});
		const from = first('FROM');
		if (from) {
			steps.push({ title: 'From', detail: `Reads rows from ${from}.` });
		}
		const joins = clauses.filter((c) => c.name.includes('JOIN'));
		for (const join of joins) {
			steps.push({
				title: join.name,
				detail: join.body ? `Combines rows using ${join.body}.` : 'Combines rows from another table.'
			});
		}
		const where = first('WHERE');
		if (where) steps.push({ title: 'Filter', detail: `Keeps rows where ${where}.` });
		const group = first('GROUP BY');
		if (group) steps.push({ title: 'Group', detail: `Aggregates rows by ${group}.` });
		const having = first('HAVING');
		if (having) steps.push({ title: 'Having', detail: `Filters groups where ${having}.` });
		const order = first('ORDER BY');
		if (order) steps.push({ title: 'Sort', detail: `Orders rows by ${order}.` });
		const limit = first('LIMIT');
		if (limit) steps.push({ title: 'Limit', detail: `Returns at most ${limit} row(s).` });
		const offset = first('OFFSET');
		if (offset) steps.push({ title: 'Offset', detail: `Skips the first ${offset} row(s).` });
		const unions = clauses.filter((c) => c.name.startsWith('UNION') || c.name === 'INTERSECT' || c.name === 'EXCEPT');
		for (const u of unions) {
			steps.push({ title: u.name, detail: u.body ? `Combines with: ${u.body.slice(0, 160)}` : 'Combines another SELECT.' });
		}
	} else if (kind === 'INSERT') {
		const into = first('INSERT INTO') || first('INSERT');
		steps.push({ title: 'Insert', detail: into ? `Adds rows into ${into}.` : 'Adds rows to a table.' });
		const values = first('VALUES');
		if (values) steps.push({ title: 'Values', detail: `Inserted tuple(s): ${values.slice(0, 200)}` });
		const select = first('SELECT');
		if (select) steps.push({ title: 'Source query', detail: `Rows come from SELECT ${select.slice(0, 160)}` });
	} else if (kind === 'UPDATE') {
		steps.push({ title: 'Update', detail: `Changes rows in ${first('UPDATE') || 'a table'}.` });
		const set = first('SET');
		if (set) steps.push({ title: 'Set', detail: `Assignments: ${set}` });
		const where = first('WHERE');
		if (where) steps.push({ title: 'Filter', detail: `Only rows where ${where}. Without WHERE, every row is updated.` });
		else steps.push({ title: 'No WHERE', detail: 'No filter. This updates every row in the table.' });
	} else if (kind === 'DELETE') {
		steps.push({
			title: 'Delete',
			detail: `Removes rows from ${first('DELETE FROM') || first('DELETE') || first('FROM') || 'a table'}.`
		});
		const where = first('WHERE');
		if (where) steps.push({ title: 'Filter', detail: `Only rows where ${where}.` });
		else steps.push({ title: 'No WHERE', detail: 'No filter. This deletes every row.' });
	} else {
		steps.push({
			title: kind,
			detail: sql.replace(/\s+/g, ' ').slice(0, 240)
		});
	}

	const summary = summarize(kind, steps);
	return { kind, summary, steps };
}

function summarize(kind: string, steps: SqlExplainStep[]): string {
	if (kind === 'SELECT') {
		const from = steps.find((s) => s.title === 'From')?.detail ?? 'a table';
		const joinCount = steps.filter((s) => s.title.includes('JOIN')).length;
		const filter = steps.some((s) => s.title === 'Filter');
		return `A ${kind} that reads ${from.replace(/^Reads rows from /, '').replace(/\.$/, '')}${joinCount ? `, with ${joinCount} join(s)` : ''}${filter ? ', then filters rows' : ''}.`;
	}
	if (kind === 'INSERT') return 'An INSERT that adds one or more rows.';
	if (kind === 'UPDATE') return 'An UPDATE that changes existing rows.';
	if (kind === 'DELETE') return 'A DELETE that removes rows.';
	return `A ${kind} statement.`;
}

export function explainSql(input: string): { ok: boolean; explanations: SqlExplanation[]; error: SqlError | null } {
	const trimmed = input.trim();
	if (!trimmed) {
		return { ok: true, explanations: [], error: null };
	}
	const balance = checkBalance(trimmed);
	if (!balance.ok) {
		return { ok: false, explanations: [], error: balance.error };
	}
	const statements = splitStatements(trimmed);
	if (statements.length === 0) {
		return { ok: false, explanations: [], error: { message: 'No SQL statements found.' } };
	}
	return { ok: true, explanations: statements.map(explainOne), error: null };
}

export interface SqlDiffHunk {
	type: 'added' | 'removed' | 'unchanged';
	text: string;
}

export function diffSql(
	left: string,
	right: string,
	dialect: SqlDialect = 'postgresql'
): { ok: boolean; hunks: SqlDiffHunk[]; error: SqlError | null; identical: boolean } {
	const a = formatSql(left, { dialect, keywordCase: 'upper' });
	const b = formatSql(right, { dialect, keywordCase: 'upper' });
	if (!a.ok) return { ok: false, hunks: [], error: a.error, identical: false };
	if (!b.ok) return { ok: false, hunks: [], error: b.error, identical: false };

	const leftLines = (a.output || '').replace(/\n$/, '').split('\n');
	const rightLines = (b.output || '').replace(/\n$/, '').split('\n');
	const hunks = lcsDiff(leftLines, rightLines);
	const identical = hunks.every((h) => h.type === 'unchanged');
	return { ok: true, hunks, error: null, identical };
}

function lcsDiff(a: string[], b: string[]): SqlDiffHunk[] {
	const n = a.length;
	const m = b.length;
	const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
		}
	}
	const hunks: SqlDiffHunk[] = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		if (a[i] === b[j]) {
			hunks.push({ type: 'unchanged', text: a[i] });
			i++;
			j++;
		} else if (dp[i + 1][j] >= dp[i][j + 1]) {
			hunks.push({ type: 'removed', text: a[i] });
			i++;
		} else {
			hunks.push({ type: 'added', text: b[j] });
			j++;
		}
	}
	while (i < n) {
		hunks.push({ type: 'removed', text: a[i++] });
	}
	while (j < m) {
		hunks.push({ type: 'added', text: b[j++] });
	}
	return hunks;
}
