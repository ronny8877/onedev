<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateTextShadow, type TextShadowConfig } from '$lib/utils/css-utils';
	import { basicShadows, neonShadows, retroShadows, threeDShadows, creativeShadows } from './shadows';

	let shadows = $state<TextShadowConfig[]>([
		{ x: 2, y: 2, blur: 4, color: 'rgba(0, 0, 0, 0.3)' }
	]);

	let previewText = $state('Hello World');
	let fontSize = $state(64);
	let fontWeight = $state('bold');
	let textColor = $state('#333333');
	let bgColor = $state('#f3f4f6');
	let selectedShadow = $state(0);

	let cssOutput = $derived(generateTextShadow(shadows));

	// Library State
	let activeLibraryTab = $state<'basic' | 'neon' | 'retro' | '3d' | 'creative'>('basic');
	let librarySection: HTMLElement;

	let activeLibraryShadows = $derived.by(() => {
		switch (activeLibraryTab) {
			case 'basic': return basicShadows;
			case 'neon': return neonShadows;
			case 'retro': return retroShadows;
			case '3d': return threeDShadows;
			case 'creative': return creativeShadows;
		}
	});

	function addShadow() {
		shadows = [...shadows, { x: 2, y: 2, blur: 0, color: 'rgba(0, 0, 0, 0.2)' }];
		selectedShadow = shadows.length - 1;
	}

	function removeShadow(index: number) {
		if (shadows.length > 1) {
			shadows = shadows.filter((_, i) => i !== index);
			if (selectedShadow >= shadows.length) selectedShadow = shadows.length - 1;
		}
	}
	
	function scrollToLibrary() {
		librarySection?.scrollIntoView({ behavior: 'smooth' });
	}

	function updateShadowColor(index: number, color: string) {
		shadows[index].color = color;
	}
</script>

<ToolWrapper
	keywords={['text shadow', 'css text shadow', 'text effects', 'shadow generator', 'text glow', 'neon text', '3d text css']}
