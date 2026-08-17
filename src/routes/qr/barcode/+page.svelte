<script lang="ts">
	import { onMount } from 'svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { qrToolsContent } from '$lib/config/content/qr-tools-content';
	import { BARCODE_FORMATS, getBarcodeFormat, normalizeBarcodeValue } from '$lib/utils/barcode';
	import { downloadBlob } from '$lib/utils/image';
	import { browser } from '$app/environment';

	const content = qrToolsContent['barcode'];

	let formatId = $state('CODE128');
	let value = $state('ONDEV-12345');
	let displayValue = $state(true);
	let lineColor = $state('#111827');
	let background = $state('#ffffff');
	let barWidth = $state(2);
	let barHeight = $state(80);
	let renderError = $state('');
	let svgEl = $state<SVGElement | undefined>();

	const format = $derived(getBarcodeFormat(formatId));
	const encoded = $derived(normalizeBarcodeValue(formatId, value));
	const validationError = $derived(format.validate(encoded));

	async function draw() {
		if (!browser || !svgEl) return;
		if (!encoded || validationError) {
			svgEl.innerHTML = '';
			renderError = validationError ?? '';
			return;
		}
		try {
			const JsBarcode = (await import('jsbarcode')).default;
			JsBarcode(svgEl, encoded, {
				format: formatId,
				lineColor,
				background,
				width: barWidth,
				height: barHeight,
				displayValue,
				margin: 10,
				fontSize: 16
			});
			renderError = '';
		} catch (err) {
			renderError = err instanceof Error ? err.message : 'Could not render this barcode.';
			svgEl.innerHTML = '';
		}
	}

	$effect(() => {
		void formatId;
		void encoded;
		void displayValue;
		void lineColor;
		void background;
		void barWidth;
		void barHeight;
		void svgEl;
		draw();
	});

	function loadSample() {
		const next = getBarcodeFormat(formatId);
		value = next.sample;
	}

	function clearAll() {
		value = '';
	}

	function downloadSvg() {
		if (!svgEl) return;
		const markup = new XMLSerializer().serializeToString(svgEl);
		downloadBlob(new Blob([markup], { type: 'image/svg+xml' }), `barcode-${formatId}.svg`);
	}

	async function downloadPng() {
		if (!svgEl) return;
		const markup = new XMLSerializer().serializeToString(svgEl);
		const url = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }));
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width || 640;
			canvas.height = img.height || 200;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0);
			canvas.toBlob((blob) => {
				if (blob) downloadBlob(blob, `barcode-${formatId}.png`);
				URL.revokeObjectURL(url);
			});
		};
		img.src = url;
	}

	onMount(() => {
		draw();
	});
</script>

<ToolWrapper lastUpdated="2026-08-17">
	<div class="space-y-6">
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={encoded} copyLabel="Copy value" />

		<div class="grid gap-6 lg:grid-cols-[1fr_auto]">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4 space-y-4">
					<label class="form-control">
						<span class="label-text text-sm font-medium">Format</span>
						<select class="select select-bordered mt-1" bind:value={formatId}>
							{#each BARCODE_FORMATS as item}
								<option value={item.id}>{item.label}</option>
							{/each}
						</select>
						<span class="label-text-alt mt-1 text-base-content/50">{format.hint}</span>
					</label>

					<label class="form-control">
						<span class="label-text text-sm font-medium">Value</span>
						<input class="input input-bordered mt-1 font-mono" bind:value />
					</label>

					<div class="grid gap-4 sm:grid-cols-2">
						<label class="form-control">
							<span class="label-text text-xs">Bar width ({barWidth})</span>
							<input type="range" min="1" max="4" step="1" class="range range-primary range-sm mt-1" bind:value={barWidth} />
						</label>
						<label class="form-control">
							<span class="label-text text-xs">Bar height ({barHeight}px)</span>
							<input type="range" min="40" max="160" step="4" class="range range-primary range-sm mt-1" bind:value={barHeight} />
						</label>
						<label class="form-control">
							<span class="label-text text-xs">Bar color</span>
							<input type="color" class="h-10 w-full cursor-pointer rounded-lg border border-base-300 bg-base-100 p-1" bind:value={lineColor} />
						</label>
						<label class="form-control">
							<span class="label-text text-xs">Background</span>
							<input type="color" class="h-10 w-full cursor-pointer rounded-lg border border-base-300 bg-base-100 p-1" bind:value={background} />
						</label>
					</div>

					<label class="flex items-center gap-2 text-sm">
						<input type="checkbox" class="checkbox checkbox-sm" bind:checked={displayValue} />
						Show human-readable text
					</label>
				</div>
			</div>

			<div class="lg:sticky lg:top-20 h-fit">
				<div class="card bg-base-100 border border-base-300 rounded-2xl">
					<div class="card-body p-4 items-center gap-4">
						<div class="w-full overflow-x-auto rounded-xl bg-white p-4">
							<svg bind:this={svgEl} xmlns="http://www.w3.org/2000/svg"></svg>
						</div>
						{#if renderError}
							<p class="text-sm text-error">{renderError}</p>
						{/if}
						{#if encoded && !validationError && !renderError}
							<div class="flex flex-wrap justify-center gap-2">
								<button type="button" class="btn btn-primary btn-sm" onclick={downloadPng}>Download PNG</button>
								<button type="button" class="btn btn-ghost btn-sm" onclick={downloadSvg}>SVG</button>
								<CopyButton text={encoded} size="sm" label="Copy value" />
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

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
