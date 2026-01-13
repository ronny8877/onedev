<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeEditor from '$lib/components/ui/CodeEditor.svelte';
	import JsonTree from '$lib/components/ui/JsonTree.svelte';
	import ErrorDisplay from '$lib/components/ui/ErrorDisplay.svelte';
	import { parseJSONSafe, type ParseError } from '$lib/utils/json';

	let input = $state('');
	let parsedData = $state<unknown>(null);
	let error = $state<ParseError | null>(null);
	let expandAll = $state(false);

	$effect(() => {
		if (!input.trim()) {
			parsedData = null;
			error = null;
			return;
		}

		const result = parseJSONSafe(input);
		if (result.valid) {
			parsedData = result.data;
			error = null;
		} else {
			parsedData = null;
			error = result.error || null;
		}
	});

	function toggleExpandAll() {
		expandAll = !expandAll;
	}
</script>

<ToolWrapper
	title="JSON Visualizer"
	description="Explore your JSON data with an interactive tree view"
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button
				type="button"
				class="btn btn-primary btn-sm"
				onclick={toggleExpandAll}
				disabled={!parsedData}
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if expandAll}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20 12H4"
						></path>
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						></path>
					{/if}
				</svg>
				{expandAll ? 'Collapse All' : 'Expand All'}
			</button>

			{#if parsedData}
				<span class="text-sm text-base-content/50">
					Type: {Array.isArray(parsedData) ? 'Array' : typeof parsedData}
				</span>
			{/if}
		</div>

		<!-- Error Display -->
		<ErrorDisplay {error} />

		<!-- Main Layout -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input Editor -->
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON Input</h3>
				<CodeEditor
					bind:value={input}
					placeholder="Paste your JSON here to visualize..."
					errorLine={error?.line}
				/>
			</div>

			<!-- Tree View -->
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Tree View</h3>
				<div class="min-h-[300px] max-h-[500px] overflow-auto rounded-lg border border-base-300 bg-base-200 p-4">
					{#if parsedData}
						{#key expandAll}
							<JsonTree data={parsedData} {expandAll} />
						{/key}
					{:else}
						<p class="text-base-content/50">Enter valid JSON to see the tree visualization</p>
					{/if}
				</div>
			</div>
		</div>

		<!-- Legend -->
		<div class="card bg-base-200">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Color Legend:</h4>
				<div class="mt-2 flex flex-wrap gap-4 text-sm font-mono">
					<span><span class="json-key">"key"</span>: Property names</span>
					<span><span class="json-string">"string"</span>: Strings</span>
					<span><span class="json-number">123</span>: Numbers</span>
					<span><span class="json-boolean">true</span>: Booleans</span>
					<span><span class="json-null">null</span>: Null values</span>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
