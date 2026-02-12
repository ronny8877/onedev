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

	const content = hashToolsContent['md5'];
	import { hashText, hashFile, formatSize, formatTime, type HashResult, type HashProgress } from '$lib/utils/hash';

	let input = $state('');
	let result = $state<HashResult | null>(null);
	let isProcessing = $state(false);
	let error = $state<string | null>(null);
	let uppercase = $state(false);
	let showBase64 = $state(false);
	let inputMode = $state<'text' | 'file'>('text');
	let fileInfo = $state<{ name: string; size: number } | null>(null);
	let progress = $state<HashProgress | null>(null);
	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	const MAX_FILE_SIZE = 100 * 1024 * 1024;
	const sampleText = 'Hello, World!';
	const ALGORITHM = 'MD5' as const;

	let hashTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		const _input = input;
		const _mode = inputMode;

		if (_mode !== 'text') return;
		if (hashTimeout) clearTimeout(hashTimeout);

		if (!_input.trim()) {
			result = null;
			error = null;
			return;
		}

		hashTimeout = setTimeout(async () => {
			isProcessing = true;
			error = null;
			try {
				result = await hashText(_input, ALGORITHM);
			} catch (err) {
				error = (err as Error).message;
			} finally {
				isProcessing = false;
			}
		}, 150);

		return () => {
			if (hashTimeout) clearTimeout(hashTimeout);
		};
	});

	async function processFile(file: File) {
		if (file.size > MAX_FILE_SIZE) {
			error = `File too large (${formatSize(file.size)}). Max: ${formatSize(MAX_FILE_SIZE)}`;
			return;
		}

		inputMode = 'file';
		fileInfo = { name: file.name, size: file.size };
		isProcessing = true;
		error = null;
		progress = { loaded: 0, total: file.size, percent: 0 };

		try {
			result = await hashFile(file, ALGORITHM, (p) => {
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
		if (files && files.length > 0) processFile(files[0]);
	}

	function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) processFile(target.files[0]);
	}

	function loadSample() {
		inputMode = 'text';
		fileInfo = null;
		input = sampleText;
	}

	function clearAll() {
		input = '';
		result = null;
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
	keywords={['md5 hash', 'md5 online', 'md5 generator', 'md5 checksum', 'md5 calculator', 'generate md5']}
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} copyText={result?.hex} />

		<!-- Input Mode Tabs -->
		<div class="flex items-center gap-4">
			<div class="join">
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={inputMode === 'text'}
					onclick={() => { inputMode = 'text'; fileInfo = null; result = null; }}
				>
					Text
				</button>
				<button
					type="button"
					class="btn join-item"
					class:btn-primary={inputMode === 'file'}
					onclick={() => { inputMode = 'file'; input = ''; result = null; }}
				>
					File
				</button>
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

		<!-- Text Input -->
		{#if inputMode === 'text'}
			<textarea
				bind:value={input}
				placeholder="Type or paste text to generate MD5 hash..."
				class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-none"
				spellcheck="false"
			></textarea>
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
				<input bind:this={fileInput} type="file" class="absolute inset-0 opacity-0 cursor-pointer" onchange={handleFileSelect} />
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
						<p class="text-base-content/70 font-medium">Drag & drop a file, or click to browse</p>
						<p class="text-xs text-base-content/50 mt-2">Max: {formatSize(MAX_FILE_SIZE)}</p>
					{/if}
				</div>
				{#if progress && isProcessing}
					<div class="px-4 pb-4">
						<progress class="progress progress-primary w-full" value={progress.percent} max="100"></progress>
					</div>
				{/if}
			</div>
		{/if}

		{#if error}
			<div class="alert alert-error rounded-xl">
				<span>{error}</span>
			</div>
		{/if}

		<!-- Result -->
		{#if result}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between gap-2 mb-3">
						<div class="flex items-center gap-2">
							<span class="font-semibold">MD5 Hash</span>
							<span class="badge badge-warning badge-sm">128 bits</span>
							<span class="text-xs text-base-content/50">{formatTime(result.time)}</span>
						</div>
						<CopyButton text={showBase64 ? result.base64 : formatHash(result.hex)} size="sm" />
					</div>
					<code class="block font-mono text-base break-all bg-base-300/50 p-4 rounded-lg select-all">
						{showBase64 ? result.base64 : formatHash(result.hex)}
					</code>
				</div>
			</div>
		{/if}

		{#if isProcessing && inputMode === 'text'}
			<div class="flex items-center justify-center gap-2 py-4">
				<span class="loading loading-spinner loading-sm"></span>
				<span class="text-sm text-base-content/70">Generating MD5...</span>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About MD5</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Output:</strong> 128-bit (32 hex characters)</li>
					<li>• <strong>Speed:</strong> Very fast, good for checksums</li>
					<li>• <strong>Security:</strong> Not recommended for security purposes (collision attacks exist)</li>
					<li>• <strong>Use cases:</strong> File integrity checks, non-security checksums, legacy systems</li>
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
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
