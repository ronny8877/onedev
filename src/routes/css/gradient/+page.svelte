<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	type GradientType = 'linear' | 'radial' | 'conic';

	interface ColorStop {
		id: string;
		color: string;
		position: number;
	}

	// State
	let gradientType = $state<GradientType>('linear');
	let angle = $state(90);
	let radialShape = $state<'circle' | 'ellipse'>('circle');
	let radialPosition = $state({ x: 50, y: 50 });

	let colorStops = $state<ColorStop[]>([
		{ id: crypto.randomUUID(), color: '#667eea', position: 0 },
		{ id: crypto.randomUUID(), color: '#764ba2', position: 100 }
	]);

	let selectedStopId = $state<string | null>(colorStops[0]?.id ?? null);

	// Derived
	let sortedStops = $derived([...colorStops].sort((a, b) => a.position - b.position));
	
	let gradientCSS = $derived.by(() => {
		const stops = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
		
		switch (gradientType) {
			case 'linear':
				return `linear-gradient(${angle}deg, ${stops})`;
			case 'radial':
				return `radial-gradient(${radialShape} at ${radialPosition.x}% ${radialPosition.y}%, ${stops})`;
			case 'conic':
				return `conic-gradient(from ${angle}deg at ${radialPosition.x}% ${radialPosition.y}%, ${stops})`;
		}
	});

	let fullCSS = $derived(`background: ${gradientCSS};`);

	// Actions
	function addColorStop() {
		const newPosition = colorStops.length > 0 
			? Math.min(100, Math.max(...colorStops.map(s => s.position)) + 20)
			: 50;
		const newStop: ColorStop = {
			id: crypto.randomUUID(),
			color: getRandomColor(),
			position: Math.min(newPosition, 100)
		};
		colorStops = [...colorStops, newStop];
		selectedStopId = newStop.id;
	}

	function removeColorStop(id: string) {
		if (colorStops.length <= 2) return;
		colorStops = colorStops.filter(s => s.id !== id);
		if (selectedStopId === id) {
			selectedStopId = colorStops[0]?.id ?? null;
		}
	}

	function getRandomColor(): string {
		const colors = ['#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7', '#fa709a', '#fee140', '#a8edea', '#fed6e3'];
		return colors[Math.floor(Math.random() * colors.length)];
	}

	function updateStopColor(id: string, color: string) {
		colorStops = colorStops.map(s => s.id === id ? { ...s, color } : s);
	}

	function updateStopPosition(id: string, position: number) {
		colorStops = colorStops.map(s => s.id === id ? { ...s, position: Math.max(0, Math.min(100, position)) } : s);
	}

	// Presets
	const presets = [
		{ name: 'Sunset', stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }], type: 'linear' as GradientType, angle: 135 },
		{ name: 'Ocean', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }], type: 'linear' as GradientType, angle: 90 },
		{ name: 'Aqua', stops: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 100 }], type: 'linear' as GradientType, angle: 90 },
		{ name: 'Fresh', stops: [{ color: '#43e97b', position: 0 }, { color: '#38f9d7', position: 100 }], type: 'linear' as GradientType, angle: 135 },
		{ name: 'Warm', stops: [{ color: '#fa709a', position: 0 }, { color: '#fee140', position: 100 }], type: 'linear' as GradientType, angle: 90 },
		{ name: 'Rainbow', stops: [{ color: '#ff0000', position: 0 }, { color: '#ff7f00', position: 17 }, { color: '#ffff00', position: 33 }, { color: '#00ff00', position: 50 }, { color: '#0000ff', position: 67 }, { color: '#4b0082', position: 83 }, { color: '#9400d3', position: 100 }], type: 'conic' as GradientType, angle: 0 },
		{ name: 'Radial Glow', stops: [{ color: '#fff', position: 0 }, { color: '#667eea', position: 100 }], type: 'radial' as GradientType, angle: 0 },
		{ name: 'Dark Fade', stops: [{ color: '#1a1a2e', position: 0 }, { color: '#16213e', position: 50 }, { color: '#0f3460', position: 100 }], type: 'linear' as GradientType, angle: 180 },
	];

	function applyPreset(preset: typeof presets[0]) {
		gradientType = preset.type;
		angle = preset.angle;
		colorStops = preset.stops.map(s => ({ ...s, id: crypto.randomUUID() }));
		selectedStopId = colorStops[0]?.id ?? null;
	}

	let selectedStop = $derived(colorStops.find(s => s.id === selectedStopId));
