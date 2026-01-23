<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { 
		pxToRem, pxToEm, pxToVw, pxToVh, pxToPt, pxToPercent,
		formatNumber
	} from '$lib/utils/conversions';

	let inputValue = $state('16');
	let inputUnit = $state<'px' | 'rem' | 'em'>('px');
	let baseFontSize = $state(16);
	let parentFontSize = $state(16);
	let viewportWidth = $state(1920);
	let viewportHeight = $state(1080);
	let baseForPercent = $state(100);

	// Parse input
	let numValue = $derived(parseFloat(inputValue) || 0);

	// Convert to px first (base unit for calculations)
	let pxValue = $derived(() => {
		switch (inputUnit) {
			case 'rem': return numValue * baseFontSize;
			case 'em': return numValue * parentFontSize;
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
		percent: pxToPercent(pxValue(), baseForPercent),
	});

	function loadSample() {
		inputValue = '24';
		inputUnit = 'px';
	}

	function clearAll() {
		inputValue = '';
	}

	// Common viewport presets
	const viewportPresets = [
		{ label: '1920×1080', w: 1920, h: 1080 },
		{ label: '1440×900', w: 1440, h: 900 },
		{ label: '1366×768', w: 1366, h: 768 },
		{ label: '390×844 (Mobile)', w: 390, h: 844 },
		{ label: '768×1024 (Tablet)', w: 768, h: 1024 },
	];

	function setViewport(w: number, h: number) {
		viewportWidth = w;
		viewportHeight = h;
	}
</script>

<ToolWrapper
	keywords={['css units', 'px to rem', 'px to em', 'rem converter', 'viewport units', 'css calculator']}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input Section -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Input Value</h3>
				<div class="flex gap-2">
					<input
						type="number"
						bind:value={inputValue}
						placeholder="Enter value..."
						class="input input-bordered flex-1 font-mono text-lg"
					/>
					<select bind:value={inputUnit} class="select select-bordered w-24">
						<option value="px">px</option>
						<option value="rem">rem</option>
						<option value="em">em</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Settings -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">Base Settings</h3>
					<button 
						type="button" 
						class="btn btn-ghost btn-xs gap-1"
						onclick={() => {
							baseFontSize = 16;
							parentFontSize = 16;
							viewportWidth = 1920;
							viewportHeight = 1080;
							baseForPercent = 100;
						}}
					>
						<svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
						Reset
					</button>
				</div>
				<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div>
						<label class="label pb-1">
							<span class="label-text text-xs">Base Font Size (root)</span>
						</label>
						<div class="flex">
							<input
								type="number"
								bind:value={baseFontSize}
								class="input input-bordered input-sm flex-1 font-mono rounded-r-none"
								min="1"
							/>
							<span class="flex items-center px-3 bg-base-300 text-sm rounded-r-lg border border-l-0 border-base-300">px</span>
						</div>
					</div>
					<div>
						<label class="label pb-1">
							<span class="label-text text-xs">Parent Font Size (em)</span>
						</label>
						<div class="flex">
							<input
								type="number"
								bind:value={parentFontSize}
								class="input input-bordered input-sm flex-1 font-mono rounded-r-none"
								min="1"
							/>
							<span class="flex items-center px-3 bg-base-300 text-sm rounded-r-lg border border-l-0 border-base-300">px</span>
						</div>
					</div>
					<div>
						<label class="label pb-1">
							<span class="label-text text-xs">Viewport Width</span>
						</label>
						<div class="flex">
							<input
								type="number"
								bind:value={viewportWidth}
								class="input input-bordered input-sm flex-1 font-mono rounded-r-none"
								min="1"
							/>
							<span class="flex items-center px-3 bg-base-300 text-sm rounded-r-lg border border-l-0 border-base-300">px</span>
						</div>
					</div>
					<div>
						<label class="label pb-1">
							<span class="label-text text-xs">Viewport Height</span>
						</label>
						<div class="flex">
							<input
								type="number"
								bind:value={viewportHeight}
								class="input input-bordered input-sm flex-1 font-mono rounded-r-none"
								min="1"
							/>
							<span class="flex items-center px-3 bg-base-300 text-sm rounded-r-lg border border-l-0 border-base-300">px</span>
						</div>
					</div>
				</div>

				<!-- Viewport Presets -->
				<div class="mt-3">
					<span class="text-xs text-base-content/60 mr-2">Quick presets:</span>
					<div class="flex flex-wrap gap-1 mt-1">
						{#each viewportPresets as preset}
							<button
								class="btn btn-xs btn-ghost"
								class:btn-active={viewportWidth === preset.w && viewportHeight === preset.h}
								onclick={() => setViewport(preset.w, preset.h)}
							>
								{preset.label}
							</button>
						{/each}
					</div>
				</div>

				<!-- Percent Base -->
				<div class="mt-4 pt-3 border-t border-base-300">
					<label class="label pb-1">
						<span class="label-text text-xs">Base Value for % Calculation</span>
					</label>
					<div class="flex items-center gap-2">
						<input
							type="number"
							bind:value={baseForPercent}
							class="input input-bordered input-sm w-32 font-mono"
							min="0.01"
							step="1"
						/>
						<span class="text-sm text-base-content/60">px (100% of this value)</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if numValue}
			<div class="grid md:grid-cols-2 gap-4">
				<ConversionGroup title="Relative Units" icon="📐">
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
						description="Relative to root font size ({baseFontSize}px)"
					/>
					<ConversionCard 
						label="Em" 
						value={formatNumber(conversions.em)} 
						unit="em" 
						highlight={inputUnit === 'em'}
						description="Relative to parent font size ({parentFontSize}px)"
					/>
					<ConversionCard 
						label="Points" 
						value={formatNumber(conversions.pt)} 
						unit="pt" 
						description="Print unit (1pt = 1.333px)"
					/>
				</ConversionGroup>

				<ConversionGroup title="Viewport Units" icon="🖥️">
					<ConversionCard 
						label="Viewport Width" 
						value={formatNumber(conversions.vw)} 
						unit="vw" 
						description="1vw = {formatNumber(viewportWidth / 100)}px"
					/>
					<ConversionCard 
						label="Viewport Height" 
						value={formatNumber(conversions.vh)} 
						unit="vh" 
						description="1vh = {formatNumber(viewportHeight / 100)}px"
					/>
					<ConversionCard 
						label="Percentage" 
						value={formatNumber(conversions.percent)} 
						unit="%" 
						description="Relative to {baseForPercent}px base"
					/>
				</ConversionGroup>
			</div>

			<!-- Visual Preview -->
			<div class="card bg-base-200 rounded-2xl overflow-hidden">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Size Preview</h3>
					<div class="flex items-center gap-4">
						<div 
							class="bg-primary/20 border-2 border-primary rounded transition-all duration-300 flex items-center justify-center"
							style="width: {Math.min(Math.max(conversions.px, 8), 200)}px; height: {Math.min(Math.max(conversions.px, 8), 200)}px;"
						>
							<span class="text-xs text-primary font-mono">{formatNumber(conversions.px)}px</span>
						</div>
						<div class="text-sm text-base-content/60">
							<p>This square represents <strong>{formatNumber(conversions.px)}px</strong></p>
							<p class="text-xs mt-1">(capped at 200px for preview)</p>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body items-center text-center py-12">
					<span class="text-4xl mb-2">📐</span>
					<p class="text-base-content/60">Enter a value above to see conversions</p>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">CSS Units Reference</h4>
				<div class="mt-2 grid gap-2 text-sm text-base-content/70">
					<div><strong>px</strong> — Absolute pixels (device dependent)</div>
					<div><strong>rem</strong> — Relative to root element font-size</div>
					<div><strong>em</strong> — Relative to parent element font-size</div>
					<div><strong>vw</strong> — 1% of viewport width</div>
					<div><strong>vh</strong> — 1% of viewport height</div>
					<div><strong>pt</strong> — Points (1/72 of an inch, for print)</div>
					<div><strong>%</strong> — Percentage of parent/base value</div>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
