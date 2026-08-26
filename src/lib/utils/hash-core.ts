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

export const HASH_ALGORITHMS: HashAlgorithm[] = ['MD5', 'SHA-1', 'SHA-256', 'SHA-512', 'CRC32'];

const CRC32_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
	let c = i;
	for (let j = 0; j < 8; j++) {
		c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
	}
	CRC32_TABLE[i] = c;
}

export function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;
	for (let i = 0; i < data.length; i++) {
		crc = CRC32_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

function bufferToHex(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	return Array.from(bytes)
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export function hexToBase64(hex: string): string {
	const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
	let binary = '';
	bytes.forEach((b) => (binary += String.fromCharCode(b)));
	return btoa(binary);
}

export function base64ToHex(base64: string): string {
	const binary = atob(base64);
	let hex = '';
	for (let i = 0; i < binary.length; i++) {
		hex += binary.charCodeAt(i).toString(16).padStart(2, '0');
	}
	return hex;
}

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

	const msgLen = input.length;
	const bitLen = msgLen * 8;
	const padLen = ((56 - ((msgLen + 1) % 64) + 64) % 64) + 1;
	const padded = new Uint8Array(msgLen + padLen + 8);
	padded.set(input);
	padded[msgLen] = 0x80;

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

export async function hashBuffer(data: Uint8Array, algorithm: HashAlgorithm): Promise<HashResult> {
	const start = performance.now();
	let hex: string;

	if (algorithm === 'MD5') {
		hex = md5(data);
	} else if (algorithm === 'CRC32') {
		hex = crc32(data).toString(16).padStart(8, '0');
	} else {
		const digest = await crypto.subtle.digest(algorithm, data as BufferSource);
		hex = bufferToHex(digest);
	}

	return {
		algorithm,
		hex,
		base64: hexToBase64(hex),
		length: hex.length * 4,
		time: performance.now() - start
	};
}

export async function hashBufferAll(data: Uint8Array): Promise<HashResult[]> {
	const results: HashResult[] = [];
	for (const algorithm of HASH_ALGORITHMS) {
		results.push(await hashBuffer(data, algorithm));
	}
	return results;
}

export type HashWorkerRequest = {
	id: number;
	kind: 'one' | 'all';
	algorithm?: HashAlgorithm;
	file: File;
};

export type HashWorkerResponse =
	| { id: number; type: 'progress'; loaded: number; total: number; percent: number }
	| { id: number; type: 'result'; results: HashResult[] }
	| { id: number; type: 'error'; message: string };
