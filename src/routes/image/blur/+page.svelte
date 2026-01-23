<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadImage, canvasToBlob, downloadBlob, formatFileSize, mimeToExtension } from '$lib/utils/image';

	let originalFile = $state<File | null>(null);
	let originalDataURL = $state('');
	let processedDataURL = $state('');
	let processedBlob = $state<Blob | null>(null);
	let isProcessing = $state(false);

	// Options
	let mode = $state<'blur' | 'pixelate'>('blur');
	let applyMode = $state<'full' | 'patch'>('full');
	let blurIntensity = $state(10);
	let pixelSize = $state(15);

	// Patch data
	interface Patch {
		id: number;
		x: number;
		y: number;
		width: number;
		height: number;
	}
	let patches = $state<Patch[]>([]);
	let nextPatchId = $state(1);
	let selectedPatchId = $state<number | null>(null);

	// Drawing state
	let isDragging = $state(false);
	let dragMode = $state<'new' | 'move' | 'resize' | null>(null);
	let resizeHandle = $state<string | null>(null);
	let dragStart = $state({ x: 0, y: 0 });
	let patchStart = $state({ x: 0, y: 0, w: 0, h: 0 });

	let imageWidth = $state(0);
	let imageHeight = $state(0);
	let canvasScale = $state(1);
	let containerRef: HTMLElement;

	async function handleImageLoad(file: File, dataURL: string) {
		originalFile = file;
		originalDataURL = dataURL;
		patches = [];
		nextPatchId = 1;
		selectedPatchId = null;

		const img = await loadImage(dataURL);
		imageWidth = img.width;
		imageHeight = img.height;

		if (applyMode === 'full') {
			await process();
		} else {
			processedDataURL = dataURL;
		}
	}

	async function process() {
		if (!originalDataURL) return;

		isProcessing = true;
		try {
			const img = await loadImage(originalDataURL);
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d')!;

			if (applyMode === 'full') {
				if (mode === 'blur') {
					ctx.filter = `blur(${blurIntensity}px)`;
					ctx.drawImage(img, 0, 0);
					ctx.filter = 'none';
				} else {
					applyPixelate(ctx, img, 0, 0, img.width, img.height, pixelSize);
				}
			} else {
				// Draw original first
				ctx.drawImage(img, 0, 0);

				// Apply effects to patches
				for (const patch of patches) {
					if (mode === 'blur') {
						// For blur, we need to clip to avoid bleeding outside the patch
						ctx.save();
						ctx.beginPath();
						ctx.rect(patch.x, patch.y, patch.width, patch.height);
						ctx.clip();
						
						// Draw the blurred version of the region with padding for better blur
						const padding = blurIntensity * 2;
						const tempCanvas = document.createElement('canvas');
						tempCanvas.width = patch.width + padding * 2;
						tempCanvas.height = patch.height + padding * 2;
						const tempCtx = tempCanvas.getContext('2d')!;
						
						// Draw source region with padding
						tempCtx.drawImage(
							img, 
							Math.max(0, patch.x - padding), 
							Math.max(0, patch.y - padding), 
							patch.width + padding * 2, 
							patch.height + padding * 2, 
							0, 0, 
							tempCanvas.width, 
							tempCanvas.height
						);
						
						// Apply blur to the temp canvas
						tempCtx.filter = `blur(${blurIntensity}px)`;
						tempCtx.drawImage(tempCanvas, 0, 0);
						tempCtx.filter = 'none';
						
						// Draw back to main canvas (clipped)
						ctx.drawImage(
							tempCanvas, 
							padding, padding, 
							patch.width, patch.height,
							patch.x, patch.y, 
							patch.width, patch.height
						);
						ctx.restore();
					} else {
						applyPixelate(ctx, img, patch.x, patch.y, patch.width, patch.height, pixelSize);
					}
				}
			}

			const mime = originalFile?.type || 'image/png';
			processedBlob = await canvasToBlob(canvas, mime, 0.92);
			processedDataURL = canvas.toDataURL(mime);
		} catch (err) {
			console.error('Processing failed:', err);
		} finally {
			isProcessing = false;
		}
	}

	function applyPixelate(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, size: number) {
		const tempCanvas = document.createElement('canvas');
		const scaledW = Math.max(1, Math.ceil(w / size));
		const scaledH = Math.max(1, Math.ceil(h / size));
		tempCanvas.width = scaledW;
		tempCanvas.height = scaledH;
		const tempCtx = tempCanvas.getContext('2d')!;

		tempCtx.drawImage(img, x, y, w, h, 0, 0, scaledW, scaledH);

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(tempCanvas, 0, 0, scaledW, scaledH, x, y, w, h);
		ctx.imageSmoothingEnabled = true;
	}

	function handleSliderChange() {
		// Re-process with new intensity (applies to all patches)
		if (originalDataURL) {
			process();
		}
	}

	function getMousePos(e: MouseEvent): { x: number; y: number } {
		if (!containerRef) return { x: 0, y: 0 };
		const rect = containerRef.getBoundingClientRect();
		return {
			x: Math.max(0, Math.min(imageWidth, (e.clientX - rect.left) / canvasScale)),
			y: Math.max(0, Math.min(imageHeight, (e.clientY - rect.top) / canvasScale))
		};
	}

	function findPatchAt(x: number, y: number): Patch | null {
		for (let i = patches.length - 1; i >= 0; i--) {
			const p = patches[i];
			if (x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height) {
				return p;
			}
		}
		return null;
	}

	function getHandleAtPosition(patch: Patch, x: number, y: number): string | null {
		const handleSize = 15 / canvasScale;
		const corners = [
			{ name: 'nw', x: patch.x, y: patch.y },
			{ name: 'ne', x: patch.x + patch.width, y: patch.y },
			{ name: 'sw', x: patch.x, y: patch.y + patch.height },
			{ name: 'se', x: patch.x + patch.width, y: patch.y + patch.height }
		];

		for (const corner of corners) {
			if (Math.abs(x - corner.x) < handleSize && Math.abs(y - corner.y) < handleSize) {
				return corner.name;
			}
		}
		return null;
	}

	function handleMouseDown(e: MouseEvent) {
		if (applyMode !== 'patch') return;

		const pos = getMousePos(e);

		// Check if clicking on a resize handle of selected patch
		if (selectedPatchId !== null) {
			const selectedPatch = patches.find(p => p.id === selectedPatchId);
			if (selectedPatch) {
				const handle = getHandleAtPosition(selectedPatch, pos.x, pos.y);
				if (handle) {
					isDragging = true;
					dragMode = 'resize';
					resizeHandle = handle;
					dragStart = pos;
					patchStart = { x: selectedPatch.x, y: selectedPatch.y, w: selectedPatch.width, h: selectedPatch.height };
					return;
				}
			}
		}

		// Check if clicking inside an existing patch
		const clickedPatch = findPatchAt(pos.x, pos.y);
		if (clickedPatch) {
			selectedPatchId = clickedPatch.id;
			isDragging = true;
			dragMode = 'move';
			dragStart = pos;
			patchStart = { x: clickedPatch.x, y: clickedPatch.y, w: clickedPatch.width, h: clickedPatch.height };
			return;
		}

		// Start new patch
		selectedPatchId = null;
		isDragging = true;
		dragMode = 'new';
		dragStart = pos;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || applyMode !== 'patch') return;

		const pos = getMousePos(e);

		if (dragMode === 'new') {
			// Creating new patch - show preview but don't add to patches yet
		} else if (dragMode === 'move' && selectedPatchId !== null) {
			const patch = patches.find(p => p.id === selectedPatchId);
			if (patch) {
				const dx = pos.x - dragStart.x;
				const dy = pos.y - dragStart.y;
				patch.x = Math.max(0, Math.min(imageWidth - patch.width, patchStart.x + dx));
				patch.y = Math.max(0, Math.min(imageHeight - patch.height, patchStart.y + dy));
				patches = [...patches]; // Trigger reactivity
			}
		} else if (dragMode === 'resize' && selectedPatchId !== null) {
			const patch = patches.find(p => p.id === selectedPatchId);
			if (patch) {
				let newX = patchStart.x;
				let newY = patchStart.y;
				let newW = patchStart.w;
				let newH = patchStart.h;

				switch (resizeHandle) {
					case 'se':
						newW = pos.x - patchStart.x;
						newH = pos.y - patchStart.y;
						break;
					case 'sw':
						newX = pos.x;
						newW = patchStart.x + patchStart.w - pos.x;
						newH = pos.y - patchStart.y;
						break;
					case 'ne':
						newW = pos.x - patchStart.x;
						newY = pos.y;
						newH = patchStart.y + patchStart.h - pos.y;
						break;
					case 'nw':
						newX = pos.x;
						newY = pos.y;
						newW = patchStart.x + patchStart.w - pos.x;
						newH = patchStart.y + patchStart.h - pos.y;
						break;
				}

				if (newW >= 20 && newH >= 20) {
					patch.x = Math.max(0, newX);
					patch.y = Math.max(0, newY);
					patch.width = Math.min(newW, imageWidth - patch.x);
					patch.height = Math.min(newH, imageHeight - patch.y);
					patches = [...patches];
				}
			}
		}
	}

	function handleMouseUp(e: MouseEvent) {
		if (!isDragging) return;

		const pos = getMousePos(e);

		if (dragMode === 'new') {
			const x = Math.min(dragStart.x, pos.x);
			const y = Math.min(dragStart.y, pos.y);
			const width = Math.abs(pos.x - dragStart.x);
			const height = Math.abs(pos.y - dragStart.y);

			if (width > 15 && height > 15) {
				const newPatch: Patch = { id: nextPatchId++, x, y, width, height };
				patches = [...patches, newPatch];
				selectedPatchId = newPatch.id;
			}
		}

		isDragging = false;
		dragMode = null;
		resizeHandle = null;

		// Re-process after any patch change
		if (patches.length > 0) {
			process();
		}
	}

	function deletePatch(id: number) {
		patches = patches.filter(p => p.id !== id);
		if (selectedPatchId === id) selectedPatchId = null;
		process();
	}

	function clearPatches() {
		patches = [];
		selectedPatchId = null;
		processedDataURL = originalDataURL;
		processedBlob = null;
	}

	function download() {
		if (!processedBlob || !originalFile) return;
		const ext = mimeToExtension(originalFile.type);
		const name = originalFile.name.replace(/\.[^/.]+$/, '');
		const suffix = mode === 'blur' ? 'blurred' : 'pixelated';
		downloadBlob(processedBlob, `${name}-${suffix}.${ext}`);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		processedDataURL = '';
		processedBlob = null;
		patches = [];
		selectedPatchId = null;
	}

	function switchApplyMode(newMode: 'full' | 'patch') {
		applyMode = newMode;
		if (newMode === 'full') {
			patches = [];
			selectedPatchId = null;
			process();
		} else {
			processedDataURL = originalDataURL;
			processedBlob = null;
		}
	}

	async function loadSample() {
		const res = await fetch('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80');
		const blob = await res.blob();
		const file = new File([blob], 'landscape.jpg', { type: 'image/jpeg' });
		const reader = new FileReader();
		reader.onload = (e) => handleImageLoad(file, e.target?.result as string);
		reader.readAsDataURL(file);
	}

	function updateCanvasScale() {
		if (containerRef && imageWidth > 0) {
			canvasScale = Math.min(1, containerRef.clientWidth / imageWidth);
		}
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
				<div class="card-body gap-4">
					<!-- Apply Mode Toggle -->
					<div class="flex gap-2">
						<button
							class="btn flex-1"
							class:btn-primary={applyMode === 'full'}
							class:btn-ghost={applyMode !== 'full'}
							onclick={() => switchApplyMode('full')}
						>
							Entire Image
						</button>
						<button
							class="btn flex-1"
							class:btn-primary={applyMode === 'patch'}
							class:btn-ghost={applyMode !== 'patch'}
							onclick={() => switchApplyMode('patch')}
						>
							Draw Patches
						</button>
					</div>

					<!-- Effect Mode Toggle -->
					<div class="flex gap-2">
						<button
							class="btn btn-sm flex-1"
							class:btn-secondary={mode === 'blur'}
							class:btn-ghost={mode !== 'blur'}
							onclick={() => { mode = 'blur'; if (applyMode === 'full' || patches.length > 0) process(); }}
						>
							Blur
						</button>
						<button
							class="btn btn-sm flex-1"
							class:btn-secondary={mode === 'pixelate'}
							class:btn-ghost={mode !== 'pixelate'}
							onclick={() => { mode = 'pixelate'; if (applyMode === 'full' || patches.length > 0) process(); }}
						>
							Pixelate
						</button>
					</div>

					<!-- Intensity Sliders -->
					{#if mode === 'blur'}
						<div>
							<div class="flex items-center justify-between mb-2">
								<label class="text-sm font-medium" for="blur">Blur Intensity</label>
								<span class="badge badge-ghost font-mono">{blurIntensity}px</span>
							</div>
							<input
								id="blur"
								type="range"
								min="2"
								max="50"
								bind:value={blurIntensity}
								onchange={handleSliderChange}
								class="range range-primary"
							/>
						</div>
					{:else}
						<div>
							<div class="flex items-center justify-between mb-2">
								<label class="text-sm font-medium" for="pixel">Pixel Size</label>
								<span class="badge badge-ghost font-mono">{pixelSize}px</span>
							</div>
							<input
								id="pixel"
								type="range"
								min="5"
								max="50"
								bind:value={pixelSize}
								onchange={handleSliderChange}
								class="range range-primary"
							/>
						</div>
					{/if}

					<!-- Patch mode info -->
					{#if applyMode === 'patch'}
						<div class="alert py-2 text-sm rounded-xl bg-base-300">
							<div class="flex flex-col gap-1">
								<span class="font-medium">📌 Patch Mode</span>
								<span class="text-base-content/70">Draw rectangles → Click inside to move → Drag corners to resize</span>
								{#if patches.length > 0}
									<span class="text-base-content/60">Adjusting intensity will update all {patches.length} patch(es)</span>
								{/if}
							</div>
						</div>
						{#if patches.length > 0}
							<div class="flex items-center gap-2">
								<button class="btn btn-sm btn-ghost" onclick={clearPatches}>
									Clear All ({patches.length})
								</button>
								{#if selectedPatchId !== null}
									<button class="btn btn-sm btn-error btn-ghost" onclick={() => deletePatch(selectedPatchId!)}>
										Delete Selected
									</button>
								{/if}
							</div>
						{/if}
					{/if}

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
				{#if applyMode === 'patch'}
					<!-- Patch mode: interactive canvas -->
					<div class="relative">
						<div
							bind:this={containerRef}
							class="relative inline-block overflow-hidden rounded-2xl bg-base-300 cursor-crosshair"
							role="application"
							aria-label="Patch drawing area"
							onmousedown={handleMouseDown}
							onmousemove={handleMouseMove}
							onmouseup={handleMouseUp}
							onmouseleave={handleMouseUp}
						>
							<img
								src={processedDataURL}
								alt="Preview"
								class="block max-w-full select-none"
								draggable="false"
								onload={updateCanvasScale}
							/>

							<!-- Patch overlays -->
							{#each patches as patch}
								<div
									class="absolute border-2 transition-colors {selectedPatchId === patch.id ? 'border-primary bg-primary/20' : 'border-white'}"
									style="left: {patch.x * canvasScale}px; top: {patch.y * canvasScale}px; width: {patch.width * canvasScale}px; height: {patch.height * canvasScale}px;"
								>
									{#if selectedPatchId === patch.id}
										<div class="absolute -top-1.5 -left-1.5 h-3 w-3 bg-white rounded-sm cursor-nw-resize border border-primary"></div>
										<div class="absolute -top-1.5 -right-1.5 h-3 w-3 bg-white rounded-sm cursor-ne-resize border border-primary"></div>
										<div class="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-white rounded-sm cursor-sw-resize border border-primary"></div>
										<div class="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-white rounded-sm cursor-se-resize border border-primary"></div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<!-- Full mode: side by side -->
					<div class="grid gap-4 md:grid-cols-2">
						<div class="relative">
							<img src={originalDataURL} alt="Original" class="w-full rounded-2xl bg-base-300 object-contain" />
							<div class="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">Original</div>
						</div>
						<div class="relative">
							<img src={processedDataURL} alt="Processed" class="w-full rounded-2xl bg-base-300 object-contain" />
							<div class="absolute top-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">{mode === 'blur' ? 'Blurred' : 'Pixelated'}</div>
						</div>
					</div>
				{/if}

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
						<div class="text-base-content/50">Processed</div>
						<div class="font-mono font-semibold">{formatFileSize(processedBlob?.size || 0)}</div>
					</div>
				</div>
			{/if}
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Use Cases</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Privacy</strong>: Blur faces, license plates, or sensitive info</li>
					<li>• <strong>Move & resize</strong>: Click patches to move, drag corners to resize</li>
					<li>• <strong>Live updates</strong>: Intensity changes update all patches instantly</li>
					<li>• <strong>Client-side</strong>: Your images never leave your device</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