>
	<!-- Top Notification -->
	<div class="alert border-none mb-6 rounded-xl flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold shadow-lg">
				T
			</div>
			<div>
				<h3 class="font-semibold text-sm">Need Inspiration?</h3>
				<p class="text-xs opacity-70">Check out our collection of 20+ ready-to-use text effects.</p>
			</div>
		</div>
		<button class="btn btn-sm btn-primary" onclick={scrollToLibrary}>
			Browse Library
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
		</button>
	</div>

	<div class="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
		<!-- Left Col: Preview & Bottom Code -->
		<div class="space-y-6">
			<!-- Main Preview Canvas -->
			<div class="card bg-base-200 shadow-sm border border-base-300 overflow-hidden">
				<div class="p-4 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
						Preview
					</h3>
					
					<!-- Quick Color Controls -->
					<div class="flex items-center gap-2">
						<div class="tooltip tooltip-bottom" data-tip="Text Color">
							<div class="flex items-center justify-center p-1 rounded hover:bg-base-200 transition-colors cursor-pointer border border-base-300 relative">
								<div class="w-4 h-4 rounded-full shadow-sm border border-base-300" style="background: {textColor}"></div>
								<input type="color" bind:value={textColor} class="absolute inset-0 opacity-0 cursor-pointer" />
							</div>
						</div>
						<div class="w-px h-4 bg-base-300"></div>
						<div class="tooltip tooltip-bottom" data-tip="Background Color">
							<div class="flex items-center justify-center p-1 rounded hover:bg-base-200 transition-colors cursor-pointer border border-base-300 relative">
								<div class="w-4 h-4 rounded-full shadow-sm border border-base-300" style="background: {bgColor}"></div>
								<input type="color" bind:value={bgColor} class="absolute inset-0 opacity-0 cursor-pointer" />
							</div>
						</div>
					</div>
				</div>

				<div 
					class="h-[300px] w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300"
					style="background-color: {bgColor};"
				>
					<div 
						contenteditable="true"
						bind:textContent={previewText}
						class="text-center outline-none min-w-[50%] p-4 rounded border border-transparent hover:border-base-300/50 transition-colors cursor-text"
						style="
							text-shadow: {cssOutput};
							font-size: {fontSize}px;
							font-weight: {fontWeight};
							color: {textColor};
						"
						spellcheck="false"
					>
					</div>
				</div>

				<!-- Text Settings Toolbar -->
				<div class="p-3 bg-base-100 border-t border-base-300 flex flex-wrap gap-4 items-center justify-between text-xs">
					<div class="flex items-center gap-4 flex-1">
						<div class="flex items-center gap-2 flex-1">
							<span class="opacity-70">Size:</span>
							<input 
								type="range" 
								bind:value={fontSize} 
								min="24" 
								max="128"
								class="range range-xs range-primary flex-1"
							/>
							<span class="font-mono w-8 text-right">{fontSize}</span>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<span class="opacity-70">Weight:</span>
						<select bind:value={fontWeight} class="select select-bordered select-xs w-24">
							<option value="normal">Normal</option>
							<option value="bold">Bold</option>
							<option value="100">Thin</option>
							<option value="900">Black</option>
						</select>
					</div>
				</div>
			</div>

			<!-- CSS Output -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold">CSS Code</h3>
					<CopyButton text={`text-shadow: ${cssOutput};`} label="Copy CSS" size="sm" />
				</div>
				<div class="p-4 bg-base-100/50 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all rounded-b-2xl">
					<span class="text-primary">text-shadow</span>: {cssOutput};
				</div>
			</div>
		</div>

		<!-- Right Col: Controls -->
		<div class="flex flex-col gap-6">
			
			<!-- Layers List -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold">Layers</h3>
					<button class="btn btn-xs btn-primary gap-1" onclick={addShadow}>
						<span class="text-lg leading-none">+</span> Add Layer
					</button>
				</div>
				<div class="max-h-[240px] overflow-y-auto custom-scrollbar p-2 space-y-2">
					{#each shadows as shadow, index}
						<!-- svelte-ignore a11y_interactive_supports_focus -->
						<div 
							class="group relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border
								{selectedShadow === index ? 'bg-base-100 border-primary shadow-sm ring-1 ring-primary/20' : 'hover:bg-base-100/50 border-transparent hover:border-base-300'}"
							onclick={() => selectedShadow = index}
							role="button"
							onkeydown={(e) => e.key === 'Enter' && (selectedShadow = index)}
						>
							<div class="w-8 h-8 rounded bg-base-200 border border-base-300 flex items-center justify-center font-serif font-bold text-lg overflow-hidden shrink-0 text-base-content/50">
								T
							</div>

							<div class="flex-1 min-w-0">
								<div class="text-xs font-medium truncate flex items-center gap-2">
									Layer {index + 1}
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
					</div>
				</div>
				
				<div class="p-5 space-y-6">
					
					<!-- X / Y Position -->
					<div class="space-y-4">
						<div class="form-control">
							<div class="flex justify-between mb-1">
								<span class="text-xs font-medium opacity-70">Horizontal (X)</span>
								<span class="font-mono text-xs badge badge-neutral badge-sm">{shadows[selectedShadow].x}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].x} min="-50" max="50" class="range range-xs range-primary w-full"/>
						</div>
						<div class="form-control">
							<div class="flex justify-between mb-1">
								<span class="text-xs font-medium opacity-70">Vertical (Y)</span>
								<span class="font-mono text-xs badge badge-neutral badge-sm">{shadows[selectedShadow].y}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].y} min="-50" max="50" class="range range-xs range-primary w-full"/>
						</div>
					</div>

					<div class="divider my-0"></div>

					<!-- Blur -->
					<div class="form-control">
						<div class="flex justify-between mb-1">
							<span class="text-xs font-medium opacity-70">Blur Radius</span>
							<span class="font-mono text-xs badge badge-neutral badge-sm">{shadows[selectedShadow].blur}px</span>
						</div>
						<input type="range" bind:value={shadows[selectedShadow].blur} min="0" max="100" class="range range-xs range-secondary w-full"/>
					</div>

					<div class="divider my-0"></div>

					<!-- Color -->
					<div class="form-control">
						<label class="label p-0 mb-2">
							<span class="label-text text-xs font-medium opacity-70">Shadow Color</span>
						</label>
						
						<div class="join w-full shadow-sm">
							<div class="btn btn-square join-item relative hover:bg-base-200 border-base-300">
								<div class="w-6 h-6 rounded shadow-sm ring-1 ring-base-content/10" style="background: {shadows[selectedShadow].color}"></div>
								<input 
									type="color" 
									oninput={(e) => updateShadowColor(selectedShadow, (e.target as HTMLInputElement).value)}
									value={shadows[selectedShadow].color}
									class="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
									title="Pick color"
								/>
							</div>
							<input 
								type="text" 
								bind:value={shadows[selectedShadow].color} 
								class="input input-bordered join-item flex-1 font-mono uppercase text-sm"
								placeholder="#000000"
							/>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
	
	<!-- Text Shadow Library Section -->
	<div class="divider my-10">Text Shadow Gallery</div>

	<div class="flex flex-col gap-6" bind:this={librarySection}>
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-bold">Inspiration Gallery</h2>
				<p class="text-base-content/60 text-sm">Curated collection of cool text effects</p>
			</div>
			<div class="tabs tabs-boxed bg-base-200 p-1 rounded-xl overflow-x-auto flex-nowrap max-w-full">
				{#each ['basic', 'neon', 'retro', '3d', 'creative'] as type}
					<button 
						class="tab tab-sm transition-all duration-300 rounded-lg whitespace-nowrap {activeLibraryTab === type ? 'tab-active bg-primary text-primary-content shadow-sm' : ''}"
						onclick={() => activeLibraryTab = type as any}
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</button>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
			{#each activeLibraryShadows as shadow}
				<div class="group relative card bg-base-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-visible border border-base-300 hover:-translate-y-1">
					<!-- Preview Area -->
					<div 
						class="h-40 w-full flex items-center justify-center p-6 rounded-t-2xl relative text-center overflow-hidden"
						style="background-color: {shadow.bgColor || '#f8f9fa'};"
					>
                        <!-- Grid pattern for subtle texture -->
						<div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"></div>

						<div 
							class="text-4xl font-bold transition-all duration-300 z-10"
							style="
								color: {shadow.textColor || '#333'}; 
								text-shadow: {shadow.css};
                                font-family: {shadow.fontFamily || 'inherit'};
							"
						>
                            Aa
                        </div>
						
						<!-- Copy Overlay -->
						<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-base-300/40 backdrop-blur-[1px] rounded-t-2xl z-20">
							<CopyButton text={`text-shadow: ${shadow.css};`} size="sm" label="Copy CSS" />
						</div>
					</div>

					<!-- Label -->
					<div class="p-3 bg-base-100 border-t border-base-200 z-10 rounded-b-2xl">
						<div class="text-xs font-medium truncate text-center" title={shadow.name}>{shadow.name}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</ToolWrapper>
