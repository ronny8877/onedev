/// <reference lib="webworker" />

import {
	hashBuffer,
	hashBufferAll,
	type HashResult,
	type HashWorkerRequest,
	type HashWorkerResponse
} from './hash-core';

const CHUNK_SIZE = 2 * 1024 * 1024;

async function readFileChunked(file: File, id: number): Promise<Uint8Array> {
	const total = file.size;
	const data = new Uint8Array(total);
	let offset = 0;

	while (offset < total) {
		const end = Math.min(offset + CHUNK_SIZE, total);
		const chunk = new Uint8Array(await file.slice(offset, end).arrayBuffer());
		data.set(chunk, offset);
		offset += chunk.byteLength;
		const percent = total === 0 ? 100 : Math.round((offset / total) * 100);
		const message: HashWorkerResponse = { id, type: 'progress', loaded: offset, total, percent };
		self.postMessage(message);
	}

	if (total === 0) {
		const message: HashWorkerResponse = { id, type: 'progress', loaded: 0, total: 0, percent: 100 };
		self.postMessage(message);
	}

	return data;
}

self.onmessage = async (event: MessageEvent<HashWorkerRequest>) => {
	const { id, kind, algorithm, file } = event.data;
	try {
		const data = await readFileChunked(file, id);
		let results: HashResult[];
		if (kind === 'all') {
			results = await hashBufferAll(data);
		} else {
			if (!algorithm) throw new Error('Missing hash algorithm');
			results = [await hashBuffer(data, algorithm)];
		}
		const message: HashWorkerResponse = { id, type: 'result', results };
		self.postMessage(message);
	} catch (err) {
		const message: HashWorkerResponse = {
			id,
			type: 'error',
			message: err instanceof Error ? err.message : 'Hashing failed'
		};
		self.postMessage(message);
	}
};
