<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import SelectMenu from '$lib/components/ui/SelectMenu.svelte';
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
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = sample)} onClear={() => (input = '')} copyText={result.output} />
		<div class="flex flex-wrap items-center gap-3">
			<label class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Root</span>
				<input bind:value={rootName} class="input input-sm input-bordered w-36" />
			</label>
			<div class="rounded-lg bg-base-200 px-3 py-1.5">
				<SelectMenu
					bind:value={indent}
					size="sm"
					label="Indent"
					options={[
						{ value: 2, label: '2 spaces' },
						{ value: 4, label: '4 spaces' }
					]}
				/>
			</div>
		</div>
		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">{result.error.message}</div>
		{/if}
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON</h3>
				<CodeMirrorEditor bind:value={input} language="json" placeholder="Paste JSON..." />
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">XML</h3>
				<CodeMirrorEditor value={result.output} language="xml" readonly placeholder="XML output..." />
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
