<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let mode = $state<'query-to-json' | 'json-to-query'>('query-to-json');
	let input = $state('');
	let output = $state('');
	let error = $state<string | null>(null);

	$effect(() => {
		if (!input.trim()) {
			output = '';
			error = null;
			return;
		}

		try {
			if (mode === 'query-to-json') {
				output = queryToJSON(input);
			} else {
				output = jsonToQuery(input);
			}
			error = null;
		} catch (err) {
			error = (err as Error).message;
			output = '';
		}
	});

	function queryToJSON(queryString: string): string {
		// Remove leading ? or full URL
		let qs = queryString;
		if (qs.includes('?')) {
			qs = qs.split('?')[1]?.split('#')[0] || '';
		}
		
		if (!qs) throw new Error('No query string found');
		
		const params = new URLSearchParams(qs);
		const obj: Record<string, string | string[]> = {};
		
		params.forEach((value, key) => {
			if (obj[key] !== undefined) {
				if (Array.isArray(obj[key])) {
					(obj[key] as string[]).push(value);
				} else {
					obj[key] = [obj[key] as string, value];
				}
			} else {
				obj[key] = value;
			}
		});
		
		return JSON.stringify(obj, null, 2);
	}

	function jsonToQuery(jsonString: string): string {
		const obj = JSON.parse(jsonString);
		
		if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
			throw new Error('Input must be a JSON object');
		}
		
		const params = new URLSearchParams();
		
		for (const [key, value] of Object.entries(obj)) {
			if (Array.isArray(value)) {
				for (const v of value) {
					params.append(key, String(v));
				}
			} else if (value !== null && value !== undefined) {
				params.append(key, String(value));
			}
		}
		
		return '?' + params.toString();
	}

	function clearAll() {
		input = '';
		output = '';
		error = null;
	}

	function swapMode() {
		if (output && !error) {
			input = output;
		}
		mode = mode === 'query-to-json' ? 'json-to-query' : 'query-to-json';
	}

	function loadExample() {
		if (mode === 'query-to-json') {
			input = '?name=John%20Doe&age=30&tags=a&tags=b&tags=c&active=true';
		} else {
			input = `{
  "name": "John Doe",
  "age": "30",
  "tags": ["a", "b", "c"],
  "active": "true"
}`;
		}
	}

	let outputURL = $derived(mode === 'json-to-query' && output ? `https://example.com/api${output}` : '');
	let stats = $derived({
		chars: input.length
	});
</script>

<ToolWrapper
	title="URL ↔ JSON Converter"
	description="Convert between URL query strings and JSON objects. Perfect for API debugging."
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={clearAll} copyText={output} {stats} />

		<!-- Mode Selector -->
		<div class="flex flex-wrap items-center gap-3">
			<div class="join">
				<button
					type="button"
					class="btn join-item"
					class:btn-info={mode === 'query-to-json'}
					onclick={() => mode = 'query-to-json'}
				>
					Query → JSON
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-info={mode === 'json-to-query'}
					onclick={() => mode = 'json-to-query'}
				>
					JSON → Query
				</button>
			</div>

			<button type="button" class="btn btn-ghost btn-sm ml-auto" onclick={swapMode}>
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
				Swap Inputs
			</button>
		</div>

		<!-- Input/Output Grid -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div>
				<div class="mb-2">
					<h3 class="text-sm font-medium text-base-content/70">
						{mode === 'query-to-json' ? 'Query String' : 'JSON Object'}
					</h3>
				</div>
				<textarea
					bind:value={input}
					placeholder={mode === 'query-to-json' ? '?a=1&b=2&c=3' : '{ "a": "1", "b": "2" }'}
					class="textarea textarea-bordered w-full min-h-[200px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>

			<!-- Output -->
			<div>
				<div class="mb-2">
					<h3 class="text-sm font-medium text-base-content/70">
						{mode === 'query-to-json' ? 'JSON Object' : 'Query String'}
					</h3>
				</div>
				<textarea
					value={output}
					readonly
					placeholder="Result will appear here..."
					class="textarea textarea-bordered w-full min-h-[200px] font-mono text-sm rounded-xl resize-none bg-base-200"
					spellcheck="false"
				></textarea>
			</div>
		</div>

		<!-- Error -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Copy Options (Extra) -->
		{#if output && !error && mode === 'json-to-query'}
			<div class="flex items-center gap-4">
				<CopyButton url={outputURL} size="sm" label="Copy as Full URL" />
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Features</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Array support</strong>: Repeated params become arrays in JSON</li>
					<li>• <strong>Auto-decode</strong>: URL-encoded values are decoded</li>
					<li>• <strong>Bidirectional</strong>: Convert either direction</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
