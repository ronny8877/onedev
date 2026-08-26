export function base64UrlDecode(str: string): string {
	let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	const padding = base64.length % 4;
	if (padding) {
		base64 += '='.repeat(4 - padding);
	}

	let binary: string;
	try {
		binary = atob(base64);
	} catch {
		throw new Error('Invalid Base64URL encoding');
	}

	const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
	return new TextDecoder('utf-8').decode(bytes);
}
