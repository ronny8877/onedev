<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { 
		pxToRem, pxToEm, pxToVw, pxToVh, pxToPt, pxToPercent, pxToPc,
		pxToMm, pxToCm, pxToInch,
		formatNumber
	} from '$lib/utils/conversions';
	import { convertToolsContent } from '$lib/config/content/convert-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = convertToolsContent['css-units'];

	let activeTab = $state<'converter' | 'clamp'>('converter');
	let showSettings = $state(false);

	// --- Converter State ---
	let inputValue = $state('16');
	let inputUnit = $state<'px' | 'rem' | 'em' | 'pt' | 'pc' | 'in' | 'cm' | 'mm' | '%'>('px');
	
	// Settings
	let baseFontSize = $state(16);
	let parentFontSize = $state(16);
	let viewportWidth = $state(1920);
	let viewportHeight = $state(1080);
	let baseForPercent = $state(16); // Changed default to 16 to make % meaningful for font sizes typically
	let dpi = $state(96);

	// Parse input
	let numValue = $derived(parseFloat(inputValue) || 0);

	// Convert to px first (base unit for calculations)
	let pxValue = $derived(() => {
		switch (inputUnit) {
			case 'rem': return numValue * baseFontSize;
			case 'em': return numValue * parentFontSize;
			case '%': return (numValue / 100) * baseForPercent;
			case 'pt': return numValue / 0.75;
			case 'pc': return numValue * 16;
			case 'in': return numValue * dpi;
			case 'cm': return (numValue / 2.54) * dpi;
			case 'mm': return (numValue / 25.4) * dpi;
			default: return numValue;
		}
	});

	// All conversions from px
	let conversions = $derived({
		px: pxValue(),
		rem: pxToRem(pxValue(), baseFontSize),
		em: pxToEm(pxValue(), parentFontSize),
		vw: pxToVw(pxValue(), viewportWidth),
		vh: pxToVh(pxValue(), viewportHeight),
		pt: pxToPt(pxValue()),
		pc: pxToPc(pxValue()),
		percent: pxToPercent(pxValue(), baseForPercent),
		in: pxToInch(pxValue(), dpi),
		cm: pxToCm(pxValue(), dpi),
		mm: pxToMm(pxValue(), dpi)
	});

	// --- Clamp Generator State ---
	let clampMinW = $state(320);
	let clampMaxW = $state(1200);
	let clampMinF = $state(16);
	let clampMaxF = $state(24);
	let clampPixelsFn = $state(false); // input in pixels?
	let clampRemRoot = $state(16);

	// Clamp Logic
	// slope = (maxFontSize - minFontSize) / (maxWidth - minWidth)
	// yAxisIntersection = -minWidth * slope + minFontSize
	// preferredValue = yAxisIntersection[rem] + (slope * 100)[vw]
	
	let clampResult = $derived.by(() => {
		const minW = clampMinW / 16; // convert to rem assumptions (browser default) usually better for calculations
		const maxW = clampMaxW / 16;
		const minF = clampMinF / 16;
		const maxF = clampMaxF / 16;

		const slope = (maxF - minF) / (maxW - minW);
		const yAxisIntersection = -minW * slope + minF;
		
		const slopeVw = slope * 100;
		const yAxisRem = yAxisIntersection;

		return `clamp(${minF}rem, ${formatNumber(yAxisRem)}rem + ${formatNumber(slopeVw)}vw, ${maxF}rem)`;
	});

	// Clamp Preview
	let previewViewportW = $state(1000);
	let previewClampVal = $derived(() => {
		// Calculate actual px value at current preview width
		const minF = clampMinF;
		const maxF = clampMaxF;
		const minW = clampMinW;
		const maxW = clampMaxW;
		
		if (previewViewportW <= minW) return minF;
		if (previewViewportW >= maxW) return maxF;
		
		const slope = (maxF - minF) / (maxW - minW);
		const yIntercept = minF - (slope * minW);
		return (slope * previewViewportW) + yIntercept;
	});


	function loadSample() {
		if (activeTab === 'converter') {
			inputValue = '24';
			inputUnit = 'px';
		} else {
			clampMinW = 320;
			clampMaxW = 1200;
			clampMinF = 16;
			clampMaxF = 240;
		}
	}

	function clearAll() {
		if (activeTab === 'converter') {
			inputValue = '';
		} else {
			// Reset defaults?
			clampMinW = 320;
			clampMaxW = 1200;
			clampMinF = 16;
			clampMaxF = 24;
		}
	}

	// Common viewport presets
	const viewportPresets = [
		{ label: '1920×1080', w: 1920, h: 1080 },
		{ label: '1366×768', w: 1366, h: 768 },
		{ label: 'Mobile (390)', w: 390, h: 844 },
	];

	function setViewport(w: number, h: number) {
		viewportWidth = w;
		viewportHeight = h;
	}
	
	function toggleSettings() {
		showSettings = !showSettings;
	}

	// Quick preset values
	const fontSizePresets = [12, 14, 16, 18, 20, 24, 32, 48, 64];

	function setPreset(value: number, unit: typeof inputUnit = 'px') {
		inputValue = value.toString();
		inputUnit = unit;
	}

	// Check if current input matches a preset
	let activePreset = $derived(
		fontSizePresets.find(p => p === numValue && inputUnit === 'px')
	);
