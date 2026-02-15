<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadImage, canvasToBlob, downloadBlob, formatFileSize, mimeToExtension } from '$lib/utils/image';
	import { imageToolsContent } from '$lib/config/content/image-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = imageToolsContent['crop'];

	let originalFile = $state<File | null>(null);
	let originalDataURL = $state('');
	let processedDataURL = $state('');
	let processedBlob = $state<Blob | null>(null);

	// Image dimensions
	let imageWidth = $state(0);
	let imageHeight = $state(0);

	// Crop area
	let cropX = $state(0);
	let cropY = $state(0);
	let cropWidth = $state(0);
	let cropHeight = $state(0);

	// UI state
	let dragMode = $state<'new' | 'move' | 'resize' | null>(null);
	let resizeHandle = $state<string | null>(null);
	let dragStart = $state({ x: 0, y: 0 });
	let cropStart = $state({ x: 0, y: 0, w: 0, h: 0 });
	let previewScale = $state(1);
	let containerRef: HTMLDivElement;

	// Preset ratios
	const ratios = [
		{ name: 'Free', value: null },
		{ name: '1:1', value: 1 },
		{ name: '16:9', value: 16 / 9 },
		{ name: '4:3', value: 4 / 3 },
		{ name: '3:2', value: 3 / 2 },
		{ name: '9:16', value: 9 / 16 }
	];
	let selectedRatio = $state<number | null>(null);

	async function handleImageLoad(file: File, dataURL: string) {
		originalFile = file;
		originalDataURL = dataURL;

		const img = await loadImage(dataURL);
		imageWidth = img.width;
		imageHeight = img.height;

		// Initialize crop to full image
		cropX = 0;
		cropY = 0;
		cropWidth = img.width;
		cropHeight = img.height;

		await updatePreviewScale();
		await applyCrop();
	}

	async function updatePreviewScale() {
		if (!containerRef) return;
		const containerWidth = containerRef.clientWidth;
		previewScale = Math.min(1, containerWidth / imageWidth);
	}

	function getMousePos(e: MouseEvent): { x: number; y: number } {
		if (!containerRef) return { x: 0, y: 0 };
		const rect = containerRef.getBoundingClientRect();
		return {
			x: (e.clientX - rect.left) / previewScale,
			y: (e.clientY - rect.top) / previewScale
		};
	}

	function isInsideCrop(x: number, y: number): boolean {
		return x >= cropX && x <= cropX + cropWidth && y >= cropY && y <= cropY + cropHeight;
	}

	function getHandleAtPosition(x: number, y: number): string | null {
		const handleSize = 20 / previewScale;
		const corners = [
			{ name: 'nw', x: cropX, y: cropY },
			{ name: 'ne', x: cropX + cropWidth, y: cropY },
			{ name: 'sw', x: cropX, y: cropY + cropHeight },
			{ name: 'se', x: cropX + cropWidth, y: cropY + cropHeight }
		];

		for (const corner of corners) {
			if (Math.abs(x - corner.x) < handleSize && Math.abs(y - corner.y) < handleSize) {
				return corner.name;
			}
		}
		return null;
	}

	function handleMouseDown(e: MouseEvent) {
		const pos = getMousePos(e);

		// Check resize handles first
		const handle = getHandleAtPosition(pos.x, pos.y);
		if (handle) {
			dragMode = 'resize';
			resizeHandle = handle;
			dragStart = pos;
			cropStart = { x: cropX, y: cropY, w: cropWidth, h: cropHeight };
			return;
		}

		// Check if clicking inside existing crop area -> move
		if (isInsideCrop(pos.x, pos.y)) {
			dragMode = 'move';
			dragStart = pos;
			cropStart = { x: cropX, y: cropY, w: cropWidth, h: cropHeight };
			return;
		}

		// Otherwise start new selection
		dragMode = 'new';
		dragStart = pos;
		cropX = pos.x;
		cropY = pos.y;
		cropWidth = 0;
		cropHeight = 0;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!dragMode) return;

		const pos = getMousePos(e);
		pos.x = Math.max(0, Math.min(imageWidth, pos.x));
		pos.y = Math.max(0, Math.min(imageHeight, pos.y));

		if (dragMode === 'move') {
			const dx = pos.x - dragStart.x;
			const dy = pos.y - dragStart.y;

			cropX = Math.max(0, Math.min(imageWidth - cropStart.w, cropStart.x + dx));
			cropY = Math.max(0, Math.min(imageHeight - cropStart.h, cropStart.y + dy));
		} else if (dragMode === 'resize') {
			handleResize(pos.x, pos.y);
		} else if (dragMode === 'new') {
			handleNewSelection(pos.x, pos.y);
		}
	}

	function handleResize(currentX: number, currentY: number) {
		let newX = cropStart.x;
		let newY = cropStart.y;
		let newWidth = cropStart.w;
		let newHeight = cropStart.h;

		switch (resizeHandle) {
			case 'nw':
				newWidth = cropStart.x + cropStart.w - currentX;
				newHeight = cropStart.y + cropStart.h - currentY;
				newX = currentX;
				newY = currentY;
				break;
			case 'ne':
				newWidth = currentX - cropStart.x;
				newHeight = cropStart.y + cropStart.h - currentY;
				newY = currentY;
				break;
			case 'sw':
				newWidth = cropStart.x + cropStart.w - currentX;
				newHeight = currentY - cropStart.y;
				newX = currentX;
				break;
			case 'se':
				newWidth = currentX - cropStart.x;
				newHeight = currentY - cropStart.y;
				break;
		}

		// Apply aspect ratio constraint
		if (selectedRatio !== null && newWidth > 0 && newHeight > 0) {
			if (newWidth / newHeight > selectedRatio) {
				newWidth = newHeight * selectedRatio;
			} else {
				newHeight = newWidth / selectedRatio;
			}
		}

		if (newWidth >= 20 && newHeight >= 20) {
			cropX = Math.max(0, newX);
			cropY = Math.max(0, newY);
			cropWidth = Math.min(newWidth, imageWidth - cropX);
			cropHeight = Math.min(newHeight, imageHeight - cropY);
		}
	}

	function handleNewSelection(currentX: number, currentY: number) {
		let newWidth = currentX - dragStart.x;
		let newHeight = currentY - dragStart.y;

		if (newWidth < 0) {
			cropX = currentX;
			newWidth = Math.abs(newWidth);
		} else {
			cropX = dragStart.x;
		}

		if (newHeight < 0) {
			cropY = currentY;
			newHeight = Math.abs(newHeight);
		} else {
			cropY = dragStart.y;
		}

		if (selectedRatio !== null) {
			if (newWidth / newHeight > selectedRatio) {
				newWidth = newHeight * selectedRatio;
			} else {
				newHeight = newWidth / selectedRatio;
			}
		}

		cropWidth = Math.min(newWidth, imageWidth - cropX);
		cropHeight = Math.min(newHeight, imageHeight - cropY);
	}

	function handleMouseUp() {
		if (dragMode) {
			dragMode = null;
			resizeHandle = null;
			if (cropWidth > 10 && cropHeight > 10) {
				applyCrop();
			}
		}
	}

	async function applyCrop() {
		if (cropWidth < 10 || cropHeight < 10) return;

		try {
			const img = await loadImage(originalDataURL);
			const canvas = document.createElement('canvas');
			canvas.width = Math.round(cropWidth);
			canvas.height = Math.round(cropHeight);
			const ctx = canvas.getContext('2d')!;

			ctx.drawImage(
				img,
				Math.round(cropX),
				Math.round(cropY),
				Math.round(cropWidth),
				Math.round(cropHeight),
				0,
				0,
				Math.round(cropWidth),
				Math.round(cropHeight)
			);

			const mime = originalFile?.type || 'image/png';
			processedBlob = await canvasToBlob(canvas, mime, 0.92);
			processedDataURL = canvas.toDataURL(mime);
		} catch (err) {
			console.error('Crop failed:', err);
		}
	}

	function selectRatio(ratio: number | null) {
		selectedRatio = ratio;
		if (ratio !== null && cropWidth > 0 && cropHeight > 0) {
			const currentRatio = cropWidth / cropHeight;
			if (currentRatio > ratio) {
				cropWidth = cropHeight * ratio;
			} else {
				cropHeight = cropWidth / ratio;
			}
			cropX = Math.max(0, Math.min(cropX, imageWidth - cropWidth));
			cropY = Math.max(0, Math.min(cropY, imageHeight - cropHeight));
			applyCrop();
		}
	}

	function download() {
		if (!processedBlob || !originalFile) return;
		const ext = mimeToExtension(originalFile.type);
		const name = originalFile.name.replace(/\.[^/.]+$/, '');
		downloadBlob(processedBlob, `${name}-cropped.${ext}`);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		processedDataURL = '';
		processedBlob = null;
		cropX = 0;
		cropY = 0;
		cropWidth = 0;
		cropHeight = 0;
	}

	// Cursor style based on position
	let cursorStyle = $derived.by(() => {
		if (dragMode === 'move') return 'grabbing';
		if (dragMode === 'resize') {
			if (resizeHandle === 'nw' || resizeHandle === 'se') return 'nwse-resize';
			return 'nesw-resize';
		}
		return 'crosshair';
	});

	async function loadSample() {
		const res = await fetch('https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80');
		const blob = await res.blob();
		const file = new File([blob], 'abstract.jpg', { type: 'image/jpeg' });
		const reader = new FileReader();
		reader.onload = (e) => handleImageLoad(file, e.target?.result as string);
		reader.readAsDataURL(file);
	}
