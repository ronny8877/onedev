import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import type { PDFDocumentProxy } from 'pdfjs-dist';

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfJs() {
	if (!pdfjsLib) {
		pdfjsLib = await import('pdfjs-dist');
		pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
	}
	return pdfjsLib;
}

export { PDFDocument, rgb, StandardFonts, degrees };

// ── File loading ──

export async function loadPdfDoc(file: File): Promise<PDFDocument> {
	const buf = await file.arrayBuffer();
	return PDFDocument.load(buf, { ignoreEncryption: true });
}

export async function loadPdfJsDoc(file: File): Promise<PDFDocumentProxy> {
	const lib = await getPdfJs();
	const buf = await file.arrayBuffer();
	return lib.getDocument({ data: buf.slice(0) }).promise;
}

// ── Rendering ──

export async function renderPage(pdfDoc: PDFDocumentProxy, pageNum: number, scale = 1.5) {
	const page = await pdfDoc.getPage(pageNum);
	const viewport = page.getViewport({ scale });
	const canvas = document.createElement('canvas');
	canvas.width = viewport.width;
	canvas.height = viewport.height;
	const ctx = canvas.getContext('2d')!;
	await page.render({ canvasContext: ctx, viewport }).promise;
	return canvas.toDataURL();
}

// ── Output ──

export async function pdfToBlob(pdf: PDFDocument): Promise<Blob> {
	const bytes = await pdf.save({ useObjectStreams: true });
	return new Blob([bytes], { type: 'application/pdf' });
}

