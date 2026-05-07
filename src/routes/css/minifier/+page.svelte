<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { minifyCSS } from '$lib/utils/css-utils';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cssToolsContent['minifier'];

	let inputCSS = $state('');
	let minifiedCSS = $derived(minifyCSS(inputCSS));

	let savings = $derived(() => {
		if (!inputCSS) return { bytes: 0, percent: 0 };
		const original = inputCSS.length;
		const minified = minifiedCSS.length;
		const saved = original - minified;
		return {
			bytes: saved,
			percent: original > 0 ? Math.round((saved / original) * 100) : 0
		};
	});

	function loadSample() {
		inputCSS = `.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #1a1a2e;
}

.header .logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: #e0e0e0;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #00d9ff;
}`;
	}

	function clearAll() {
		inputCSS = '';
	}
</script>

<ToolWrapper
	keywords={['css minifier', 'minify css', 'compress css', 'css compressor', 'optimize css']}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Savings Card -->
		{#if inputCSS}
			<div class="card bg-primary/10 rounded-2xl">
				<div class="card-body p-4 flex-row items-center justify-between">
					<div>
						<h3 class="text-sm font-semibold mb-1">Size Reduction</h3>
						<div class="text-2xl font-mono font-bold text-primary">
							{savings().percent}% smaller
						</div>
					</div>
					<div class="text-right text-sm text-base-content/60">
						<div>{inputCSS.length.toLocaleString()} → {minifiedCSS.length.toLocaleString()} chars</div>
						<div class="text-success">-{savings().bytes.toLocaleString()} chars saved</div>
					</div>
				</div>
			</div>
		{/if}

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
						<h3 class="text-sm font-semibold">Minified CSS</h3>
						{#if minifiedCSS}
							<CopyButton text={minifiedCSS} label="Copy" size="sm" />
						{/if}
					</div>
					<div class="bg-base-300 p-4 rounded-xl h-64 overflow-auto text-sm font-mono break-all max-w-full">{minifiedCSS || 'Minified CSS will appear here...'}</div>
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">What gets removed?</h4>
				<ul class="mt-2 text-sm text-base-content/70 list-disc list-inside space-y-1">
					<li>Comments (/* ... */)</li>
					<li>Extra whitespace and line breaks</li>
					<li>Trailing semicolons before closing braces</li>
					<li>Unnecessary spaces around selectors</li>
				</ul>
			</div>
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
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
