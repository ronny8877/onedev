/**
 * URL Utilities
 * Comprehensive utilities for URL encoding, parsing, validation, and manipulation
 */

export interface ValidationResult {
	valid: boolean;
	error?: string;
	details?: string;
}

export interface URLParts {
	protocol: string;
	host: string;
	port: string;
	pathname: string;
	search: string;
	hash: string;
	origin: string;
	hostname: string;
}

export interface QueryParam {
	key: string;
	value: string;
	encoded: boolean;
}

export interface RedirectInfo {
	url: string;
	status: number;
	statusText: string;
}

/**
 * Check if a string looks like it's URL encoded
 */
export function isLikelyEncoded(input: string): boolean {
	if (!input) return false;
	
	// Check for percent-encoded characters
	const hasPercentEncoding = /%[0-9A-Fa-f]{2}/.test(input);
	
	// Check for common encoded characters
	const hasEncodedSpace = input.includes('%20') || input.includes('+');
	const hasEncodedSpecial = /%[23][0-9A-Fa-f]/.test(input);
	
	return hasPercentEncoding || (hasEncodedSpace && hasEncodedSpecial);
}

/**
 * URL encode a string (UTF-8 safe)
 */
export function encodeURL(input: string, mode: 'component' | 'full' | 'query' = 'component'): string {
	if (!input) return '';
	
	switch (mode) {
		case 'component':
			return encodeURIComponent(input);
		case 'full':
			return encodeURI(input);
		case 'query':
			// Encode for query string (space as +)
			return encodeURIComponent(input).replace(/%20/g, '+');
		default:
			return encodeURIComponent(input);
	}
}

/**
 * URL decode a string (UTF-8 safe)
 */
export function decodeURL(input: string): string {
	if (!input) return '';
	
	try {
		// Handle + as space first
		const withSpaces = input.replace(/\+/g, ' ');
		return decodeURIComponent(withSpaces);
	} catch {
		throw new Error('Invalid URL encoded string');
	}
}

/**
 * Parse a query string into key-value pairs
 */
export function parseQueryString(input: string): QueryParam[] {
	if (!input) return [];
	
	// Remove leading ? if present
	const queryString = input.startsWith('?') ? input.slice(1) : input;
	
	if (!queryString) return [];
	
	const params: QueryParam[] = [];
	const pairs = queryString.split('&');
	
	for (const pair of pairs) {
		if (!pair) continue;
		
		const [rawKey, ...valueParts] = pair.split('=');
		const rawValue = valueParts.join('='); // Handle values with = in them
		
		let key = rawKey;
		let value = rawValue || '';
		let encoded = false;
		
		// Try to decode
		try {
			const decodedKey = decodeURL(rawKey);
			const decodedValue = decodeURL(rawValue || '');
			encoded = decodedKey !== rawKey || decodedValue !== rawValue;
			key = decodedKey;
			value = decodedValue;
		} catch {
			// Keep original if decode fails
		}
		
		params.push({ key, value, encoded });
	}
	
	return params;
}

/**
 * Build a query string from params
 */
export function buildQueryString(params: { key: string; value: string }[]): string {
	if (!params.length) return '';
	
	return params
		.filter(p => p.key)
		.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
		.join('&');
}

/**
 * Build a complete URL from base and params
 */
export function buildURL(baseURL: string, params: { key: string; value: string }[]): string {
	if (!baseURL) return '';
	
	try {
		const url = new URL(baseURL);
		
		// Clear existing params and add new ones
		url.search = '';
		for (const param of params) {
			if (param.key) {
				url.searchParams.append(param.key, param.value);
			}
		}
		
		return url.toString();
	} catch {
		// If not a valid URL, just append query string
		const queryString = buildQueryString(params);
		if (!queryString) return baseURL;
		
		const separator = baseURL.includes('?') ? '&' : '?';
		return `${baseURL}${separator}${queryString}`;
	}
}

/**
 * Parse a URL into its component parts
 */
export function parseURLParts(input: string): URLParts | null {
	if (!input) return null;
	
	try {
		const url = new URL(input);
		return {
			protocol: url.protocol.replace(':', ''),
			host: url.host,
			hostname: url.hostname,
			port: url.port,
			pathname: url.pathname,
			search: url.search,
			hash: url.hash,
			origin: url.origin
		};
	} catch {
		return null;
	}
}

/**
 * Validate a URL
 */
