<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateFilter, type FilterConfig } from '$lib/utils/css-utils';

	let config = $state<FilterConfig>({
		blur: 0,
		brightness: 100,
		contrast: 100,
		grayscale: 0,
		hueRotate: 0,
		invert: 0,
		saturate: 100,
		sepia: 0,
		opacity: 100
	});

	let cssOutput = $derived(generateFilter(config));

	function reset() {
		config = {
			blur: 0,
			brightness: 100,
			contrast: 100,
			grayscale: 0,
			hueRotate: 0,
			invert: 0,
			saturate: 100,
			sepia: 0,
			opacity: 100
		};
	}

	// Presets
	const presets = [
		{ name: 'Original', config: { blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, saturate: 100, sepia: 0, opacity: 100 } },
		{ name: 'Grayscale', config: { blur: 0, brightness: 100, contrast: 100, grayscale: 100, hueRotate: 0, invert: 0, saturate: 100, sepia: 0, opacity: 100 } },
		{ name: 'Sepia', config: { blur: 0, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, saturate: 100, sepia: 80, opacity: 100 } },
		{ name: 'Vibrant', config: { blur: 0, brightness: 110, contrast: 120, grayscale: 0, hueRotate: 0, invert: 0, saturate: 150, sepia: 0, opacity: 100 } },
		{ name: 'Muted', config: { blur: 0, brightness: 90, contrast: 90, grayscale: 30, hueRotate: 0, invert: 0, saturate: 70, sepia: 0, opacity: 100 } },
		{ name: 'Warm', config: { blur: 0, brightness: 105, contrast: 100, grayscale: 0, hueRotate: 10, invert: 0, saturate: 110, sepia: 20, opacity: 100 } },
		{ name: 'Cool', config: { blur: 0, brightness: 100, contrast: 110, grayscale: 0, hueRotate: 180, invert: 0, saturate: 80, sepia: 0, opacity: 100 } },
		{ name: 'Blur', config: { blur: 4, brightness: 100, contrast: 100, grayscale: 0, hueRotate: 0, invert: 0, saturate: 100, sepia: 0, opacity: 100 } },
	];

	function applyPreset(preset: typeof presets[0]) {
		config = { ...preset.config };
	}

	const filters = [
		{ key: 'blur', label: 'Blur', min: 0, max: 20, step: 1, unit: 'px', default: 0 },
		{ key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 5, unit: '%', default: 100 },
		{ key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 5, unit: '%', default: 100 },
		{ key: 'grayscale', label: 'Grayscale', min: 0, max: 100, step: 5, unit: '%', default: 0 },
		{ key: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, step: 10, unit: '°', default: 0 },
		{ key: 'invert', label: 'Invert', min: 0, max: 100, step: 5, unit: '%', default: 0 },
		{ key: 'saturate', label: 'Saturate', min: 0, max: 200, step: 5, unit: '%', default: 100 },
		{ key: 'sepia', label: 'Sepia', min: 0, max: 100, step: 5, unit: '%', default: 0 },
		{ key: 'opacity', label: 'Opacity', min: 0, max: 100, step: 5, unit: '%', default: 100 },
	];
</script>

<ToolWrapper
	title="CSS Filter Generator"
	description="Create CSS filter effects: blur, brightness, contrast, grayscale, and more. Live preview included."
	keywords={['css filter', 'image filter', 'blur', 'brightness', 'contrast', 'grayscale', 'css effects']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-4">
					<h3 class="text-sm font-semibold">Live Preview</h3>
					<button class="btn btn-sm btn-ghost" onclick={reset}>Reset</button>
				</div>
				<div class="grid sm:grid-cols-2 gap-4">
					<div class="text-center">
						<p class="text-xs text-base-content/60 mb-2">Original</p>
						<img 
							src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop" 
							alt="Original"
							class="w-full h-40 object-cover rounded-xl"
						/>
					</div>
					<div class="text-center">
						<p class="text-xs text-base-content/60 mb-2">With Filter</p>
						<img 
							src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop" 
							alt="Filtered"
							class="w-full h-40 object-cover rounded-xl transition-all duration-300"
							style="filter: {cssOutput};"
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- Presets -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Presets</h3>
				<div class="flex flex-wrap gap-2">
					{#each presets as preset}
						<button
							class="btn btn-sm btn-ghost"
							onclick={() => applyPreset(preset)}
						>
							{preset.name}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Filter Controls -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-4">Filters</h3>
				<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each filters as filter}
						{@const value = config[filter.key as keyof FilterConfig]}
						{@const isModified = value !== filter.default}
						<div class="p-3 rounded-xl {isModified ? 'bg-primary/10' : 'bg-base-300/50'}">
							<div class="flex items-center justify-between mb-2">
								<span class="text-sm font-medium">{filter.label}</span>
								<span class="font-mono text-xs text-primary">{value}{filter.unit}</span>
							</div>
							<input 
								type="range" 
								bind:value={config[filter.key as keyof FilterConfig]} 
								min={filter.min} 
								max={filter.max} 
								step={filter.step}
								class="range range-sm range-primary"
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={`filter: ${cssOutput};`} label="Copy" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm break-all">filter: {cssOutput};</pre>
			</div>
		</div>
	</div>
</ToolWrapper>