export function downloadBlob(blob: Blob, name: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name.endsWith('.pdf') ? name : `${name}.pdf`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

// Render a PDFDocument (pdf-lib) to a data URL for preview
export async function renderPdfToDataUrl(pdf: PDFDocument, scale = 1.0): Promise<string> {
	const lib = await getPdfJs();
	const bytes = await pdf.save({ useObjectStreams: false });
	const blob = new Blob([bytes], { type: 'application/pdf' });
	const url = URL.createObjectURL(blob);
	const pdfJsDoc = await lib.getDocument(url).promise;
	const dataUrl = await renderPage(pdfJsDoc, 1, scale);
	pdfJsDoc.destroy();
	URL.revokeObjectURL(url);
	return dataUrl;
}

// ── Info ──

export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const u = ['B', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${u[i]}`;
}

export function pageCount(doc: PDFDocumentProxy | PDFDocument): number {
	if ('numPages' in doc) return doc.numPages;
	return doc.getPageCount();
}

// ── Operations ──

export async function extractPages(srcDoc: PDFDocument, indices: number[]): Promise<PDFDocument> {
	const newDoc = await PDFDocument.create();
	const sorted = indices.sort((a, b) => a - b);
	const pages = await newDoc.copyPages(srcDoc, sorted);
	for (const p of pages) newDoc.addPage(p);
	return newDoc;
}

export async function mergePdfs(files: File[]): Promise<PDFDocument> {
	const merged = await PDFDocument.create();
	for (const file of files) {
		const doc = await loadPdfDoc(file);
		const pages = await merged.copyPages(doc, doc.getPageIndices());
		for (const p of pages) merged.addPage(p);
	}
	return merged;
}

export async function compressPdf(pdf: PDFDocument): Promise<PDFDocument> {
	const bytes = await pdf.save({ useObjectStreams: true, objectsPerTick: 100 });
	return PDFDocument.load(bytes, { ignoreEncryption: true });
}

// Watermark tile across entire page
export async function addTextWatermark(
	pdf: PDFDocument,
	text: string,
	opts: {
		fontSize?: number;
		opacity?: number;
		color?: [number, number, number];
		rotate?: number;
		mode?: 'single' | 'tile';
		position?: 'center' | 'tile';
		density?: number;
	} = {}
): Promise<PDFDocument> {
	const { fontSize = 48, opacity = 0.12, color = [0.5, 0.5, 0.5], mode = 'tile', density = 1 } = opts;
	const rotation = opts.rotate ?? 45;
	const font = await pdf.embedFont(StandardFonts.HelveticaBold);
	const pages = pdf.getPages();
	const tw = font.widthOfTextAtSize(text, fontSize);
	const th = fontSize;

	for (const page of pages) {
		const { width, height } = page.getSize();

		if (mode === 'single') {
			page.drawText(text, {
				x: width / 2 - tw / 2,
				y: height / 2,
				font,
				size: fontSize,
				opacity,
				color: rgb(...color),
				rotate: degrees(rotation),
			});
		}

		if (mode === 'tile') {
			const rad = (rotation * Math.PI) / 180;
			const diagW = Math.abs(tw * Math.cos(rad)) + Math.abs(th * Math.sin(rad));
			const diagH = Math.abs(tw * Math.sin(rad)) + Math.abs(th * Math.cos(rad));
			const baseSpacing = 3;
			const spacingX = diagW * baseSpacing * density;
			const spacingY = diagH * baseSpacing * density;
			const cols = Math.ceil(width / spacingX) + 1;
			const rows = Math.ceil(height / spacingY) + 1;

			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < cols; col++) {
					const sx = col * spacingX + ((row % 2) * spacingX * 0.5);
					const sy = row * spacingY;
					page.drawText(text, {
						x: sx,
						y: sy,
						font,
						size: fontSize,
						opacity,
						color: rgb(...color),
						rotate: degrees(rotation),
					});
				}
			}
		}
	}
	return pdf;
}

export async function addPageNumbers(
	pdf: PDFDocument,
	opts: { fontSize?: number; start?: number; position?: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' } = {}
): Promise<PDFDocument> {
	const { fontSize = 10, start = 1, position = 'bottom-center' } = opts;
	const font = await pdf.embedFont(StandardFonts.Helvetica);
	const pages = pdf.getPages();
	for (let i = 0; i < pages.length; i++) {
		const page = pages[i];
		const { width, height } = page.getSize();
		const text = String(start + i);
		const textWidth = font.widthOfTextAtSize(text, fontSize);

		let x: number, y: number;
		const bottomY = 25;
		switch (position) {
			case 'bottom-left': x = 30; y = bottomY; break;
			case 'bottom-right': x = width - textWidth - 30; y = bottomY; break;
			case 'top-center': x = width / 2 - textWidth / 2; y = height - fontSize - 25; break;
			case 'bottom-center':
			default: x = width / 2 - textWidth / 2; y = bottomY; break;
		}
		page.drawText(text, { x, y, font, size: fontSize, color: rgb(0, 0, 0) });
	}
	return pdf;
}

export async function redactAreas(
	pdf: PDFDocument,
	redactions: { page: number; x: number; y: number; w: number; h: number }[],
	displayScale = 1
): Promise<PDFDocument> {
	const pages = pdf.getPages();
	for (const r of redactions) {
		const page = pages[r.page];
		if (!page) continue;
		const { height } = page.getSize();
		const rx = r.x / displayScale;
		const ry = height - (r.y / displayScale) - (r.h / displayScale);
		const rw = r.w / displayScale;
		const rh = r.h / displayScale;
		page.drawRectangle({ x: rx, y: ry, width: rw, height: rh, color: rgb(0, 0, 0) });
	}
	return pdf;
}

export async function signPdf(
	pdf: PDFDocument,
	signatureImage: File | string,
	opts: { page?: number; x?: number; y?: number; width?: number; height?: number; displayScale?: number } = {}
): Promise<PDFDocument> {
	const { page: pageIdx = 0, x = 50, y = 50, width = 150, height = 50, displayScale = 1 } = opts;
	let imageBytes: ArrayBuffer;
	if (typeof signatureImage === 'string') {
		const resp = await fetch(signatureImage);
		imageBytes = await resp.arrayBuffer();
	} else {
		imageBytes = await signatureImage.arrayBuffer();
	}
	const isPng = typeof signatureImage === 'string'
		? signatureImage.endsWith('.png') || signatureImage.startsWith('data:image/png')
		: signatureImage.type === 'image/png';
	const image = isPng ? await pdf.embedPng(imageBytes) : await pdf.embedJpg(imageBytes);
	const pages = pdf.getPages();
	const page = pages[pageIdx];
	if (page) {
		const { height: pageH } = page.getSize();
		page.drawImage(image, {
			x: x / displayScale,
			y: pageH - (y / displayScale) - (height / displayScale),
			width: width / displayScale,
			height: height / displayScale,
		});
	}
	return pdf;
}

export async function imagesToPdfWithPlacement(
	images: Array<{
		file: File;
		x?: number;
		y?: number;
		width?: number;
		height?: number;
		rotate?: number;
	}>,
	opts: { pageWidth?: number; pageHeight?: number; onePerPage?: boolean } = {}
): Promise<PDFDocument> {
	const { pageWidth = 595, pageHeight = 842, onePerPage = true } = opts;
	const doc = await PDFDocument.create();
	const margin = 40;

	for (const img of images) {
		const buf = await img.file.arrayBuffer();
		const isPng = img.file.type === 'image/png';
		const image = isPng ? await doc.embedPng(buf) : await doc.embedJpg(buf);
		const page = doc.addPage([pageWidth, pageHeight]);

		const imgDims = img.width && img.height
			? { width: img.width, height: img.height }
			: image.scaleToFit(pageWidth - margin * 2, pageHeight - margin * 2);

		const ix = img.x ?? (pageWidth - imgDims.width) / 2;
		const iy = img.y ?? (pageHeight - imgDims.height) / 2;

		const drawOpts: Record<string, unknown> = {
			x: ix,
			y: pageHeight - iy - imgDims.height,
			width: imgDims.width,
			height: imgDims.height,
		};

		if (img.rotate) {
			drawOpts.rotate = degrees(img.rotate);
		}

		page.drawImage(image, drawOpts as Parameters<typeof page.drawImage>[1]);
	}
	return doc;
}
