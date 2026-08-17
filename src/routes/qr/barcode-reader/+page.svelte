<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CodeScanner from '$lib/components/ui/CodeScanner.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { qrToolsContent } from '$lib/config/content/qr-tools-content';

	const content = qrToolsContent['barcode-reader'];

	let text = $state('');
	let format = $state('');

	function handleResult(value: string, detected: string) {
		text = value;
		format = detected;
	}

	function clearAll() {
		text = '';
		format = '';
	}
</script>

<ToolWrapper lastUpdated="2026-08-17">
	<div class="space-y-6">
		<ToolActions onClear={clearAll} copyText={text} copyLabel="Copy value" />

		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Scan a barcode</h3>
					<CodeScanner mode="barcode" onResult={handleResult} />
				</div>
			</div>

			<div class="card bg-base-100 border border-base-300 rounded-2xl">
				<div class="card-body p-4 space-y-3">
					<h3 class="font-bold">Result</h3>
					{#if text}
						{#if format}
							<span class="badge badge-ghost">{format}</span>
						{/if}
						<pre class="whitespace-pre-wrap break-all rounded-xl bg-base-200 p-4 text-sm font-mono">{text}</pre>
						<CopyButton text={text} label="Copy value" />
					{:else}
						<p class="text-sm text-base-content/50">Upload a barcode photo or use the camera. Reading stays in this browser.</p>
					{/if}
				</div>
			</div>
		</div>

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
	</div>
</ToolWrapper>
