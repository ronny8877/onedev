<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateTransition } from '$lib/utils/css-utils';
	import { cssToolsContent } from '$lib/config/content/css-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = cssToolsContent['transition'];

	let property = $state('all');
	let duration = $state(300);
	let timingFunction = $state('ease');
	let delay = $state(0);

	let cssOutput = $derived(generateTransition({ property, duration, timingFunction, delay }));

	let isHovered = $state(false);

	const properties = [
		{ value: 'all', label: 'All' },
		{ value: 'opacity', label: 'Opacity' },
		{ value: 'transform', label: 'Transform' },
		{ value: 'background-color', label: 'Background Color' },
		{ value: 'box-shadow', label: 'Box Shadow' },
		{ value: 'width', label: 'Width' },
	];
	
	const timingFunctions = [
		{ value: 'linear', label: 'Linear' },
		{ value: 'ease', label: 'Ease' },
		{ value: 'ease-in', label: 'Ease In' },
		{ value: 'ease-out', label: 'Ease Out' },
		{ value: 'ease-in-out', label: 'Ease In Out' },
	];

	// Only change the selected property on hover
	let previewStyles = $derived(() => {
		const base = {
			backgroundColor: '#ec4899',
			opacity: 1,
			transform: 'scale(1)',
			boxShadow: '0 8px 16px rgba(236, 72, 153, 0.3)',
			width: '128px',
		};
		
		const hovered = {
			backgroundColor: '#6366f1',
			opacity: 0.5,
			transform: 'scale(1.2) rotate(10deg)',
			boxShadow: '0 20px 40px rgba(99, 102, 241, 0.5)',
			width: '160px',
		};

		if (!isHovered) return base;

		// Only change the selected property
		switch (property) {
			case 'opacity':
				return { ...base, opacity: hovered.opacity };
			case 'transform':
				return { ...base, transform: hovered.transform };
			case 'background-color':
				return { ...base, backgroundColor: hovered.backgroundColor };
			case 'box-shadow':
				return { ...base, boxShadow: hovered.boxShadow };
			case 'width':
				return { ...base, width: hovered.width };
			case 'all':
			default:
				return hovered;
		}
	});
</script>

<ToolWrapper
	keywords={['css transition', 'transition generator', 'css animation', 'transition builder']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden">
			<div class="card-body p-6">
				<h3 class="text-sm font-semibold mb-4">Live Preview <span class="text-base-content/50 font-normal">(hover the box)</span></h3>
				<div class="flex justify-center py-8 bg-base-300 rounded-xl">
					<div 
						class="h-32 rounded-2xl cursor-pointer flex items-center justify-center font-semibold text-white"
						style="
							background-color: {previewStyles().backgroundColor};
							opacity: {previewStyles().opacity};
							transform: {previewStyles().transform};
							box-shadow: {previewStyles().boxShadow};
							width: {previewStyles().width};
							transition: {cssOutput};
						"
						onmouseenter={() => isHovered = true}
						onmouseleave={() => isHovered = false}
						role="button"
						tabindex="0"
					>
						<span class="text-sm">{isHovered ? 'Nice!' : 'Hover me'}</span>
					</div>
				</div>
				<div class="text-center mt-3">
					<span class="badge badge-primary badge-outline">
						Only <strong class="mx-1">{property}</strong> will animate
					</span>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid md:grid-cols-2 gap-4">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Property</h3>
					<select bind:value={property} class="select select-bordered w-full">
						{#each properties as prop}
							<option value={prop.value}>{prop.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Timing Function</h3>
					<select bind:value={timingFunction} class="select select-bordered w-full">
						{#each timingFunctions as tf}
							<option value={tf.value}>{tf.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex items-center justify-between">
						<span>Duration</span>
						<span class="text-primary font-mono">{duration}ms</span>
					</h3>
					<input 
						type="range" 
						bind:value={duration} 
						min="100" 
						max="2000" 
						step="50"
						class="range range-primary"
					/>
					<div class="flex justify-between text-xs text-base-content/50 mt-1">
						<span>100ms</span>
						<span>1s</span>
						<span>2s</span>
					</div>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex items-center justify-between">
						<span>Delay</span>
						<span class="text-primary font-mono">{delay}ms</span>
					</h3>
					<input 
						type="range" 
						bind:value={delay} 
						min="0" 
						max="1000" 
						step="50"
						class="range range-secondary"
					/>
					<div class="flex justify-between text-xs text-base-content/50 mt-1">
						<span>0ms</span>
						<span>500ms</span>
						<span>1s</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={`transition: ${cssOutput};`} label="Copy" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all max-w-full">transition: {cssOutput};</pre>
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
