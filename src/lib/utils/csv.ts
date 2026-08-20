/**
 * RFC 4180-ish CSV helpers. Runs in the browser on the text you paste.
 */

export type CsvDelimiter = ',' | ';' | '\t' | '|';

export interface CsvError {
	message: string;
	line?: number;
}

export interface CsvTable {
	headers: string[];
	rows: string[][];
	delimiter: CsvDelimiter;
	rowCount: number;
	columnCount: number;
	warnings: string[];
}

const DELIMS: CsvDelimiter[] = [',', ';', '\t', '|'];
export const MAX_RENDER_ROWS = 250;

export function stripBom(input: string): string {
	return input.charCodeAt(0) === 0xfeff ? input.slice(1) : input;
}

export function detectDelimiter(input: string): CsvDelimiter {
	const sample = stripBom(input).split(/\r?\n/).slice(0, 8).join('\n');
	let best: CsvDelimiter = ',';
	let bestScore = -1;
	for (const d of DELIMS) {
		const counts = sample.split(/\r?\n/).map((line) => countUnquoted(line, d));
		if (counts.length === 0) continue;
		const first = counts[0];
		if (first <= 0) continue;
		const consistent = counts.filter((c) => c === first).length;
		const score = first * 10 + consistent;
		if (score > bestScore) {
			bestScore = score;
			best = d;
		}
	}
	return best;
}

function countUnquoted(line: string, delimiter: string): number {
	let n = 0;
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') {
				i++;
				continue;
			}
			inQuotes = !inQuotes;
		} else if (ch === delimiter && !inQuotes) {
			n++;
		}
	}
	return n;
}

export function parseCsv(input: string, delimiter?: CsvDelimiter): { ok: boolean; table: CsvTable | null; error: CsvError | null } {
	const text = stripBom(input);
	if (!text.trim()) {
		return { ok: false, table: null, error: { message: 'Paste some CSV first.' } };
	}

	const delim = delimiter ?? detectDelimiter(text);
	const records: string[][] = [];
	const warnings: string[] = [];

	let field = '';
	let row: string[] = [];
	let inQuotes = false;
	let line = 1;
	let i = 0;

	const pushField = () => {
		row.push(field);
		field = '';
	};
	const pushRow = () => {
		records.push(row);
		row = [];
	};

	while (i < text.length) {
		const ch = text[i];
		if (inQuotes) {
			if (ch === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i += 2;
					continue;
				}
				inQuotes = false;
				i++;
				continue;
			}
			if (ch === '\n') line++;
			field += ch;
			i++;
			continue;
		}

		if (ch === '"') {
			inQuotes = true;
			i++;
			continue;
		}
		if (ch === delim) {
			pushField();
			i++;
			continue;
		}
		if (ch === '\r') {
			i++;
			continue;
		}
		if (ch === '\n') {
			pushField();
			pushRow();
			line++;
			i++;
			continue;
		}
		field += ch;
		i++;
	}

	if (inQuotes) {
		return { ok: false, table: null, error: { message: 'Unclosed quote. A field started with " was never closed.', line } };
	}

	if (field.length > 0 || row.length > 0) {
		pushField();
		pushRow();
	}

	if (records.length === 0) {
		return { ok: false, table: null, error: { message: 'No rows found.' } };
	}

	const headers = records[0].map((h, idx) => h.trim() || `column_${idx + 1}`);
	const dataRows = records.slice(1);
	const width = headers.length;
	let ragged = 0;
	const normalized = dataRows.map((r) => {
		if (r.length !== width) ragged++;
		if (r.length < width) return [...r, ...Array(width - r.length).fill('')];
		if (r.length > width) return r.slice(0, width);
		return r;
	});
	if (ragged) {
		warnings.push(`${ragged} row${ragged === 1 ? '' : 's'} had a different column count than the header. Extra cells were dropped and missing cells were filled with empty strings.`);
	}

	return {
		ok: true,
		table: {
			headers,
			rows: normalized,
			delimiter: delim,
			rowCount: normalized.length,
			columnCount: width,
			warnings
		},
		error: null
	};
}

export function stringifyCsv(headers: string[], rows: string[][], delimiter: CsvDelimiter = ','): string {
	const lines = [headers.map((h) => escapeCsv(h, delimiter)).join(delimiter)];
	for (const row of rows) {
		lines.push(row.map((cell) => escapeCsv(cell ?? '', delimiter)).join(delimiter));
	}
	return lines.join('\n') + '\n';
}

