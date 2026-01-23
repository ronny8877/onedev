<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateBoxShadow, type BoxShadowConfig } from '$lib/utils/css-utils';

	let shadows = $state<BoxShadowConfig[]>([
		{ x: 0, y: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)', inset: false },
		{ x: 0, y: 2, blur: 4, spread: -2, color: 'rgba(0, 0, 0, 0.1)', inset: false }
	]);

	let selectedShadow = $state(0);
	let cssOutput = $derived(generateBoxShadow(shadows));

	function addShadow() {
		shadows = [...shadows, { x: 0, y: 4, blur: 8, spread: 0, color: 'rgba(0, 0, 0, 0.15)', inset: false }];
		selectedShadow = shadows.length - 1;
	}

	function removeShadow(index: number) {
		if (shadows.length > 1) {
			shadows = shadows.filter((_, i) => i !== index);
			if (selectedShadow >= shadows.length) selectedShadow = shadows.length - 1;
		}
	}

	// Presets
	const presets = [
		{ name: 'Subtle', shadows: [{ x: 0, y: 1, blur: 3, spread: 0, color: 'rgba(0, 0, 0, 0.1)', inset: false }] },
		{ name: 'Elevated', shadows: [{ x: 0, y: 4, blur: 6, spread: -1, color: 'rgba(0, 0, 0, 0.1)', inset: false }, { x: 0, y: 2, blur: 4, spread: -2, color: 'rgba(0, 0, 0, 0.1)', inset: false }] },
		{ name: 'Floating', shadows: [{ x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)', inset: false }, { x: 0, y: 4, blur: 6, spread: -4, color: 'rgba(0, 0, 0, 0.1)', inset: false }] },
		{ name: 'Inset', shadows: [{ x: 0, y: 2, blur: 4, spread: 0, color: 'rgba(0, 0, 0, 0.2)', inset: true }] },
		{ name: 'Glow', shadows: [{ x: 0, y: 0, blur: 20, spread: 0, color: 'rgba(59, 130, 246, 0.5)', inset: false }] },
		{ name: 'Hard', shadows: [{ x: 4, y: 4, blur: 0, spread: 0, color: 'rgba(0, 0, 0, 0.25)', inset: false }] },
	];

	function applyPreset(preset: typeof presets[0]) {
		shadows = preset.shadows.map((s, i) => ({ ...s }));
		selectedShadow = 0;
	}

	let current = $derived(shadows[selectedShadow] || shadows[0]);
</script>

<ToolWrapper
	keywords={['box shadow', 'css shadow', 'shadow generator', 'drop shadow', 'css effects']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden">
			<div class="card-body p-8">
				<h3 class="text-sm font-semibold mb-6 text-center">Live Preview</h3>
				<div class="flex justify-center bg-base-300 rounded-xl p-8">
					<div 
						class="w-48 h-48 bg-base-100 rounded-2xl flex items-center justify-center transition-shadow duration-200"
						style="box-shadow: {cssOutput};"
					>
						<span class="text-sm text-base-content/60">Preview</span>
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

		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Shadow List -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold">Shadows ({shadows.length})</h3>
						<button class="btn btn-sm btn-primary" onclick={addShadow}>+ Add</button>
					</div>
					<div class="space-y-2">
						{#each shadows as shadow, index}
							<div 
								class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border border-transparent {selectedShadow === index ? 'bg-primary/10 border-primary/20' : 'bg-base-300 hover:bg-base-300/70'}"
								onclick={() => selectedShadow = index}
								role="button"
								tabindex="0"
								onkeydown={(e) => e.key === 'Enter' && (selectedShadow = index)}
							>
								<div class="flex items-center gap-3">
									<!-- Mini Preview with Checkerboard -->
									<div class="w-10 h-10 rounded-lg bg-base-100 relative overflow-hidden ring-1 ring-base-content/10">
										<div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 4px 4px;"></div>
										<div 
											class="absolute inset-2 bg-white rounded-sm"
											style="box-shadow: {shadow.inset ? 'inset ' : ''}{shadow.x}px {shadow.y}px {shadow.blur}px {shadow.spread}px {shadow.color};"
										></div>
									</div>
									<div>
										<div class="text-sm font-medium flex items-center gap-2">
											<span>{shadow.inset ? 'Inset ' : ''}Layer {index + 1}</span>
											{#if index === 0}
												<span class="badge badge-xs badge-neutral">Top</span>
											{/if}
										</div>
										<div class="text-xs text-base-content/50 font-mono mt-0.5">
											{shadow.x}px {shadow.y}px {shadow.blur}px {shadow.color}
										</div>
									</div>
								</div>
								
								<div class="flex items-center gap-1">
									<!-- Reorder Buttons -->
									<div class="flex flex-col gap-0.5 mr-2">
										<button 
											class="btn btn-xs btn-ghost btn-square h-4 min-h-0 w-6" 
											disabled={index === 0}
											onclick={(e) => {
												e.stopPropagation();
												if (index > 0) {
													const newShadows = [...shadows];
													[newShadows[index - 1], newShadows[index]] = [newShadows[index], newShadows[index - 1]];
													shadows = newShadows;
													if (selectedShadow === index) selectedShadow = index - 1;
													else if (selectedShadow === index - 1) selectedShadow = index;
												}
											}}
											title="Move Up"
										>▲</button>
										<button 
											class="btn btn-xs btn-ghost btn-square h-4 min-h-0 w-6"
											disabled={index === shadows.length - 1}
											onclick={(e) => {
												e.stopPropagation();
												if (index < shadows.length - 1) {
													const newShadows = [...shadows];
													[newShadows[index + 1], newShadows[index]] = [newShadows[index], newShadows[index + 1]];
													shadows = newShadows;
													if (selectedShadow === index) selectedShadow = index + 1;
													else if (selectedShadow === index + 1) selectedShadow = index;
												}
											}}
											title="Move Down"
										>▼</button>
									</div>

									<button 
										class="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10"
										onclick={(e) => { e.stopPropagation(); removeShadow(index); }}
										disabled={shadows.length <= 1}
										title="Remove Layer"
									>
										✕
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Visual Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-4">Shadow {selectedShadow + 1} Controls</h3>
					
					<div class="space-y-4">
						<!-- Inset toggle -->
						<label class="flex items-center justify-between cursor-pointer">
							<span class="text-sm">Inset Shadow</span>
							<input type="checkbox" bind:checked={shadows[selectedShadow].inset} class="toggle toggle-primary"/>
						</label>

						<!-- X Offset -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">X Offset</span>
								<span class="font-mono text-sm text-primary">{shadows[selectedShadow].x}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].x} min="-50" max="50" class="range range-primary range-sm"/>
						</div>

						<!-- Y Offset -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">Y Offset</span>
								<span class="font-mono text-sm text-primary">{shadows[selectedShadow].y}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].y} min="-50" max="50" class="range range-primary range-sm"/>
						</div>

						<!-- Blur -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">Blur</span>
								<span class="font-mono text-sm text-secondary">{shadows[selectedShadow].blur}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].blur} min="0" max="100" class="range range-secondary range-sm"/>
						</div>

						<!-- Spread -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">Spread</span>
								<span class="font-mono text-sm text-accent">{shadows[selectedShadow].spread}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].spread} min="-50" max="50" class="range range-accent range-sm"/>
						</div>

						<!-- Color -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">Color</span>
							</div>
							<div class="flex gap-2">
								<input type="text" bind:value={shadows[selectedShadow].color} class="input input-bordered input-sm flex-1 font-mono"/>
								<input type="color" value="#000000" onchange={(e) => {
									const hex = (e.target as HTMLInputElement).value;
									shadows[selectedShadow].color = `rgba(${parseInt(hex.slice(1,3), 16)}, ${parseInt(hex.slice(3,5), 16)}, ${parseInt(hex.slice(5,7), 16)}, 0.25)`;
								}} class="w-10 h-8 rounded cursor-pointer"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={`box-shadow: ${cssOutput};`} label="Copy" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">box-shadow: {cssOutput};</pre>
			</div>
		</div>
	</div>
</ToolWrapper>
