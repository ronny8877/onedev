<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { escapeXmlText, escapeXmlAttr, unescapeXml } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['escape'];

	let input = $state('');
	let mode = $state<'escape-text' | 'escape-attr' | 'unescape'>('escape-text');

	let output = $derived.by(() => {
		if (!input) return '';
		if (mode === 'unescape') return unescapeXml(input);
		if (mode === 'escape-attr') return escapeXmlAttr(input);
		return escapeXmlText(input);
	});
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = 'Price < $5 & "special"')} onClear={() => (input = '')} copyText={output} />
		<div class="flex flex-wrap gap-2 justify-center">
			<button class="btn btn-sm" class:btn-primary={mode === 'escape-text'} onclick={() => (mode = 'escape-text')}>Escape text</button>
			<button class="btn btn-sm" class:btn-primary={mode === 'escape-attr'} onclick={() => (mode = 'escape-attr')}>Escape attribute</button>
			<button class="btn btn-sm" class:btn-primary={mode === 'unescape'} onclick={() => (mode = 'unescape')}>Unescape</button>
		</div>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Input</h3>
					<textarea bind:value={input} placeholder="Text or entities..." class="textarea textarea-bordered w-full font-mono text-sm min-h-56" spellcheck="false"></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Output</h3>
					<textarea value={output} readonly placeholder="Result..." class="textarea textarea-bordered w-full font-mono text-sm min-h-56 bg-base-100"></textarea>
				</div>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
