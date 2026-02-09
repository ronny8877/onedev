<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import { validateBase64 } from '$lib/utils/base64';
	import { base64ToolsContent } from '$lib/config/content/base64-tools-content';

	const content = base64ToolsContent['validator'];

	let input = $state('');
	let result = $state<{ valid: boolean; error?: string; details?: string } | null>(null);
	let validateTimeout: ReturnType<typeof setTimeout> | null = null;

	const sampleInvalid = 'Not valid base64!!!';

	// Auto-validate with debounce
	$effect(() => {
		const _input = input;

		if (validateTimeout) {
			clearTimeout(validateTimeout);
		}

		if (!_input.trim()) {
			result = null;
			return;
		}

		validateTimeout = setTimeout(() => {
			result = validateBase64(_input);
		}, 200);

		return () => {
			if (validateTimeout) {
				clearTimeout(validateTimeout);
			}
		};
	});

	function loadSample() {
		input = sampleInvalid;
	}

	function clearInput() {
		input = '';
		result = null;
	}

	let stats = $derived({
		chars: input.length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearInput} {stats} />

		<!-- Status Badge -->
		{#if result}
			<div class="flex items-center gap-3">
				{#if result.valid}
					<div class="badge badge-success gap-2 p-4 text-lg">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>
						Valid Base64
					</div>
				{:else}
					<div class="badge badge-error gap-2 p-4 text-lg">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
						Invalid Base64
					</div>
				{/if}
			</div>
		{/if}

		<!-- Error Details -->
		{#if result && !result.valid}
			<div class="alert alert-error rounded-xl">
				<div>
					<h3 class="font-bold">{result.error}</h3>
					<p class="text-sm opacity-90">{result.details}</p>
				</div>
			</div>
		{/if}

		<!-- Input -->
		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">Base64 String</h3>
			<textarea
				bind:value={input}
				placeholder="Paste Base64 string to validate..."
				class="textarea textarea-bordered w-full min-h-[300px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Validation Rules -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Base64 Validation Rules</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Characters</strong>: A-Z, a-z, 0-9, +, / (or - _ for URL-safe)</li>
					<li>• <strong>Padding</strong>: Up to 2 equals signs (=) at the end only</li>
					<li>• <strong>Length</strong>: Must be divisible by 4 (with padding)</li>
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
<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
