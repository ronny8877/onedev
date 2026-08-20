<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { minifyXml, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['minifier'];

	let input = $state('');
	let result = $derived(input.trim() ? minifyXml(input) : { ok: true, output: '', error: null });
	let inBytes = $derived(input ? new TextEncoder().encode(input).length : 0);
	let outBytes = $derived(result.output ? new TextEncoder().encode(result.output).length : 0);

	function downloadOutput() {
		if (!result.output) return;
		const blob = new Blob([result.output], { type: 'application/xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'minified.xml';
		a.click();
		URL.revokeObjectURL(url);
	}
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

		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Input XML</h3>
					<textarea bind:value={input} placeholder="Paste XML..." class="textarea textarea-bordered w-full font-mono text-sm min-h-72" spellcheck="false"></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex justify-between mb-3">
						<h3 class="font-bold">Minified XML</h3>
						{#if result.output}<button class="btn btn-xs btn-ghost" onclick={downloadOutput}>Download</button>{/if}
					</div>
					{#if result.error}<div class="alert alert-error mb-3 text-sm">{result.error.message}</div>{/if}
					<textarea value={result.output} readonly placeholder="Minified XML..." class="textarea textarea-bordered w-full font-mono text-sm min-h-72 bg-base-100"></textarea>
				</div>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
