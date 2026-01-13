<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import { base64ToHex, base64ToBinary, validateBase64 } from '$lib/utils/base64';

	let input = $state('');
	let outputFormat = $state<'hex' | 'binary'>('hex');
	let output = $state('');
	let error = $state<string | null>(null);
	let convertTimeout: ReturnType<typeof setTimeout> | null = null;

	// Auto-convert with debounce
	$effect(() => {
		const _input = input;
		const _format = outputFormat;

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
			if (outputFormat === 'hex') {
				output = base64ToHex(trimmed);
			} else {
				output = base64ToBinary(trimmed);
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

	// Format hex with spaces every 2 chars for readability
	function formatHex(hex: string): string {
		return hex.match(/.{1,2}/g)?.join(' ') || hex;
	}
</script>

<ToolWrapper
	title="Base64 → Hex / Binary"
	description="Convert Base64 to hexadecimal or binary representation. Useful for crypto and debugging."
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<div class="join">
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={outputFormat === 'hex'}
					onclick={() => (outputFormat = 'hex')}
				>
					Hexadecimal
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={outputFormat === 'binary'}
					onclick={() => (outputFormat = 'binary')}
				>
					Binary
				</button>
			</div>

			{#if output}
				<span class="text-xs text-base-content/50">
					{outputFormat === 'hex' ? output.length / 2 : output.replace(/\s/g, '').length / 8} bytes
				</span>
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
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Base64 Input</h3>
				<textarea
					bind:value={input}
					placeholder="Paste Base64 string..."
					class="textarea textarea-bordered w-full min-h-[250px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>

			<div>
				<div class="mb-2 flex items-center justify-between">
					<h3 class="text-sm font-medium text-base-content/70">
						{outputFormat === 'hex' ? 'Hexadecimal' : 'Binary'} Output
					</h3>
					{#if output}
						<button type="button" class="btn btn-ghost btn-xs" onclick={copyOutput}>
							Copy
						</button>
					{/if}
				</div>
				<textarea
					value={outputFormat === 'hex' ? formatHex(output) : output}
					readonly
					placeholder="{outputFormat === 'hex' ? 'Hex' : 'Binary'} result..."
					class="textarea textarea-bordered w-full min-h-[250px] font-mono text-xs rounded-xl resize-none bg-base-200"
				></textarea>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Use Cases</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Hex</strong>: Viewing raw bytes, cryptographic hashes, memory addresses</li>
					<li>• <strong>Binary</strong>: Bit-level analysis, protocol debugging, embedded systems</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
