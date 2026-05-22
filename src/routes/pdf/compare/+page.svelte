<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadPdfJsDoc, renderPage } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import type { PDFDocumentProxy } from 'pdfjs-dist';

	const content = pdfToolsContent.compare;

	let file1 = $state<File | null>(null);
	let file2 = $state<File | null>(null);
	let doc1 = $state<PDFDocumentProxy | null>(null);
	let doc2 = $state<PDFDocumentProxy | null>(null);
	let page1 = $state('');
	let page2 = $state('');
	let currentPage = $state(1);
	let maxPages = $state(0);
	let isProcessing = $state(false);
	let diffDataURL = $state('');

	async function loadFile1(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		file1 = f;
		doc1 = await loadPdfJsDoc(f);
		await refreshPages();
	}

	async function loadFile2(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		file2 = f;
		doc2 = await loadPdfJsDoc(f);
		await refreshPages();
	}

	async function refreshPages() {
		if (!doc1 || !doc2) return;
		maxPages = Math.min(doc1.numPages, doc2.numPages);
		currentPage = 1;
		await renderDiff();
	}

	async function renderDiff() {
		if (!doc1 || !doc2) return;
		isProcessing = true;
		page1 = await renderPage(doc1, currentPage, 1.5);
		page2 = await renderPage(doc2, currentPage, 1.5);
		diffDataURL = '';
		isProcessing = false;
	}

	function goTo(p: number) {
		if (p < 1 || p > maxPages) return;
		currentPage = p;
		renderDiff();
	}

	function reset() { file1 = null; file2 = null; doc1 = null; doc2 = null; page1 = ''; page2 = ''; diffDataURL = ''; }
	function loadSample() {}
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !doc1 || !doc2}
			<div class="grid sm:grid-cols-2 gap-4">
				<div class="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-base-300 rounded-xl">
					<p class="text-sm text-base-content/60">Original PDF</p>
					<label class="btn btn-outline btn-sm">
						Select File
						<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={loadFile1} />
					</label>
					{#if file1}<p class="text-xs text-success">{file1.name}</p>{/if}
				</div>
				<div class="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-base-300 rounded-xl">
					<p class="text-sm text-base-content/60">Updated PDF</p>
					<label class="btn btn-outline btn-sm">
						Select File
						<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={loadFile2} />
					</label>
					{#if file2}<p class="text-xs text-success">{file2.name}</p>{/if}
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				<div class="flex items-center gap-3">
					<button class="btn btn-sm btn-ghost" onclick={() => goTo(currentPage - 1)} disabled={currentPage <= 1}>←</button>
					<span class="text-sm">{currentPage} / {maxPages}</span>
					<button class="btn btn-sm btn-ghost" onclick={() => goTo(currentPage + 1)} disabled={currentPage >= maxPages}>→</button>
				</div>
				<div class="grid lg:grid-cols-2 gap-4">
					<div class="bg-base-200 rounded-xl p-2">
						<p class="text-xs text-base-content/60 mb-1">Original</p>
						{#if page1}<img src={page1} alt="Original" class="max-w-full rounded" />{/if}
					</div>
					<div class="bg-base-200 rounded-xl p-2">
						<p class="text-xs text-base-content/60 mb-1">Updated</p>
						{#if page2}<img src={page2} alt="Updated" class="max-w-full rounded" />{/if}
					</div>
				</div>
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
