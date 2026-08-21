<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { testLike, SAMPLE_LIKE_ROWS } from '$lib/utils/sql';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';

	const content = sqlToolsContent['like'];

	let pattern = $state('%sql');
	let haystack = $state('');
	let caseInsensitive = $state(false);
	let escape = $state('');

	let result = $derived(
		pattern.trim() && haystack.length >= 0
			? testLike(pattern, haystack, { caseInsensitive, escape: escape || undefined })
			: { ok: true, matches: [], error: null, matchCount: 0 }
	);
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		<ToolActions
			onSample={() => {
				pattern = '%.sql';
				haystack = SAMPLE_LIKE_ROWS;
			}}
			onClear={() => {
				pattern = '';
				haystack = '';
			}}
		/>

		<div class="grid gap-4 md:grid-cols-[1fr_auto_auto]">
			<label class="form-control">
				<span class="label-text">LIKE pattern</span>
				<input bind:value={pattern} class="input input-bordered font-mono" placeholder="%smith%" />
			</label>
			<label class="form-control">
				<span class="label-text">ESCAPE</span>
				<input bind:value={escape} maxlength={1} class="input input-bordered font-mono w-20" placeholder="\" />
			</label>
			<label class="flex cursor-pointer items-end gap-2 pb-3">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={caseInsensitive} />
				<span class="text-sm">Case insensitive (ILIKE)</span>
			</label>
		</div>

		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">{result.error}</div>
		{:else if haystack}
			<div class="text-sm text-base-content/60">
				{result.matchCount} match{result.matchCount === 1 ? '' : 'es'} of {result.matches.length} line{result.matches.length === 1 ? '' : 's'}
			</div>
		{/if}

		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Strings (one per line)</h3>
					<textarea
						bind:value={haystack}
						placeholder="Paste values to test..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-72"
						spellcheck="false"
					></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Matches</h3>
					{#if result.matches.length === 0}
						<p class="text-sm text-base-content/50">Results appear here.</p>
					{:else}
						<ul class="space-y-1 max-h-80 overflow-auto">
							{#each result.matches as row}
								<li
									class="rounded-lg px-3 py-1.5 font-mono text-sm {row.matched
										? 'bg-success/15 text-success'
										: 'bg-base-100 text-base-content/40'}"
								>
									{row.line === '' ? '(empty)' : row.line}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
