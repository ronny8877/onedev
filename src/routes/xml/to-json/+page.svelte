<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { xmlToJson, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['to-json'];

	let input = $state('');
	let result = $derived(input.trim() ? xmlToJson(input) : { ok: true, output: '', error: null });

	function downloadOutput() {
		if (!result.output) return;
		const blob = new Blob([result.output], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'converted.json';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_XML)} onClear={() => (input = '')} copyText={result.output} stats={{ lines: input ? input.split('\n').length : undefined }} />
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">XML</h3>
					<textarea bind:value={input} placeholder="Paste XML..." class="textarea textarea-bordered w-full font-mono text-sm min-h-72" spellcheck="false"></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex justify-between mb-3">
						<h3 class="font-bold">JSON</h3>
						{#if result.output}<button class="btn btn-xs btn-ghost" onclick={downloadOutput}>Download</button>{/if}
					</div>
					{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
					<textarea value={result.output} readonly placeholder="JSON output..." class="textarea textarea-bordered w-full font-mono text-sm min-h-72 bg-base-100"></textarea>
				</div>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
