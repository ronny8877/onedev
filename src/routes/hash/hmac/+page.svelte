<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { hexToBase64, formatTime } from '$lib/utils/hash';

	type HmacAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

	let message = $state('');
	let secretKey = $state('');
	let algorithm = $state<HmacAlgorithm>('SHA-256');
	let result = $state<{ hex: string; base64: string; time: number } | null>(null);
	let isProcessing = $state(false);
	let error = $state<string | null>(null);
	let uppercase = $state(false);
	let showBase64 = $state(false);

	const sampleMessage = 'Hello, World!';
	const sampleKey = 'my-secret-key';

	let hashTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const _message = message;
		const _key = secretKey;
		const _alg = algorithm;

		if (hashTimeout) clearTimeout(hashTimeout);

		if (!_message.trim() || !_key.trim()) {
			result = null;
			error = null;
			return;
		}

		hashTimeout = setTimeout(async () => {
			await generateHmac();
		}, 200);

		return () => {
			if (hashTimeout) clearTimeout(hashTimeout);
		};
	});

	async function generateHmac() {
		if (!message.trim() || !secretKey.trim()) return;

		isProcessing = true;
		error = null;

		try {
			const start = performance.now();
			const encoder = new TextEncoder();

			// Import key
			const key = await crypto.subtle.importKey(
				'raw',
				encoder.encode(secretKey),
				{ name: 'HMAC', hash: algorithm },
				false,
				['sign']
			);

			// Sign message
			const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));

			// Convert to hex
			const hex = Array.from(new Uint8Array(signature))
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('');

			result = {
				hex,
				base64: hexToBase64(hex),
				time: performance.now() - start
			};
		} catch (err) {
			error = (err as Error).message;
		} finally {
			isProcessing = false;
		}
	}

	function loadSample() {
		message = sampleMessage;
		secretKey = sampleKey;
	}

	function clearAll() {
		message = '';
		secretKey = '';
		result = null;
		error = null;
	}

	function formatHash(hex: string): string {
		return uppercase ? hex.toUpperCase() : hex.toLowerCase();
	}

	const algorithmInfo: Record<HmacAlgorithm, { bits: number; color: string }> = {
		'SHA-256': { bits: 256, color: 'success' },
		'SHA-384': { bits: 384, color: 'info' },
		'SHA-512': { bits: 512, color: 'primary' }
	};

	let stats = $derived({
		chars: message.length
	});
</script>

<ToolWrapper
	title="HMAC Generator Online"
	description="Generate HMAC (Hash-based Message Authentication Code) online. Create SHA-256, SHA-384, SHA-512 keyed-hash authentication codes."
	keywords={['hmac generator', 'hmac online', 'hmac sha256', 'hmac sha512', 'message authentication code', 'keyed hash']}
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Algorithm Selection -->
		<div class="flex items-center gap-4">
			<div class="join">
				{#each Object.keys(algorithmInfo) as alg}
					<button
						type="button"
						class="btn join-item"
						class:btn-primary={algorithm === alg}
						onclick={() => (algorithm = alg as HmacAlgorithm)}
					>
						HMAC-{alg}
					</button>
				{/each}
			</div>

			{#if result}
				<div class="flex items-center gap-3 ml-auto">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={uppercase} class="toggle toggle-sm" />
						<span class="text-sm">UPPERCASE</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={showBase64} class="toggle toggle-sm" />
						<span class="text-sm">Base64</span>
					</label>
				</div>
			{/if}
		</div>

		<!-- Inputs -->
		<div class="grid md:grid-cols-2 gap-4">
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">Message</h3>
				<textarea
					bind:value={message}
					placeholder="Enter message to sign..."
					class="textarea textarea-bordered w-full min-h-[120px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">Secret Key</h3>
				<textarea
					bind:value={secretKey}
					placeholder="Enter secret key..."
					class="textarea textarea-bordered w-full min-h-[120px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>
		</div>

		{#if error}
			<div class="alert alert-error rounded-xl">
				<span>{error}</span>
			</div>
		{/if}

		<!-- Result -->
		{#if result}
			{@const info = algorithmInfo[algorithm]}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between gap-2 mb-3">
						<div class="flex items-center gap-2">
							<span class="font-semibold">HMAC-{algorithm}</span>
							<span class="badge badge-{info.color} badge-sm">{info.bits} bits</span>
							<span class="text-xs text-base-content/50">{formatTime(result.time)}</span>
						</div>
						<CopyButton text={showBase64 ? result.base64 : formatHash(result.hex)} size="sm" />
					</div>
					<code class="block font-mono text-sm break-all bg-base-300/50 p-4 rounded-lg select-all">
						{showBase64 ? result.base64 : formatHash(result.hex)}
					</code>
				</div>
			</div>
		{/if}

		{#if isProcessing}
			<div class="flex items-center justify-center gap-2 py-4">
				<span class="loading loading-spinner loading-sm"></span>
				<span class="text-sm text-base-content/70">Generating HMAC...</span>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About HMAC</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>HMAC</strong> = Hash-based Message Authentication Code</li>
					<li>• Combines a secret key with a message to create a signature</li>
					<li>• Verifies both data integrity AND authenticity</li>
					<li>• <strong>Use cases:</strong> API authentication, JWT signatures, webhook verification</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
