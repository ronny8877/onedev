<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { imagesToPdfWithPlacement, pdfToBlob, renderPdfToDataUrl, downloadBlob, formatBytes } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = pdfToolsContent['images-to-pdf'];

	type ImageEntry = { file: File; url: string; x: number; y: number; width: number; height: number; rotate: number; naturalW: number; naturalH: number };

	let images = $state<ImageEntry[]>([]);
	let selectedIdx = $state(-1);
	let pageSize = $state('A4');
	let orientation = $state<'portrait' | 'landscape'>('portrait');
	let resultBlob = $state<Blob | null>(null);
	let previewDataURL = $state('');
	let showPreview = $state(false);
	let isProcessing = $state(false);

	let pageW = $derived(orientation === 'landscape' ? (pageSize === 'A4' ? 842 : 792) : (pageSize === 'A4' ? 595 : 612));
	let pageH = $derived(orientation === 'landscape' ? (pageSize === 'A4' ? 595 : 612) : (pageSize === 'A4' ? 842 : 792));

	let previewScale = $derived(500 / pageW);
	let previewW = $derived(pageW * previewScale);
	let previewH = $derived(pageH * previewScale);

	async function handleFiles(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files) return;
		for (const f of Array.from(input.files).filter(f => f.type.startsWith('image/'))) {
			const url = URL.createObjectURL(f);
			const dims = await getImageDims(url);
			const aspectRatio = dims.w / dims.h;
			const maxW = previewW * 0.7;
			const maxH = previewH * 0.7;
			let pw: number, ph: number;
			if (dims.w > dims.h) { pw = maxW; ph = pw / aspectRatio; } else { ph = maxH; pw = ph * aspectRatio; }
			if (ph > maxH) { ph = maxH; pw = ph * aspectRatio; }
			images = [...images, {
				file: f, url,
				x: (previewW - pw) / 2, y: (previewH - ph) / 2,
				width: pw, height: ph,
				rotate: 0,
				naturalW: dims.w, naturalH: dims.h,
			}];
			selectedIdx = images.length - 1;
		}
		input.value = '';
		resultBlob = null;
	}

	function getImageDims(url: string): Promise<{ w: number; h: number }> {
		return new Promise(resolve => { const img = new Image(); img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight }); img.src = url; });
	}

	function remove(i: number) {
		images = images.filter((_, idx) => idx !== i);
		if (selectedIdx >= images.length) selectedIdx = Math.max(0, images.length - 1);
		if (images.length === 0) selectedIdx = -1;
		resultBlob = null;
	}

	function moveUp(i: number) { if (i > 0) { images = images.map((img, idx) => idx === i ? images[i - 1] : idx === i - 1 ? images[i] : img); selectedIdx = i - 1; resultBlob = null; } }
	function moveDown(i: number) { if (i < images.length - 1) { images = images.map((img, idx) => idx === i ? images[i + 1] : idx === i + 1 ? images[i] : img); selectedIdx = i + 1; resultBlob = null; } }

	function updateSelected(prop: keyof ImageEntry, value: number) {
		if (selectedIdx < 0 || selectedIdx >= images.length) return;
		images = images.map((img, i) => i === selectedIdx ? { ...img, [prop]: value } : img);
		resultBlob = null;
	}

	// Dragging — supports drag, resize, and rotate
	let dragMode = $state<'move' | 'resize' | 'rotate' | null>(null);
	let dragStartX = 0;
	let dragStartY = 0;
	let imgStartX = 0;
	let imgStartY = 0;
	let imgStartW = 0;
	let imgStartH = 0;
	let imgStartRot = 0;
	let aspectRatio = 0;
	let previewContainer: HTMLDivElement;

	function onImageMouseDown(e: MouseEvent, idx: number, mode: 'move' | 'resize' | 'rotate') {
		selectedIdx = idx;
		dragMode = mode;
		dragStartX = e.clientX;
		dragStartY = e.clientY;
		const img = images[idx];
		imgStartX = img.x;
		imgStartY = img.y;
		imgStartW = img.width;
		imgStartH = img.height;
		imgStartRot = img.rotate;
		aspectRatio = imgStartH > 0 ? imgStartW / imgStartH : 1;
		e.preventDefault();
		e.stopPropagation();
	}

	function onWindowMouseMove(e: MouseEvent) {
		if (!dragMode || selectedIdx < 0) return;
		const dx = e.clientX - dragStartX;
		const dy = e.clientY - dragStartY;
		const img = images[selectedIdx];

		if (dragMode === 'move') {
			const nx = Math.max(0, Math.min(previewW - img.width, imgStartX + dx));
			const ny = Math.max(0, Math.min(previewH - img.height, imgStartY + dy));
			updateSelectedXY(nx, ny);
		} else if (dragMode === 'resize') {
			// Smooth resize: use the dominant axis and maintain aspect ratio
			const absDx = Math.abs(dx);
			const absDy = Math.abs(dy);
			const useWidth = absDx > absDy;
			if (useWidth) {
				const nw = Math.max(20, imgStartW + dx);
				const nh = nw / aspectRatio;
				updateSelectedWH(nw, nh);
			} else {
				const nh = Math.max(20, imgStartH + dy);
				const nw = nh * aspectRatio;
				updateSelectedWH(nw, nh);
			}
		} else if (dragMode === 'rotate') {
			const containerRect = previewContainer.getBoundingClientRect();
			const cx = containerRect.left + imgStartX + imgStartW / 2;
			const cy = containerRect.top + imgStartY + imgStartH / 2;
			const startAngle = Math.atan2(dragStartY - cy, dragStartX - cx) * (180 / Math.PI);
			const currentAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
			const delta = currentAngle - startAngle;
			const newAngle = imgStartRot + delta;
			updateSelectedRot(Math.round(newAngle / 5) * 5);
		}
	}

	function onWindowMouseUp() { dragMode = null; }

	function updateSelectedXY(x: number, y: number) { updateFields({ x, y }); }
	function updateSelectedWH(w: number, h: number) { updateFields({ width: w, height: h }); }
	function updateSelectedRot(r: number) { updateFields({ rotate: r }); }

	function updateFields(fields: Partial<ImageEntry>) {
		if (selectedIdx < 0) return;
		images = images.map((img, i) => i === selectedIdx ? { ...img, ...fields } : img);
		resultBlob = null;
	}

	// Convert preview coords back to PDF coords
	function previewCoordsToPdf(entry: ImageEntry) {
		return { x: entry.x / previewScale, y: entry.y / previewScale, width: entry.width / previewScale, height: entry.height / previewScale, rotate: entry.rotate };
	}

	async function convert() {
		if (images.length === 0) return;
		isProcessing = true;
		const mapped = images.map(img => {
			const p = previewCoordsToPdf(img);
			return { file: img.file, x: p.x, y: p.y, width: p.width, height: p.height, rotate: p.rotate };
		});
		const result = await imagesToPdfWithPlacement(mapped, { pageWidth: pageW, pageHeight: pageH, onePerPage: true });
		resultBlob = await pdfToBlob(result);
		previewDataURL = await renderPdfToDataUrl(result, 0.5);
		showPreview = true;
		isProcessing = false;
	}

	function download() { if (resultBlob) downloadBlob(resultBlob, 'images.pdf'); }
	function reset() { images = []; selectedIdx = -1; resultBlob = null; previewDataURL = ''; showPreview = false; }
	function loadSample() {}

	let selectedEntry = $derived(selectedIdx >= 0 && selectedIdx < images.length ? images[selectedIdx] : null);
