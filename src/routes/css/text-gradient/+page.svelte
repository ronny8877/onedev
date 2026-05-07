<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { modernGradients, metalGradients, natureGradients, retroGradients, brandGradients } from './gradients';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cssToolsContent['text-gradient'];

	let previewText = $state('Gradient Text');
	let fontSize = $state(72);
	let fontWeight = $state(800);
	let fontFamily = $state("'Poppins', sans-serif");
	
	// Gradient settings
	let gradientType = $state<'linear' | 'radial'>('linear');
	let angle = $state(135);
	let colorStops = $state([
		{ id: 1, color: '#667eea', position: 0 },
		{ id: 2, color: '#764ba2', position: 100 }
	]);
	let nextId = $state(3);
	let selectedStopId = $state(1);

	// Library State
	let activeLibraryTab = $state<'modern' | 'metal' | 'nature' | 'retro' | 'brand'>('modern');
	let librarySection: HTMLElement;

	let activeLibraryGradients = $derived.by(() => {
		switch (activeLibraryTab) {
			case 'modern': return modernGradients;
			case 'metal': return metalGradients;
			case 'nature': return natureGradients;
			case 'retro': return retroGradients;
			case 'brand': return brandGradients;
		}
	});

	function addColorStop() {
		const lastPos = colorStops[colorStops.length - 1]?.position || 0;
		const newPos = Math.min(lastPos + 20, 100);
		const newId = nextId++;
		colorStops = [...colorStops, { id: newId, color: '#ffffff', position: newPos }];
		selectedStopId = newId;
	}

	function removeColorStop(id: number) {
		if (colorStops.length > 2) {
			colorStops = colorStops.filter(s => s.id !== id);
			if (selectedStopId === id) {
				selectedStopId = colorStops[0].id;
			}
		}
	}

	function sortStops() {
		colorStops = [...colorStops].sort((a, b) => a.position - b.position);
	}
	
	function scrollToLibrary() {
		librarySection?.scrollIntoView({ behavior: 'smooth' });
	}

	// Helper to extract colors from a gradient string (simple)
	// Real parsing is complex, so we'll just sort of "fake" it or overwrite for library use.
	// Actually, for library items, we might just want to copy the CSS directly?
	// But updating the preview state from library items is nicer.
	// For now, let's make library items clickable to Copy CSS, similar to other tools.
	// Implementing "Edit" for complex pre-defined gradients is hard without a parser.
	
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
	keywords={['gradient text', 'css gradient', 'text effects', 'gradient generator', 'css text', 'text fill', 'typography']}
	lastUpdated={content.lastUpdated}
