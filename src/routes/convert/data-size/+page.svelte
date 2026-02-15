<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { getAllDataSizeUnits, formatDataSize, formatNumber } from '$lib/utils/conversions';
	import { convertToolsContent } from '$lib/config/content/convert-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = convertToolsContent['data-size'];

	let inputValue = $state('1024');
	let inputUnit = $state<'bits' | 'nibbles' | 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB'>('bytes');
	let useBinary = $state(true); // true = 1024-based (IEC), false = 1000-based (SI)

	// Parse input
	let numValue = $derived(parseFloat(inputValue) || 0);

	// Convert to bytes first (base unit)
	let bytesValue = $derived(() => {
		switch (inputUnit) {
			case 'bits': return numValue / 8;
			case 'nibbles': return numValue / 2;
			case 'KB': return numValue * 1000;
			case 'MB': return numValue * 1000 ** 2;
			case 'GB': return numValue * 1000 ** 3;
			case 'TB': return numValue * 1000 ** 4;
			case 'PB': return numValue * 1000 ** 5;
			case 'KiB': return numValue * 1024;
			case 'MiB': return numValue * 1024 ** 2;
			case 'GiB': return numValue * 1024 ** 3;
			case 'TiB': return numValue * 1024 ** 4;
			case 'PiB': return numValue * 1024 ** 5;
			default: return numValue; // bytes
		}
	});

	let conversions = $derived(getAllDataSizeUnits(bytesValue()));

	function loadSample() {
		inputValue = '1073741824';
		inputUnit = 'bytes';
	}

	function clearAll() {
		inputValue = '';
	}

	// Quick presets
	const presets = [
		{ label: '1 Nibble', bytes: 0.5 },
		{ label: '1 KB', bytes: 1000 },
		{ label: '1 KiB', bytes: 1024 },
		{ label: '1 MB', bytes: 1000000 },
		{ label: '1 MiB', bytes: 1048576 },
		{ label: '1 GB', bytes: 1000000000 },
		{ label: '1 GiB', bytes: 1073741824 },
	];

	function setPreset(bytes: number) {
		inputValue = bytes.toString();
		inputUnit = 'bytes';
	}

	// Derived values for visualization
	let gbDecimal = $derived(conversions.GB);
	let gbBinary = $derived(conversions.GiB);
	let sizeDifference = $derived(gbDecimal > 0 ? ((gbDecimal - gbBinary) / gbDecimal * 100) : 0);
</script>

