<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { getAllTimeUnits, formatNumber, msToHumanReadable } from '$lib/utils/conversions';
	import { convertToolsContent } from '$lib/config/content/convert-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = convertToolsContent['time'];

	let inputValue = $state('3600000');
	let inputUnit = $state<'ms' | 'seconds' | 'minutes' | 'hours' | 'days'>('ms');

	// Parse input
	let numValue = $derived(parseFloat(inputValue) || 0);

	// Convert to ms first (base unit)
	let msValue = $derived(() => {
		switch (inputUnit) {
			case 'seconds': return numValue * 1000;
			case 'minutes': return numValue * 60000;
			case 'hours': return numValue * 3600000;
			case 'days': return numValue * 86400000;
			default: return numValue; // ms
		}
	});

	let conversions = $derived(getAllTimeUnits(msValue()));

	function loadSample() {
		inputValue = '86400000';
		inputUnit = 'ms';
	}

	function clearAll() {
		inputValue = '';
	}

	// Quick presets
	const presets = [
		{ label: '1 second', ms: 1000 },
		{ label: '1 minute', ms: 60000 },
		{ label: '1 hour', ms: 3600000 },
		{ label: '1 day', ms: 86400000 },
		{ label: '1 week', ms: 604800000 },
		{ label: '30 days', ms: 2592000000 },
	];

	function setPreset(ms: number) {
		inputValue = ms.toString();
		inputUnit = 'ms';
	}

	// Derived values for breakdown
	let totalMsValue = $derived(msValue());
	let breakdownDays = $derived(Math.floor(totalMsValue / 86400000));
	let breakdownHours = $derived(Math.floor((totalMsValue % 86400000) / 3600000));
	let breakdownMinutes = $derived(Math.floor((totalMsValue % 3600000) / 60000));
	let breakdownSeconds = $derived(Math.floor((totalMsValue % 60000) / 1000));
	let breakdownMs = $derived(totalMsValue % 1000);

	// Derived for timeline
	const DAY_MS = 86400000;
	let timelinePercentage = $derived(Math.min((totalMsValue / DAY_MS) * 100, 100));
</script>

<ToolWrapper
	keywords={['time converter', 'ms to seconds', 'hours to minutes', 'time calculator', 'duration converter']}
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
						step="any"
					/>
					<select bind:value={inputUnit} class="select select-bordered w-28">
						<option value="ms">ms</option>
						<option value="seconds">seconds</option>
						<option value="minutes">minutes</option>
						<option value="hours">hours</option>
						<option value="days">days</option>
					</select>
				</div>
				<div class="mt-3 flex flex-wrap gap-1">
					{#each presets as preset}
						<button
							class="btn btn-xs btn-ghost"
							onclick={() => setPreset(preset.ms)}
						>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if numValue}
			<!-- Human Readable & Timeline -->
			<div class="grid gap-6 md:grid-cols-2">
				<div class="card bg-primary/10 rounded-2xl">
					<div class="card-body p-4 justify-center">
						<h3 class="text-sm font-semibold mb-1 text-primary/70">Human Readable</h3>
						<code class="text-2xl font-mono font-bold text-primary break-all">
							{conversions.humanReadable}
						</code>
					</div>
				</div>

				<!-- Visual Timeline -->
				<div class="card bg-base-200 rounded-2xl overflow-hidden">
					<div class="card-body p-4">
						<h3 class="text-sm font-semibold mb-3">Timeline Visualization</h3>
						<div class="relative h-8 bg-base-300 rounded-full overflow-hidden">
							<div 
								class="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300"
								style="width: {timelinePercentage}%;"
							></div>
							<!-- Hour markers -->
							{#each Array(24) as _, i}
								<div 
									class="absolute top-0 bottom-0 w-px bg-base-content/10"
									style="left: {(i / 24) * 100}%;"
								></div>
							{/each}
						</div>
						<div class="flex justify-between mt-1 text-xs text-base-content/60">
							<span>0h</span>
							<span>12h</span>
							<span>24h</span>
						</div>
						<p class="text-xs text-base-content/60 mt-2 text-center">
							{#if msValue() > 86400000}
								Duration exceeds 24 hours ({formatNumber(conversions.days)} days)
							{:else}
								{formatNumber((msValue() / 86400000) * 100)}% of a day
							{/if}
						</p>
					</div>
				</div>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<ConversionGroup title="Time Units" icon="⏱️">
					<ConversionCard 
						label="Milliseconds" 
						value={formatNumber(conversions.ms)} 
						unit="ms" 
						highlight={inputUnit === 'ms'}
					/>
					<ConversionCard 
						label="Seconds" 
						value={formatNumber(conversions.seconds)} 
						unit="s" 
						highlight={inputUnit === 'seconds'}
					/>
					<ConversionCard 
						label="Minutes" 
						value={formatNumber(conversions.minutes)} 
						unit="min" 
						highlight={inputUnit === 'minutes'}
					/>
					<ConversionCard 
						label="Hours" 
						value={formatNumber(conversions.hours)} 
						unit="hr" 
						highlight={inputUnit === 'hours'}
					/>
					<ConversionCard 
						label="Days" 
						value={formatNumber(conversions.days)} 
						unit="d" 
						highlight={inputUnit === 'days'}
					/>
				</ConversionGroup>

				<ConversionGroup title="Breakdown" icon="📊">
					<ConversionCard 
						label="Days" 
						value={breakdownDays}
					/>
					<ConversionCard 
						label="Hours" 
						value={breakdownHours}
						description="(remainder after days)"
					/>
					<ConversionCard 
						label="Minutes" 
						value={breakdownMinutes}
						description="(remainder after hours)"
					/>
					<ConversionCard 
						label="Seconds" 
						value={breakdownSeconds}
						description="(remainder after minutes)"
					/>
					<ConversionCard 
						label="Milliseconds" 
						value={breakdownMs}
						description="(remainder)"
					/>
				</ConversionGroup>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body items-center text-center py-12">
					<span class="text-4xl mb-2">⏱️</span>
					<p class="text-base-content/60">Enter a value above to see conversions</p>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Quick Reference</h4>
				<div class="mt-2 grid grid-cols-2 gap-2 text-sm text-base-content/70">
					<div>1 second = 1,000 ms</div>
					<div>1 minute = 60 seconds</div>
					<div>1 hour = 60 minutes</div>
					<div>1 day = 24 hours</div>
					<div>1 week = 7 days</div>
					<div>1 year ≈ 365.25 days</div>
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
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
