<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadPdfDoc, addTextWatermark, pdfToBlob, renderPdfToDataUrl, downloadBlob, formatBytes } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = pdfToolsContent.watermark;

	let file = $state<File | null>(null);
	let text = $state('CONFIDENTIAL');
	let opacity = $state(0.15);
	let colorHex = $state('#666666');
	let mode = $state<'single' | 'tile'>('tile');
	let rotation = $state(45);
	let density = $state(1);
	let fontSize = $state(48);
	let resultBlob = $state<Blob | null>(null);
	let previewDataURL = $state('');
	let showPreview = $state(false);
	let isProcessing = $state(false);

	let color = $derived(() => {
		const h = colorHex.replace('#', '');
		return [parseInt(h.slice(0, 2), 16) / 255, parseInt(h.slice(2, 4), 16) / 255, parseInt(h.slice(4, 6), 16) / 255] as [number, number, number];
	});

	async function handleFile(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		file = f;
		resultBlob = null;
		showPreview = false;
	}

	async function apply() {
		if (!file) return;
		isProcessing = true;
		// Reload fresh from original file to avoid layering watermarks
		const freshPdf = await loadPdfDoc(file);
		const result = await addTextWatermark(freshPdf, text, {
			opacity,
			color: color(),
			mode,
			rotate: rotation,
			density,
			fontSize,
		});
		resultBlob = await pdfToBlob(result);
		previewDataURL = await renderPdfToDataUrl(result, 0.5);
		showPreview = true;
		isProcessing = false;
	}

	function download() { if (resultBlob) downloadBlob(resultBlob, 'watermarked.pdf'); }
	function reset() { file = null; text = 'CONFIDENTIAL'; opacity = 0.12; mode = 'tile'; rotation = 45; density = 1; fontSize = 48; resultBlob = null; previewDataURL = ''; showPreview = false; }
	function loadSample() {}
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !file}
			<div class="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-base-300 rounded-xl">
				<p class="text-base-content/60">Select a PDF to watermark</p>
				<label class="btn btn-primary">
					Open PDF
					<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={handleFile} />
				</label>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<label class="form-control">
						<span class="label label-text">Watermark Text</span>
						<input type="text" class="input input-bordered input-sm" bind:value={text} />
					</label>
					<label class="form-control">
						<span class="label label-text">Color</span>
						<div class="flex items-center gap-2">
							<input type="color" class="w-10 h-10 rounded cursor-pointer border-0 p-0" bind:value={colorHex} />
							<span class="text-xs font-mono">{colorHex}</span>
						</div>
					</label>
					<label class="form-control">
						<span class="label label-text">Font Size: {fontSize}pt</span>
						<input type="range" min="16" max="120" step="4" bind:value={fontSize} class="range range-sm" />
					</label>
				</div>

				<div class="flex flex-wrap gap-4">
					<label class="form-control max-w-xs">
						<span class="label label-text">Opacity: {Math.round(opacity * 100)}%</span>
						<input type="range" min="0.02" max="0.5" step="0.02" bind:value={opacity} class="range range-sm" />
					</label>
					<label class="form-control max-w-xs">
						<span class="label label-text">Rotation: {rotation}°</span>
						<input type="range" min="0" max="90" step="5" bind:value={rotation} class="range range-sm" />
					</label>
				</div>

				<div class="flex flex-wrap gap-4">
					<label class="form-control">
						<span class="label label-text">Mode</span>
						<div class="tabs tabs-boxed">
							<button class="tab" class:tab-active={mode === 'tile'} onclick={() => mode = 'tile'}>Tile (Full Page)</button>
							<button class="tab" class:tab-active={mode === 'single'} onclick={() => mode = 'single'}>Single (Center)</button>
						</div>
					</label>
					{#if mode === 'tile'}
						<label class="form-control max-w-xs">
							<span class="label label-text">Density: {density === 0.5 ? 'Dense' : density === 1 ? 'Normal' : density === 2 ? 'Sparse' : density === 3 ? 'Very Sparse' : `${density}x`}</span>
							<input type="range" min="0.5" max="3" step="0.5" bind:value={density} class="range range-sm" />
						</label>
					{/if}
				</div>

				<button class="btn btn-primary" onclick={apply} disabled={isProcessing}>
					{isProcessing ? 'Applying...' : 'Apply Watermark'}
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
			{#if content.tips}<Tips tips={content.tips} />{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
