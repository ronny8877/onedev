<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import { minifyXml, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['minifier'];

	let input = $state('');
	let result = $derived(input.trim() ? minifyXml(input) : { ok: true, output: '', error: null });
	let inBytes = $derived(input ? new TextEncoder().encode(input).length : 0);
	let outBytes = $derived(result.output ? new TextEncoder().encode(result.output).length : 0);
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions
			onSample={() => (input = SAMPLE_XML)}
			onClear={() => (input = '')}
			copyText={result.output}
			stats={{ bytes: outBytes || undefined, chars: result.output.length || undefined }}
		/>

		{#if result.ok && result.output && inBytes}
			<div class="text-center text-sm text-base-content/60">
				{inBytes.toLocaleString()} bytes → {outBytes.toLocaleString()} bytes
				{#if outBytes < inBytes}
					({Math.round((1 - outBytes / inBytes) * 100)}% smaller)
				{/if}
			</div>
		{/if}

		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">{result.error.message}</div>
		{/if}

		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Input XML</h3>
				<CodeMirrorEditor bind:value={input} language="xml" placeholder="Paste XML..." errorLine={result.error?.line} />
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Minified XML</h3>
				<CodeMirrorEditor value={result.output} language="xml" readonly placeholder="Minified XML..." />
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
