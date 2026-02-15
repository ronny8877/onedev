<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { formatFileSize, downloadBlob } from '$lib/utils/image';
	import imageCompression from 'browser-image-compression';
	import { imageToolsContent } from '$lib/config/content/image-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = imageToolsContent['compressor'];

	let originalFile = $state<File | null>(null);
	let originalDataURL = $state('');
	let processedDataURL = $state('');
	let processedBlob = $state<Blob | null>(null);
	let isProcessing = $state(false);
	let progress = $state(0);

	// Options
	let quality = $state(80);
	let maxSizeMB = $state(1);
	let useMaxSize = $state(false);
	let maxWidthOrHeight = $state(2048);
	let useMaxDimension = $state(false);
	let preserveExif = $state(false);
	let alwaysKeepResolution = $state(true);
	let outputFormat = $state<'original' | 'image/jpeg' | 'image/png' | 'image/webp'>('original');

	async function handleImageLoad(file: File, dataURL: string) {
		originalFile = file;
		originalDataURL = dataURL;
		await compress();
	}

	async function compress() {
		if (!originalFile) return;

		isProcessing = true;
		progress = 0;
		try {
			const options: Parameters<typeof imageCompression>[1] = {
				maxSizeMB: useMaxSize ? maxSizeMB : Number.POSITIVE_INFINITY,
				maxWidthOrHeight: useMaxDimension ? maxWidthOrHeight : undefined,
				useWebWorker: true,
				initialQuality: quality / 100,
				preserveExif,
				alwaysKeepResolution,
				onProgress: (p) => {
					progress = p;
				}
			};

			if (outputFormat !== 'original') {
				options.fileType = outputFormat;
			}

			const compressed = await imageCompression(originalFile, options);
			processedBlob = compressed;

			const reader = new FileReader();
			reader.onload = () => {
				processedDataURL = reader.result as string;
			};
			reader.readAsDataURL(compressed);
		} catch (err) {
			console.error('Compression failed:', err);
		} finally {
			isProcessing = false;
			progress = 100;
		}
	}

	function handleSliderChange() {
		compress();
	}

	function download() {
		if (!processedBlob || !originalFile) return;
		let ext = originalFile.name.split('.').pop() || 'jpg';
		if (outputFormat !== 'original') {
			ext = outputFormat.replace('image/', '');
			if (ext === 'jpeg') ext = 'jpg';
		}
		const name = originalFile.name.replace(/\.[^/.]+$/, '');
		downloadBlob(processedBlob, `${name}-compressed.${ext}`);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		processedDataURL = '';
		processedBlob = null;
		progress = 0;
	}

	let savings = $derived(
		originalFile && processedBlob
			? Math.round(((originalFile.size - processedBlob.size) / originalFile.size) * 100)
			: 0
	);

	let compressionRatio = $derived(
		originalFile && processedBlob
			? (originalFile.size / processedBlob.size).toFixed(1)
			: '0'
	);

	async function loadSample() {
		const res = await fetch('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&q=95');
		const blob = await res.blob();
		const file = new File([blob], 'nature.jpg', { type: 'image/jpeg' });
		const reader = new FileReader();
		reader.onload = (e) => handleImageLoad(file, e.target?.result as string);
		reader.readAsDataURL(file);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !originalFile}
			<ImageUploader onImageLoad={handleImageLoad} />
		{:else}
			<!-- Main Controls Card -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body gap-4">
					<!-- Quality Section -->
					<div class="pb-4 border-b border-base-300">
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-semibold">Quality</h3>
							<span class="badge badge-primary badge-lg font-mono">{quality}%</span>
						</div>
						<input
							type="range"
							min="10"
							max="100"
							bind:value={quality}
							onchange={handleSliderChange}
							class="range range-primary w-full"
						/>
						<div class="flex justify-between text-xs text-base-content/50 mt-1 px-1">
							<span>Smaller file</span>
							<span>Better quality</span>
						</div>
					</div>

					<!-- Options Grid -->
					<div class="grid gap-4 sm:grid-cols-2">
						<!-- Target Size -->
						<div class="p-3 rounded-xl bg-base-300/50">
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									class="checkbox checkbox-sm checkbox-primary"
									bind:checked={useMaxSize}
									onchange={() => setTimeout(compress, 0)}
								/>
								<span class="font-medium">Target file size</span>
							</label>
							{#if useMaxSize}
								<div class="flex items-center gap-2 mt-2 ml-6">
									<input
										type="number"
										class="input input-bordered input-sm w-20"
										bind:value={maxSizeMB}
										onchange={handleSliderChange}
										min="0.1"
										max="50"
										step="0.1"
									/>
									<span class="text-sm text-base-content/60">MB max</span>
								</div>
							{/if}
						</div>

						<!-- Max Dimension -->
						<div class="p-3 rounded-xl bg-base-300/50">
							<label class="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									class="checkbox checkbox-sm checkbox-primary"
									bind:checked={useMaxDimension}
									onchange={() => setTimeout(compress, 0)}
								/>
								<span class="font-medium">Resize if larger</span>
							</label>
							{#if useMaxDimension}
								<div class="flex items-center gap-2 mt-2 ml-6">
									<input
										type="number"
										class="input input-bordered input-sm w-24"
										bind:value={maxWidthOrHeight}
										onchange={handleSliderChange}
										min="100"
										max="10000"
										step="100"
									/>
									<span class="text-sm text-base-content/60">px</span>
								</div>
							{/if}
						</div>

						<!-- Keep Resolution -->
						<label class="p-3 rounded-xl bg-base-300/50 flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								class="checkbox checkbox-sm checkbox-primary"
								bind:checked={alwaysKeepResolution}
								onchange={() => setTimeout(compress, 0)}
							/>
							<span class="font-medium">Keep resolution</span>
						</label>

						<!-- Preserve EXIF -->
						<label class="p-3 rounded-xl bg-base-300/50 flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								class="checkbox checkbox-sm checkbox-primary"
								bind:checked={preserveExif}
								onchange={() => setTimeout(compress, 0)}
							/>
							<span class="font-medium">Preserve EXIF</span>
						</label>
					</div>

					<!-- Output Format -->
					<div>
						<label class="text-sm font-medium mb-2 block text-base-content/70">Output format</label>
						<div class="flex flex-wrap gap-2">
							{#each [
								{ value: 'original', label: 'Original' },
								{ value: 'image/jpeg', label: 'JPEG' },
								{ value: 'image/png', label: 'PNG' },
								{ value: 'image/webp', label: 'WebP' }
							] as format}
								<button
									class="btn btn-sm"
									class:btn-primary={outputFormat === format.value}
									class:btn-ghost={outputFormat !== format.value}
									onclick={() => { outputFormat = format.value as typeof outputFormat; compress(); }}
								>
									{format.label}
								</button>
							{/each}
						</div>
					</div>

					<!-- Progress -->
					{#if isProcessing}
						<div class="pt-2">
							<div class="flex justify-between text-xs text-base-content/60 mb-1">
								<span>Compressing...</span>
								<span>{Math.round(progress)}%</span>
							</div>
							<progress class="progress progress-primary w-full" value={progress} max="100"></progress>
						</div>
					{/if}

					<!-- Actions -->
					<div class="flex items-center gap-3 pt-2">
						<button class="btn btn-primary gap-2" onclick={download} disabled={!processedBlob || isProcessing}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download
						</button>
						<button class="btn btn-ghost" onclick={reset}>
							New Image
						</button>
					</div>
				</div>
			</div>

			<!-- Results Card -->
			{#if processedDataURL && !isProcessing}
				<div class="card bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
					<div class="card-body py-4">
						<div class="flex flex-wrap items-center justify-center gap-6 text-center">
							<div>
								<div class="text-xs text-base-content/50 uppercase tracking-wide">Original</div>
								<div class="font-mono text-xl font-bold">{formatFileSize(originalFile.size)}</div>
							</div>
							<div class="text-2xl text-base-content/30">→</div>
							<div>
								<div class="text-xs text-base-content/50 uppercase tracking-wide">Compressed</div>
								<div class="font-mono text-xl font-bold text-primary">{formatFileSize(processedBlob?.size || 0)}</div>
							</div>
							<div class="divider divider-horizontal hidden sm:flex"></div>
							<div>
								<div class="text-xs text-base-content/50 uppercase tracking-wide">Saved</div>
								<div class="font-mono text-xl font-bold" class:text-success={savings > 0} class:text-error={savings < 0}>
									{savings > 0 ? '-' : '+'}{Math.abs(savings)}%
								</div>
							</div>
							<div>
								<div class="text-xs text-base-content/50 uppercase tracking-wide">Ratio</div>
								<div class="font-mono text-xl font-bold">{compressionRatio}×</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Preview Grid -->
				<div class="grid gap-4 lg:grid-cols-2">
					<div class="card bg-base-200 rounded-2xl overflow-hidden">
						<div class="relative">
							<img src={originalDataURL} alt="Original" class="w-full h-56 object-contain bg-base-300" />
							<div class="absolute top-3 left-3 badge badge-neutral">Original</div>
						</div>
					</div>
					<div class="card bg-base-200 rounded-2xl overflow-hidden">
						<div class="relative">
							<img src={processedDataURL} alt="Compressed" class="w-full h-56 object-contain bg-base-300" />
							<div class="absolute top-3 left-3 badge badge-primary">Compressed</div>
							{#if savings > 0}
								<div class="absolute top-3 right-3 badge badge-success">-{savings}%</div>
							{/if}
						</div>
					</div>
				</div>
			{:else if isProcessing}
				<div class="flex items-center justify-center py-12">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{/if}
		{/if}

		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<!-- <Examples examples={content.examples} /> -->
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
