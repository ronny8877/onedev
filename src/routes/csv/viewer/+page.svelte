<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { parseCsv, stringifyCsv, SAMPLE_CSV, MAX_RENDER_ROWS } from '$lib/utils/csv';
	import { csvToolsContent } from '$lib/config/content/csv-tools-content';

	const content = csvToolsContent['viewer'];
	let input = $state('');
	let parsed = $derived(input.trim() ? parseCsv(input) : { ok: true, table: null, error: null });
	let preview = $derived(parsed.table ? parsed.table.rows.slice(0, MAX_RENDER_ROWS) : []);

	function download() {
		if (!parsed.table) return;
		const csv = stringifyCsv(parsed.table.headers, parsed.table.rows, parsed.table.delimiter);
		const blob = new Blob([csv], { type: 'text/csv' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'table.csv';
		a.click();
		URL.revokeObjectURL(a.href);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_CSV)} onClear={() => (input = '')} />
		<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
			<h3 class="font-bold mb-3">CSV</h3>
			<textarea bind:value={input} class="textarea textarea-bordered w-full font-mono text-sm min-h-40" spellcheck="false" placeholder="Paste CSV..."></textarea>
		</div></div>
		{#if parsed.error}
			<div class="alert alert-error">{parsed.error.message}</div>
		{:else if parsed.table}
			<div class="flex flex-wrap gap-3 text-sm">
				<span class="badge badge-outline">{parsed.table.rowCount} rows</span>
				<span class="badge badge-outline">{parsed.table.columnCount} columns</span>
				<span class="badge badge-outline">delimiter {parsed.table.delimiter === '\t' ? 'tab' : parsed.table.delimiter}</span>
				<button class="btn btn-xs" onclick={download}>Download normalized CSV</button>
			</div>
			{#each parsed.table.warnings as w}<div class="alert alert-warning text-sm">{w}</div>{/each}
			{#if parsed.table.rowCount > MAX_RENDER_ROWS}
				<p class="text-sm text-base-content/60">Showing first {MAX_RENDER_ROWS} of {parsed.table.rowCount} rows.</p>
			{/if}
			<div class="overflow-x-auto rounded-xl border border-base-300">
				<table class="table table-zebra table-pin-rows table-sm">
					<thead><tr>{#each parsed.table.headers as h}<th>{h}</th>{/each}</tr></thead>
					<tbody>
						{#each preview as row}
							<tr>{#each row as cell}<td class="font-mono text-xs whitespace-nowrap">{cell}</td>{/each}</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
