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

	const content = hashToolsContent['file-checksum'];
	import {
		hashFile,
		formatSize,
		formatTime,
		type HashAlgorithm,
		type HashResult,
		type HashProgress
	} from '$lib/utils/hash';

	let expectedHash = $state('');
	let algorithm = $state<HashAlgorithm>('SHA-256');
	let fileInfo = $state<{ name: string; size: number } | null>(null);
	let result = $state<HashResult | null>(null);
	let isProcessing = $state(false);
	let error = $state<string | null>(null);
	let progress = $state<HashProgress | null>(null);
	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

	const algorithms: { value: HashAlgorithm; label: string }[] = [
		{ value: 'MD5', label: 'MD5' },
		{ value: 'SHA-1', label: 'SHA-1' },
		{ value: 'SHA-256', label: 'SHA-256' },
		{ value: 'SHA-512', label: 'SHA-512' },
		{ value: 'CRC32', label: 'CRC32' }
	];

	// Normalize hash for comparison
	function normalize(hash: string): string {
		return hash.trim().toLowerCase().replace(/\s+/g, '');
	}

	let normalizedExpected = $derived(normalize(expectedHash));
	let normalizedResult = $derived(result ? normalize(result.hex) : '');

	let isMatch = $derived(
		normalizedExpected.length > 0 &&
			normalizedResult.length > 0 &&
			normalizedExpected === normalizedResult
	);

	let hasComparison = $derived(normalizedExpected.length > 0 && result !== null);

	async function processFile(file: File) {
		if (file.size > MAX_FILE_SIZE) {
			error = `File too large (${formatSize(file.size)}). Max: ${formatSize(MAX_FILE_SIZE)}`;
			return;
		}

		fileInfo = { name: file.name, size: file.size };
		isProcessing = true;
		error = null;
		progress = { loaded: 0, total: file.size, percent: 0 };

		try {
			result = await hashFile(file, algorithm, (p) => {
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

	function clearAll() {
		expectedHash = '';
		fileInfo = null;
		result = null;
		error = null;
		if (fileInput) fileInput.value = '';
	}
</script>

<ToolWrapper
	keywords={['verify checksum', 'file checksum', 'verify hash', 'file integrity', 'compare file hash', 'download verification']}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		<ToolActions onClear={clearAll} />

		<!-- Expected Hash Input -->
		<div>
			<div class="flex flex-wrap items-center justify-between gap-2 mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Expected Hash (optional)</h3>
				<select
					bind:value={algorithm}
					class="select select-bordered select-sm w-auto bg-base-100 shrink-0"
					onchange={() => {
						if (fileInfo && fileInput?.files?.[0]) {
							processFile(fileInput.files[0]);
						}
					}}
				>
					{#each algorithms as alg}
						<option value={alg.value}>{alg.label}</option>
					{/each}
				</select>
			</div>
			<input
				type="text"
				bind:value={expectedHash}
				placeholder="Paste expected hash to compare (e.g., from download page)..."
				class="input input-bordered w-full font-mono text-sm rounded-xl"
				spellcheck="false"
			/>
		</div>

		<!-- File Drop Zone -->
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
					<p class="text-base-content/70 font-medium">Drop a file to verify its checksum</p>
					<p class="text-xs text-base-content/50 mt-2">Max: {formatSize(MAX_FILE_SIZE)}</p>
				{/if}
			</div>

			{#if progress && isProcessing}
				<div class="px-4 pb-4">
					<progress class="progress progress-primary w-full" value={progress.percent} max="100"></progress>
					<p class="text-xs text-center text-base-content/60 mt-1">Calculating {algorithm}... {progress.percent}%</p>
				</div>
			{/if}
		</div>

		{#if error}
			<div class="alert alert-error rounded-xl">
				<span>{error}</span>
			</div>
		{/if}

		<!-- Verification Result -->
		{#if hasComparison}
			<div class="card rounded-xl {isMatch ? 'bg-success/10 border-2 border-success' : 'bg-error/10 border-2 border-error'}">
				<div class="card-body p-6">
					<div class="flex items-center justify-center gap-4">
						{#if isMatch}
							<svg class="h-16 w-16 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<div>
								<h3 class="text-2xl font-bold text-success">Verified ✓</h3>
								<p class="text-sm text-success/80">File integrity confirmed. The checksum matches.</p>
							</div>
						{:else}
							<svg class="h-16 w-16 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
							<div>
								<h3 class="text-2xl font-bold text-error">Mismatch!</h3>
								<p class="text-sm text-error/80">The checksums do not match. File may be corrupted or modified.</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Result Display -->
		{#if result}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between gap-2 mb-3">
						<div class="flex items-center gap-2">
							<span class="font-semibold">{algorithm} Checksum</span>
							<span class="text-xs text-base-content/50">{formatTime(result.time)}</span>
						</div>
						<CopyButton text={result.hex} size="sm" />
					</div>
					<code class="block font-mono text-sm break-all bg-base-300/50 p-4 rounded-lg select-all">
						{result.hex}
					</code>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">When to Verify Checksums</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Downloads</strong> - Verify ISO files, software installers, firmware updates</li>
					<li>• <strong>File transfers</strong> - Ensure files weren't corrupted during copy</li>
					<li>• <strong>Security</strong> - Verify files haven't been tampered with</li>
					<li>• <strong>Backups</strong> - Confirm backup integrity</li>
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
