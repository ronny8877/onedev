<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { getAllLengthUnits, formatNumber } from '$lib/utils/conversions';
	import { convertToolsContent } from '$lib/config/content/convert-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = convertToolsContent['length'];

	let inputValue = $state('1');
	let inputUnit = $state<'mm' | 'cm' | 'inch' | 'ft' | 'm' | 'km' | 'px'>('inch');
	let dpi = $state(96);

	// Parse input
	let numValue = $derived(parseFloat(inputValue) || 0);

	// Convert to mm first (base unit)
	let mmValue = $derived(() => {
		switch (inputUnit) {
			case 'cm': return numValue * 10;
			case 'inch': return numValue * 25.4;
			case 'ft': return numValue * 25.4 * 12;
			case 'm': return numValue * 1000;
			case 'km': return numValue * 1000000;
			case 'px': return (numValue * 25.4) / dpi;
			default: return numValue; // mm
		}
	});

	let conversions = $derived(getAllLengthUnits(mmValue(), dpi));

	function loadSample() {
		inputValue = '2.54';
		inputUnit = 'cm';
	}

	function clearAll() {
		inputValue = '';
	}

	// DPI presets
	const dpiPresets = [
		{ label: '72 (Web Legacy)', value: 72 },
		{ label: '96 (CSS Standard)', value: 96 },
		{ label: '150 (Medium Print)', value: 150 },
		{ label: '300 (Print)', value: 300 },
		{ label: '326 (iPhone Retina)', value: 326 },
		{ label: '401 (iPhone Plus)', value: 401 },
	];
</script>

<ToolWrapper
	keywords={['length converter', 'mm to inch', 'cm to inch', 'pixels to mm', 'distance converter', 'unit converter']}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input Section -->
		<div class="card bg-base-200 shadow-sm rounded-2xl border border-base-300">
			<div class="card-body p-4 sm:p-6">
				<div class="flex flex-col gap-6">
					<!-- Main Input -->
					<div class="form-control w-full">
						<label class="label pt-0 pb-2">
							<span class="label-text font-semibold text-base">Input Length</span>
						</label>
						<div class="join w-full shadow-sm">
							<input
								type="number"
								bind:value={inputValue}
								placeholder="Enter value..."
								class="input input-lg input-bordered join-item flex-1 font-mono text-xl"
								step="any"
							/>
							<select bind:value={inputUnit} class="select select-lg select-bordered join-item font-mono w-32 text-lg font-semibold bg-base-100">
								<option value="mm">mm</option>
								<option value="cm">cm</option>
								<option value="inch">inch</option>
								<option value="ft">ft</option>
								<option value="m">m</option>
								<option value="km">km</option>
								<option value="px">px</option>
							</select>
						</div>
					</div>

					<!-- DPI Settings (Collapsible) -->
					<div class="collapse collapse-arrow bg-base-100 border border-base-300 rounded-xl">
						<input type="checkbox" /> 
						<div class="collapse-title text-sm font-medium flex items-center gap-2">
							<AppIcon name="monitor" size={18} /> Screen DPI / PPI Configuration
						</div>
						<div class="collapse-content">
							<div class="pt-2">
								<div class="flex items-center gap-3 mb-4">
									<input
										type="number"
										bind:value={dpi}
										class="input input-bordered input-sm w-24 font-mono"
										min="1"
									/>
									<span class="text-xs text-base-content/60">dots per inch (affects pixel conversions)</span>
								</div>
								
								<div>
									<p class="text-xs text-base-content/60 font-medium mb-2 uppercase tracking-wider">Common Presets</p>
									<div class="flex flex-wrap gap-2">
										{#each dpiPresets as preset}
											<button
												class="btn btn-sm font-mono transition-all"
												class:btn-neutral={dpi === preset.value}
												class:btn-ghost={dpi !== preset.value}
												class:bg-base-200={dpi !== preset.value}
												onclick={() => dpi = preset.value}
											>
												{preset.label}
											</button>
										{/each}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if numValue}
			<div class="grid md:grid-cols-2 gap-4">
				<ConversionGroup title="Metric" icon="📏">
					<ConversionCard 
						label="Millimeters" 
						value={formatNumber(conversions.mm)} 
						unit="mm" 
						highlight={inputUnit === 'mm'}
					/>
					<ConversionCard 
						label="Centimeters" 
						value={formatNumber(conversions.cm)} 
						unit="cm" 
						highlight={inputUnit === 'cm'}
					/>
					<ConversionCard 
						label="Meters" 
						value={formatNumber(conversions.m)} 
						unit="m" 
						highlight={inputUnit === 'm'}
					/>
					<ConversionCard 
						label="Kilometers" 
						value={formatNumber(conversions.km)} 
						unit="km" 
						highlight={inputUnit === 'km'}
					/>
				</ConversionGroup>

				<ConversionGroup title="Imperial & Screen" icon="📐">
					<ConversionCard 
						label="Inches" 
						value={formatNumber(conversions.inch)} 
						unit="in" 
						highlight={inputUnit === 'inch'}
					/>
					<ConversionCard 
						label="Feet" 
						value={formatNumber(conversions.ft)} 
						unit="ft" 
						highlight={inputUnit === 'ft'}
					/>
					<ConversionCard 
						label="Pixels" 
						value={formatNumber(conversions.px)} 
						unit="px" 
						highlight={inputUnit === 'px'}
						description="At {dpi} DPI"
					/>
				</ConversionGroup>
			</div>

			<!-- Visual Scale -->
			<div class="card bg-base-200 shadow-sm rounded-2xl border border-base-300 overflow-hidden">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Visual Scale (at {dpi} DPI)</h3>
					<div class="space-y-3">
						<!-- 1 inch reference -->
						<div class="flex items-center gap-3">
							<div 
								class="h-4 bg-primary/30 border border-primary rounded"
								style="width: {dpi}px; max-width: 100%;"
							></div>
							<span class="text-xs text-base-content/60 shrink-0">1 inch = {dpi}px</span>
						</div>
						<!-- 1 cm reference -->
						<div class="flex items-center gap-3">
							<div 
								class="h-4 bg-secondary/30 border border-secondary rounded"
								style="width: {dpi / 2.54}px; max-width: 100%;"
							></div>
							<span class="text-xs text-base-content/60 shrink-0">1 cm = {formatNumber(dpi / 2.54)}px</span>
						</div>
						<!-- Input value -->
						{#if conversions.px <= 500}
							<div class="flex items-center gap-3">
								<div 
									class="h-6 bg-accent/30 border-2 border-accent rounded flex items-center justify-center"
									style="width: {Math.max(conversions.px, 20)}px; max-width: 100%;"
								>
									<span class="text-xs font-mono">{formatNumber(conversions.px)}px</span>
								</div>
								<span class="text-xs text-base-content/60 shrink-0">Your value</span>
							</div>
						{:else}
							<p class="text-xs text-base-content/60">Value too large to display preview ({formatNumber(conversions.px)}px)</p>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body items-center text-center py-12">
					<AppIcon name="ruler" size={32} />
					<p class="text-base-content/60">Enter a value above to see conversions</p>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Quick Reference</h4>
				<div class="mt-2 grid grid-cols-2 gap-2 text-sm text-base-content/70">
					<div>1 inch = 25.4 mm</div>
					<div>1 inch = 2.54 cm</div>
					<div>1 foot = 12 inches</div>
					<div>1 meter = 100 cm</div>
					<div>1 km = 1000 m</div>
					<div>1 inch = 96px (CSS)</div>
				</div>
			</div>
		</div>

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
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
