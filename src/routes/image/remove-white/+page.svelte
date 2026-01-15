<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadImageAsCanvas, canvasToBlob, downloadBlob, formatFileSize } from '$lib/utils/image';

	let originalFile = $state<File | null>(null);
	let originalDataURL = $state('');
	let processedDataURL = $state('');
	let processedBlob = $state<Blob | null>(null);
	let isProcessing = $state(false);

	// Options
	let tolerance = $state(30);
	let featherEdges = $state(true);
	let featherRadius = $state(2);

	async function handleImageLoad(file: File, dataURL: string) {
		originalFile = file;
		originalDataURL = dataURL;
		await process();
	}

	async function process() {
		if (!originalDataURL) return;

		isProcessing = true;
		try {
			const canvas = await loadImageAsCanvas(originalDataURL);
			const ctx = canvas.getContext('2d')!;
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;
			const width = canvas.width;
			const height = canvas.height;

			// First pass: identify white pixels
			const threshold = 255 - tolerance;
			const alphaMap = new Float32Array(width * height);

			for (let i = 0; i < data.length; i += 4) {
				const r = data[i];
				const g = data[i + 1];
				const b = data[i + 2];
				const pixelIndex = i / 4;

				// Calculate how "white" this pixel is (0 = pure white, 1 = not white at all)
				const minChannel = Math.min(r, g, b);
				const whiteness = (r + g + b) / 3;

				if (r >= threshold && g >= threshold && b >= threshold) {
					// Pure white - fully transparent based on how close to pure white
					const distFromPureWhite = (255 - whiteness) / tolerance;
					alphaMap[pixelIndex] = Math.min(1, distFromPureWhite);
				} else if (whiteness > 200 - tolerance && minChannel > 180 - tolerance) {
					// Near-white with smooth falloff
					const distFromThreshold = (255 - whiteness) / (55 + tolerance);
					alphaMap[pixelIndex] = Math.min(1, distFromThreshold);
				} else {
					alphaMap[pixelIndex] = 1;
				}
			}

			// Second pass: feather edges for antialiasing
			if (featherEdges && featherRadius > 0) {
				const feathered = new Float32Array(alphaMap);

				for (let y = 0; y < height; y++) {
					for (let x = 0; x < width; x++) {
						const idx = y * width + x;
						const currentAlpha = alphaMap[idx];

						// Only process edge pixels (0 < alpha < 1 or neighbors with different alpha)
						if (currentAlpha > 0 && currentAlpha < 1) {
							let sum = 0;
							let count = 0;

							for (let dy = -featherRadius; dy <= featherRadius; dy++) {
								for (let dx = -featherRadius; dx <= featherRadius; dx++) {
									const nx = x + dx;
									const ny = y + dy;
									if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
										const nidx = ny * width + nx;
										const weight = 1 - Math.sqrt(dx * dx + dy * dy) / (featherRadius * 1.5);
										if (weight > 0) {
											sum += alphaMap[nidx] * weight;
											count += weight;
										}
									}
								}
							}

							feathered[idx] = count > 0 ? sum / count : currentAlpha;
						}
					}
				}

				// Apply feathered alpha
				for (let i = 0; i < data.length; i += 4) {
					const pixelIndex = i / 4;
					data[i + 3] = Math.round(feathered[pixelIndex] * 255);
				}
			} else {
				// Apply alpha directly
				for (let i = 0; i < data.length; i += 4) {
					const pixelIndex = i / 4;
					data[i + 3] = Math.round(alphaMap[pixelIndex] * 255);
				}
			}

			ctx.putImageData(imageData, 0, 0);

			// Output as PNG
			processedBlob = await canvasToBlob(canvas, 'image/png', 1);
			processedDataURL = canvas.toDataURL('image/png');
		} catch (err) {
			console.error('Processing failed:', err);
		} finally {
			isProcessing = false;
		}
	}

	function handleSliderChange() {
		if (originalDataURL) {
			process();
		}
	}

	function download() {
		if (!processedBlob || !originalFile) return;
		const name = originalFile.name.replace(/\.[^/.]+$/, '');
		downloadBlob(processedBlob, `${name}-no-bg.png`);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		processedDataURL = '';
		processedBlob = null;
	}

	async function loadSample() {
		const res = await fetch('https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=800&q=80');
		const blob = await res.blob();
		const file = new File([blob], 'icon-white-bg.jpg', { type: 'image/jpeg' });
		const reader = new FileReader();
		reader.onload = (e) => handleImageLoad(file, e.target?.result as string);
		reader.readAsDataURL(file);
	}
