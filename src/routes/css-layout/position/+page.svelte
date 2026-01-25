<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	type Position = 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';

	let position = $state<Position>('relative');
	let zIndex = $state(1);
	let top = $state(20);
	let left = $state(20);
	let right = $state<number | null>(null); // Null means auto
	let bottom = $state<number | null>(null);

	// Helpers to toggle Auto vs Value
	let hasTop = $state(true);
	let hasLeft = $state(true);
	let hasRight = $state(false);
	let hasBottom = $state(false);

	// Reset unsupported props when changing position
	function updatePosition(p: Position) {
		position = p;
		if (p === 'static') {
			zIndex = 0;
		}
	}

	let cssOutput = $derived(`/* Target Element */
.element {
  position: ${position};
  z-index: ${zIndex};
${hasTop ? `  top: ${top}px;` : ''}
${hasRight ? `  right: ${right ?? 0}px;` : ''}
${hasBottom ? `  bottom: ${bottom ?? 0}px;` : ''}
${hasLeft ? `  left: ${left}px;` : ''}
}`);
</script>

<ToolWrapper
	title="Position & Z-Index Playground"
	description="Visual playground for CSS positioning (absolute, relative, fixed, sticky) and z-index stacking contexts."
	keywords={['css position', 'z-index', 'css layer', 'absolute position', 'css sticky', 'stacking context']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview Area -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden shadow-sm relative z-0">
			<div class="card-body p-0">
				<div class="h-[400px] w-full overflow-auto bg-base-300 relative border border-base-content/10 scroll-smooth p-8" id="scroll-container">
					<!-- Grid/Background for context -->
					<div class="absolute inset-0 opacity-10 pointer-events-none" 
						style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 20px 20px;">
					</div>

					<!-- Content to make page scrollable for sticky/fixed -->
					<div class="h-[800px] w-full relative">
						
						<!-- Parent Container -->
						<div class="w-[80%] mx-auto h-[400px] bg-base-100 border-2 border-dashed border-base-content/20 rounded-xl relative mt-10 p-4">
							<div class="text-xs font-bold text-base-content/40 absolute top-2 left-2">Parent (relative)</div>
							
							<!-- Siblings for Z-Index context -->
							<div class="absolute top-10 left-10 w-32 h-32 bg-secondary/80 rounded-lg flex items-center justify-center text-secondary-content font-bold shadow-sm" style="z-index: 2">
								z-index: 2
							</div>
							<div class="absolute top-20 left-40 w-32 h-32 bg-accent/80 rounded-lg flex items-center justify-center text-accent-content font-bold shadow-sm" style="z-index: 5">
								z-index: 5
							</div>
							
							<!-- Target Box -->
							<div 
								class="w-32 h-32 bg-primary/90 rounded-lg shadow-xl flex flex-col items-center justify-center text-primary-content font-bold transition-all duration-300 border-2 border-primary-content/20"
								style="
									position: {position};
									z-index: {zIndex};
									${hasTop ? `top: ${top}px;` : ''}
									${hasRight ? `right: ${right ?? 0}px;` : ''}
									${hasBottom ? `bottom: ${bottom ?? 0}px;` : ''}
									${hasLeft ? `left: ${left}px;` : ''}
								"
							>
								<div class="text-lg">Target</div>
								<div class="text-xs opacity-75 font-mono">z: {zIndex}</div>
							</div>
						</div>
						
						<div class="mt-8 text-center text-xs text-base-content/40">Scroll down to test fixed/sticky behavior</div>
						
						<!-- Content Filler -->
						{#each Array(5) as _, i}
							<div class="w-1/2 mx-auto h-2 bg-base-content/5 rounded mb-4 mt-8"></div>
							<div class="w-1/3 mx-auto h-2 bg-base-content/5 rounded mb-4"></div>
						{/each}

					</div>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid lg:grid-cols-2 gap-4">
			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Position Mode</h3>
					<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
						{#each ['static', 'relative', 'absolute', 'fixed', 'sticky'] as p}
							<button 
								class="btn btn-sm"
								class:btn-primary={position === p}
								onclick={() => updatePosition(p as Position)}
							>
								{p}
							</button>
						{/each}
					</div>

					<div class="divider my-2"></div>

					<h3 class="text-sm font-semibold mb-3 flex justify-between">
						<span>Z-Index</span>
						<span class="text-primary font-mono">{zIndex}</span>
					</h3>
					<input 
						type="range" 
						bind:value={zIndex} 
						min="-1" 
						max="10" 
						step="1"
						class="range range-primary"
					/>
					<div class="text-xs text-base-content/60 mt-2">
						Other items have z-indexes of <strong>2</strong> and <strong>5</strong>. Try values around them.
					</div>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Coordinates (px)</h3>
					
					<!-- Top -->
					<div class="form-control mb-2">
						<label class="label cursor-pointer py-1 justify-start gap-2">
							<input type="checkbox" bind:checked={hasTop} class="checkbox checkbox-xs" />
							<span class="label-text w-12 font-bold text-xs uppercase">Top</span>
							<input 
								type="range" 
								bind:value={top} 
								disabled={!hasTop} 
								min="-50" 
								max="300" 
								class="range range-xs range-secondary flex-1"
							/>
							<span class="font-mono text-xs w-8 text-right">{top}</span>
						</label>
					</div>

					<!-- Right -->
					<div class="form-control mb-2">
						<label class="label cursor-pointer py-1 justify-start gap-2">
							<input type="checkbox" bind:checked={hasRight} class="checkbox checkbox-xs" />
							<span class="label-text w-12 font-bold text-xs uppercase">Right</span>
							<input 
								type="range" 
								bind:value={right} 
								disabled={!hasRight} 
								min="-50" 
								max="300" 
								class="range range-xs range-secondary flex-1"
							/>
							<span class="font-mono text-xs w-8 text-right">{right ?? 0}</span>
						</label>
					</div>

					<!-- Bottom -->
					<div class="form-control mb-2">
						<label class="label cursor-pointer py-1 justify-start gap-2">
							<input type="checkbox" bind:checked={hasBottom} class="checkbox checkbox-xs" />
							<span class="label-text w-12 font-bold text-xs uppercase">Bottom</span>
							<input 
								type="range" 
								bind:value={bottom} 
								disabled={!hasBottom} 
								min="-50" 
								max="300" 
								class="range range-xs range-secondary flex-1"
							/>
							<span class="font-mono text-xs w-8 text-right">{bottom ?? 0}</span>
						</label>
					</div>

					<!-- Left -->
					<div class="form-control mb-2">
						<label class="label cursor-pointer py-1 justify-start gap-2">
							<input type="checkbox" bind:checked={hasLeft} class="checkbox checkbox-xs" />
							<span class="label-text w-12 font-bold text-xs uppercase">Left</span>
							<input 
								type="range" 
								bind:value={left} 
								disabled={!hasLeft} 
								min="-50" 
								max="300" 
								class="range range-xs range-secondary flex-1"
							/>
							<span class="font-mono text-xs w-8 text-right">{left}</span>
						</label>
					</div>

				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl shadow-sm">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={cssOutput} label="Copy CSS" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto"><code>{cssOutput}</code></pre>
			</div>
		</div>
	</div>
</ToolWrapper>
