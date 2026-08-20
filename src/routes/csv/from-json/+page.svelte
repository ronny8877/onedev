<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { jsonToCsv, type CsvDelimiter } from '$lib/utils/csv';
	import { csvToolsContent } from '$lib/config/content/csv-tools-content';

	const content = csvToolsContent['from-json'];
	const sample = `[{"id":1,"name":"Alice Johnson","role":"Admin"},{"id":2,"name":"Bob Smith","role":"User"}]`;
	let input = $state('');
	let delimiter = $state<CsvDelimiter>(',');
	let result = $derived(input.trim() ? jsonToCsv(input, delimiter) : { ok: true, output: '', error: null, rows: 0 });

	function download() {
		if (!result.output) return;
		const blob = new Blob([result.output], { type: 'text/csv' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'converted.csv';
		a.click();
		URL.revokeObjectURL(a.href);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = sample)} onClear={() => (input = '')} copyText={result.output} stats={{ lines: result.rows || undefined }} />
		<label class="flex items-center gap-2 justify-center">
			<span class="text-sm">Delimiter</span>
			<select bind:value={delimiter} class="select select-sm select-bordered">
				<option value=",">Comma</option>
				<option value=";">Semicolon</option>
				<option value={'\t'}>Tab</option>
				<option value="|">Pipe</option>
			</select>
		</label>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<h3 class="font-bold mb-3">JSON array</h3>
				<textarea bind:value={input} class="textarea textarea-bordered w-full font-mono text-sm min-h-72" spellcheck="false" placeholder="[{...}]"></textarea>
			</div></div>
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<div class="flex justify-between mb-3"><h3 class="font-bold">CSV</h3>{#if result.output}<button class="btn btn-xs btn-ghost" onclick={download}>Download</button>{/if}</div>
				{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
				<textarea value={result.output} readonly class="textarea textarea-bordered w-full font-mono text-sm min-h-72 bg-base-100" placeholder="CSV..."></textarea>
			</div></div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
