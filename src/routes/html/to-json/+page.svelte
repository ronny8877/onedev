<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import { htmlToJSON } from '$lib/utils/html';

	let input = $state('');

	const jsonOutput = $derived.by(() => {
		if (!input.trim()) return '';
		try {
			const result = htmlToJSON(input);
			return result ? JSON.stringify(result, null, 2) : '';
		} catch {
			return '';
		}
	});

	function handleClear() {
		input = '';
	}
</script>

<ToolWrapper
	title="HTML → JSON"
	description="Convert HTML DOM structure to clean, readable JSON"
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex items-center gap-3">
			<button type="button" class="btn btn-ghost btn-sm" onclick={handleClear}>
				Clear
			</button>
			{#if jsonOutput}
				<span class="text-sm text-base-content/50">
					{jsonOutput.split('\n').length} lines
				</span>
			{/if}
		</div>

		<!-- Editors -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">HTML Input</h3>
				<CodeMirrorEditor bind:value={input} placeholder="Paste your HTML here..." />
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON Output</h3>
				<CodeMirrorEditor value={jsonOutput} readonly placeholder="JSON will appear here..." />
			</div>
		</div>

		<!-- Output Structure Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Output Structure</h4>
				<pre class="mt-2 text-xs text-base-content/70 font-mono bg-base-300 p-3 rounded-lg overflow-x-auto">{`{
  "tag": "div",
  "attributes": { "class": "container", "id": "main" },
  "children": [ ... ],
  "text": "Text content"
}`}</pre>
			</div>
		</div>
	</div>
</ToolWrapper>
