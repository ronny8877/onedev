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
	import Tips from '$lib/components/content/Tips.svelte';
	import { urlToolsContent } from '$lib/config/content/url-tools-content';

	const content = urlToolsContent['length-checker'];

	let input = $state('');

	// URL length limits from various sources
	const limits = [
		{ name: 'Most browsers (Chrome, Firefox)', max: 2048, recommended: true },
		{ name: 'Internet Explorer 11', max: 2083, recommended: false },
		{ name: 'Apache (default)', max: 8190, recommended: false },
		{ name: 'IIS', max: 16384, recommended: false },
		{ name: 'Nginx (default)', max: 8000, recommended: false },
		{ name: 'RFC 2616 (no limit)', max: Infinity, recommended: false }
	];

	let length = $derived(input.length);
	let bytes = $derived(new TextEncoder().encode(input).length);
	let percent = $derived(Math.min((length / 2048) * 100, 100));
	let status = $derived(getStatus());

	function getStatusColor(): string {
		if (length === 0) return 'bg-base-300';
		if (length <= 1500) return 'bg-success';
		if (length <= 2048) return 'bg-warning';
		return 'bg-error';
	}

	function getStatus(): { text: string; color: string } {
		if (length === 0) return { text: 'Enter a URL', color: 'text-base-content/50' };
		if (length <= 1500) return { text: 'Safe length', color: 'text-success' };
		if (length <= 2048) return { text: 'Approaching limit', color: 'text-warning' };
		return { text: 'Exceeds browser limit', color: 'text-error' };
	}

	function formatBytes(b: number): string {
		if (b < 1024) return `${b} bytes`;
		return `${(b / 1024).toFixed(2)} KB`;
	}

	function clearAll() {
		input = '';
	}

	function loadExample() {
		input = 'https://api.example.com/v1/search?query=a+very+long+search+query+with+many+terms&category=electronics&subcategory=smartphones&brand=apple&brand=samsung&brand=google&min_price=100&max_price=1500&in_stock=true&sort=price_asc&page=1&limit=50&fields=id,name,price,image,rating,reviews&include=specifications,variants&exclude=description&format=json&locale=en-US&currency=USD&timestamp=' + Date.now();
	}

	let stats = $derived({
		chars: input.length,
		bytes: new TextEncoder().encode(input).length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={clearAll} copyText={input} {stats} />

		<!-- Input -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">URL to Check</h3>
			</div>
			<textarea
				bind:value={input}
				placeholder="Paste your URL here..."
				class="textarea textarea-bordered w-full min-h-[120px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Stats -->
		<div class="grid gap-4 sm:grid-cols-3">
			<div class="bg-base-200 p-4 rounded-xl text-center">
				<div class="text-3xl font-bold">{length.toLocaleString()}</div>
				<div class="text-xs text-base-content/50 mt-1">Characters</div>
			</div>
			<div class="bg-base-200 p-4 rounded-xl text-center">
				<div class="text-3xl font-bold">{formatBytes(bytes)}</div>
				<div class="text-xs text-base-content/50 mt-1">Size</div>
			</div>
			<div class="bg-base-200 p-4 rounded-xl text-center">
				<div class="text-3xl font-bold {status.color}">{length > 0 ? Math.round(percent) + '%' : '-'}</div>
				<div class="text-xs text-base-content/50 mt-1">of 2048 limit</div>
			</div>
		</div>

		<!-- Progress Bar -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm {status.color} font-medium">{status.text}</span>
				<span class="text-xs text-base-content/50">{length} / 2048</span>
			</div>
			<div class="w-full bg-base-300 rounded-full h-4 overflow-hidden">
				<div
					class="h-full transition-all duration-300 {getStatusColor()}"
					style="width: {Math.min(percent, 100)}%"
				></div>
			</div>
		</div>

		<!-- Limits Reference -->
		<div>
			<h3 class="mb-3 text-sm font-medium text-base-content/70">Limit Reference</h3>
			<div class="overflow-x-auto">
				<table class="table table-sm">
					<thead>
						<tr>
							<th>Platform</th>
							<th class="text-right">Max Length</th>
							<th class="text-center">Status</th>
						</tr>
					</thead>
					<tbody>
						{#each limits as limit}
							<tr class:opacity-60={!limit.recommended}>
								<td>
									{limit.name}
									{#if limit.recommended}
										<span class="badge badge-info badge-xs ml-1">recommended</span>
									{/if}
								</td>
								<td class="text-right font-mono">
									{limit.max === Infinity ? '∞' : limit.max.toLocaleString()}
								</td>
								<td class="text-center">
									{#if length === 0}
										<span class="badge badge-ghost badge-sm">-</span>
									{:else if length <= limit.max}
										<span class="badge badge-success badge-sm">OK</span>
									{:else}
										<span class="badge badge-error badge-sm">Over</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
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
		<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
