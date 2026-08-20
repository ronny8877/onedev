<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { diffCsv, SAMPLE_CSV } from '$lib/utils/csv';
	import { csvToolsContent } from '$lib/config/content/csv-tools-content';

	const content = csvToolsContent['diff'];
	const sampleRight = SAMPLE_CSV.replace('true', 'false').replace('Editor', 'Viewer');
	let left = $state('');
	let right = $state('');
	let result = $derived(left.trim() && right.trim() ? diffCsv(left, right) : { ok: true, diffs: [], error: null });
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => { left = SAMPLE_CSV; right = sampleRight; }} onClear={() => { left = ''; right = ''; }} />
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<h3 class="font-bold mb-3">Left CSV</h3>
				<textarea bind:value={left} class="textarea textarea-bordered w-full font-mono text-sm min-h-56" spellcheck="false"></textarea>
			</div></div>
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<h3 class="font-bold mb-3">Right CSV</h3>
				<textarea bind:value={right} class="textarea textarea-bordered w-full font-mono text-sm min-h-56" spellcheck="false"></textarea>
			</div></div>
		</div>
		{#if result.error}
			<div class="alert alert-error">{result.error.message}</div>
		{:else if left.trim() && right.trim()}
			{#if result.diffs.length === 0}
				<div class="alert alert-success">No cell differences.</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead><tr><th>Row</th><th>Column</th><th>Change</th><th>Left</th><th>Right</th></tr></thead>
						<tbody>
							{#each result.diffs as d}
								<tr>
									<td>{d.row}</td>
									<td class="font-mono text-xs">{d.column ?? ''}</td>
									<td><span class="badge">{d.type}</span></td>
									<td class="font-mono text-xs">{d.left ?? ''}</td>
									<td class="font-mono text-xs">{d.right ?? ''}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
