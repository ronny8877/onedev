<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let input = $state('');
	let output = $state('');
	let options = $state({
		lowercaseHost: true,
		removeDefaultPort: true,
		sortParams: true,
		removeTrailingSlash: true,
		removeFragment: false,
		decodeUnnecessary: true
	});

	$effect(() => {
		if (!input.trim()) {
			output = '';
			return;
		}

		output = normalizeURL(input);
	});

	function normalizeURL(urlString: string): string {
		try {
			const url = new URL(urlString);
			
			// Lowercase host
			if (options.lowercaseHost) {
				url.hostname = url.hostname.toLowerCase();
			}
			
			// Remove default ports
			if (options.removeDefaultPort) {
				if ((url.protocol === 'http:' && url.port === '80') ||
					(url.protocol === 'https:' && url.port === '443')) {
					url.port = '';
				}
			}
			
			// Sort query params
			if (options.sortParams) {
				const params = new URLSearchParams(url.search);
				const sortedParams = new URLSearchParams();
				const keys = Array.from(params.keys()).sort();
				for (const key of keys) {
					const values = params.getAll(key);
					for (const value of values) {
						sortedParams.append(key, value);
					}
				}
				url.search = sortedParams.toString();
			}
			
			// Remove fragment
			if (options.removeFragment) {
				url.hash = '';
			}
			
			let result = url.toString();
			
			// Remove trailing slash (but not for root)
			if (options.removeTrailingSlash && url.pathname !== '/') {
				result = result.replace(/\/$/, '');
			}
			
			return result;
		} catch {
			return 'Invalid URL';
		}
	}

	function clearAll() {
		input = '';
		output = '';
	}

	function loadExample() {
		input = 'HTTPS://EXAMPLE.COM:443/path/to/page/?z=3&a=1&m=2#section';
	}

	let changes = $derived(() => {
		if (!input.trim() || !output || output === 'Invalid URL') return [];
		
		const result: string[] = [];
		if (input !== output) {
			if (options.lowercaseHost && /[A-Z]/.test(new URL(input).hostname)) {
				result.push('Lowercased hostname');
			}
			if (options.removeDefaultPort && /:(?:80|443)/.test(input)) {
				result.push('Removed default port');
			}
			if (options.sortParams && input.includes('?')) {
				result.push('Sorted query parameters');
			}
			if (options.removeTrailingSlash && input.endsWith('/') && !output.endsWith('/')) {
				result.push('Removed trailing slash');
			}
			if (options.removeFragment && input.includes('#') && !output.includes('#')) {
				result.push('Removed fragment');
			}
		}
		return result;
	});
</script>

<ToolWrapper
	title="URL Normalizer"
	description="Normalize URLs for consistency: lowercase host, remove default ports, sort query params."
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
				<h3 class="text-sm font-medium text-base-content/70">URL to Normalize</h3>
			</div>
			<input
				type="text"
				bind:value={input}
				placeholder="HTTPS://EXAMPLE.COM:443/path/?b=2&a=1"
				class="input input-bordered w-full font-mono text-sm rounded-xl"
				spellcheck="false"
			/>
		</div>

		<!-- Options -->
		<div class="grid gap-3 sm:grid-cols-2">
			<label class="label cursor-pointer justify-start gap-3">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={options.lowercaseHost} />
				<span class="label-text">Lowercase hostname</span>
			</label>
			<label class="label cursor-pointer justify-start gap-3">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={options.removeDefaultPort} />
				<span class="label-text">Remove default port (80/443)</span>
			</label>
			<label class="label cursor-pointer justify-start gap-3">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={options.sortParams} />
				<span class="label-text">Sort query parameters</span>
			</label>
			<label class="label cursor-pointer justify-start gap-3">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={options.removeTrailingSlash} />
				<span class="label-text">Remove trailing slash</span>
			</label>
			<label class="label cursor-pointer justify-start gap-3">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={options.removeFragment} />
				<span class="label-text">Remove fragment (#...)</span>
			</label>
		</div>

		<!-- Changes Applied -->
		{#if changes().length > 0}
			<div class="flex flex-wrap gap-2">
				{#each changes() as change}
					<span class="badge badge-success badge-sm gap-1">
						<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
						{change}
					</span>
				{/each}
			</div>
		{/if}

		<!-- Output -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Normalized URL</h3>
			</div>
			<div class="bg-base-200 p-4 rounded-xl font-mono text-sm break-all min-h-[60px]">
				{#if output}
					{output}
				{:else}
					<span class="text-base-content/40">Normalized URL will appear here...</span>
				{/if}
			</div>
		</div>

		<!-- Copy Options -->
		{#if output && output !== 'Invalid URL'}
			<div class="flex items-center gap-2">
				<span class="text-sm text-base-content/60">Copy as:</span>
				<CopyButton url={output} size="sm" />
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Why Normalize URLs?</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Caching</strong>: Same content, same URL</li>
					<li>• <strong>Comparison</strong>: Compare URLs reliably</li>
					<li>• <strong>SEO</strong>: Avoid duplicate content issues</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
