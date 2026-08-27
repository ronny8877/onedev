<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import { xmlToJson, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';
	import HowTo from '$lib/components/content/HowTo.svelte';

	const content = xmlToolsContent['to-json'];

	let input = $state('');
	let result = $derived(input.trim() ? xmlToJson(input) : { ok: true, output: '', error: null });
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<ToolActions onSample={() => (input = SAMPLE_XML)} onClear={() => (input = '')} copyText={result.output} stats={{ lines: input ? input.split('\n').length : undefined }} />

		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">{result.error.message}</div>
		{/if}

		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">XML</h3>
				<CodeMirrorEditor bind:value={input} language="xml" placeholder="Paste XML..." errorLine={result.error?.line} />
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON</h3>
				<CodeMirrorEditor value={result.output} language="json" readonly placeholder="JSON output..." />
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