function escapeCsv(value: string, delimiter: CsvDelimiter): string {
	if (value.includes('"') || value.includes('\n') || value.includes('\r') || value.includes(delimiter)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export function csvToObjects(table: CsvTable): Record<string, string>[] {
	return table.rows.map((row) => {
		const obj: Record<string, string> = {};
		table.headers.forEach((h, i) => {
			obj[h] = row[i] ?? '';
		});
		return obj;
	});
}

export function csvToJson(input: string, delimiter?: CsvDelimiter, pretty = true): { ok: boolean; output: string; error: CsvError | null; rows: number } {
	const parsed = parseCsv(input, delimiter);
	if (!parsed.ok || !parsed.table) {
		return { ok: false, output: '', error: parsed.error, rows: 0 };
	}
	const data = csvToObjects(parsed.table);
	return { ok: true, output: JSON.stringify(data, null, pretty ? 2 : 0), error: null, rows: data.length };
}

export function jsonToCsv(input: string, delimiter: CsvDelimiter = ','): { ok: boolean; output: string; error: CsvError | null; rows: number } {
	let data: unknown;
	try {
		data = JSON.parse(input);
	} catch (e) {
		return { ok: false, output: '', error: { message: (e as Error).message || 'Invalid JSON' }, rows: 0 };
	}

	if (!Array.isArray(data)) {
		return { ok: false, output: '', error: { message: 'JSON must be an array of objects (or an array of arrays).' }, rows: 0 };
	}
	if (data.length === 0) {
		return { ok: true, output: '', error: null, rows: 0 };
	}

	if (Array.isArray(data[0])) {
		const rows = (data as unknown[][]).map((r) => r.map((c) => stringifyCell(c)));
		const width = Math.max(...rows.map((r) => r.length), 0);
		const headers = Array.from({ length: width }, (_, i) => `column_${i + 1}`);
		const padded = rows.map((r) => (r.length < width ? [...r, ...Array(width - r.length).fill('')] : r));
		return { ok: true, output: stringifyCsv(headers, padded, delimiter), error: null, rows: padded.length };
	}

	const headers: string[] = [];
	const seen = new Set<string>();
	for (const item of data) {
		if (item && typeof item === 'object' && !Array.isArray(item)) {
			for (const key of Object.keys(item as object)) {
				if (!seen.has(key)) {
					seen.add(key);
					headers.push(key);
				}
			}
		}
	}
	if (headers.length === 0) {
		return { ok: false, output: '', error: { message: 'Could not find object keys to use as CSV headers.' }, rows: 0 };
	}

	const rows = data.map((item) => {
		if (!item || typeof item !== 'object' || Array.isArray(item)) {
			return headers.map(() => '');
		}
		const rec = item as Record<string, unknown>;
		return headers.map((h) => stringifyCell(rec[h]));
	});
	return { ok: true, output: stringifyCsv(headers, rows, delimiter), error: null, rows: rows.length };
}

function stringifyCell(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'object') return JSON.stringify(value);
	return String(value);
}

export function csvToXml(input: string, delimiter?: CsvDelimiter, rootName = 'rows', rowName = 'row'): { ok: boolean; output: string; error: CsvError | null } {
	const parsed = parseCsv(input, delimiter);
	if (!parsed.ok || !parsed.table) {
		return { ok: false, output: '', error: parsed.error };
	}
	const safeRoot = sanitizeTag(rootName);
	const safeRow = sanitizeTag(rowName);
	const lines = [`<?xml version="1.0" encoding="UTF-8"?>`, `<${safeRoot}>`];
	for (const row of parsed.table.rows) {
		lines.push(`  <${safeRow}>`);
		parsed.table.headers.forEach((header, i) => {
			const tag = sanitizeTag(header);
			const val = escapeXml(row[i] ?? '');
			lines.push(`    <${tag}>${val}</${tag}>`);
		});
		lines.push(`  </${safeRow}>`);
	}
	lines.push(`</${safeRoot}>`);
	return { ok: true, output: lines.join('\n') + '\n', error: null };
}

function sanitizeTag(name: string): string {
	const cleaned = name.replace(/[^A-Za-z0-9_.-]/g, '_');
	if (!cleaned || /^[0-9]/.test(cleaned)) return 'field';
	return cleaned;
}

function escapeXml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function csvToSql(
	input: string,
	tableName = 'data',
	delimiter?: CsvDelimiter
): { ok: boolean; output: string; error: CsvError | null } {
	const parsed = parseCsv(input, delimiter);
	if (!parsed.ok || !parsed.table) {
		return { ok: false, output: '', error: parsed.error };
	}
	const table = sanitizeIdent(tableName);
	const cols = parsed.table.headers.map(sanitizeIdent);
	const statements = parsed.table.rows.map((row) => {
		const values = row.map((cell) => sqlLiteral(cell)).join(', ');
		return `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${values});`;
	});
	return { ok: true, output: statements.join('\n') + '\n', error: null };
}

function sanitizeIdent(name: string): string {
	const cleaned = name.replace(/[^A-Za-z0-9_]/g, '_');
	return cleaned || 'col';
}

function sqlLiteral(value: string): string {
	if (value === '') return 'NULL';
	if (/^-?\d+(\.\d+)?$/.test(value)) return value;
	if (value === 'true' || value === 'false') return value.toUpperCase();
	return `'${value.replace(/'/g, "''")}'`;
}

export function csvToMarkdown(input: string, delimiter?: CsvDelimiter): { ok: boolean; output: string; error: CsvError | null } {
	const parsed = parseCsv(input, delimiter);
	if (!parsed.ok || !parsed.table) {
		return { ok: false, output: '', error: parsed.error };
	}
	const { headers, rows } = parsed.table;
	const escape = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, '<br>');
	const header = `| ${headers.map(escape).join(' | ')} |`;
	const sep = `| ${headers.map(() => '---').join(' | ')} |`;
	const body = rows.map((r) => `| ${r.map(escape).join(' | ')} |`).join('\n');
	return { ok: true, output: `${header}\n${sep}\n${body}\n`, error: null };
}