export function validateURL(input: string): ValidationResult {
	if (!input || !input.trim()) {
		return { valid: false, error: 'Empty input', details: 'Please provide a URL to validate.' };
	}
	
	const trimmed = input.trim();
	
	// Check for protocol
	if (!trimmed.includes('://') && !trimmed.startsWith('//')) {
		return {
			valid: false,
			error: 'Missing protocol',
			details: 'URL should start with a protocol like http://, https://, or ftp://'
		};
	}
	
	try {
		const url = new URL(trimmed);
		
		// Check for valid protocol
		const validProtocols = ['http:', 'https:', 'ftp:', 'ftps:', 'mailto:', 'tel:', 'file:'];
		if (!validProtocols.includes(url.protocol)) {
			return {
				valid: false,
				error: 'Unsupported protocol',
				details: `Protocol "${url.protocol}" is unusual. Common protocols are: http, https, ftp, mailto`
			};
		}
		
		// Check for hostname (except for mailto and tel)
		if (!['mailto:', 'tel:'].includes(url.protocol) && !url.hostname) {
			return {
				valid: false,
				error: 'Missing hostname',
				details: 'URL must include a hostname (e.g., example.com)'
			};
		}
		
		return { valid: true };
	} catch (err) {
		return {
			valid: false,
			error: 'Invalid URL',
			details: (err as Error).message || 'The URL format is invalid'
		};
	}
}

/**
 * Check redirect chain for a URL
 * Note: This may be limited by CORS in browser environments
 */
export async function checkRedirect(input: string): Promise<{
	success: boolean;
	chain: RedirectInfo[];
	finalURL: string;
	error?: string;
}> {
	if (!input) {
		return { success: false, chain: [], finalURL: '', error: 'No URL provided' };
	}
	
	try {
		const chain: RedirectInfo[] = [];
		
		// Use fetch with redirect: 'follow' to get final URL
		const response = await fetch(input, {
			method: 'HEAD',
			redirect: 'follow',
			mode: 'cors'
		});
		
		chain.push({
			url: input,
			status: response.redirected ? 301 : response.status,
			statusText: response.redirected ? 'Redirected' : response.statusText
		});
		
		if (response.redirected) {
			chain.push({
				url: response.url,
				status: response.status,
				statusText: response.statusText
			});
		}
		
		return {
			success: true,
			chain,
			finalURL: response.url
		};
	} catch (err) {
		return {
			success: false,
			chain: [],
			finalURL: '',
			error: (err as Error).message || 'Failed to check redirects (possibly CORS blocked)'
		};
	}
}

/**
 * Generate a URL-safe slug from text
 */
export function generateSlug(
	input: string,
	options: {
		separator?: '-' | '_';
		lowercase?: boolean;
		maxLength?: number;
		preserveCase?: boolean;
	} = {}
): string {
	if (!input) return '';
	
	const { separator = '-', lowercase = true, maxLength = 100, preserveCase = false } = options;
	
	let slug = input.trim();
	
	// Normalize unicode (handle accented characters)
	slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	
	// Convert to lowercase if needed
	if (lowercase && !preserveCase) {
		slug = slug.toLowerCase();
	}
	
	// Replace spaces and special characters with separator
	slug = slug
		.replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
		.replace(/[\s_-]+/g, separator) // Replace spaces, underscores, hyphens with separator
		.replace(new RegExp(`^${separator}+|${separator}+$`, 'g'), ''); // Trim separators from ends
	
	// Apply max length
	if (maxLength && slug.length > maxLength) {
		slug = slug.slice(0, maxLength).replace(new RegExp(`${separator}+$`), '');
	}
	
	return slug;
}

/**
 * Convert query params to JSON
 */
export function queryParamsToJSON(params: QueryParam[]): string {
	const obj: Record<string, string | string[]> = {};
	
	for (const param of params) {
		if (obj[param.key] !== undefined) {
			// Handle duplicate keys as arrays
			if (Array.isArray(obj[param.key])) {
				(obj[param.key] as string[]).push(param.value);
			} else {
				obj[param.key] = [obj[param.key] as string, param.value];
			}
		} else {
			obj[param.key] = param.value;
		}
	}
	
	return JSON.stringify(obj, null, 2);
}

/**
 * Convert query params to CSV
 */
export function queryParamsToCSV(params: QueryParam[]): string {
	const header = 'Key,Value';
	const rows = params.map(p => `"${p.key.replace(/"/g, '""')}","${p.value.replace(/"/g, '""')}"`);
	return [header, ...rows].join('\n');
}

/**
 * Extract query string from a full URL
 */
export function extractQueryString(input: string): string {
	if (!input) return '';
	
	// Try parsing as URL first
	try {
		const url = new URL(input);
		return url.search;
	} catch {
		// Fall back to regex
		const match = input.match(/\?([^#]*)/);
		return match ? `?${match[1]}` : '';
	}
}

/**
 * Common URL schemes for reference
 */
export const URL_SCHEMES = [
	{ scheme: 'http', description: 'Hypertext Transfer Protocol' },
	{ scheme: 'https', description: 'HTTP Secure' },
	{ scheme: 'ftp', description: 'File Transfer Protocol' },
	{ scheme: 'mailto', description: 'Email address' },
	{ scheme: 'tel', description: 'Telephone number' },
	{ scheme: 'file', description: 'Local file' },
	{ scheme: 'data', description: 'Data URL' },
	{ scheme: 'ws', description: 'WebSocket' },
	{ scheme: 'wss', description: 'WebSocket Secure' }
];
