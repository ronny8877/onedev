<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import { hashToolsContent } from '$lib/config/content/hash-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import HowTo from '$lib/components/content/HowTo.svelte';

	const content = hashToolsContent['compare'];

	let hashA = $state('');
	let hashB = $state('');
	let ignoreCase = $state(true);
	let ignoreSpaces = $state(true);

	const sampleA = '5d41402abc4b2a76b9719d911017c592';
	const sampleB = '5D41402ABC4B2A76B9719D911017C592';

	function normalize(hash: string): string {
		let result = hash.trim();
		if (ignoreSpaces) {
			result = result.replace(/\s+/g, '');
		}
		if (ignoreCase) {
			result = result.toLowerCase();
		}
		return result;
	}

	let normalizedA = $derived(normalize(hashA));
	let normalizedB = $derived(normalize(hashB));

	let isMatch = $derived(
		normalizedA.length > 0 && normalizedB.length > 0 && normalizedA === normalizedB
	);

	let hasInput = $derived(hashA.trim().length > 0 || hashB.trim().length > 0);

	// Find differences for highlighting
	let differences = $derived(() => {
		if (!hasInput || normalizedA === normalizedB) return [];

		const diffs: number[] = [];
		const maxLen = Math.max(normalizedA.length, normalizedB.length);

		for (let i = 0; i < maxLen; i++) {
			if (normalizedA[i] !== normalizedB[i]) {
				diffs.push(i);
			}
		}
		return diffs;
	});

	function loadSample() {
		hashA = sampleA;
		hashB = sampleB;
	}

	function clearAll() {
		hashA = '';
		hashB = '';
	}

	function swapHashes() {
		[hashA, hashB] = [hashB, hashA];
	}
</script>

<ToolWrapper
	keywords={[
		'compare hashes',
		'hash comparison',
		'compare md5',
		'compare sha256',
		'verify checksum',
		'hash match'
	]}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<label class="flex cursor-pointer items-center gap-2">
				<input type="checkbox" bind:checked={ignoreCase} class="checkbox checkbox-sm" />
				<span class="text-sm">Ignore case</span>
			</label>
			<label class="flex cursor-pointer items-center gap-2">
				<input type="checkbox" bind:checked={ignoreSpaces} class="checkbox checkbox-sm" />
				<span class="text-sm">Ignore whitespace</span>
			</label>
			<button
				type="button"
				class="btn h-8 min-h-8 gap-1.5 rounded-lg btn-ghost"
				onclick={swapHashes}
			>
				<AppIcon name="arrow-left-right" class="size-4" />
				Swap
			</button>
		</div>

		<!-- Inputs -->
		<div class="grid gap-4 md:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Hash A</h3>
				<textarea
					bind:value={hashA}
					placeholder="Paste first hash..."
					class="textarea-bordered textarea min-h-[100px] w-full resize-none rounded-lg border border-base-300 bg-base-100 font-mono text-sm text-base-content"
					spellcheck="false"></textarea>
				<p class="mt-1 text-xs text-base-content/50">{hashA.trim().length} chars</p>
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Hash B</h3>
				<textarea
					bind:value={hashB}
					placeholder="Paste second hash..."
					class="textarea-bordered textarea min-h-[100px] w-full resize-none rounded-lg border border-base-300 bg-base-100 font-mono text-sm text-base-content"
					spellcheck="false"></textarea>
				<p class="mt-1 text-xs text-base-content/50">{hashB.trim().length} chars</p>
			</div>
		</div>

		<!-- Result -->
		{#if hasInput}
			<div
				class="card rounded-xl {isMatch
					? 'border-2 border-success bg-success/10'
					: 'border-2 border-error bg-error/10'}"
			>
				<div class="card-body p-6">
					<div class="flex items-center justify-center gap-4">
						{#if isMatch}
							<svg
								class="h-12 w-12 text-success"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div>
								<h3 class="text-xl font-bold text-success">Match!</h3>
								<p class="text-sm text-success/80">Both hashes are identical</p>
							</div>
						{:else}
							<svg
								class="h-12 w-12 text-error"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div>
								<h3 class="text-xl font-bold text-error">No Match</h3>
								<p class="text-sm text-error/80">
									{#if normalizedA.length !== normalizedB.length}
										Different lengths ({normalizedA.length} vs {normalizedB.length})
									{:else}
										{differences().length} character{differences().length !== 1 ? 's' : ''} differ
									{/if}
								</p>
							</div>
						{/if}
					</div>

					{#if !isMatch && normalizedA.length > 0 && normalizedB.length > 0}
						<div class="mt-4 border-t border-base-300 pt-4">
							<h4 class="mb-2 text-sm font-medium">Visual Comparison</h4>
							<div class="grid gap-4 md:grid-cols-2">
								<div class="rounded-lg bg-base-300/50 p-3 font-mono text-xs break-all">
									{#each normalizedA.split('') as char, i}
										<span
											class={differences().includes(i)
												? 'bg-error/50 px-0.5 text-error-content'
												: ''}>{char}</span
										>
									{/each}
								</div>
								<div class="rounded-lg bg-base-300/50 p-3 font-mono text-xs break-all">
									{#each normalizedB.split('') as char, i}
										<span
											class={differences().includes(i)
												? 'bg-error/50 px-0.5 text-error-content'
												: ''}>{char}</span
										>
									{/each}
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card rounded-lg border border-base-300 bg-base-100">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Tips</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>
						• <strong>Case insensitive</strong> - MD5 hashes are often shown in uppercase or lowercase
					</li>
					<li>
						• <strong>Verify downloads</strong> - Compare downloaded file hash against expected value
					</li>
					<li>• <strong>Data integrity</strong> - Ensure files weren't corrupted or modified</li>
				</ul>
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
	</div>
</ToolWrapper>

<style>
	/* Theme .card fills base-200. Keep this Tips card on Hash A/B paper. */
	.card.rounded-lg {
		border-radius: 0.5rem;
	}
	:global(html[data-theme='emerald']) .card.rounded-lg {
		background-color: var(--color-base-100);
	}
</style>
