<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { csvToSql, SAMPLE_CSV } from '$lib/utils/csv';
	import { csvToolsContent } from '$lib/config/content/csv-tools-content';

	const content = csvToolsContent['to-sql'];
	let input = $state('');
	let tableName = $state('data');
	let result = $derived(input.trim() ? csvToSql(input, tableName) : { ok: true, output: '', error: null });
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_CSV)} onClear={() => (input = '')} copyText={result.output} />
		<label class="flex items-center gap-2 justify-center">Table <input bind:value={tableName} class="input input-sm input-bordered w-40 font-mono" /></label>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<h3 class="font-bold mb-3">CSV</h3>
				<textarea bind:value={input} class="textarea textarea-bordered w-full font-mono text-sm min-h-64" spellcheck="false"></textarea>
			</div></div>
			<div class="card bg-base-200 rounded-2xl"><div class="card-body p-4">
				<h3 class="font-bold mb-3">SQL</h3>
				{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
				<textarea value={result.output} readonly class="textarea textarea-bordered w-full font-mono text-sm min-h-64 bg-base-100"></textarea>
			</div></div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