</script>

<ToolWrapper
	keywords={['css gradient', 'gradient generator', 'linear gradient', 'radial gradient', 'conic gradient', 'css background', 'gradient maker']}
>
	<div class="flex flex-col gap-6">
		<!-- Live Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden">
			<div class="card-body p-6">
				<h3 class="text-sm font-semibold mb-4 text-center">Live Preview</h3>
				<div 
					class="w-full h-64 rounded-2xl transition-all duration-300 shadow-lg"
					style="background: {gradientCSS};"
				></div>
			</div>
		</div>

		<!-- Gradient Type Selector -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Gradient Type</h3>
				<div class="flex gap-2">
					{#each ['linear', 'radial', 'conic'] as type}
						<button
							class="btn btn-sm flex-1 transition-all duration-200 {gradientType === type ? 'btn-primary' : 'btn-ghost bg-base-300'}"
							onclick={() => gradientType = type as GradientType}
						>
							{type.charAt(0).toUpperCase() + type.slice(1)}
						</button>
					{/each}
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
							class="btn btn-sm btn-ghost gap-2 transition-all duration-200 hover:scale-105"
							onclick={() => applyPreset(preset)}
						>
							<span 
								class="w-4 h-4 rounded-full shadow-sm"
								style="background: linear-gradient(90deg, {preset.stops.map(s => s.color).join(', ')});"
							></span>
							{preset.name}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Direction/Position Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-4">
						{gradientType === 'linear' ? 'Direction' : gradientType === 'conic' ? 'Starting Angle' : 'Shape & Position'}
					</h3>
					
					<div class="space-y-4">
						{#if gradientType === 'linear' || gradientType === 'conic'}
							<!-- Angle Control -->
							<div>
								<div class="flex justify-between mb-2">
									<span class="text-sm">Angle</span>
									<span class="font-mono text-sm text-primary">{angle}°</span>
								</div>
								<input 
									type="range" 
									bind:value={angle} 
									min="0" 
									max="360" 
									class="range range-primary range-sm"
								/>
								<div class="flex justify-between mt-2 gap-2">
									{#each [0, 45, 90, 135, 180, 225, 270, 315] as deg}
										<button 
											class="btn btn-xs {angle === deg ? 'btn-primary' : 'btn-ghost'}"
											onclick={() => angle = deg}
										>
											{deg}°
										</button>
									{/each}
								</div>
							</div>
						{/if}

						{#if gradientType === 'radial'}
							<!-- Shape -->
							<div>
								<span class="text-sm mb-2 block">Shape</span>
								<div class="flex gap-2">
									<button 
										class="btn btn-sm flex-1 {radialShape === 'circle' ? 'btn-primary' : 'btn-ghost bg-base-300'}"
										onclick={() => radialShape = 'circle'}
									>
										Circle
									</button>
									<button 
										class="btn btn-sm flex-1 {radialShape === 'ellipse' ? 'btn-primary' : 'btn-ghost bg-base-300'}"
										onclick={() => radialShape = 'ellipse'}
									>
										Ellipse
									</button>
								</div>
							</div>
						{/if}

						{#if gradientType === 'radial' || gradientType === 'conic'}
							<!-- Position -->
							<div>
								<div class="flex justify-between mb-2">
									<span class="text-sm">Position X</span>
									<span class="font-mono text-sm text-secondary">{radialPosition.x}%</span>
								</div>
								<input 
									type="range" 
									bind:value={radialPosition.x} 
									min="0" 
									max="100" 
									class="range range-secondary range-sm"
								/>
							</div>
							<div>
								<div class="flex justify-between mb-2">
									<span class="text-sm">Position Y</span>
									<span class="font-mono text-sm text-accent">{radialPosition.y}%</span>
								</div>
								<input 
									type="range" 
									bind:value={radialPosition.y} 
									min="0" 
									max="100" 
									class="range range-accent range-sm"
								/>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- Color Stops -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold">Color Stops ({colorStops.length})</h3>
						<button class="btn btn-sm btn-primary" onclick={addColorStop}>+ Add</button>
					</div>
					
					<!-- Color Stop List -->
					<div class="space-y-2 max-h-64 overflow-y-auto">
						{#each sortedStops as stop (stop.id)}
							<div 
								class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 {selectedStopId === stop.id ? 'bg-primary/15 ring-2 ring-primary/30' : 'bg-base-300 hover:bg-base-300/70'}"
								onclick={() => selectedStopId = stop.id}
								role="button"
								tabindex="0"
							>
								<input 
									type="color" 
									value={stop.color}
									onchange={(e) => updateStopColor(stop.id, (e.target as HTMLInputElement).value)}
									class="w-10 h-10 rounded-lg cursor-pointer border-0"
									onclick={(e) => e.stopPropagation()}
								/>
								<div class="flex-1">
									<div class="font-mono text-sm">{stop.color}</div>
									<div class="text-xs text-base-content/50">{stop.position}%</div>
								</div>
								<button 
									class="btn btn-xs btn-ghost text-error"
									onclick={(e) => { e.stopPropagation(); removeColorStop(stop.id); }}
									disabled={colorStops.length <= 2}
								>
									✕
								</button>
							</div>
						{/each}
					</div>

					<!-- Selected Stop Controls -->
					{#if selectedStop}
						<div class="mt-4 pt-4 border-t border-base-300">
							<div class="space-y-3">
								<div>
									<div class="flex justify-between mb-1">
										<span class="text-sm">Position</span>
										<span class="font-mono text-sm text-primary">{selectedStop.position}%</span>
									</div>
									<input 
										type="range" 
										value={selectedStop.position}
										oninput={(e) => updateStopPosition(selectedStop!.id, parseInt((e.target as HTMLInputElement).value))}
										min="0" 
										max="100" 
										class="range range-primary range-sm"
									/>
								</div>
								<div>
									<span class="text-sm mb-1 block">Color</span>
									<div class="flex gap-2">
										<input 
											type="text" 
											value={selectedStop.color}
											oninput={(e) => updateStopColor(selectedStop!.id, (e.target as HTMLInputElement).value)}
											class="input input-bordered input-sm flex-1 font-mono"
										/>
										<input 
											type="color" 
											value={selectedStop.color}
											onchange={(e) => updateStopColor(selectedStop!.id, (e.target as HTMLInputElement).value)}
											class="w-10 h-8 rounded cursor-pointer border-0"
										/>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Gradient Bar Visual -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Color Stop Positions</h3>
				<div class="relative">
					<div 
						class="w-full h-8 rounded-xl"
						style="background: linear-gradient(90deg, {sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')});"
					></div>
					<div class="relative h-6 mt-2">
						{#each colorStops as stop (stop.id)}
							<div 
								class="absolute w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-125 {selectedStopId === stop.id ? 'ring-2 ring-primary' : ''}"
								style="left: calc({stop.position}% - 8px); background: {stop.color};"
								onclick={() => selectedStopId = stop.id}
								role="button"
								tabindex="0"
							></div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- CSS Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={fullCSS} label="Copy" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">{fullCSS}</pre>
			</div>
		</div>
	</div>
</ToolWrapper>
