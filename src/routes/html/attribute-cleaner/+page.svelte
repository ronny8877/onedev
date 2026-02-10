<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { cleanAttributes } from '$lib/utils/html';
	import { htmlToolsContent } from '$lib/config/content/html-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = htmlToolsContent['attribute-cleaner'];

	let input = $state('');
	let removeInlineStyles = $state(true);
	let removeEmptyAttributes = $state(true);
	let removeDataAttributes = $state(false);
	let removeEventHandlers = $state(true);

	let output = $state('');
	let removedCount = $state(0);

	function handleClean() {
		if (!input.trim()) return;
		
		const result = cleanAttributes(input, {
			removeInlineStyles,
			removeEmptyAttributes,
			removeDataAttributes,
			removeEventHandlers
		});
		
		output = result.output;
		removedCount = result.removed;
	}

	function handleClear() {
		input = '';
		output = '';
		removedCount = 0;
	}

	function loadExample() {
		input = `<div class="container" style="color: red; margin: 10px;">
  <h1 data-test-id="heading">Hello World</h1>
  <p onclick="alert('click')" class="">Paragraph with event handler</p>
  <img src="image.jpg" alt="" data-lazy="true" />
</div>`;
		setTimeout(handleClean, 0);
	}

	function handleSwap() {
		if (output) {
			input = output;
			output = '';
			removedCount = 0;
		}
	}

	// Auto-clean when options change
	$effect(() => {
		// Track all options
		const _ = [removeInlineStyles, removeEmptyAttributes, removeDataAttributes, removeEventHandlers];
		if (input.trim()) {
			handleClean();
		}
	});

	let stats = $derived({
		chars: input.length,
		lines: input.split('\n').length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={handleClear} copyText={output} {stats} />

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm checkbox-primary" bind:checked={removeInlineStyles} />
				<span class="text-sm">Inline styles</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm checkbox-primary" bind:checked={removeEmptyAttributes} />
				<span class="text-sm">Empty attributes</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm checkbox-primary" bind:checked={removeDataAttributes} />
				<span class="text-sm">data-* attributes</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" class="checkbox checkbox-sm checkbox-primary" bind:checked={removeEventHandlers} />
				<span class="text-sm">Event handlers</span>
			</label>
		</div>

		<!-- Controls -->
		<div class="flex items-center gap-3">
			<button type="button" class="btn btn-primary" onclick={handleClean}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
				</svg>
				Clean
			</button>

			{#if output}
				<button type="button" class="btn btn-ghost btn-sm" onclick={handleSwap}>
					Use Output
				</button>
			{/if}

			{#if removedCount > 0}
				<div class="badge badge-success gap-1 ml-auto">
					<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
					</svg>
					Removed {removedCount} attribute{removedCount !== 1 ? 's' : ''}
				</div>
			{/if}
		</div>

		<!-- Editors -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Input</h3>
				<CodeMirrorEditor bind:value={input} placeholder="Paste your HTML here..." />
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Cleaned Output</h3>
				<CodeMirrorEditor value={output} readonly placeholder="Cleaned HTML will appear here..." />
			</div>
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
