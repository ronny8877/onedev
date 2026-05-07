<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { 
		getAllNumberBases, 
		decimalToBinary, decimalToHex, decimalToOctal,
		binaryToDecimal, hexToDecimal, octalToDecimal
	} from '$lib/utils/conversions';
	import { convertToolsContent } from '$lib/config/content/convert-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = convertToolsContent['number-base'];

	let inputValue = $state('255');
	let inputBase = $state<'decimal' | 'binary' | 'hex' | 'octal'>('decimal');

	// Parse input to decimal
	let decimalValue = $derived(() => {
		const cleaned = inputValue.trim();
		if (!cleaned) return NaN;
		
		switch (inputBase) {
			case 'binary': return binaryToDecimal(cleaned);
			case 'hex': return hexToDecimal(cleaned);
			case 'octal': return octalToDecimal(cleaned);
			default: {
				const parsed = parseInt(cleaned, 10);
				return parsed >= 0 ? parsed : NaN;
			}
		}
	});

	let isValid = $derived(!isNaN(decimalValue()) && decimalValue() >= 0);
	let conversions = $derived(isValid ? getAllNumberBases(decimalValue()) : null);

	// Error message for invalid input
	let errorMessage = $derived(() => {
		if (!inputValue.trim()) return '';
		if (inputBase === 'binary' && !/^[01]+$/.test(inputValue.trim())) return 'Binary only uses 0 and 1';
		if (inputBase === 'hex' && !/^[0-9A-Fa-f]+$/.test(inputValue.trim())) return 'Hex uses 0-9 and A-F';
		if (inputBase === 'octal' && !/^[0-7]+$/.test(inputValue.trim())) return 'Octal only uses 0-7';
		if (inputBase === 'decimal' && !/^\d+$/.test(inputValue.trim())) return 'Enter a positive integer';
		if (!isValid) return 'Invalid number';
		return '';
	});

	function loadSample() {
		inputValue = '42';
		inputBase = 'decimal';
	}

	function clearAll() {
		inputValue = '';
	}

	// Quick presets
	const presets = [
		{ label: '8', value: '8', base: 'decimal' as const },
		{ label: '16', value: '16', base: 'decimal' as const },
		{ label: '255', value: '255', base: 'decimal' as const },
		{ label: '256', value: '256', base: 'decimal' as const },
		{ label: 'FF', value: 'FF', base: 'hex' as const },
		{ label: '1010', value: '1010', base: 'binary' as const },
	];

	function setPreset(value: string, base: 'decimal' | 'binary' | 'hex' | 'octal') {
		inputValue = value;
		inputBase = base;
	}

	// Format binary with grouping
	function formatBinary(bin: string): string {
		if (!bin) return '';
		// Pad to multiple of 4
		const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, '0');
		// Split into groups of 4
		return padded.match(/.{1,4}/g)?.join(' ') || bin;
	}

	// Precomputed binary string and bits array for visualization
	let binaryPadded = $derived(conversions ? (conversions.binary || '0').padStart(8, '0') : '00000000');
	let bitsArray = $derived(binaryPadded.slice(-32).split(''));
</script>

