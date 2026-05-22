<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadPdfDoc, loadPdfJsDoc, renderPage, pageCount, extractPages, pdfToBlob, renderPdfToDataUrl, downloadBlob, formatBytes } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import type { PDFDocumentProxy } from 'pdfjs-dist';
	import type { PDFDocument } from 'pdf-lib';

	const content = pdfToolsContent.split;

	let file = $state<File | null>(null);
	let pdfDoc = $state<PDFDocument | null>(null);
	let pdfJsDoc = $state<PDFDocumentProxy | null>(null);
	let totalPages = $state(0);
	let pageRange = $state('');
	let pagePreviews = $state<string[]>([]);
	let resultBlob = $state<Blob | null>(null);
	let previewDataURL = $state('');
	let showPreview = $state(false);
	let isProcessing = $state(false);

	async function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		reset();
		file = f;
		isProcessing = true;
		try {
			pdfDoc = await loadPdfDoc(f);
			pdfJsDoc = await loadPdfJsDoc(f);
			totalPages = pageCount(pdfJsDoc);
			for (let i = 1; i <= totalPages; i++) {
				pagePreviews.push(await renderPage(pdfJsDoc, i, 0.3));
			}
		} catch { /* ignore */ }
		isProcessing = false;
	}

	function parseRange(r: string): number[] {
		const p = new Set<number>();
		const parts = r.split(',').map(s => s.trim()).filter(Boolean);
		for (const part of parts) {
			if (part.includes('-')) {
				const [a, b] = part.split('-').map(Number);
				for (let i = a; i <= b; i++) if (i >= 1 && i <= totalPages) p.add(i - 1);
			} else {
				const n = parseInt(part);
				if (n >= 1 && n <= totalPages) p.add(n - 1);
			}
		}
		return Array.from(p).sort((a, b) => a - b);
	}

	async function split() {
		if (!pdfDoc || !pageRange.trim()) return;
		isProcessing = true;
		const indices = parseRange(pageRange);
		if (indices.length === 0) { isProcessing = false; return; }
		const result = await extractPages(pdfDoc, indices);
		resultBlob = await pdfToBlob(result);
		previewDataURL = await renderPdfToDataUrl(result, 0.5);
		showPreview = true;
		isProcessing = false;
	}

	function download() { if (resultBlob) downloadBlob(resultBlob, 'split.pdf'); }
	function reset() { file = null; pdfDoc = null; pdfJsDoc = null; totalPages = 0; pageRange = ''; pagePreviews = []; resultBlob = null; previewDataURL = ''; showPreview = false; }
	function loadSample() {}
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !file}
			<div class="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-base-300 rounded-xl">
				<p class="text-base-content/60">Select a PDF to split</p>
				<label class="btn btn-primary">
					Open PDF
					<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={handleFile} />
				</label>
			</div>
		{:else if isProcessing}
			<div class="flex items-center justify-center py-12"><span class="loading loading-spinner loading-lg text-primary"></span></div>
		{:else}
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-3">
					<input type="text" class="input input-bordered input-sm w-64" bind:value={pageRange} placeholder="e.g. 1-3,5,7-9" />
					<span class="text-xs text-base-content/60">e.g. 1-3,5,7-9</span>
				</div>
				<div class="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
					{#each pagePreviews as preview, i}
						<div class="relative rounded border border-base-300 w-20 h-28 overflow-hidden">
							<img src={preview} alt={`Page ${i + 1}`} class="w-full h-full object-cover" />
							<div class="absolute bottom-0 inset-x-0 bg-base-200/90 text-center text-xs py-0.5">{i + 1}</div>
						</div>
					{/each}
				</div>
				<button class="btn btn-primary" onclick={split} disabled={!pageRange.trim()}>Split PDF</button>
				{#if showPreview && previewDataURL}
					<div class="bg-base-200 rounded-xl p-4">
						<p class="text-sm font-medium mb-2">Preview (page 1)</p>
						<img src={previewDataURL} alt="Preview" class="max-w-md rounded shadow" />
					</div>
				{/if}
				{#if resultBlob}
					<button class="btn btn-success" onclick={download}>Download ({formatBytes(resultBlob.size)})</button>
				{/if}
			</div>
		{/if}

		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}<Tips tips={content.tips} />{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
