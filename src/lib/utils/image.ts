// Image utility functions

/**
 * Debounce a function - returns a debounced version that only executes after delay
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Read a file as a data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

/**
 * Read a file as an ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as ArrayBuffer);
		reader.onerror = reject;
		reader.readAsArrayBuffer(file);
	});
}

/**
 * Load an image from a URL/data URL and return an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

/**
 * Load an image into a canvas
 */
export async function loadImageAsCanvas(src: string): Promise<HTMLCanvasElement> {
	const img = await loadImage(src);
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d')!;
	ctx.drawImage(img, 0, 0);
	return canvas;
}

/**
 * Convert a canvas to a blob
 */
export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality = 0.92): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob);
				else reject(new Error('Failed to convert canvas to blob'));
			},
			type,
			quality
		);
	});
}

/**
 * Convert a canvas to a data URL
 */
export function canvasToDataURL(canvas: HTMLCanvasElement, type = 'image/png', quality = 0.92): string {
	return canvas.toDataURL(type, quality);
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

/**
 * Download a data URL as a file
 */
export function downloadDataURL(dataURL: string, filename: string): void {
	const a = document.createElement('a');
	a.href = dataURL;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get image dimensions from a file
 */
export async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
	const dataURL = await readFileAsDataURL(file);
	const img = await loadImage(dataURL);
	return { width: img.width, height: img.height };
}

/**
 * Get the file extension from a mime type
 */
export function mimeToExtension(mime: string): string {
	const map: Record<string, string> = {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/webp': 'webp',
		'image/gif': 'gif',
		'image/bmp': 'bmp'
	};
	return map[mime] || 'png';
}

/**
 * Get mime type from file extension
 */
export function extensionToMime(ext: string): string {
	const map: Record<string, string> = {
		jpg: 'image/jpeg',
		jpeg: 'image/jpeg',
		png: 'image/png',
		webp: 'image/webp',
		gif: 'image/gif',
		bmp: 'image/bmp'
	};
	return map[ext.toLowerCase()] || 'image/png';
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
	return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Replace file extension
 */
export function replaceExtension(filename: string, newExt: string): string {
	const base = filename.replace(/\.[^/.]+$/, '');
	return `${base}.${newExt}`;
}
