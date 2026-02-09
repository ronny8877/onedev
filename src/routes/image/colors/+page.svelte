<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ImageUploader from '$lib/components/ui/ImageUploader.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { extractColors } from 'extract-colors';
	import { imageToolsContent } from '$lib/config/content/image-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = imageToolsContent['colors'];

	let originalFile = $state<File | null>(null);
	let originalDataURL = $state('');
	let allColors = $state<{ hex: string; area: number; red: number; green: number; blue: number }[]>([]);
	let isProcessing = $state(false);
	let copiedIndex = $state<number | null>(null);

	// Options
	let colorCount = $state(6);

	async function handleImageLoad(file: File, dataURL: string) {
		originalFile = file;
		originalDataURL = dataURL;
		await extract();
	}

	async function extract() {
		if (!originalDataURL) return;

		isProcessing = true;
		try {
			// Extract more colors than needed, then slice based on colorCount
			const extracted = await extractColors(originalDataURL, {
				pixels: 64000,
				distance: 0.12, // Lower distance = more distinct colors
				crossOrigin: 'anonymous',
				saturationDistance: 0.1,
				lightnessDistance: 0.1
			});

			// Store all extracted colors sorted by prominence
			allColors = extracted
				.sort((a, b) => b.area - a.area)
				.map((c) => ({
					hex: c.hex,
					area: c.area,
					red: c.red,
					green: c.green,
					blue: c.blue
				}));
		} catch (err) {
			console.error('Color extraction failed:', err);
		} finally {
			isProcessing = false;
		}
	}

	// Derived colors based on current colorCount
	let displayColors = $derived(allColors.slice(0, colorCount));

	function copyColor(hex: string, index: number) {
		navigator.clipboard.writeText(hex);
		copiedIndex = index;
		setTimeout(() => {
			copiedIndex = null;
		}, 1500);
	}

	function copyAllColors() {
		const allHex = displayColors.map((c) => c.hex).join('\n');
		navigator.clipboard.writeText(allHex);
	}

	function copyAsCSS() {
		const css = displayColors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
		navigator.clipboard.writeText(css);
	}

	function reset() {
		originalFile = null;
		originalDataURL = '';
		allColors = [];
	}

	function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0;
		let s = 0;
		const l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
					break;
				case g:
					h = ((b - r) / d + 2) / 6;
					break;
				case b:
					h = ((r - g) / d + 4) / 6;
					break;
			}
		}

		return {
			h: Math.round(h * 360),
			s: Math.round(s * 100),
			l: Math.round(l * 100)
		};
	}

	async function loadSample() {
		const res = await fetch('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80');
		const blob = await res.blob();
		const file = new File([blob], 'gradient.jpg', { type: 'image/jpeg' });
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
			<div class="grid gap-6 lg:grid-cols-2">
				<!-- Image Preview -->
				<div class="relative">
					<img
						src={originalDataURL}
						alt="Preview"
						class="w-full rounded-2xl bg-base-300 object-contain max-h-80"
					/>
					<div class="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white">
						{originalFile.name}
					</div>
				</div>

				<!-- Controls -->
				<div class="card bg-base-200 rounded-2xl h-fit">
					<div class="card-body gap-4">
						<!-- Color Count Slider -->
						<div>
							<div class="flex items-center justify-between mb-2">
								<label class="text-sm font-medium" for="colorCount">Number of colors</label>
								<span class="badge badge-ghost font-mono">{colorCount}</span>
							</div>
							<input
								id="colorCount"
								type="range"
								min="3"
								max="12"
								bind:value={colorCount}
								class="range range-primary"
							/>
							{#if allColors.length < colorCount}
								<div class="text-xs text-warning mt-1">
									Only {allColors.length} distinct colors found in image
								</div>
							{/if}
						</div>

						<!-- Actions -->
						<div class="flex flex-wrap gap-2">
							<button class="btn btn-sm btn-ghost" onclick={copyAllColors}>
								Copy All Hex
							</button>
							<button class="btn btn-sm btn-ghost" onclick={copyAsCSS}>
								Copy as CSS Variables
							</button>
							<button class="btn btn-sm btn-ghost" onclick={reset}>
								Upload New
							</button>
						</div>
					</div>
				</div>
			</div>

			<!-- Colors Display -->
			{#if isProcessing}
				<div class="flex items-center justify-center py-12">
					<span class="loading loading-spinner loading-lg text-primary"></span>
				</div>
			{:else if displayColors.length > 0}
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each displayColors as color, i}
						{@const hsl = rgbToHsl(color.red, color.green, color.blue)}
						<button
							class="card bg-base-200 rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 cursor-pointer"
							onclick={() => copyColor(color.hex, i)}
						>
							<!-- Color Swatch -->
							<div
								class="h-24 transition-all duration-300"
								style="background-color: {color.hex}"
							></div>

							<!-- Color Info -->
							<div class="p-4 flex flex-col gap-2">
								<div class="flex items-center justify-between">
									<span class="font-mono font-bold text-lg">{color.hex.toUpperCase()}</span>
									{#if copiedIndex === i}
										<span class="badge badge-success badge-sm">Copied!</span>
									{:else}
										<svg class="h-4 w-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
										</svg>
									{/if}
								</div>
								<div class="text-xs text-base-content/60 space-y-1">
									<div>RGB: {color.red}, {color.green}, {color.blue}</div>
									<div>HSL: {hsl.h}°, {hsl.s}%, {hsl.l}%</div>
									<div>Coverage: {(color.area * 100).toFixed(1)}%</div>
								</div>
							</div>
						</button>
					{/each}
				</div>

				<!-- Visual Palette Strip -->
				<div class="mt-2">
					<h4 class="text-sm font-medium mb-2 text-base-content/70">Palette Preview</h4>
					<div class="flex h-12 rounded-xl overflow-hidden">
						{#each displayColors as color}
							<div
								class="flex-1 transition-all duration-300"
								style="background-color: {color.hex}"
								title={color.hex}
							></div>
						{/each}
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
