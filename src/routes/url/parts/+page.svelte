<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import QueryParamsDisplay from '$lib/components/ui/QueryParamsDisplay.svelte';
	import { parseURLParts, parseQueryString, type URLParts, type QueryParam } from '$lib/utils/url';

	let input = $state('');
	let parts = $state<URLParts | null>(null);
	let queryParams = $state<QueryParam[]>([]);
	let parseError = $state(false);

	$effect(() => {
		if (!input.trim()) {
			parts = null;
			queryParams = [];
			parseError = false;
			return;
		}

		const result = parseURLParts(input);
		parts = result;
		parseError = result === null && input.trim().length > 0;
		
		if (result && result.search) {
			queryParams = parseQueryString(result.search);
		} else {
			queryParams = [];
		}
	});

	function clearAll() {
		input = '';
		parts = null;
		queryParams = [];
		parseError = false;
	}

	function loadExample() {
		input = 'https://api.example.com:8080/v1/users/123?name=ronnie,yes,no&page=1&sort=desc&filter[status]=active#section';
	}

	interface URLPart {
		name: string;
		value: string;
		color: string;
		description: string;
	}

	function getParts(p: URLParts): URLPart[] {
		const result: URLPart[] = [];
		
		result.push({
			name: 'Protocol',
			value: p.protocol,
			color: 'badge-primary',
			description: 'The URL scheme (http, https, ftp, etc.)'
		});
		
		if (p.hostname) {
			result.push({
				name: 'Hostname',
				value: p.hostname,
				color: 'badge-secondary',
				description: 'The domain name or IP address'
			});
		}
		
		if (p.port) {
			result.push({
				name: 'Port',
				value: p.port,
				color: 'badge-accent',
				description: 'The port number (default 80/443 if omitted)'
			});
		}
		
		if (p.pathname && p.pathname !== '/') {
			result.push({
				name: 'Path',
				value: p.pathname,
				color: 'badge-info',
				description: 'The path to the resource'
			});
		}
		
		// Note: We show query params separately now
		
		if (p.hash) {
			result.push({
				name: 'Hash',
				value: p.hash,
				color: 'badge-error',
				description: 'Fragment identifier (after #)'
			});
		}
		
		return result;
	}
</script>

<ToolWrapper
	title="URL Parts Analyzer"
	description="Break down a URL into its component parts with detailed query parameter parsing."
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
		</div>

		<!-- Input -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">URL to Analyze</h3>
			</div>
			<input
				type="text"
				bind:value={input}
				placeholder="https://example.com/path?query=value#hash"
				class="input input-bordered w-full font-mono text-sm rounded-xl"
				spellcheck="false"
			/>
		</div>

		<!-- Error -->
		{#if parseError}
			<div class="alert alert-warning rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
				<span>Could not parse URL. Make sure it includes a protocol (e.g., https://)</span>
			</div>
		{/if}

		<!-- Visual Breakdown -->
		{#if parts}
			<div>
				<h3 class="mb-3 text-sm font-medium text-base-content/70">Visual Breakdown</h3>
				<div class="bg-base-200 p-4 rounded-xl overflow-x-auto">
					<div class="flex flex-wrap items-center gap-1 font-mono text-sm">
						<span class="badge badge-primary">{parts.protocol}://</span>
						<span class="badge badge-secondary">{parts.hostname}</span>
						{#if parts.port}
							<span class="text-base-content/50">:</span>
							<span class="badge badge-accent">{parts.port}</span>
						{/if}
						{#if parts.pathname}
							<span class="badge badge-info">{parts.pathname}</span>
						{/if}
						{#if queryParams.length > 0}
							<span class="badge badge-warning">?{queryParams.length} params</span>
						{/if}
						{#if parts.hash}
							<span class="badge badge-error">{parts.hash}</span>
						{/if}
					</div>
				</div>
			</div>

			<!-- Detailed Parts -->
			<div>
				<h3 class="mb-3 text-sm font-medium text-base-content/70">URL Components</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					{#each getParts(parts) as part}
						<div class="bg-base-200 p-3 rounded-xl">
							<div class="flex items-center gap-2 mb-1">
								<span class="badge {part.color} badge-sm">{part.name}</span>
							</div>
							<div class="font-mono text-sm break-all">{part.value}</div>
							<div class="text-xs text-base-content/50 mt-1">{part.description}</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Query Parameters (Detailed) -->
			{#if queryParams.length > 0}
				<div>
					<div class="mb-3 flex items-center justify-between">
						<h3 class="text-sm font-medium text-base-content/70">
							Query Parameters
							<span class="badge badge-warning badge-sm ml-2">{queryParams.length}</span>
						</h3>
					</div>
					<QueryParamsDisplay params={queryParams} />
				</div>
			{/if}

			<!-- Origin -->
			<div class="bg-base-200 p-4 rounded-xl">
				<div class="flex items-center justify-between">
					<div>
						<div class="text-xs text-base-content/50 mb-1">Origin (Protocol + Host + Port)</div>
						<div class="font-mono text-sm font-medium">{parts.origin}</div>
					</div>
					<CopyButton url={parts.origin} size="sm" />
				</div>
			</div>

			<!-- Full URL Copy -->
			<div class="flex items-center gap-2">
				<span class="text-sm text-base-content/60">Copy full URL as:</span>
				<CopyButton url={input} size="sm" />
			</div>
		{/if}

		<!-- Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">URL Structure</h4>
				<div class="mt-2 font-mono text-xs text-base-content/70 overflow-x-auto">
					<span class="text-primary">protocol</span>://<span class="text-secondary">hostname</span>:<span class="text-accent">port</span><span class="text-info">/path</span><span class="text-warning">?query</span><span class="text-error">#hash</span>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
