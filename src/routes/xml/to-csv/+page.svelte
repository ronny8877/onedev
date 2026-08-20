<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { xmlToCsv, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['to-csv'];

	let input = $state('');
	let result = $derived(input.trim() ? xmlToCsv(input) : { ok: true, output: '', error: null, rows: 0 });

	function downloadOutput() {
		if (!result.output) return;
		const blob = new Blob([result.output], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'converted.csv';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_XML)} onClear={() => (input = '')} copyText={result.output} stats={{ lines: result.rows || undefined }} />
		{#if result.ok && result.rows}<p class="text-center text-sm text-base-content/60">{result.rows} row{result.rows === 1 ? '' : 's'} flattened</p>{/if}
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">XML</h3>
					<textarea bind:value={input} placeholder="Paste XML with repeating child records..." class="textarea textarea-bordered w-full font-mono text-sm min-h-72" spellcheck="false"></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex justify-between mb-3">
						<h3 class="font-bold">CSV</h3>
						{#if result.output}<button class="btn btn-xs btn-ghost" onclick={downloadOutput}>Download</button>{/if}
					</div>
					{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
					<textarea value={result.output} readonly placeholder="CSV output..." class="textarea textarea-bordered w-full font-mono text-sm min-h-72 bg-base-100"></textarea>
				</div>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
