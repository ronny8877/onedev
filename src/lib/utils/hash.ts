// Hash utilities using Web Crypto API (native browser)
// No external dependencies required

export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512' | 'CRC32';

export interface HashResult {
	algorithm: HashAlgorithm;
	hex: string;
	base64: string;
	length: number;
	time: number;
}

export interface HashProgress {
	loaded: number;
	total: number;
	percent: number;
}

// CRC32 lookup table
const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
	let c = i;
	for (let j = 0; j < 8; j++) {
		c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	}
	CRC32_TABLE[i] = c;
}

// Calculate CRC32 checksum
export function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;
	for (let i = 0; i < data.length; i++) {
		crc = CRC32_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

// Convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

// Convert hex string to Base64
export function hexToBase64(hex: string): string {
	const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
	let binary = '';
	bytes.forEach((b) => (binary += String.fromCharCode(b)));
	return btoa(binary);
}

// Convert Base64 to hex string
export function base64ToHex(base64: string): string {
	const binary = atob(base64);
	let hex = '';
	for (let i = 0; i < binary.length; i++) {
		hex += binary.charCodeAt(i).toString(16).padStart(2, '0');
	}
	return hex;
}

// Simple MD5 implementation (Web Crypto doesn't support MD5)
// This is a well-tested implementation for browser use
function md5(input: Uint8Array): string {
	const K = new Uint32Array([
		0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613,
		0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193,
		0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d,
		0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
		0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
		0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
		0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244,
		0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
		0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
		0xeb86d391
	]);

	const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];

	function rotl(x: number, n: number): number {
		return (x << n) | (x >>> (32 - n));
	}

	// Padding
	const msgLen = input.length;
	const bitLen = msgLen * 8;
	const padLen = ((56 - ((msgLen + 1) % 64) + 64) % 64) + 1;
	const padded = new Uint8Array(msgLen + padLen + 8);
	padded.set(input);
	padded[msgLen] = 0x80;

	// Length in bits (little-endian)
	const view = new DataView(padded.buffer);
	view.setUint32(padded.length - 8, bitLen >>> 0, true);
	view.setUint32(padded.length - 4, Math.floor(bitLen / 0x100000000), true);

	let a0 = 0x67452301;
	let b0 = 0xefcdab89;
	let c0 = 0x98badcfe;
	let d0 = 0x10325476;

	for (let i = 0; i < padded.length; i += 64) {
		const M = new Uint32Array(16);
		for (let j = 0; j < 16; j++) {
			M[j] = view.getUint32(i + j * 4, true);
		}

		let A = a0,
			B = b0,
			C = c0,
			D = d0;

		for (let j = 0; j < 64; j++) {
			let F: number, g: number;
			if (j < 16) {
				F = (B & C) | (~B & D);
				g = j;
			} else if (j < 32) {
				F = (D & B) | (~D & C);
				g = (5 * j + 1) % 16;
			} else if (j < 48) {
				F = B ^ C ^ D;
				g = (3 * j + 5) % 16;
			} else {
				F = C ^ (B | ~D);
				g = (7 * j) % 16;
			}

			F = (F + A + K[j] + M[g]) >>> 0;
			A = D;
			D = C;
			C = B;
			B = (B + rotl(F, S[(Math.floor(j / 16) * 4 + (j % 4)) % 16])) >>> 0;
		}

		a0 = (a0 + A) >>> 0;
		b0 = (b0 + B) >>> 0;
		c0 = (c0 + C) >>> 0;
		d0 = (d0 + D) >>> 0;
	}

	const result = new DataView(new ArrayBuffer(16));
	result.setUint32(0, a0, true);
	result.setUint32(4, b0, true);
	result.setUint32(8, c0, true);
	result.setUint32(12, d0, true);

	return bufferToHex(result.buffer);
}

// Hash text using specified algorithm
export async function hashText(
	text: string,
	algorithm: HashAlgorithm
): Promise<HashResult> {
	const start = performance.now();
	const encoder = new TextEncoder();
	const data = encoder.encode(text);

	let hex: string;

	if (algorithm === 'MD5') {
		hex = md5(data);
	} else if (algorithm === 'CRC32') {
		hex = crc32(data).toString(16).padStart(8, '0');
	} else {
		const hashBuffer = await crypto.subtle.digest(algorithm, data);
		hex = bufferToHex(hashBuffer);
	}

	const time = performance.now() - start;

	return {
		algorithm,
		hex,
		base64: hexToBase64(hex),
		length: hex.length * 4, // bits
		time
	};
}

