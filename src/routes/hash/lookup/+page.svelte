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

	const content = hashToolsContent['lookup'];
	import {
		lookupHash,
		parseWordlist,
		COMMON_PASSWORDS,
		identifyHashType,
		type HashAlgorithm
	} from '$lib/utils/hash';

	let hashInput = $state('');
	let algorithm = $state<HashAlgorithm>('MD5');
	let customWordlist = $state<string[] | null>(null);
	let customWordlistName = $state('');
	let isSearching = $state(false);
	let progress = $state({ checked: 0, total: 0 });
	let result = $state<{ found: boolean; plaintext?: string; checked: number } | null>(null);
	let fileInput: HTMLInputElement;
	let autoDetected = $state(false);

	// Parse multiple hashes (one per line)
	let hashes = $derived(
		hashInput
			.split('\n')
			.map((h) => h.trim())
			.filter((h) => h.length > 0)
	);

	// Auto-detect hash type when input changes
	$effect(() => {
		const firstHash = hashes[0];
		if (!firstHash || hashes.length > 1) {
			autoDetected = false;
			return;
		}

		const detected = identifyHashType(firstHash);
		if (detected.length > 0 && detected[0].confidence === 'high') {
			const type = detected[0].type;
			// Map detected types to our supported algorithms
			if (type === 'MD5') {
				algorithm = 'MD5';
				autoDetected = true;
			} else if (type === 'SHA-1') {
				algorithm = 'SHA-1';
				autoDetected = true;
			} else if (type === 'SHA-256') {
				algorithm = 'SHA-256';
				autoDetected = true;
			} else {
				autoDetected = false;
			}
		} else {
			autoDetected = false;
		}
	});

	let results = $state<Map<string, { found: boolean; plaintext?: string }>>(new Map());

	async function search() {
		if (hashes.length === 0) return;

		isSearching = true;
		result = null;
		results = new Map();

		const wordlist = customWordlist || COMMON_PASSWORDS;
		const totalChecks = hashes.length * wordlist.length;
		let checksCompleted = 0;

		for (const hash of hashes) {
			const lookupResult = await lookupHash(hash, algorithm, wordlist, (checked, total) => {
				progress = { checked: checksCompleted + checked, total: totalChecks };
			});

			results.set(hash, { found: lookupResult.found, plaintext: lookupResult.plaintext });
			checksCompleted += wordlist.length;

			// If single hash mode, set result
			if (hashes.length === 1) {
				result = lookupResult;
			}
		}

		isSearching = false;
	}

	function handleFileUpload(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		customWordlistName = file.name;
		const reader = new FileReader();
		reader.onload = (event) => {
			const text = event.target?.result as string;
			customWordlist = parseWordlist(text);
		};
		reader.readAsText(file);
	}

	function clearWordlist() {
		customWordlist = null;
		customWordlistName = '';
		if (fileInput) fileInput.value = '';
	}

	function clearAll() {
		hashInput = '';
		result = null;
		results = new Map();
	}

	function loadSample() {
		// MD5 of "password"
		hashInput = '5f4dcc3b5aa765d61d8327deb882cf99';
		algorithm = 'MD5';
	}

	let wordlistSize = $derived(customWordlist?.length || COMMON_PASSWORDS.length);
</script>

