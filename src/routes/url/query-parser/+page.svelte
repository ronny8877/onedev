<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import { parseQueryString, queryParamsToJSON, queryParamsToCSV, extractQueryString, type QueryParam } from '$lib/utils/url';

	let input = $state('');
	let params = $state<QueryParam[]>([]);
	let parseTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const _input = input;

		if (parseTimeout) {
			clearTimeout(parseTimeout);
		}

		if (!_input.trim()) {
			params = [];
			return;
		}

		parseTimeout = setTimeout(() => {
			handleParse();
		}, 150);

		return () => {
			if (parseTimeout) {
				clearTimeout(parseTimeout);
			}
		};
	});

	function handleParse() {
		if (!input.trim()) {
			params = [];
			return;
		}

		// Extract query string if full URL is provided
		const queryString = extractQueryString(input) || input;
		params = parseQueryString(queryString);
	}

	async function copyAsJSON() {
		const json = queryParamsToJSON(params);
		await navigator.clipboard.writeText(json);
	}

	async function copyAsCSV() {
		const csv = queryParamsToCSV(params);
		await navigator.clipboard.writeText(csv);
	}

	function clearAll() {
		input = '';
		params = [];
	}

	function loadExample() {
		input = 'https://example.com/search?q=hello%20world&page=1&sort=desc&filter=active&tags=a,b,c';
	}
</script>

<ToolWrapper
	title="Query String Parser"
	description="Parse URL query strings into a readable table. Decode values and export as JSON or CSV."
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button type="button" class="btn btn-ghost btn-sm" onclick={loadExample}>
				Load Example
			</button>
			<button type="button" class="btn btn-ghost btn-sm" onclick={clearAll}>
				Clear
			</button>

			{#if params.length > 0}
				<div class="ml-auto flex gap-2">
					<button type="button" class="btn btn-sm btn-outline" onclick={copyAsJSON}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/></svg>
						Copy JSON
					</button>
					<button type="button" class="btn btn-sm btn-outline" onclick={copyAsCSV}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
						Copy CSV
					</button>
				</div>
			{/if}
		</div>

		<!-- Input -->
		<div>
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-sm font-medium text-base-content/70">URL or Query String</h3>
				<span class="text-xs text-base-content/50">
					{params.length} parameter{params.length !== 1 ? 's' : ''} found
				</span>
			</div>
			<textarea
				bind:value={input}
				placeholder="Paste a URL or query string like ?a=1&b=2..."
				class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Results Table -->
		{#if params.length > 0}
			<div class="overflow-x-auto">
				<table class="table table-zebra w-full">
					<thead>
						<tr>
							<th class="w-8 text-center">#</th>
							<th>Key</th>
							<th>Value</th>
							<th class="w-20 text-center">Encoded</th>
						</tr>
					</thead>
					<tbody>
						{#each params as param, i}
							<tr>
								<td class="text-center text-base-content/50">{i + 1}</td>
								<td class="font-mono text-sm font-medium">{param.key}</td>
								<td class="font-mono text-sm max-w-md truncate" title={param.value}>
								{#if param.value}
									{param.value}
								{:else}
									<span class="text-base-content/40 italic">empty</span>
								{/if}
							</td>
								<td class="text-center">
									{#if param.encoded}
										<span class="badge badge-info badge-sm">Yes</span>
									{:else}
										<span class="badge badge-ghost badge-sm">No</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else if input.trim()}
			<div class="alert rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
				<span>No query parameters found in the input.</span>
			</div>
		{/if}

		<!-- JSON Preview -->
		{#if params.length > 0}
			<div>
				<div class="mb-2 flex items-center justify-between">
					<h3 class="text-sm font-medium text-base-content/70">JSON Preview</h3>
				</div>
				<pre class="bg-base-200 p-4 rounded-xl overflow-x-auto text-sm font-mono">{queryParamsToJSON(params)}</pre>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Tips</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Paste a full URL or just the query string starting with ?</li>
					<li>• Encoded values are automatically decoded for readability</li>
					<li>• Export to JSON for use in code, or CSV for spreadsheets</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
