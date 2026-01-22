<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { identifyHashType, type HashTypeGuess } from '$lib/utils/hash';

	let input = $state('');
	let results = $state<HashTypeGuess[]>([]);

	const sampleHashes = [
		{ hash: '5d41402abc4b2a76b9719d911017c592', label: 'MD5 (hello)' },
		{ hash: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', label: 'SHA-256 (hello)' },
		{ hash: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', label: 'bcrypt' },
		{ hash: '3610a686', label: 'CRC32 (hello)' }
	];

	$effect(() => {
		const trimmed = input.trim();
		if (!trimmed) {
			results = [];
			return;
		}
		results = identifyHashType(trimmed);
	});

	function loadSample(hash: string) {
		input = hash;
	}

	function clearAll() {
		input = '';
		results = [];
	}

	function getConfidenceColor(confidence: 'high' | 'medium' | 'low'): string {
		switch (confidence) {
			case 'high':
				return 'success';
			case 'medium':
				return 'warning';
			case 'low':
				return 'neutral';
		}
	}

	function getConfidenceLabel(confidence: 'high' | 'medium' | 'low'): string {
		switch (confidence) {
			case 'high':
				return 'Very Likely';
			case 'medium':
				return 'Possible';
			case 'low':
				return 'Unlikely';
		}
	}
</script>

<ToolWrapper
	title="Hash Identifier - What Hash Is This?"
	description="Identify unknown hash types instantly. Paste any hash to detect if it's MD5, SHA-256, SHA-512, bcrypt, CRC32 or other hash formats."
	keywords={['hash identifier', 'what hash is this', 'identify hash', 'hash type', 'md5 or sha256', 'hash detector']}
>
	<div class="flex flex-col gap-6">
		<ToolActions onClear={clearAll} />

		<!-- Quick Samples -->
		<div class="flex flex-wrap gap-2">
			<span class="text-sm text-base-content/60">Try:</span>
			{#each sampleHashes as sample}
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					onclick={() => loadSample(sample.hash)}
				>
					{sample.label}
				</button>
			{/each}
		</div>

		<!-- Input -->
		<div>
			<textarea
				bind:value={input}
				placeholder="Paste a hash here to identify its type..."
				class="textarea textarea-bordered w-full min-h-[120px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
			<div class="flex justify-between text-xs text-base-content/50 mt-1">
				<span>{input.trim().length} characters</span>
				<span>{input.trim().length * 4} bits (if hex)</span>
			</div>
		</div>

		<!-- Results -->
		{#if results.length > 0}
			<div class="space-y-3">
				<h3 class="font-semibold">Detected Hash Types</h3>

				<div class="grid gap-3">
					{#each results as result, i}
						<div class="card bg-base-200 rounded-xl" class:ring-2={i === 0} class:ring-success={i === 0 && result.confidence === 'high'}>
							<div class="card-body p-4">
								<div class="flex items-start justify-between gap-4">
									<div>
										<div class="flex items-center gap-2 mb-1">
											<span class="font-bold text-lg">{result.type}</span>
											<span class="badge badge-{getConfidenceColor(result.confidence)} badge-sm">
												{getConfidenceLabel(result.confidence)}
											</span>
										</div>
										<p class="text-sm text-base-content/70">{result.description}</p>
									</div>
									{#if i === 0 && result.confidence === 'high'}
										<div class="text-success">
											<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										</div>
									{/if}
								</div>

								{#if result.type !== 'Unknown' && result.type !== 'Base64'}
									<div class="mt-2 pt-2 border-t border-base-300">
										<div class="flex gap-4 text-xs text-base-content/60">
											<span>Length: <strong class="text-base-content">{result.length}</strong> chars</span>
											{#if result.length <= 128}
												<span>Bits: <strong class="text-base-content">{result.length * 4}</strong></span>
											{/if}
										</div>
									</div>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Hash Reference Table -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold mb-3">Hash Length Reference</h4>
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Hash Type</th>
								<th>Hex Length</th>
								<th>Bits</th>
								<th>Example</th>
							</tr>
						</thead>
						<tbody class="text-xs font-mono">
							<tr>
								<td class="font-sans font-medium">CRC32</td>
								<td>8</td>
								<td>32</td>
								<td class="text-base-content/60">3610a686</td>
							</tr>
							<tr>
								<td class="font-sans font-medium">MD5</td>
								<td>32</td>
								<td>128</td>
								<td class="text-base-content/60">5d41402abc4b2a...</td>
							</tr>
							<tr>
								<td class="font-sans font-medium">SHA-1</td>
								<td>40</td>
								<td>160</td>
								<td class="text-base-content/60">aaf4c61ddcc5e8...</td>
							</tr>
							<tr>
								<td class="font-sans font-medium">SHA-256</td>
								<td>64</td>
								<td>256</td>
								<td class="text-base-content/60">2cf24dba5fb0a3...</td>
							</tr>
							<tr>
								<td class="font-sans font-medium">SHA-512</td>
								<td>128</td>
								<td>512</td>
								<td class="text-base-content/60">9b71d224bd62f3...</td>
							</tr>
							<tr>
								<td class="font-sans font-medium">bcrypt</td>
								<td>60</td>
								<td>-</td>
								<td class="text-base-content/60">$2a$10$...</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
