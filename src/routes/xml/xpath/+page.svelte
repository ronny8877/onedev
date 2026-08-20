<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { evaluateXPath, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['xpath'];

	let input = $state('');
	let expression = $state('//book/title');
	let result = $derived(input.trim() && expression.trim() ? evaluateXPath(input, expression) : { ok: true, matches: [], count: 0, error: null });
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_XML)} onClear={() => { input = ''; expression = '//book/title'; }} />

		<label class="form-control">
			<span class="label-text font-medium mb-1">XPath 1.0 expression</span>
			<input bind:value={expression} class="input input-bordered font-mono" placeholder="//book/@id" />
		</label>

		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="font-bold mb-3">XML document</h3>
				<textarea bind:value={input} placeholder="Paste XML..." class="textarea textarea-bordered w-full font-mono text-sm min-h-56" spellcheck="false"></textarea>
			</div>
		</div>

		{#if result.error}
			<div class="alert alert-error">{result.error.message}</div>
		{:else if input.trim()}
			<div class="text-sm text-base-content/60">{result.count} match{result.count === 1 ? '' : 'es'}{result.count === 500 ? ' (capped at 500)' : ''}</div>
			<div class="space-y-2">
				{#each result.matches as match, i}
					<pre class="bg-base-200 rounded-xl p-3 text-xs overflow-x-auto"><code>{i + 1}. {match}</code></pre>
				{/each}
				{#if result.matches.length === 0}
					<p class="text-base-content/50 text-sm">No nodes matched. Default namespaces often need local-name().</p>
				{/if}
			</div>
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
