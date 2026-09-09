<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { getAllAngleUnits, formatNumber, normalizeDegrees } from '$lib/utils/conversions';
	import { convertToolsContent } from '$lib/config/content/convert-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = convertToolsContent['angle'];

	let inputValue = $state('90');
	let inputUnit = $state<'deg' | 'rad' | 'grad' | 'turns'>('deg');

	// Parse input
	let numValue = $derived(parseFloat(inputValue) || 0);

	// Convert to degrees first (base unit)
	let degValue = $derived(() => {
		switch (inputUnit) {
			case 'rad': return numValue * (180 / Math.PI);
			case 'grad': return numValue * 0.9;
			case 'turns': return numValue * 360;
			default: return numValue; // deg
		}
	});

	let conversions = $derived(getAllAngleUnits(degValue()));
	let normalizedDeg = $derived(normalizeDegrees(degValue()));

	function loadSample() {
		inputValue = '180';
		inputUnit = 'deg';
	}

	function clearAll() {
		inputValue = '';
	}

	// Quick presets
	const presets = [
		{ label: '45°', deg: 45 },
		{ label: '90°', deg: 90 },
		{ label: '180°', deg: 180 },
		{ label: '270°', deg: 270 },
		{ label: '360°', deg: 360 },
		{ label: 'π rad', deg: 180 },
	];

	function setPreset(deg: number) {
		inputValue = deg.toString();
		inputUnit = 'deg';
	}

	// Calculate coordinates for arc visualization
	function polarToCartesian(angle: number, radius: number) {
		const angleInRadians = (angle - 90) * Math.PI / 180;
		return {
			x: 50 + radius * Math.cos(angleInRadians),
			y: 50 + radius * Math.sin(angleInRadians)
		};
	}

	function describeArc(startAngle: number, endAngle: number, radius: number) {
		const start = polarToCartesian(endAngle, radius);
		const end = polarToCartesian(startAngle, radius);
		const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
		return [
			"M", 50, 50,
			"L", start.x, start.y,
			"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
			"Z"
		].join(" ");
	}

	// Precomputed endpoint for SVG line
	let endPoint = $derived(polarToCartesian(normalizedDeg, 40));
</script>

