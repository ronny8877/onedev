<script lang="ts">
	import JsonLd from './JsonLd.svelte';
	
	interface FAQ {
		question: string;
		answer: string; // HTML content
	}

	interface Props {
		faqs: FAQ[];
		title?: string;
	}

	let { faqs, title = 'Frequently Asked Questions' }: Props = $props();
</script>

<JsonLd {faqs} />

<section class="mt-12 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm" itemscope itemtype="https://schema.org/FAQPage">
	<h2 class="mb-6 text-2xl font-bold text-base-content">{title}</h2>

	<div class="space-y-3">
		{#each faqs as faq, index}
			<div class="collapse collapse-plus border border-base-300 bg-base-200" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
				<input type="radio" name="faq-accordion" id="faq-{index}" />
				<div class="collapse-title text-lg font-medium" itemprop="name">
					{faq.question}
				</div>
				<div class="collapse-content" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
					<div class="prose prose-sm max-w-none pt-2 prose-p:text-base-content/80 prose-a:text-primary prose-code:text-primary" itemprop="text">
						{@html faq.answer}
					</div>
				</div>
			</div>
		{/each}
	</div>
</section>
