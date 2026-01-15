<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';

	let url1 = $state('');
	let url2 = $state('');
	let comparison = $state<{
		identical: boolean;
		sameOrigin: boolean;
		samePath: boolean;
		sameParams: boolean;
		paramOrderDiff: boolean;
		differences: string[];
		url1Parts: { host: string; path: string; params: Map<string, string[]>; hash: string } | null;
		url2Parts: { host: string; path: string; params: Map<string, string[]>; hash: string } | null;
	} | null>(null);

	function parseURLForComparison(urlString: string) {
		try {
			const url = new URL(urlString);
			const params = new Map<string, string[]>();
			url.searchParams.forEach((value, key) => {
				const existing = params.get(key) || [];
				existing.push(value);
				params.set(key, existing);
			});
			return {
				host: url.host.toLowerCase(),
				path: url.pathname,
				params,
				hash: url.hash
			};
		} catch {
			return null;
		}
	}

	function mapsEqual(map1: Map<string, string[]>, map2: Map<string, string[]>): boolean {
		if (map1.size !== map2.size) return false;
		for (const [key, values1] of map1) {
			const values2 = map2.get(key);
			if (!values2 || values1.length !== values2.length) return false;
			const sorted1 = [...values1].sort();
			const sorted2 = [...values2].sort();
			if (!sorted1.every((v, i) => v === sorted2[i])) return false;
		}
		return true;
	}

	function mapsOrderEqual(map1: Map<string, string[]>, map2: Map<string, string[]>): boolean {
		const keys1 = Array.from(map1.keys());
		const keys2 = Array.from(map2.keys());
		return keys1.join(',') === keys2.join(',');
	}

	$effect(() => {
		if (!url1.trim() || !url2.trim()) {
			comparison = null;
			return;
		}

		const parts1 = parseURLForComparison(url1);
		const parts2 = parseURLForComparison(url2);

		if (!parts1 || !parts2) {
			comparison = {
				identical: false,
				sameOrigin: false,
				samePath: false,
				sameParams: false,
				paramOrderDiff: false,
				differences: ['One or both URLs are invalid'],
				url1Parts: parts1,
				url2Parts: parts2
			};
			return;
		}

		const sameOrigin = parts1.host === parts2.host;
		const samePath = parts1.path === parts2.path;
		const sameParams = mapsEqual(parts1.params, parts2.params);
		const paramOrderDiff = sameParams && !mapsOrderEqual(parts1.params, parts2.params);
		const sameHash = parts1.hash === parts2.hash;
		const identical = sameOrigin && samePath && sameParams && sameHash && !paramOrderDiff;

		const differences: string[] = [];
		if (!sameOrigin) differences.push(`Host differs: "${parts1.host}" vs "${parts2.host}"`);
		if (!samePath) differences.push(`Path differs: "${parts1.path}" vs "${parts2.path}"`);
		if (!sameParams) {
			// Find specific param differences
			const allKeys = new Set([...parts1.params.keys(), ...parts2.params.keys()]);
			for (const key of allKeys) {
				const vals1 = parts1.params.get(key);
				const vals2 = parts2.params.get(key);
				if (!vals1) differences.push(`Param "${key}" only in URL 2`);
				else if (!vals2) differences.push(`Param "${key}" only in URL 1`);
				else if (vals1.join(',') !== vals2.join(',')) {
					differences.push(`Param "${key}" value differs`);
				}
			}
		}
		if (paramOrderDiff) differences.push('Same params, different order');
		if (!sameHash && (parts1.hash || parts2.hash)) {
			differences.push(`Hash differs: "${parts1.hash}" vs "${parts2.hash}"`);
		}

		comparison = {
			identical,
			sameOrigin,
			samePath,
			sameParams,
			paramOrderDiff,
			differences,
			url1Parts: parts1,
			url2Parts: parts2
		};
	});

	function clearAll() {
		url1 = '';
		url2 = '';
		comparison = null;
	}

	function loadExample() {
		url1 = 'https://api.example.com/users?page=1&limit=10&sort=name';
		url2 = 'https://api.example.com/users?sort=name&page=1&limit=10';
	}

	function swapURLs() {
		const temp = url1;
		url1 = url2;
		url2 = temp;
	}
