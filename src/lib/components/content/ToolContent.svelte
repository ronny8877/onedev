<script lang="ts">
	import Features from './Features.svelte';
	import UseCases from './UseCases.svelte';
	import ConceptExplainer from './ConceptExplainer.svelte';
	import Examples from './Examples.svelte';
	import FAQSection from './FAQSection.svelte';
	import RelatedTools from './RelatedTools.svelte';
	import Tips from './Tips.svelte';

	interface ToolContentShape {
		features: string[];
		useCases: string[];
		concept: { title: string; content: string };
		examples: Array<{ label: string; code: string; isValid: boolean }>;
		faqs: Array<{ question: string; answer: string }>;
		relatedTools: Array<{ name: string; path: string; description: string }>;
		tips?: string[];
	}

	interface Props {
		content: ToolContentShape;
	}

	let { content }: Props = $props();
</script>

<div class="mt-12 space-y-12">
	<Features features={content.features} />
	<UseCases useCases={content.useCases} />
	<ConceptExplainer title={content.concept.title} content={content.concept.content} />
	<Examples examples={content.examples} />
	<FAQSection faqs={content.faqs} />
	<RelatedTools relatedTools={content.relatedTools} />
	{#if content.tips}
		<Tips tips={content.tips} />
	{/if}
</div>
