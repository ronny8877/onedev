<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { linearGradients, radialGradients, conicGradients, animatedGradients, keyframes, type GradientDef } from './gradients';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = cssToolsContent['gradient'];

	type GradientType = 'linear' | 'radial' | 'conic' | 'animated';

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
	let isAnimated = $state(false);

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
			case 'animated': // Fallback for manual switch, though usually set via preset
				return `linear-gradient(${angle}deg, ${stops})`; 
		}
	});

	let animationCSS = $derived(isAnimated ? 'animation: gradient-shift 10s ease infinite; background-size: 400% 400%;' : '');
	let fullCSS = $derived(`background: ${gradientCSS};${isAnimated ? '\n' + animationCSS : ''}`);
	
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

    // Color Theory Randomizer
    function generateRandomGradient() {
        const schemes = ['analogous', 'complementary', 'triadic', 'monochromatic'];
        const scheme = schemes[Math.floor(Math.random() * schemes.length)];
        const baseHue = Math.floor(Math.random() * 360);
        
        let newstops: ColorStop[] = [];
        
        const count = Math.floor(Math.random() * 2) + 2; // 2 or 3 stops

        for (let i = 0; i < count; i++) {
            let hue = baseHue;
            if (scheme === 'analogous') hue = (baseHue + (i * 30)) % 360;
            if (scheme === 'complementary') hue = (baseHue + (i * 180)) % 360;
            if (scheme === 'triadic') hue = (baseHue + (i * 120)) % 360;
            
            const sat = 70 + Math.random() * 30; // 70-100%
            const light = 40 + Math.random() * 40; // 40-80%
            
            newstops.push({
                id: crypto.randomUUID(),
                color: `hsl(${hue}, ${sat}%, ${light}%)`,
                position: i === 0 ? 0 : i === count - 1 ? 100 : Math.floor((100 / (count - 1)) * i)
            });
        }
        
        colorStops = newstops;
        angle = Math.floor(Math.random() * 360);
        gradientType = Math.random() > 0.8 ? 'radial' : 'linear'; // Mostly linear
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

    // Touch Logic
    function handleTouchStart(e: TouchEvent, id: string) {
        // Prevent default to stop scrolling while dragging
        if (e.cancelable) e.preventDefault();
        isDragging = true;
        selectedStopId = id;
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
    }

    function handleTouchMove(e: TouchEvent) {
        if (!isDragging || !selectedStopId || !gradientBarRef) return;
        if (e.cancelable) e.preventDefault();
        
        const touch = e.touches[0];
        const rect = gradientBarRef.getBoundingClientRect();
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        const percentage = Math.round((x / rect.width) * 100);
        
        updateStopPosition(selectedStopId, percentage);
    }

    function handleTouchEnd() {
        isDragging = false;
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
    }

	// Presets
	const presets = [
		{ name: 'Sunset', stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }], type: 'linear' as GradientType, angle: 135 },
		{ name: 'Ocean', stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }], type: 'linear' as GradientType, angle: 90 },
		{ name: 'Aqua', stops: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 100 }], type: 'linear' as GradientType, angle: 90 },
		{ name: 'Fresh', stops: [{ color: '#43e97b', position: 0 }, { color: '#38f9d7', position: 100 }], type: 'linear' as GradientType, angle: 135 },
		{ name: 'Warm', stops: [{ color: '#fa709a', position: 0 }, { color: '#fee140', position: 100 }], type: 'linear' as GradientType, angle: 90 },
	];

	function applyPreset(preset: { type?: GradientType, angle?: number, stops: {color: string, position: number}[], shape?: 'circle'|'ellipse', position?: {x:number,y:number} }) {
		if (preset.type) gradientType = preset.type === 'animated' ? 'linear' : preset.type;
        if (preset.angle !== undefined) angle = preset.angle;
        if (preset.shape) radialShape = preset.shape;
        if (preset.position) radialPosition = preset.position;
		
        colorStops = preset.stops.map(s => ({ ...s, id: crypto.randomUUID() }));
		selectedStopId = colorStops[0]?.id ?? null;
        isAnimated = preset.type === 'animated';
        window.scrollTo({ top: 0, behavior: 'smooth' });
	}

    function loadGradient(gradient: GradientDef) {
        applyPreset(gradient);
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
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
			</div>
			<div>
				<h3 class="font-semibold text-sm">Need Inspiration?</h3>
				<p class="text-xs opacity-70">Check out our collection of 60+ ready-to-use gradients.</p>
			</div>
		</div>
		<button class="btn btn-sm btn-primary" onclick={scrollToLibrary}>
			Browse Library
			<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-1"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
		</button>
	</div>

	<div class="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
		
		<!-- Left Column: Preview & Stops & CSS -->
		<div class="space-y-6">
			<!-- Main Preview Canvas -->
			<div class="card bg-base-200 shadow-sm border border-base-300 overflow-hidden">
                <div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
                    <h3 class="text-sm font-semibold">Preview</h3>
                    <div class="flex items-center gap-2">
                        <button 
                            class="btn btn-xs {isAnimated ? 'btn-secondary shadow-lg' : 'btn-ghost'}"
                            onclick={() => isAnimated = !isAnimated}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Animate
                        </button>
                    </div>
                </div>
				<div 
					class="w-full h-[360px] transition-all duration-300 relative"
					style="background: {gradientCSS}; {animationCSS}"
				>
                    <!-- Grid Texture Overlay -->
                    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"></div>
				</div>
			</div>

            <!-- Color Stops (Moved to Left) -->
            <div class="card bg-base-200 border border-base-300 shadow-sm">
                <div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
                    <h3 class="text-sm font-semibold">Color Stops ({colorStops.length})</h3>
                    <div class="flex items-center gap-2">
                        <button class="btn btn-xs btn-ghost" onclick={generateRandomGradient} title="Random Gradient">
                             🎲 Random
                        </button>
                        <button class="btn btn-xs btn-primary gap-1" onclick={addColorStop}>
                            + Add Stop
                        </button>
                    </div>
                </div>
                
                <div class="p-5">
                    <!-- Gradient Bar Visual (Draggable) -->
                    <div class="mb-6 px-3 py-2 bg-base-100 rounded-2xl border border-base-300/50 shadow-inner">
                        <div 
                            class="relative h-8 select-none cursor-pointer"
                            bind:this={gradientBarRef}
                            role="slider"
                            tabindex="0"
                            aria-valuenow={0}
                        >
                            <!-- Main Gradient Bar -->
                            <div 
                                class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 rounded-full shadow-sm ring-1 ring-base-content/5"
                                style="background: linear-gradient(90deg, {sortedStops.map(s => `${s.color} ${s.position}%`).join(', ')});"
                            ></div>
                            
                            <!-- Handles -->
                            {#each colorStops as stop (stop.id)}
                                <!-- svelte-ignore a11y_no_static_element_interactions -->
                                <div 
                                    class="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-[3px] border-white shadow-md cursor-grab active:cursor-grabbing transition-transform hover:scale-110 {selectedStopId === stop.id ? 'ring-2 ring-primary scale-125 z-10' : 'z-0'}"
                                    style="left: calc({stop.position}% - 10px); background: {stop.color};"
                                    onmousedown={(e) => handleMouseDown(e, stop.id)}
                                    ontouchstart={(e) => handleTouchStart(e, stop.id)}
                                ></div>
                            {/each}
                        </div>
                    </div>

                    <!-- Stop List (Fixed Height as requested to align) -->
                    <div class="max-h-[220px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
                        {#each sortedStops as stop (stop.id)}
                            <div 
                                class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 border 
                                {selectedStopId === stop.id ? 'bg-base-100 border-primary shadow-sm ring-1 ring-primary/20' : 'hover:bg-base-100 border-transparent hover:border-base-300'}"
                                onclick={() => selectedStopId = stop.id}
                                role="button"
                                tabindex="0"
                            >
                                <div class="relative w-8 h-8 rounded shadow-sm border border-base-300 overflow-hidden group">
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
                                    <div class="flex items-center gap-2">
                                         <input 
                                            type="text" 
                                            value={stop.color}
                                            oninput={(e) => updateStopColor(stop.id, (e.target as HTMLInputElement).value)}
                                            class="input input-xs input-ghost p-0 h-auto font-mono text-xs uppercase w-20"
                                        />
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                     <input 
                                        type="number" 
                                        value={stop.position}
                                        oninput={(e) => updateStopPosition(stop!.id, parseInt((e.target as HTMLInputElement).value))}
                                        min="0" 
                                        max="100" 
                                        class="input input-xs input-bordered w-14 text-center"
                                    />
                                    <span class="text-xs opacity-50">%</span>
                                </div>
                                <button 
                                    class="btn btn-xs btn-ghost btn-square text-error hover:bg-error/10 opacity-50 hover:opacity-100"
                                    onclick={(e) => { e.stopPropagation(); removeColorStop(stop.id); }}
                                    disabled={colorStops.length <= 2}
                                    title="Remove stop"
                                >
                                    ✕
                                </button>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- CSS Output -->
			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 flex items-center justify-between bg-base-100/50">
					<h3 class="text-sm font-semibold">CSS Code</h3>
					<CopyButton text={fullCSS} label="Copy CSS" size="sm" />
				</div>
				<div class="p-4 bg-base-100/50 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all rounded-b-2xl max-w-full">
					<span class="text-primary">background</span>: {gradientCSS};{#if isAnimated}<br/><span class="text-secondary">animation</span>: {animationCSS.split(';')[0]};{/if}
				</div>
			</div>
		</div>

		<!-- Right Column: Properties & Presets -->
		<div class="flex flex-col gap-6 sticky top-6">
			
			<!-- Setup Card -->
			<div class="card bg-base-200 rounded-xl border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 bg-base-100/50">
                    <h3 class="text-sm font-semibold">Properties</h3>
                </div>
				<div class="p-5 space-y-6">
					
					<!-- Type Selector -->
					<div class="form-control">
                        <label class="label text-xs font-medium opacity-70 p-0 mb-2">Type</label>
						<div class="join w-full grid grid-cols-3">
							{#each ['linear', 'radial', 'conic'] as type}
								<button
									class="btn btn-sm join-item {gradientType === type ? 'btn-neutral text-neutral-content' : 'btn-ghost bg-base-100'}"
									onclick={() => gradientType = type as GradientType}
								>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</button>
							{/each}
						</div>
					</div>

					<div class="divider my-0"></div>

                    <!-- Direction/Position -->
                    {#if gradientType === 'linear' || gradientType === 'conic'}
                        <div class="form-control">
                            <div class="flex justify-between mb-2">
                                <span class="label-text text-xs font-medium opacity-70">Angle</span>
                                <span class="badge badge-neutral font-mono text-xs">{angle}°</span>
                            </div>
                            <input 
                                type="range" 
                                bind:value={angle} 
                                min="0" 
                                max="360" 
                                class="range range-xs range-primary w-full" 
                            />
                            <div class="flex justify-between mt-3 px-1">
                                {#each [0, 90, 180, 270] as deg}
                                    <button 
                                        class="btn btn-xs btn-ghost text-[10px]"
                                        onclick={() => angle = deg}
                                    >
                                        {deg}°
                                    </button>
                                {/each}
                            </div>
                        </div>
                    {/if}

                    {#if gradientType === 'radial'}
                         <div class="form-control">
                            <label class="label text-xs font-medium opacity-70 p-0 mb-2">Shape</label>
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
                       <div class="space-y-4">
                            <div class="form-control">
                                <div class="flex justify-between mb-1">
                                    <span class="text-xs font-medium opacity-70">Center X</span>
                                    <span class="font-mono text-xs badge badge-neutral badge-sm">{radialPosition.x}%</span>
                                </div>
                                <input type="range" bind:value={radialPosition.x} min="0" max="100" class="range range-xs range-accent w-full"/>
                            </div>
                            <div class="form-control">
                                <div class="flex justify-between mb-1">
                                    <span class="text-xs font-medium opacity-70">Center Y</span>
                                    <span class="font-mono text-xs badge badge-neutral badge-sm">{radialPosition.y}%</span>
                                </div>
                                <input type="range" bind:value={radialPosition.y} min="0" max="100" class="range range-xs range-accent w-full"/>
                            </div>
                        </div>
                    {/if}
				</div>
			</div>

			<!-- Quick Presets -->
			<div class="card bg-base-200 rounded-xl border border-base-300 shadow-sm">
				<div class="p-3 border-b border-base-300 bg-base-100/50">
                    <h3 class="text-sm font-semibold">Quick Presets</h3>
                </div>
				<div class="p-4">
					<div class="flex flex-wrap gap-2">
						{#each presets as preset}
							<button
								class="btn btn-sm btn-ghost bg-base-100 shadow-sm gap-2 hover:scale-105 border border-base-300/50 grow"
								onclick={() => applyPreset(preset)}
							>
								<span 
									class="w-3 h-3 rounded-full shadow-inner ring-1 ring-base-content/10"
									style="background: linear-gradient(90deg, {preset.stops.map(s => s.color).join(', ')});"
								></span>
								{preset.name}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Gradient Library Section -->
	<div class="divider my-10">Gradient Library</div>

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

		<div class="grid grid-cols-2 md:grid-cols-3 gap-6">
			{#each activeLibraryGradients as gradient}
                {@const gradientCss = gradient.css || `linear-gradient(${gradient.angle || 90}deg, ${gradient.stops.map(s => `${s.color} ${s.position}%`).join(', ')})`}
				<div class="group relative card bg-base-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-base-300 hover:-translate-y-1">
					<!-- Visual -->
					<div 
						class="h-40 w-full transition-transform duration-500 group-hover:scale-110"
						style="background: {gradientCss};"
					></div>
					
					<!-- Overlay Info -->
					<div class="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-base-300/60 backdrop-blur-sm">
                         <button 
                            class="btn btn-sm btn-primary shadow-lg" 
                            onclick={() => loadGradient(gradient)}
                            title="Load into Editor"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20v-6M9 14l3-3 3 3M4 4h16"/></svg>
                            Edit
                        </button>
						<CopyButton text={`background: ${gradientCss};`} size="sm" />
					</div>

					<!-- Label -->
					<div class="p-3 bg-base-100 border-t border-base-200 z-10 flex justify-between items-center">
						<div class="text-xs font-medium truncate" title={gradient.name}>{gradient.name}</div>
						{#if gradient.type === 'animated'}
							<div class="badge badge-xs badge-secondary badge-outline" title="Animated">anim</div>
						{/if}
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
		<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
