<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

	let input = $state('');
	let caseSensitive = $state(false);
	let copied = $state(false);

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

	function copyOutput() {
		navigator.clipboard.writeText(result.output);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
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
		<!-- Options -->
		<div class="flex items-center gap-4">
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={caseSensitive} class="checkbox checkbox-sm" />
				<span class="text-sm">Case sensitive</span>
			</label>
		</div>

		<!-- Input -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Input Text</h3>
				<button class="btn btn-ghost btn-xs" onclick={clearAll}>Clear</button>
			</div>
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
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-semibold">Result</h3>
						<div class="flex gap-2">
							<button class="btn btn-ghost btn-sm" onclick={copyOutput}>
								{copied ? '✓ Copied' : 'Copy'}
							</button>
							<button class="btn btn-primary btn-sm" onclick={applyResult}>
								Apply to Input
							</button>
						</div>
					</div>
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
