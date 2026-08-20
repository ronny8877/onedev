<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
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

	function downloadOutput() {
		if (!result.output) return;
		const blob = new Blob([result.output], { type: 'application/xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'formatted.xml';
		a.click();
		URL.revokeObjectURL(url);
	}

	function copyOutput() {
		if (result.output) navigator.clipboard.writeText(result.output);
	}
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={result.output} {stats} />

		<div class="flex flex-wrap gap-4 items-center justify-center">
			<div class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Indent:</span>
				<select bind:value={indent} class="select select-sm select-ghost">
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
				</select>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Input XML</h3>
					<textarea
						bind:value={input}
						placeholder="Paste XML here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-72 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-bold">Formatted XML</h3>
						{#if result.ok && result.output}
							<div class="flex gap-1">
								<button class="btn btn-xs btn-ghost" onclick={copyOutput}>Copy</button>
								<button class="btn btn-xs btn-ghost" onclick={downloadOutput}>Download</button>
							</div>
						{/if}
					</div>
					{#if result.error}
						<div class="alert alert-error rounded-lg mb-3 text-sm">{result.error.message}</div>
					{/if}
					<textarea
						value={result.output}
						readonly
						placeholder="Formatted XML will appear here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-72 leading-relaxed bg-base-100"
					></textarea>
				</div>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
