import {
	createMcpHandler,
	hostHeaderValidationResponse,
	McpServer,
	originValidationResponse
} from '@modelcontextprotocol/server';
import { decodeJwt, decodeProtectedHeader, jwtVerify } from 'jose';
import { load, dump } from 'js-yaml';
import { nanoid } from 'nanoid';
import qrcode from 'qrcode-generator';
import { Cron } from 'croner';
import cronstrue from 'cronstrue';
import { ulid } from 'ulid';
import { v4 as uuidv4, v7 as uuidv7, validate as validateUuid, version as uuidVersion } from 'uuid';
import * as z from 'zod/v4';

import {
	base64ToBinary,
	base64ToHex,
	decodeBase64,
	detectMimeType,
	encodeBase64,
	fromURLSafe,
	toURLSafe,
	validateBase64
} from '../src/lib/utils/base64';
import {
	csvToJson,
	csvToMarkdown,
	csvToSql,
	jsonToCsv,
	type CsvDelimiter
} from '../src/lib/utils/csv';
import { formatBundle, parseInstant } from '../src/lib/utils/datetime';
import { hashText, identifyHashType, type HashAlgorithm } from '../src/lib/utils/hash';
import {
	compareJSON,
	formatJSON,
	generateGoStruct,
	generateTypeScript,
	minifyJSON,
	queryJSONPath,
	validateJSON
} from '../src/lib/utils/json';
import {
	decodeURL,
	encodeURL,
	generateSlug,
	parseURLParts,
	validateURL
} from '../src/lib/utils/url';

const MAX_TEXT_LENGTH = 512_000;
const MAX_SECRET_LENGTH = 16_000;
const MAX_ID_COUNT = 1_000;
const MCP_HOSTNAMES = ['mcp.onedev.tools', 'localhost', '127.0.0.1', '[::1]'];
const BROWSER_ORIGINS = [
	'https://onedev.tools',
	'https://www.onedev.tools',
	'http://localhost:5173',
	'http://127.0.0.1:5173'
];

const textInput = z.string().min(1).max(MAX_TEXT_LENGTH);
const hashAlgorithms = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'CRC32'] as const;
const csvDelimiters = [',', ';', '\t', '|'] as const;

function jsonResult(result: unknown) {
	return {
		content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
		structuredContent: { result }
	};
}

function toolError(error: unknown) {
	const message =
		error instanceof Error ? error.message : 'The tool could not complete that request.';
	return {
		isError: true,
		content: [{ type: 'text' as const, text: JSON.stringify({ error: message }) }]
	};
}