// Hash file with progress callback
export async function hashFile(
	file: File,
	algorithm: HashAlgorithm,
	onProgress?: (progress: HashProgress) => void
): Promise<HashResult> {
	const start = performance.now();
	const chunkSize = 2 * 1024 * 1024; // 2MB chunks
	const totalSize = file.size;

	if (algorithm === 'MD5' || algorithm === 'CRC32') {
		// For MD5/CRC32, read entire file (they don't support streaming easily)
		const buffer = await file.arrayBuffer();
		const data = new Uint8Array(buffer);

		let hex: string;
		if (algorithm === 'MD5') {
			hex = md5(data);
		} else {
			hex = crc32(data).toString(16).padStart(8, '0');
		}

		onProgress?.({ loaded: totalSize, total: totalSize, percent: 100 });

		return {
			algorithm,
			hex,
			base64: hexToBase64(hex),
			length: hex.length * 4,
			time: performance.now() - start
		};
	}

	// For SHA algorithms, we can use streaming
	const chunks: Uint8Array[] = [];
	let loaded = 0;

	const reader = file.stream().getReader();

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
		loaded += value.length;
		onProgress?.({
			loaded,
			total: totalSize,
			percent: Math.round((loaded / totalSize) * 100)
		});
	}

	// Combine chunks
	const combined = new Uint8Array(totalSize);
	let offset = 0;
	for (const chunk of chunks) {
		combined.set(chunk, offset);
		offset += chunk.length;
	}

	const hashBuffer = await crypto.subtle.digest(algorithm, combined);
	const hex = bufferToHex(hashBuffer);

	return {
		algorithm,
		hex,
		base64: hexToBase64(hex),
		length: hex.length * 4,
		time: performance.now() - start
	};
}

// Generate all hashes at once
export async function hashTextAll(text: string): Promise<HashResult[]> {
	const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'CRC32'];
	return Promise.all(algorithms.map((alg) => hashText(text, alg)));
}

export async function hashFileAll(
	file: File,
	onProgress?: (progress: HashProgress) => void
): Promise<HashResult[]> {
	const algorithms: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'CRC32'];

	// Read file once
	const buffer = await file.arrayBuffer();
	const data = new Uint8Array(buffer);

	onProgress?.({ loaded: file.size, total: file.size, percent: 100 });

	const results: HashResult[] = [];
	const start = performance.now();

	// MD5
	const md5Hex = md5(data);
	results.push({
		algorithm: 'MD5',
		hex: md5Hex,
		base64: hexToBase64(md5Hex),
		length: 128,
		time: performance.now() - start
	});

	// SHA-1
	const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
	const sha1Hex = bufferToHex(sha1Buffer);
	results.push({
		algorithm: 'SHA-1',
		hex: sha1Hex,
		base64: hexToBase64(sha1Hex),
		length: 160,
		time: performance.now() - start
	});

	// SHA-256
	const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
	const sha256Hex = bufferToHex(sha256Buffer);
	results.push({
		algorithm: 'SHA-256',
		hex: sha256Hex,
		base64: hexToBase64(sha256Hex),
		length: 256,
		time: performance.now() - start
	});

	// SHA-512
	const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
	const sha512Hex = bufferToHex(sha512Buffer);
	results.push({
		algorithm: 'SHA-512',
		hex: sha512Hex,
		base64: hexToBase64(sha512Hex),
		length: 512,
		time: performance.now() - start
	});

	// CRC32
	const crc32Hex = crc32(data).toString(16).padStart(8, '0');
	results.push({
		algorithm: 'CRC32',
		hex: crc32Hex,
		base64: hexToBase64(crc32Hex),
		length: 32,
		time: performance.now() - start
	});

	return results;
}

// Hash type identification
export interface HashTypeGuess {
	type: string;
	confidence: 'high' | 'medium' | 'low';
	description: string;
	length: number;
}

