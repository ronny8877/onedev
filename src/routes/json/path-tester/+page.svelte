<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeEditor from '$lib/components/ui/CodeEditor.svelte';
	import ErrorDisplay from '$lib/components/ui/ErrorDisplay.svelte';
	import { queryJSONPath, parseJSONSafe, type ParseError } from '$lib/utils/json';

	let input = $state('');
	let path = $state('$');
	let results = $state<unknown[]>([]);
	let error = $state<ParseError | null>(null);
	let queryTimeout: ReturnType<typeof setTimeout> | null = null;

	// Auto-query with debounce when input and path exist
	$effect(() => {
		const _input = input;
		const _path = path;

		if (queryTimeout) {
			clearTimeout(queryTimeout);
		}

		if (!_input.trim()) {
			results = [];
			error = null;
			return;
		}

		if (!_path.trim()) {
			results = [];
			error = null;
			return;
		}

		queryTimeout = setTimeout(() => {
			handleQuery();
		}, 400);

		return () => {
			if (queryTimeout) {
				clearTimeout(queryTimeout);
			}
		};
	});

	function handleQuery() {
		error = null;
		results = [];

		if (!input.trim()) {
			error = { message: 'Please enter JSON to query' };
			return;
		}

		if (!path.trim()) {
			error = { message: 'Please enter a JSONPath expression' };
			return;
		}

		try {
			results = queryJSONPath(input, path);
		} catch (err) {
			error = { message: (err as Error).message };
		}
	}

	// Example paths for quick selection
	const examplePaths = [
		{ label: 'Root', path: '$' },
		{ label: 'All keys', path: '$.*' },
		{ label: 'First item', path: '$[0]' },
		{ label: 'Nested', path: '$.data.items' }
	];

	function setExamplePath(p: string) {
		path = p;
	}

	function formatResult(value: unknown): string {
		if (typeof value === 'object') {
			return JSON.stringify(value, null, 2);
		}
		return String(value);
	}
</script>

<ToolWrapper
	title="JSON Path Tester"
	description="Test JSONPath expressions and see matched results"
>
	<div class="flex flex-col gap-6">
		<!-- Path Input -->
		<div class="flex flex-wrap items-end gap-3">
			<div class="flex-1">
				<label for="path" class="mb-2 block text-sm font-medium text-base-content/70">
					JSONPath Expression
				</label>
				<div class="join w-full">
					<input
						id="path"
						type="text"
						class="input join-item input-bordered flex-1"
						bind:value={path}
						placeholder="$.store.book[0].title"
					/>
					<button type="button" class="btn btn-primary join-item" onclick={handleQuery}>
						Query
					</button>
				</div>
			</div>
		</div>

		<!-- Quick Examples -->
		<div class="flex flex-wrap items-center gap-2">
			<span class="text-sm text-base-content/50">Quick paths:</span>
			{#each examplePaths as example}
				<button
					type="button"
					class="btn btn-ghost btn-xs"
					onclick={() => setExamplePath(example.path)}
				>
					{example.label}
				</button>
			{/each}
		</div>

		<!-- Error Display -->
		<ErrorDisplay {error} />

		<!-- Main Content -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON Input</h3>
				<CodeEditor
					bind:value={input}
					placeholder={'{"store": {"book": [{"title": "Example"}]}}'}
				/>
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">
					Results ({results.length} match{results.length !== 1 ? 'es' : ''})
				</h3>
				<div class="min-h-[300px] max-h-[500px] overflow-auto rounded-xl border border-base-300 bg-base-200 p-4">
					{#if results.length === 0}
						<p class="text-base-content/50">No results. Enter JSON and a JSONPath to query.</p>
					{:else}
						<div class="space-y-2">
							{#each results as result, i}
								<div class="rounded-lg bg-base-100 p-3">
									<div class="mb-1 text-xs text-base-content/50">Result {i + 1}</div>
									<pre class="overflow-auto text-sm font-mono">{formatResult(result)}</pre>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Syntax Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">JSONPath Syntax:</h4>
				<div class="mt-2 overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Expression</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody class="text-sm">
							<tr>
								<td class="font-mono">$</td>
								<td>Root object</td>
							</tr>
							<tr>
								<td class="font-mono">.key</td>
								<td>Child property</td>
							</tr>
							<tr>
								<td class="font-mono">[0]</td>
								<td>Array index</td>
							</tr>
							<tr>
								<td class="font-mono">.*</td>
								<td>All children</td>
							</tr>
							<tr>
								<td class="font-mono">$.a.b.c</td>
								<td>Nested path</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
