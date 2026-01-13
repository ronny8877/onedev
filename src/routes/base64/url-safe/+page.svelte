<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import { toURLSafe, fromURLSafe, validateBase64 } from '$lib/utils/base64';

	let input = $state('');
	let output = $state('');
	let mode = $state<'to-urlsafe' | 'from-urlsafe'>('to-urlsafe');
	let removePadding = $state(false);
	let error = $state<string | null>(null);
	let convertTimeout: ReturnType<typeof setTimeout> | null = null;

	// Auto-convert with debounce
	$effect(() => {
		const _input = input;
		const _mode = mode;
		const _removePadding = removePadding;

		if (convertTimeout) {
			clearTimeout(convertTimeout);
		}

		if (!_input.trim()) {
			output = '';
			error = null;
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

		const trimmed = input.trim();
		
		// Validate as Base64
		const validation = validateBase64(trimmed);
		if (!validation.valid) {
			error = `${validation.error}: ${validation.details}`;
			return;
		}

		try {
			if (mode === 'to-urlsafe') {
				output = toURLSafe(trimmed, removePadding);
			} else {
				output = fromURLSafe(trimmed);
			}
		} catch (err) {
			error = (err as Error).message;
		}
	}

	async function copyOutput() {
		if (output) {
			await navigator.clipboard.writeText(output);
		}
	}

	function swapInputOutput() {
		if (output) {
			input = output;
			output = '';
			mode = mode === 'to-urlsafe' ? 'from-urlsafe' : 'to-urlsafe';
		}
	}
</script>

<ToolWrapper
	title="Base64 URL-safe Converter"
	description="Convert between standard Base64 and URL-safe Base64"
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<div class="join">
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={mode === 'to-urlsafe'}
					onclick={() => (mode = 'to-urlsafe')}
				>
					→ URL-safe
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={mode === 'from-urlsafe'}
					onclick={() => (mode = 'from-urlsafe')}
				>
					→ Standard
				</button>
			</div>

			{#if mode === 'to-urlsafe'}
				<label class="label cursor-pointer gap-2">
					<input type="checkbox" class="checkbox checkbox-sm" bind:checked={removePadding} />
					<span class="label-text">Remove padding (=)</span>
				</label>
			{/if}

			{#if output}
				<button type="button" class="btn btn-ghost btn-sm" onclick={swapInputOutput}>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg>
					Swap
				</button>
			{/if}
		</div>

		<!-- Error -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Input/Output -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">
					{mode === 'to-urlsafe' ? 'Standard Base64' : 'URL-safe Base64'}
				</h3>
				<textarea
					bind:value={input}
					placeholder="Paste Base64 string..."
					class="textarea textarea-bordered w-full min-h-[200px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>

			<div>
				<div class="mb-2 flex items-center justify-between">
					<h3 class="text-sm font-medium text-base-content/70">
						{mode === 'to-urlsafe' ? 'URL-safe Base64' : 'Standard Base64'}
					</h3>
					{#if output}
						<button type="button" class="btn btn-ghost btn-xs" onclick={copyOutput}>
							Copy
						</button>
					{/if}
				</div>
				<textarea
					value={output}
					readonly
					placeholder="Converted result..."
					class="textarea textarea-bordered w-full min-h-[200px] font-mono text-sm rounded-xl resize-none bg-base-200"
				></textarea>
			</div>
		</div>

		<!-- Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Character Replacements</h4>
				<div class="mt-2 overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Standard</th>
								<th>URL-safe</th>
								<th>Reason</th>
							</tr>
						</thead>
						<tbody class="text-sm font-mono">
							<tr>
								<td>+</td>
								<td>-</td>
								<td class="font-sans text-base-content/70">+ means space in URLs</td>
							</tr>
							<tr>
								<td>/</td>
								<td>_</td>
								<td class="font-sans text-base-content/70">/ is path separator</td>
							</tr>
							<tr>
								<td>=</td>
								<td>(removed)</td>
								<td class="font-sans text-base-content/70">= is reserved in query strings</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
