<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateBoxShadow, type BoxShadowConfig } from '$lib/utils/css-utils';

	let shadows = $state<BoxShadowConfig[]>([
		{ x: 0, y: 10, blur: 15, spread: -3, color: 'rgba(0, 0, 0, 0.1)', inset: false },
		{ x: 0, y: 4, blur: 6, spread: -2, color: 'rgba(0, 0, 0, 0.05)', inset: false }
	]);

	let selectedShadow = $state(0);
	let cssOutput = $derived(generateBoxShadow(shadows));

	// Preview State
	let previewBoxSize = $state({ width: 200, height: 200 });
	let previewBorderRadius = $state(12);
	let previewBoxColor = $state('#ffffff');
	let previewBgColor = $state('#f3f4f6');
	let previewBgType = $state<'solid' | 'checker'>('solid');
	let lockAspectRatio = $state(true);
	let isResponsive = $state(false); // If true, box takes % width of container

	function addShadow() {
		shadows = [...shadows, { x: 0, y: 10, blur: 20, spread: 0, color: 'rgba(0, 0, 0, 0.15)', inset: false }];
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
		{ name: 'Neu', shadows: [{ x: -9, y: -9, blur: 16, spread: 0, color: 'rgba(255,255,255, 1)', inset: false }, { x: 9, y: 9, blur: 16, spread: 0, color: 'rgba(209,217,230, 1)', inset: false }] }
	];

	function applyPreset(preset: typeof presets[0]) {
		shadows = preset.shadows.map((s, i) => ({ ...s }));
		if (preset.name === 'Neu') {
			previewBgColor = '#e0e5ec';
			previewBoxColor = '#e0e5ec';
			previewBgType = 'solid';
		} else {
			previewBgColor = '#f3f4f6';
			previewBoxColor = '#ffffff';
			previewBgType = 'solid';
		}
		selectedShadow = 0;
	}

	let current = $derived(shadows[selectedShadow] || shadows[0]);

	function updateSize(dim: 'width' | 'height', val: number) {
		if (dim === 'width') {
			previewBoxSize.width = val;
			if (lockAspectRatio) previewBoxSize.height = val;
		} else {
			previewBoxSize.height = val;
			if (lockAspectRatio) previewBoxSize.width = val;
		}
	}
</script>

<ToolWrapper
	keywords={['box shadow', 'css shadow', 'shadow generator', 'drop shadow', 'css effects']}
