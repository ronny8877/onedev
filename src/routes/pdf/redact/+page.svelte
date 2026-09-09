<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadPdfDoc, loadPdfJsDoc, renderPage, pageCount, redactAreas, pdfToBlob, renderPdfToDataUrl, downloadBlob, formatBytes, PDFDocument } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import type { PDFDocumentProxy } from 'pdfjs-dist';

	const content = pdfToolsContent.redact;

	let file = $state<File | null>(null);
	let pdfDoc = $state<PDFDocument | null>(null);
	let pdfJsDoc = $state<PDFDocumentProxy | null>(null);
	let totalPages = $state(0);
	let currentPage = $state(1);
	let pageDataURL = $state('');
	let resultBlob = $state<Blob | null>(null);
	let previewDataURL = $state('');
	let isProcessing = $state(false);

	let redactions = $state<{ page: number; x: number; y: number; w: number; h: number }[]>([]);
	let isDrawing = $state(false);
	let drawStart = $state({ x: 0, y: 0 });
	let drawCurrent = $state({ x: 0, y: 0 });
	let imgRef = $state<HTMLImageElement | undefined>();
	let containerRef = $state<HTMLDivElement | undefined>();

	async function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		reset();
		file = f;
		isProcessing = true;
		pdfDoc = await loadPdfDoc(f);
		pdfJsDoc = await loadPdfJsDoc(f);
		totalPages = pageCount(pdfJsDoc);
		currentPage = 1;
		await loadPage();
		isProcessing = false;
	}

	async function loadPage() {
		if (!pdfJsDoc) return;
		pageDataURL = await renderPage(pdfJsDoc, currentPage, 1.5);
	}

	async function goTo(p: number) {
		if (!pdfJsDoc || p < 1 || p > totalPages) return;
		currentPage = p;
		await loadPage();
	}

	function mouseDown(e: MouseEvent) {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		drawStart = { x, y };
		drawCurrent = { x, y };
		isDrawing = true;
		e.preventDefault();
	}

	function mouseMove(e: MouseEvent) {
		if (!isDrawing || !containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		drawCurrent = { x: e.clientX - rect.left, y: e.clientY - rect.top };
	}

	function mouseUp() {
		if (!isDrawing) return;
		isDrawing = false;
		const w = Math.abs(drawCurrent.x - drawStart.x);
		const h = Math.abs(drawCurrent.y - drawStart.y);
		if (w > 5 && h > 5) {
			const rx = Math.min(drawStart.x, drawCurrent.x);
			const ry = Math.min(drawStart.y, drawCurrent.y);
			redactions = [...redactions, { page: currentPage - 1, x: rx, y: ry, w, h }];
		}
	}

	async function apply() {
		if (!file) return;
		isProcessing = true;
		const freshPdf = await loadPdfDoc(file);
		const result = await redactAreas(freshPdf, redactions, 1.5);
		resultBlob = await pdfToBlob(result);
		previewDataURL = await renderPdfToDataUrl(result, 0.5);
		isProcessing = false;
	}

	function undo() { redactions = redactions.slice(0, -1); }

	let currentRedactions = $derived(redactions.filter(r => r.page === currentPage - 1));
	let drawRect = $derived(isDrawing ? {
		x: Math.min(drawStart.x, drawCurrent.x),
		y: Math.min(drawStart.y, drawCurrent.y),
		w: Math.abs(drawCurrent.x - drawStart.x),
		h: Math.abs(drawCurrent.y - drawStart.y),
	} : null);

	function download() { if (resultBlob) downloadBlob(resultBlob, 'redacted.pdf'); }
	function reset() { file = null; pdfDoc = null; pdfJsDoc = null; totalPages = 0; currentPage = 1; pageDataURL = ''; redactions = []; resultBlob = null; previewDataURL = ''; }
	function loadSample() {}
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !file}
			<div class="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-base-300 rounded-xl">
				<p class="text-base-content/60">Select a PDF to redact</p>
				<label class="btn btn-primary">
					Open PDF
					<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={handleFile} />
				</label>
			</div>
		{:else if isProcessing && !pageDataURL}
			<div class="flex items-center justify-center py-12"><span class="loading loading-spinner loading-lg text-primary"></span></div>
		{:else}
			<div class="flex flex-col gap-4">
				<div class="flex flex-wrap items-center gap-3 justify-between">
					<div class="flex items-center gap-3">
						<button class="btn btn-sm btn-ghost" onclick={() => goTo(currentPage - 1)} disabled={currentPage <= 1}>←</button>
						<span class="text-sm">{currentPage} / {totalPages}</span>
						<button class="btn btn-sm btn-ghost" onclick={() => goTo(currentPage + 1)} disabled={currentPage >= totalPages}>→</button>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-sm text-base-content/60">{redactions.length} redactions total</span>
						<button class="btn btn-sm btn-ghost text-error" onclick={undo} disabled={redactions.length === 0}>Undo Last</button>
					</div>
				</div>

				<div bind:this={containerRef} class="relative inline-block bg-base-300 rounded-xl select-none" onmousedown={mouseDown} onmousemove={mouseMove} onmouseup={mouseUp} onmouseleave={mouseUp}>
					{#if pageDataURL}
						<img bind:this={imgRef} src={pageDataURL} alt={`Page ${currentPage}`} class="max-w-full rounded" />
					{/if}
					<!-- Existing redactions on this page -->
					{#each currentRedactions as r}
						<div class="absolute bg-black border border-red-500/50" style="left:{r.x}px; top:{r.y}px; width:{r.w}px; height:{r.h}px;"></div>
					{/each}
					<!-- Current drawing rectangle -->
					{#if drawRect}
						<div class="absolute bg-black/60 border-2 border-red-500 border-dashed" style="left:{drawRect.x}px; top:{drawRect.y}px; width:{drawRect.w}px; height:{drawRect.h}px;"></div>
					{/if}
				</div>
				<p class="text-xs text-base-content/60">Click and drag to draw redaction rectangles on the page above</p>

				<button class="btn btn-primary" onclick={apply} disabled={redactions.length === 0 || isProcessing}>
					{isProcessing ? 'Applying...' : 'Apply Redactions'}
				</button>

				{#if previewDataURL}
					<div class="bg-base-200 rounded-xl p-4">
						<p class="text-sm font-medium mb-2">Preview (page 1 after redaction)</p>
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
