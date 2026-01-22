<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { toURLSafe, fromURLSafe, validateBase64 } from '$lib/utils/base64';

	let input = $state('');
	let output = $state('');
	let mode = $state<'to-urlsafe' | 'from-urlsafe'>('to-urlsafe');
	let removePadding = $state(false);
	let error = $state<string | null>(null);
	let convertTimeout: ReturnType<typeof setTimeout> | null = null;

	const sampleInput = 'Subject? = Yes';

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
		
		// If converting FROM urlsafe to standard, we don't strict validate base64 initially because input might be urlsafe
		// But if TO urlsafe, input should be standard base64? Usually this tool converts raw text -> base64url or base64 -> base64url.
		// Actually, standard Base64 tools usually mean "Base64 string" <-> "URL-safe Base64 string".
		// The description says "Convert between standard Base64 and URL-safe Base64".
		
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

	function loadSample() {
		// Use a pre-encoded sample that has visually different chars in standard vs urlsafe
		// Standard: "Pz4=" (contains + or / usually? No. ? is not in base64. 
		// Actually, let's use a raw string that results in + and /
		// Base64 for "???" is "Pz8/"
		input = 'Pz8/'; 
		mode = 'to-urlsafe';
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
			mode = mode === 'to-urlsafe' ? 'from-urlsafe' : 'to-urlsafe';
		}
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={output} />

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
				<button type="button" class="btn btn-ghost btn-sm ml-auto" onclick={swapInputOutput}>
					Swap Inputs
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
				<h3 class="mb-2 text-sm font-medium text-base-content/70">
					{mode === 'to-urlsafe' ? 'URL-safe Base64' : 'Standard Base64'}
				</h3>
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
