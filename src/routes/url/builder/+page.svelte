<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { buildURL, parseURLParts, parseQueryString } from '$lib/utils/url';

	let baseURL = $state('https://example.com/api');
	let params = $state<{ key: string; value: string; id: number }[]>([
		{ key: '', value: '', id: Date.now() }
	]);
	let finalURL = $state('');

	let nextId = $state(Date.now() + 1);

	// Parse pasted URL and extract params
	function handleBaseURLChange(newValue: string) {
		baseURL = newValue;
		
		// Try to parse and extract existing query params
		const parts = parseURLParts(newValue);
		if (parts && parts.search) {
			const existingParams = parseQueryString(parts.search);
			if (existingParams.length > 0) {
				// Extract base URL without query string
				const urlObj = new URL(newValue);
				urlObj.search = '';
				baseURL = urlObj.toString();
				
				// Add parsed params
				params = existingParams.map(p => ({
					key: p.key,
					value: p.value,
					id: nextId++
				}));
				// Add empty row for new params
				params = [...params, { key: '', value: '', id: nextId++ }];
			}
		}
	}

	$effect(() => {
		const _base = baseURL;
		const _params = params;

		const validParams = _params.filter(p => p.key.trim());
		finalURL = buildURL(_base, validParams);
	});

	function addParam() {
		params = [...params, { key: '', value: '', id: nextId++ }];
	}

	function removeParam(id: number) {
		params = params.filter(p => p.id !== id);
		if (params.length === 0) {
			addParam();
		}
	}

	function updateParam(id: number, field: 'key' | 'value', value: string) {
		params = params.map(p => p.id === id ? { ...p, [field]: value } : p);
	}

	function clearAll() {
		baseURL = '';
		params = [{ key: '', value: '', id: nextId++ }];
	}

	function loadExample() {
		baseURL = 'https://api.example.com/v1/search';
		params = [
			{ key: 'query', value: 'hello world', id: nextId++ },
			{ key: 'page', value: '1', id: nextId++ },
			{ key: 'limit', value: '20', id: nextId++ },
			{ key: 'sort', value: 'created_at', id: nextId++ },
			{ key: '', value: '', id: nextId++ }
		];
	}

	function loadFromURL() {
		const input = prompt('Paste a URL with query parameters:');
		if (input) {
			handleBaseURLChange(input);
		}
	}
</script>

<ToolWrapper
	title="URL Builder"
	description="Build URLs with query parameters. Paste existing URLs to parse them, or build from scratch."
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button type="button" class="btn btn-ghost btn-sm" onclick={loadExample}>
				Load Example
			</button>
			<button type="button" class="btn btn-ghost btn-sm" onclick={loadFromURL}>
				Parse URL
			</button>
			<button type="button" class="btn btn-ghost btn-sm" onclick={clearAll}>
				Clear All
			</button>
		</div>

		<!-- Base URL -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Base URL</h3>
				<p class="text-xs text-base-content/50">Paste a URL with query params to auto-parse them</p>
			</div>
			<input
				type="text"
				value={baseURL}
				oninput={(e) => handleBaseURLChange(e.currentTarget.value)}
				placeholder="https://example.com/api"
				class="input input-bordered w-full font-mono text-sm rounded-xl"
				spellcheck="false"
			/>
		</div>

		<!-- Parameters -->
		<div>
			<div class="mb-3 flex items-center justify-between">
				<h3 class="text-sm font-medium text-base-content/70">
					Query Parameters
					<span class="badge badge-ghost badge-sm ml-2">{params.filter(p => p.key).length}</span>
				</h3>
				<button type="button" class="btn btn-sm btn-info" onclick={addParam}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
					Add Parameter
				</button>
			</div>

			<div class="space-y-2">
				{#each params as param (param.id)}
					<div class="flex items-center gap-2">
						<input
							type="text"
							value={param.key}
							oninput={(e) => updateParam(param.id, 'key', e.currentTarget.value)}
							placeholder="Key"
							class="input input-bordered input-sm flex-1 font-mono rounded-lg"
							spellcheck="false"
						/>
						<span class="text-base-content/40">=</span>
						<input
							type="text"
							value={param.value}
							oninput={(e) => updateParam(param.id, 'value', e.currentTarget.value)}
							placeholder="Value"
							class="input input-bordered input-sm flex-2 font-mono rounded-lg"
							spellcheck="false"
						/>
						<button
							type="button"
							class="btn btn-ghost btn-sm btn-square"
							onclick={() => removeParam(param.id)}
							aria-label="Remove parameter"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
						</button>
					</div>
				{/each}
			</div>
		</div>

		<!-- Final URL -->
		<div>
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-sm font-medium text-base-content/70">Final URL</h3>
			</div>
			<div class="bg-base-200 p-4 rounded-xl font-mono text-sm break-all min-h-[60px]">
				{#if finalURL}
					{finalURL}
				{:else}
					<span class="text-base-content/40">Enter a base URL to preview...</span>
				{/if}
			</div>
		</div>

		<!-- Copy Options -->
		{#if finalURL}
			<div class="flex items-center gap-2">
				<span class="text-sm text-base-content/60">Copy as:</span>
				<CopyButton url={finalURL} size="sm" />
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Features</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Auto-parse</strong>: Paste a URL with params to extract them</li>
					<li>• <strong>Auto-encode</strong>: Values are URL-encoded automatically</li>
					<li>• <strong>Quick copy</strong>: Copy as URL, cURL, fetch, axios, and more</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
