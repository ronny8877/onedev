<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { parseCsv, stringifyCsv, SAMPLE_CSV, type CsvDelimiter } from '$lib/utils/csv';
	import { csvToolsContent } from '$lib/config/content/csv-tools-content';

	const content = csvToolsContent['delimiter'];
	let input = $state('');
	let target = $state<CsvDelimiter>(',');
	let result = $derived.by(() => {
		if (!input.trim()) return { ok: true, output: '', error: null as { message: string } | null };
		const parsed = parseCsv(input);
		if (!parsed.ok || !parsed.table) return { ok: false, output: '', error: parsed.error };
		return { ok: true, output: stringifyCsv(parsed.table.headers, parsed.table.rows, target), error: null };
	});

	function download() {
		if (!result.output) return;
		const ext = target === '\t' ? 'tsv' : 'csv';
		const blob = new Blob([result.output], { type: 'text/csv' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `converted.${ext}`;
		a.click();
		URL.revokeObjectURL(a.href);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_CSV)} onClear={() => (input = '')} copyText={result.output} />
		<label class="flex items-center gap-2 justify-center">
			<span class="text-sm">Output delimiter</span>
			<select bind:value={target} class="select select-sm select-bordered">
				<option value=",">Comma</option>
				<option value=";">Semicolon</option>
				<option value={'\t'}>Tab (TSV)</option>
				<option value="|">Pipe</option>
			</select>
		</label>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<h3 class="font-bold mb-3">Input</h3>
				<textarea bind:value={input} class="textarea textarea-bordered w-full font-mono text-sm min-h-64" spellcheck="false"></textarea>
			</div></div>
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<div class="flex justify-between mb-3"><h3 class="font-bold">Output</h3>{#if result.output}<button class="btn btn-xs btn-ghost" onclick={download}>Download</button>{/if}</div>
				{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
				<textarea value={result.output} readonly class="textarea textarea-bordered w-full font-mono text-sm min-h-64 bg-base-100"></textarea>
			</div></div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
