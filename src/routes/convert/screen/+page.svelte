<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ConversionCard from '$lib/components/ui/ConversionCard.svelte';
	import ConversionGroup from '$lib/components/ui/ConversionGroup.svelte';
	import { getSizeFromResolution, getResolutionFromSize, formatNumber } from '$lib/utils/conversions';

	// Mode: resolution to size or size to resolution
	let mode = $state<'resolution' | 'size'>('resolution');

	// Resolution inputs
	let widthPx = $state(1920);
	let heightPx = $state(1080);

	// Physical size inputs
	let widthInches = $state(24);
	let heightInches = $state(13.5);
	let diagonalInches = $state(27);

	// DPI
	let dpi = $state(96);

	// Calculate results based on mode
	let sizeResult = $derived(getSizeFromResolution(widthPx, heightPx, dpi));
	let resolutionResult = $derived(getResolutionFromSize(widthInches, heightInches, dpi));

	// Calculate aspect ratio
	let aspectRatio = $derived(() => {
		if (mode === 'resolution') {
			const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
			const g = gcd(widthPx, heightPx);
			return `${widthPx / g}:${heightPx / g}`;
		} else {
			const ratio = widthInches / heightInches;
			if (Math.abs(ratio - 16/9) < 0.01) return '16:9';
			if (Math.abs(ratio - 4/3) < 0.01) return '4:3';
			if (Math.abs(ratio - 21/9) < 0.01) return '21:9';
			if (Math.abs(ratio - 1) < 0.01) return '1:1';
			return formatNumber(ratio, 2) + ':1';
		}
	});

	// Mega pixels
	let megapixels = $derived(mode === 'resolution' 
		? (widthPx * heightPx) / 1000000 
		: (resolutionResult.width * resolutionResult.height) / 1000000
	);

	function loadSample() {
		mode = 'resolution';
		widthPx = 2560;
		heightPx = 1440;
		dpi = 109;
	}

	function clearAll() {
		widthPx = 1920;
		heightPx = 1080;
		widthInches = 24;
		heightInches = 13.5;
		dpi = 96;
	}

	// Common resolution presets
	const resolutionPresets = [
		{ label: 'HD (720p)', w: 1280, h: 720 },
		{ label: 'Full HD (1080p)', w: 1920, h: 1080 },
		{ label: 'QHD (1440p)', w: 2560, h: 1440 },
		{ label: '4K UHD', w: 3840, h: 2160 },
		{ label: '5K', w: 5120, h: 2880 },
		{ label: 'iPhone 15 Pro', w: 1179, h: 2556 },
		{ label: 'MacBook Air 13"', w: 2560, h: 1664 },
	];

	// Common DPI presets
	const dpiPresets = [
		{ label: '72 (Legacy)', value: 72 },
		{ label: '96 (Standard)', value: 96 },
		{ label: '109 (27" QHD)', value: 109 },
		{ label: '163 (27" 4K)', value: 163 },
		{ label: '218 (24" 4K)', value: 218 },
		{ label: '326 (Retina)', value: 326 },
	];

	function setResolution(w: number, h: number) {
		widthPx = w;
		heightPx = h;
	}

	// Preview calculations
	let previewRatio = $derived(widthPx / heightPx);
	let previewWidth = $derived(Math.min(300, previewRatio * 150));
	let previewHeight = $derived(previewWidth / previewRatio);
</script>

