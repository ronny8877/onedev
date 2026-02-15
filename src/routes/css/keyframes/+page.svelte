<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = cssToolsContent['keyframes'];

	interface Keyframe {
		id: number;
		percent: number;
		translateX: number;
		translateY: number;
		scale: number;
		rotate: number;
		opacity: number;
		backgroundColor: string;
	}

	let animationName = $state('myAnimation');
	let duration = $state(1000);
	let iterationCount = $state('infinite');
	let direction = $state('normal');
	let timingFunction = $state('ease');
	
	let keyframes = $state<Keyframe[]>([
		{ id: 1, percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#6366f1' },
		{ id: 2, percent: 50, translateX: 50, translateY: -20, scale: 1.2, rotate: 180, opacity: 0.8, backgroundColor: '#ec4899' },
		{ id: 3, percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 360, opacity: 1, backgroundColor: '#6366f1' }
	]);

	let nextId = $state(4);
	let animationProgress = $state(0);
	let isPlaying = $state(false);
	let animationInterval: ReturnType<typeof setInterval> | null = null;

	function addKeyframe() {
		keyframes = [...keyframes, {
			id: nextId++,
			percent: 50,
			translateX: 0,
			translateY: 0,
			scale: 1,
			rotate: 0,
			opacity: 1,
			backgroundColor: '#6366f1'
		}];
	}

	function removeKeyframe(id: number) {
		if (keyframes.length > 2) {
			keyframes = keyframes.filter(k => k.id !== id);
		}
	}

	function sortKeyframes() {
		keyframes = [...keyframes].sort((a, b) => a.percent - b.percent);
	}

	// Interpolate between keyframes
	function getInterpolatedStyle(progress: number) {
		const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
		
		// Find the two keyframes to interpolate between
		let before = sorted[0];
		let after = sorted[sorted.length - 1];
		
		for (let i = 0; i < sorted.length - 1; i++) {
			if (progress >= sorted[i].percent && progress <= sorted[i + 1].percent) {
				before = sorted[i];
				after = sorted[i + 1];
				break;
			}
		}
		
		// Calculate interpolation factor
		const range = after.percent - before.percent;
		const factor = range > 0 ? (progress - before.percent) / range : 0;
		
		// Interpolate values
		const lerp = (a: number, b: number) => a + (b - a) * factor;
		
		return {
			translateX: lerp(before.translateX, after.translateX),
			translateY: lerp(before.translateY, after.translateY),
			scale: lerp(before.scale, after.scale),
			rotate: lerp(before.rotate, after.rotate),
			opacity: lerp(before.opacity, after.opacity),
			backgroundColor: before.backgroundColor // Use discrete color
		};
	}

	function playAnimation() {
		if (isPlaying && animationInterval) {
			clearInterval(animationInterval);
			isPlaying = false;
			return;
		}
		
		isPlaying = true;
		animationProgress = 0;
		const startTime = Date.now();
		const durationMs = duration;
		const infinite = iterationCount === 'infinite';
		const iterations = infinite ? Infinity : parseInt(iterationCount);
		let currentIteration = 0;
		
		animationInterval = setInterval(() => {
			const elapsed = Date.now() - startTime;
			const cycleProgress = (elapsed % durationMs) / durationMs * 100;
			
			if (direction === 'alternate' || direction === 'alternate-reverse') {
				const cycle = Math.floor(elapsed / durationMs);
				if (cycle % 2 === (direction === 'alternate-reverse' ? 0 : 1)) {
					animationProgress = 100 - cycleProgress;
				} else {
					animationProgress = cycleProgress;
				}
			} else if (direction === 'reverse') {
				animationProgress = 100 - cycleProgress;
			} else {
				animationProgress = cycleProgress;
			}
			
			currentIteration = Math.floor(elapsed / durationMs);
			
			if (!infinite && currentIteration >= iterations) {
				if (animationInterval) clearInterval(animationInterval);
				isPlaying = false;
				animationProgress = direction === 'reverse' ? 0 : 100;
			}
		}, 16);
	}

	function applyPreset(preset: string) {
		switch (preset) {
			case 'bounce':
				keyframes = [
					{ id: 1, percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#6366f1' },
					{ id: 2, percent: 50, translateX: 0, translateY: -40, scale: 1.1, rotate: 0, opacity: 1, backgroundColor: '#6366f1' },
					{ id: 3, percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#6366f1' }
				];
				break;
			case 'shake':
				keyframes = [
					{ id: 1, percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#ef4444' },
					{ id: 2, percent: 25, translateX: -15, translateY: 0, scale: 1, rotate: -5, opacity: 1, backgroundColor: '#ef4444' },
					{ id: 3, percent: 50, translateX: 15, translateY: 0, scale: 1, rotate: 5, opacity: 1, backgroundColor: '#ef4444' },
					{ id: 4, percent: 75, translateX: -15, translateY: 0, scale: 1, rotate: -5, opacity: 1, backgroundColor: '#ef4444' },
					{ id: 5, percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#ef4444' }
				];
				break;
			case 'pulse':
				keyframes = [
					{ id: 1, percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#22c55e' },
					{ id: 2, percent: 50, translateX: 0, translateY: 0, scale: 1.2, rotate: 0, opacity: 0.7, backgroundColor: '#22c55e' },
					{ id: 3, percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#22c55e' }
				];
				break;
			case 'spin':
				keyframes = [
					{ id: 1, percent: 0, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#f59e0b' },
					{ id: 2, percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 360, opacity: 1, backgroundColor: '#f59e0b' }
				];
				break;
			case 'fadeInUp':
				keyframes = [
					{ id: 1, percent: 0, translateX: 0, translateY: 30, scale: 1, rotate: 0, opacity: 0, backgroundColor: '#8b5cf6' },
					{ id: 2, percent: 100, translateX: 0, translateY: 0, scale: 1, rotate: 0, opacity: 1, backgroundColor: '#8b5cf6' }
				];
				iterationCount = '1';
				break;
		}
		nextId = keyframes.length + 1;
	}

	let keyframesCSS = $derived(() => {
		const sorted = [...keyframes].sort((a, b) => a.percent - b.percent);
		const frames = sorted.map(k => {
			const transforms: string[] = [];
			if (k.translateX !== 0 || k.translateY !== 0) transforms.push(`translate(${k.translateX}px, ${k.translateY}px)`);
			if (k.scale !== 1) transforms.push(`scale(${k.scale})`);
			if (k.rotate !== 0) transforms.push(`rotate(${k.rotate}deg)`);
			
			const props: string[] = [];
			if (transforms.length) props.push(`transform: ${transforms.join(' ')}`);
			if (k.opacity !== 1) props.push(`opacity: ${k.opacity}`);
			props.push(`background-color: ${k.backgroundColor}`);
			
			return `  ${k.percent}% {\n    ${props.join(';\n    ')};\n  }`;
		}).join('\n');
		return `@keyframes ${animationName} {\n${frames}\n}`;
	});

	let animationCSS = $derived(
		`animation: ${animationName} ${duration}ms ${timingFunction} ${iterationCount} ${direction};`
	);

	let fullCSS = $derived(`${keyframesCSS()}\n\n.animated-element {\n  ${animationCSS}\n}`);

	let currentStyle = $derived(getInterpolatedStyle(animationProgress));
</script>

<ToolWrapper
	keywords={['css keyframes', 'animation generator', 'css animation', 'keyframes builder']}
>
	<div class="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
		<!-- Left Column: Editor & Output -->
		<div class="space-y-6">
			
			<!-- Keyframes Editor -->
			<div class="card bg-base-200 rounded-2xl border border-base-300 shadow-sm">
				<div class="card-body p-4 sm:p-6">
					<div class="flex items-center justify-between flex-wrap mb-6">
						<h3 class="text-sm font-semibold flex items-center gap-2">
                            <span class="w-2 h-6 bg-primary rounded-full"></span>
                            Keyframes Editor ({keyframes.length})
                        </h3>
						<div class="flex gap-2">
							<button class="btn btn-sm btn-ghost hover:bg-base-300" onclick={sortKeyframes}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                Sort by %
                            </button>
							<button class="btn btn-sm btn-primary" onclick={addKeyframe}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add Keyframe
                            </button>
						</div>
					</div>

					<div class="space-y-4 relative">
                        <!-- Connector Line -->
                        <div class="absolute left-6 top-8 bottom-8 w-0.5 bg-base-300/50 z-0"></div>

						{#each keyframes as kf (kf.id)}
							<div class="relative pl-12 group">
                                <!-- Percentage Bubble -->
                                <div class="absolute left-0 top-4 w-12 h-12 flex items-center justify-center bg-base-100 rounded-full border-4 border-base-200 shadow-sm z-10 group-hover:border-primary/20 transition-colors">
                                    <div class="w-3 h-3 rounded-full" style="background-color: {kf.backgroundColor}"></div>
                                </div>

								<div class="p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all duration-200">
									<div class="flex items-center justify-between mb-4 pb-3 border-b border-base-200">
										<div class="flex items-center gap-3">
                                            <div class="join">
                                                <input 
                                                    type="number" 
                                                    bind:value={kf.percent} 
                                                    min="0" 
                                                    max="100" 
                                                    class="input input-sm input-bordered join-item w-20 font-mono font-bold text-center focus:outline-none"
                                                />
                                                <div class="btn btn-sm join-item no-animation cursor-default bg-base-200 border-base-300">%</div>
                                            </div>
                                            <input type="color" bind:value={kf.backgroundColor} class="w-8 h-8 rounded cursor-pointer border-none bg-transparent" title="Keyframe Color"/>
										</div>
										<button 
											class="btn btn-xs btn-ghost text-base-content/40 hover:text-error hover:bg-error/10"
											onclick={() => removeKeyframe(kf.id)}
											disabled={keyframes.length <= 2}
                                            title="Remove Keyframe"
										>
											<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
										</button>
									</div>
									
                                    <!-- Properties Grid -->
                                    <div class="grid gap-4">
                                        <!-- Position -->
                                        <div class="grid grid-cols-2 gap-3">
                                            <div class="form-control">
                                                <label class="label text-xs font-medium opacity-60 p-0 mb-1">Translate X (px)</label>
                                                <input type="number" bind:value={kf.translateX} class="input input-bordered input-sm w-full font-mono"/>
                                            </div>
                                            <div class="form-control">
                                                <label class="label text-xs font-medium opacity-60 p-0 mb-1">Translate Y (px)</label>
                                                <input type="number" bind:value={kf.translateY} class="input input-bordered input-sm w-full font-mono"/>
                                            </div>
                                        </div>

                                        <!-- Transform Properties -->
                                        <div class="grid grid-cols-3 gap-3">
                                            <div class="form-control">
                                                <label class="label text-xs font-medium opacity-60 p-0 mb-1">Scale</label>
                                                <input type="number" bind:value={kf.scale} step="0.1" min="0" class="input input-bordered input-sm w-full font-mono"/>
                                            </div>
                                            <div class="form-control">
                                                <label class="label text-xs font-medium opacity-60 p-0 mb-1">Rotate (deg)</label>
                                                <input type="number" bind:value={kf.rotate} class="input input-bordered input-sm w-full font-mono"/>
                                            </div>
                                            <div class="form-control">
                                                <label class="label text-xs font-medium opacity-60 p-0 mb-1">Opacity</label>
                                                <input type="number" bind:value={kf.opacity} step="0.1" min="0" max="1" class="input input-bordered input-sm w-full font-mono"/>
                                            </div>
                                        </div>
                                    </div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

            <!-- CSS Output -->
            <div class="card bg-base-200 rounded-2xl border border-base-300 shadow-sm">
                <div class="card-body p-4">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-sm font-semibold">Generated CSS</h3>
                        <CopyButton text={fullCSS} label="Copy CSS" size="sm" />
                    </div>
                    <pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-auto max-h-64 whitespace-pre-wrap break-all max-w-full">{fullCSS}</pre>
                </div>
            </div>
		</div>

		<!-- Right Column: Preview & Settings -->
		<div class="flex flex-col gap-6 sticky top-6">
            
            <!-- Live Preview -->
            <div class="card bg-base-200 rounded-2xl border border-base-300 shadow-sm overflow-hidden">
                <div class="card-body p-0">
                    <div class="p-4 border-b border-base-300 bg-base-100/50 flex items-center justify-between">
                        <h3 class="text-sm font-semibold">Live Preview</h3>
                        <div class="badge badge-neutral font-mono text-xs">{Math.round(animationProgress)}%</div>
                    </div>
                    
                    <div class="relative h-64 bg-base-100 flex items-center justify-center overflow-hidden">
                        <!-- Grid Background -->
                        <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;"></div>
                        
                        <div 
                            class="w-16 h-16 rounded-xl shadow-lg border-2 border-white/20 transition-transform will-change-transform"
                            style="
                                transform: translate({currentStyle.translateX}px, {currentStyle.translateY}px) scale({currentStyle.scale}) rotate({currentStyle.rotate}deg);
                                opacity: {currentStyle.opacity};
                                background-color: {currentStyle.backgroundColor};
                            "
                        ></div>
                    </div>

                    <div class="p-4 bg-base-100/50 border-t border-base-300">
                        <div class="flex items-center gap-3">
                            <button 
                                class="btn btn-primary flex-1" 
                                onclick={playAnimation}
                            >
                                {isPlaying ? '⏹ Stop' : '▶ Play Animation'}
                            </button>
                        </div>
                        <div class="mt-3 h-1.5 w-full bg-base-300 rounded-full overflow-hidden">
                            <div class="h-full bg-primary transition-all duration-75" style="width: {animationProgress}%"></div>
                        </div>
                    </div>
                </div>
            </div>

			<!-- Animation Settings -->
			<div class="card bg-base-200 rounded-2xl border border-base-300 shadow-sm">
				<div class="card-body p-4 space-y-4">
					<h3 class="text-sm font-semibold">Global Settings</h3>
					
                    <div class="form-control">
                        <label class="label text-xs font-medium opacity-70 p-0 mb-1">Animation Name</label>
                        <input type="text" bind:value={animationName} class="input input-bordered input-sm w-full font-mono"/>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="form-control">
                            <label class="label text-xs font-medium opacity-70 p-0 mb-1">Duration (ms)</label>
                            <input type="number" bind:value={duration} min="100" step="100" class="input input-bordered input-sm w-full font-mono"/>
                        </div>
                        <div class="form-control">
                            <label class="label text-xs font-medium opacity-70 p-0 mb-1">Timing</label>
                            <select bind:value={timingFunction} class="select select-bordered select-sm w-full text-xs">
                                <option value="linear">linear</option>
                                <option value="ease">ease</option>
                                <option value="ease-in">ease-in</option>
                                <option value="ease-out">ease-out</option>
                                <option value="ease-in-out">ease-in-out</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div class="form-control">
                            <label class="label text-xs font-medium opacity-70 p-0 mb-1">Iteration</label>
                            <select bind:value={iterationCount} class="select select-bordered select-sm w-full text-xs">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="infinite">infinite</option>
                            </select>
                        </div>
                        <div class="form-control">
                            <label class="label text-xs font-medium opacity-70 p-0 mb-1">Direction</label>
                            <select bind:value={direction} class="select select-bordered select-sm w-full text-xs">
                                <option value="normal">normal</option>
                                <option value="reverse">reverse</option>
                                <option value="alternate">alternate</option>
                                <option value="alternate-reverse">alt-reverse</option>
                            </select>
                        </div>
                    </div>
				</div>
			</div>

			<!-- Presets -->
			<div class="card bg-base-200 rounded-2xl border border-base-300 shadow-sm">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Quick Presets</h3>
					<div class="flex flex-wrap gap-2">
						{#each ['bounce', 'shake', 'pulse', 'spin', 'fadeInUp'] as preset}
							<button 
                                class="btn btn-sm btn-ghost bg-base-100 border-base-300 hover:border-primary hover:text-primary transition-all" 
                                onclick={() => applyPreset(preset)}
                            >
								{preset}
							</button>
						{/each}
					</div>
				</div>
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