export function transposeCsv(input: string, delimiter?: CsvDelimiter): { ok: boolean; output: string; error: CsvError | null } {
	const parsed = parseCsv(input, delimiter);
	if (!parsed.ok || !parsed.table) {
		return { ok: false, output: '', error: parsed.error };
	}
	const delim = parsed.table.delimiter;
	const grid = [parsed.table.headers, ...parsed.table.rows];
	const width = Math.max(...grid.map((r) => r.length));
	const height = grid.length;
	const out: string[][] = [];
	for (let c = 0; c < width; c++) {
		const row: string[] = [];
		for (let r = 0; r < height; r++) {
			row.push(grid[r][c] ?? '');
		}
		out.push(row);
	}
	if (out.length === 0) return { ok: true, output: '', error: null };
	return { ok: true, output: stringifyCsv(out[0], out.slice(1), delim), error: null };
}

export interface CsvDiff {
	type: 'added' | 'removed' | 'changed';
	row: number;
	column?: string;
	left?: string;
	right?: string;
}

export function diffCsv(left: string, right: string, delimiter?: CsvDelimiter): { ok: boolean; diffs: CsvDiff[]; error: CsvError | null } {
	const a = parseCsv(left, delimiter);
	const b = parseCsv(right, delimiter);
	if (!a.ok || !a.table) return { ok: false, diffs: [], error: a.error };
	if (!b.ok || !b.table) return { ok: false, diffs: [], error: b.error };

	const diffs: CsvDiff[] = [];
	const cols = Array.from(new Set([...a.table.headers, ...b.table.headers]));
	const max = Math.max(a.table.rows.length, b.table.rows.length);
	for (let i = 0; i < max; i++) {
		if (i >= a.table.rows.length) {
			diffs.push({ type: 'added', row: i + 1, right: b.table.rows[i].join(', ') });
			continue;
		}
		if (i >= b.table.rows.length) {
			diffs.push({ type: 'removed', row: i + 1, left: a.table.rows[i].join(', ') });
			continue;
		}
		for (const col of cols) {
			const ai = a.table.headers.indexOf(col);
			const bi = b.table.headers.indexOf(col);
			const lv = ai >= 0 ? a.table.rows[i][ai] ?? '' : '';
			const rv = bi >= 0 ? b.table.rows[i][bi] ?? '' : '';
			if (lv !== rv) {
				diffs.push({ type: 'changed', row: i + 1, column: col, left: lv, right: rv });
			}
		}
	}
	return { ok: true, diffs, error: null };
}

export function validateCsv(input: string, delimiter?: CsvDelimiter): {
	ok: boolean;
	issues: Array<{ level: 'error' | 'warning'; message: string; line?: number }>;
	table: CsvTable | null;
} {
	const parsed = parseCsv(input, delimiter);
	if (!parsed.ok || !parsed.table) {
		return { ok: false, issues: [{ level: 'error', message: parsed.error?.message || 'Invalid CSV', line: parsed.error?.line }], table: null };
	}
	const issues: Array<{ level: 'error' | 'warning'; message: string; line?: number }> = [];
	const { headers, rows } = parsed.table;
	const seen = new Set<string>();
	headers.forEach((h, i) => {
		if (!h.trim()) issues.push({ level: 'warning', message: `Header ${i + 1} is empty.` });
		if (seen.has(h)) issues.push({ level: 'warning', message: `Duplicate header "${h}".` });
		seen.add(h);
	});
	if (parsed.table.warnings.length) {
		parsed.table.warnings.forEach((w) => issues.push({ level: 'warning', message: w }));
	}
	rows.forEach((row, idx) => {
		if (row.every((c) => c === '')) issues.push({ level: 'warning', message: 'Empty row.', line: idx + 2 });
	});
	return { ok: issues.every((i) => i.level !== 'error'), issues, table: parsed.table };
}

export const SAMPLE_CSV = `id,name,email,role,active
1,Alice Johnson,alice@example.com,Admin,true
2,Bob Smith,bob@example.com,User,true
3,Carla Diaz,carla@example.com,User,false
4,"Nguyen, Linh",linh@example.com,Editor,true`;