</script>

<ToolWrapper
	title="URL Compare Tool"
	description="Semantic URL comparison. Detects if URLs point to the same resource despite different formatting."
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={clearAll}>
			{#snippet extraActions()}
				<button type="button" class="btn btn-ghost btn-sm" onclick={swapURLs}>
					Swap URLs
				</button>
			{/snippet}
		</ToolActions>

		<!-- Inputs -->
		<div class="grid gap-4 lg:grid-cols-2">
			<div>
				<div class="mb-2">
					<h3 class="text-sm font-medium text-base-content/70">URL 1</h3>
				</div>
				<textarea
					bind:value={url1}
					placeholder="https://example.com/path?a=1&b=2"
					class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>
			<div>
				<div class="mb-2">
					<h3 class="text-sm font-medium text-base-content/70">URL 2</h3>
				</div>
				<textarea
					bind:value={url2}
					placeholder="https://example.com/path?b=2&a=1"
					class="textarea textarea-bordered w-full min-h-[100px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>
		</div>

		<!-- Result -->
		{#if comparison}
			<div class="space-y-4">
				<!-- Summary Badge -->
				<div class="flex items-center gap-3 flex-wrap">
					{#if comparison.identical}
						<div class="badge badge-success gap-2 p-4 text-lg">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
							Identical URLs
						</div>
					{:else if comparison.sameOrigin && comparison.samePath && comparison.sameParams}
						<div class="badge badge-warning gap-2 p-4 text-lg">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
							Same Resource, Different Format
						</div>
					{:else}
						<div class="badge badge-error gap-2 p-4 text-lg">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
							Different URLs
						</div>
					{/if}
				</div>

				<!-- Comparison Grid -->
				<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
					<div class="bg-base-200 p-3 rounded-lg text-center">
						<div class="text-xs text-base-content/50 mb-1">Origin</div>
						<span class="badge {comparison.sameOrigin ? 'badge-success' : 'badge-error'}">
							{comparison.sameOrigin ? 'Same' : 'Different'}
						</span>
					</div>
					<div class="bg-base-200 p-3 rounded-lg text-center">
						<div class="text-xs text-base-content/50 mb-1">Path</div>
						<span class="badge {comparison.samePath ? 'badge-success' : 'badge-error'}">
							{comparison.samePath ? 'Same' : 'Different'}
						</span>
					</div>
					<div class="bg-base-200 p-3 rounded-lg text-center">
						<div class="text-xs text-base-content/50 mb-1">Params</div>
						<span class="badge {comparison.sameParams ? 'badge-success' : 'badge-error'}">
							{comparison.sameParams ? 'Same' : 'Different'}
						</span>
					</div>
					<div class="bg-base-200 p-3 rounded-lg text-center">
						<div class="text-xs text-base-content/50 mb-1">Param Order</div>
						<span class="badge {comparison.paramOrderDiff ? 'badge-warning' : 'badge-success'}">
							{comparison.paramOrderDiff ? 'Different' : 'Same'}
						</span>
					</div>
				</div>

				<!-- Differences -->
				{#if comparison.differences.length > 0}
					<div class="card bg-base-200 rounded-xl">
						<div class="card-body py-4">
							<h4 class="text-sm font-semibold mb-2">Differences</h4>
							<ul class="space-y-1">
								{#each comparison.differences as diff}
									<li class="flex items-start gap-2 text-sm">
										<span class="text-error">•</span>
										<span>{diff}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Use Cases</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Debugging</strong>: Check if two API calls hit the same endpoint</li>
					<li>• <strong>SEO</strong>: Detect duplicate URL patterns</li>
					<li>• <strong>Caching</strong>: Verify cache key consistency</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
