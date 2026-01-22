<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
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

	function loadExample() {
		input = `<div id="app" class="loaded">
  <header>
    <h1>Title</h1>
  </header>
  <main>
    <p>Hello World</p>
  </main>
</div>`;
	}

	let stats = $derived({
		chars: input.length,
		lines: input.split('\n').length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={handleClear} copyText={jsonOutput} {stats} />

		<!-- Editors -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">HTML Input</h3>
				<CodeMirrorEditor bind:value={input} placeholder="Paste your HTML here..." />
			</div>

			<div>
				<div class="flex items-center justify-between mb-2">
					<h3 class="text-sm font-medium text-base-content/70">JSON Output</h3>
					<span class="text-xs text-base-content/50">
						{jsonOutput ? jsonOutput.split('\n').length : 0} lines
					</span>
				</div>
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
