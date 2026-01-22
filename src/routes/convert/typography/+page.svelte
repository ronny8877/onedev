<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { getAllTypographyUnits, formatNumber, lineHeightUnitlessToPx, lineHeightPxToUnitless } from '$lib/utils/conversions';

	let inputValue = $state('16');
	let inputUnit = $state<'px' | 'pt' | 'em' | 'rem'>('px');
	let baseFontSize = $state(16);

	// Line height inputs
	let lineHeightValue = $state('1.5');
	let lineHeightUnit = $state<'unitless' | 'px'>('unitless');
	let lineHeightFontSize = $state(16);

	// Parse input
	let numValue = $derived(parseFloat(inputValue) || 0);

	// Convert to px first (base unit)
	let pxValue = $derived(() => {
		switch (inputUnit) {
			case 'pt': return numValue / 0.75;
			case 'em': return numValue * baseFontSize;
			case 'rem': return numValue * baseFontSize;
			default: return numValue; // px
		}
	});

	let conversions = $derived(getAllTypographyUnits(pxValue(), baseFontSize));

	// Line height conversion
	let lineHeightNum = $derived(parseFloat(lineHeightValue) || 0);
	let lineHeightConverted = $derived(() => {
		if (lineHeightUnit === 'unitless') {
			return {
				unitless: lineHeightNum,
				px: lineHeightUnitlessToPx(lineHeightNum, lineHeightFontSize)
			};
		} else {
			return {
				unitless: lineHeightPxToUnitless(lineHeightNum, lineHeightFontSize),
				px: lineHeightNum
			};
		}
	});

	function loadSample() {
		inputValue = '24';
		inputUnit = 'px';
	}

	function clearAll() {
		inputValue = '';
	}

	// Font size presets (common web sizes)
	const fontSizePresets = [
		{ label: '12px', px: 12 },
		{ label: '14px', px: 14 },
		{ label: '16px', px: 16 },
		{ label: '18px', px: 18 },
		{ label: '24px', px: 24 },
		{ label: '32px', px: 32 },
		{ label: '48px', px: 48 },
	];

	function setFontPreset(px: number) {
		inputValue = px.toString();
		inputUnit = 'px';
	}
</script>

