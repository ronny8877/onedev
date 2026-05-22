<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { mergePdfs, pdfToBlob, renderPdfToDataUrl, downloadBlob, formatBytes } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = pdfToolsContent.merge;

	let files = $state<File[]>([]);
	let resultBlob = $state<Blob | null>(null);
	let previewDataURL = $state('');
	let showPreview = $state(false);
	let isProcessing = $state(false);

	function handleFiles(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;
		files = [...files, ...Array.from(input.files).filter(f => f.type === 'application/pdf')];
		input.value = '';
	}

	function remove(i: number) { files = files.filter((_, idx) => idx !== i); resultBlob = null; }
	function moveUp(i: number) { if (i > 0) { [files[i], files[i - 1]] = [files[i - 1], files[i]]; resultBlob = null; } }
	function moveDown(i: number) { if (i < files.length - 1) { [files[i], files[i + 1]] = [files[i + 1], files[i]]; resultBlob = null; } }

	async function merge() {
		if (files.length < 2) return;
		isProcessing = true;
		const result = await mergePdfs(files);
		resultBlob = await pdfToBlob(result);
		previewDataURL = await renderPdfToDataUrl(result, 0.5);
		showPreview = true;
		isProcessing = false;
	}

	function download() { if (resultBlob) downloadBlob(resultBlob, 'merged.pdf'); }
	function reset() { files = []; resultBlob = null; previewDataURL = ''; showPreview = false; }
	function loadSample() {}
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		<div class="flex flex-col gap-4">
			<label class="btn btn-outline w-fit">
				Add PDF Files
				<input type="file" accept=".pdf,application/pdf" multiple class="hidden" onchange={handleFiles} />
			</label>

			{#if files.length > 0}
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead><tr><th>Order</th><th>Filename</th><th>Size</th><th></th></tr></thead>
						<tbody>
							{#each files as f, i}
								<tr>
									<td><div class="flex gap-1"><button class="btn btn-ghost btn-xs" onclick={() => moveUp(i)} disabled={i === 0}>↑</button><button class="btn btn-ghost btn-xs" onclick={() => moveDown(i)} disabled={i === files.length - 1}>↓</button></div></td>
									<td class="text-sm">{f.name}</td>
									<td class="text-sm tabular-nums">{formatBytes(f.size)}</td>
									<td><button class="btn btn-ghost btn-xs text-error" onclick={() => remove(i)}>×</button></td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="text-sm text-base-content/60">{files.length} files</div>
				<button class="btn btn-primary" onclick={merge} disabled={files.length < 2 || isProcessing}>
					{isProcessing ? 'Merging...' : 'Merge PDFs'}
				</button>
				{#if showPreview && previewDataURL}
					<div class="bg-base-200 rounded-xl p-4">
						<p class="text-sm font-medium mb-2">Preview (page 1)</p>
						<img src={previewDataURL} alt="Preview" class="max-w-md rounded shadow" />
					</div>
				{/if}
				{#if resultBlob}<button class="btn btn-success" onclick={download}>Download ({formatBytes(resultBlob.size)})</button>{/if}
			{/if}
		</div>

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
