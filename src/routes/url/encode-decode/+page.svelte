<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { encodeURL, decodeURL, isLikelyEncoded } from '$lib/utils/url';

	let input = $state('');
	let output = $state('');
	let mode = $state<'auto' | 'encode' | 'decode'>('auto');
	let encodeMode = $state<'component' | 'full' | 'query'>('component');
	let detectedMode = $state<'encode' | 'decode'>('encode');
	let error = $state<string | null>(null);
	let convertTimeout: ReturnType<typeof setTimeout> | null = null;

	const sampleText = 'Hello World! /?#@';

	// Auto-convert with debounce
	$effect(() => {
		const _input = input;
		const _mode = mode;
		const _encodeMode = encodeMode;

		if (convertTimeout) {
			clearTimeout(convertTimeout);
		}

		if (!_input.trim()) {
			output = '';
			error = null;
			detectedMode = 'encode';
			return;
		}

		convertTimeout = setTimeout(() => {
			handleConvert();
		}, 150);

		return () => {
			if (convertTimeout) {
				clearTimeout(convertTimeout);
			}
		};
	});

	function handleConvert() {
		error = null;
		output = '';

		if (!input.trim()) {
			return;
		}

		const trimmed = input.trim();
		
		// Determine mode
		let actualMode: 'encode' | 'decode';
		if (mode === 'auto') {
			actualMode = isLikelyEncoded(trimmed) ? 'decode' : 'encode';
			detectedMode = actualMode;
		} else {
			actualMode = mode;
			detectedMode = mode;
		}

		try {
			if (actualMode === 'encode') {
				output = encodeURL(trimmed, encodeMode);
			} else {
				output = decodeURL(trimmed);
			}
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function loadSample() {
		input = sampleText;
		mode = 'auto'; // Will likely detect encode
	}

	function clearAll() {
		input = '';
		output = '';
		error = null;
	}

	function swapInputOutput() {
		if (output) {
			input = output;
			output = '';
		}
	}

	let stats = $derived({
		chars: input.length
	});
</script>

<ToolWrapper
	title="URL Encode / Decode"
	description="Encode special characters for URLs or decode encoded strings. Auto-detects input type."
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={output} {stats} />

		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<div class="join">
				<button
					type="button"
					class="btn join-item"
					class:btn-info={mode === 'auto'}
					onclick={() => (mode = 'auto')}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
					Auto
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-info={mode === 'encode'}
					onclick={() => (mode = 'encode')}
				>
					Encode
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-info={mode === 'decode'}
					onclick={() => (mode = 'decode')}
				>
					Decode
				</button>
			</div>

			{#if mode === 'auto' && input.trim()}
				<span class="badge badge-outline">
					Detected: {detectedMode === 'encode' ? 'Text → Encoded' : 'Encoded → Text'}
				</span>
			{/if}

			{#if detectedMode === 'encode'}
				<select class="select select-bordered select-sm" bind:value={encodeMode}>
					<option value="component">Component (strict)</option>
					<option value="full">Full URL (preserve /:?#)</option>
					<option value="query">Query (space as +)</option>
				</select>
			{/if}

			{#if output}
				<button type="button" class="btn btn-ghost btn-sm ml-auto" onclick={swapInputOutput}>
					Swap Inputs
				</button>
			{/if}
		</div>

		<!-- Error Display -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Input/Output -->
		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">
					{detectedMode === 'encode' ? 'Plain Text' : 'URL Encoded String'}
				</h3>
				<textarea
					bind:value={input}
					placeholder={detectedMode === 'encode' ? 'Enter text to encode...' : 'Paste URL encoded string to decode...'}
					class="textarea textarea-bordered w-full min-h-[300px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>

			<!-- Output -->
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">
					{detectedMode === 'encode' ? 'URL Encoded' : 'Decoded Text'}
				</h3>
				<textarea
					value={output}
					readonly
					placeholder="Result will appear here..."
					class="textarea textarea-bordered w-full min-h-[300px] font-mono text-sm rounded-xl resize-none bg-base-200"
					spellcheck="false"
				></textarea>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Encoding Modes</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Component</strong>: Encodes all special chars (for URL parameters)</li>
					<li>• <strong>Full URL</strong>: Preserves URL structure characters (://?#)</li>
					<li>• <strong>Query</strong>: Like component, but uses + for spaces</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
