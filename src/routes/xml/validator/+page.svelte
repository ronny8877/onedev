<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import { parseXml, xmlStats, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['validator'];

	let input = $state('');

	let parsed = $derived(input.trim() ? parseXml(input) : { ok: true, doc: null, error: null });
	let stats = $derived(input.trim() ? xmlStats(input) : { ok: false, stats: null, error: null });
	let lineStats = $derived({ lines: input ? input.split('\n').length : undefined });
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = SAMPLE_XML)} onClear={() => (input = '')} stats={lineStats} />

		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">XML</h3>
			<CodeMirrorEditor
				bind:value={input}
				language="xml"
				placeholder="Paste XML to validate..."
				errorLine={parsed.error?.line}
			/>
		</div>

		{#if input.trim()}
			{#if parsed.ok}
				<div class="alert alert-success rounded-xl">
					<span>Well-formed XML. Root element: <strong>{stats.stats?.rootName}</strong></span>
				</div>
				{#if stats.stats}
					<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<div class="stat bg-base-200 rounded-xl"><div class="stat-title">Elements</div><div class="stat-value text-2xl">{stats.stats.elements}</div></div>
						<div class="stat bg-base-200 rounded-xl"><div class="stat-title">Attributes</div><div class="stat-value text-2xl">{stats.stats.attributes}</div></div>
						<div class="stat bg-base-200 rounded-xl"><div class="stat-title">Max depth</div><div class="stat-value text-2xl">{stats.stats.maxDepth}</div></div>
						<div class="stat bg-base-200 rounded-xl"><div class="stat-title">Text nodes</div><div class="stat-value text-2xl">{stats.stats.textNodes}</div></div>
						<div class="stat bg-base-200 rounded-xl"><div class="stat-title">Comments</div><div class="stat-value text-2xl">{stats.stats.comments}</div></div>
						<div class="stat bg-base-200 rounded-xl">
							<div class="stat-title">Namespaces</div>
							<div class="stat-value text-lg truncate">{stats.stats.namespaces.length ? stats.stats.namespaces.join(', ') : 'none'}</div>
						</div>
					</div>
				{/if}
			{:else}
				<div class="alert alert-error rounded-xl">
					<div>
						<div class="font-semibold">Not well-formed</div>
						<div class="text-sm mt-1">{parsed.error?.message}</div>
						{#if parsed.error?.line}
							<div class="text-xs mt-1 opacity-80">Line {parsed.error.line}{parsed.error.column ? `, column ${parsed.error.column}` : ''}</div>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
