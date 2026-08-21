<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import { xmlToCsv, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['to-csv'];

	let input = $state('');
	let result = $derived(input.trim() ? xmlToCsv(input) : { ok: true, output: '', error: null, rows: 0 });
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_XML)} onClear={() => (input = '')} copyText={result.output} stats={{ lines: result.rows || undefined }} />
		{#if result.ok && result.rows}<p class="text-center text-sm text-base-content/60">{result.rows} row{result.rows === 1 ? '' : 's'} flattened</p>{/if}
		{#if result.error}<div class="alert alert-error rounded-xl text-sm">{result.error.message}</div>{/if}
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">XML</h3>
				<CodeMirrorEditor bind:value={input} language="xml" placeholder="Paste XML with repeating child records..." errorLine={result.error?.line} />
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">CSV</h3>
				<textarea
					value={result.output}
					readonly
					placeholder="CSV output..."
					class="textarea textarea-bordered w-full font-mono text-sm min-h-72 bg-base-100"
				></textarea>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
