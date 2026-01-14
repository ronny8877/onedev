<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import QueryParamsDisplay from '$lib/components/ui/QueryParamsDisplay.svelte';
	import { validateURL, parseURLParts, parseQueryString, URL_SCHEMES, type URLParts, type QueryParam } from '$lib/utils/url';

	let input = $state('');
	
	// Use $derived instead of $effect to avoid infinite loops
	let validationResult = $derived(input.trim() ? validateURL(input) : null);
	let isValid = $derived(validationResult?.valid ?? null);
	let error = $derived(
		validationResult && !validationResult.valid 
			? { error: validationResult.error!, details: validationResult.details! } 
			: null
	);
	let parts = $derived(validationResult?.valid ? parseURLParts(input) : null);
	let queryParams = $derived(
		parts?.search ? parseQueryString(parts.search) : []
	);

	function clearAll() {
		input = '';
	}

	function loadExample() {
		input = 'https://api.example.com:8080/v1/users?page=1&limit=10&tags=a,b,c#section';
	}
</script>

<ToolWrapper
	title="URL Validator"
	description="Check if a URL is valid with protocol verification and detailed structure breakdown."
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
				<h3 class="text-sm font-medium text-base-content/70">URL to Validate</h3>
			</div>
			<input
				type="text"
				bind:value={input}
				placeholder="https://example.com/path?query=value"
				class="input input-bordered w-full font-mono text-sm rounded-xl"
				spellcheck="false"
			/>
		</div>

		<!-- Status Badge -->
		{#if isValid !== null}
			<div class="flex items-center gap-3">
				{#if isValid}
					<div class="badge badge-success gap-2 p-4 text-lg">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
						Valid URL
					</div>
				{:else}
					<div class="badge badge-error gap-2 p-4 text-lg">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
						Invalid URL
					</div>
				{/if}
			</div>
		{/if}

		<!-- Error Details -->
		{#if error}
			<div class="alert alert-error shadow-lg rounded-xl">
				<svg class="h-6 w-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<div>
					<h3 class="font-bold">{error.error}</h3>
					<p class="text-sm">{error.details}</p>
				</div>
			</div>
		{/if}

		<!-- URL Breakdown -->
		{#if parts}
			<div>
				<h3 class="mb-3 text-sm font-medium text-base-content/70">URL Breakdown</h3>
				<div class="grid gap-3 sm:grid-cols-2">
					<div class="bg-base-200 p-3 rounded-xl">
						<div class="text-xs text-base-content/50 mb-1">Protocol</div>
						<div class="font-mono text-sm font-medium">{parts.protocol}</div>
					</div>
					<div class="bg-base-200 p-3 rounded-xl">
						<div class="text-xs text-base-content/50 mb-1">Host</div>
						<div class="font-mono text-sm font-medium">{parts.host}</div>
					</div>
					{#if parts.port}
						<div class="bg-base-200 p-3 rounded-xl">
							<div class="text-xs text-base-content/50 mb-1">Port</div>
							<div class="font-mono text-sm font-medium">{parts.port}</div>
						</div>
					{/if}
					<div class="bg-base-200 p-3 rounded-xl">
						<div class="text-xs text-base-content/50 mb-1">Path</div>
						<div class="font-mono text-sm font-medium">{parts.pathname || '/'}</div>
					</div>
					{#if parts.hash}
						<div class="bg-base-200 p-3 rounded-xl">
							<div class="text-xs text-base-content/50 mb-1">Hash</div>
							<div class="font-mono text-sm font-medium">{parts.hash}</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Query Parameters -->
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

			<!-- Copy Options -->
			<div class="flex items-center gap-2">
				<span class="text-sm text-base-content/60">Copy as:</span>
				<CopyButton url={input} size="sm" />
			</div>
		{/if}

		<!-- Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Supported Protocols</h4>
				<div class="mt-2 flex flex-wrap gap-2">
					{#each URL_SCHEMES.slice(0, 6) as scheme}
						<span class="badge badge-outline badge-sm">{scheme.scheme}://</span>
					{/each}
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