</script>

<ToolWrapper
	keywords={['css units', 'px to rem', 'px to em', 'rem converter', 'viewport units', 'css clamp generator', 'fluid typography']}
>
	<div class="flex flex-col gap-6">
		<!-- Tabs -->
		<div role="tablist" class="tabs tabs-boxed bg-base-200 p-1 w-full max-w-md mx-auto">
			<button 
				role="tab" 
				class="tab flex-1 transition-all"
				class:tab-active={activeTab === 'converter'}
				onclick={() => activeTab = 'converter'}
			>Unit Converter</button>
			<button 
				role="tab" 
				class="tab flex-1 transition-all"
				class:tab-active={activeTab === 'clamp'}
				onclick={() => activeTab = 'clamp'}
			>Clamp Generator</button>
		</div>

		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		{#if activeTab === 'converter'}
			<!-- Converter Mode -->
			<div class="card bg-base-200 shadow-sm rounded-2xl border border-base-300">
				<div class="card-body p-4 sm:p-6">
					<div class="flex flex-col sm:flex-row gap-4">
						<div class="flex-1">
							<label class="label pt-0">
								<span class="label-text font-semibold">Input Value</span>
							</label>
							<div class="join w-full">
								<input
									type="number"
									bind:value={inputValue}
									placeholder="Value"
									class="input input-bordered join-item flex-1 font-mono text-lg"
								/>
								<select bind:value={inputUnit} class="select select-bordered join-item font-mono w-28 text-lg font-semibold">
									<optgroup label="Relative">
										<option value="px">px</option>
										<option value="rem">rem</option>
										<option value="em">em</option>
										<option value="%">%</option>
									</optgroup>
									<optgroup label="Print">
										<option value="pt">pt</option>
										<option value="pc">pc</option>
									</optgroup>
									<optgroup label="Physical">
										<option value="in">in</option>
										<option value="cm">cm</option>
										<option value="mm">mm</option>
									</optgroup>
								</select>
							</div>
						</div>
						
						<!-- Quick Presets -->
						<div class="col-span-full">
							<p class="text-xs text-base-content/60 mb-2 font-medium">Quick Presets:</p>
							<div class="flex flex-wrap gap-2">
								{#each fontSizePresets as preset}
									<button
										class="btn btn-sm font-mono transition-all"
										class:btn-primary={activePreset === preset}
										class:btn-outline={activePreset !== preset}
										onclick={() => setPreset(preset)}
									>
										{preset}px
									</button>
								{/each}
							</div>
						</div>

						<!-- Viewport Presets & Settings -->
						<div class="col-span-full flex flex-wrap items-center gap-3 mt-2">
							<p class="text-xs text-base-content/60 font-medium">Viewport:</p>
							{#each viewportPresets as vp}
								<button
									class="btn btn-xs btn-outline gap-1 font-mono"
									class:btn-active={viewportWidth === vp.w && viewportHeight === vp.h}
									onclick={() => setViewport(vp.w, vp.h)}
								>
									{vp.label}
								</button>
							{/each}
							<div class="ml-auto">
								<button 
									class="btn btn-sm btn-outline gap-2" 
									onclick={toggleSettings}
								>
									<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									{showSettings ? 'Hide' : 'Advanced'}
								</button>
							</div>
						</div>

						<!-- Settings Toggle (Old position) -->
						<!--
						<div class="flex items-end">
							<button 
								class="btn btn-outline border-base-content/20 hover:border-base-content/40 hover:bg-base-200 text-base-content" 
								onclick={toggleSettings}
							>
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
								{showSettings ? 'Hide Settings' : 'Settings'}
							</button>
						</div>
						-->
					</div>

					{#if showSettings}
						<div class="mt-4 pt-4 border-t border-base-content/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
							<div class="form-control">
								<label class="label py-1">
									<span class="label-text text-xs text-base-content/70">Root Font Size (px)</span>
								</label>
								<input type="number" bind:value={baseFontSize} class="input input-sm input-bordered font-mono" />
							</div>
							<div class="form-control">
								<label class="label py-1">
									<span class="label-text text-xs text-base-content/70">Parent Font Size (px)</span>
								</label>
								<input type="number" bind:value={parentFontSize} class="input input-sm input-bordered font-mono" />
							</div>
							<div class="form-control">
								<label class="label py-1">
									<span class="label-text text-xs text-base-content/70">Base for % (px)</span>
								</label>
								<input type="number" bind:value={baseForPercent} class="input input-sm input-bordered font-mono" />
							</div>
							<div class="form-control">
								<label class="label py-1">
									<span class="label-text text-xs text-base-content/70">Viewport Width</span>
								</label>
								<input type="number" bind:value={viewportWidth} class="input input-sm input-bordered font-mono" />
							</div>
							<div class="form-control">
								<label class="label py-1">
									<span class="label-text text-xs text-base-content/70">Screen DPI</span>
								</label>
								<input type="number" bind:value={dpi} class="input input-sm input-bordered font-mono" />
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Results -->
			{#if numValue}
				<div class="grid lg:grid-cols-2 gap-4">
					<div class="space-y-4">
						<ConversionGroup title="Relative & Web" icon="📐">
							<ConversionCard 
								label="Pixels" 
								value={formatNumber(conversions.px)} 
								unit="px" 
								highlight={inputUnit === 'px'}
							/>
							<ConversionCard 
								label="Root Em" 
								value={formatNumber(conversions.rem)} 
								unit="rem" 
								highlight={inputUnit === 'rem'}
								description="{baseFontSize}px base"
							/>
							<ConversionCard 
								label="Em" 
								value={formatNumber(conversions.em)} 
								unit="em" 
								highlight={inputUnit === 'em'}
								description="{parentFontSize}px parent"
							/>
							<ConversionCard 
								label="Percentage" 
								value={formatNumber(conversions.percent)} 
								unit="%" 
								highlight={inputUnit === '%'}
								description="of {baseForPercent}px"
							/>
						</ConversionGroup>

						<ConversionGroup title="Viewport" icon="🖥️">
							<ConversionCard 
								label="Viewport Width" 
								value={formatNumber(conversions.vw)} 
								unit="vw" 
								description="{viewportWidth}px width"
							/>
							<ConversionCard 
								label="Viewport Height" 
								value={formatNumber(conversions.vh)} 
								unit="vh" 
								description="{viewportHeight}px height"
							/>
						</ConversionGroup>
					</div>

					<div class="space-y-4">
						<ConversionGroup title="Physical (Print / Screen)" icon="📏">
							<ConversionCard 
								label="Inches" 
								value={formatNumber(conversions.in)} 
								unit="in" 
								highlight={inputUnit === 'in'}
								description="@ {dpi} DPI"
							/>
							<ConversionCard 
								label="Centimeters" 
								value={formatNumber(conversions.cm)} 
								unit="cm" 
								highlight={inputUnit === 'cm'}
							/>
							<ConversionCard 
								label="Millimeters" 
								value={formatNumber(conversions.mm)} 
								unit="mm" 
								highlight={inputUnit === 'mm'}
							/>
							<ConversionCard 
								label="Points" 
								value={formatNumber(conversions.pt)} 
								unit="pt" 
								highlight={inputUnit === 'pt'}
							/>
							<ConversionCard 
								label="Picas" 
								value={formatNumber(conversions.pc)} 
								unit="pc" 
								highlight={inputUnit === 'pc'}
							/>
						</ConversionGroup>

						<!-- Preview -->
						<div class="card bg-base-200 border border-base-300 rounded-2xl overflow-hidden">
							<div class="card-body p-4">
								<h3 class="text-sm font-semibold mb-3">Visual Preview</h3>
								
								<!-- Box Preview -->
								<div 
									class="bg-primary/20 border-2 border-primary rounded mb-4 flex items-center justify-center transition-all duration-300"
									style="width: {Math.min(Math.max(conversions.px, 4), 280)}px; height: {Math.min(Math.max(conversions.px, 4), 100)}px;"
								>
									<span class="text-[10px] text-primary-content font-mono bg-primary px-1 rounded">
										{formatNumber(conversions.px)}px
									</span>
								</div>

								<!-- Text Preview -->
								<div class="border-t border-base-300 pt-3">
									<p class="text-xs text-base-content/60 mb-1">Text size preview:</p>
									<p 
										class="leading-tight truncate transition-all duration-300"
										style="font-size: {Math.min(conversions.px, 64)}px;"
									>
										The quick brown fox
									</p>
									{#if conversions.px > 64}
										<p class="text-[10px] text-warning mt-1">Preview capped at 64px</p>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			{:else}
				<div class="card bg-base-200 border border-base-300 rounded-2xl">
					<div class="card-body items-center text-center py-12">
						<span class="text-4xl mb-2">📐</span>
						<p class="text-base-content/60">Enter a value to see real-time conversions</p>
					</div>
				</div>
			{/if}

		{:else}
			<!-- Clamp Generator Mode -->
			<div class="grid lg:grid-cols-2 gap-6">
				<!-- Controls -->
				<div class="space-y-6">
					<div class="card bg-base-200 shadow-sm rounded-2xl border border-base-300">
						<div class="card-body p-4 sm:p-6">
							<h3 class="font-semibold flex items-center gap-2 mb-4">
								<span class="text-xl">🛠️</span> Configuration
							</h3>

							<div class="grid grid-cols-2 gap-x-4 gap-y-6">
								<div class="form-control">
									<label class="label py-1">
										<span class="label-text">Min Width (px)</span>
									</label>
									<input type="number" bind:value={clampMinW} class="input input-bordered font-mono" />
								</div>
								<div class="form-control">
									<label class="label py-1">
										<span class="label-text">Max Width (px)</span>
									</label>
									<input type="number" bind:value={clampMaxW} class="input input-bordered font-mono" />
								</div>
								<div class="form-control">
									<label class="label py-1">
										<span class="label-text">Min Value (px)</span>
									</label>
									<input type="number" bind:value={clampMinF} class="input input-bordered font-mono" />
								</div>
								<div class="form-control">
									<label class="label py-1">
										<span class="label-text">Max Value (px)</span>
									</label>
									<input type="number" bind:value={clampMaxF} class="input input-bordered font-mono" />
								</div>
							</div>
						</div>
					</div>

					<div class="card bg-neutral text-neutral-content rounded-2xl shadow-lg">
						<div class="card-body p-5">
							<h3 class="text-sm font-semibold uppercase opacity-80 mb-2">Generated CSS</h3>
							<div class="mockup-code bg-neutral-focus text-neutral-content m-0 w-full">
								<pre class="px-5"><code>{clampResult}</code></pre>
							</div>
							<div class="flex justify-end mt-2">
								<button 
									class="btn btn-sm btn-primary"
									onclick={() => navigator.clipboard.writeText(clampResult)}
								>
									Copy Snippet
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Preview -->
				<div class="space-y-6">
					<div class="card bg-base-200 border border-base-300 rounded-2xl h-full">
						<div class="card-body p-4 sm:p-6">
							<h3 class="font-semibold mb-4">Live Preview</h3>
							
							<div class="mb-6">
								<div class="flex justify-between text-xs text-base-content/60 mb-2">
									<span>Current Viewport: {previewViewportW}px</span>
									<span>Computed Size: {formatNumber(previewClampVal())}px</span>
								</div>
								<input 
									type="range" 
									min={clampMinW - 200} 
									max={clampMaxW + 200} 
									bind:value={previewViewportW} 
									class="range range-primary range-sm" 
								/>
								<div class="flex justify-between px-2 text-[10px] text-base-content/40 mt-1">
									<span>{clampMinW - 200}px</span>
									<span>{clampMaxW + 200}px</span>
								</div>
							</div>

							<div class="flex-1 bg-base-100 rounded-xl border border-base-300 p-4 flex items-center justify-center overflow-hidden relative min-h-[200px]">
								<div class="text-center transition-all duration-75">
									<p 
										class="leading-none whitespace-nowrap font-bold text-primary"
										style="font-size: {previewClampVal()}px;"
									>
										Fluid Text
									</p>
									<p class="text-sm text-base-content/40 mt-4 font-mono">
										font-size: {formatNumber(previewClampVal())}px
									</p>
								</div>
								
								<!-- Viewport visualizer lines -->
								<div class="absolute inset-0 pointer-events-none opacity-10">
									<div class="absolute top-0 bottom-0 border-r border-current transition-all duration-75" style="left: 0; width: {Math.max(0, Math.min(100, (previewViewportW / (clampMaxW + 200)) * 100))}%;"></div>
								</div>
							</div>

							<div class="alert bg-base-100 text-sm mt-4">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
								<div>
									<h3 class="font-bold">How it works</h3>
									<div class="text-xs opacity-80">
										<p>The font size scales linearly between <strong>{clampMinF}px</strong> and <strong>{clampMaxF}px</strong> as the viewport width increases from <strong>{clampMinW}px</strong> to <strong>{clampMaxW}px</strong>.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
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

<style>
	/* Make the preview range input look better */
	.range {
		--range-shdw: 0 0 0 1px hsl(var(--p));
	}
</style>
