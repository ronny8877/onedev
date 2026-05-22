<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadPdfDoc, addPageNumbers, pdfToBlob, renderPdfToDataUrl, downloadBlob, formatBytes } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import type { PDFDocument } from 'pdf-lib';

	const content = pdfToolsContent['page-numbers'];

	let file = $state<File | null>(null);
	let pdfDoc = $state<PDFDocument | null>(null);
	let fontSize = $state(10);
	let startNum = $state(1);
	let position = $state('bottom-center');
	let resultBlob = $state<Blob | null>(null);
	let previewDataURL = $state('');
	let showPreview = $state(false);
	let isProcessing = $state(false);

	async function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		file = f;
		pdfDoc = await loadPdfDoc(f);
		resultBlob = null;
	}

	async function apply() {
		if (!file) return;
		isProcessing = true;
		const freshPdf = await loadPdfDoc(file);
		const result = await addPageNumbers(freshPdf, { fontSize, start: startNum, position: position as 'bottom-center' | 'bottom-right' | 'top-center' });
		resultBlob = await pdfToBlob(result);
		previewDataURL = await renderPdfToDataUrl(result, 0.5);
		showPreview = true;
		isProcessing = false;
	}

	function download() { if (resultBlob) downloadBlob(resultBlob, 'numbered.pdf'); }
	function reset() { file = null; pdfDoc = null; resultBlob = null; previewDataURL = ''; showPreview = false; }
	function loadSample() {}
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !file}
			<div class="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-base-300 rounded-xl">
				<p class="text-base-content/60">Select a PDF to number</p>
				<label class="btn btn-primary">
					Open PDF
					<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={handleFile} />
				</label>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				<div class="grid gap-4 sm:grid-cols-3">
					<label class="form-control">
						<span class="label label-text">Font Size</span>
						<input type="number" min="6" max="24" bind:value={fontSize} class="input input-bordered input-sm" />
					</label>
					<label class="form-control">
						<span class="label label-text">Start Number</span>
						<input type="number" min="0" bind:value={startNum} class="input input-bordered input-sm" />
					</label>
					<label class="form-control">
						<span class="label label-text">Position</span>
						<select bind:value={position} class="select select-bordered select-sm">
							<option value="bottom-center">Bottom Center</option>
							<option value="bottom-right">Bottom Right</option>
							<option value="top-center">Top Center</option>
						</select>
					</label>
				</div>
				<button class="btn btn-primary" onclick={apply} disabled={isProcessing}>Add Page Numbers</button>
				{#if showPreview && previewDataURL}
					<div class="bg-base-200 rounded-xl p-4">
						<p class="text-sm font-medium mb-2">Preview (page 1)</p>
						<img src={previewDataURL} alt="Preview" class="max-w-md rounded shadow" />
					</div>
				{/if}
				{#if resultBlob}<button class="btn btn-success" onclick={download}>Download ({formatBytes(resultBlob.size)})</button>{/if}
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
