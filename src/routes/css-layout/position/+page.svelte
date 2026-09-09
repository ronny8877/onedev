<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { cssLayoutToolsContent } from '$lib/config/content/css-layout-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cssLayoutToolsContent['position'];

	type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

	let position = $state<Position>('relative');
	let zIndex = $state(10);
	
	// Coordinates
	let top = $state(40);
	let left = $state(40);
	let right = $state(40);
	let bottom = $state(40);

	// Toggles
	let hasTop = $state(true);
	let hasLeft = $state(true);
	let hasRight = $state(false);
	let hasBottom = $state(false);
	let isCentered = $state(false);

	let show3D = $state(false);
	let scrollTop = $state(0);

	// Reset unsupported props when changing position
	function updatePosition(p: Position) {
		position = p;
		if (p === 'static') {
			zIndex = 0;
		}
		// Reset center mode if switching manually
		if (isCentered && p === 'static') isCentered = false;
	}

	function applyPreset(preset: 'tl' | 'tr' | 'bl' | 'br' | 'center') {
		isCentered = false;
		
		if (preset === 'center') {
			isCentered = true;
			// For sticky, usually we just want horizontal centering + existing top
			if (position === 'sticky') {
				hasLeft = hasRight = true;
				left = right = 0;
				// Ensure at least one vertical anchor exists for sticky
				if (!hasTop && !hasBottom) {
					hasTop = true;
					top = 20;
				}
			} else {
				hasTop = hasRight = hasBottom = hasLeft = true;
				top = right = bottom = left = 0;
			}
			return;
		}
		
		// Reset
		hasTop = hasRight = hasBottom = hasLeft = false;
		
		if (preset === 'tl') { hasTop = true; hasLeft = true; top = 20; left = 20; }
		if (preset === 'tr') { hasTop = true; hasRight = true; top = 20; right = 20; }
		if (preset === 'bl') { hasBottom = true; hasLeft = true; bottom = 20; left = 20; }
		if (preset === 'br') { hasBottom = true; hasRight = true; bottom = 20; right = 20; }
	}

	function onScroll(e: Event) {
		const target = e.target as HTMLDivElement;
		scrollTop = target.scrollTop;
	}

	// Calculate simulated top for fixed position
	let visualStyle = $derived.by(() => {
		let style = `position: ${position}; z-index: ${zIndex};`;
		
		// If Fixed, we simulate it using absolute + scroll offset to keep it "fixed" in the preview box
		if (position === 'fixed') {
			style = `position: absolute; z-index: ${zIndex};`;
			
			if (isCentered) {
				// For centered fixed, we need to calculate center of VISIBLE area
				// Parent is 850px, Scroll viewport is 500px.
				// We want it centered in the 500px viewport.
				const viewportCenterY = scrollTop + (500 / 2) - (160 / 2); // 160 is box height
				style += `top: ${viewportCenterY}px; left: 50%; transform: translateX(-50%) translateZ(${show3D ? zIndex * 10 : 0}px);`;
				return style;
			}
			
			if (hasTop) style += `top: ${top + scrollTop}px;`;
			else if (hasBottom) style += `top: ${scrollTop + 500 - 160 - bottom}px;`; // Visual approximation for bottom fixed
			
			if (hasLeft) style += `left: ${left}px;`;
			if (hasRight) style += `right: ${right}px;`;

			if (!hasTop && !hasBottom) style += `top: ${scrollTop + 40}px;`; // Default if none set
			
		} else {
			// Normal Position Logic
			// Special handling for Sticky Center
			if (isCentered) {
				if (position === 'sticky') {
					style += `margin-inline: auto; left: 0; right: 0;`;
					if (hasTop) style += `top: ${top}px;`;
					if (hasBottom) style += `bottom: ${bottom}px;`;
				} else {
					style += `inset: 0; margin: auto;`;
				}
			} else {
				if (hasTop) style += `top: ${top}px;`;
				if (hasRight) style += `right: ${right}px;`;
				if (hasBottom) style += `bottom: ${bottom}px;`;
				if (hasLeft) style += `left: ${left}px;`;
			}
		}

		// 3D Transforms
		if (show3D) {
			const baseTransform = isCentered && position === 'fixed' ? '' : // Fixed centered already has transform
			                      isCentered && position !== 'fixed' ? 'translateZ(' + (zIndex * 10) + 'px)' : 
			                      `translateZ(${zIndex * 10}px)`;
			
			// Append to existing transform if needed
			if (style.includes('transform:')) {
				style = style.replace('transform:', `transform: ${baseTransform} `); // Hacky prepend
			} else {
				style += `transform: ${baseTransform};`;
			}
			
			style += `box-shadow: ${zIndex}px ${zIndex}px ${zIndex * 2}px rgba(0,0,0,0.2);`; // 3D Shadow
		} else if (!style.includes('transform:')) {
			// Ensure no transform in 2D unless fixed/centered logic added it? 
			// Actually fixed centered uses transform translateX.
			style += `box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);`; // Normal Shadow
		}

		return style;
	});

	let cssOutput = $derived(`/* Target Element */
.element {
  position: ${position};
  z-index: ${zIndex};
${isCentered 
  ? (position === 'sticky' 
      ? `  left: 0;\n  right: 0;\n  margin-inline: auto;\n  /* Centered Horizontal */\n${hasTop ? `  top: ${top}px;` : ''}${hasBottom ? `  bottom: ${bottom}px;` : ''}`
      : `  inset: 0;\n  margin: auto; \n  /* Center in parent/viewport */`
    )
  : `${hasTop ? `  top: ${top}px;` : ''}
${hasRight ? `  right: ${right}px;` : ''}
${hasBottom ? `  bottom: ${bottom}px;` : ''}
${hasLeft ? `  left: ${left}px;` : ''}`}
}`);
</script>

