<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadPdfDoc, compressPdf, pdfToBlob, renderPdfToDataUrl, downloadBlob, formatBytes } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import HowTo from '$lib/components/content/HowTo.svelte';
	import type { PDFDocument } from 'pdf-lib';

	const content = pdfToolsContent.compress;

	let file = $state<File | null>(null);
	let pdfDoc = $state<PDFDocument | null>(null);
	let resultBlob = $state<Blob | null>(null);
	let previewDataURL = $state('');
	let showPreview = $state(false);
	let isProcessing = $state(false);
	let originalSize = $state(0);

	async function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		reset();
		file = f;
		originalSize = f.size;
		isProcessing = true;
		pdfDoc = await loadPdfDoc(f);
		isProcessing = false;
	}

	async function compress() {
		if (!file) return;
		isProcessing = true;
		const freshPdf = await loadPdfDoc(file);
		const result = await compressPdf(freshPdf);
		resultBlob = await pdfToBlob(result);
		previewDataURL = await renderPdfToDataUrl(result, 0.5);
		showPreview = true;
		isProcessing = false;
	}

	function download() { if (resultBlob) downloadBlob(resultBlob, 'compressed.pdf'); }
	function reset() { file = null; pdfDoc = null; resultBlob = null; originalSize = 0; previewDataURL = ''; showPreview = false; }
	function loadSample() {}

	let savings = $derived(resultBlob ? Math.round((1 - resultBlob.size / originalSize) * 100) : 0);
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !file}
			<div class="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-base-300 rounded-xl">
				<p class="text-base-content/60">Select a PDF to compress</p>
				<label class="btn btn-primary">
					Open PDF
					<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={handleFile} />
				</label>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				<div class="stats shadow">
					<div class="stat"><div class="stat-title">Original</div><div class="stat-value text-base">{formatBytes(originalSize)}</div></div>
					{#if resultBlob}
						<div class="stat"><div class="stat-title">Compressed</div><div class="stat-value text-base text-success">{formatBytes(resultBlob.size)}</div></div>
						<div class="stat"><div class="stat-title">Saved</div><div class="stat-value text-base text-info">{savings}%</div></div>
					{/if}
				</div>
				<button class="btn btn-primary" onclick={compress} disabled={isProcessing}>
					{isProcessing ? 'Compressing...' : 'Compress PDF'}
				</button>

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
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			{#if content.tips}<Tips tips={content.tips} />{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
