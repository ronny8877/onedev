<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { hexToBase64, base64ToHex } from '$lib/utils/hash';

	let input = $state('');
	let mode = $state<'hex-to-base64' | 'base64-to-hex'>('hex-to-base64');
	let uppercase = $state(false);
	let addSeparator = $state(false);
	let separator = $state(':');

	const sampleHex = '5d41402abc4b2a76b9719d911017c592';
	const sampleBase64 = 'XUFAKrxLKna5cZ2REBfFkg==';

	// Compute both output and error together without mutating state inside $derived
	let computed = $derived.by(() => {
		const trimmed = input.trim();
		if (!trimmed) return { output: '', error: null };

		try {
			let result: string;

			if (mode === 'hex-to-base64') {
				// Validate hex
				if (!/^[a-fA-F0-9]+$/.test(trimmed.replace(/[\s:-]/g, ''))) {
					return { output: '', error: 'Invalid hex string' };
				}
				const cleanHex = trimmed.replace(/[\s:-]/g, '');
				result = hexToBase64(cleanHex);
			} else {
				// Validate base64
				if (!/^[A-Za-z0-9+/]+=*$/.test(trimmed)) {
					return { output: '', error: 'Invalid Base64 string' };
				}
				result = base64ToHex(trimmed);
			}

			// Apply formatting
			if (mode === 'base64-to-hex' || mode === 'hex-to-base64' && !result.includes('/')) {
				if (mode === 'base64-to-hex') {
					if (uppercase) result = result.toUpperCase();
					if (addSeparator) {
						result = result.match(/.{1,2}/g)?.join(separator) || result;
					}
				}
			}

			return { output: result, error: null };
		} catch (err) {
			return { output: '', error: (err as Error).message };
		}
	});

	let output = $derived(computed.output);
	let computedError = $derived(computed.error);

	function loadSample() {
		if (mode === 'hex-to-base64') {
			input = sampleHex;
		} else {
			input = sampleBase64;
		}
	}

	function clearAll() {
		input = '';
	}

	function swapMode() {
		if (output) {
			input = output;
		}
		mode = mode === 'hex-to-base64' ? 'base64-to-hex' : 'hex-to-base64';
	}

	let stats = $derived({
		chars: input.length
	});
</script>

<ToolWrapper
	keywords={['hash converter', 'hex to base64', 'base64 to hex', 'hash format', 'convert md5', 'hash encoding']}
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} copyText={output} />

		<!-- Mode Selection -->
		<div class="flex flex-wrap items-center gap-4">
			<div class="join">
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={mode === 'hex-to-base64'}
					onclick={() => (mode = 'hex-to-base64')}
				>
					Hex → Base64
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={mode === 'base64-to-hex'}
					onclick={() => (mode = 'base64-to-hex')}
				>
					Base64 → Hex
				</button>
			</div>

			<button type="button" class="btn btn-ghost btn-sm" onclick={swapMode}>
				⇄ Swap
			</button>
		</div>

		<!-- Options (for hex output) -->
		{#if mode === 'base64-to-hex'}
			<div class="flex flex-wrap items-center gap-4">
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" bind:checked={uppercase} class="checkbox checkbox-sm" />
					<span class="text-sm">UPPERCASE</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" bind:checked={addSeparator} class="checkbox checkbox-sm" />
					<span class="text-sm">Add separator</span>
				</label>
				{#if addSeparator}
					<select bind:value={separator} class="select select-bordered select-sm">
						<option value=":">: (colon)</option>
						<option value="-">- (dash)</option>
						<option value=" ">(space)</option>
					</select>
				{/if}
			</div>
		{/if}

		<!-- Input/Output -->
		<div class="grid md:grid-cols-2 gap-4">
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">
					{mode === 'hex-to-base64' ? 'Hex Input' : 'Base64 Input'}
				</h3>
				<textarea
					bind:value={input}
					placeholder={mode === 'hex-to-base64' ? 'Paste hex string...' : 'Paste Base64 string...'}
					class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">
					{mode === 'hex-to-base64' ? 'Base64 Output' : 'Hex Output'}
				</h3>
				<div class="relative">
					<textarea
						value={output}
						readonly
						placeholder="Result will appear here..."
						class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-none bg-base-200"
						spellcheck="false"
					></textarea>
					{#if output}
						<div class="absolute top-2 right-2">
							<CopyButton text={output} size="sm" />
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if computedError}
			<div class="alert alert-error rounded-xl">
				<span>{computedError}</span>
			</div>
		{/if}

		<!-- Quick Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Format Reference</h4>
				<div class="overflow-x-auto mt-2">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Format</th>
								<th>Characters</th>
								<th>Example</th>
							</tr>
						</thead>
						<tbody class="text-xs font-mono">
							<tr>
								<td class="font-sans">Hex (lowercase)</td>
								<td>0-9, a-f</td>
								<td>5d41402abc4b2a76</td>
							</tr>
							<tr>
								<td class="font-sans">Hex (uppercase)</td>
								<td>0-9, A-F</td>
								<td>5D41402ABC4B2A76</td>
							</tr>
							<tr>
								<td class="font-sans">Hex (separated)</td>
								<td>0-9, a-f, :</td>
								<td>5d:41:40:2a:bc:4b</td>
							</tr>
							<tr>
								<td class="font-sans">Base64</td>
								<td>A-Z, a-z, 0-9, +, /, =</td>
								<td>XUFAKrxL</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