<ToolWrapper
	keywords={['hash lookup', 'reverse hash', 'md5 decrypt', 'hash crack', 'password hash lookup', 'md5 lookup']}
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Important Disclaimer -->
		<div class="alert alert-warning rounded-xl">
			<svg class="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<div>
				<h4 class="font-semibold">Hashes Cannot Be "Decrypted"</h4>
				<p class="text-sm">This tool checks hashes against a dictionary of known passwords. It does NOT crack, reverse, or decrypt hashes. All processing happens locally in your browser.</p>
			</div>
		</div>

		<!-- Algorithm & Wordlist Selection -->
		<div class="flex flex-wrap gap-4">
			<div class="form-control">
				<label class="label">
					<span class="label-text text-sm">Algorithm</span>
				</label>
				<div class="flex items-center gap-2 ">
					<select bind:value={algorithm} class="select select-bordered select-sm">
						<option value="MD5">MD5</option>
						<option value="SHA-1">SHA-1</option>
						<option value="SHA-256">SHA-256</option>
					</select>
					{#if autoDetected}
						<span class="badge badge-success badge-sm block text-nowrap gap-1">
							Auto-detected
						</span>
					{/if}
				</div>
			</div>

			<div class="form-control flex-1">
				<label class="label">
					<span class="label-text text-sm">Wordlist</span>
				</label>
				<div class="flex items-center gap-2">
					{#if customWordlist}
						<div class="badge badge-primary gap-2">
							{customWordlistName}
							<span class="text-xs">({customWordlist.length.toLocaleString()} words)</span>
							<button type="button" class="btn btn-ghost btn-xs" onclick={clearWordlist}>×</button>
						</div>
					{:else}
						<span class="text-sm text-base-content/60">Default ({COMMON_PASSWORDS.length} passwords)</span>
					{/if}
					<input
						bind:this={fileInput}
						type="file"
						accept=".txt,.lst,.dic"
						class="hidden"
						onchange={handleFileUpload}
					/>
					<button
						type="button"
						class="btn btn-ghost btn-sm"
						onclick={() => fileInput.click()}
					>
						Upload Custom
					</button>
				</div>
			</div>
		</div>

		<!-- Hash Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">
				Hash(es) to Lookup
				<span class="text-xs text-base-content/50">(one per line for batch)</span>
			</h3>
			<textarea
				bind:value={hashInput}
				placeholder="Paste hash here (e.g., 5f4dcc3b5aa765d61d8327deb882cf99)..."
				class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
			{#if hashes.length > 1}
				<p class="text-xs text-base-content/50 mt-1">{hashes.length} hashes to check</p>
			{/if}
		</div>

		<!-- Search Button -->
		<button
			type="button"
			class="btn btn-primary"
			onclick={search}
			disabled={hashes.length === 0 || isSearching}
		>
			{#if isSearching}
				<span class="loading loading-spinner loading-sm"></span>
				Searching... ({progress.checked.toLocaleString()}/{progress.total.toLocaleString()})
			{:else}
				🔍 Search {hashes.length > 1 ? `${hashes.length} Hashes` : 'Hash'}
			{/if}
		</button>

		<!-- Progress -->
		{#if isSearching}
			<progress
				class="progress progress-primary w-full"
				value={progress.checked}
				max={progress.total}
			></progress>
		{/if}

		<!-- Single Result -->
		{#if result && hashes.length === 1}
			<div class="card rounded-xl {result.found ? 'bg-success/10 border-2 border-success' : 'bg-base-200 border border-base-300'}">
				<div class="card-body p-6">
					<div class="flex items-center gap-4">
						{#if result.found}
							<svg class="h-12 w-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<div>
								<h3 class="text-xl font-bold text-success">Found in Dictionary!</h3>
								<p class="text-sm text-base-content/70 mt-1">Plaintext:</p>
								<code class="block font-mono text-lg bg-base-300/50 px-3 py-2 rounded-lg mt-1 select-all">
									{result.plaintext}
								</code>
							</div>
						{:else}
							<svg class="h-12 w-12 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<div>
								<h3 class="text-xl font-bold">Not Found</h3>
								<p class="text-sm text-base-content/60">
									Checked {result.checked.toLocaleString()} words. Hash not in dictionary.
								</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Batch Results -->
		{#if results.size > 1}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<h3 class="font-semibold mb-3">Results ({results.size} hashes)</h3>
					<div class="space-y-2 max-h-64 overflow-y-auto">
						{#each Array.from(results.entries()) as [hash, res]}
							<div class="flex items-center justify-between gap-4 p-2 rounded-lg {res.found ? 'bg-success/10' : 'bg-base-300/50'}">
								<code class="font-mono text-xs truncate flex-1">{hash}</code>
								{#if res.found}
									<span class="badge badge-success">{res.plaintext}</span>
								{:else}
									<span class="badge badge-ghost">Not found</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">How This Works</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Dictionary attack:</strong> Compares your hash against pre-computed hashes of common passwords</li>
					<li>• <strong>Local processing:</strong> All calculations happen in your browser, nothing is sent to servers</li>
					<li>• <strong>Custom wordlists:</strong> Upload .txt files with one password per line</li>
					<li>• <strong>Batch mode:</strong> Enter multiple hashes (one per line) to check them all</li>
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
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
