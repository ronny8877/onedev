<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ErrorDisplay from '$lib/components/ui/ErrorDisplay.svelte';
	import { formatJSON, minifyJSON, validateJSON, type ParseError } from '$lib/utils/json';

	let input = $state('');
	let output = $state('');
	let error = $state<ParseError | null>(null);
	let indentSize = $state(2);
	let formatTimeout: ReturnType<typeof setTimeout> | null = null;

	// Auto-format on paste/input with debounce
	$effect(() => {
		if (formatTimeout) {
			clearTimeout(formatTimeout);
		}

		if (!input.trim()) {
			output = '';
			error = null;
			return;
		}

		// Validate immediately
		const result = validateJSON(input);
		error = result.error || null;

		// Auto-prettify after delay if valid
		if (result.valid) {
			formatTimeout = setTimeout(() => {
				handlePrettify();
			}, 300);
		}

		return () => {
			if (formatTimeout) {
				clearTimeout(formatTimeout);
			}
		};
	});

	function handlePrettify() {
		error = null;
		output = '';

		if (!input.trim()) {
			error = { message: 'Please enter some JSON to format' };
			return;
		}

		try {
			output = formatJSON(input, indentSize);
		} catch (err) {
			const result = validateJSON(input);
			error = result.error || { message: (err as Error).message };
		}
	}

	function handleMinify() {
		error = null;
		output = '';

		if (!input.trim()) {
			error = { message: 'Please enter some JSON to minify' };
			return;
		}

		try {
			output = minifyJSON(input);
		} catch (err) {
			const result = validateJSON(input);
			error = result.error || { message: (err as Error).message };
		}
	}

	function handleSwap() {
		if (output) {
			input = output;
			output = '';
		}
	}
</script>

<ToolWrapper
	title="JSON Formatter"
	description="Prettify or minify your JSON with syntax highlighting and error detection"
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button type="button" class="btn btn-primary" onclick={handlePrettify}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 10h16M4 14h16M4 18h16"
					></path>
				</svg>
				Prettify
			</button>

			<button type="button" class="btn btn-secondary" onclick={handleMinify}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M20 12H4"
					></path>
				</svg>
				Minify
			</button>

			<div class="flex items-center gap-2">
				<label for="indent" class="text-sm text-base-content/70">Indent:</label>
				<select id="indent" class="select select-bordered select-sm w-20" bind:value={indentSize}>
					<option value={2}>2</option>
					<option value={4}>4</option>
					<option value={8}>8</option>
				</select>
			</div>

			{#if output}
				<button type="button" class="btn btn-ghost btn-sm" onclick={handleSwap}>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
						></path>
					</svg>
					Use Output as Input
				</button>
			{/if}
		</div>

		<!-- Error Display -->
		<ErrorDisplay {error} />

		<!-- Editors Grid -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Input</h3>
				<CodeMirrorEditor bind:value={input} placeholder="Paste your JSON here..." />
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Output</h3>
				<CodeMirrorEditor value={output} readonly placeholder="Formatted JSON will appear here..." />
			</div>
		</div>
	</div>
</ToolWrapper>
