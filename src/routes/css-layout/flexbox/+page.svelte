<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateFlexbox, type FlexboxConfig } from '$lib/utils/css-utils';
	import { cssLayoutToolsContent } from '$lib/config/content/css-layout-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = cssLayoutToolsContent['flexbox'];

	let config = $state<FlexboxConfig>({
		direction: 'row',
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		flexWrap: 'nowrap',
		gap: 16
	});

	let itemCount = $state(5);
	let cssOutput = $derived(generateFlexbox(config));

	const directions = ['row', 'row-reverse', 'column', 'column-reverse'] as const;
	const justifyOptions = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] as const;
	const alignOptions = ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'] as const;
	const wrapOptions = ['nowrap', 'wrap', 'wrap-reverse'] as const;

	const boxColors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-info', 'bg-success'];
</script>

<ToolWrapper
	title="Flexbox Generator"
	description="Visual CSS flexbox playground. Interactively design flex layouts and generate code instantly."
	keywords={['flexbox', 'css flexbox', 'flex generator', 'flexbox playground', 'css layout']}
>
	<div class="grid lg:grid-cols-3 gap-8 items-start">
		
		<!-- Preview Area (Main Content) -->
		<div class="lg:col-span-2 space-y-6">
			<div class="flex items-center justify-between">
				<h3 class="text-sm font-bold uppercase tracking-wider text-base-content/60">Live Interactive Preview</h3>
				<div class="flex items-center gap-3">
					<span class="text-xs font-mono opacity-50">Items: {itemCount}</span>
					<input 
						type="range" 
						bind:value={itemCount} 
						min="1" 
						max="12"
						class="range range-xs range-primary w-24"
					/>
				</div>
			</div>

			<div class="card bg-base-200 shadow-sm border border-base-300 overflow-hidden">
				<div class="card-body p-6">
					<div 
						class="min-h-[500px] p-6 bg-base-100 rounded-xl border-2 border-dashed border-base-content/10 transition-all duration-300"
						style="
							display: flex;
							flex-direction: {config.direction};
							justify-content: {config.justifyContent};
							align-items: {config.alignItems};
							flex-wrap: {config.flexWrap};
							gap: {config.gap}px;
						"
					>
						{#each Array(itemCount) as _, i}
							<div 
								class="flex items-center justify-center text-white font-bold rounded-lg shadow-sm transition-all duration-300 hover:scale-105 {boxColors[i % boxColors.length]}"
								style="width: {config.direction.includes('column') ? '80px' : (60 + (i * 15))}px; height: 60px;"
							>
								{i + 1}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="card bg-base-200 border border-base-300 shadow-sm">
				<div class="card-body p-5">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-bold uppercase tracking-wider">CSS Output</h3>
						<CopyButton text={`.container {\n${cssOutput}\n}`} label="Copy" size="sm" />
					</div>
					<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto"><code>.container {'{\n'}{cssOutput}{'\n}'}</code></pre>
				</div>
			</div>
		</div>

		<!-- Controls Sidebar -->
		<div class="lg:col-span-1 space-y-6 sticky top-6">
			<div class="card bg-base-200 shadow-sm border border-base-300">
				<div class="card-body p-6 space-y-6">
					
					<!-- Direction -->
					<div class="form-control">
						<label class="label-text font-bold mb-3 block">Flex Direction</label>
						<div class="grid grid-cols-2 gap-2">
							{#each directions as dir}
								<button
									class="btn btn-sm"
									class:btn-outline={config.direction !== dir}
									class:btn-primary={config.direction === dir}
									onclick={() => config.direction = dir}
								>
									{dir}
								</button>
							{/each}
						</div>
					</div>

					<div class="divider my-0"></div>

					<!-- Wrap -->
					<div class="form-control">
						<label class="label-text font-bold mb-3 block">Flex Wrap</label>
						<div class="join w-full">
							{#each wrapOptions as wrap}
								<button
									class="btn btn-sm join-item flex-1"
									class:btn-outline={config.flexWrap !== wrap}
									class:btn-primary={config.flexWrap === wrap}
									onclick={() => config.flexWrap = wrap}
								>
									{wrap}
								</button>
							{/each}
						</div>
					</div>

					<div class="divider my-0"></div>

					<!-- Justify -->
					<div class="form-control">
						<label class="label-text font-bold mb-2 block">Justify Content</label>
						<select bind:value={config.justifyContent} class="select select-bordered select-sm w-full">
							{#each justifyOptions as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<!-- Align -->
					<div class="form-control">
						<label class="label-text font-bold mb-2 block">Align Items</label>
						<select bind:value={config.alignItems} class="select select-bordered select-sm w-full">
							{#each alignOptions as opt}
								<option value={opt}>{opt}</option>
							{/each}
						</select>
					</div>

					<div class="divider my-0"></div>

					<!-- Gap -->
					<div class="form-control">
						<div class="flex justify-between items-center mb-2">
							<label class="label-text font-bold">Gap</label>
							<span class="badge badge-sm font-mono">{config.gap}px</span>
						</div>
						<input 
							type="range" 
							bind:value={config.gap} 
							min="0" 
							max="64" 
							step="4"
							class="range range-xs range-primary"
						/>
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