export function identifyHashType(hash: string): HashTypeGuess[] {
	const trimmed = hash.trim();
	const results: HashTypeGuess[] = [];

	// Check if it's hex
	const isHex = /^[a-fA-F0-9]+$/.test(trimmed);
	const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(trimmed) && trimmed.length % 4 === 0;

	// bcrypt pattern
	if (/^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(trimmed)) {
		results.push({
			type: 'bcrypt',
			confidence: 'high',
			description: 'bcrypt password hash (60 chars, starts with $2)',
			length: 60
		});
		return results;
	}

	// Argon2
	if (/^\$argon2(id|i|d)\$/.test(trimmed)) {
		results.push({
			type: 'Argon2',
			confidence: 'high',
			description: 'Argon2 password hash',
			length: trimmed.length
		});
		return results;
	}

	// NTLM
	if (isHex && trimmed.length === 32 && /^[A-F0-9]+$/.test(trimmed)) {
		results.push({
			type: 'NTLM',
			confidence: 'medium',
			description: 'Could be NTLM (Windows password hash)',
			length: 32
		});
	}

	if (isHex) {
		switch (trimmed.length) {
			case 8:
				results.push({
					type: 'CRC32',
					confidence: 'high',
					description: 'CRC32 checksum (32 bits)',
					length: 8
				});
				break;
			case 32:
				results.push({
					type: 'MD5',
					confidence: 'high',
					description: 'MD5 hash (128 bits)',
					length: 32
				});
				results.push({
					type: 'MD4',
					confidence: 'low',
					description: 'Could also be MD4 (128 bits)',
					length: 32
				});
				break;
			case 40:
				results.push({
					type: 'SHA-1',
					confidence: 'high',
					description: 'SHA-1 hash (160 bits)',
					length: 40
				});
				results.push({
					type: 'RIPEMD-160',
					confidence: 'low',
					description: 'Could also be RIPEMD-160',
					length: 40
				});
				break;
			case 56:
				results.push({
					type: 'SHA-224',
					confidence: 'high',
					description: 'SHA-224 hash (224 bits)',
					length: 56
				});
				break;
			case 64:
				results.push({
					type: 'SHA-256',
					confidence: 'high',
					description: 'SHA-256 hash (256 bits)',
					length: 64
				});
				results.push({
					type: 'SHA3-256',
					confidence: 'low',
					description: 'Could also be SHA3-256 or BLAKE2s',
					length: 64
				});
				break;
			case 96:
				results.push({
					type: 'SHA-384',
					confidence: 'high',
					description: 'SHA-384 hash (384 bits)',
					length: 96
				});
				break;
			case 128:
				results.push({
					type: 'SHA-512',
					confidence: 'high',
					description: 'SHA-512 hash (512 bits)',
					length: 128
				});
				results.push({
					type: 'SHA3-512',
					confidence: 'low',
					description: 'Could also be SHA3-512 or BLAKE2b',
					length: 128
				});
				break;
			default:
				results.push({
					type: 'Unknown Hex',
					confidence: 'low',
					description: `Hexadecimal string (${trimmed.length * 4} bits)`,
					length: trimmed.length
				});
		}
	} else if (isBase64) {
		results.push({
			type: 'Base64',
			confidence: 'medium',
			description: 'Base64 encoded data (not a raw hash)',
			length: trimmed.length
		});
	} else {
		results.push({
			type: 'Unknown',
			confidence: 'low',
			description: 'Not recognized as a common hash format',
			length: trimmed.length
		});
	}

	return results;
}

// Published inputs from RFC 1321 (MD5) and common FIPS 180 examples.
// Used to check that a hasher matches known test vectors, not to guess passwords.
export const HASH_TEST_VECTOR_INPUTS = [
	'',
	'a',
	'abc',
	'message digest',
	'abcdefghijklmnopqrstuvwxyz',
	'abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq',
	'The quick brown fox jumps over the lazy dog',
	'The quick brown fox jumps over the lazy dog.'
];

export async function matchPublishedTestVector(
	hash: string,
	algorithm: HashAlgorithm
): Promise<{ found: boolean; plaintext?: string; label?: string; checked: number }> {
	const normalizedHash = hash.toLowerCase().trim();
	const total = HASH_TEST_VECTOR_INPUTS.length;

	for (let i = 0; i < HASH_TEST_VECTOR_INPUTS.length; i++) {
		const input = HASH_TEST_VECTOR_INPUTS[i];
		const result = await hashText(input, algorithm);
		if (result.hex.toLowerCase() === normalizedHash) {
			const label = input === '' ? '(empty string)' : `"${input}"`;
			return { found: true, plaintext: input, label, checked: i + 1 };
		}
	}

	return { found: false, checked: total };
}

// Format file size
export function formatSize(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format time
export function formatTime(ms: number): string {
	if (ms < 1) return '<1ms';
	if (ms < 1000) return `${Math.round(ms)}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
}
