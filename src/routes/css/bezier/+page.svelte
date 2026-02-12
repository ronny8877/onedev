<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { cubicBezierPresets, type CubicBezierPreset } from '$lib/utils/css-utils';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = cssToolsContent['bezier'];

	// Control points
	let p1x = $state(0.25);
	let p1y = $state(0.1);
	let p2x = $state(0.25);
	let p2y = $state(1);

	let selectedPreset = $state<CubicBezierPreset | ''>('ease');
	let ballPosition = $state(0);
	let isAnimating = $state(false);
	let animationDuration = $state(1000);

	let cssOutput = $derived(`cubic-bezier(${p1x.toFixed(2)}, ${p1y.toFixed(2)}, ${p2x.toFixed(2)}, ${p2y.toFixed(2)})`);

	function applyPreset(preset: CubicBezierPreset) {
		const [x1, y1, x2, y2] = cubicBezierPresets[preset];
		p1x = x1;
		p1y = y1;
		p2x = x2;
		p2y = y2;
		selectedPreset = preset;
	}

	function playAnimation() {
		if (isAnimating) return;
		
		ballPosition = 0;
		isAnimating = true;
		
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				ballPosition = 100;
			});
		});
		
		setTimeout(() => {
			isAnimating = false;
			ballPosition = 0;
		}, animationDuration + 200);
	}

	// SVG coordinates (scaled to 200x200)
	let svgP1 = $derived({ x: p1x * 200, y: 200 - p1y * 200 });
	let svgP2 = $derived({ x: p2x * 200, y: 200 - p2y * 200 });
</script>

<ToolWrapper
	keywords={['cubic bezier', 'easing curves', 'css timing', 'animation easing', 'bezier editor']}
