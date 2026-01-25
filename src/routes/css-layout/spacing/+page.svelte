<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let margin = $state(20);
	let padding = $state(20);
	let boxSize = $state(100);
	
	// Individual control toggles
	let separateMargin = $state(false);
	let separatePadding = $state(false);

	let mt = $state(20);
	let mr = $state(20);
	let mb = $state(20);
	let ml = $state(20);

	let pt = $state(20);
	let pr = $state(20);
	let pb = $state(20);
	let pl = $state(20);

	// Sync unified values to individual
	$effect(() => {
		if (!separateMargin) {
			mt = mr = mb = ml = margin;
		}
	});

	$effect(() => {
		if (!separatePadding) {
			pt = pr = pb = pl = padding;
		}
	});

	let cssOutput = $derived(`.box {
  /* Margin */
  ${separateMargin 
    ? `margin-top: ${mt}px;\n  margin-right: ${mr}px;\n  margin-bottom: ${mb}px;\n  margin-left: ${ml}px;`
    : `margin: ${margin}px;`}

  /* Padding */
  ${separatePadding
    ? `padding-top: ${pt}px;\n  padding-right: ${pr}px;\n  padding-bottom: ${pb}px;\n  padding-left: ${pl}px;`
    : `padding: ${padding}px;`}
    
  /* Border for visualization */
  border: 1px solid currentColor;
}`);

	let tailwindOutput = $derived(`<!-- Tailwind Classes -->
<div class="${separateMargin ? `mt-[${mt}px] mr-[${mr}px] mb-[${mb}px] ml-[${ml}px]` : `m-[${margin}px]`} ${separatePadding ? `pt-[${pt}px] pr-[${pr}px] pb-[${pb}px] pl-[${pl}px]` : `p-[${padding}px]`} border border-current">
  Content
</div>`);

</script>

<ToolWrapper
	title="Spacing & Box Model Generator"
	description="Visual CSS spacing generator. Adjust margin, padding, and box sizes. Understand the box model visually."
	keywords={['css margin', 'css padding', 'box model', 'css spacing', 'margin vs padding']}
