<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

	let input = $state('');
	let copied = $state(false);

	function sortAZ() {
		input = input.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
	}

	function sortZA() {
		input = input.split('\n').sort((a, b) => b.localeCompare(a)).join('\n');
	}

	function trimWhitespace() {
		input = input.split('\n').map(line => line.trim()).join('\n');
	}

	function removeEmptyLines() {
		input = input.split('\n').filter(line => line.trim()).join('\n');
	}

	function reverseLines() {
		input = input.split('\n').reverse().join('\n');
	}

	function shuffleLines() {
		const lines = input.split('\n');
		for (let i = lines.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[lines[i], lines[j]] = [lines[j], lines[i]];
		}
		input = lines.join('\n');
	}

	function numberLines() {
		input = input.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
	}

	function removeNumbers() {
		input = input.split('\n').map(line => line.replace(/^\d+\.\s*/, '')).join('\n');
	}

	let lineCount = $derived(input.split('\n').filter(l => l.trim()).length);
	let uniqueCount = $derived(new Set(input.split('\n').filter(l => l.trim())).size);

	function copyOutput() {
		navigator.clipboard.writeText(input);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper
	title="Line Tools"
	description="Sort, deduplicate, trim, and manipulate lines of text."
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-primary btn-sm" onclick={sortAZ}>Sort A→Z</button>
			<button class="btn btn-primary btn-sm" onclick={sortZA}>Sort Z→A</button>
			<button class="btn btn-accent btn-sm" onclick={trimWhitespace}>Trim Whitespace</button>
			<button class="btn btn-accent btn-sm" onclick={removeEmptyLines}>Remove Empty</button>
			<button class="btn btn-ghost btn-sm" onclick={reverseLines}>Reverse</button>
			<button class="btn btn-ghost btn-sm" onclick={shuffleLines}>Shuffle</button>
			<button class="btn btn-ghost btn-sm" onclick={numberLines}>Number Lines</button>
			<button class="btn btn-ghost btn-sm" onclick={removeNumbers}>Remove Numbers</button>
		</div>

		<!-- Stats -->
		{#if input.trim()}
			<div class="flex gap-4 text-sm text-base-content/70">
				<span><strong>{lineCount}</strong> lines</span>
				<span><strong>{uniqueCount}</strong> unique</span>
				{#if lineCount !== uniqueCount}
					<span class="text-warning"><strong>{lineCount - uniqueCount}</strong> duplicates</span>
				{/if}
			</div>
		{/if}

		<!-- Input -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Text (one item per line)</h3>
				<div class="flex gap-2">
					<button class="btn btn-ghost btn-xs gap-1" onclick={copyOutput} disabled={!input.trim()}>
						{#if copied}
							✓ Copied
						{:else}
							Copy
						{/if}
					</button>
					<button class="btn btn-ghost btn-xs" onclick={clearAll}>Clear</button>
				</div>
			</div>
			<textarea
				bind:value={input}
				placeholder="Enter text, one item per line&#10;Apple&#10;Banana&#10;Cherry&#10;Apple"
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-80"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Available Operations</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Sort A→Z / Z→A</strong> - Alphabetical sorting</li>
					<li>• <strong>Remove Duplicates</strong> - Keep only unique lines</li>
					<li>• <strong>Trim Whitespace</strong> - Remove leading/trailing spaces</li>
					<li>• <strong>Remove Empty</strong> - Delete blank lines</li>
					<li>• <strong>Reverse</strong> - Flip line order</li>
					<li>• <strong>Shuffle</strong> - Randomize line order</li>
					<li>• <strong>Number Lines</strong> - Add line numbers</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
