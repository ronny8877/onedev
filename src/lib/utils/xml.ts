/**
 * Client-side XML helpers. Parsing uses the browser DOMParser.
 * Nothing is uploaded.
 */

export interface XmlError {
	message: string;
	line?: number;
	column?: number;
}

export interface XmlParseResult {
	ok: boolean;
	doc: Document | null;
	error: XmlError | null;
}

export interface XmlStats {
	elements: number;
	attributes: number;
	textNodes: number;
	comments: number;
	maxDepth: number;
	rootName: string;
	namespaces: string[];
}

const PARSER_NS = 'http://www.w3.org/1999/xhtml';

export function parseXml(input: string): XmlParseResult {
	if (typeof DOMParser === 'undefined') {
		return { ok: false, doc: null, error: { message: 'XML parsing needs a browser (DOMParser is not available).' } };
	}

	const trimmed = input.trim();
	if (!trimmed) {
		return { ok: false, doc: null, error: { message: 'Paste some XML first.' } };
	}

	try {
		const parser = new DOMParser();
		const doc = parser.parseFromString(trimmed, 'application/xml');
		const errNode = doc.getElementsByTagName('parsererror')[0] || doc.getElementsByTagNameNS(PARSER_NS, 'parsererror')[0];
		if (errNode) {
			return { ok: false, doc: null, error: extractParserError(errNode.textContent || 'Invalid XML') };
		}
		if (!doc.documentElement) {
			return { ok: false, doc: null, error: { message: 'Document has no root element.' } };
		}
		return { ok: true, doc, error: null };
	} catch (e) {
		return { ok: false, doc: null, error: { message: (e as Error).message || 'Failed to parse XML' } };
	}
}

function extractParserError(raw: string): XmlError {
	const lineMatch = raw.match(/line(?:\s+number)?\s+(\d+)/i);
	const colMatch = raw.match(/column\s+(\d+)/i);
	const message = raw.replace(/\s+/g, ' ').trim().slice(0, 400);
	return {
		message,
		line: lineMatch ? Number(lineMatch[1]) : undefined,
		column: colMatch ? Number(colMatch[1]) : undefined
	};
}

export function formatXml(input: string, indentSize = 2): { ok: boolean; output: string; error: XmlError | null } {
	const parsed = parseXml(input);
	if (!parsed.ok || !parsed.doc?.documentElement) {
		return { ok: false, output: '', error: parsed.error };
	}
	const pad = ' '.repeat(Math.max(1, Math.min(8, indentSize)));
	const decl = xmlDeclaration(input);
	const body = serializeNode(parsed.doc.documentElement, 0, pad);
	return { ok: true, output: decl + body + '\n', error: null };
}

export function minifyXml(input: string): { ok: boolean; output: string; error: XmlError | null } {
	const parsed = parseXml(input);
	if (!parsed.ok || !parsed.doc?.documentElement) {
		return { ok: false, output: '', error: parsed.error };
	}
	const decl = xmlDeclaration(input).replace(/\n$/, '');
	const body = serializeNode(parsed.doc.documentElement, 0, '', true);
	return { ok: true, output: decl + body, error: null };
}

function xmlDeclaration(source: string): string {
	const match = source.match(/^\s*(<\?xml\b[^?]*\?>)/i);
	return match ? match[1] + '\n' : '';
}

function serializeNode(node: Element, depth: number, pad: string, compact = false): string {
	const indent = compact ? '' : pad.repeat(depth);
	const newline = compact ? '' : '\n';
	const attrs = serializeAttributes(node);
	const children = Array.from(node.childNodes).filter((n) => {
		if (n.nodeType === Node.COMMENT_NODE) return true;
		if (n.nodeType === Node.ELEMENT_NODE) return true;
		if (n.nodeType === Node.TEXT_NODE) return (n.textContent || '').trim().length > 0;
		if (n.nodeType === Node.CDATA_SECTION_NODE) return true;
		return false;
	});

	const name = node.tagName;
	if (children.length === 0) {
		return `${indent}<${name}${attrs}/>`;
	}

	const onlyText =
		children.length === 1 &&
		(children[0].nodeType === Node.TEXT_NODE || children[0].nodeType === Node.CDATA_SECTION_NODE);

	if (onlyText) {
		const text =
			children[0].nodeType === Node.CDATA_SECTION_NODE
				? `<![CDATA[${children[0].textContent || ''}]]>`
				: escapeXmlText(children[0].textContent || '');
		return `${indent}<${name}${attrs}>${text}</${name}>`;
	}

	const inner = children
		.map((child) => {
			if (child.nodeType === Node.ELEMENT_NODE) {
				return serializeNode(child as Element, depth + 1, pad, compact);
			}
			if (child.nodeType === Node.COMMENT_NODE) {
				const body = `${indent}${pad}<!--${(child as Comment).data}-->`;
				return compact ? `<!--${(child as Comment).data}-->` : body;
			}
			if (child.nodeType === Node.CDATA_SECTION_NODE) {
				return compact
					? `<![CDATA[${child.textContent || ''}]]>`
					: `${indent}${pad}<![CDATA[${child.textContent || ''}]]>`;
			}
			const text = escapeXmlText((child.textContent || '').trim());
			return compact ? text : `${indent}${pad}${text}`;
		})
		.join(newline);

	if (compact) {
		return `<${name}${attrs}>${inner}</${name}>`;
	}
	return `${indent}<${name}${attrs}>${newline}${inner}${newline}${indent}</${name}>`;
}

