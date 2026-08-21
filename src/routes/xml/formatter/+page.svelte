<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import { formatXml, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['formatter'];

	let input = $state('');
	let indent = $state(2);

	let result = $derived(input.trim() ? formatXml(input, indent) : { ok: true, output: '', error: null });

	let stats = $derived({
		lines: input ? input.split('\n').length : undefined,
		bytes: result.output ? new TextEncoder().encode(result.output).length : undefined
	});

	function loadSample() {
		input = SAMPLE_XML;
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={result.output} {stats} />

		<div class="flex flex-wrap items-center gap-3">
			<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Indent</span>
				<select bind:value={indent} class="select select-bordered select-xs w-24">
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
				</select>
			</div>
		</div>

		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">
				<span>{result.error.message}</span>
			</div>
		{/if}

		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Input XML</h3>
				<CodeMirrorEditor
					bind:value={input}
					language="xml"
					placeholder="Paste XML here..."
					errorLine={result.error?.line}
				/>
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Formatted XML</h3>
				<CodeMirrorEditor
					value={result.output}
					language="xml"
					readonly
					placeholder="Formatted XML will appear here..."
				/>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
