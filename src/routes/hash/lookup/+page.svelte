<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { hashToolsContent } from '$lib/config/content/hash-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import {
		matchPublishedTestVector,
		identifyHashType,
		HASH_TEST_VECTOR_INPUTS,
		type HashAlgorithm
	} from '$lib/utils/hash';

	const content = hashToolsContent['lookup'];

	let hashInput = $state('');
	let algorithm = $state<HashAlgorithm>('MD5');
	let isSearching = $state(false);
	let result = $state<{ found: boolean; label?: string; checked: number } | null>(null);
	let autoDetected = $state(false);

	let hashes = $derived(
		hashInput
			.split('\n')
			.map((h) => h.trim())
			.filter((h) => h.length > 0)
	);

	$effect(() => {
		const firstHash = hashes[0];
		if (!firstHash || hashes.length > 1) {
			autoDetected = false;
			return;
		}

		const detected = identifyHashType(firstHash);
		if (detected.length > 0 && detected[0].confidence === 'high') {
			const type = detected[0].type;
			if (type === 'MD5' || type === 'SHA-1' || type === 'SHA-256' || type === 'SHA-512') {
				algorithm = type;
				autoDetected = true;
				return;
			}
		}
		autoDetected = false;
	});

	async function search() {
		if (hashes.length === 0) return;
		isSearching = true;
		result = null;
		try {
			result = await matchPublishedTestVector(hashes[0], algorithm);
		} finally {
			isSearching = false;
		}
	}

	function clearAll() {
		hashInput = '';
		result = null;
	}

	function loadSample() {
		// RFC 1321 MD5 of "abc"
		hashInput = '900150983cd24fb0d6963f7d28e17f72';
		algorithm = 'MD5';
	}
</script>

<ToolWrapper lastUpdated={content.lastUpdated}>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<div class="alert alert-info rounded-xl">
			<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<div>
				<h4 class="font-semibold">This is not a password cracker</h4>
				<p class="text-sm">
					It only compares a digest to a short list of published test strings from RFC 1321 and FIPS 180
					(empty string, <code>abc</code>, the fox sentence, and similar). Hashes cannot be decrypted.
					We do not run dictionary attacks or accept custom wordlists.
				</p>
			</div>
		</div>

		<div class="form-control w-fit">
			<label class="label" for="hash-vector-alg">
				<span class="label-text text-sm">Algorithm</span>
			</label>
			<div class="flex items-center gap-2">
				<select id="hash-vector-alg" bind:value={algorithm} class="select select-bordered select-sm">
					<option value="MD5">MD5</option>
					<option value="SHA-1">SHA-1</option>
					<option value="SHA-256">SHA-256</option>
					<option value="SHA-512">SHA-512</option>
				</select>
				{#if autoDetected}
					<span class="badge badge-success badge-sm">Auto-detected</span>
				{/if}
			</div>
		</div>

		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Hex digest</h3>
			<textarea
				bind:value={hashInput}
				placeholder="Paste one hex digest, for example the MD5 of abc"
				class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
		</div>

		<button
			type="button"
			class="btn btn-primary"
			onclick={search}
			disabled={hashes.length === 0 || isSearching}
		>
			{#if isSearching}
				<span class="loading loading-spinner loading-sm"></span>
				Checking test vectors...
			{:else}
				Check against published vectors
			{/if}
		</button>

		{#if result}
			<div class="card rounded-xl {result.found ? 'bg-success/10 border-2 border-success' : 'bg-base-200 border border-base-300'}">
				<div class="card-body p-6">
					{#if result.found}
						<h3 class="text-xl font-bold text-success">Matches a published test vector</h3>
						<p class="text-sm text-base-content/70 mt-2">Input from the RFC / FIPS examples:</p>
						<code class="block font-mono text-lg bg-base-300/50 px-3 py-2 rounded-lg mt-1 select-all">
							{result.label}
						</code>
					{:else}
						<h3 class="text-xl font-bold">Not in the published set</h3>
						<p class="text-sm text-base-content/60 mt-2">
							Checked {result.checked} standard test strings. That does not mean the digest is invalid,
							only that it is not one of these well-known examples. Use the Hash Generator to compute
							your own input.
						</p>
					{/if}
				</div>
			</div>
		{/if}

		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Inputs we check ({HASH_TEST_VECTOR_INPUTS.length})</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70 font-mono">
					{#each HASH_TEST_VECTOR_INPUTS as input}
						<li>{input === '' ? '(empty string)' : input}</li>
					{/each}
				</ul>
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
