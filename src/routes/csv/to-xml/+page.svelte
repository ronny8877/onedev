<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { csvToXml, SAMPLE_CSV } from '$lib/utils/csv';
	import { csvToolsContent } from '$lib/config/content/csv-tools-content';

	const content = csvToolsContent['to-xml'];
	let input = $state('');
	let rootName = $state('rows');
	let rowName = $state('row');
	let result = $derived(input.trim() ? csvToXml(input, undefined, rootName, rowName) : { ok: true, output: '', error: null });

	function download() {
		if (!result.output) return;
		const blob = new Blob([result.output], { type: 'application/xml' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'converted.xml';
		a.click();
		URL.revokeObjectURL(a.href);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_CSV)} onClear={() => (input = '')} copyText={result.output} />
		<div class="flex flex-wrap gap-3 justify-center">
			<label class="flex items-center gap-2">Root <input bind:value={rootName} class="input input-sm input-bordered w-28" /></label>
			<label class="flex items-center gap-2">Row <input bind:value={rowName} class="input input-sm input-bordered w-28" /></label>
		</div>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<h3 class="font-bold mb-3">CSV</h3>
				<textarea bind:value={input} class="textarea textarea-bordered w-full font-mono text-sm min-h-64" spellcheck="false"></textarea>
			</div></div>
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<div class="flex justify-between mb-3"><h3 class="font-bold">XML</h3>{#if result.output}<button class="btn btn-xs btn-ghost" onclick={download}>Download</button>{/if}</div>
				{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
				<textarea value={result.output} readonly class="textarea textarea-bordered w-full font-mono text-sm min-h-64 bg-base-100"></textarea>
			</div></div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
