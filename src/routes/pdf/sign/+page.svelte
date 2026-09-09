<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { loadPdfDoc, loadPdfJsDoc, renderPage, pageCount, signPdf, pdfToBlob, renderPdfToDataUrl, downloadBlob, formatBytes } from '$lib/utils/pdf';
	import { pdfToolsContent } from '$lib/config/content/pdf-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import type { PDFDocumentProxy } from 'pdfjs-dist';
	import type { PDFDocument } from 'pdf-lib';

	const content = pdfToolsContent.sign;

	let file = $state<File | null>(null);
	let pdfDoc = $state<PDFDocument | null>(null);
	let pdfJsDoc = $state<PDFDocumentProxy | null>(null);
	let totalPages = $state(0);
	let currentPage = $state(1);
	let pageDataURL = $state('');
	let previewDataURL = $state('');
	let resultBlob = $state<Blob | null>(null);
	let isProcessing = $state(false);
	let showPreview = $state(false);

	// Signature state
	let sigSource = $state<'draw' | 'upload'>('draw');
	let sigDataURL = $state('');
	let sigFile = $state<File | null>(null);

	// Canvas drawing
	let canvasEl: HTMLCanvasElement;
	let isDrawingSig = $state(false);
	let lastX = 0;
	let lastY = 0;

	function initCanvas(canvas: HTMLCanvasElement) {
		canvasEl = canvas;
		const ctx = canvas.getContext('2d')!;
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
	}

	function startDraw(e: MouseEvent) {
		isDrawingSig = true;
		const rect = canvasEl.getBoundingClientRect();
		lastX = e.clientX - rect.left;
		lastY = e.clientY - rect.top;
	}

	function draw(e: MouseEvent) {
		if (!isDrawingSig) return;
		const rect = canvasEl.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const ctx = canvasEl.getContext('2d')!;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.stroke();
		lastX = x;
		lastY = y;
	}

	function stopDraw() { isDrawingSig = false; sigDataURL = canvasEl.toDataURL('image/png'); }
	function clearSig() { if (canvasEl) { const ctx = canvasEl.getContext('2d')!; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvasEl.width, canvasEl.height); sigDataURL = ''; } }

	// PDF loading
	async function handlePdf(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		reset();
		file = f;
		isProcessing = true;
		pdfDoc = await loadPdfDoc(f);
		pdfJsDoc = await loadPdfJsDoc(f);
		totalPages = pageCount(pdfJsDoc);
		await loadPage();
		isProcessing = false;
	}

	async function loadPage() {
		if (!pdfJsDoc) return;
		pageDataURL = await renderPage(pdfJsDoc, currentPage, 1.5);
	}

	async function goTo(p: number) {
		if (!pdfJsDoc || p < 1 || p > totalPages) return;
		currentPage = p;
		await loadPage();
	}

	async function handleSigUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const f = input.files?.[0];
		if (!f) return;
		sigFile = f;
		const reader = new FileReader();
		reader.onload = () => { sigDataURL = reader.result as string; };
		reader.readAsDataURL(f);
	}

	// Draggable signature overlay state
	let sigX = $state(50);
	let sigY = $state(50);
	let sigW = $state(150);
	let sigH = $state(50);
	let dragging = $state(false);
	let dragOffsetX = $state(0);
	let dragOffsetY = $state(0);
	let imgContainer = $state<HTMLDivElement | undefined>();

	function startDrag(e: MouseEvent) {
		dragging = true;
		dragOffsetX = e.clientX - sigX;
		dragOffsetY = e.clientY - sigY;
		e.preventDefault();
	}

	function onDrag(e: MouseEvent) {
		if (!dragging) return;
		sigX = e.clientX - dragOffsetX;
		sigY = e.clientY - dragOffsetY;
	}

	function stopDrag() { dragging = false; }

	async function applySign() {
		if (!file) return;
		const sig = sigDataURL;
		if (!sig) return;
		isProcessing = true;
		const freshPdf = await loadPdfDoc(file);
		const result = await signPdf(freshPdf, sig, {
			page: currentPage - 1,
			x: sigX, y: sigY, width: sigW, height: sigH,
			displayScale: 1.5,
		});
		resultBlob = await pdfToBlob(result);
		previewDataURL = await renderPdfToDataUrl(result, 0.5);
		showPreview = true;
		isProcessing = false;
	}

	function download() { if (resultBlob) downloadBlob(resultBlob, 'signed.pdf'); }
	function reset() { file = null; pdfDoc = null; pdfJsDoc = null; totalPages = 0; currentPage = 1; pageDataURL = ''; resultBlob = null; sigDataURL = ''; sigFile = null; showPreview = false; previewDataURL = ''; sigX = 50; sigY = 50; sigW = 150; sigH = 50; if (canvasEl) clearSig(); }
	function loadSample() {}
