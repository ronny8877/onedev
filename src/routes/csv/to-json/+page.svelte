<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import SelectMenu from '$lib/components/ui/SelectMenu.svelte';
	import { csvToJson, SAMPLE_CSV, type CsvDelimiter } from '$lib/utils/csv';
	import { csvToolsContent } from '$lib/config/content/csv-tools-content';

	const content = csvToolsContent['to-json'];
	let input = $state('');
	let delimiter = $state<CsvDelimiter | ''>('');
	let result = $derived(input.trim() ? csvToJson(input, delimiter || undefined) : { ok: true, output: '', error: null, rows: 0 });

	function download() {
		if (!result.output) return;
		const blob = new Blob([result.output], { type: 'application/json' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'converted.json';
		a.click();
		URL.revokeObjectURL(a.href);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_CSV)} onClear={() => (input = '')} copyText={result.output} stats={{ lines: result.rows || undefined }} />
		<div class="flex justify-center">
			<SelectMenu
				bind:value={delimiter}
				label="Delimiter"
				options={[
					{ value: '', label: 'Auto' },
					{ value: ',', label: 'Comma' },
					{ value: ';', label: 'Semicolon' },
					{ value: '\t', label: 'Tab' },
					{ value: '|', label: 'Pipe' }
				]}
			/>
		</div>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<h3 class="font-bold mb-3">CSV</h3>
				<textarea bind:value={input} class="textarea textarea-bordered w-full font-mono text-sm min-h-72" spellcheck="false" placeholder="Paste CSV..."></textarea>
			</div></div>
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<div class="flex justify-between mb-3"><h3 class="font-bold">JSON</h3>{#if result.output}<button class="btn btn-xs btn-ghost" onclick={download}>Download</button>{/if}</div>
				{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
				<textarea value={result.output} readonly class="textarea textarea-bordered w-full font-mono text-sm min-h-72 bg-base-100" placeholder="JSON..."></textarea>
			</div></div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