>
	<div class="flex flex-col gap-6">
		<!-- Presets -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Presets</h3>
				<div class="flex flex-wrap gap-2">
					{#each Object.keys(cubicBezierPresets) as preset}
						<button
							class="btn btn-sm {selectedPreset === preset ? 'btn-primary' : 'btn-ghost'}"
							onclick={() => applyPreset(preset as CubicBezierPreset)}
						>
							{preset}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Curve Editor -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-6">
					<h3 class="text-sm font-semibold mb-4">Curve Visualization</h3>
					<div class="flex justify-center">
						<div class="relative">
							<svg viewBox="-20 -20 240 240" class="w-72 h-72 bg-base-300 rounded-2xl">
								<!-- Grid -->
								<defs>
									<pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
										<path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1"/>
									</pattern>
								</defs>
								<rect x="0" y="0" width="200" height="200" fill="url(#smallGrid)"/>
								
								<!-- Axes -->
								<line x1="0" y1="200" x2="200" y2="200" stroke="currentColor" stroke-width="2" opacity="0.2"/>
								<line x1="0" y1="0" x2="0" y2="200" stroke="currentColor" stroke-width="2" opacity="0.2"/>
								
								<!-- Linear reference -->
								<line x1="0" y1="200" x2="200" y2="0" stroke="currentColor" stroke-width="1" opacity="0.15" stroke-dasharray="6,6"/>
								
								<!-- Control line 1 -->
								<line 
									x1="0" y1="200" 
									x2={svgP1.x} y2={svgP1.y} 
									stroke="#ec4899" 
									stroke-width="2" 
									opacity="0.8"
								/>
								
								<!-- Control line 2 -->
								<line 
									x1="200" y1="0" 
									x2={svgP2.x} y2={svgP2.y} 
									stroke="#8b5cf6" 
									stroke-width="2" 
									opacity="0.8"
								/>
								
								<!-- Bezier curve -->
								<path 
									d="M 0,200 C {svgP1.x},{svgP1.y} {svgP2.x},{svgP2.y} 200,0"
									fill="none"
									stroke="#6366f1"
									stroke-width="4"
									stroke-linecap="round"
								/>
								
								<!-- Control point 1 -->
								<circle 
									cx={svgP1.x} 
									cy={svgP1.y} 
									r="12" 
									fill="#ec4899"
									stroke="white"
									stroke-width="3"
									class="cursor-move drop-shadow-lg"
								/>
								
								<!-- Control point 2 -->
								<circle 
									cx={svgP2.x} 
									cy={svgP2.y} 
									r="12" 
									fill="#8b5cf6"
									stroke="white"
									stroke-width="3"
									class="cursor-move drop-shadow-lg"
								/>
								
								<!-- Start point -->
								<circle cx="0" cy="200" r="6" fill="#6366f1"/>
								<!-- End point -->
								<circle cx="200" cy="0" r="6" fill="#6366f1"/>
								
								<!-- Axis labels -->
								<text x="100" y="220" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.5">Time</text>
								<text x="-15" y="100" text-anchor="middle" font-size="11" fill="currentColor" opacity="0.5" transform="rotate(-90 -15 100)">Progress</text>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<!-- Controls & Preview -->
			<div class="flex flex-col gap-4">
				<!-- Control Point Sliders -->
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<h3 class="text-sm font-semibold mb-4">Control Points</h3>
						
						<!-- P1 Controls -->
						<div class="mb-4 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
							<div class="flex items-center gap-2 mb-2">
								<div class="w-3 h-3 rounded-full bg-pink-500"></div>
								<span class="text-sm font-medium">Point 1</span>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<div class="flex justify-between text-xs text-base-content/60 mb-1">
										<span>X</span>
										<span class="font-mono">{p1x.toFixed(2)}</span>
									</div>
									<input type="range" bind:value={p1x} step="0.01" min="0" max="1" class="range range-xs range-primary"/>
								</div>
								<div>
									<div class="flex justify-between text-xs text-base-content/60 mb-1">
										<span>Y</span>
										<span class="font-mono">{p1y.toFixed(2)}</span>
									</div>
									<input type="range" bind:value={p1y} step="0.01" min="-0.5" max="1.5" class="range range-xs range-primary"/>
								</div>
							</div>
						</div>
						
						<!-- P2 Controls -->
						<div class="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
							<div class="flex items-center gap-2 mb-2">
								<div class="w-3 h-3 rounded-full bg-purple-500"></div>
								<span class="text-sm font-medium">Point 2</span>
							</div>
							<div class="grid grid-cols-2 gap-3">
								<div>
									<div class="flex justify-between text-xs text-base-content/60 mb-1">
										<span>X</span>
										<span class="font-mono">{p2x.toFixed(2)}</span>
									</div>
									<input type="range" bind:value={p2x} step="0.01" min="0" max="1" class="range range-xs range-secondary"/>
								</div>
								<div>
									<div class="flex justify-between text-xs text-base-content/60 mb-1">
										<span>Y</span>
										<span class="font-mono">{p2y.toFixed(2)}</span>
									</div>
									<input type="range" bind:value={p2y} step="0.01" min="-0.5" max="1.5" class="range range-xs range-secondary"/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Animation Preview -->
				<div class="card bg-base-200 rounded-2xl">
					<div class="card-body p-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-sm font-semibold">Animation Preview</h3>
							<div class="flex items-center gap-2">
								<select bind:value={animationDuration} class="select select-bordered select-xs">
									<option value={500}>0.5s</option>
									<option value={1000}>1s</option>
									<option value={1500}>1.5s</option>
									<option value={2000}>2s</option>
								</select>
								<button 
									class="btn btn-sm btn-primary" 
									onclick={playAnimation} 
									disabled={isAnimating}
								>
									{isAnimating ? '⏳' : '▶'} Play
								</button>
							</div>
						</div>
						<div class="relative h-16 bg-base-300 rounded-full px-2">
							<div 
								class="absolute top-3 w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg"
								style="
									left: {ballPosition}%;
									transform: translateX(-{ballPosition * 0.4}px);
									transition: left {animationDuration}ms {cssOutput};
								"
							></div>
						</div>
						<div class="flex justify-between text-xs text-base-content/50 mt-2 px-2">
							<span>0%</span>
							<span>50%</span>
							<span>100%</span>
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
					<div class="flex gap-2">
						<CopyButton text={cssOutput} label="Copy Value" size="sm" />
						<CopyButton text={`transition-timing-function: ${cssOutput};`} label="Copy Full" size="sm" />
					</div>
				</div>
				<div class="grid sm:grid-cols-2 gap-3">
					<div class="bg-base-300 p-3 rounded-xl">
						<div class="text-xs text-base-content/50 mb-1">Value only</div>
						<code class="font-mono text-sm text-primary">{cssOutput}</code>
					</div>
					<div class="bg-base-300 p-3 rounded-xl">
						<div class="text-xs text-base-content/50 mb-1">Full property</div>
						<code class="font-mono text-sm">transition-timing-function: {cssOutput};</code>
					</div>
				</div>
			</div>
		</div>

		<!-- Comparison -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Compare with Built-in Easings</h3>
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
					{#each ['linear', 'ease', 'ease-in', 'ease-out'] as easing}
						<div class="bg-base-300 p-3 rounded-xl text-center">
							<div class="text-xs font-mono mb-2">{easing}</div>
							<div class="relative h-8 bg-base-content/10 rounded-full">
								<div 
									class="absolute top-1 w-6 h-6 rounded-full bg-base-content/30"
									style="
										left: {ballPosition}%;
										transform: translateX(-{ballPosition * 0.24}px);
										transition: left {animationDuration}ms {easing};
									"
								></div>
							</div>
						</div>
					{/each}
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
