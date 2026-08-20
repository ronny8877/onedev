<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { jsonToXml } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['from-json'];
	const sample = `{
  "book": [
    { "@id": "bk101", "title": "XML Developer's Guide", "price": 44.95 },
    { "@id": "bk102", "title": "Midnight Rain", "price": 5.95 }
  ]
}`;

	let input = $state('');
	let rootName = $state('catalog');
	let indent = $state(2);
	let result = $derived(input.trim() ? jsonToXml(input, rootName, indent) : { ok: true, output: '', error: null });

	function downloadOutput() {
		if (!result.output) return;
		const blob = new Blob([result.output], { type: 'application/xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'converted.xml';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = sample)} onClear={() => (input = '')} copyText={result.output} />
		<div class="flex flex-wrap gap-4 items-center justify-center">
			<label class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Root:</span>
				<input bind:value={rootName} class="input input-sm input-ghost w-36" />
			</label>
			<label class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Indent:</span>
				<select bind:value={indent} class="select select-sm select-ghost">
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
				</select>
			</label>
		</div>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">JSON</h3>
					<textarea bind:value={input} placeholder="Paste JSON..." class="textarea textarea-bordered w-full font-mono text-sm min-h-72" spellcheck="false"></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex justify-between mb-3">
						<h3 class="font-bold">XML</h3>
						{#if result.output}<button class="btn btn-xs btn-ghost" onclick={downloadOutput}>Download</button>{/if}
					</div>
					{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
					<textarea value={result.output} readonly placeholder="XML output..." class="textarea textarea-bordered w-full font-mono text-sm min-h-72 bg-base-100"></textarea>
				</div>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