<ToolWrapper
	keywords={['number base converter', 'binary to decimal', 'hex to decimal', 'decimal to binary', 'base converter']}
	lastUpdated={content.lastUpdated}
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
						type="text"
						bind:value={inputValue}
						placeholder="Enter number..."
						class="input input-bordered flex-1 font-mono text-lg uppercase"
						class:input-error={errorMessage()}
					/>
					<select bind:value={inputBase} class="select select-bordered w-28">
						<option value="decimal">Decimal</option>
						<option value="binary">Binary</option>
						<option value="hex">Hex</option>
						<option value="octal">Octal</option>
					</select>
				</div>
				{#if errorMessage()}
					<p class="text-error text-sm mt-2">{errorMessage()}</p>
				{/if}
				<div class="mt-3 flex flex-wrap gap-1">
					{#each presets as preset}
						<button
							class="btn btn-xs btn-ghost font-mono"
							onclick={() => setPreset(preset.value, preset.base)}
						>
							{preset.value} ({preset.base.slice(0, 3)})
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if isValid && conversions}
			<div class="grid md:grid-cols-2 gap-4">
				<ConversionGroup title="Number Bases" icon="🔢">
					<ConversionCard 
						label="Decimal (Base 10)" 
						value={conversions.decimal.toLocaleString()} 
						highlight={inputBase === 'decimal'}
						description="Standard number system"
					/>
					<ConversionCard 
						label="Hexadecimal (Base 16)" 
						value={conversions.hex || '0'} 
						highlight={inputBase === 'hex'}
						description="Common in programming"
					/>
					<ConversionCard 
						label="Octal (Base 8)" 
						value={conversions.octal || '0'} 
						highlight={inputBase === 'octal'}
						description="Unix permissions"
					/>
				</ConversionGroup>

				<ConversionGroup title="Binary (Base 2)" icon="💻">
					<div class="p-3 rounded-xl bg-base-300/50">
						<div class="text-xs font-medium text-base-content/60 uppercase tracking-wide mb-2">
							Binary {inputBase === 'binary' ? '(input)' : ''}
						</div>
						<code class="text-lg font-mono font-semibold break-all">
							{formatBinary(conversions.binary || '0')}
						</code>
						<div class="text-xs text-base-content/50 mt-2">
							{conversions.binary?.length || 1} bits
						</div>
					</div>
				</ConversionGroup>
			</div>

				<!-- Bit Visualization -->
			<div class="card bg-base-200 rounded-2xl overflow-hidden">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Bit Visualization</h3>
					<div class="overflow-x-auto">
						<div class="flex gap-1 min-w-fit">
							{#each bitsArray as bit, i}
								<div 
									class="w-8 h-10 rounded flex items-center justify-center font-mono text-sm transition-all"
									class:bg-primary={bit === '1'}
									class:text-primary-content={bit === '1'}
									class:bg-base-300={bit === '0'}
								>
									{bit}
								</div>
								{#if (bitsArray.length - i - 1) % 4 === 0 && i < bitsArray.length - 1}
									<div class="w-1"></div>
								{/if}
							{/each}
						</div>
						<div class="flex gap-1 mt-1 min-w-fit">
							{#each bitsArray as _, i}
								<div class="w-8 text-center text-xs text-base-content/40">
									{bitsArray.length - i - 1}
								</div>
								{#if (bitsArray.length - i - 1) % 4 === 0 && i < bitsArray.length - 1}
									<div class="w-1"></div>
								{/if}
							{/each}
						</div>
					</div>
					<p class="text-xs text-base-content/60 mt-2">
						Each bit position represents 2^n. Value = Σ(bit × 2^position)
					</p>
				</div>
			</div>

			<!-- Powers of 2 Reference -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Powers of 2 Reference</h3>
					<div class="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-sm">
						{#each [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768] as power, i}
							{@const isPowerMatch = conversions.decimal === power}
							<div class="p-2 rounded-lg transition-colors {isPowerMatch ? 'bg-primary/20' : ''}">
								<div class="text-xs text-base-content/50">2^{i}</div>
								<div class="font-mono font-medium">{power}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if inputValue.trim()}
			<div class="card bg-error/10 rounded-2xl">
				<div class="card-body items-center text-center py-8">
					<span class="text-3xl mb-2">⚠️</span>
					<p class="text-error">{errorMessage() || 'Invalid input'}</p>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body items-center text-center py-12">
					<span class="text-4xl mb-2">🔢</span>
					<p class="text-base-content/60">Enter a number above to see conversions</p>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Quick Reference</h4>
				<div class="mt-2 grid grid-cols-2 gap-2 text-sm text-base-content/70">
					<div><strong>Binary:</strong> 0, 1</div>
					<div><strong>Octal:</strong> 0-7</div>
					<div><strong>Decimal:</strong> 0-9</div>
					<div><strong>Hex:</strong> 0-9, A-F</div>
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
