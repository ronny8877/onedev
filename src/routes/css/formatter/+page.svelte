<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { formatCSS } from '$lib/utils/css-utils';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cssToolsContent['formatter'];

	let inputCSS = $state('');
	let indentType = $state<'2spaces' | '4spaces' | 'tabs'>('2spaces');

	let indent = $derived(() => {
		switch (indentType) {
			case '4spaces': return '    ';
			case 'tabs': return '\t';
			default: return '  ';
		}
	});

	let formattedCSS = $derived(formatCSS(inputCSS, indent()));

	function loadSample() {
		inputCSS = `.header{display:flex;justify-content:space-between;align-items:center;padding:1rem 2rem;background:#1a1a2e;}.header .logo{font-size:1.5rem;font-weight:bold;color:#fff;}.nav-links{display:flex;gap:1.5rem;}.nav-links a{color:#e0e0e0;text-decoration:none;transition:color 0.3s ease;}.nav-links a:hover{color:#00d9ff;}`;
	}

	function clearAll() {
		inputCSS = '';
	}
</script>

<ToolWrapper
	keywords={['css formatter', 'css beautifier', 'format css', 'css prettify', 'beautify css']}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Settings -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Indentation</h3>
				<div class="flex gap-2">
					{#each [
						{ value: '2spaces', label: '2 Spaces' },
						{ value: '4spaces', label: '4 Spaces' },
						{ value: 'tabs', label: 'Tabs' }
					] as option}
						<button
							class="btn btn-sm"
							class:btn-primary={indentType === option.value}
							onclick={() => indentType = option.value as typeof indentType}
						>
							{option.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Input/Output -->
		<div class="grid lg:grid-cols-2 gap-4">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Input CSS</h3>
					<textarea
						bind:value={inputCSS}
						placeholder="Paste your CSS here..."
						class="textarea textarea-bordered w-full h-64 font-mono text-sm resize-none"
					></textarea>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold">Formatted CSS</h3>
						{#if formattedCSS}
							<CopyButton text={formattedCSS} label="Copy" size="sm" />
						{/if}
					</div>
					<pre class="bg-base-300 p-4 rounded-xl h-64 overflow-auto text-sm font-mono whitespace-pre-wrap break-all max-w-full">{formattedCSS || 'Formatted CSS will appear here...'}</pre>
				</div>
			</div>
		</div>

		<!-- Stats -->
		{#if inputCSS}
			<div class="flex gap-4 text-sm text-base-content/60">
				<span>Input: {inputCSS.length} chars</span>
				<span>Output: {formattedCSS.length} chars</span>
				<span class="text-success">
					+{formattedCSS.length - inputCSS.length} chars (more readable)
				</span>
			</div>
		{/if}
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
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
