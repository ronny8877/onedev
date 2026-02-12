<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateGrid, type GridConfig } from '$lib/utils/css-utils';
	import { cssLayoutToolsContent } from '$lib/config/content/css-layout-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = cssLayoutToolsContent['grid'];

	let config = $state<GridConfig>({
		columns: 3,
		rows: 2,
		columnGap: 16,
		rowGap: 16,
		columnSizes: '',
		rowSizes: ''
	});

	let useAutoRows = $state(false);
	let itemCount = $state(6);

	let effectiveConfig = $derived({
		...config,
		rows: useAutoRows ? 0 : config.rows
	});

	let cssOutput = $derived(generateGrid(effectiveConfig));

	const boxColors = ['bg-primary/70', 'bg-secondary/70', 'bg-accent/70', 'bg-info/70', 'bg-success/70', 'bg-warning/70'];
</script>

<ToolWrapper
	keywords={['css grid', 'grid generator', 'grid layout', 'css grid builder', 'grid template']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">Live Preview</h3>
					<div class="flex items-center gap-2">
						<span class="text-sm text-base-content/60">Items:</span>
						<input 
							type="number" 
							bind:value={itemCount} 
							min="1" 
							max="12"
							class="input input-bordered input-sm w-16 font-mono"
						/>
					</div>
				</div>
				<div 
					class="min-h-48 p-4 bg-base-300 rounded-xl border-2 border-dashed border-base-content/20"
					style="
						display: grid;
						grid-template-columns: {config.columnSizes || `repeat(${config.columns}, 1fr)`};
						{useAutoRows ? '' : `grid-template-rows: ${config.rowSizes || `repeat(${config.rows}, 1fr)`};`}
						gap: {config.rowGap}px {config.columnGap}px;
					"
				>
					{#each Array(itemCount) as _, i}
						<div 
							class="flex items-center justify-center text-white font-bold rounded-lg min-h-16 {boxColors[i % boxColors.length]}"
						>
							{i + 1}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid md:grid-cols-2 gap-4">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex justify-between">
						<span>Columns</span>
						<span class="text-primary font-mono">{config.columns}</span>
					</h3>
					<input 
						type="range" 
						bind:value={config.columns} 
						min="1" 
						max="6"
						class="range range-primary"
					/>
					<div class="mt-2">
						<input 
							type="text" 
							bind:value={config.columnSizes}
							placeholder="Custom (e.g., 1fr 2fr 1fr)"
							class="input input-bordered input-sm w-full font-mono"
						/>
					</div>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex justify-between items-center">
						<span>Rows</span>
						<label class="label cursor-pointer gap-2">
							<span class="text-xs text-base-content/60">Auto</span>
							<input type="checkbox" bind:checked={useAutoRows} class="checkbox checkbox-sm"/>
						</label>
					</h3>
					{#if !useAutoRows}
						<input 
							type="range" 
							bind:value={config.rows} 
							min="1" 
							max="6"
							class="range range-secondary"
						/>
						<div class="mt-2">
							<input 
								type="text" 
								bind:value={config.rowSizes}
								placeholder="Custom (e.g., auto 1fr auto)"
								class="input input-bordered input-sm w-full font-mono"
							/>
						</div>
					{:else}
						<p class="text-sm text-base-content/60 py-4">Rows will be created automatically based on content.</p>
					{/if}
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex justify-between">
						<span>Column Gap</span>
						<span class="text-primary font-mono">{config.columnGap}px</span>
					</h3>
					<input 
						type="range" 
						bind:value={config.columnGap} 
						min="0" 
						max="48" 
						step="4"
						class="range range-primary"
					/>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex justify-between">
						<span>Row Gap</span>
						<span class="text-secondary font-mono">{config.rowGap}px</span>
					</h3>
					<input 
						type="range" 
						bind:value={config.rowGap} 
						min="0" 
						max="48" 
						step="4"
						class="range range-secondary"
					/>
				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={`.grid-container {\n${cssOutput}\n}`} label="Copy" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm">.grid-container {'{\n'}{cssOutput}{'\n}'}</pre>
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