<ToolWrapper
	keywords={['angle converter', 'degrees to radians', 'rad to deg', 'gradians', 'angle calculator']}
	lastUpdated={content.lastUpdated}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Input Section -->
		<div class="card bg-base-200 shadow-sm rounded-2xl border border-base-300">
			<div class="card-body p-4 sm:p-6">
				<div class="flex flex-col gap-6">
					<div class="form-control w-full">
						<div class="label pt-0 pb-2">
							<span class="label-text font-semibold text-base">Input Angle</span>
						</div>
						<div class="join w-full shadow-sm">
							<input
								type="number"
								bind:value={inputValue}
								placeholder="Enter value..."
								class="input input-lg input-bordered join-item flex-1 font-mono text-xl"
								step="any"
							/>
							<select bind:value={inputUnit} class="select select-lg select-bordered join-item font-mono w-32 text-lg font-semibold bg-base-100">
								<option value="deg">degrees</option>
								<option value="rad">radians</option>
								<option value="grad">gradians</option>
								<option value="turns">turns</option>
							</select>
						</div>
					</div>

					<div>
						<p class="text-xs text-base-content/60 font-medium mb-2 uppercase tracking-wider">Common Angles</p>
						<div class="flex flex-wrap gap-2">
							{#each presets as preset}
								<button
									class="btn btn-sm font-mono transition-all"
									onclick={() => setPreset(preset.deg)}
								>
									{preset.label}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if numValue || inputValue}
			<div class="grid md:grid-cols-2 gap-4">
				<!-- Visual Arc -->
				<div class="card bg-base-200 shadow-sm rounded-2xl border border-base-300">
					<div class="card-body p-4 items-center justify-center min-h-[300px]">
						<h3 class="text-sm font-semibold mb-6 w-full text-center uppercase tracking-wider opacity-70">Visual Representation</h3>
						<svg viewBox="0 0 100 100" class="w-64 h-64">
							<!-- Background circle -->
							<circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1" />
							
							<!-- Tick marks -->
							{#each [0, 90, 180, 270] as tick}
								{@const pos = polarToCartesian(tick, 42)}
								{@const innerPos = polarToCartesian(tick, 38)}
								<line 
									x1={innerPos.x} y1={innerPos.y} 
									x2={pos.x} y2={pos.y} 
									stroke="currentColor" 
									stroke-width="1" 
									opacity="0.3"
								/>
								<!-- Labels -->
								{#if tick === 0}<text x="50" y="8" font-size="4" text-anchor="middle" fill="currentColor" opacity="0.5" font-family="monospace">0°</text>{/if}
								{#if tick === 90}<text x="92" y="51" font-size="4" text-anchor="start" fill="currentColor" opacity="0.5" font-family="monospace">90°</text>{/if}
								{#if tick === 180}<text x="50" y="94" font-size="4" text-anchor="middle" fill="currentColor" opacity="0.5" font-family="monospace">180°</text>{/if}
								{#if tick === 270}<text x="8" y="51" font-size="4" text-anchor="end" fill="currentColor" opacity="0.5" font-family="monospace">270°</text>{/if}
							{/each}
							
							<!-- Arc -->
							{#if normalizedDeg > 0}
								<path 
									d={describeArc(0, Math.min(normalizedDeg, 360), 40)}
									fill="url(#arcGradient)"
									opacity="0.8"
								/>
							{/if}
							
							<!-- Angle line -->
							<line 
								x1="50" y1="50" 
								x2={endPoint.x} y2={endPoint.y} 
								stroke="hsl(var(--p))" 
								stroke-width="2"
								stroke-linecap="round"
							/>
							
							<!-- Center dot -->
							<circle cx="50" cy="50" r="2" fill="hsl(var(--p))" />
							
							<!-- Base line (0°) -->
							<line x1="50" y1="50" x2="50" y2="10" stroke="currentColor" stroke-width="1" opacity="0.3" stroke-dasharray="2,2" />
							
							<!-- Gradient definition -->
							<defs>
								<linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stop-color="hsl(var(--p))" stop-opacity="0.6" />
									<stop offset="100%" stop-color="hsl(var(--s))" stop-opacity="0.6" />
								</linearGradient>
							</defs>
						</svg>
						<div class="text-center mt-6">
							<span class="text-4xl font-bold font-mono tracking-tight">{formatNumber(normalizedDeg)}°</span>
							<p class="text-xs text-base-content/60 mt-1">
								{#if degValue() > 360 || degValue() < 0}
									(normalized from {formatNumber(degValue())}°)
								{:else}
									Normalized Angle
								{/if}
							</p>
						</div>
					</div>
				</div>

				<ConversionGroup title="Angle Units" icon="📐">
					<ConversionCard 
						label="Degrees" 
						value={formatNumber(conversions.deg)} 
						unit="°" 
						highlight={inputUnit === 'deg'}
						description="Full circle = 360°"
					/>
					<ConversionCard 
						label="Radians" 
						value={formatNumber(conversions.rad)} 
						unit="rad" 
						highlight={inputUnit === 'rad'}
						description="Full circle = 2π ≈ 6.283"
					/>
					<ConversionCard 
						label="Gradians" 
						value={formatNumber(conversions.grad)} 
						unit="grad" 
						highlight={inputUnit === 'grad'}
						description="Full circle = 400 grad"
					/>
					<ConversionCard 
						label="Turns" 
						value={formatNumber(conversions.turns)} 
						unit="turn" 
						highlight={inputUnit === 'turns'}
						description="Full circle = 1 turn"
					/>
				</ConversionGroup>
			</div>

			<!-- Common Angles Reference -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Common Angles</h3>
					<div class="overflow-x-auto">
						<table class="table table-sm">
							<thead>
								<tr>
									<th>Degrees</th>
									<th>Radians</th>
									<th>Gradians</th>
									<th>Turns</th>
								</tr>
							</thead>
							<tbody>
								{#each [30, 45, 60, 90, 180, 270, 360] as deg}
									{@const vals = getAllAngleUnits(deg)}
									{@const isHighlighted = Math.abs(normalizedDeg - deg) < 0.01}
									<tr class={isHighlighted ? 'bg-primary/10' : ''}>
										<td class="font-mono">{deg}°</td>
										<td class="font-mono">{formatNumber(vals.rad)}</td>
										<td class="font-mono">{formatNumber(vals.grad)}</td>
										<td class="font-mono">{formatNumber(vals.turns)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
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
					<div>π rad = 180°</div>
					<div>2π rad = 360°</div>
					<div>90° = π/2 rad</div>
					<div>100 grad = 90°</div>
					<div>1 turn = 360°</div>
					<div>1° ≈ 0.0175 rad</div>
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