</script>

<svelte:window onresize={updatePreviewScale} />

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !originalFile}
			<ImageUploader onImageLoad={handleImageLoad} />
		{:else}
			<!-- Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body gap-4">
					<!-- Ratio Presets -->
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-sm text-base-content/60">Aspect ratio:</span>
						{#each ratios as ratio}
							<button
								class="btn btn-sm"
								class:btn-primary={selectedRatio === ratio.value}
								class:btn-ghost={selectedRatio !== ratio.value}
								onclick={() => selectRatio(ratio.value)}
							>
								{ratio.name}
							</button>
						{/each}
					</div>

					<!-- Crop Info -->
					{#if cropWidth > 0 && cropHeight > 0}
						<div class="flex gap-4 text-sm text-base-content/60">
							<span>Selection: <span class="font-mono font-semibold">{Math.round(cropWidth)} × {Math.round(cropHeight)}</span> px</span>
							<span class="text-base-content/40">|</span>
							<span>Click inside to move • Drag corners to resize</span>
						</div>
					{/if}

					<!-- Actions -->
					<div class="flex flex-wrap items-center gap-3">
						<button class="btn btn-primary gap-2" onclick={download} disabled={!processedBlob}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							Download Cropped
						</button>
						<button class="btn btn-ghost" onclick={reset}>
							Upload New
						</button>
					</div>
				</div>
			</div>

			<!-- Crop Canvas -->
			<div class="relative">
				<div
					bind:this={containerRef}
					class="relative inline-block overflow-hidden rounded-2xl bg-base-300"
					style="cursor: {cursorStyle}"
					role="application"
					aria-label="Crop area selector"
					onmousedown={handleMouseDown}
					onmousemove={handleMouseMove}
					onmouseup={handleMouseUp}
					onmouseleave={handleMouseUp}
				>
					<img
						src={originalDataURL}
						alt="Original"
						class="block max-w-full select-none"
						draggable="false"
					/>

					<!-- Darkened overlay -->
					<div class="pointer-events-none absolute inset-0 bg-black/50"></div>

					<!-- Crop selection -->
					{#if cropWidth > 0 && cropHeight > 0}
						<div
							class="absolute border-2 border-white"
							style="
								left: {cropX * previewScale}px;
								top: {cropY * previewScale}px;
								width: {cropWidth * previewScale}px;
								height: {cropHeight * previewScale}px;
								box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
								cursor: {dragMode === 'move' ? 'grabbing' : 'grab'};
							"
						>
							<!-- Corner handles -->
							<div class="absolute -top-2 -left-2 h-4 w-4 bg-white rounded-sm cursor-nw-resize shadow-lg"></div>
							<div class="absolute -top-2 -right-2 h-4 w-4 bg-white rounded-sm cursor-ne-resize shadow-lg"></div>
							<div class="absolute -bottom-2 -left-2 h-4 w-4 bg-white rounded-sm cursor-sw-resize shadow-lg"></div>
							<div class="absolute -bottom-2 -right-2 h-4 w-4 bg-white rounded-sm cursor-se-resize shadow-lg"></div>

							<!-- Grid lines (rule of thirds) -->
							<div class="absolute inset-0 pointer-events-none">
								<div class="absolute top-1/3 left-0 right-0 border-t border-white/40"></div>
								<div class="absolute top-2/3 left-0 right-0 border-t border-white/40"></div>
								<div class="absolute left-1/3 top-0 bottom-0 border-l border-white/40"></div>
								<div class="absolute left-2/3 top-0 bottom-0 border-l border-white/40"></div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Preview -->
			{#if processedDataURL}
				<div>
					<p class="mb-2 text-sm font-medium">Cropped Preview:</p>
					<div class="relative inline-block">
						<img
							src={processedDataURL}
							alt="Cropped preview"
							class="max-h-64 rounded-2xl bg-base-300 object-contain transition-all duration-300"
						/>
					</div>
					<div class="mt-2 text-sm text-base-content/60">
						Size: <span class="font-mono">{formatFileSize(processedBlob?.size || 0)}</span>
					</div>
				</div>
			{/if}
		{/if}

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