>
	<div class="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
		<!-- Left Col: Preview & Bottom Code -->
		<div class="space-y-6">
			<!-- Main Preview Canvas -->
			<div class="card bg-base-200 shadow-sm border border-base-300 overflow-hidden">
				<div class="p-4 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
						Preview
					</h3>
					
					<!-- Canvas Controls -->
					<div class="flex items-center gap-2">
						<!-- bg type toggle -->
						<div class="join join-horizontal">
							<button 
								class="btn btn-xs join-item {previewBgType === 'solid' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => previewBgType = 'solid'}
								title="Solid Background"
							>Solid</button>
							<button 
								class="btn btn-xs join-item {previewBgType === 'checker' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => previewBgType = 'checker'}
								title="Checkerboard Background"
							>Check</button>
						</div>

						<div class="w-px h-4 bg-base-300 mx-1"></div>

						<div class="tooltip tooltip-bottom" data-tip="Background Color" class:hidden={previewBgType === 'checker'}>
							<div class="flex items-center justify-center p-1 rounded hover:bg-base-200 transition-colors cursor-pointer border border-base-300 relative">
								<div class="w-4 h-4 rounded-full shadow-sm border border-base-300" style="background: {previewBgColor}"></div>
								<input type="color" bind:value={previewBgColor} class="absolute inset-0 opacity-0 cursor-pointer" />
							</div>
						</div>
					</div>
				</div>

				<div 
					class="h-[400px] w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300"
					style="
						background-color: {previewBgType === 'solid' ? previewBgColor : '#fff'};
						background-image: {previewBgType === 'checker' ? 'linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(-45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(-45deg, transparent 75%, #eee 75%)' : 'none'};
						background-size: {previewBgType === 'checker' ? '20px 20px' : 'auto'};
						background-position: {previewBgType === 'checker' ? '0 0, 0 10px, 10px -10px, -10px 0px' : '0 0'};
					"
				>
					<!-- Grid Pattern Overlay (only for solid) -->
					{#if previewBgType === 'solid'}
						<div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
							style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"
						></div>
					{/if}

					<!-- The Box -->
					<div 
						class="flex items-center justify-center transition-all duration-200 cursor-default relative"
						style="
							width: {isResponsive ? '50%' : previewBoxSize.width + 'px'}; 
							height: {isResponsive ? '50%' : previewBoxSize.height + 'px'}; 
							aspect-ratio: {isResponsive && lockAspectRatio ? '1/1' : 'auto'};
							border-radius: {previewBorderRadius}px; 
							background-color: {previewBoxColor};
							box-shadow: {cssOutput};
						"
					>
						<span class="text-xs font-mono opacity-20 select-none pointer-events-none">
							{isResponsive ? 'Responsive' : `${previewBoxSize.width}x${previewBoxSize.height}`}
						</span>
					</div>
				</div>

				<!-- Preview Settings Toolbar -->
				<div class="p-3 bg-base-100 border-t border-base-300 flex flex-wrap gap-4 items-center justify-between text-xs">
					<div class="flex items-center gap-4">
						<label class="flex items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100">
							<input type="checkbox" bind:checked={isResponsive} class="checkbox checkbox-xs" />
							<span>Responsive</span>
						</label>

						{#if !isResponsive}
							<div class="flex items-center gap-2">
								<span class="opacity-70">W:</span>
								<input 
									type="range" 
									min="50" 
									max="300" 
									value={previewBoxSize.width}
									oninput={(e) => updateSize('width', +e.currentTarget.value)} 
									class="range range-xs range-primary w-24"
								/>
							</div>
							<div class="flex items-center gap-2">
								<span class="opacity-70">H:</span>
								<input 
									type="range" 
									min="50" 
									max="300" 
									value={previewBoxSize.height}
									oninput={(e) => updateSize('height', +e.currentTarget.value)}
									class="range range-xs range-primary w-24"
									disabled={lockAspectRatio}
								/>
							</div>
							<label class="flex items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100">
								<input type="checkbox" bind:checked={lockAspectRatio} class="checkbox checkbox-xs" />
								<span>Lock Ratio</span>
							</label>
						{/if}
						
						{#if isResponsive}
							<label class="flex items-center gap-1.5 cursor-pointer opacity-70 hover:opacity-100">
								<input type="checkbox" bind:checked={lockAspectRatio} class="checkbox checkbox-xs" />
								<span>1:1 Ratio</span>
							</label>
						{/if}
					</div>

					<div class="flex items-center gap-4">
						<div class="flex items-center gap-2">
							<span class="opacity-70">Radius:</span>
							<input type="range" bind:value={previewBorderRadius} min="0" max="100" class="range range-xs w-20" />
						</div>
						
						<div class="flex items-center gap-2 border-l border-base-300 pl-4">
							<span class="opacity-70">Box Color:</span>
							<div class="w-5 h-5 rounded border border-base-300 relative cursor-pointer overflow-hidden" style="background: {previewBoxColor}">
								<input type="color" bind:value={previewBoxColor} class="absolute inset-0 opacity-0 cursor-pointer" />
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- CSS Output -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold">CSS Code</h3>
					<CopyButton text={`box-shadow: ${cssOutput};`} label="Copy" size="sm" />
				</div>
				<div class="p-4 bg-base-100/50 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all rounded-b-2xl">
					<span class="text-primary">box-shadow</span>: {cssOutput};
				</div>
			</div>
		</div>

		<!-- Right Col: Controls -->
		<div class="flex flex-col gap-6">
			
			<!-- Presets -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-4">
					<h3 class="text-xs font-bold uppercase tracking-wider opacity-60 mb-3">Presets</h3>
					<div class="flex flex-wrap gap-2">
						{#each presets as preset}
							<button
								class="btn btn-xs {JSON.stringify(shadows) === JSON.stringify(preset.shadows) ? 'btn-primary' : 'btn-ghost border-base-300'}"
								onclick={() => applyPreset(preset)}
							>
								{preset.name}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- Layers List -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold">Layers</h3>
					<button class="btn btn-xs btn-primary gap-1" onclick={addShadow}>
						<span class="text-lg leading-none">+</span> Add
					</button>
				</div>
				<div class="max-h-[240px] overflow-y-auto custom-scrollbar p-2 space-y-2">
					{#each shadows as shadow, index}
						<!-- svelte-ignore a11y_interactive_supports_focus -->
						<div 
							class="group relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border
								{selectedShadow === index ? 'bg-base-100 border-primary shadow-sm' : 'hover:bg-base-100/50 border-transparent hover:border-base-300'}"
							onclick={() => selectedShadow = index}
							role="button"
							onkeydown={(e) => e.key === 'Enter' && (selectedShadow = index)}
						>
							<div class="handle cursor-grab active:cursor-grabbing opacity-30 hover:opacity-100 px-1">
								<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
							</div>

							<!-- Layer Preview -->
							<div class="w-8 h-8 rounded bg-base-100 border border-base-300 relative overflow-hidden shrink-0">
								<div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 4px 4px;"></div>
								<div 
									class="absolute inset-1.5 bg-white rounded-sm transform scale-75"
									style="box-shadow: {shadow.inset ? 'inset ' : ''}{shadow.x}px {shadow.y}px {shadow.blur}px {shadow.spread}px {shadow.color};"
								></div>
							</div>

							<div class="flex-1 min-w-0">
								<div class="text-xs font-medium truncate flex items-center gap-2">
									{shadow.inset ? 'Inset ' : ''}Layer {index + 1}
								</div>
								<div class="text-[10px] opacity-50 font-mono truncate">
									{shadow.x}px {shadow.y}px {shadow.color}
								</div>
							</div>

							<button 
								class="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-opacity"
								onclick={(e) => { e.stopPropagation(); removeShadow(index); }}
								title="Remove Layer"
                                disabled={shadows.length === 1}
							>
								✕
							</button>
						</div>
					{/each}
				</div>
			</div>

			<!-- Selected Layer Controls -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 bg-base-100/50">
					<div class="flex items-center justify-between">
						<h3 class="text-sm font-semibold">Properties</h3>
						<label class="label cursor-pointer gap-2 p-0">
							<span class="label-text text-xs font-medium">Inset</span> 
							<input type="checkbox" bind:checked={shadows[selectedShadow].inset} class="toggle toggle-xs toggle-primary"/>
						</label>
					</div>
				</div>
				
				<div class="p-4 space-y-5">
					<!-- Position 2D Pad (Conceptual - implemented as sliders for robustness) -->
					<div class="grid grid-cols-2 gap-4">
						<div class="form-control">
							<label class="label p-0 mb-1">
								<span class="label-text text-xs opacity-70">X Offset</span>
								<span class="label-text-alt font-mono text-xs">{shadows[selectedShadow].x}px</span>
							</label>
							<input type="range" bind:value={shadows[selectedShadow].x} min="-50" max="50" class="range range-xs range-primary"/>
						</div>
						<div class="form-control">
							<label class="label p-0 mb-1">
								<span class="label-text text-xs opacity-70">Y Offset</span>
								<span class="label-text-alt font-mono text-xs">{shadows[selectedShadow].y}px</span>
							</label>
							<input type="range" bind:value={shadows[selectedShadow].y} min="-50" max="50" class="range range-xs range-primary"/>
						</div>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="form-control">
							<label class="label p-0 mb-1">
								<span class="label-text text-xs opacity-70">Blur</span>
								<span class="label-text-alt font-mono text-xs">{shadows[selectedShadow].blur}px</span>
							</label>
							<input type="range" bind:value={shadows[selectedShadow].blur} min="0" max="100" class="range range-xs range-secondary"/>
						</div>
						<div class="form-control">
							<label class="label p-0 mb-1">
								<span class="label-text text-xs opacity-70">Spread</span>
								<span class="label-text-alt font-mono text-xs">{shadows[selectedShadow].spread}px</span>
							</label>
							<input type="range" bind:value={shadows[selectedShadow].spread} min="-50" max="50" class="range range-xs range-accent"/>
						</div>
					</div>

					<!-- Color -->
					<div class="form-control">
						<label class="label p-0 mb-1">
							<span class="label-text text-xs opacity-70">Shadow Color</span>
						</label>
						<div class="join w-full">
							<div class="btn btn-sm btn-outline join-item px-1 border-base-300 hover:bg-transparent" style="background: {shadows[selectedShadow].color}">
								<input type="color" 
									onchange={(e) => {
										const hex = e.currentTarget.value;
										// Convert hex to rgba to maintain transparency support if needed later, 
										// or just update string. For simple hex input:
										shadows[selectedShadow].color = hex;
									}} 
									class="opacity-0 w-8 h-full cursor-pointer"
								/>
							</div>
							<input type="text" bind:value={shadows[selectedShadow].color} class="input input-sm input-bordered join-item w-full font-mono text-xs"/>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</ToolWrapper>
