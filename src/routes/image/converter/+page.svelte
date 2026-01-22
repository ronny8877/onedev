<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadImageAsCanvas, canvasToBlob, downloadBlob, formatFileSize, mimeToExtension } from '$lib/utils/image';

	let originalFile = $state<File | null>(null);
	let originalDataURL = $state('');
	let processedDataURL = $state('');
	let processedBlob = $state<Blob | null>(null);
	let isProcessing = $state(false);

	// Options
	type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';
	let outputFormat = $state<OutputFormat>('image/png');
	let qualityDisplay = $state(92);
	let quality = $state(92);

	const formats: { label: string; value: OutputFormat; ext: string }[] = [
		{ label: 'PNG', value: 'image/png', ext: 'png' },
		{ label: 'JPEG', value: 'image/jpeg', ext: 'jpg' },
		{ label: 'WebP', value: 'image/webp', ext: 'webp' }
	];

	async function handleImageLoad(file: File, dataURL: string) {
		originalFile = file;
		originalDataURL = dataURL;
		await convert();
	}

	async function convert() {
		if (!originalDataURL) return;

		isProcessing = true;
		try {
			const canvas = await loadImageAsCanvas(originalDataURL);
			const qualityValue = outputFormat === 'image/png' ? 1 : quality / 100;
			processedBlob = await canvasToBlob(canvas, outputFormat, qualityValue);
			processedDataURL = canvas.toDataURL(outputFormat, qualityValue);
		} catch (err) {
			console.error('Conversion failed:', err);
		} finally {
			isProcessing = false;
		}
	}

	function download() {
		if (!processedBlob || !originalFile) return;
		const format = formats.find((f) => f.value === outputFormat);
		const name = originalFile.name.replace(/\.[^/.]+$/, '');
		downloadBlob(processedBlob, `${name}.${format?.ext || 'png'}`);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		processedDataURL = '';
		processedBlob = null;
	}

	function handleSliderChange() {
		quality = qualityDisplay;
	}

	// Re-convert when options change
	$effect(() => {
		if (originalDataURL) {
			outputFormat;
			quality;
			convert();
		}
	});

	let originalFormat = $derived(originalFile?.type || 'unknown');

	async function loadSample() {
		// Load a transparent PNG to show conversion benefits (e.g. to JPG loses transparency)
		const res = await fetch('https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&q=80');
		const blob = await res.blob();
		const file = new File([blob], 'logo-idea.jpg', { type: 'image/jpeg' });
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
			<!-- Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body gap-6">
					<!-- Original Format Info -->
					<div class="flex items-center gap-2 text-sm text-base-content/60">
						<span>Original format:</span>
						<span class="badge badge-ghost font-mono">{originalFormat}</span>
					</div>

					<!-- Output Format Selection -->
					<div>
						<label class="text-sm font-medium mb-2 block">Convert to:</label>
						<div class="flex gap-2">
							{#each formats as format}
								<button
									class="btn btn-lg flex-1"
									class:btn-primary={outputFormat === format.value}
									class:btn-ghost={outputFormat !== format.value}
									onclick={() => (outputFormat = format.value)}
								>
									{format.label}
								</button>
							{/each}
						</div>
					</div>

					<!-- Quality Slider (for lossy formats) -->
					{#if outputFormat !== 'image/png'}
						<div>
							<div class="flex items-center justify-between mb-2">
								<label class="text-sm font-medium" for="quality">Quality</label>
								<span class="badge badge-ghost font-mono">{qualityDisplay}%</span>
							</div>
							<input
								id="quality"
								type="range"
								min="10"
								max="100"
								bind:value={qualityDisplay}
								onchange={handleSliderChange}
								class="range range-primary"
							/>
							<div class="flex justify-between text-xs text-base-content/50 mt-1">
								<span>Smaller file</span>
								<span>Better quality</span>
							</div>
						</div>
					{:else}
						<div class="text-sm text-base-content/50 italic">
							PNG is lossless — quality slider not applicable
						</div>
					{/if}

					<!-- Actions -->
					<div class="flex items-center gap-3">
						<button class="btn btn-primary gap-2" onclick={download} disabled={!processedBlob || isProcessing}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download {formats.find((f) => f.value === outputFormat)?.label}
						</button>
						<button class="btn btn-ghost" onclick={reset}>
							Upload New
						</button>
					</div>
				</div>
			</div>

			<!-- Preview -->
			{#if isProcessing}
				<div class="flex items-center justify-center py-12">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{:else if processedDataURL}
				<div class="relative">
					<img
						src={processedDataURL}
						alt="Converted preview"
						class="mx-auto max-h-96 rounded-2xl bg-base-300 object-contain"
					/>
				</div>

				<!-- Size comparison -->
				<div class="flex items-center justify-center gap-6 text-sm">
					<div class="text-center">
						<div class="text-base-content/50">Original ({mimeToExtension(originalFormat).toUpperCase()})</div>
						<div class="font-mono font-semibold">{formatFileSize(originalFile.size)}</div>
					</div>
					<svg class="h-5 w-5 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
					<div class="text-center">
						<div class="text-base-content/50">{formats.find((f) => f.value === outputFormat)?.label}</div>
						<div class="font-mono font-semibold">{formatFileSize(processedBlob?.size || 0)}</div>
					</div>
				</div>
			{/if}
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Format Guide</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>PNG</strong>: Lossless, supports transparency, best for graphics/logos</li>
					<li>• <strong>JPEG</strong>: Lossy, smaller files, great for photographs</li>
					<li>• <strong>WebP</strong>: Modern format, best compression, wide browser support</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
