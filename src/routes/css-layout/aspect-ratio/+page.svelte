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

	const content = cssLayoutToolsContent['aspect-ratio'];

	let width = $state(16);
	let height = $state(9);
	let usePaddingHack = $state(false);

	let ratio = $derived(width / height);
	let percentage = $derived(((height / width) * 100).toFixed(2));

	let cssOutput = $derived(usePaddingHack 
		? `/* Aspect Ratio ${width}:${height} (Padding Hack) */
.aspect-box {
  position: relative;
  width: 100%;
  padding-bottom: ${percentage}%; /* ${height}/${width} = ${percentage}% */
}

.aspect-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}`
		: `/* Aspect Ratio ${width}:${height} */
.aspect-box {
  width: 100%;
  aspect-ratio: ${width} / ${height};
}`);

	let presets = [
		{ w: 1, h: 1, label: 'Square (1:1)' },
		{ w: 4, h: 3, label: 'Standard (4:3)' },
		{ w: 16, h: 9, label: 'HD (16:9)' },
		{ w: 21, h: 9, label: 'Ultrawide (21:9)' },
		{ w: 9, h: 16, label: 'Mobile (9:16)' },
		{ w: 2, h: 3, label: 'Portrait (2:3)' },
	];

	function setPreset(p: { w: number, h: number }) {
		width = p.w;
		height = p.h;
	}
</script>

<ToolWrapper
	title="Aspect Ratio Calculator"
	description="Calculate CSS aspect ratios and percentages. Generate modern 'aspect-ratio' code or fallback 'padding-hack' styles."
	keywords={['css aspect ratio', 'aspect ratio calculator', 'padding hack', 'responsive video', 'container ratio']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden shadow-sm border border-base-300">
			<div class="card-body p-6 flex flex-col items-center justify-center min-h-[400px]">
				
				<div class="w-full h-full max-h-[400px] flex items-center justify-center overflow-hidden">
					<div class="w-full max-w-md bg-base-300 rounded-xl overflow-hidden relative shadow-lg transition-all duration-500">
						<!-- The Box -->
						<div 
							class="bg-primary/90 flex items-center justify-center text-primary-content font-bold text-2xl relative overflow-hidden"
							style="aspect-ratio: {width} / {height}; max-height: 400px;"
						>
							<div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
							<div class="z-10 flex flex-col items-center">
								<span>{width}:{height}</span>
								<span class="text-xs font-normal opacity-80 mt-1">{percentage}%</span>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>

		<!-- Controls -->
		<div class="grid md:grid-cols-2 gap-6">
			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-4">Dimensions</h3>
					
					<div class="flex items-center gap-4 mb-6">
						<div class="form-control w-full">
							<label class="label py-1 text-xs uppercase font-bold text-base-content/60">Width</label>
							<input type="number" bind:value={width} min="1" class="input input-bordered font-mono lg:text-lg" />
						</div>
						<span class="text-2xl font-light text-base-content/30 mt-6">:</span>
						<div class="form-control w-full">
							<label class="label py-1 text-xs uppercase font-bold text-base-content/60">Height</label>
							<input type="number" bind:value={height} min="1" class="input input-bordered font-mono lg:text-lg" />
						</div>
					</div>

					<h4 class="text-xs font-bold text-base-content/50 uppercase mb-2">Presets</h4>
					<div class="flex flex-wrap gap-2">
						{#each presets as p}
							<button 
								class="btn btn-sm btn-outline"
								class:btn-active={width === p.w && height === p.h}
								onclick={() => setPreset(p)}
							>
								{p.label}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-2">
						<h3 class="text-sm font-semibold">Generate Code</h3>
						<div class="form-control">
							<label class="label cursor-pointer gap-2">
								<span class="label-text text-xs">Padding Hack (Old IE)</span>
								<input type="checkbox" bind:checked={usePaddingHack} class="toggle toggle-sm" />
							</label>
						</div>
					</div>
					
					<div class="relative group">
						<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto h-48 border border-base-content/5"><code>{cssOutput}</code></pre>
						<div class="absolute top-2 right-2">
							<CopyButton text={cssOutput} label="Copy" size="sm" />
						</div>
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
