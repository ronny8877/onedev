<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { encodeBase64, decodeBase64, isLikelyBase64, validateBase64 } from '$lib/utils/base64';

	let input = $state('');
	let output = $state('');
	let mode = $state<'auto' | 'encode' | 'decode'>('auto');
	let detectedMode = $state<'encode' | 'decode'>('encode');
	let error = $state<string | null>(null);
	let convertTimeout: ReturnType<typeof setTimeout> | null = null;

	const sampleText = 'Hello World! 👋';

	// Auto-convert with debounce
	$effect(() => {
		const _input = input;
		const _mode = mode;

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
		}, 200);

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
			// Auto-detect: if it looks like Base64, decode it, otherwise encode
			actualMode = isLikelyBase64(trimmed) ? 'decode' : 'encode';
			detectedMode = actualMode;
		} else {
			actualMode = mode;
			detectedMode = mode;
		}

		try {
			if (actualMode === 'encode') {
				output = encodeBase64(trimmed);
			} else {
				// Validate before decoding
				const validation = validateBase64(trimmed);
				if (!validation.valid) {
					error = `${validation.error}: ${validation.details}`;
					return;
				}
				output = decodeBase64(trimmed);
			}
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function loadSample() {
		input = sampleText;
		mode = 'auto';
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
			// If we just decoded, now we probably want to encode the result (which was the input)
			// But if auto mode is on, it handles it.
		}
	}

	let stats = $derived({
		chars: input.length
	});
</script>

<ToolWrapper
	title="Base64 Encode / Decode"
	description="Auto-detects input type. UTF-8 safe with proper unicode support."
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
					class:btn-primary={mode === 'auto'}
					onclick={() => (mode = 'auto')}
				>
					Auto
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={mode === 'encode'}
					onclick={() => (mode = 'encode')}
				>
					Encode
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={mode === 'decode'}
					onclick={() => (mode = 'decode')}
				>
					Decode
				</button>
			</div>

			{#if mode === 'auto' && input.trim()}
				<span class="badge badge-outline">
					Detected: {detectedMode === 'encode' ? 'Text → Base64' : 'Base64 → Text'}
				</span>
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
					{detectedMode === 'encode' ? 'Plain Text' : 'Base64 String'}
				</h3>
				<textarea
					bind:value={input}
					placeholder={detectedMode === 'encode' ? 'Enter text to encode...' : 'Paste Base64 string to decode...'}
					class="textarea textarea-bordered w-full min-h-[300px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>

			<!-- Output -->
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">
					{detectedMode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
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
				<h4 class="text-sm font-semibold">Features</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Auto-detect</strong>: Automatically determines if input should be encoded or decoded</li>
					<li>• <strong>UTF-8 Safe</strong>: Properly handles unicode characters including emoji 🎉</li>
					<li>• <strong>Validation</strong>: Shows detailed errors for invalid Base64 strings</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
