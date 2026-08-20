<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { removePrefixes } from '$lib/utils/css-utils';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cssToolsContent['prefix-cleaner'];

	let inputCSS = $state('');
	let cleanedCSS = $derived(removePrefixes(inputCSS));

	let prefixCount = $derived(() => {
		const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
		let count = 0;
		prefixes.forEach(prefix => {
			const matches = inputCSS.match(new RegExp(prefix, 'g'));
			if (matches) count += matches.length;
		});
		return count;
	});

	function loadSample() {
		inputCSS = `.box {
  -webkit-border-radius: 8px;
  -moz-border-radius: 8px;
  border-radius: 8px;
  
  -webkit-box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
  
  -webkit-transform: translateX(0);
  -moz-transform: translateX(0);
  -ms-transform: translateX(0);
  transform: translateX(0);
}`;
	}

	function clearAll() {
		inputCSS = '';
	}
</script>

<ToolWrapper
	keywords={['css prefix remover', 'remove vendor prefixes', 'clean prefixes', 'autoprefixer cleanup']}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Info Banner -->
		{#if inputCSS}
			<div class="card bg-info/10 rounded-2xl">
				<div class="card-body p-4 flex-row items-center gap-4">
					<AppIcon name={'🧹'} size={16} />
					<div>
						<div class="text-lg font-bold">{prefixCount()} prefixes found</div>
						<div class="text-sm text-base-content/60">
							These will be removed in the cleaned output
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Input/Output -->
		<div class="grid lg:grid-cols-2 gap-4">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Input CSS (with prefixes)</h3>
					<textarea
						bind:value={inputCSS}
						placeholder="Paste CSS with vendor prefixes..."
						class="textarea textarea-bordered w-full h-64 font-mono text-sm resize-none"
					></textarea>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold">Cleaned CSS</h3>
						{#if cleanedCSS}
							<CopyButton text={cleanedCSS} label="Copy" size="sm" />
						{/if}
					</div>
					<pre class="bg-base-300 p-4 rounded-xl h-64 overflow-auto text-sm font-mono whitespace-pre-wrap break-all max-w-full">{cleanedCSS || 'Cleaned CSS will appear here...'}</pre>
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-warning/10 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<span>⚠️</span> When to keep prefixes
				</h4>
				<ul class="mt-2 text-sm text-base-content/70 list-disc list-inside space-y-1">
					<li>Supporting older browsers (IE, old Safari)</li>
					<li>Using cutting-edge CSS features</li>
					<li>Production code for high compatibility</li>
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
