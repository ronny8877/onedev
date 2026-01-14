<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { validateURL, parseURLParts } from '$lib/utils/url';

	interface RequestResult {
		success: boolean;
		status?: number;
		statusText?: string;
		redirected: boolean;
		finalURL: string;
		headers?: Record<string, string>;
		time?: number;
		error?: string;
		errorType?: 'cors' | 'network' | 'dns' | 'timeout' | 'unknown';
	}

	let input = $state('');
	let isLoading = $state(false);
	let result = $state<RequestResult | null>(null);

	async function handleCheck() {
		if (!input.trim()) return;

		const validation = validateURL(input);
		if (!validation.valid) {
			result = { 
				success: false, 
				redirected: false, 
				finalURL: '', 
				error: validation.details,
				errorType: 'unknown'
			};
			return;
		}

		isLoading = true;
		result = null;
		const startTime = performance.now();

		try {
			const response = await fetch(input, {
				method: 'HEAD',
				redirect: 'follow',
				mode: 'cors'
			});

			const endTime = performance.now();
			const headers: Record<string, string> = {};
			response.headers.forEach((value, key) => {
				headers[key] = value;
			});

			result = {
				success: true,
				status: response.status,
				statusText: response.statusText,
				redirected: response.redirected,
				finalURL: response.url,
				headers,
				time: Math.round(endTime - startTime)
			};
		} catch (err) {
			const endTime = performance.now();
			const errorMessage = (err as Error).message || 'Unknown error';
			
			// Categorize the error
			let errorType: 'cors' | 'network' | 'dns' | 'timeout' | 'unknown' = 'unknown';
			if (errorMessage.includes('CORS') || errorMessage.includes('cross-origin')) {
				errorType = 'cors';
			} else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
				errorType = 'network';
			} else if (errorMessage.includes('DNS') || errorMessage.includes('resolve')) {
				errorType = 'dns';
			} else if (errorMessage.includes('timeout')) {
				errorType = 'timeout';
			}

			result = {
				success: false,
				redirected: false,
				finalURL: input,
				error: errorMessage,
				errorType,
				time: Math.round(endTime - startTime)
			};
		} finally {
			isLoading = false;
		}
	}

	function clearAll() {
		input = '';
		result = null;
	}

	function getStatusColor(status: number): string {
		if (status >= 200 && status < 300) return 'badge-success';
		if (status >= 300 && status < 400) return 'badge-warning';
		if (status >= 400 && status < 500) return 'badge-error';
		if (status >= 500) return 'badge-error';
		return 'badge-ghost';
	}

	function getStatusDescription(status: number): string {
		const descriptions: Record<number, string> = {
			200: 'OK',
			201: 'Created',
			204: 'No Content',
			301: 'Moved Permanently',
			302: 'Found (Temporary Redirect)',
			303: 'See Other',
			304: 'Not Modified',
			307: 'Temporary Redirect',
			308: 'Permanent Redirect',
			400: 'Bad Request',
			401: 'Unauthorized',
			403: 'Forbidden',
			404: 'Not Found',
			405: 'Method Not Allowed',
			500: 'Internal Server Error',
			502: 'Bad Gateway',
			503: 'Service Unavailable'
		};
		return descriptions[status] || 'Unknown Status';
	}

	function getErrorHelp(errorType: string): string {
		const help: Record<string, string> = {
			cors: 'This site blocks cross-origin requests from browsers. Try using cURL or a backend proxy.',
			network: 'Could not establish a connection. Check if the URL is correct and the server is running.',
			dns: 'Could not resolve the domain. Check if the hostname is correct.',
			timeout: 'The request timed out. The server might be slow or unreachable.',
			unknown: 'An unexpected error occurred.'
		};
		return help[errorType] || help.unknown;
	}

	let urlParts = $derived(input ? parseURLParts(input) : null);
</script>

<ToolWrapper
	title="Redirect Checker"
	description="Check redirect chains, HTTP status, and response headers. Shows detailed info even on failures."
