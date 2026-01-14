<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import { loadImage, canvasToBlob, downloadBlob, formatFileSize, mimeToExtension } from '$lib/utils/image';

	let originalFile = $state<File | null>(null);
	let originalDataURL = $state('');
	let processedDataURL = $state('');
	let processedBlob = $state<Blob | null>(null);
	let isProcessing = $state(false);

	// Original dimensions
	let originalWidth = $state(0);
	let originalHeight = $state(0);

	// Options
	let width = $state(0);
	let height = $state(0);
	let lockAspectRatio = $state(true);
	let aspectRatio = $state(1);

	async function handleImageLoad(file: File, dataURL: string) {
		originalFile = file;
		originalDataURL = dataURL;

		const img = await loadImage(dataURL);
		originalWidth = img.width;
		originalHeight = img.height;
		width = img.width;
		height = img.height;
		aspectRatio = img.width / img.height;

		await process();
	}

	async function process() {
		if (!originalDataURL || width <= 0 || height <= 0) return;

		isProcessing = true;
		try {
			const img = await loadImage(originalDataURL);
			const canvas = document.createElement('canvas');
			canvas.width = Math.round(width);
			canvas.height = Math.round(height);
			const ctx = canvas.getContext('2d')!;
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			const mime = originalFile?.type || 'image/png';
			processedBlob = await canvasToBlob(canvas, mime, 0.92);
			processedDataURL = canvas.toDataURL(mime);
		} catch (err) {
			console.error('Resize failed:', err);
		} finally {
			isProcessing = false;
		}
	}

	function handleWidthChange(e: Event) {
		const newWidth = parseInt((e.target as HTMLInputElement).value) || 0;
		width = newWidth;
		if (lockAspectRatio && newWidth > 0) {
			height = Math.round(newWidth / aspectRatio);
		}
	}

	function handleHeightChange(e: Event) {
		const newHeight = parseInt((e.target as HTMLInputElement).value) || 0;
		height = newHeight;
		if (lockAspectRatio && newHeight > 0) {
			width = Math.round(newHeight * aspectRatio);
		}
	}

	function setScale(scale: number) {
		width = Math.round(originalWidth * scale);
		height = Math.round(originalHeight * scale);
	}

	function download() {
		if (!processedBlob || !originalFile) return;
		const ext = mimeToExtension(originalFile.type);
		const name = originalFile.name.replace(/\.[^/.]+$/, '');
		downloadBlob(processedBlob, `${name}-${width}x${height}.${ext}`);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		processedDataURL = '';
		processedBlob = null;
		width = 0;
		height = 0;
	}

	// Re-process when dimensions change
	$effect(() => {
		if (originalDataURL && width > 0 && height > 0) {
			process();
		}
	});

	let scalePercent = $derived(
		originalWidth > 0 ? Math.round((width / originalWidth) * 100) : 100
	);
</script>

<ToolWrapper
	title="Resize / Scale"
	description="Resize images to specific dimensions while preserving aspect ratio."
>
	<div class="flex flex-col gap-6">
		{#if !originalFile}
			<ImageUploader onImageLoad={handleImageLoad} />
		{:else}
			<!-- Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body gap-6">
					<!-- Original Size Info -->
					<div class="flex items-center gap-2 text-sm text-base-content/60">
						<span>Original:</span>
						<span class="font-mono font-semibold">{originalWidth} × {originalHeight}</span>
						<span>px</span>
					</div>

					<!-- Dimension Inputs -->
					<div class="flex flex-wrap items-center gap-4">
						<div>
							<label class="text-xs text-base-content/60" for="width">Width (px)</label>
							<input
								id="width"
								type="number"
								class="input input-bordered w-28"
								value={width}
								onchange={handleWidthChange}
								min="1"
								max="10000"
							/>
						</div>

						<button
							class="btn btn-square btn-sm mt-5"
							class:btn-primary={lockAspectRatio}
							onclick={() => (lockAspectRatio = !lockAspectRatio)}
							title={lockAspectRatio ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
						>
							{#if lockAspectRatio}
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							{:else}
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
								</svg>
							{/if}
						</button>

						<div>
							<label class="text-xs text-base-content/60" for="height">Height (px)</label>
							<input
								id="height"
								type="number"
								class="input input-bordered w-28"
								value={height}
								onchange={handleHeightChange}
								min="1"
								max="10000"
							/>
						</div>

						<div class="badge badge-ghost font-mono mt-5">{scalePercent}%</div>
					</div>

					<!-- Quick Scale Buttons -->
					<div class="flex flex-wrap gap-2">
						<span class="text-sm text-base-content/60 self-center">Quick resize:</span>
						{#each [0.25, 0.5, 0.75, 1, 1.5, 2] as scale}
							<button
								class="btn btn-sm btn-ghost"
								class:btn-active={scalePercent === scale * 100}
								onclick={() => setScale(scale)}
							>
								{scale * 100}%
							</button>
						{/each}
					</div>

					<!-- Actions -->
					<div class="flex items-center gap-3">
						<button class="btn btn-primary gap-2" onclick={download} disabled={!processedBlob || isProcessing}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download
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
						alt="Resized preview"
						class="mx-auto max-h-96 rounded-2xl bg-base-300 object-contain"
					/>
					<div class="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
						{Math.round(width)} × {Math.round(height)} px
					</div>
				</div>

				<!-- Size comparison -->
				<div class="flex items-center justify-center gap-6 text-sm">
					<div class="text-center">
						<div class="text-base-content/50">Original</div>
						<div class="font-mono font-semibold">{formatFileSize(originalFile.size)}</div>
					</div>
					<svg class="h-5 w-5 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
					<div class="text-center">
						<div class="text-base-content/50">Resized</div>
						<div class="font-mono font-semibold">{formatFileSize(processedBlob?.size || 0)}</div>
					</div>
				</div>
			{/if}
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Features</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Aspect ratio lock</strong>: Maintain proportions while resizing</li>
					<li>• <strong>Quick scale</strong>: Common percentage presets</li>
					<li>• <strong>Pixel preview</strong>: See exact dimensions before download</li>
					<li>• <strong>Client-side</strong>: Your images never leave your device</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
