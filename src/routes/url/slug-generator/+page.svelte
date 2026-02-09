<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import { generateSlug } from '$lib/utils/url';
	import { urlToolsContent } from '$lib/config/content/url-tools-content';

	const content = urlToolsContent['slug-generator'];

	let input = $state('');
	let baseURL = $state('https://example.com/blog');
	let separator = $state<'-' | '_'>('-');
	let lowercase = $state(true);
	let maxLength = $state(100);
	let output = $state('');

	const sampleText = 'How to Build a REST API with Node.js — A Complete Guide! 🚀';

	$effect(() => {
		if (!input.trim()) {
			output = '';
			return;
		}

		output = generateSlug(input, {
			separator,
			lowercase,
			maxLength: maxLength || 100
		});
	});

	let fullURL = $derived(output ? `${baseURL.replace(/\/$/, '')}/${output}` : '');

	function clearAll() {
		input = '';
		output = '';
	}

	function loadExamples() {
		input = sampleText;
	}

	let stats = $derived({
		chars: input.length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExamples} onClear={clearAll} copyText={output} {stats} />

		<!-- Input -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Text to Convert</h3>
			</div>
			<textarea
				bind:value={input}
				placeholder="Enter your title or text here..."
				class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<div class="form-control">
				<label class="label cursor-pointer gap-2">
					<span class="label-text">Separator:</span>
					<select class="select select-bordered select-sm" bind:value={separator}>
						<option value="-">Hyphens (-)</option>
						<option value="_">Underscores (_)</option>
					</select>
				</label>
			</div>

			<div class="form-control">
				<label class="label cursor-pointer gap-2">
					<input type="checkbox" class="checkbox checkbox-sm" bind:checked={lowercase} />
					<span class="label-text">Lowercase</span>
				</label>
			</div>

			<div class="form-control">
				<label class="label cursor-pointer gap-2">
					<span class="label-text">Max length:</span>
					<input
						type="number"
						class="input input-bordered input-sm w-20"
						bind:value={maxLength}
						min="10"
						max="200"
					/>
				</label>
			</div>
		</div>

		<!-- Base URL -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Base URL (for preview)</h3>
			</div>
			<input
				type="text"
				bind:value={baseURL}
				placeholder="https://example.com/blog"
				class="input input-bordered w-full font-mono text-sm rounded-xl"
				spellcheck="false"
			/>
		</div>

		<!-- Output -->
		<div>
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-sm font-medium text-base-content/70">Generated Slug</h3>
				<span class="text-xs text-base-content/50">
					{output.length} chars
				</span>
			</div>
			<div class="bg-base-200 p-4 rounded-xl font-mono text-sm min-h-[60px] break-all">
				{#if output}
					{output}
				{:else}
					<span class="text-base-content/40">Slug will appear here...</span>
				{/if}
			</div>
		</div>

		<!-- Full URL Preview -->
		{#if output}
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Full URL Preview</h3>
				<div class="bg-base-200 p-4 rounded-xl font-mono text-sm break-all">
					{fullURL}
				</div>
			</div>

			<!-- Copy Options -->
			<div class="flex items-center gap-2">
				<span class="text-sm text-base-content/60">Copy full URL as:</span>
				<CopyButton url={fullURL} size="sm" />
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
		<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
