<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { hashToolsContent } from '$lib/config/content/hash-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import HowTo from '$lib/components/content/HowTo.svelte';

	const content = hashToolsContent['generator'];

	import {
		hashTextAll,
		hashFileAll,
		hexToBase64,
		formatSize,
		formatTime,
		type HashResult,
		type HashProgress
	} from '$lib/utils/hash';

	let input = $state('');
	let results = $state<HashResult[]>([]);
	let isProcessing = $state(false);
	let error = $state<string | null>(null);
	let uppercase = $state(false);
	let showBase64 = $state(false);
	let inputMode = $state<'text' | 'file'>('text');
	let fileInfo = $state<{ name: string; size: number } | null>(null);
	let progress = $state<HashProgress | null>(null);
	let isDragging = $state(false);
	let fileInput = $state<HTMLInputElement | undefined>();

	const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

	const sampleText = 'Hello, World!';

	// Hash info for each algorithm
	const hashInfo: Record<string, { bits: number; color: string; description: string }> = {
		MD5: { bits: 128, color: 'warning', description: 'Fast but not secure for cryptographic use' },
		'SHA-1': { bits: 160, color: 'info', description: 'Legacy, used in Git commits' },
		'SHA-256': { bits: 256, color: 'success', description: 'Industry standard, used in Bitcoin' },
		'SHA-512': { bits: 512, color: 'primary', description: '512-bit SHA-2 digest, not a password hash' },
		CRC32: { bits: 32, color: 'neutral', description: 'Checksum for data integrity' }
	};

	// Auto-hash text input with debounce
	let hashTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const _input = input;
		const _mode = inputMode;

		if (_mode !== 'text') return;

		if (hashTimeout) clearTimeout(hashTimeout);

		if (!_input.trim()) {
			results = [];
			error = null;
			return;
		}

		hashTimeout = setTimeout(async () => {
			await hashText();
		}, 200);

		return () => {
			if (hashTimeout) clearTimeout(hashTimeout);
		};
	});

	async function hashText() {
		if (!input.trim() || inputMode !== 'text') return;

		isProcessing = true;
		error = null;

		try {
			results = await hashTextAll(input);
		} catch (err) {
			error = (err as Error).message;
		} finally {
			isProcessing = false;
		}
	}

	async function hashFile(file: File) {
		if (file.size > MAX_FILE_SIZE) {
			error = `File too large (${formatSize(file.size)}). Maximum: ${formatSize(MAX_FILE_SIZE)}`;
			return;
		}

		inputMode = 'file';
		fileInfo = { name: file.name, size: file.size };
		isProcessing = true;
		error = null;
		progress = { loaded: 0, total: file.size, percent: 0 };

		try {
			results = await hashFileAll(file, (p) => {
				progress = p;
			});
		} catch (err) {
			error = (err as Error).message;
		} finally {
			isProcessing = false;
			progress = null;
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		isDragging = true;
	}

	function handleDragLeave() {
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;

		const files = e.dataTransfer?.files;
		if (files && files.length > 0) {
			hashFile(files[0]);
		}
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			hashFile(target.files[0]);
		}
	}

	function loadSample() {
		inputMode = 'text';
		fileInfo = null;
		input = sampleText;
	}

	function clearAll() {
		input = '';
		results = [];
		error = null;
		fileInfo = null;
		inputMode = 'text';
		if (fileInput) fileInput.value = '';
	}

	function formatHash(hex: string): string {
		return uppercase ? hex.toUpperCase() : hex.toLowerCase();
	}

	let stats = $derived({
		chars: inputMode === 'text' ? input.length : undefined,
		bytes: fileInfo?.size
	});
</script>

