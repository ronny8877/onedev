import {
	HASH_ALGORITHMS,
	hashBuffer,
	hashBufferAll,
	type HashAlgorithm,
	type HashProgress,
	type HashResult,
	type HashWorkerRequest,
	type HashWorkerResponse
} from './hash-core';

export type { HashAlgorithm, HashProgress, HashResult };
export { crc32, hexToBase64, base64ToHex, hashBuffer, hashBufferAll } from './hash-core';

const MAIN_THREAD_MAX_BYTES = 256 * 1024;

type PendingHash = {
	resolve: (results: HashResult[]) => void;
	reject: (error: Error) => void;
	onProgress?: (progress: HashProgress) => void;
};

let hashWorker: Worker | null = null;
let hashWorkerFailed = false;
let nextHashId = 1;
const pendingHashes = new Map<number, PendingHash>();

function getHashWorker(): Worker | null {
	if (hashWorkerFailed) return null;
	if (typeof Worker === 'undefined') return null;
	if (hashWorker) return hashWorker;

	try {
		hashWorker = new Worker(new URL('./hash.worker.ts', import.meta.url), { type: 'module' });
		hashWorker.onmessage = (event: MessageEvent<HashWorkerResponse>) => {
			const msg = event.data;
			const pending = pendingHashes.get(msg.id);
			if (!pending) return;

			if (msg.type === 'progress') {
				pending.onProgress?.({
					loaded: msg.loaded,
					total: msg.total,
					percent: msg.percent
				});
				return;
			}

			pendingHashes.delete(msg.id);
			if (msg.type === 'error') {
				pending.reject(new Error(msg.message));
				return;
			}
			pending.resolve(msg.results);
		};
		hashWorker.onerror = () => {
			hashWorkerFailed = true;
			const error = new Error('Hash worker failed');
			for (const pending of pendingHashes.values()) {
				pending.reject(error);
			}
			pendingHashes.clear();
			hashWorker?.terminate();
			hashWorker = null;
		};
		return hashWorker;
	} catch {
		hashWorkerFailed = true;
		return null;
	}
}

function hashFileInWorker(
	file: File,
	kind: 'one' | 'all',
	algorithm: HashAlgorithm | undefined,
	onProgress?: (progress: HashProgress) => void
): Promise<HashResult[]> {
	const worker = getHashWorker();
	if (!worker) {
		return Promise.reject(new Error('Hash worker unavailable'));
	}

	return new Promise((resolve, reject) => {
		const id = nextHashId++;
		pendingHashes.set(id, { resolve, reject, onProgress });
		const request: HashWorkerRequest = { id, kind, algorithm, file };
		worker.postMessage(request);
	});
}

async function hashFileOnMain(
	file: File,
	kind: 'one' | 'all',
	algorithm: HashAlgorithm | undefined,
	onProgress?: (progress: HashProgress) => void
): Promise<HashResult[]> {
	if (file.size > MAIN_THREAD_MAX_BYTES) {
		throw new Error(
			'This browser cannot hash large files off the main thread. Use a smaller file, or try a current Chrome, Firefox, Safari, or Edge.'
		);
	}

	const data = new Uint8Array(await file.arrayBuffer());
	onProgress?.({ loaded: file.size, total: file.size, percent: 100 });
	if (kind === 'all') {
		return hashBufferAll(data);
	}
	if (!algorithm) throw new Error('Missing hash algorithm');
	return [await hashBuffer(data, algorithm)];
}

async function runFileHash(
	file: File,
	kind: 'one' | 'all',
	algorithm?: HashAlgorithm,
	onProgress?: (progress: HashProgress) => void
): Promise<HashResult[]> {
	if (getHashWorker()) {
		try {
			return await hashFileInWorker(file, kind, algorithm, onProgress);
		} catch (err) {
			if (file.size > MAIN_THREAD_MAX_BYTES) throw err;
		}
	}
	return hashFileOnMain(file, kind, algorithm, onProgress);
}

export async function hashText(text: string, algorithm: HashAlgorithm): Promise<HashResult> {
	const data = new TextEncoder().encode(text);
	return hashBuffer(data, algorithm);
}

export async function hashFile(
	file: File,
	algorithm: HashAlgorithm,
	onProgress?: (progress: HashProgress) => void
): Promise<HashResult> {
	const results = await runFileHash(file, 'one', algorithm, onProgress);
	return results[0];
}

export async function hashTextAll(text: string): Promise<HashResult[]> {
	return Promise.all(HASH_ALGORITHMS.map((alg) => hashText(text, alg)));
}

export async function hashFileAll(
	file: File,
	onProgress?: (progress: HashProgress) => void
): Promise<HashResult[]> {
	return runFileHash(file, 'all', undefined, onProgress);
}

export interface HashTypeGuess {
	type: string;
	confidence: 'high' | 'medium' | 'low';
	description: string;
	length: number;
}

export function identifyHashType(hash: string): HashTypeGuess[] {
	const trimmed = hash.trim();
	const results: HashTypeGuess[] = [];

	const isHex = /^[a-fA-F0-9]+$/.test(trimmed);
	const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(trimmed) && trimmed.length % 4 === 0;

	if (/^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(trimmed)) {
		results.push({
			type: 'bcrypt',
			confidence: 'high',
			description: 'bcrypt password hash (60 chars, starts with $2)',
			length: 60
		});
		return results;
	}

	if (/^\$argon2(id|i|d)\$/.test(trimmed)) {
		results.push({
			type: 'Argon2',
			confidence: 'high',
			description: 'Argon2 password hash',
			length: trimmed.length
		});
		return results;
	}

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

export function formatSize(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatTime(ms: number): string {
	if (ms < 1) return '<1ms';
	if (ms < 1000) return `${Math.round(ms)}ms`;
	return `${(ms / 1000).toFixed(2)}s`;
}
