<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { fade, slide } from 'svelte/transition';

	let input = $state('');
	let showLineNumbers = $state(false);

	const sampleInput = `Apple
Banana
Cherry
Apple
Date
Banana
Elderberry`;

	function sortAZ() {
		input = input.split('\n').sort((a, b) => a.localeCompare(b)).join('\n');
	}

	function sortZA() {
		input = input.split('\n').sort((a, b) => b.localeCompare(a)).join('\n');
	}

	function removeDuplicates() {
		const lines = input.split('\n');
		const seen = new Set<string>();
		const unique: string[] = [];
		for (const line of lines) {
			if (!seen.has(line)) {
				seen.add(line);
				unique.push(line);
			}
		}
		input = unique.join('\n');
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
		const cleanedLines = input.split('\n').map(line => line.replace(/^\d+\.\s*/, ''));
		input = cleanedLines.map((line, i) => `${i + 1}. ${line}`).join('\n');
	}

	function removeNumbers() {
		input = input.split('\n').map(line => line.replace(/^\d+\.\s*/, '')).join('\n');
	}

	let lines = $derived(input.split('\n'));
	let lineCount = $derived(lines.filter(l => l.trim()).length);
	let uniqueCount = $derived(new Set(lines.filter(l => l.trim())).size);
	let stats = $derived(input ? { lines: lineCount, chars: input.length } : undefined);

	function loadSample() {
		input = sampleInput;
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper
	title="Line Tools"
	description="Sort lines, remove duplicates, trim whitespace, reverse order."
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={input} stats={stats} />

		<!-- Tool Actions -->
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-primary btn-sm" onclick={sortAZ}>Sort A→Z</button>
			<button class="btn btn-primary btn-sm" onclick={sortZA}>Sort Z→A</button>
			<button class="btn btn-secondary btn-sm" onclick={removeDuplicates}>Remove Duplicates</button>
			<button class="btn btn-secondary btn-sm" onclick={trimWhitespace}>Trim Whitespace</button>
			<button class="btn btn-secondary btn-sm" onclick={removeEmptyLines}>Remove Empty</button>
			<button class="btn btn-accent btn-sm" onclick={reverseLines}>Reverse</button>
			<button class="btn btn-accent btn-sm" onclick={shuffleLines}>Shuffle</button>
			<button class="btn btn-info btn-sm" onclick={numberLines}>Number Lines</button>
			<button class="btn btn-ghost btn-sm" onclick={removeNumbers}>Remove Numbers</button>
		</div>

		<!-- Stats -->
		{#if input.trim()}
			<div class="flex gap-4 text-sm text-base-content/70" transition:fade={{ duration: 150 }}>
				<span><strong>{lineCount}</strong> lines</span>
				<span><strong>{uniqueCount}</strong> unique</span>
				{#if lineCount !== uniqueCount}
					<span class="text-warning"><strong>{lineCount - uniqueCount}</strong> duplicates</span>
				{/if}
			</div>
		{/if}

		<!-- Input with optional line numbers gutter -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Text (one item per line)</h3>
				<label class="label cursor-pointer gap-2">
					<span class="label-text text-xs">Show Line Numbers</span>
					<input type="checkbox" class="toggle toggle-primary toggle-sm" bind:checked={showLineNumbers} />
				</label>
			</div>

			<div class="relative">
				{#if showLineNumbers && input}
					<div class="line-gutter" transition:slide={{ duration: 200, axis: 'x' }}>
						{#each lines as _, i}
							<div class="line-number">{i + 1}</div>
						{/each}
					</div>
				{/if}
				<textarea
					bind:value={input}
					placeholder="Enter text, one item per line&#10;Apple&#10;Banana&#10;Cherry&#10;Apple"
					class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-80"
					class:pl-14={showLineNumbers && input}
					spellcheck="false"
				></textarea>
			</div>
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

<style>
	.line-gutter {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3rem;
		padding-top: 0.75rem;
		border-right: 1px solid oklch(var(--bc) / 0.15);
		background: oklch(var(--b2));
		border-radius: 0.75rem 0 0 0.75rem;
		overflow: hidden;
		z-index: 1;
	}

	.line-number {
		height: 1.5rem;
		padding-right: 0.75rem;
		text-align: right;
		font-family: monospace;
		font-size: 0.75rem;
		color: oklch(var(--bc) / 0.4);
		line-height: 1.5rem;
		user-select: none;
	}

	textarea.pl-14 {
		padding-left: 3.5rem;
	}
</style>
