<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { fade, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cssLayoutToolsContent } from '$lib/config/content/css-layout-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = cssLayoutToolsContent['masonry'];

	let columnCount = $state(3);
	let gap = $state(16);
	let activeIndex = $state<number | null>(null);

	let cssOutput = $derived(`/* Masonry Container */
.masonry-container {
  column-count: ${columnCount};
  column-gap: ${gap}px;
}

/* Masonry Item */
.masonry-item {
  break-inside: avoid;
  margin-bottom: ${gap}px;
}`);

	// Sample heights for masonry items
	const itemHeights = [200, 150, 320, 180, 250, 120, 280, 160, 220, 190, 260, 140];
	const colors = [
		'bg-primary/90', 'bg-secondary/90', 'bg-accent/90', 
		'bg-info/90', 'bg-success/90', 'bg-warning/90',
		'bg-error/90', 'bg-purple-500/90', 'bg-pink-500/90'
	];
</script>

<ToolWrapper
	title="Masonry Layout Generator"
	description="Create Pinterest-style masonry layouts using pure CSS columns. No JavaScript required."
	keywords={['css masonry', 'masonry layout', 'pinterest layout', 'css columns', 'grid layout']}
>
	<div class="flex flex-col gap-8">
		
		<!-- Controls (Top to prevent layout shift) -->
		<div class="card bg-base-200 shadow-sm border border-base-300">
			<div class="card-body p-6">
				<div class="grid md:grid-cols-2 gap-8">
					<!-- Column Controls -->
					<div class="form-control">
						<div class="flex justify-between items-center mb-2">
						<span class="label-text font-semibold text-base">Column Count</span>
							<span class="badge badge-primary font-mono">{columnCount}</span>
						</div>
						<input 
							type="range" 
							bind:value={columnCount} 
							min="1" 
							max="6" 
							step="1"
							class="range range-primary w-full hidden sm:flex"
						/>
                        <input 
							type="range" 
							bind:value={columnCount} 
							min="1" 
							max="3" 
							step="1"
							class="range range-primary w-full sm:hidden"
						/>
						<div class="flex justify-between px-1 mt-2 text-xs font-mono text-base-content/50">
							<span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span>
						</div>
					</div>

					<!-- Gap Controls -->
					<div class="form-control">
						<div class="flex justify-between items-center mb-2">
						<span class="label-text font-semibold text-base">Gap (Gutter)</span>
							<span class="badge badge-secondary font-mono">{gap}px</span>
						</div>
						<input 
							type="range" 
							bind:value={gap} 
							min="0" 
							max="48" 
							step="4"
							class="range range-secondary w-full"
						/>
						<div class="flex justify-between px-1 mt-2 text-xs font-mono text-base-content/50">
							<span>0px</span><span>16px</span><span>32px</span><span>48px</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Preview area -->
		<div class="grid lg:grid-cols-3 gap-6 items-start">
			<!-- Live Preview -->
			<div class="lg:col-span-2 space-y-4">
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-bold uppercase tracking-wider text-base-content/60">Live Preview</h3>
					<div class="badge badge-outline text-xs">Pure CSS Columns</div>
				</div>
				
				<div class="bg-base-100 p-6 rounded-2xl border border-base-300 shadow-inner min-h-[400px] md:min-h-[600px] transition-all duration-300">
					<div 
						style="
							column-count: {columnCount};
							column-gap: {gap}px;
						"
						class="transition-all duration-300 ease-in-out"
					>
						{#each itemHeights as height, i}
							<div 
								class="rounded-xl w-full mb-4 break-inside-avoid relative group cursor-pointer overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg"
								transition:scale={{ duration: 400, start: 0.95, opacity: 0 }}
								style="
									height: {height}px;
									margin-bottom: {gap}px;
								"
								onclick={() => activeIndex = activeIndex === i ? null : i}
								role="button"
								tabindex="0"
								onkeydown={(e) => e.key === 'Enter' && (activeIndex = activeIndex === i ? null : i)}
							>
								<!-- Card Background -->
								<div class={`absolute inset-0 ${colors[i % colors.length]} transition-colors duration-300`}></div>
								
								<!-- Hover/Active Overlay -->
								<div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>

								<!-- Content -->
								<div class="relative h-full flex flex-col items-center justify-center text-white p-4">
									<span class="text-2xl font-black drop-shadow-md opacity-90">{i + 1}</span>
									<span class="text-xs font-mono opacity-75 mt-1">{height}px</span>
									
									{#if activeIndex === i}
										<div class="absolute inset-0 bg-base-100/95 text-base-content flex flex-col items-center justify-center p-4 text-center z-10" transition:fade={{ duration: 200 }}>
											<span class="text-sm font-bold">Item {i + 1}</span>
											<span class="text-xs opacity-70 mt-1">Order flows down columns first.</span>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Output Sidebar -->
			<div class="lg:col-span-1 space-y-6 sticky top-6">
				<div class="card bg-base-200 shadow-sm border border-base-300">
					<div class="card-body p-5">
						<div class="flex items-center justify-between mb-4">
							<h3 class="text-sm font-bold uppercase tracking-wider">CSS Output</h3>
							<CopyButton text={cssOutput} label="Copy" size="sm" />
						</div>
						<div class="rounded-2xl bg-base-300 text-xs shadow-none">
							<pre class="px-5 py-4"><code class="language-css">{cssOutput}</code></pre>
						</div>
					</div>
				</div>

				<div class="card bg-base-100 border border-base-200 shadow-sm">
					<div class="card-body p-5">
						<h3 class="text-sm font-bold mb-2 flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-info"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
							How it works
						</h3>
						<p class="text-xs text-base-content/70 leading-relaxed">
							CSS Multi-column Layout flows content vertically. While great for simple masonry, items are ordered <strong>down columns</strong>, not across rows. 
							<br/><br/>
							For strict left-to-right ordering, you would need JavaScript or future CSS Grid Level 3 masonry support.
						</p>
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
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
