<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateBoxShadow, type BoxShadowConfig } from '$lib/utils/css-utils';
	import { softShadows, elevatedShadows, neumorphicShadows, neonShadows, retroShadows, insetShadows } from './shadows';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cssToolsContent['box-shadow'];

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

	// Library State
	let activeLibraryTab = $state<'soft' | 'elevated' | 'neumorphism' | 'neon' | 'retro' | 'inset'>('soft');
	let librarySection: HTMLElement;

	let activeLibraryShadows = $derived.by(() => {
		switch (activeLibraryTab) {
			case 'soft': return softShadows;
			case 'elevated': return elevatedShadows;
			case 'neumorphism': return neumorphicShadows;
			case 'neon': return neonShadows;
			case 'retro': return retroShadows;
			case 'inset': return insetShadows;
		}
	});

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

	// Presets (Kept for quick access, simplified)
	function loadShadow(shadow: (typeof activeLibraryShadows)[0]) {
		// Deep copy layers
		shadows = JSON.parse(JSON.stringify(shadow.layers));
		selectedShadow = 0;
		
        // Load other properties if available
        if (shadow.bgColor) previewBgColor = shadow.bgColor;
        if (shadow.boxColor) previewBoxColor = shadow.boxColor;
        if (shadow.borderRadius !== undefined) previewBorderRadius = shadow.borderRadius;

		// Build visual feedback like scroll to top
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
	
	function scrollToLibrary() {
		librarySection?.scrollIntoView({ behavior: 'smooth' });
	}

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
	keywords={['box shadow generator', 'css box shadow', 'drop shadow css', 'neumorphism generator', 'css glow effect', 'shadow maker']}
	lastUpdated={content.lastUpdated}
>
	<!-- Top Notification -->
	<div class="alert border-none mb-6 rounded-xl flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold shadow-lg">
				S
			</div>
			<div>
				<h3 class="font-semibold text-sm">Need Inspiration?</h3>
				<p class="text-xs opacity-70">Check out our collection of ready-to-use shadows.</p>
			</div>
		</div>
		<button class="btn btn-sm btn-primary" onclick={scrollToLibrary}>
			Browse Library
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
		</button>
	</div>

	<div class="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
		<!-- Left Col: Preview & Properties & CSS -->
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
					class="min-h-[300px] md:h-[400px] w-full flex items-center justify-center relative overflow-hidden transition-colors duration-300"
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
							<div class="hidden sm:flex items-center gap-2">
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
							<div class="hidden sm:flex items-center gap-2">
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

			<!-- Layers List (Moved to Left) -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold">Layers</h3>
					<button class="btn btn-xs btn-primary gap-1" onclick={addShadow}>
						<span class="text-lg leading-none">+</span> Add Layer
					</button>
				</div>
				<div class="max-h-[300px] overflow-y-auto custom-scrollbar p-2 space-y-2">
					{#each shadows as shadow, index}
						<!-- svelte-ignore a11y_interactive_supports_focus -->
						<div 
							class="group relative flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border
								{selectedShadow === index ? 'bg-base-100 border-primary shadow-sm ring-1 ring-primary/20' : 'hover:bg-base-100/50 border-transparent hover:border-base-300'}"
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

			<!-- CSS Output -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold">CSS Code</h3>
					<CopyButton text={`box-shadow: ${cssOutput};`} label="Copy CSS" size="sm" />
				</div>
				<div class="p-4 bg-base-100/50 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all rounded-b-2xl max-w-full">
					<span class="text-primary">box-shadow</span>: {cssOutput};
				</div>
			</div>
		</div>

		<!-- Right Col: Properties -->
		<div class="flex flex-col gap-6 sticky top-6">
            <!-- Selected Layer Properties (Moved to Right) -->
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

					<!-- Blur / Spread -->
					<div class="space-y-4">
						<div class="form-control">
							<div class="flex justify-between mb-1">
								<span class="text-xs font-medium opacity-70">Blur Radius</span>
								<span class="font-mono text-xs badge badge-neutral badge-sm">{shadows[selectedShadow].blur}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].blur} min="0" max="100" class="range range-xs range-secondary w-full"/>
						</div>
						<div class="form-control">
							<div class="flex justify-between mb-1">
								<span class="text-xs font-medium opacity-70">Spread Radius</span>
								<span class="font-mono text-xs badge badge-neutral badge-sm">{shadows[selectedShadow].spread}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].spread} min="-50" max="50" class="range range-xs range-accent w-full"/>
						</div>
					</div>

					<div class="divider my-0"></div>

					<!-- Color -->
					<div class="form-control">
					<div class="label p-0 mb-2">
						<span class="label-text text-xs font-medium opacity-70">Shadow Color</span>
					</div>
						
						<div class="join w-full shadow-sm">
							<div class="btn btn-square join-item relative hover:bg-base-200 border-base-300">
								<div class="w-6 h-6 rounded shadow-sm ring-1 ring-base-content/10" style="background: {shadows[selectedShadow].color}"></div>
								<input 
									type="color" 
									oninput={(e) => {
										shadows[selectedShadow].color = (e.target as HTMLInputElement).value;
									}} 
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
	
	<!-- Shadow Library Section -->
	<div class="divider my-10">Shadow Gallery</div>

	<div class="flex flex-col gap-6" bind:this={librarySection}>
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-bold">Inspiration Gallery</h2>
				<p class="text-base-content/60 text-sm">Curated collection of modern box shadow effects</p>
			</div>
			<div class="tabs tabs-boxed bg-base-200 p-1 rounded-xl overflow-x-auto flex-nowrap max-w-full">
				{#each ['soft', 'elevated', 'neumorphism', 'neon', 'retro', 'inset'] as type}
					<button 
						class="tab tab-sm transition-all duration-300 rounded-lg whitespace-nowrap {activeLibraryTab === type ? 'tab-active bg-primary text-primary-content shadow-sm' : ''}"
						onclick={() => activeLibraryTab = type as any}
					>
						{type.charAt(0).toUpperCase() + type.slice(1)}
					</button>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			{#each activeLibraryShadows as shadow}
                {@const css = generateBoxShadow(shadow.layers)}
				<div class="group relative card bg-base-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-visible border border-base-300 hover:-translate-y-1">
					<!-- Preview Area -->
					<div 
						class="h-40 w-full flex items-center justify-center p-6 rounded-t-2xl relative"
						style="background-color: {shadow.bgColor || '#f8f9fa'};"
					>
						{#if shadow.type === 'neumorphism'}
							<!-- Neumorphic specific styling context -->
						{/if}
						
						<!-- Grid pattern for transparent boxes if needed, or keeping it subtle -->
						{#if !['neumorphism', 'neon'].includes(shadow.type)}
							<div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"></div>
						{/if}

						<div 
							class="w-16 h-16 rounded-xl transition-all duration-300 z-5"
							style="
								background-color: {shadow.boxColor || 'white'}; 
								box-shadow: {css};
                                border-radius: {shadow.borderRadius || 12}px;
							"
						></div>
						
						<!-- Hover Overlay Actions -->
						<div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-base-300/40 backdrop-blur-[1px] rounded-t-2xl z-10 p-4">
							<button 
                                class="btn btn-sm btn-primary shadow-lg" 
                                onclick={() => loadShadow(shadow)}
                                title="Load into Editor"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M9 14l3-3 3 3M4 4h16"/></svg>
                                Edit
                            </button>
                            <div class="tooltip" data-tip="Copy CSS">
							    <CopyButton text={`box-shadow: ${css};`} size="sm" />
                            </div>
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
</ToolWrapper>
