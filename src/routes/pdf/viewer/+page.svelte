<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadPdfJsDoc, renderPage, pageCount, pdfToBlob, downloadBlob, formatBytes } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import type { PDFDocumentProxy } from 'pdfjs-dist';

	const content = pdfToolsContent.viewer;

	let file = $state<File | null>(null);
	let pdfDoc = $state<PDFDocumentProxy | null>(null);
	let currentPage = $state(1);
	let totalPages = $state(0);
	let pageDataURL = $state('');
	let zoom = $state(1.5);
	let isProcessing = $state(false);

	async function loadPdf(file: File) {
		isProcessing = true;
		try {
			pdfDoc = await loadPdfJsDoc(file);
			totalPages = pageCount(pdfDoc);
			currentPage = 1;
			await render();
		} catch {
			pdfDoc = null;
			totalPages = 0;
		}
		isProcessing = false;
	}

	async function render() {
		if (!pdfDoc) return;
		pageDataURL = await renderPage(pdfDoc, currentPage, zoom);
	}

	async function goTo(page: number) {
		if (!pdfDoc || page < 1 || page > totalPages) return;
		currentPage = page;
		await render();
	}

	async function changeZoom(d: number) {
		zoom = Math.max(0.5, Math.min(3, zoom + d));
		await render();
	}

	function reset() {
		file = null;
		pdfDoc = null;
		currentPage = 1;
		totalPages = 0;
		pageDataURL = '';
	}

	async function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (f) {
			file = f;
			await loadPdf(f);
		}
	}

	function loadSample() {}
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !file}
			<div class="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-base-300 rounded-xl">
				<svg class="w-12 h-12 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
				<p class="text-base-content/60">Drop a PDF here or click to select</p>
				<label class="btn btn-primary">
					Open PDF
					<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={handleFileInput} />
				</label>
			</div>
		{:else if isProcessing}
			<div class="flex items-center justify-center py-12">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{:else if pdfDoc}
			<div class="flex flex-col gap-4">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="flex items-center gap-2">
						<button class="btn btn-sm btn-ghost" onclick={() => goTo(currentPage - 1)} disabled={currentPage <= 1}>← Prev</button>
						<span class="text-sm tabular-nums">{currentPage} / {totalPages}</span>
						<button class="btn btn-sm btn-ghost" onclick={() => goTo(currentPage + 1)} disabled={currentPage >= totalPages}>Next →</button>
					</div>
					<div class="flex items-center gap-2">
						<button class="btn btn-sm btn-ghost" onclick={() => changeZoom(-0.25)} disabled={zoom <= 0.5}>−</button>
						<span class="text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
						<button class="btn btn-sm btn-ghost" onclick={() => changeZoom(0.25)} disabled={zoom >= 3}>+</button>
					</div>
				</div>
				<div class="bg-base-200 rounded-xl p-4 flex justify-center overflow-auto">
					{#if pageDataURL}
						<img src={pageDataURL} alt={`Page ${currentPage}`} class="max-w-full shadow-lg rounded" />
					{/if}
				</div>
			</div>
		{/if}

		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