>
	<!-- Top Notification -->
	<div class="alert border-none mb-6 rounded-xl flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold shadow-lg">
				G
			</div>
			<div>
				<h3 class="font-semibold text-sm">Need Inspiration?</h3>
				<p class="text-xs opacity-70">Check out our collection of 20+ ready-to-use gradients.</p>
			</div>
		</div>
		<button class="btn btn-sm btn-primary" onclick={scrollToLibrary}>
			Browse Library
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
		</button>
	</div>

	<div class="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
		<!-- Left Col: Preview -->
		<div class="space-y-6">
			<!-- Live Preview -->
			<div class="card bg-base-200 rounded-2xl overflow-hidden shadow-sm border border-base-300">
				<div class="p-4 border-b border-base-300 flex items-center justify-between">
					<h3 class="text-sm font-semibold">Live Preview</h3>
					<div class="flex items-center gap-2">
                        <!-- Font Size Slider in Header for quick access -->
                        <div class="flex items-center gap-2 text-xs">
                            <span class="opacity-70">Size</span>
                            <input type="range" bind:value={fontSize} min="24" max="150" class="range range-xs range-primary w-24" />
                        </div>
					</div>
				</div>
                
				<div class="flex justify-center items-center min-h-[300px] bg-base-100/50 p-8 overflow-hidden relative">
                    <!-- Grid background -->
                    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"></div>

					<span 
						class="text-center leading-tight wrap-break-word max-w-full outline-none transition-all duration-300"
                        contenteditable="true"
                        bind:textContent={previewText}
                        spellcheck="false"
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
					</span>
				</div>

                <!-- Live Text Input (Backup if contenteditable is annoying) -->
                <div class="p-3 bg-base-100 border-t border-base-300 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <input 
                        type="text" 
                        bind:value={previewText} 
                        class="input input-sm input-bordered w-full"
                        placeholder="Type text here..."
                    />
                    <div class="flex items-center gap-2">
                        <select bind:value={fontFamily} class="select select-bordered select-sm flex-1 sm:w-40 text-xs">
                            <option value="system-ui">System UI</option>
                            <option value="'Inter', sans-serif">Inter</option>
                            <option value="'Roboto', sans-serif">Roboto</option>
                            <option value="'Poppins', sans-serif">Poppins</option>
                            <option value="'Playfair Display', serif">Playfair</option>
                            <option value="monospace">Monospace</option>
                        </select>
                         <select bind:value={fontWeight} class="select select-bordered select-sm w-24 text-xs">
                            <option value={400}>Normal</option>
                            <option value={600}>Semibold</option>
                            <option value={700}>Bold</option>
                            <option value={800}>Extra Bold</option>
                            <option value={900}>Black</option>
                        </select>
                    </div>
                </div>
			</div>

			<!-- CSS Output -->
			<div class="card bg-base-200 rounded-2xl shadow-sm border border-base-300">
				<div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={cssOutput} label="Copy CSS" size="sm" />
				</div>
				<pre class="bg-base-100/50 p-4 font-mono text-sm overflow-x-auto whitespace-pre-wrap rounded-b-2xl break-all max-w-full">{cssOutput}</pre>
			</div>
		</div>

		<!-- Right Col: Controls -->
		<div class="flex flex-col gap-6">
			<!-- Gradient Controls -->
			<div class="card bg-base-200 rounded-2xl shadow-sm border border-base-300">
				<div class="p-4 border-b border-base-300 bg-base-100/50">
                    <div class="flex items-center justify-between">
					    <h3 class="text-sm font-semibold">Gradient Settings</h3>
                        <div class="join">
							<button 
								class="btn btn-xs join-item {gradientType === 'linear' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => gradientType = 'linear'}
							>
								Linear
							</button>
							<button 
								class="btn btn-xs join-item {gradientType === 'radial' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => gradientType = 'radial'}
							>
								Radial
							</button>
						</div>
                    </div>
				</div>
                
				<div class="p-5 space-y-6">
					<!-- Angle (for linear) -->
					{#if gradientType === 'linear'}
						<div class="form-control">
							<div class="flex justify-between mb-1">
								<span class="text-xs font-medium opacity-70">Angle</span>
								<span class="font-mono text-xs badge badge-neutral badge-sm">{angle}°</span>
							</div>
							<input type="range" bind:value={angle} min="0" max="360" class="range range-sm range-primary w-full"/>
                            <div class="flex justify-between text-[10px] text-base-content/40 mt-1 px-1">
								<span>0°</span>
								<span>90°</span>
								<span>180°</span>
                                <span>270°</span>
								<span>360°</span>
							</div>
						</div>
					{/if}

					<!-- Color Stops -->
					<div>
						<div class="flex items-center justify-between mb-3">
							<span class="text-xs font-medium opacity-70">Colors</span>
							<div class="flex gap-2">
								<button class="btn btn-xs btn-ghost gap-1" onclick={sortStops}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
                                    Sort
                                </button>
								<button class="btn btn-xs btn-primary gap-1" onclick={addColorStop}>
                                    + Add
                                </button>
							</div>
						</div>
						
						<!-- Visual Gradient Bar -->
						<div 
							class="h-8 rounded-lg mb-4 relative shadow-inner ring-1 ring-black/5"
							style="background: {gradientValue()}"
						>
							{#each [...colorStops] as stop}
								<div 
									class="absolute top-0 h-full w-1 bg-white shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform z-10 group"
									style="left: {stop.position}%; transform: translateX(-50%);"
                                    role="button"
                                    tabindex="0"
                                    onclick={() => selectedStopId = stop.id}
                                    onkeydown={(e) => e.key === 'Enter' && (selectedStopId = stop.id)}
								>
                                    <div class="w-3 h-3 -mt-1.5 -ml-1 rounded-full bg-white border border-base-300 shadow-sm"></div>
                                </div>
							{/each}
						</div>

						<div class="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
							{#each colorStops as stop, index (stop.id)}
								<div 
                                    class="flex items-center gap-3 p-2 rounded-lg transition-colors border
                                    {selectedStopId === stop.id ? 'bg-base-100 border-primary shadow-sm ring-1 ring-primary/10' : 'bg-base-100/50 border-base-200 hover:border-base-300'}"
                                    onclick={() => selectedStopId = stop.id}
                                    role="button"
                                    onkeydown={(e) => e.key === 'Enter' && (selectedStopId = stop.id)}
                                >
                                    <!-- Unified Color Input -->
                                    <div class="join shadow-sm">
                                        <div class="btn btn-xs btn-square join-item relative hover:bg-base-200 border-base-300 p-0 overflow-hidden">
                                            <div class="w-full h-full" style="background: {stop.color}"></div>
                                            <input 
                                                type="color" 
                                                bind:value={stop.color}
                                                class="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                                            />
                                        </div>
                                        <input 
                                            type="text" 
                                            bind:value={stop.color}
                                            class="input input-xs input-bordered join-item w-20 font-mono text-[10px]"
                                        />
                                    </div>

									<div class="flex-1 flex flex-col gap-1">
										<input 
											type="range" 
											bind:value={stop.position}
											min="0" 
											max="100"
											class="range range-xs {selectedStopId === stop.id ? 'range-primary' : ''}"
										/>
									</div>
                                    
									<span class="text-[10px] font-mono w-8 text-right tabular-nums opacity-60">{stop.position}%</span>
									
                                    <button 
										class="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10 opacity-60 hover:opacity-100"
										onclick={(e) => { e.stopPropagation(); removeColorStop(stop.id); }}
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
		</div>
	</div>

    <!-- Gallery Section -->
    <div class="divider my-10">Text Gradient Gallery</div>

	<div class="flex flex-col gap-6" bind:this={librarySection}>
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
			<div>
				<h2 class="text-2xl font-bold">Inspiration Gallery</h2>
				<p class="text-base-content/60 text-sm">Curated collection of stunning text gradients</p>
			</div>
			<div class="tabs tabs-boxed bg-base-200 p-1 rounded-xl overflow-x-auto flex-nowrap max-w-full">
				{#each ['modern', 'metal', 'nature', 'retro', 'brand'] as type}
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
			{#each activeLibraryGradients as item}
				<div class="group relative card bg-base-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-visible border border-base-300 hover:-translate-y-1">
					<!-- Preview Area -->
					<div 
						class="h-32 w-full flex items-center justify-center p-6 rounded-t-2xl relative text-center overflow-hidden"
						style="background-color: {item.bgColor || '#ffffff'};"
					>
                        {#if !item.bgColor}
						    <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"></div>
                        {/if}

						<div 
							class="text-4xl font-bold transition-all duration-300 z-10"
							style="
								background: {item.gradient};
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                                background-clip: text;
                                font-family: {item.fontFamily || 'inherit'};
							"
						>
                            {item.name}
                        </div>
						
						<!-- Copy Overlay -->
						<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-base-300/40 backdrop-blur-[1px] rounded-t-2xl z-20">
                            <!-- Helper to construct full CSS rule -->
							<CopyButton 
                                text={`.gradient-text {\n  background: ${item.gradient};\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}`} 
                                size="sm" 
                                label="Copy CSS" 
                            />
						</div>
					</div>

					<!-- Label -->
					<div class="p-3 bg-base-100 border-t border-base-200 z-10 rounded-b-2xl">
						<div class="text-xs font-medium truncate text-center" title={item.name}>{item.name}</div>
					</div>
				</div>
			{/each}
		</div>
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