<ToolWrapper
	keywords={['data size converter', 'bytes to mb', 'kb to gb', 'file size calculator', 'binary vs decimal', 'nibbles']}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />


		<!-- Input Section -->
		<div class="card bg-base-200 shadow-sm rounded-2xl border border-base-300">
			<div class="card-body p-4 sm:p-6">
				<div class="flex flex-col gap-6">
					<div class="form-control w-full">
						<label class="label pt-0 pb-2">
							<span class="label-text font-semibold text-base">Input Size</span>
						</label>
						<div class="join w-full shadow-sm">
							<input
								type="number"
								bind:value={inputValue}
								placeholder="Enter value..."
								class="input input-lg input-bordered join-item flex-1 font-mono text-xl"
								step="any"
							/>
							<select bind:value={inputUnit} class="select select-lg select-bordered join-item font-mono w-40 text-lg font-semibold bg-base-100">
								<optgroup label="Base">
									<option value="bits">bits</option>
									<option value="nibbles">nibbles</option>
									<option value="bytes">bytes</option>
								</optgroup>
								<optgroup label="Decimal (SI)">
									<option value="KB">KB</option>
									<option value="MB">MB</option>
									<option value="GB">GB</option>
									<option value="TB">TB</option>
									<option value="PB">PB</option>
								</optgroup>
								<optgroup label="Binary (IEC)">
									<option value="KiB">KiB</option>
									<option value="MiB">MiB</option>
									<option value="GiB">GiB</option>
									<option value="TiB">TiB</option>
									<option value="PiB">PiB</option>
								</optgroup>
							</select>
						</div>
					</div>

					<div>
						<p class="text-xs text-base-content/60 font-medium mb-2 uppercase tracking-wider">Quick Presets</p>
						<div class="flex flex-wrap gap-2">
							{#each presets as preset}
								<button
									class="btn btn-sm font-mono transition-all"
									onclick={() => setPreset(preset.bytes)}
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
		{#if numValue}
			<!-- Formatted Result -->
			<div class="card bg-base-200 shadow-sm border border-base-300 rounded-2xl">
				<div class="card-body p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
					<div class="w-full">
						<h3 class="text-sm font-semibold mb-3 uppercase tracking-wider opacity-70">Auto-formatted</h3>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div class="bg-base-100 p-4 rounded-xl border border-base-200">
								<span class="text-xs text-base-content/60 block mb-1">Decimal (SI)</span>
								<code class="block text-2xl font-mono font-bold text-primary">
									{formatDataSize(bytesValue(), false)}
								</code>
							</div>
							<div class="bg-base-100 p-4 rounded-xl border border-base-200">
								<span class="text-xs text-base-content/60 block mb-1">Binary (IEC)</span>
								<code class="block text-2xl font-mono font-bold text-secondary">
									{formatDataSize(bytesValue(), true)}
								</code>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="grid md:grid-cols-2 gap-4">
				<ConversionGroup title="Decimal Units (×1000)" icon="📊" description="SI standard, used by HDD manufacturers">
					<ConversionCard 
						label="Bits" 
						value={formatNumber(conversions.bits)} 
						unit="bits" 
						highlight={inputUnit === 'bits'}
					/>
					<ConversionCard 
						label="Bytes" 
						value={formatNumber(conversions.bytes)} 
						unit="B" 
						highlight={inputUnit === 'bytes'}
					/>
					<ConversionCard 
						label="Kilobytes" 
						value={formatNumber(conversions.KB)} 
						unit="KB" 
						highlight={inputUnit === 'KB'}
					/>
					<ConversionCard 
						label="Megabytes" 
						value={formatNumber(conversions.MB)} 
						unit="MB" 
						highlight={inputUnit === 'MB'}
					/>
					<ConversionCard 
						label="Gigabytes" 
						value={formatNumber(conversions.GB)} 
						unit="GB" 
						highlight={inputUnit === 'GB'}
					/>
					<ConversionCard 
						label="Terabytes" 
						value={formatNumber(conversions.TB)} 
						unit="TB" 
						highlight={inputUnit === 'TB'}
					/>
				</ConversionGroup>

				<ConversionGroup title="Binary Units (×1024)" icon="💾" description="IEC standard, used by RAM and OSes">
					<ConversionCard 
						label="Bits" 
						value={formatNumber(conversions.bits)} 
						unit="bits" 
						highlight={inputUnit === 'bits'}
					/>
					<ConversionCard 
						label="Bytes" 
						value={formatNumber(conversions.bytes)} 
						unit="B" 
						highlight={inputUnit === 'bytes'}
					/>
					<ConversionCard 
						label="Kibibytes" 
						value={formatNumber(conversions.KiB)} 
						unit="KiB" 
						highlight={inputUnit === 'KiB'}
					/>
					<ConversionCard 
						label="Mebibytes" 
						value={formatNumber(conversions.MiB)} 
						unit="MiB" 
						highlight={inputUnit === 'MiB'}
					/>
					<ConversionCard 
						label="Gibibytes" 
						value={formatNumber(conversions.GiB)} 
						unit="GiB" 
						highlight={inputUnit === 'GiB'}
					/>
					<ConversionCard 
						label="Tebibytes" 
						value={formatNumber(conversions.TiB)} 
						unit="TiB" 
						highlight={inputUnit === 'TiB'}
					/>
				</ConversionGroup>
			</div>

				<!-- Visual Comparison -->
			<div class="card bg-base-200 shadow-sm rounded-2xl border border-base-300 overflow-hidden">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Decimal vs Binary Difference</h3>
					<div class="space-y-3">
						<div class="flex items-center gap-3">
							<div class="w-20 text-sm text-right">Decimal</div>
							<div class="flex-1 h-6 bg-base-300 rounded-full overflow-hidden">
								<div class="h-full bg-primary" style="width: 100%;"></div>
							</div>
							<div class="w-24 text-sm font-mono">{formatNumber(gbDecimal)} GB</div>
						</div>
						
						<div class="flex items-center gap-3">
							<div class="w-20 text-sm text-right">Binary</div>
							<div class="flex-1 h-6 bg-base-300 rounded-full overflow-hidden">
								<div class="h-full bg-secondary" style="width: {100 - Math.abs(sizeDifference)}%;"></div>
							</div>
							<div class="w-24 text-sm font-mono">{formatNumber(gbBinary)} GiB</div>
						</div>

						<p class="text-xs text-base-content/60 text-center mt-2">
							Binary is ~{formatNumber(Math.abs(sizeDifference))}% {sizeDifference > 0 ? 'smaller' : 'larger'} than decimal representation
						</p>
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body items-center text-center py-12">
					<span class="text-4xl mb-2">💾</span>
					<p class="text-base-content/60">Enter a value above to see conversions</p>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Decimal vs Binary</h4>
				<div class="mt-2 text-sm text-base-content/70 space-y-2">
					<p><strong>Decimal (SI):</strong> 1 KB = 1,000 bytes. Used by hard drive manufacturers.</p>
					<p><strong>Binary (IEC):</strong> 1 KiB = 1,024 bytes. Used by RAM, operating systems.</p>
					<p class="text-xs">This is why a "1 TB" drive shows less space in your OS!</p>
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
