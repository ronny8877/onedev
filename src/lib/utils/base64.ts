/**
 * Base64 Utilities
 * Comprehensive utilities for Base64 encoding, decoding, and conversion
 */

export interface ValidationResult {
	valid: boolean;
	error?: string;
	details?: string;
}

/**
 * Standard Base64 character set
 */
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const URL_SAFE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Validate if a string is valid Base64
 */
export function validateBase64(input: string): ValidationResult {
	if (!input || input.trim().length === 0) {
		return { valid: false, error: 'Empty input', details: 'Please provide a Base64 string to validate.' };
	}

	const trimmed = input.trim();
	
	// Remove whitespace for validation
	const cleaned = trimmed.replace(/\s/g, '');
	
	// Check for invalid characters
	const invalidChars = cleaned.match(/[^A-Za-z0-9+/=\-_]/g);
	if (invalidChars) {
		const uniqueInvalid = [...new Set(invalidChars)].slice(0, 5).join(', ');
		return {
			valid: false,
			error: 'Invalid characters',
			details: `Found invalid character(s): ${uniqueInvalid}. Base64 only allows A-Z, a-z, 0-9, +, /, = (and -_ for URL-safe variant).`
		};
	}

	// Remove padding for length check
	const withoutPadding = cleaned.replace(/=+$/, '');
	const paddingCount = cleaned.length - withoutPadding.length;

	// Check padding
	if (paddingCount > 2) {
		return {
			valid: false,
			error: 'Invalid padding',
			details: `Found ${paddingCount} padding characters (=). Base64 allows at most 2 padding characters.`
		};
	}

	// Check if padding is at the end only
	if (cleaned.includes('=') && !cleaned.match(/^[^=]+=*$/)) {
		return {
			valid: false,
			error: 'Misplaced padding',
			details: 'Padding characters (=) should only appear at the end of the string.'
		};
	}

	// Check length (should be multiple of 4 with padding)
	if (cleaned.length % 4 !== 0) {
		return {
			valid: false,
			error: 'Invalid length',
			details: `Length is ${cleaned.length}, which is not a multiple of 4. Base64 strings should have a length divisible by 4 (with padding).`
		};
	}

	// Try to decode to verify
	try {
		atob(standardFromURLSafe(cleaned));
		return { valid: true };
	} catch {
		return {
			valid: false,
			error: 'Decode failed',
			details: 'The string appears to be well-formed but could not be decoded.'
		};
	}
}

/**
 * Check if a string looks like Base64 encoded data
 */
export function isLikelyBase64(input: string): boolean {
	if (!input || input.length < 4) return false;
	
	const trimmed = input.trim().replace(/\s/g, '');
	
	// Check if it matches Base64 pattern
	const base64Pattern = /^[A-Za-z0-9+/\-_]+=*$/;
	if (!base64Pattern.test(trimmed)) return false;
	
	// Must be multiple of 4 or close to it (for URL-safe without padding)
	if (trimmed.length % 4 > 2) return false;
	
	// If it contains characters that are rare in plain text but common in Base64
	const base64Density = (trimmed.match(/[+/=\-_]/g) || []).length / trimmed.length;
	
	// High ratio of base64-specific chars or length divisible by 4
	return trimmed.length % 4 === 0 || base64Density > 0.01;
}

/**
 * UTF-8 safe Base64 encoding
 */
export function encodeBase64(input: string): string {
	try {
		// Handle UTF-8 properly
		const utf8Bytes = new TextEncoder().encode(input);
		const binary = String.fromCharCode(...utf8Bytes);
		return btoa(binary);
	} catch (err) {
		throw new Error('Failed to encode: ' + (err as Error).message);
	}
}

/**
 * UTF-8 safe Base64 decoding
 */
export function decodeBase64(input: string): string {
	try {
		// Convert URL-safe to standard if needed
		const standard = standardFromURLSafe(input.trim());
		const binary = atob(standard);
		const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	} catch (err) {
		throw new Error('Failed to decode: Invalid Base64 string');
	}
}

/**
 * Convert standard Base64 to URL-safe
 */
export function toURLSafe(input: string, removePadding: boolean = false): string {
	let result = input.replace(/\+/g, '-').replace(/\//g, '_');
	if (removePadding) {
		result = result.replace(/=+$/, '');
	}
	return result;
}

/**
 * Convert URL-safe Base64 to standard
 */
export function fromURLSafe(input: string): string {
	let result = input.replace(/-/g, '+').replace(/_/g, '/');
	// Add padding if needed
	const padLength = (4 - (result.length % 4)) % 4;
	result += '='.repeat(padLength);
	return result;
}

/**
 * Internal: Convert URL-safe to standard without adding padding
 */
function standardFromURLSafe(input: string): string {
	let result = input.replace(/-/g, '+').replace(/_/g, '/');
	// Add padding if needed
	const padLength = (4 - (result.length % 4)) % 4;
	result += '='.repeat(padLength);
	return result;
}

/**
 * Convert Base64 to Hex string
 */
export function base64ToHex(input: string): string {
	try {
		const standard = standardFromURLSafe(input.trim());
		const binary = atob(standard);
		return Array.from(binary)
			.map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
			.join('');
	} catch {
		throw new Error('Invalid Base64 string');
	}
}

/**
 * Convert Base64 to Binary string
 */
export function base64ToBinary(input: string): string {
	try {
		const standard = standardFromURLSafe(input.trim());
		const binary = atob(standard);
		return Array.from(binary)
			.map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
			.join(' ');
	} catch {
		throw new Error('Invalid Base64 string');
	}
}

/**
 * Split Base64 string into chunks
 */
export function splitBase64(input: string, chunkSize: number = 76): string[] {
	const cleaned = input.trim().replace(/\s/g, '');
	const chunks: string[] = [];
	for (let i = 0; i < cleaned.length; i += chunkSize) {
		chunks.push(cleaned.slice(i, i + chunkSize));
	}
	return chunks;
}

/**
 * Detect MIME type from Base64 data URL or raw Base64
 */
export function detectMimeType(input: string): { mimeType: string; extension: string } | null {
	const trimmed = input.trim();
	
	// Check if it's a data URL
	const dataUrlMatch = trimmed.match(/^data:([^;,]+)/);
	if (dataUrlMatch) {
		const mime = dataUrlMatch[1];
		return { mimeType: mime, extension: mimeToExtension(mime) };
	}
	
	// Try to detect from magic bytes
	try {
		const decoded = atob(trimmed.slice(0, 100));
		const bytes = new Uint8Array([...decoded].map(c => c.charCodeAt(0)));
		
		// Check signatures
		if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
			return { mimeType: 'image/jpeg', extension: 'jpg' };
		}
		if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
			return { mimeType: 'image/png', extension: 'png' };
		}
		if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
			return { mimeType: 'image/gif', extension: 'gif' };
		}
		if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
			return { mimeType: 'image/webp', extension: 'webp' };
		}
		if (bytes[0] === 0x3C && decoded.includes('<svg')) {
			return { mimeType: 'image/svg+xml', extension: 'svg' };
		}
		if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
			return { mimeType: 'application/pdf', extension: 'pdf' };
		}
	} catch {
		// Could not decode, return null
	}
	
	return null;
}

function mimeToExtension(mime: string): string {
	const map: Record<string, string> = {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/gif': 'gif',
		'image/webp': 'webp',
		'image/svg+xml': 'svg',
		'application/pdf': 'pdf',
		'text/plain': 'txt',
		'application/json': 'json'
	};
	return map[mime] || 'bin';
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
