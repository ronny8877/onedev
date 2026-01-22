<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let previewText = $state('Gradient Text');
	let fontSize = $state(72);
	let fontWeight = $state(700);
	let fontFamily = $state('system-ui');
	
	// Gradient settings
	let gradientType = $state<'linear' | 'radial'>('linear');
	let angle = $state(135);
	let colorStops = $state([
		{ id: 1, color: '#667eea', position: 0 },
		{ id: 2, color: '#764ba2', position: 100 }
	]);
	let nextId = $state(3);

	// Presets
	const presets = [
		{ name: 'Purple Haze', colors: ['#667eea', '#764ba2'], angle: 135 },
		{ name: 'Sunset', colors: ['#f093fb', '#f5576c'], angle: 90 },
		{ name: 'Ocean', colors: ['#4facfe', '#00f2fe'], angle: 120 },
		{ name: 'Fire', colors: ['#f12711', '#f5af19'], angle: 45 },
		{ name: 'Mint', colors: ['#0ba360', '#3cba92'], angle: 160 },
		{ name: 'Candy', colors: ['#ff6a88', '#ff99ac'], angle: 90 },
		{ name: 'Neon', colors: ['#00f5d4', '#7209b7'], angle: 135 },
		{ name: 'Gold', colors: ['#f7971e', '#ffd200'], angle: 120 },
		{ name: 'Rainbow', colors: ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#9400d3'], angle: 90 },
		{ name: 'Northern Lights', colors: ['#43cea2', '#185a9d'], angle: 180 },
	];

	function applyPreset(preset: typeof presets[0]) {
		angle = preset.angle;
		colorStops = preset.colors.map((color, i) => ({
			id: nextId++,
			color,
			position: Math.round((i / (preset.colors.length - 1)) * 100)
		}));
	}

	function addColorStop() {
		const lastPos = colorStops[colorStops.length - 1]?.position || 0;
		const newPos = Math.min(lastPos + 20, 100);
		colorStops = [...colorStops, { id: nextId++, color: '#ffffff', position: newPos }];
	}

	function removeColorStop(id: number) {
		if (colorStops.length > 2) {
			colorStops = colorStops.filter(s => s.id !== id);
		}
	}

	function sortStops() {
		colorStops = [...colorStops].sort((a, b) => a.position - b.position);
	}

	let gradientValue = $derived(() => {
		const sorted = [...colorStops].sort((a, b) => a.position - b.position);
		const stops = sorted.map(s => `${s.color} ${s.position}%`).join(', ');
		if (gradientType === 'radial') {
			return `radial-gradient(circle, ${stops})`;
		}
		return `linear-gradient(${angle}deg, ${stops})`;
	});

	let cssOutput = $derived(`.gradient-text {
  background: ${gradientValue()};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`);
</script>

<ToolWrapper
	keywords={['gradient text', 'css gradient', 'text effects', 'gradient generator', 'css text']}
>
	<div class="flex flex-col gap-6">
		<!-- Live Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden">
			<div class="card-body p-8">
				<div class="flex items-center justify-between mb-6">
					<h3 class="text-sm font-semibold">Live Preview</h3>
					<input 
						type="text" 
						bind:value={previewText}
						placeholder="Your text here"
						class="input input-bordered input-sm w-48"
					/>
				</div>
				<div 
					class="flex justify-center items-center min-h-40 bg-base-300 rounded-2xl p-8 overflow-hidden"
				>
					<span 
						class="text-center leading-tight break-words max-w-full"
						style="
							background: {gradientValue()};
							-webkit-background-clip: text;
							-webkit-text-fill-color: transparent;
							background-clip: text;
							font-size: {fontSize}px;
							font-weight: {fontWeight};
							font-family: {fontFamily};
						"
					>
						{previewText || 'Preview'}
					</span>
				</div>
			</div>
		</div>

		<!-- Presets -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Presets</h3>
				<div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
					{#each presets as preset}
						<button
							class="btn btn-sm h-auto py-2 flex flex-col gap-1"
							onclick={() => applyPreset(preset)}
						>
							<div 
								class="w-full h-4 rounded"
								style="background: linear-gradient(90deg, {preset.colors.join(', ')})"
							></div>
							<span class="text-xs">{preset.name}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Gradient Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-4">Gradient Settings</h3>
					
					<!-- Type Toggle -->
					<div class="mb-4">
						<div class="text-xs text-base-content/60 mb-2">Type</div>
						<div class="flex gap-2">
							<button 
								class="btn btn-sm flex-1 {gradientType === 'linear' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => gradientType = 'linear'}
							>
								Linear
							</button>
							<button 
								class="btn btn-sm flex-1 {gradientType === 'radial' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => gradientType = 'radial'}
							>
								Radial
							</button>
						</div>
					</div>

					<!-- Angle (for linear) -->
					{#if gradientType === 'linear'}
						<div class="mb-4">
							<div class="flex justify-between text-xs text-base-content/60 mb-2">
								<span>Angle</span>
								<span class="font-mono">{angle}°</span>
							</div>
							<input type="range" bind:value={angle} min="0" max="360" class="range range-sm range-primary"/>
							<div class="flex justify-between text-xs text-base-content/50 mt-1">
								<span>0°</span>
								<span>180°</span>
								<span>360°</span>
							</div>
						</div>
					{/if}

					<!-- Color Stops -->
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-xs text-base-content/60">Color Stops ({colorStops.length})</span>
							<div class="flex gap-1">
								<button class="btn btn-xs btn-ghost" onclick={sortStops}>Sort</button>
								<button class="btn btn-xs btn-primary" onclick={addColorStop}>+ Add</button>
							</div>
						</div>
						
						<!-- Preview bar -->
						<div 
							class="h-8 rounded-lg mb-3 relative"
							style="background: {gradientValue()}"
						>
							{#each [...colorStops].sort((a, b) => a.position - b.position) as stop}
								<div 
									class="absolute top-full w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent"
									style="left: {stop.position}%; border-top-color: {stop.color}; transform: translateX(-50%);"
								></div>
							{/each}
						</div>

						<div class="space-y-2 max-h-64 overflow-y-auto">
							{#each colorStops as stop, index (stop.id)}
								<div class="flex items-center gap-2 p-2 rounded-lg bg-base-300">
									<input 
										type="color" 
										bind:value={stop.color}
										class="w-10 h-8 rounded cursor-pointer border-0"
									/>
									<input 
										type="text" 
										bind:value={stop.color}
										class="input input-bordered input-xs w-20 font-mono"
									/>
									<div class="flex-1">
										<input 
											type="range" 
											bind:value={stop.position}
											min="0" 
											max="100"
											class="range range-xs"
										/>
									</div>
									<span class="text-xs font-mono w-8">{stop.position}%</span>
									<button 
										class="btn btn-xs btn-ghost text-error"
										onclick={() => removeColorStop(stop.id)}
										disabled={colorStops.length <= 2}
									>
										✕
									</button>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Typography Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-4">Typography</h3>
					
					<!-- Font Size -->
					<div class="mb-4">
						<div class="flex justify-between text-xs text-base-content/60 mb-2">
							<span>Font Size</span>
							<span class="font-mono">{fontSize}px</span>
						</div>
						<input type="range" bind:value={fontSize} min="24" max="120" class="range range-sm range-secondary"/>
					</div>

					<!-- Font Weight -->
					<div class="mb-4">
						<div class="flex justify-between text-xs text-base-content/60 mb-2">
							<span>Font Weight</span>
							<span class="font-mono">{fontWeight}</span>
						</div>
						<input type="range" bind:value={fontWeight} min="100" max="900" step="100" class="range range-sm range-accent"/>
						<div class="flex justify-between text-xs text-base-content/50 mt-1">
							<span>Light</span>
							<span>Normal</span>
							<span>Bold</span>
						</div>
					</div>

					<!-- Font Family -->
					<div>
						<div class="text-xs text-base-content/60 mb-2">Font Family</div>
						<select bind:value={fontFamily} class="select select-bordered w-full select-sm">
							<option value="system-ui">System UI</option>
							<option value="'Inter', sans-serif">Inter</option>
							<option value="'Roboto', sans-serif">Roboto</option>
							<option value="'Poppins', sans-serif">Poppins</option>
							<option value="'Playfair Display', serif">Playfair Display</option>
							<option value="'Montserrat', sans-serif">Montserrat</option>
							<option value="Georgia, serif">Georgia</option>
							<option value="'Courier New', monospace">Courier New</option>
						</select>
					</div>

					<!-- Quick size presets -->
					<div class="mt-4 pt-4 border-t border-base-300">
						<div class="text-xs text-base-content/60 mb-2">Quick Sizes</div>
						<div class="flex flex-wrap gap-2">
							{#each [32, 48, 64, 80, 96, 120] as size}
								<button 
									class="btn btn-xs {fontSize === size ? 'btn-primary' : 'btn-ghost'}"
									onclick={() => fontSize = size}
								>
									{size}px
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- CSS Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={cssOutput} label="Copy CSS" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap">{cssOutput}</pre>
			</div>
		</div>

		<!-- Usage Tips -->
		<div class="card bg-info/10 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<span>💡</span> Pro Tips
				</h4>
				<ul class="mt-2 text-sm text-base-content/70 list-disc list-inside space-y-1">
					<li>Use <code>-webkit-background-clip: text</code> for Safari compatibility</li>
					<li>Add a fallback <code>color</code> for older browsers</li>
					<li>High contrast colors work best for readability</li>
					<li>Gradients work especially well with bold, large text</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
