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

	let originalWidth = $state(0);
	let originalHeight = $state(0);

	let targetWidth = $state(0);
	let targetHeight = $state(0);
	let maintainAspectRatio = $state(true);
	let percentage = $state(100);
	let mode = $state<'dim' | 'perc'>('dim');

	async function handleImageLoad(file: File, dataURL: string) {
		originalFile = file;
		originalDataURL = dataURL;
		const img = await loadImageAsCanvas(dataURL);
		originalWidth = img.width;
		originalHeight = img.height;
		targetWidth = img.width;
		targetHeight = img.height;
		percentage = 100;

		await process();
	}

	function handleDimChange(dim: 'width' | 'height') {
		if (maintainAspectRatio && originalWidth > 0 && originalHeight > 0) {
			const ratio = originalWidth / originalHeight;
			if (dim === 'width') {
				targetHeight = Math.round(targetWidth / ratio);
			} else {
				targetWidth = Math.round(targetHeight * ratio);
			}
		}
		mode = 'dim';
		// Update percentage roughly
		if (originalWidth > 0) {
			percentage = Math.round((targetWidth / originalWidth) * 100);
		}
		processDebounced();
	}

	function handlePercentageChange() {
		mode = 'perc';
		const factor = percentage / 100;
		targetWidth = Math.round(originalWidth * factor);
		targetHeight = Math.round(originalHeight * factor);
		processDebounced();
	}

	let debounceTimer: ReturnType<typeof setTimeout>;
	function processDebounced() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(process, 300);
	}

	async function process() {
		if (!originalDataURL || targetWidth <= 0 || targetHeight <= 0) return;

		isProcessing = true;
		try {
			const img = await loadImageAsCanvas(originalDataURL);
			const canvas = document.createElement('canvas');
			canvas.width = targetWidth;
			canvas.height = targetHeight;
			const ctx = canvas.getContext('2d')!;

			// Use high quality image smoothing
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = 'high';

			ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

			const mime = originalFile?.type || 'image/jpeg';
			processedBlob = await canvasToBlob(canvas, mime, 0.92);
			processedDataURL = canvas.toDataURL(mime);
		} catch (err) {
			console.error('Resize failed:', err);
		} finally {
			isProcessing = false;
		}
	}

	function download() {
		if (!processedBlob || !originalFile) return;
		const ext = mimeToExtension(originalFile.type);
		const name = originalFile.name.replace(/\.[^/.]+$/, '');
		downloadBlob(processedBlob, `${name}-${targetWidth}x${targetHeight}.${ext}`);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		processedDataURL = '';
		processedBlob = null;
		originalWidth = 0;
		originalHeight = 0;
		targetWidth = 0;
		targetHeight = 0;
		percentage = 100;
	}

	async function loadSample() {
		const res = await fetch('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&q=80');
		const blob = await res.blob();
		const file = new File([blob], 'mountains.jpg', { type: 'image/jpeg' });
		const reader = new FileReader();
		reader.onload = (e) => handleImageLoad(file, e.target?.result as string);
		reader.readAsDataURL(file);
	}
</script>

<ToolWrapper
	title="Image Resize"
	description="Resize images by pixel dimensions or percentage. Maintains quality with smart resampling."
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !originalFile}
			<ImageUploader onImageLoad={handleImageLoad} />
		{:else}
			<!-- Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body gap-6">
					<!-- Processing Indicator -->
					{#if isProcessing}
						<div class="absolute inset-0 bg-base-200/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
							<span class="loading loading-spinner text-primary"></span>
						</div>
					{/if}

					<div class="grid gap-6 md:grid-cols-2">
						<!-- Dimensions -->
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold text-sm">Dimensions</h3>
								<div class="text-xs text-base-content/50">
									Original: {originalWidth} × {originalHeight}
								</div>
							</div>

							<div class="flex items-end gap-2">
								<div class="form-control w-full">
									<label class="label text-xs" for="width">Width (px)</label>
									<input
										id="width"
										type="number"
										class="input input-bordered font-mono"
										bind:value={targetWidth}
										oninput={() => handleDimChange('width')}
										min="1"
									/>
								</div>
								<div class="pb-3 text-base-content/50">×</div>
								<div class="form-control w-full">
									<label class="label text-xs" for="height">Height (px)</label>
									<input
										id="height"
										type="number"
										class="input input-bordered font-mono"
										bind:value={targetHeight}
										oninput={() => handleDimChange('height')}
										min="1"
									/>
								</div>
							</div>

							<label class="label cursor-pointer justify-start gap-2">
								<input type="checkbox" class="checkbox checkbox-sm" bind:checked={maintainAspectRatio} />
								<span class="label-text text-sm">Maintain aspect ratio</span>
							</label>
						</div>

						<!-- Percentage -->
						<div class="space-y-4">
							<div class="flex items-center justify-between">
								<h3 class="font-semibold text-sm">Scale Percentage</h3>
								<span class="badge badge-ghost font-mono">{percentage}%</span>
							</div>

							<input
								type="range"
								min="1"
								max="200"
								bind:value={percentage}
								oninput={handlePercentageChange}
								class="range range-primary"
								step="1"
							/>
							<div class="flex justify-between text-xs text-base-content/50 px-1">
								<span>1%</span>
								<span>50%</span>
								<span>100%</span>
								<span>150%</span>
								<span>200%</span>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="flex items-center gap-3 pt-2">
						<button class="btn btn-primary gap-2" onclick={download} disabled={!processedBlob || isProcessing}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download Resized
						</button>
						<button class="btn btn-ghost" onclick={reset}>
							Upload New
						</button>
					</div>
				</div>
			</div>

			<!-- Preview -->
			{#if processedDataURL}
				<div class="space-y-2">
					<div class="flex items-center justify-between text-sm">
						<span class="font-medium">Preview</span>
						<div class="flex gap-4 text-base-content/60">
							<span>{targetWidth} × {targetHeight} px</span>
							<span>{formatFileSize(processedBlob?.size || 0)}</span>
						</div>
					</div>
					<div class="flex items-center justify-center rounded-2xl bg-base-300 p-4">
						<img
							src={processedDataURL}
							alt="Resized preview"
							class="max-h-[500px] object-contain shadow-sm"
						/>
					</div>
				</div>
			{/if}
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Features</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Pixel precise</strong>: Set exact width and height</li>
					<li>• <strong>Proportional scaling</strong>: Maintain aspect ratio automatically</li>
					<li>• <strong>Smart resampling</strong>: High quality reduction and enlargement</li>
					<li>• <strong>Percentage scale</strong>: Quickly resize by % of original</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
