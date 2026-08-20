<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { validateCsv, SAMPLE_CSV } from '$lib/utils/csv';
	import { csvToolsContent } from '$lib/config/content/csv-tools-content';

	const content = csvToolsContent['validator'];
	let input = $state('');
	let result = $derived(input.trim() ? validateCsv(input) : null);
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_CSV)} onClear={() => (input = '')} />
		<textarea bind:value={input} class="textarea textarea-bordered w-full font-mono text-sm min-h-56" spellcheck="false" placeholder="Paste CSV..."></textarea>
		{#if result}
			{#if result.issues.length === 0}
				<div class="alert alert-success">Looks like well-formed CSV. {result.table?.rowCount} rows, {result.table?.columnCount} columns, delimiter {result.table?.delimiter === '\t' ? 'tab' : result.table?.delimiter}.</div>
			{:else}
				<div class="space-y-2">
					{#each result.issues as issue}
						<div class="alert {issue.level === 'error' ? 'alert-error' : 'alert-warning'} text-sm">
							<span>{issue.level}{issue.line ? ` (line ${issue.line})` : ''}: {issue.message}</span>
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
