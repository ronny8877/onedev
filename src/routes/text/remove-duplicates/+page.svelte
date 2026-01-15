<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';

	let input = $state('');
	let caseSensitive = $state(false);

	const sampleText = 'The quick brown fox jumps over the lazy dog. The quick red fox is fast.';

	let result = $derived.by(() => {
		if (!input.trim()) return { output: '', stats: null };

		const words = input.split(/\s+/).filter(Boolean);
		const seen = new Set<string>();
		const unique: string[] = [];
		const duplicates: string[] = [];

		for (const word of words) {
			const key = caseSensitive ? word : word.toLowerCase();
			if (seen.has(key)) {
				duplicates.push(word);
			} else {
				seen.add(key);
				unique.push(word);
			}
		}

		return {
			output: unique.join(' '),
			stats: {
				original: words.length,
				unique: unique.length,
				removed: duplicates.length,
				duplicates: [...new Set(duplicates.map(d => caseSensitive ? d : d.toLowerCase()))]
			}
		};
	});

	function applyResult() {
		input = result.output;
	}

	function loadSample() {
		input = sampleText;
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper
	title="Remove Duplicate Words"
	description="Remove repeated words from text while preserving order."
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={result.output} />

		<!-- Options -->
		<div class="flex items-center gap-4">
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={caseSensitive} class="checkbox checkbox-sm" />
				<span class="text-sm">Case sensitive</span>
			</label>
			{#if result.output}
				<button class="btn btn-primary btn-sm ml-auto" onclick={applyResult}>
					Apply to Input
				</button>
			{/if}
		</div>

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Input Text</h3>
			<textarea
				bind:value={input}
				placeholder="Enter text with duplicate words...&#10;e.g., The quick brown fox the lazy dog fox"
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-32"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Stats -->
		{#if result.stats}
			<div class="flex flex-wrap gap-4 text-sm">
				<span><strong>{result.stats.original}</strong> words</span>
				<span class="text-success"><strong>{result.stats.unique}</strong> unique</span>
				{#if result.stats.removed > 0}
					<span class="text-warning"><strong>{result.stats.removed}</strong> duplicates removed</span>
				{/if}
			</div>
		{/if}

		<!-- Output -->
		{#if result.output}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-2">Result</h3>
					<p class="font-mono text-sm whitespace-pre-wrap">{result.output}</p>
				</div>
			</div>

			{#if result.stats && result.stats.duplicates.length > 0}
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body py-4">
						<h4 class="text-sm font-semibold mb-2">Removed Words</h4>
						<div class="flex flex-wrap gap-2">
							{#each result.stats.duplicates as word}
								<span class="badge badge-warning badge-sm font-mono">{word}</span>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• First occurrence of each word is kept</li>
					<li>• Subsequent duplicates are removed</li>
					<li>• Word order is preserved</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