function serializeAttributes(el: Element): string {
	if (!el.attributes.length) return '';
	return Array.from(el.attributes)
		.map((attr) => ` ${attr.name}="${escapeXmlAttr(attr.value)}"`)
		.join('');
}

export function escapeXmlText(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function escapeXmlAttr(value: string): string {
	return escapeXmlText(value).replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export function unescapeXml(value: string): string {
	return value
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
		.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
		.replace(/&amp;/g, '&');
}

export function xmlToJson(
	input: string,
	options: { attributesPrefix?: string; compact?: boolean } = {}
): { ok: boolean; output: string; error: XmlError | null } {
	const parsed = parseXml(input);
	if (!parsed.ok || !parsed.doc?.documentElement) {
		return { ok: false, output: '', error: parsed.error };
	}
	const prefix = options.attributesPrefix ?? '@';
	const data = elementToJson(parsed.doc.documentElement, prefix);
	return { ok: true, output: JSON.stringify(data, null, 2), error: null };
}

function elementToJson(el: Element, attrPrefix: string): unknown {
	const obj: Record<string, unknown> = {};
	for (const attr of Array.from(el.attributes)) {
		obj[attrPrefix + attr.name] = attr.value;
	}

	const childEls = Array.from(el.children);
	const text = Array.from(el.childNodes)
		.filter((n) => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.CDATA_SECTION_NODE)
		.map((n) => (n.textContent || '').trim())
		.filter(Boolean)
		.join(' ');

	if (childEls.length === 0) {
		if (Object.keys(obj).length === 0) return coerceScalar(text);
		if (text) obj['#text'] = coerceScalar(text);
		return obj;
	}

	const grouped = new Map<string, unknown[]>();
	for (const child of childEls) {
		const value = elementToJson(child, attrPrefix);
		const list = grouped.get(child.tagName) ?? [];
		list.push(value);
		grouped.set(child.tagName, list);
	}
	for (const [key, values] of grouped) {
		obj[key] = values.length === 1 ? values[0] : values;
	}
	if (text) obj['#text'] = coerceScalar(text);
	return obj;
}

function coerceScalar(value: string): string | number | boolean | null {
	if (value === '') return '';
	if (value === 'true') return true;
	if (value === 'false') return false;
	if (value === 'null') return null;
	if (/^-?\d+$/.test(value)) {
		const n = Number(value);
		if (Number.isSafeInteger(n)) return n;
	}
	if (/^-?\d+\.\d+$/.test(value)) {
		const n = Number(value);
		if (!Number.isNaN(n)) return n;
	}
	return value;
}

export function jsonToXml(
	input: string,
	rootName = 'root',
	indentSize = 2
): { ok: boolean; output: string; error: XmlError | null } {
	let data: unknown;
	try {
		data = JSON.parse(input);
	} catch (e) {
		return { ok: false, output: '', error: { message: (e as Error).message || 'Invalid JSON' } };
	}

	const safeRoot = sanitizeName(rootName || 'root');
	const pad = ' '.repeat(Math.max(1, Math.min(8, indentSize)));
	const body = jsonValueToXml(safeRoot, data, 0, pad);
	return { ok: true, output: `<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, error: null };
}

function sanitizeName(name: string): string {
	const cleaned = name.replace(/[^A-Za-z0-9_.-]/g, '_');
	if (!cleaned || /^[0-9]/.test(cleaned) || cleaned.toLowerCase() === 'xml') return 'root';
	return cleaned;
}

function jsonValueToXml(name: string, value: unknown, depth: number, pad: string): string {
	const indent = pad.repeat(depth);
	const tag = sanitizeName(name);

	if (value === null || value === undefined) {
		return `${indent}<${tag}/>`;
	}
	if (Array.isArray(value)) {
		if (value.length === 0) return `${indent}<${tag}/>`;
		return value.map((item) => jsonValueToXml(tag, item, depth, pad)).join('\n');
	}
	if (typeof value === 'object') {
		const record = value as Record<string, unknown>;
		const attrs: string[] = [];
		const children: string[] = [];
		let text = '';
		for (const [key, child] of Object.entries(record)) {
			if (key === '#text') {
				text = String(child ?? '');
				continue;
			}
			if (key.startsWith('@')) {
				attrs.push(` ${sanitizeName(key.slice(1))}="${escapeXmlAttr(String(child ?? ''))}"`);
				continue;
			}
			children.push(jsonValueToXml(key, child, depth + 1, pad));
		}
		if (children.length === 0 && !text) {
			return `${indent}<${tag}${attrs.join('')}/>`;
		}
		if (children.length === 0) {
			return `${indent}<${tag}${attrs.join('')}>${escapeXmlText(text)}</${tag}>`;
		}
		const inner = children.join('\n');
		const textLine = text ? `\n${pad.repeat(depth + 1)}${escapeXmlText(text)}` : '';
		return `${indent}<${tag}${attrs.join('')}>\n${inner}${textLine}\n${indent}</${tag}>`;
	}
	return `${indent}<${tag}>${escapeXmlText(String(value))}</${tag}>`;
}

export function xmlToCsv(input: string): { ok: boolean; output: string; error: XmlError | null; rows: number } {
	const parsed = parseXml(input);
	if (!parsed.ok || !parsed.doc?.documentElement) {
		return { ok: false, output: '', error: parsed.error, rows: 0 };
	}

	const root = parsed.doc.documentElement;
	const children = Array.from(root.children);
	if (children.length === 0) {
		return { ok: false, output: '', error: { message: 'Root element has no child records to flatten into rows.' }, rows: 0 };
	}

	const rowTag = mostCommonTag(children);
	const rows = children.filter((el) => el.tagName === rowTag);
	const headers = new Set<string>();
	const records = rows.map((row) => flattenElement(row, headers));

	const cols = Array.from(headers);
	const lines = [cols.map(csvEscape).join(',')];
	for (const rec of records) {
		lines.push(cols.map((col) => csvEscape(rec[col] ?? '')).join(','));
	}
	return { ok: true, output: lines.join('\n') + '\n', error: null, rows: records.length };
}

function mostCommonTag(els: Element[]): string {
	const counts = new Map<string, number>();
	for (const el of els) counts.set(el.tagName, (counts.get(el.tagName) ?? 0) + 1);
	let best = els[0].tagName;
	let n = 0;
	for (const [tag, count] of counts) {
		if (count > n) {
			best = tag;
			n = count;
		}
	}
	return best;
}

function flattenElement(el: Element, headers: Set<string>, prefix = ''): Record<string, string> {
	const out: Record<string, string> = {};
	for (const attr of Array.from(el.attributes)) {
		const key = prefix ? `${prefix}/@${attr.name}` : `@${attr.name}`;
		headers.add(key);
		out[key] = attr.value;
	}
	const childEls = Array.from(el.children);
	if (childEls.length === 0) {
		const key = prefix || el.tagName;
		headers.add(key);
		out[key] = (el.textContent || '').trim();
		return out;
	}
	for (const child of childEls) {
		const key = prefix ? `${prefix}/${child.tagName}` : child.tagName;
		Object.assign(out, flattenElement(child, headers, key));
	}
	return out;
}

function csvEscape(value: string): string {
	if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
	return value;
}

export function evaluateXPath(
	xml: string,
	expression: string
): { ok: boolean; matches: string[]; count: number; error: XmlError | null } {
	const parsed = parseXml(xml);
	if (!parsed.ok || !parsed.doc) {
		return { ok: false, matches: [], count: 0, error: parsed.error };
	}
	if (!expression.trim()) {
		return { ok: false, matches: [], count: 0, error: { message: 'Enter an XPath expression.' } };
	}
	try {
		const result = parsed.doc.evaluate(expression, parsed.doc, null, XPathResult.ANY_TYPE, null);
		const matches: string[] = [];
		if (result.resultType === XPathResult.NUMBER_TYPE) {
			matches.push(String(result.numberValue));
		} else if (result.resultType === XPathResult.STRING_TYPE) {
			matches.push(result.stringValue);
		} else if (result.resultType === XPathResult.BOOLEAN_TYPE) {
			matches.push(String(result.booleanValue));
		} else {
			let node = result.iterateNext();
			while (node && matches.length < 500) {
				if (node.nodeType === Node.ELEMENT_NODE) {
					matches.push(serializeNode(node as Element, 0, '  '));
				} else if (node.nodeType === Node.ATTRIBUTE_NODE) {
					matches.push(`${(node as Attr).name}="${(node as Attr).value}"`);
				} else {
					matches.push((node.textContent || '').trim());
				}
				node = result.iterateNext();
			}
		}
		return { ok: true, matches, count: matches.length, error: null };
	} catch (e) {
		return { ok: false, matches: [], count: 0, error: { message: (e as Error).message || 'Invalid XPath' } };
	}
}

export function xmlStats(input: string): { ok: boolean; stats: XmlStats | null; error: XmlError | null } {
	const parsed = parseXml(input);
	if (!parsed.ok || !parsed.doc?.documentElement) {
		return { ok: false, stats: null, error: parsed.error };
	}
	const acc: XmlStats = {
		elements: 0,
		attributes: 0,
		textNodes: 0,
		comments: 0,
		maxDepth: 0,
		rootName: parsed.doc.documentElement.tagName,
		namespaces: []
	};
	const ns = new Set<string>();
	walk(parsed.doc.documentElement, 1, acc, ns);
	acc.namespaces = Array.from(ns);
	return { ok: true, stats: acc, error: null };
}

function walk(node: Node, depth: number, acc: XmlStats, ns: Set<string>) {
	acc.maxDepth = Math.max(acc.maxDepth, depth);
	if (node.nodeType === Node.ELEMENT_NODE) {
		const el = node as Element;
		acc.elements += 1;
		acc.attributes += el.attributes.length;
		if (el.namespaceURI) ns.add(el.namespaceURI);
		for (const child of Array.from(node.childNodes)) walk(child, depth + 1, acc, ns);
	} else if (node.nodeType === Node.TEXT_NODE && (node.textContent || '').trim()) {
		acc.textNodes += 1;
	} else if (node.nodeType === Node.COMMENT_NODE) {
		acc.comments += 1;
	}
}

export interface XmlDiff {
	path: string;
	type: 'added' | 'removed' | 'changed';
	left?: string;
	right?: string;
}

export function diffXml(leftXml: string, rightXml: string): { ok: boolean; diffs: XmlDiff[]; error: XmlError | null } {
	const left = xmlToJson(leftXml);
	if (!left.ok) return { ok: false, diffs: [], error: left.error };
	const right = xmlToJson(rightXml);
	if (!right.ok) return { ok: false, diffs: [], error: right.error };
	const diffs: XmlDiff[] = [];
	walkDiff(JSON.parse(left.output), JSON.parse(right.output), '', diffs);
	return { ok: true, diffs, error: null };
}

function walkDiff(left: unknown, right: unknown, path: string, diffs: XmlDiff[]) {
	if (left === right) return;
	if (typeof left !== typeof right || Array.isArray(left) !== Array.isArray(right)) {
		diffs.push({ path: path || 'root', type: 'changed', left: stringify(left), right: stringify(right) });
		return;
	}
	if (Array.isArray(left) && Array.isArray(right)) {
		const max = Math.max(left.length, right.length);
		for (let i = 0; i < max; i++) {
			const p = `${path}[${i}]`;
			if (i >= left.length) diffs.push({ path: p, type: 'added', right: stringify(right[i]) });
			else if (i >= right.length) diffs.push({ path: p, type: 'removed', left: stringify(left[i]) });
			else walkDiff(left[i], right[i], p, diffs);
		}
		return;
	}
	if (left && right && typeof left === 'object' && typeof right === 'object') {
		const l = left as Record<string, unknown>;
		const r = right as Record<string, unknown>;
		const keys = new Set([...Object.keys(l), ...Object.keys(r)]);
		for (const key of keys) {
			const p = path ? `${path}.${key}` : key;
			if (!(key in l)) diffs.push({ path: p, type: 'added', right: stringify(r[key]) });
			else if (!(key in r)) diffs.push({ path: p, type: 'removed', left: stringify(l[key]) });
			else walkDiff(l[key], r[key], p, diffs);
		}
		return;
	}
	diffs.push({ path: path || 'root', type: 'changed', left: stringify(left), right: stringify(right) });
}

function stringify(value: unknown): string {
	if (typeof value === 'string') return value;
	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

export const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101" available="true">
    <title>XML Developer's Guide</title>
    <author>Gambardella, Matthew</author>
    <price>44.95</price>
    <genre>Computer</genre>
  </book>
  <book id="bk102" available="false">
    <title>Midnight Rain</title>
    <author>Ralls, Kim</author>
    <price>5.95</price>
    <genre>Fantasy</genre>
  </book>
</catalog>`;