</script>

<ToolWrapper
	title="Remove White Background"
	description="Make white and near-white pixels transparent with smooth edges. Perfect for logos and icons."
>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !originalFile}
			<ImageUploader onImageLoad={handleImageLoad} />
		{:else}
			<!-- Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body gap-5">
					<!-- Tolerance Slider -->
					<div>
						<div class="flex items-center justify-between mb-2">
							<label class="text-sm font-medium" for="tolerance">Color Tolerance</label>
							<span class="badge badge-ghost font-mono">{tolerance}</span>
						</div>
						<input
							id="tolerance"
							type="range"
							min="5"
							max="80"
							bind:value={tolerance}
							onchange={handleSliderChange}
							class="range range-primary"
						/>
						<div class="flex justify-between text-xs text-base-content/50 mt-1">
							<span>Pure white only</span>
							<span>Near-white included</span>
						</div>
					</div>

					<!-- Edge smoothing -->
					<div class="flex flex-col gap-3">
						<label class="label cursor-pointer justify-start gap-2">
							<input
								type="checkbox"
								class="checkbox checkbox-sm"
								bind:checked={featherEdges}
								onchange={handleSliderChange}
							/>
							<span class="label-text">Smooth edges (anti-aliasing)</span>
						</label>

						{#if featherEdges}
							<div class="ml-6">
								<div class="flex items-center justify-between mb-2">
									<label class="text-sm" for="feather">Edge softness</label>
									<span class="badge badge-ghost badge-sm font-mono">{featherRadius}px</span>
								</div>
								<input
									id="feather"
									type="range"
									min="1"
									max="5"
									bind:value={featherRadius}
									onchange={handleSliderChange}
									class="range range-sm range-primary"
								/>
							</div>
						{/if}
					</div>

					<!-- Actions -->
					<div class="flex items-center gap-3">
						<button class="btn btn-primary gap-2" onclick={download} disabled={!processedBlob || isProcessing}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download PNG
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
				<div class="grid gap-4 md:grid-cols-2">
					<div class="relative">
						<img src={originalDataURL} alt="Original" class="w-full rounded-2xl bg-base-300 object-contain transition-opacity duration-300" />
						<div class="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
							Original
						</div>
					</div>
					<div class="relative">
						<!-- Checkerboard background to show transparency -->
						<div
							class="absolute inset-0 rounded-2xl overflow-hidden"
							style="background: repeating-conic-gradient(#d0d0d0 0% 25%, #f0f0f0 0% 50%) 50% / 16px 16px"
						></div>
						<img src={processedDataURL} alt="Processed" class="relative w-full rounded-2xl object-contain transition-opacity duration-300" />
						<div class="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
							Transparent
						</div>
					</div>
				</div>

				<!-- Size info -->
				<div class="flex items-center justify-center gap-6 text-sm">
					<div class="text-center">
						<div class="text-base-content/50">Original</div>
						<div class="font-mono font-semibold">{formatFileSize(originalFile.size)}</div>
					</div>
					<svg class="h-5 w-5 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
					<div class="text-center">
						<div class="text-base-content/50">Processed</div>
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
					<li>• <strong>Smart detection</strong>: Gradual transparency for near-white colors</li>
					<li>• <strong>Smooth edges</strong>: Anti-aliasing to prevent rough/jagged edges</li>
					<li>• <strong>PNG output</strong>: Transparent background preserved</li>
					<li>• <strong>Client-side</strong>: Your images never leave your device</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