</script>

<ToolWrapper lastUpdated="2025-06-01">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={loadSample} onClear={reset} />

		{#if !file}
			<div class="flex flex-col items-center gap-4 p-8 border-2 border-dashed border-base-300 rounded-xl">
				<p class="text-base-content/60">Select a PDF to sign</p>
				<label class="btn btn-primary">
					Open PDF
					<input type="file" accept=".pdf,application/pdf" class="hidden" onchange={handlePdf} />
				</label>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				<!-- Signature source tabs -->
				<div class="tabs tabs-boxed">
					<button class="tab" class:tab-active={sigSource === 'draw'} onclick={() => sigSource = 'draw'}>Draw Signature</button>
					<button class="tab" class:tab-active={sigSource === 'upload'} onclick={() => sigSource = 'upload'}>Upload Image</button>
				</div>

				<div class="grid lg:grid-cols-3 gap-4">
					<!-- Signature input -->
					<div class="lg:col-span-1 flex flex-col gap-4">
						{#if sigSource === 'draw'}
							<canvas width="400" height="150" class="border border-base-300 rounded-lg cursor-crosshair bg-white" use:initCanvas onmousedown={startDraw} onmousemove={draw} onmouseup={stopDraw} onmouseleave={stopDraw}></canvas>
							<button class="btn btn-sm btn-ghost w-fit" onclick={clearSig}>Clear</button>
						{:else}
							<label class="btn btn-outline w-fit">
								Upload Signature
								<input type="file" accept="image/png,image/jpeg" class="hidden" onchange={handleSigUpload} />
							</label>
							{#if sigFile}<p class="text-xs text-success">{sigFile.name}</p>{/if}
						{/if}

						<div class="grid grid-cols-2 gap-2">
							<label class="form-control">
								<span class="label label-text text-xs">Width</span>
								<input type="number" min="20" max="400" bind:value={sigW} class="input input-bordered input-sm" />
							</label>
							<label class="form-control">
								<span class="label label-text text-xs">Height</span>
								<input type="number" min="10" max="200" bind:value={sigH} class="input input-bordered input-sm" />
							</label>
						</div>
					</div>

					<!-- Page preview with draggable signature -->
					<div class="lg:col-span-2">
						<div class="flex items-center gap-3 mb-2">
							<button class="btn btn-sm btn-ghost" onclick={() => goTo(currentPage - 1)} disabled={currentPage <= 1}>←</button>
							<span class="text-sm">{currentPage} / {totalPages}</span>
							<button class="btn btn-sm btn-ghost" onclick={() => goTo(currentPage + 1)} disabled={currentPage >= totalPages}>→</button>
						</div>
						<div bind:this={imgContainer} class="relative inline-block bg-base-200 rounded-xl" onmousemove={onDrag} onmouseup={stopDrag} onmouseleave={stopDrag}>
							{#if pageDataURL}
								<img src={pageDataURL} alt={`Page ${currentPage}`} class="max-w-full rounded select-none" />
							{/if}
							{#if sigDataURL && pageDataURL}
								<div
									class="absolute border-2 border-primary border-dashed rounded cursor-move bg-white/30"
									style="left:{sigX}px; top:{sigY}px; width:{sigW}px; height:{sigH}px;"
									onmousedown={startDrag}
								>
									<img src={sigDataURL} alt="Signature" class="w-full h-full object-contain pointer-events-none" />
								</div>
							{/if}
						</div>
					</div>
				</div>

				<button class="btn btn-primary" onclick={applySign} disabled={isProcessing || !sigDataURL}>
					{isProcessing ? 'Signing...' : 'Sign PDF'}
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
			</div>
		{/if}

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