>
	<div class="flex flex-col gap-6">
		<!-- Input -->
		<div>
			<div class="mb-2">
				<h3 class="text-sm font-medium text-base-content/70">URL to Check</h3>
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					bind:value={input}
					placeholder="https://example.com/redirect"
					class="input input-bordered flex-1 font-mono text-sm rounded-xl"
					spellcheck="false"
					onkeydown={(e) => e.key === 'Enter' && handleCheck()}
				/>
				<button
					type="button"
					class="btn btn-info"
					onclick={handleCheck}
					disabled={isLoading || !input.trim()}
				>
					{#if isLoading}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						Check
					{/if}
				</button>
				<button type="button" class="btn btn-ghost" onclick={clearAll}>
					Clear
				</button>
			</div>
		</div>

		<!-- Loading -->
		{#if isLoading}
			<div class="flex flex-col items-center justify-center py-8 gap-2">
				<span class="loading loading-dots loading-lg"></span>
				<span class="text-sm text-base-content/60">Checking {urlParts?.hostname || input}...</span>
			</div>
		{/if}

		<!-- Request Details (always show if we have a result) -->
		{#if result}
			<div class="space-y-4">
				<!-- Status Summary -->
				<div class="flex items-center gap-3 flex-wrap">
					{#if result.success && result.status}
						<div class="badge {getStatusColor(result.status)} gap-2 p-3 text-base">
							{result.status} {result.statusText || getStatusDescription(result.status)}
						</div>
					{:else}
						<div class="badge badge-error gap-2 p-3 text-base">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
							Request Failed
						</div>
					{/if}
					
					{#if result.redirected}
						<span class="badge badge-warning badge-outline">Redirected</span>
					{/if}
					
					{#if result.time !== undefined}
						<span class="badge badge-ghost">{result.time}ms</span>
					{/if}
				</div>

				<!-- Error Details -->
				{#if result.error}
					<div class="alert alert-error rounded-xl">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
						<div>
							<h3 class="font-bold capitalize">{result.errorType} Error</h3>
							<p class="text-sm">{result.error}</p>
							<p class="text-xs mt-1 opacity-80">{getErrorHelp(result.errorType || 'unknown')}</p>
						</div>
					</div>
				{/if}

				<!-- Request Info Card -->
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body py-4 gap-4">
						<h4 class="text-sm font-semibold">Request Details</h4>
						
						<div class="grid gap-3 sm:grid-cols-2">
							<div>
								<div class="text-xs text-base-content/50 mb-1">Requested URL</div>
								<div class="font-mono text-sm break-all">{input}</div>
							</div>
							
							{#if result.finalURL && result.finalURL !== input}
								<div>
									<div class="text-xs text-base-content/50 mb-1">Final URL</div>
									<div class="font-mono text-sm break-all">{result.finalURL}</div>
								</div>
							{/if}
							
							{#if urlParts}
								<div>
									<div class="text-xs text-base-content/50 mb-1">Host</div>
									<div class="font-mono text-sm">{urlParts.host}</div>
								</div>
								<div>
									<div class="text-xs text-base-content/50 mb-1">Protocol</div>
									<div class="font-mono text-sm">{urlParts.protocol}</div>
								</div>
							{/if}
						</div>
					</div>
				</div>

				<!-- Response Headers (if available) -->
				{#if result.headers && Object.keys(result.headers).length > 0}
					<div class="card bg-base-200 rounded-xl">
						<div class="card-body py-4">
							<h4 class="text-sm font-semibold mb-3">Response Headers</h4>
							<div class="space-y-2 max-h-60 overflow-y-auto">
								{#each Object.entries(result.headers) as [key, value]}
									<div class="flex items-start gap-2 text-sm">
										<span class="font-mono font-medium text-primary shrink-0">{key}:</span>
										<span class="font-mono text-base-content/80 break-all">{value}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Copy Options -->
				{#if result.finalURL}
					<div class="flex items-center gap-2">
						<span class="text-sm text-base-content/60">Copy as:</span>
						<CopyButton url={result.finalURL} size="sm" />
					</div>
				{/if}
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Common Status Codes</h4>
				<div class="mt-2 grid gap-2 sm:grid-cols-2 text-sm text-base-content/70">
					<div><span class="badge badge-success badge-xs mr-2"></span><strong>200</strong> OK</div>
					<div><span class="badge badge-warning badge-xs mr-2"></span><strong>301</strong> Permanent Redirect</div>
					<div><span class="badge badge-warning badge-xs mr-2"></span><strong>302</strong> Temporary Redirect</div>
					<div><span class="badge badge-error badge-xs mr-2"></span><strong>404</strong> Not Found</div>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