<ToolWrapper
	keywords={['hash generator', 'md5 online', 'sha256 hash', 'sha512', 'crc32 checksum', 'file hash', 'checksum calculator']}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Input Mode Tabs -->
		<div class="flex items-center gap-4">
			<div class="join">
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={inputMode === 'text'}
					onclick={() => {
						inputMode = 'text';
						fileInfo = null;
						results = [];
					}}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
					</svg>
					Text
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={inputMode === 'file'}
					onclick={() => {
						inputMode = 'file';
						input = '';
						results = [];
					}}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
					</svg>
					File
				</button>
			</div>

			{#if results.length > 0}
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

		<!-- Text Input -->
		{#if inputMode === 'text'}
			<div>
				<textarea
					bind:value={input}
					placeholder="Type or paste text to hash..."
					class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-none"
					spellcheck="false"
				></textarea>
			</div>
		{/if}

		<!-- File Input -->
		{#if inputMode === 'file'}
			<div
				class="relative rounded-xl border-2 border-dashed transition-colors {isDragging ? 'border-primary bg-primary/5' : 'border-base-300'}"
				ondragover={handleDragOver}
				ondragleave={handleDragLeave}
				ondrop={handleDrop}
				role="button"
				tabindex="0"
			>
				<input
					bind:this={fileInput}
					type="file"
					class="absolute inset-0 opacity-0 cursor-pointer"
					onchange={handleFileSelect}
				/>
				<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
					{#if fileInfo}
						<svg class="h-12 w-12 text-success mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p class="font-medium">{fileInfo.name}</p>
						<p class="text-sm text-base-content/60">{formatSize(fileInfo.size)}</p>
					{:else}
						<svg class="h-12 w-12 text-base-content/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
						</svg>
						<p class="text-base-content/70 font-medium">Drag & drop a file here, or click to browse</p>
						<p class="text-xs text-base-content/50 mt-2">Max file size: {formatSize(MAX_FILE_SIZE)}</p>
					{/if}
				</div>

				{#if progress && isProcessing}
					<div class="px-4 pb-4">
						<progress class="progress progress-primary w-full" value={progress.percent} max="100"></progress>
						<p class="text-xs text-center text-base-content/60 mt-1">
							Hashing... {progress.percent}%
						</p>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Error -->
		{#if error}
			<div class="alert alert-error rounded-xl">
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" />
					<path d="m15 9-6 6M9 9l6 6" />
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		<!-- Results -->
		{#if results.length > 0}
			<div class="space-y-3">
				<h3 class="font-semibold flex items-center gap-2">
					<span>Hash Results</span>
					{#if results.length > 0}
						<span class="badge badge-sm badge-ghost">{results.reduce((acc, r) => acc + r.time, 0).toFixed(0)}ms total</span>
					{/if}
				</h3>

				<div class="grid gap-3">
					{#each results as result}
						{@const info = hashInfo[result.algorithm]}
						<div class="card bg-base-200 rounded-xl overflow-hidden">
							<div class="card-body p-4">
								<div class="flex items-start justify-between gap-4">
									<div class="flex-1 min-w-0">
										<div class="flex items-center gap-2 mb-2">
											<span class="font-semibold">{result.algorithm}</span>
											<span class="badge badge-xs badge-{info.color}">{info.bits} bits</span>
											<span class="text-xs text-base-content/50">{formatTime(result.time)}</span>
										</div>
										<div class="relative">
											<code class="block font-mono text-sm break-all bg-base-300/50 p-3 rounded-lg pr-12 {showBase64 ? '' : ''}">
												{showBase64 ? result.base64 : formatHash(result.hex)}
											</code>
										</div>
										<p class="text-xs text-base-content/50 mt-2">{info.description}</p>
									</div>
									<CopyButton text={showBase64 ? result.base64 : formatHash(result.hex)} size="sm" />
								</div>
							</div>

							<!-- Visual hash length indicator -->
							<div class="h-1 bg-{info.color}/30">
								<div
									class="h-full bg-{info.color}"
									style="width: {Math.min(100, (info.bits / 512) * 100)}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Loading -->
		{#if isProcessing && inputMode === 'text'}
			<div class="flex items-center justify-center gap-2 py-4">
				<span class="loading loading-spinner loading-sm"></span>
				<span class="text-sm text-base-content/70">Generating hashes...</span>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About Hash Functions</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>MD5</strong> (128-bit) - Fast checksum, not for security. Collisions possible.</li>
					<li>• <strong>SHA-1</strong> (160-bit) - Used in Git. Deprecated for security.</li>
					<li>• <strong>SHA-256</strong> (256-bit) - Industry standard. Bitcoin, TLS, file verification.</li>
					<li>• <strong>SHA-512</strong> (512-bit) - Longer SHA-2 digest than SHA-256. Still not for storing passwords.</li>
					<li>• <strong>CRC32</strong> (32-bit) - Fast error detection, not cryptographic.</li>
				</ul>
			</div>
		</div>
		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
