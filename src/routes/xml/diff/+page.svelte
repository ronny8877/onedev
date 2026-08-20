<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import { diffXml, SAMPLE_XML } from '$lib/utils/xml';
	import { xmlToolsContent } from '$lib/config/content/xml-tools-content';

	const content = xmlToolsContent['diff'];
	const sampleRight = SAMPLE_XML.replace('44.95', '49.95').replace('available="false"', 'available="true"');

	let left = $state('');
	let right = $state('');
	let result = $derived(left.trim() && right.trim() ? diffXml(left, right) : { ok: true, diffs: [], error: null });

	const typeClass: Record<string, string> = {
		added: 'badge-success',
		removed: 'badge-error',
		changed: 'badge-warning'
	};
</script>

<ToolWrapper lastUpdated="2026-08-20">
	<div class="flex flex-col gap-6">
		<ToolActions
			onSample={() => {
				left = SAMPLE_XML;
				right = sampleRight;
			}}
			onClear={() => {
				left = '';
				right = '';
			}}
		/>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Left XML</h3>
					<textarea bind:value={left} class="textarea textarea-bordered w-full font-mono text-sm min-h-64" spellcheck="false"></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Right XML</h3>
					<textarea bind:value={right} class="textarea textarea-bordered w-full font-mono text-sm min-h-64" spellcheck="false"></textarea>
				</div>
			</div>
		</div>
		{#if result.error}
			<div class="alert alert-error">{result.error.message}</div>
		{:else if left.trim() && right.trim()}
			{#if result.diffs.length === 0}
				<div class="alert alert-success">No structural differences.</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr><th>Path</th><th>Change</th><th>Left</th><th>Right</th></tr>
						</thead>
						<tbody>
							{#each result.diffs as d}
								<tr>
									<td class="font-mono text-xs">{d.path}</td>
									<td><span class="badge {typeClass[d.type]}">{d.type}</span></td>
									<td class="font-mono text-xs max-w-xs truncate">{d.left ?? ''}</td>
									<td class="font-mono text-xs max-w-xs truncate">{d.right ?? ''}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