>
	<div class="flex flex-col gap-6">
		<!-- Visualization -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden shadow-sm">
			<div class="card-body p-8 flex items-center justify-center min-h-[400px]">
				
				<!-- Margin Box -->
				<div 
					class="relative border-2 border-dashed border-warning/50 bg-warning/5 relative group"
					style="
						padding-top: {separateMargin ? mt : margin}px;
						padding-right: {separateMargin ? mr : margin}px;
						padding-bottom: {separateMargin ? mb : margin}px;
						padding-left: {separateMargin ? ml : margin}px;
					"
				>
					<div class="absolute top-1 left-1 text-[10px] font-bold text-warning uppercase px-1">Margin</div>
					
					<!-- Border Box -->
					<div class="border-4 border-base-content/20 bg-base-100 relative">
						
						<!-- Padding Box -->
						<div 
							class="relative border-2 border-dashed border-success/50 bg-success/5"
							style="
								padding-top: {separatePadding ? pt : padding}px;
								padding-right: {separatePadding ? pr : padding}px;
								padding-bottom: {separatePadding ? pb : padding}px;
								padding-left: {separatePadding ? pl : padding}px;
							"
						>
							<div class="absolute top-1 left-1 text-[10px] font-bold text-success uppercase px-1">Padding</div>
							
							<!-- Content Box -->
							<div 
								class="bg-primary/20 flex items-center justify-center font-bold text-primary rounded relative"
								style="width: {boxSize}px; height: {boxSize}px;"
							>
								<span class="z-10 bg-base-100/50 backdrop-blur px-2 py-1 rounded">Content</span>
								<div class="absolute inset-0 flex items-center justify-center opacity-50 text-[10px]">
									{boxSize}x{boxSize}
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- Controls -->
		<div class="grid md:grid-cols-2 gap-6">
			
			<!-- Margin Controls -->
			<div class="card bg-base-200 rounded-2xl shadow-sm border-l-4 border-warning">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-sm font-semibold text-warning">Margin (Outer)</h3>
						<label class="label cursor-pointer gap-2 py-0">
							<span class="label-text text-xs">Separate Sides</span>
							<input type="checkbox" bind:checked={separateMargin} class="checkbox checkbox-xs checkbox-warning" />
						</label>
					</div>

					{#if !separateMargin}
						<div class="flex items-center gap-4">
							<input 
								type="range" 
								bind:value={margin} 
								min="0" 
								max="100" 
								class="range range-warning range-sm" 
							/>
							<input type="number" bind:value={margin} class="input input-sm input-bordered w-16" />
						</div>
					{:else}
						<div class="grid grid-cols-2 gap-4">
							<div class="form-control">
								<label class="label py-1 text-xs">Top</label>
								<input type="range" bind:value={mt} min="0" max="100" class="range range-warning range-xs" />
							</div>
							<div class="form-control">
								<label class="label py-1 text-xs">Right</label>
								<input type="range" bind:value={mr} min="0" max="100" class="range range-warning range-xs" />
							</div>
							<div class="form-control">
								<label class="label py-1 text-xs">Bottom</label>
								<input type="range" bind:value={mb} min="0" max="100" class="range range-warning range-xs" />
							</div>
							<div class="form-control">
								<label class="label py-1 text-xs">Left</label>
								<input type="range" bind:value={ml} min="0" max="100" class="range range-warning range-xs" />
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Padding Controls -->
			<div class="card bg-base-200 rounded-2xl shadow-sm border-l-4 border-success">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="text-sm font-semibold text-success">Padding (Inner)</h3>
						<label class="label cursor-pointer gap-2 py-0">
							<span class="label-text text-xs">Separate Sides</span>
							<input type="checkbox" bind:checked={separatePadding} class="checkbox checkbox-xs checkbox-success" />
						</label>
					</div>

					{#if !separatePadding}
						<div class="flex items-center gap-4">
							<input 
								type="range" 
								bind:value={padding} 
								min="0" 
								max="100" 
								class="range range-success range-sm" 
							/>
							<input type="number" bind:value={padding} class="input input-sm input-bordered w-16" />
						</div>
					{:else}
						<div class="grid grid-cols-2 gap-4">
							<div class="form-control">
								<label class="label py-1 text-xs">Top</label>
								<input type="range" bind:value={pt} min="0" max="100" class="range range-success range-xs" />
							</div>
							<div class="form-control">
								<label class="label py-1 text-xs">Right</label>
								<input type="range" bind:value={pr} min="0" max="100" class="range range-success range-xs" />
							</div>
							<div class="form-control">
								<label class="label py-1 text-xs">Bottom</label>
								<input type="range" bind:value={pb} min="0" max="100" class="range range-success range-xs" />
							</div>
							<div class="form-control">
								<label class="label py-1 text-xs">Left</label>
								<input type="range" bind:value={pl} min="0" max="100" class="range range-success range-xs" />
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Box Content Size -->
			<div class="card bg-base-200 rounded-2xl shadow-sm md:col-span-2">
				<div class="card-body p-4 flex-row items-center gap-4">
					<h3 class="text-sm font-semibold shrink-0">Content Size</h3>
					<input type="range" bind:value={boxSize} min="20" max="250" class="range range-primary" />
					<span class="font-mono text-sm w-16 text-right">{boxSize}px</span>
				</div>
			</div>

		</div>

		<!-- Output -->
		<div class="grid md:grid-cols-2 gap-4">
			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold">CSS Output</h3>
						<CopyButton text={cssOutput} label="Copy CSS" size="sm" />
					</div>
					<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto h-40"><code>{cssOutput}</code></pre>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold">Tailwind / Inline</h3>
						<CopyButton text={tailwindOutput} label="Copy HTML" size="sm" />
					</div>
					<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto h-40"><code>{tailwindOutput}</code></pre>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