<ToolWrapper
	title="Screen Resolution Calculator"
	description="Calculate physical screen dimensions from resolution and DPI, or vice versa. Find PPI for any display."
	keywords={['screen resolution', 'dpi calculator', 'ppi calculator', 'screen size', 'pixel density', 'monitor calculator']}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Mode Toggle -->
		<div class="flex justify-center">
			<div class="btn-group">
				<button 
					class="btn btn-sm"
					class:btn-active={mode === 'resolution'}
					onclick={() => mode = 'resolution'}
				>
					Resolution → Size
				</button>
				<button 
					class="btn btn-sm"
					class:btn-active={mode === 'size'}
					onclick={() => mode = 'size'}
				>
					Size → Resolution
				</button>
			</div>
		</div>

		{#if mode === 'resolution'}
			<!-- Resolution Input -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Screen Resolution</h3>
					<div class="flex items-center gap-2">
						<input
							type="number"
							bind:value={widthPx}
							class="input input-bordered w-28 font-mono"
							min="1"
						/>
						<span class="text-base-content/60">×</span>
						<input
							type="number"
							bind:value={heightPx}
							class="input input-bordered w-28 font-mono"
							min="1"
						/>
						<span class="text-sm text-base-content/60">pixels</span>
					</div>
					<div class="mt-3 flex flex-wrap gap-1">
						{#each resolutionPresets as preset}
							<button
								class="btn btn-xs btn-ghost"
								class:btn-active={widthPx === preset.w && heightPx === preset.h}
								onclick={() => setResolution(preset.w, preset.h)}
							>
								{preset.label}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<!-- Size Input -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Physical Size (inches)</h3>
					<div class="grid sm:grid-cols-2 gap-4">
						<div>
							<label class="label pb-1">
								<span class="label-text text-xs">Width</span>
							</label>
							<div class="input-group">
								<input
									type="number"
									bind:value={widthInches}
									class="input input-bordered w-full font-mono"
									step="0.1"
									min="0.1"
								/>
								<span class="bg-base-300 px-2">in</span>
							</div>
						</div>
						<div>
							<label class="label pb-1">
								<span class="label-text text-xs">Height</span>
							</label>
							<div class="input-group">
								<input
									type="number"
									bind:value={heightInches}
									class="input input-bordered w-full font-mono"
									step="0.1"
									min="0.1"
								/>
								<span class="bg-base-300 px-2">in</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- DPI Setting -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Pixel Density (DPI/PPI)</h3>
				<div class="flex items-center gap-3">
					<input
						type="number"
						bind:value={dpi}
						class="input input-bordered w-28 font-mono"
						min="1"
					/>
					<span class="text-sm text-base-content/60">dots per inch</span>
				</div>
				<div class="mt-3 flex flex-wrap gap-1">
					{#each dpiPresets as preset}
						<button
							class="btn btn-xs btn-ghost"
							class:btn-active={dpi === preset.value}
							onclick={() => dpi = preset.value}
						>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Results -->
		<div class="grid md:grid-cols-2 gap-4">
			{#if mode === 'resolution'}
				<ConversionGroup title="Physical Dimensions" icon="📐">
					<ConversionCard 
						label="Width" 
						value={formatNumber(sizeResult.widthInches)} 
						unit="in" 
						description="{formatNumber(sizeResult.widthInches * 2.54)} cm"
					/>
					<ConversionCard 
						label="Height" 
						value={formatNumber(sizeResult.heightInches)} 
						unit="in" 
						description="{formatNumber(sizeResult.heightInches * 2.54)} cm"
					/>
					<ConversionCard 
						label="Diagonal" 
						value={formatNumber(sizeResult.diagonalInches)} 
						unit="in" 
						description="{formatNumber(sizeResult.diagonalInches * 2.54)} cm"
						highlight
					/>
				</ConversionGroup>
			{:else}
				<ConversionGroup title="Resolution" icon="🖥️">
					<ConversionCard 
						label="Width" 
						value={resolutionResult.width} 
						unit="px"
					/>
					<ConversionCard 
						label="Height" 
						value={resolutionResult.height} 
						unit="px"
					/>
					<ConversionCard 
						label="Total Pixels" 
						value={(resolutionResult.width * resolutionResult.height).toLocaleString()} 
						unit="px"
						highlight
					/>
				</ConversionGroup>
			{/if}

			<ConversionGroup title="Display Info" icon="📊">
				<ConversionCard 
					label="Pixel Density" 
					value={dpi} 
					unit="PPI"
				/>
				<ConversionCard 
					label="Megapixels" 
					value={formatNumber(megapixels)} 
					unit="MP"
				/>
				<ConversionCard 
					label="Aspect Ratio" 
					value={aspectRatio()}
				/>
			</ConversionGroup>
		</div>

			<!-- Visual Representation -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Screen Preview (scaled)</h3>
				<div class="flex justify-center">
					<div 
						class="relative border-4 border-base-content/20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
						style="width: {previewWidth}px; height: {previewHeight}px;"
					>
						<div class="text-center">
							<div class="font-mono text-lg font-bold">{widthPx} × {heightPx}</div>
							<div class="text-xs text-base-content/60">{aspectRatio()}</div>
						</div>
						<!-- Diagonal line -->
						<svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
							<line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" stroke-width="0.5" opacity="0.3" stroke-dasharray="2,2" />
						</svg>
					</div>
				</div>
				<div class="text-center mt-2 text-xs text-base-content/60">
					Diagonal: {formatNumber(sizeResult.diagonalInches)}" at {dpi} PPI
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Understanding DPI vs PPI</h4>
				<div class="mt-2 text-sm text-base-content/70 space-y-1">
					<p><strong>DPI (Dots Per Inch)</strong> — Used for printing; dots of ink per inch.</p>
					<p><strong>PPI (Pixels Per Inch)</strong> — Screen pixel density; pixels per inch on display.</p>
					<p class="text-xs mt-2">For screens, DPI and PPI are often used interchangeably.</p>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