<ToolWrapper
	keywords={['typography converter', 'px to pt', 'em to px', 'line height calculator', 'font size converter']}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Font Size Input Section -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Font Size</h3>
				<div class="flex gap-2">
					<input
						type="number"
						bind:value={inputValue}
						placeholder="Enter value..."
						class="input input-bordered flex-1 font-mono text-lg"
						step="any"
					/>
					<select bind:value={inputUnit} class="select select-bordered w-24">
						<option value="px">px</option>
						<option value="pt">pt</option>
						<option value="em">em</option>
						<option value="rem">rem</option>
					</select>
				</div>
				<div class="mt-3 flex flex-wrap gap-1">
					{#each fontSizePresets as preset}
						<button
							class="btn btn-xs btn-ghost"
							onclick={() => setFontPreset(preset.px)}
						>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Base Font Size Setting -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Base Font Size (for em/rem calculations)</h3>
				<div class="flex items-center gap-3">
					<input
						type="number"
						bind:value={baseFontSize}
						class="input input-bordered input-sm w-24 font-mono"
						min="1"
					/>
					<span class="text-sm text-base-content/60">px</span>
					<div class="flex gap-1 ml-4">
						{#each [12, 14, 16, 18, 20] as size}
							<button
								class="btn btn-xs btn-ghost"
								class:btn-active={baseFontSize === size}
								onclick={() => baseFontSize = size}
							>
								{size}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Results -->
		{#if numValue}
			<div class="grid md:grid-cols-2 gap-4">
				<ConversionGroup title="Font Size Units" icon="🔤">
					<ConversionCard 
						label="Pixels" 
						value={formatNumber(conversions.px)} 
						unit="px" 
						highlight={inputUnit === 'px'}
						description="Absolute screen unit"
					/>
					<ConversionCard 
						label="Points" 
						value={formatNumber(conversions.pt)} 
						unit="pt" 
						highlight={inputUnit === 'pt'}
						description="Print unit (1pt ≈ 1.333px)"
					/>
					<ConversionCard 
						label="Em" 
						value={formatNumber(conversions.em)} 
						unit="em" 
						highlight={inputUnit === 'em'}
						description="Relative to parent ({baseFontSize}px)"
					/>
					<ConversionCard 
						label="Rem" 
						value={formatNumber(conversions.rem)} 
						unit="rem" 
						highlight={inputUnit === 'rem'}
						description="Relative to root ({baseFontSize}px)"
					/>
				</ConversionGroup>

				<!-- Font Preview -->
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<h3 class="text-sm font-semibold mb-3">Size Preview</h3>
						<div class="flex flex-col gap-4 items-center justify-center min-h-[150px]">
							<div 
								class="transition-all duration-300 text-center"
								style="font-size: {Math.min(Math.max(conversions.px, 8), 72)}px; line-height: 1.2;"
							>
								Aa Bb Cc
							</div>
							<div class="text-xs text-base-content/60">
								{formatNumber(conversions.px)}px / {formatNumber(conversions.pt)}pt
							</div>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body items-center text-center py-12">
					<span class="text-4xl mb-2">🔤</span>
					<p class="text-base-content/60">Enter a font size above to see conversions</p>
				</div>
			</div>
		{/if}

		<!-- Line Height Section -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Line Height Calculator</h3>
				<div class="grid sm:grid-cols-2 gap-4">
					<div>
						<label class="label pb-1">
							<span class="label-text text-xs">Line Height Value</span>
						</label>
						<div class="flex gap-2">
							<input
								type="number"
								bind:value={lineHeightValue}
								class="input input-bordered flex-1 font-mono"
								step="0.1"
							/>
							<select bind:value={lineHeightUnit} class="select select-bordered w-28">
								<option value="unitless">unitless</option>
								<option value="px">px</option>
							</select>
						</div>
					</div>
					<div>
						<label class="label pb-1">
							<span class="label-text text-xs">Font Size (for calculation)</span>
						</label>
						<div class="flex gap-2">
							<input
								type="number"
								bind:value={lineHeightFontSize}
								class="input input-bordered flex-1 font-mono"
								min="1"
							/>
							<span class="flex items-center text-sm text-base-content/60">px</span>
						</div>
					</div>
				</div>

				{#if lineHeightNum > 0}
					<div class="mt-4 grid sm:grid-cols-2 gap-4">
						<div class="p-3 rounded-xl bg-base-300/50">
							<div class="text-xs text-base-content/60 mb-1">Unitless</div>
							<code class="text-lg font-mono font-bold">
								{formatNumber(lineHeightConverted().unitless)}
							</code>
						</div>
						<div class="p-3 rounded-xl bg-base-300/50">
							<div class="text-xs text-base-content/60 mb-1">Pixels</div>
							<code class="text-lg font-mono font-bold">
								{formatNumber(lineHeightConverted().px)}px
							</code>
						</div>
					</div>

					<!-- Line Height Preview -->
					<div class="mt-4 p-4 rounded-xl bg-base-300/30">
						<div 
							class="text-sm transition-all"
							style="font-size: {lineHeightFontSize}px; line-height: {lineHeightConverted().unitless};"
						>
							<p>The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</p>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Type Scale Reference -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Common Type Scale</h3>
				<div class="space-y-2">
					{#each [
						{ name: 'Caption', px: 12 },
						{ name: 'Body Small', px: 14 },
						{ name: 'Body', px: 16 },
						{ name: 'Subtitle', px: 18 },
						{ name: 'Title', px: 24 },
						{ name: 'Heading', px: 32 },
						{ name: 'Display', px: 48 },
					] as scale}
						{@const typo = getAllTypographyUnits(scale.px, baseFontSize)}
						<div class="flex items-center gap-4 text-sm">
							<span class="w-24 text-base-content/60">{scale.name}</span>
							<span class="w-12 font-mono">{scale.px}px</span>
							<span class="w-12 font-mono text-base-content/60">{formatNumber(typo.pt)}pt</span>
							<span class="w-16 font-mono text-base-content/60">{formatNumber(typo.rem)}rem</span>
							<span style="font-size: {Math.min(scale.px, 32)}px; line-height: 1.2;">Aa</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Typography Tips</h4>
				<div class="mt-2 text-sm text-base-content/70 space-y-1">
					<p><strong>rem</strong> — Use for consistent spacing and sizing across your site.</p>
					<p><strong>em</strong> — Use for component-specific sizing that should scale with local font size.</p>
					<p><strong>Unitless line-height</strong> — Recommended (e.g., 1.5), scales with font size.</p>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