function toHex(bytes: ArrayBuffer): string {
	return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function toBase64(bytes: ArrayBuffer): string {
	let binary = '';
	for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
	return btoa(binary);
}

function parseBase64DataUrl(input: string): { mimeType: string; base64: string } {
	const match = input.trim().match(/^data:([^;,]+);base64,([\s\S]*)$/i);
	if (!match) throw new Error('Expected a Base64 data URL such as data:image/png;base64,...');
	const base64 = match[2].replace(/\s/g, '');
	const validation = validateBase64(base64);
	if (!validation.valid)
		throw new Error(validation.details ?? validation.error ?? 'Invalid Base64 data.');
	return { mimeType: match[1], base64: fromURLSafe(base64) };
}

function buildQrResult(
	input: string,
	format: 'svg' | 'base64' | 'data_url',
	errorCorrection: 'L' | 'M' | 'Q' | 'H',
	cellSize: number,
	margin: number
) {
	const qr = qrcode(0, errorCorrection);
	qr.addData(input);
	qr.make();
	const svg = qr.createSvgTag({ cellSize, margin, scalable: true });
	const base64 = encodeBase64(svg);
	const result: Record<string, unknown> = {
		format,
		mimeType: 'image/svg+xml',
		moduleCount: qr.getModuleCount()
	};
	if (format === 'svg') result.svg = svg;
	if (format === 'base64' || format === 'data_url') result.base64 = base64;
	if (format === 'data_url') result.dataUrl = `data:image/svg+xml;base64,${base64}`;
	return result;
}

function readableJwtTime(value: unknown): string | undefined {
	if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
	const date = new Date(value * 1000);
	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function normalizeJsonValue(value: unknown): unknown {
	if (value === undefined) return null;
	return value;
}

function registerTools(server: McpServer) {
	server.registerTool(
		'json_transform',
		{
			description:
				'Format, minify, validate, or generate TypeScript or Go types from JSON. Input is processed only for this request.',
			inputSchema: z.object({
				operation: z.enum(['format', 'minify', 'validate', 'typescript', 'go']),
				input: textInput,
				indent: z.number().int().min(0).max(8).optional(),
				rootName: z.string().min(1).max(80).optional()
			})
		},
		async ({ operation, input, indent, rootName }) => {
			try {
				if (operation === 'validate') {
					const validation = validateJSON(input);
					return jsonResult({
						valid: validation.valid,
						error: validation.error,
						data: validation.data
					});
				}
				const output =
					operation === 'format'
						? formatJSON(input, indent ?? 2)
						: operation === 'minify'
							? minifyJSON(input)
							: operation === 'typescript'
								? generateTypeScript(input, rootName ?? 'Root')
								: generateGoStruct(input, rootName ?? 'Root');
				return jsonResult({ operation, output });
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'json_diff',
		{
			description:
				'Compare two JSON documents structurally and return added, removed, and changed values.',
			inputSchema: z.object({
				left: textInput,
				right: textInput,
				ignoreKeyOrder: z.boolean().default(true)
			})
		},
		async ({ left, right, ignoreKeyOrder }) => {
			try {
				const differences = compareJSON(left, right, ignoreKeyOrder);
				return jsonResult({ equal: differences.length === 0, differences });
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'json_query',
		{
			description:
				'Run a simple JSONPath query. Supports property access, numeric indexes, and wildcard segments.',
			inputSchema: z.object({ input: textInput, path: z.string().min(1).max(500) })
		},
		async ({ input, path }) => {
			try {
				const matches = queryJSONPath(input, path);
				return jsonResult({ path, count: matches.length, matches });
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'base64_transform',
		{
			description: 'Encode, decode, validate, convert, or inspect Base64 and Base64URL text.',
			inputSchema: z.object({
				operation: z.enum([
					'encode',
					'decode',
					'validate',
					'to_url_safe',
					'from_url_safe',
					'to_hex',
					'to_binary',
					'to_data_url',
					'from_data_url'
				]),
				input: textInput,
				removePadding: z.boolean().default(false),
				mimeType: z
					.string()
					.regex(/^[a-z][a-z0-9.+-]*\/[a-z0-9.+-]+$/i)
					.optional()
			})
		},
		async ({ operation, input, removePadding, mimeType }) => {
			try {
				if (operation === 'validate') return jsonResult(validateBase64(input));
				if (operation === 'to_data_url') {
					const base64 = fromURLSafe(input.trim().replace(/\s/g, ''));
					const validation = validateBase64(base64);
					if (!validation.valid)
						throw new Error(validation.details ?? validation.error ?? 'Invalid Base64 data.');
					const resolvedMimeType =
						mimeType ?? detectMimeType(base64)?.mimeType ?? 'application/octet-stream';
					return jsonResult({
						operation,
						mimeType: resolvedMimeType,
						base64,
						dataUrl: `data:${resolvedMimeType};base64,${base64}`
					});
				}
				if (operation === 'from_data_url') {
					const parsed = parseBase64DataUrl(input);
					return jsonResult({ operation, ...parsed });
				}
				const output =
					operation === 'encode'
						? encodeBase64(input)
						: operation === 'decode'
							? decodeBase64(input)
							: operation === 'to_url_safe'
								? toURLSafe(input, removePadding)
								: operation === 'from_url_safe'
									? fromURLSafe(input)
									: operation === 'to_hex'
										? base64ToHex(input)
										: base64ToBinary(input);
				return jsonResult({ operation, output });
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'qr_code',
		{
			description:
				'Generate a QR code from text or a URL and return SVG, raw Base64 image data, or an embeddable Base64 data URL.',
			inputSchema: z.object({
				input: z.string().min(1).max(8_000),
				format: z.enum(['svg', 'base64', 'data_url']).default('data_url'),
				errorCorrection: z.enum(['L', 'M', 'Q', 'H']).default('M'),
				cellSize: z.number().int().min(1).max(16).default(4),
				margin: z.number().int().min(0).max(32).default(4)
			})
		},
		async ({ input, format, errorCorrection, cellSize, margin }) => {
			try {
				return jsonResult(buildQrResult(input, format, errorCorrection, cellSize, margin));
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'url_transform',
		{
			description: 'Encode, decode, validate, parse URLs, or generate URL-safe slugs.',
			inputSchema: z.object({
				operation: z.enum([
					'encode_component',
					'encode_url',
					'encode_query',
					'decode',
					'validate',
					'parse',
					'slug'
				]),
				input: textInput,
				separator: z.enum(['-', '_']).optional(),
				maxLength: z.number().int().min(1).max(200).optional()
			})
		},
		async ({ operation, input, separator, maxLength }) => {
			try {
				if (operation === 'validate') return jsonResult(validateURL(input));
				if (operation === 'parse') {
					const parts = parseURLParts(input);
					if (!parts) throw new Error('Invalid URL');
					return jsonResult(parts);
				}
				const output =
					operation === 'decode'
						? decodeURL(input)
						: operation === 'slug'
							? generateSlug(input, { separator, maxLength })
							: encodeURL(
									input,
									operation === 'encode_url'
										? 'full'
										: operation === 'encode_query'
											? 'query'
											: 'component'
								);
				return jsonResult({ operation, output });
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'hash_text',
		{
			description:
				'Calculate a text checksum or identify the likely format of an existing hash. Hashes are not password storage.',
			inputSchema: z.object({
				operation: z.enum(['generate', 'identify']),
				input: textInput,
				algorithm: z.enum(hashAlgorithms).optional()
			})
		},
		async ({ operation, input, algorithm }) => {
			try {
				if (operation === 'identify') return jsonResult({ candidates: identifyHashType(input) });
				if (!algorithm) throw new Error('Choose an algorithm when generating a hash.');
				return jsonResult(await hashText(input, algorithm as HashAlgorithm));
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'hmac_generate',
		{
			description:
				'Generate an HMAC for text using a caller-supplied key. The key is used only for this request.',
			inputSchema: z.object({
				input: textInput,
				secret: z.string().min(1).max(MAX_SECRET_LENGTH),
				algorithm: z.enum(['SHA-256', 'SHA-384', 'SHA-512']).default('SHA-256')
			})
		},
		async ({ input, secret, algorithm }) => {
			try {
				const key = await crypto.subtle.importKey(
					'raw',
					new TextEncoder().encode(secret),
					{ name: 'HMAC', hash: { name: algorithm } },
					false,
					['sign']
				);
				const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input));
				const base64 = toBase64(signature);
				return jsonResult({
					algorithm: `HMAC-${algorithm}`,
					hex: toHex(signature),
					base64,
					base64url: toURLSafe(base64, true)
				});
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'generate_ids',
		{
			description: 'Generate a batch of UUID v4, UUID v7, NanoID, or ULID identifiers.',
			inputSchema: z.object({
				type: z.enum(['uuid_v4', 'uuid_v7', 'nanoid', 'ulid']),
				count: z.number().int().min(1).max(MAX_ID_COUNT).default(1),
				nanoidLength: z.number().int().min(1).max(128).default(21)
			})
		},
		async ({ type, count, nanoidLength }) => {
			const values = Array.from({ length: count }, () => {
				switch (type) {
					case 'uuid_v4':
						return uuidv4();
					case 'uuid_v7':
						return uuidv7();
					case 'nanoid':
						return nanoid(nanoidLength);
					default:
						return ulid();
				}
			});
			return jsonResult({ type, count: values.length, values });
		}
	);

	server.registerTool(
		'uuid_validate',
		{
			description: 'Validate a UUID and report its version when it is valid.',
			inputSchema: z.object({ input: z.string().min(1).max(200) })
		},
		async ({ input }) => {
			const value = input.trim();
			const valid = validateUuid(value);
			return jsonResult({ valid, version: valid ? uuidVersion(value) : null, value });
		}
	);

	server.registerTool(
		'jwt_decode',
		{
			description:
				'Decode a JWT and inspect header, claims, and time-based claim status. Decoding does not verify authenticity.',
			inputSchema: z.object({ token: z.string().min(1).max(MAX_TEXT_LENGTH) })
		},
		async ({ token }) => {
			try {
				const header = decodeProtectedHeader(token);
				const payload = decodeJwt(token);
				const now = Math.floor(Date.now() / 1000);
				const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
				const nbf = typeof payload.nbf === 'number' ? payload.nbf : undefined;
				return jsonResult({
					verified: false,
					warning: 'Decoded JWT data is untrusted until its signature is verified.',
					header,
					payload,
					claims: {
						expiresAt: readableJwtTime(exp),
						notBefore: readableJwtTime(nbf),
						expired: exp === undefined ? null : exp <= now,
						notActiveYet: nbf === undefined ? null : nbf > now
					}
				});
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'jwt_verify_hmac',
		{
			description:
				'Verify an HS256, HS384, or HS512 JWT with a caller-supplied secret. The secret is not persisted by the server.',
			inputSchema: z.object({
				token: z.string().min(1).max(MAX_TEXT_LENGTH),
				secret: z.string().min(1).max(MAX_SECRET_LENGTH),
				algorithm: z.enum(['HS256', 'HS384', 'HS512']).default('HS256'),
				issuer: z.string().max(2_000).optional(),
				audience: z.string().max(2_000).optional()
			})
		},
		async ({ token, secret, algorithm, issuer, audience }) => {
			try {
				const result = await jwtVerify(token, new TextEncoder().encode(secret), {
					algorithms: [algorithm],
					issuer,
					audience
				});
				return jsonResult({
					verified: true,
					header: result.protectedHeader,
					payload: result.payload
				});
			} catch (error) {
				return jsonResult({
					verified: false,
					error: error instanceof Error ? error.message : 'JWT verification failed.'
				});
			}
		}
	);

	server.registerTool(
		'tabular_transform',
		{
			description: 'Convert CSV to JSON, Markdown, or SQL, or convert a JSON array to CSV.',
			inputSchema: z.object({
				operation: z.enum(['csv_to_json', 'csv_to_markdown', 'csv_to_sql', 'json_to_csv']),
				input: textInput,
				delimiter: z.enum(csvDelimiters).optional(),
				tableName: z.string().min(1).max(100).optional()
			})
		},
		async ({ operation, input, delimiter, tableName }) => {
			try {
				const csvDelimiter = delimiter as CsvDelimiter | undefined;
				const result =
					operation === 'csv_to_json'
						? csvToJson(input, csvDelimiter)
						: operation === 'csv_to_markdown'
							? csvToMarkdown(input, csvDelimiter)
							: operation === 'csv_to_sql'
								? csvToSql(input, tableName ?? 'data', csvDelimiter)
								: jsonToCsv(input, csvDelimiter ?? ',');
				if (!result.ok) throw new Error(result.error?.message ?? 'Conversion failed.');
				return jsonResult({
					operation,
					output: result.output,
					rows: 'rows' in result ? result.rows : undefined
				});
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'yaml_transform',
		{
			description: 'Validate YAML, convert YAML to JSON, or convert JSON to YAML.',
			inputSchema: z.object({
				operation: z.enum(['validate', 'yaml_to_json', 'json_to_yaml']),
				input: textInput,
				indent: z.number().int().min(2).max(8).default(2)
			})
		},
		async ({ operation, input, indent }) => {
			try {
				if (operation === 'json_to_yaml') {
					const parsed = JSON.parse(input);
					return jsonResult({ operation, output: dump(parsed, { indent, noRefs: true }) });
				}
				const parsed = load(input);
				if (operation === 'validate')
					return jsonResult({ valid: true, value: normalizeJsonValue(parsed) });
				return jsonResult({
					operation,
					output: JSON.stringify(normalizeJsonValue(parsed), null, indent)
				});
			} catch (error) {
				if (operation === 'validate') {
					return jsonResult({
						valid: false,
						error: error instanceof Error ? error.message : 'Invalid YAML.'
					});
				}
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'cron_inspect',
		{
			description: 'Explain a cron expression and return its next scheduled runs in a timezone.',
			inputSchema: z.object({
				expression: z.string().min(1).max(128),
				timezone: z.string().min(1).max(100).default('UTC'),
				count: z.number().int().min(1).max(20).default(5)
			})
		},
		async ({ expression, timezone, count }) => {
			try {
				const cron = new Cron(expression, { timezone });
				const runs: string[] = [];
				let next = cron.nextRun();
				for (let index = 0; index < count && next; index += 1) {
					runs.push(next.toISOString());
					next = cron.nextRun(new Date(next.getTime() + 1_000));
				}
				let description: string | undefined;
				try {
					description = cronstrue.toString(expression);
				} catch {
					// A valid Croner expression may use syntax the humanizer does not recognize.
				}
				return jsonResult({ expression, timezone, description, runs });
			} catch (error) {
				return toolError(error);
			}
		}
	);

	server.registerTool(
		'time_convert',
		{
			description:
				'Convert a Unix timestamp, ISO 8601 date, RFC 2822 date, Excel serial date, or “now” into common formats.',
			inputSchema: z.object({
				input: z.string().min(1).max(500),
				timezone: z.string().min(1).max(100).default('UTC')
			})
		},
		async ({ input, timezone }) => {
			const parsed = parseInstant(input);
			if ('error' in parsed) return toolError(new Error(parsed.error));
			return jsonResult({
				inputKind: parsed.inputKind,
				unit: parsed.unit,
				values: formatBundle(parsed.date, timezone)
			});
		}
	);
}

const handler = createMcpHandler(() => {
	const server = new McpServer({ name: 'onedev-tools', version: '0.1.0' });
	registerTools(server);
	return server;
});

function withCors(request: Request, response: Response): Response {
	const origin = request.headers.get('origin');
	if (!origin || !BROWSER_ORIGINS.includes(origin)) return response;
	const headers = new Headers(response.headers);
	headers.set('access-control-allow-origin', origin);
	headers.set('access-control-allow-methods', 'GET, POST, OPTIONS');
	headers.set('access-control-allow-headers', 'content-type, mcp-protocol-version');
	headers.append('vary', 'Origin');
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}

export default {
	async fetch(request: Request): Promise<Response> {
		const hostRejected = hostHeaderValidationResponse(request, MCP_HOSTNAMES);
		if (hostRejected) return hostRejected;

		const originRejected = originValidationResponse(request, BROWSER_ORIGINS);
		if (originRejected) return originRejected;

		const url = new URL(request.url);
		if (request.method === 'OPTIONS') {
			return withCors(request, new Response(null, { status: 204 }));
		}
		if (url.pathname === '/' && request.method === 'GET') {
			return withCors(
				request,
				Response.json({
					name: 'OneDev Tools MCP',
					version: '0.1.0',
					endpoint: 'https://mcp.onedev.tools/mcp',
					documentation: 'https://onedev.tools/mcp'
				})
			);
		}
		if (url.pathname !== '/mcp') {
			return withCors(request, Response.json({ error: 'Not found' }, { status: 404 }));
		}
		return withCors(request, await handler.fetch(request));
	}
};
