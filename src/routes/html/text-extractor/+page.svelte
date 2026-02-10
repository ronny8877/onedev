<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { htmlToText } from '$lib/utils/html';
	import { htmlToolsContent } from '$lib/config/content/html-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = htmlToolsContent['text-extractor'];

	let input = $state('');
	let preserveLineBreaks = $state(true);
	let keepLinkUrls = $state(false);
	let collapseWhitespace = $state(true);

	const output = $derived.by(() => {
		if (!input.trim()) return '';
		return htmlToText(input, {
			preserveLineBreaks,
			keepLinkUrls,
			collapseWhitespace
		});
	});

	const stats = $derived.by(() => {
		if (!output) return undefined;
		return {
			chars: output.length,
			words: output.trim().split(/\s+/).filter(Boolean).length,
			lines: output.split('\n').length
		};
	});

	function handleClear() {
		input = '';
	}

	function loadExample() {
		input = `<div class="content">
  <h1>Welcome</h1>
  <p>This is a <strong>sample</strong> text.</p>
  <p>Visit <a href="https://example.com">Example</a> for more.</p>
</div>`;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={handleClear} copyText={output} stats={stats} />

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={preserveLineBreaks} />
				<span class="text-sm">Preserve line breaks</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={keepLinkUrls} />
				<span class="text-sm">Keep link URLs</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={collapseWhitespace} />
				<span class="text-sm">Collapse whitespace</span>
			</label>
		</div>

		<!-- Input -->
		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">HTML Input</h3>
			<CodeMirrorEditor bind:value={input} placeholder="Paste your HTML here..." />
		</div>

		<!-- Output -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Extracted Text</h3>
			</div>
			<textarea
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48 bg-base-200"
				readonly
				value={output}
				placeholder="Extracted text will appear here..."
			></textarea>
		</div>

		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
