<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { linearGradients, radialGradients, conicGradients, animatedGradients, keyframes } from './gradients';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = cssToolsContent['gradient'];

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
	
	// Library State
	let activeLibraryTab = $state<'linear' | 'radial' | 'conic' | 'animated'>('linear');
	let librarySection: HTMLElement;
	let gradientBarRef: HTMLElement;
	let isDragging = $state(false);

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
	
	let activeLibraryGradients = $derived.by(() => {
		switch (activeLibraryTab) {
			case 'linear': return linearGradients;
			case 'radial': return radialGradients;
			case 'conic': return conicGradients;
			case 'animated': return animatedGradients;
		}
	});

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

	// Drag Logic
	function handleMouseDown(e: MouseEvent, id: string) {
		e.preventDefault();
		isDragging = true;
		selectedStopId = id;
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || !selectedStopId || !gradientBarRef) return;
		
		const rect = gradientBarRef.getBoundingClientRect();
		const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
		const percentage = Math.round((x / rect.width) * 100);
		
		updateStopPosition(selectedStopId, percentage);
	}

	function handleMouseUp() {
		isDragging = false;
		window.removeEventListener('mousemove', handleMouseMove);
		window.removeEventListener('mouseup', handleMouseUp);
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

	function scrollToLibrary() {
		librarySection?.scrollIntoView({ behavior: 'smooth' });
	}

	let selectedStop = $derived(colorStops.find(s => s.id === selectedStopId));
</script>

<svelte:head>
	<style>
		{@html keyframes}
	</style>
</svelte:head>

<ToolWrapper
	keywords={[
		'css gradient generator', 'css gradient', 'gradient background', 'linear gradient css', 
		'radial gradient css', 'conic gradient', 'animated gradient css', 'gradient maker', 
		'beautiful gradients', 'gradient presets', 'web design tools', 'css background generator'
	]}
>
	<!-- Top Notification -->
	<div class="alert border-none mb-6 rounded-xl flex items-center justify-between">
		<div class="flex items-center gap-3">
			<div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content">
				ᶻ 𝗓 𐰁
			</div>
			<div>
				<h3 class="font-semibold text-sm">Need Inspiration?</h3>
				<p class="text-xs opacity-70">Check out our collection of 40+ ready-to-use gradients.</p>
			</div>
		</div>
		<button class="btn btn-sm btn-primary" onclick={scrollToLibrary}>
			Browse Library
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
		</button>
	</div>

	<div class="flex flex-col gap-6">
		<!-- Live Preview -->
		<div class="card bg-base-200 rounded-3xl overflow-hidden shadow-lg border border-base-300">
			<div class="card-body p-0">
				<div 
					class="w-full h-80 transition-all duration-300"
					style="background: {gradientCSS};"
				>
					<div class="w-full h-full flex items-center justify-center">
						<div class="px-4 py-2 bg-base-100/80 backdrop-blur-md rounded-lg shadow-sm text-xs font-mono">
							Preview
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Main Controls Grid -->
		<div class="grid lg:grid-cols-12 gap-6">
			
			<!-- Left Column: Type & Presets & Direction (Takes up full width on mobile, 7/12 on LG) -->
			<div class="lg:col-span-7 space-y-6">
				
				<!-- Setup Card -->
				<div class="card bg-base-200 rounded-3xl border border-base-300">
					<div class="card-body p-5">
						
						<!-- Type Selector -->
						<div class="mb-6">
							<span class="text-xs font-bold uppercase tracking-wider opacity-50 mb-3 block">Type</span>
							<div class="p-1 bg-base-300 rounded-xl inline-flex w-full sm:w-auto">
								{#each ['linear', 'radial', 'conic'] as type}
									<button
										class="btn btn-sm px-6 border-0 shadow-none {gradientType === type ? 'btn-neutral text-neutral-content' : 'btn-ghost bg-transparent hover:bg-base-100/50'}"
										onclick={() => gradientType = type as GradientType}
									>
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</button>
								{/each}
							</div>
						</div>

						<!-- Direction/Position Controls (Now Full Width inside this col) -->
						<div>
							<h3 class="text-xs font-bold uppercase tracking-wider opacity-50 mb-3">
								{gradientType === 'linear' ? 'Direction' : gradientType === 'conic' ? 'Starting Angle' : 'Shape & Position'}
							</h3>
							
							<div class="bg-base-100 rounded-xl p-4 border border-base-300/50">
								{#if gradientType === 'linear' || gradientType === 'conic'}
									<!-- Angle Control -->
									<div>
										<div class="flex justify-between mb-2">
											<span class="text-sm font-medium">Angle</span>
											<span class="badge badge-neutral font-mono">{angle}°</span>
										</div>
										<input 
											type="range" 
											bind:value={angle} 
											min="0" 
											max="360" 
											class="range range-primary w-full" 
										/>
										<div class="flex flex-wrap justify-between mt-4 gap-2">
											{#each [0, 45, 90, 135, 180, 225, 270, 315] as deg}
												<button 
													class="btn btn-xs {angle === deg ? 'btn-primary' : 'btn-soft'}"
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
									<div class="mb-4">
										<span class="text-sm mb-2 block font-medium">Shape</span>
										<div class="flex gap-2">
											<button 
												class="btn btn-sm flex-1 {radialShape === 'circle' ? 'btn-primary' : 'btn-outline'}"
												onclick={() => radialShape = 'circle'}
											>
												Circle
											</button>
											<button 
												class="btn btn-sm flex-1 {radialShape === 'ellipse' ? 'btn-primary' : 'btn-outline'}"
												onclick={() => radialShape = 'ellipse'}
											>
												Ellipse
											</button>
										</div>
									</div>
								{/if}

								{#if gradientType === 'radial' || gradientType === 'conic'}
									<!-- Position -->
									<div class="space-y-4">
										<div>
											<div class="flex justify-between mb-2">
												<span class="text-sm font-medium">Position X</span>
												<span class="badge badge-neutral font-mono">{radialPosition.x}%</span>
											</div>
											<input 
												type="range" 
												bind:value={radialPosition.x} 
												min="0" 
												max="100" 
												class="range range-secondary w-full"
											/>
										</div>
										<div>
											<div class="flex justify-between mb-2">
												<span class="text-sm font-medium">Position Y</span>
												<span class="badge badge-neutral font-mono">{radialPosition.y}%</span>
											</div>
											<input 
												type="range" 
												bind:value={radialPosition.y} 
												min="0" 
												max="100" 
												class="range range-accent w-full"
											/>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Quick Presets -->
				<div class="card bg-base-200 rounded-3xl border border-base-300">
					<div class="card-body p-5">
						<h3 class="text-xs font-bold uppercase tracking-wider opacity-50 mb-3">Quick Presets</h3>
						<div class="flex flex-wrap gap-2">
							{#each presets as preset}
								<button
									class="btn btn-sm btn-ghost bg-base-100 shadow-sm gap-2 hover:scale-105 border border-base-300/50"
									onclick={() => applyPreset(preset)}
								>
									<span 
										class="w-4 h-4 rounded-full shadow-inner ring-1 ring-base-content/10"
										style="background: linear-gradient(90deg, {preset.stops.map(s => s.color).join(', ')});"
									></span>
									{preset.name}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Right Column: Stops & Helpers (5/12 on LG) -->
			<div class="lg:col-span-5 space-y-6">
				
				<!-- Color Stops -->
				<div class="card bg-base-200 rounded-3xl border border-base-300 h-full">
					<div class="card-body p-5">
						<div class="flex items-center justify-between mb-4">
							<h3 class="text-xs font-bold uppercase tracking-wider opacity-50">Color Stops ({colorStops.length})</h3>
							<button class="btn btn-xs btn-primary rounded-lg" onclick={addColorStop}>+ Add Stop</button>
						</div>
						
						<!-- Gradient Bar Visual (Draggable) -->
						<div class="mb-6 px-3 py-2 bg-base-100 rounded-2xl border border-base-300/50">
							<div 
								class="relative h-10 select-none cursor-pointer"
								bind:this={gradientBarRef}
								role="slider"
								tabindex="0"
								aria-valuenow={0}
							>
								<!-- Main Gradient Bar -->
								<div 
									class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 rounded-full shadow-inner ring-1 ring-base-content/5"
									style="background: linear-gradient(90deg, {sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')});"
								></div>
								
								<!-- Handles -->
								{#each colorStops as stop (stop.id)}
									<!-- svelte-ignore a11y_no_static_element_interactions -->
									<div 
										class="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-base-100 shadow-lg cursor-grab active:cursor-grabbing transition-transform hover:scale-110 {selectedStopId === stop.id ? 'ring-2 ring-primary scale-110 z-10' : 'z-0'}"
										style="left: calc({stop.position}% - 12px); background: {stop.color};"
										onmousedown={(e) => handleMouseDown(e, stop.id)}
									></div>
								{/each}
							</div>
							<div class="text-center text-[10px] text-base-content/40 mt-1">Drag handles to adjust position</div>
						</div>

						<!-- Selected Stop Controls -->
						{#if selectedStop}
							<div class="bg-base-100 rounded-xl p-4 border border-base-300/50 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
								<div class="space-y-4">
									<div>
										<div class="flex justify-between mb-1">
											<span class="text-xs font-medium opacity-70">Color</span>
										</div>
										<div class="join w-full">
											<!-- Color Picker Button -->
											<div class="btn btn-square join-item relative hover:bg-base-200 border-base-300">
												<div class="w-6 h-6 rounded shadow-sm ring-1 ring-base-content/10" style="background: {selectedStop.color}"></div>
												<input 
													type="color" 
													value={selectedStop.color}
													oninput={(e) => updateStopColor(selectedStop!.id, (e.target as HTMLInputElement).value)}
													class="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
													title="Pick color"
												/>
											</div>
											
											<!-- Hex Input -->
											<input 
												type="text" 
												value={selectedStop.color}
												oninput={(e) => updateStopColor(selectedStop!.id, (e.target as HTMLInputElement).value)}
												class="input input-bordered join-item flex-1 font-mono uppercase"
												placeholder="#000000"
											/>
										</div>
									</div>
									<div>
										<div class="flex justify-between mb-1">
											<span class="text-xs font-medium opacity-70">Position</span>
											<span class="text-xs font-mono">{selectedStop.position}%</span>
										</div>
										<input 
											type="range" 
											value={selectedStop.position}
											oninput={(e) => updateStopPosition(selectedStop!.id, parseInt((e.target as HTMLInputElement).value))}
											min="0" 
											max="100" 
											class="range range-xs range-primary w-full"
										/>
									</div>
								</div>
							</div>
						{/if}

						<!-- Stop List -->
						<div class="space-y-2 max-h-48 overflow-y-auto pr-1">
							{#each sortedStops as stop (stop.id)}
								<div 
									class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 border border-transparent {selectedStopId === stop.id ? 'bg-primary/5 border-primary/20' : 'hover:bg-base-100'}"
									onclick={() => selectedStopId = stop.id}
									role="button"
									tabindex="0"
								>
									<div class="relative w-8 h-8 rounded-md shadow-sm ring-1 ring-base-content/5 overflow-hidden group">
										<div class="absolute inset-0 w-full h-full" style="background: {stop.color}"></div>
										<input 
											type="color" 
											value={stop.color}
											oninput={(e) => {
												updateStopColor(stop.id, (e.target as HTMLInputElement).value);
												selectedStopId = stop.id;
											}}
											class="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
											onclick={(e) => e.stopPropagation()}
											title="Pick color"
										/>
									</div>
									<div class="flex-1 min-w-0">
										<div class="font-mono text-xs truncate">{stop.color}</div>
									</div>
									<div class="text-xs font-mono opacity-50 w-10 text-right">{stop.position}%</div>
									<button 
										class="btn btn-xs btn-ghost btn-square text-error/70 hover:text-error hover:bg-error/10"
										onclick={(e) => { e.stopPropagation(); removeColorStop(stop.id); }}
										disabled={colorStops.length <= 2}
										title="Remove stop"
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
									</button>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- CSS Output -->
		<div class="card bg-base-200 rounded-3xl border border-base-300">
			<div class="card-body p-5">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-xs font-bold uppercase tracking-wider opacity-50">CSS Output</h3>
					<CopyButton text={fullCSS} label="Copy CSS" size="sm" />
				</div>
				<pre class="bg-base-300/50 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all border border-base-300 shadow-inner text-base-content/80">{fullCSS}</pre>
			</div>
		</div>

		<!-- Gradient Library Section -->
		<div class="divider my-8">Gradient Library</div>

		<div class="flex flex-col gap-6" bind:this={librarySection}>
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div>
					<h2 class="text-2xl font-bold">Inspiration Gallery</h2>
					<p class="text-base-content/60 text-sm">Browse our curated collection of premade gradients</p>
				</div>
				<div class="tabs tabs-boxed bg-base-200 p-1 rounded-xl">
					{#each ['linear', 'radial', 'conic', 'animated'] as type}
						<button 
							class="tab tab-sm transition-all duration-300 rounded-lg {activeLibraryTab === type ? 'tab-active bg-primary text-primary-content shadow-sm' : ''}"
							onclick={() => activeLibraryTab = type as any}
						>
							{type.charAt(0).toUpperCase() + type.slice(1)}
						</button>
					{/each}
				</div>
			</div>

			<div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
				{#each activeLibraryGradients as gradient}
					<div class="group relative card bg-base-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-base-300 hover:-translate-y-1">
						<!-- Visual -->
						<div 
							class="h-40 w-full transition-transform duration-500 group-hover:scale-110"
							style="background: {gradient.css};"
						></div>
						
						<!-- Overlay Info -->
						<div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-base-300/60 backdrop-blur-sm">
							<CopyButton text={`background: ${gradient.css};`} size="sm" label="Copy CSS" />
						</div>

						<!-- Label -->
						<div class="p-4 bg-base-100 border-t border-base-200 z-10 flex justify-between items-center">
							<div class="text-sm font-medium truncate" title={gradient.name}>{gradient.name}</div>
							{#if gradient.type === 'animated'}
								<div class="badge badge-xs badge-secondary badge-outline">anim</div>
							{/if}
						</div>
					</div>
				{/each}
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
		<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