</script>

<svelte:window onmousemove={onWindowMouseMove} onmouseup={onWindowMouseUp} />

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		<div class="flex flex-col gap-4">
			<div class="flex flex-wrap gap-3 items-end">
				<label class="form-control">
					<span class="label label-text">Page Size</span>
					<select bind:value={pageSize} class="select select-bordered select-sm">
						<option value="A4">A4</option>
						<option value="Letter">Letter</option>
					</select>
				</label>
				<label class="form-control">
					<span class="label label-text">Orientation</span>
					<select bind:value={orientation} class="select select-bordered select-sm">
						<option value="portrait">Portrait</option>
						<option value="landscape">Landscape</option>
					</select>
				</label>
				<label class="btn btn-outline btn-sm">
					Add Images
					<input type="file" accept="image/*" multiple class="hidden" onchange={handleFiles} />
				</label>
				<span class="text-sm text-base-content/60">{images.length} images</span>
			</div>

			{#if images.length > 0}
				<div class="grid lg:grid-cols-3 gap-4">
					<div class="lg:col-span-2">
						<p class="text-sm font-medium mb-2">Page Preview — drag images to position them</p>
						<div bind:this={previewContainer} class="relative border-2 border-base-300 bg-white rounded-xl overflow-hidden select-none" style="width:{previewW}px; height:{previewH}px; max-width:100%;">
							<div class="absolute inset-2 border border-dashed border-base-content/10 rounded pointer-events-none"></div>
							{#each images as img, i}
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="absolute border-2 rounded {i === selectedIdx ? 'border-primary bg-primary/5' : 'border-base-content/20'}"
									style="left:{img.x}px; top:{img.y}px; width:{img.width}px; height:{img.height}px; transform:rotate({img.rotate}deg);"
								>
									<!-- Move zone (center of image) -->
									<div class="absolute inset-4 cursor-move" onmousedown={(e) => onImageMouseDown(e, i, 'move')}></div>
									<img src={img.url} alt={`img-${i}`} class="w-full h-full object-contain pointer-events-none opacity-80" draggable="false" />
									<!-- Resize handle (bottom-right corner) -->
									<div class="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded-full cursor-se-resize z-10" onmousedown={(e) => onImageMouseDown(e, i, 'resize')}></div>
									<!-- Rotation knob (top-right) -->
									<div class="absolute -top-3 -right-3 w-5 h-5 bg-warning border-2 border-white rounded-full cursor-grab z-10 flex items-center justify-center" onmousedown={(e) => onImageMouseDown(e, i, 'rotate')}>
										<svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
									</div>
									<div class="absolute top-0.5 left-1 text-[10px] bg-base-300 px-1 rounded pointer-events-none">{i + 1}</div>
								</div>
							{/each}
							<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
								<span class="text-base-content/20 text-sm">{orientation === 'portrait' ? pageSize : `${pageSize} (landscape)`}</span>
							</div>
						</div>
					</div>

					<div class="lg:col-span-1 flex flex-col gap-2 max-h-96 overflow-y-auto">
						<p class="text-sm font-medium">Images ({images.length})</p>
						{#each images as img, i}
							<div class="flex items-center gap-2 p-2 rounded-lg w-full {i === selectedIdx ? 'bg-primary/10 border border-primary/30' : 'bg-base-200 hover:bg-base-300 cursor-pointer'}" onclick={() => selectedIdx = i} onkeydown={() => {}} role="button" tabindex={0}>
								<img src={img.url} alt="" class="w-10 h-10 object-cover rounded" />
								<span class="text-xs flex-1 truncate">{img.file.name}</span>
								<div class="flex flex-col gap-0.5 ml-auto">
									<button class="btn btn-ghost btn-xs p-0.5 w-5 h-5" onclick={(e) => { e.stopPropagation(); moveUp(i); }} disabled={i === 0}>↑</button>
									<button class="btn btn-ghost btn-xs p-0.5 w-5 h-5" onclick={(e) => { e.stopPropagation(); moveDown(i); }} disabled={i === images.length - 1}>↓</button>
								</div>
								<button class="btn btn-ghost btn-xs text-error p-0.5 w-5 h-5 ml-0.5" onclick={(e) => { e.stopPropagation(); remove(i); }}>×</button>
							</div>
						{/each}

						{#if selectedEntry}
							<div class="grid grid-cols-2 gap-2 mt-2 p-3 bg-base-200 rounded-xl">
								<label class="form-control">
									<span class="label label-text text-xs">X</span>
									<input type="number" value={selectedEntry.x} oninput={(e) => updateSelected('x', Number(e.currentTarget.value))} class="input input-bordered input-xs w-full" />
								</label>
								<label class="form-control">
									<span class="label label-text text-xs">Y</span>
									<input type="number" value={selectedEntry.y} oninput={(e) => updateSelected('y', Number(e.currentTarget.value))} class="input input-bordered input-xs w-full" />
								</label>
								<label class="form-control">
									<span class="label label-text text-xs">Width</span>
									<input type="number" value={selectedEntry.width} oninput={(e) => updateSelected('width', Number(e.currentTarget.value))} class="input input-bordered input-xs w-full" />
								</label>
								<label class="form-control">
									<span class="label label-text text-xs">Height</span>
									<input type="number" value={selectedEntry.height} oninput={(e) => updateSelected('height', Number(e.currentTarget.value))} class="input input-bordered input-xs w-full" />
								</label>
								<label class="form-control">
									<span class="label label-text text-xs">Rotate (°)</span>
									<input type="number" value={selectedEntry.rotate} step="1" oninput={(e) => updateSelected('rotate', Number(e.currentTarget.value))} class="input input-bordered input-xs w-full" />
								</label>
							</div>
						{/if}
					</div>
				</div>

				<button class="btn btn-primary" onclick={convert} disabled={images.length === 0 || isProcessing}>
					{isProcessing ? 'Creating...' : 'Create PDF'}
				</button>

				{#if showPreview && previewDataURL}
					<div class="bg-base-200 rounded-xl p-4">
						<p class="text-sm font-medium mb-2">Preview (page 1)</p>
						<img src={previewDataURL} alt="Preview" class="max-w-md rounded shadow" />
					</div>
				{/if}

				{#if resultBlob}
					<button class="btn btn-success" onclick={download}>Download ({formatBytes(resultBlob.size)})</button>
				{/if}
			{/if}
		</div>

		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}<Tips tips={content.tips} />{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
