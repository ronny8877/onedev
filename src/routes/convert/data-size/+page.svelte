<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { getAllDataSizeUnits, formatDataSize, formatNumber } from '$lib/utils/conversions';

	let inputValue = $state('1024');
	let inputUnit = $state<'bits' | 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'KiB' | 'MiB' | 'GiB' | 'TiB'>('bytes');
	let useBinary = $state(true); // true = 1024-based (IEC), false = 1000-based (SI)

	// Parse input
	let numValue = $derived(parseFloat(inputValue) || 0);

	// Convert to bytes first (base unit)
	let bytesValue = $derived(() => {
		const base = useBinary ? 1024 : 1000;
		switch (inputUnit) {
			case 'bits': return numValue / 8;
			case 'KB': return numValue * 1000;
			case 'MB': return numValue * 1000 ** 2;
			case 'GB': return numValue * 1000 ** 3;
			case 'TB': return numValue * 1000 ** 4;
			case 'KiB': return numValue * 1024;
			case 'MiB': return numValue * 1024 ** 2;
			case 'GiB': return numValue * 1024 ** 3;
			case 'TiB': return numValue * 1024 ** 4;
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
	title="Data Size Converter"
	description="Convert between data units: bits, bytes, KB, MB, GB, TB. Supports both decimal (SI) and binary (IEC) units."
	keywords={['data size converter', 'bytes to mb', 'kb to gb', 'file size calculator', 'binary vs decimal']}
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
					<select bind:value={inputUnit} class="select select-bordered w-24">
						<optgroup label="Base">
							<option value="bits">bits</option>
							<option value="bytes">bytes</option>
						</optgroup>
						<optgroup label="Decimal (SI)">
							<option value="KB">KB</option>
							<option value="MB">MB</option>
							<option value="GB">GB</option>
							<option value="TB">TB</option>
						</optgroup>
						<optgroup label="Binary (IEC)">
							<option value="KiB">KiB</option>
							<option value="MiB">MiB</option>
							<option value="GiB">GiB</option>
							<option value="TiB">TiB</option>
						</optgroup>
					</select>
				</div>
				<div class="mt-3 flex flex-wrap gap-1">
					{#each presets as preset}
						<button
							class="btn btn-xs btn-ghost"
							onclick={() => setPreset(preset.bytes)}
						>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if numValue}
			<!-- Formatted Result -->
			<div class="card bg-primary/10 rounded-2xl">
				<div class="card-body p-4 flex flex-row items-center justify-between gap-4">
					<div>
						<h3 class="text-sm font-semibold mb-1">Auto-formatted</h3>
						<div class="flex gap-4">
							<div>
								<span class="text-xs text-base-content/60">Decimal (SI)</span>
								<code class="block text-lg font-mono font-bold text-primary">
									{formatDataSize(bytesValue(), false)}
								</code>
							</div>
							<div>
								<span class="text-xs text-base-content/60">Binary (IEC)</span>
								<code class="block text-lg font-mono font-bold text-secondary">
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
			<div class="card bg-base-200 rounded-2xl overflow-hidden">
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
	</div>
</ToolWrapper>