<ToolWrapper
	title="Position & Z-Index Playground"
	description="Visual playground for CSS positioning (absolute, relative, fixed, sticky) and z-index stacking contexts."
	keywords={['css position', 'z-index', 'css layer', 'absolute position', 'css sticky', 'stacking context']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview Area -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden shadow-sm relative z-0 border border-base-300">
			<div class="card-body p-0">
				<div class="absolute top-4 right-4 z-50">
					<label class="label cursor-pointer gap-2 bg-base-100/90 backdrop-blur rounded-lg px-3 py-1 shadow-sm border border-base-200">
						<span class="label-text text-xs font-bold uppercase">3D Layers</span>
						<input type="checkbox" bind:checked={show3D} class="toggle toggle-xs toggle-primary" />
					</label>
				</div>

				<div 
					class="h-[550px] w-full overflow-auto bg-base-100 relative scroll-smooth p-8" 
					id="scroll-container"
					onscroll={onScroll}
				>
					<!-- Grid Background -->
					<div class="absolute inset-0 opacity-[0.03] pointer-events-none" 
						style="background-image: linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px); background-size: 20px 20px;">
					</div>

					<!-- 3D Transform Container -->
					<div 
						class="w-full h-full transition-transform duration-500 ease-in-out pb-[400px]"
						style={show3D ? "transform: perspective(1000px) rotateX(45deg) rotateZ(-10deg) scale(0.8); transform-style: preserve-3d;" : ""}
					>
						<!-- Parent Container -->
						<div 
							class="w-[80%] mx-auto bg-base-200 border-2 border-dashed border-base-content/10 rounded-xl relative mt-10 p-4 transition-all duration-300 shadow-sm group"
							style="
								min-height: {position !== 'sticky' ? '500px' : '850px'};
								{show3D ? 'transform-style: preserve-3d;' : ''}
							"
						>
							<div class="text-xs font-bold text-base-content/40 absolute -top-6 left-0 flex items-center gap-2">
								<span class="badge badge-sm badge-ghost">Parent (relative)</span>
							</div>
							
							<!-- Siblings for Z-Index context -->
							<div 
								class="absolute top-20 left-10 w-40 h-32 bg-secondary/20 border-2 border-secondary/50 rounded-xl flex items-center justify-center text-secondary font-bold backdrop-blur-sm transition-all duration-300" 
								style="z-index: 5; {show3D ? 'transform: translateZ(50px);' : ''} box-shadow: {show3D ? '10px 10px 20px rgba(0,0,0,0.1)' : 'none'}"
							>
								<div class="text-center">
									<div>Sibling A</div>
									<div class="text-xs opacity-70">z-index: 5</div>
								</div>
							</div>

							<div 
								class="absolute top-[350px] right-20 w-40 h-32 bg-accent/20 border-2 border-accent/50 rounded-xl flex items-center justify-center text-accent font-bold backdrop-blur-sm transition-all duration-300" 
								style="z-index: 15; {show3D ? 'transform: translateZ(150px);' : ''} box-shadow: {show3D ? '10px 10px 20px rgba(0,0,0,0.1)' : 'none'}"
							>
								<div class="text-center">
									<div>Sibling B</div>
									<div class="text-xs opacity-70">z-index: 15</div>
									<div class="text-[10px] opacity-50 mt-1">(Lower down)</div>
								</div>
							</div>
							
							<!-- Target Box -->
							<div 
								class="w-40 h-40 bg-primary text-primary-content rounded-xl shadow-lg flex flex-col items-center justify-center font-bold border-2 border-white/20 transition-transform duration-300"
								style={visualStyle}
							>
								<div class="text-xl mb-1">Target</div>
								<div class="badge badge-sm bg-white/20 border-none text-white">z: {zIndex}</div>
								{#if position === 'sticky'}
									<div class="text-[10px] mt-2 font-normal opacity-80 max-w-[120px] text-center leading-tight">Scroll parent to see me stick!</div>
								{:else if position === 'fixed'}
									<div class="text-[10px] mt-2 font-normal opacity-80 max-w-[120px] text-center leading-tight">Fixed to viewport!</div>
								{/if}
							</div>
							
							<!-- Filler content to show parent height -->
							<div class="absolute bottom-4 left-0 right-0 text-center text-xs opacity-30">Parent Bottom</div>
						</div>
						
						<!-- Scrolling Context Helpers -->
						<div class="mt-12 text-center">
							<div class="divider text-xs text-base-content/30 w-1/2 mx-auto">Scroll for Fixed/Sticky</div>
						</div>
						{#each Array(3) as _, i}
							<div class="w-1/2 mx-auto h-4 bg-base-200/50 rounded mb-6 mt-6"></div>
							<div class="w-1/3 mx-auto h-4 bg-base-200/50 rounded mb-6"></div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Position & Z-Index -->
			<div class="card bg-base-200 rounded-2xl shadow-sm border border-base-300">
				<div class="card-body p-6">
					<h3 class="text-sm font-bold uppercase tracking-wider mb-4">Positioning Mode</h3>
					
					<div class="grid grid-cols-5 gap-2 mb-6">
						{#each ['static', 'relative', 'absolute', 'fixed', 'sticky'] as p}
							<button 
								class="btn btn-sm text-[10px] sm:text-xs px-1"
								class:btn-outline={position !== p}
								class:btn-primary={position === p}
								onclick={() => updatePosition(p as Position)}
							>
								{p}
							</button>
						{/each}
					</div>

					<div class="bg-base-100 p-4 rounded-xl border border-base-200">
						<div class="flex justify-between items-center mb-2">
							<span class="text-sm font-medium">Z-Index Level</span>
							<span class="badge badge-lg font-mono">{zIndex}</span>
						</div>
						<input 
							type="range" 
							bind:value={zIndex} 
							min="0" 
							max="20" 
							step="1"
							class="range range-primary range-sm w-full"
							disabled={position === 'static'}
						/>
						<div class="flex justify-between px-1 mt-2 text-xs text-base-content/40 font-mono">
							<span>0</span>
							<span class="text-secondary font-bold">5 (A)</span>
							<span class="text-accent font-bold">15 (B)</span>
							<span>20</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Coordinates -->
			<div class="card bg-base-200 rounded-2xl shadow-sm border border-base-300">
				<div class="card-body p-6">
					<div class="flex justify-between items-center mb-4">
						<h3 class="text-sm font-bold uppercase tracking-wider">Coordinates</h3>
						{#if position === 'static'}
							<span class="badge badge-sm badge-warning">Ignored in Static</span>
						{/if}
					</div>
					
					<!-- Presets -->
					<div class="grid grid-cols-3 gap-2 mb-6">
						<button class="btn btn-xs" disabled={position === 'static'} onclick={() => applyPreset('tl')}>↖ Top-Left</button>
						<button class="btn btn-xs" disabled={position === 'static'} onclick={() => applyPreset('center')}>⊙ Center</button>
						<button class="btn btn-xs" disabled={position === 'static'} onclick={() => applyPreset('tr')}>↗ Top-Right</button>
						
						<button class="btn btn-xs" disabled={position === 'static'} onclick={() => applyPreset('bl')}>↙ Bot-Left</button>
						<div class="flex items-center justify-center text-[10px] opacity-40">Presets</div>
						<button class="btn btn-xs" disabled={position === 'static'} onclick={() => applyPreset('br')}>↘ Bot-Right</button>
					</div>

					<div class="grid grid-cols-2 gap-x-6 gap-y-4">
						<!-- Top -->
						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-2 py-1">
								<input type="checkbox" bind:checked={hasTop} class="checkbox checkbox-xs border-base-content/30" />
								<span class="label-text text-xs font-bold uppercase w-12 text-base-content/70">Top</span>
								<input 
									type="number" 
									bind:value={top} 
									disabled={!hasTop || isCentered} 
									class="input input-xs input-bordered w-full font-mono"
								/>
							</label>
						</div>

						<!-- Right -->
						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-2 py-1">
								<input type="checkbox" bind:checked={hasRight} class="checkbox checkbox-xs border-base-content/30" />
								<span class="label-text text-xs font-bold uppercase w-12 text-base-content/70">Right</span>
								<input 
									type="number" 
									bind:value={right} 
									disabled={!hasRight || isCentered}
									class="input input-xs input-bordered w-full font-mono"
								/>
							</label>
						</div>

						<!-- Bottom -->
						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-2 py-1">
								<input type="checkbox" bind:checked={hasBottom} class="checkbox checkbox-xs border-base-content/30" />
								<span class="label-text text-xs font-bold uppercase w-12 text-base-content/70">Bottom</span>
								<input 
									type="number" 
									bind:value={bottom} 
									disabled={!hasBottom || isCentered}
									class="input input-xs input-bordered w-full font-mono"
								/>
							</label>
						</div>

						<!-- Left -->
						<div class="form-control">
							<label class="label cursor-pointer justify-start gap-2 py-1">
								<input type="checkbox" bind:checked={hasLeft} class="checkbox checkbox-xs border-base-content/30" />
								<span class="label-text text-xs font-bold uppercase w-12 text-base-content/70">Left</span>
								<input 
									type="number" 
									bind:value={left} 
									disabled={!hasLeft || isCentered}
									class="input input-xs input-bordered w-full font-mono"
								/>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl shadow-sm border border-base-300">
			<div class="card-body p-5">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-bold uppercase tracking-wider">CSS Output</h3>
					<CopyButton text={cssOutput} label="Copy CSS" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto"><code>{cssOutput}</code></pre>
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
