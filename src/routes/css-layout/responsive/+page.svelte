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

	const content = cssLayoutToolsContent['responsive'];

	type Strategy = 'mobile-first' | 'desktop-first';
	type Preset = 'tailwind' | 'bootstrap' | 'standard';

	let strategy = $state<Strategy>('mobile-first');
	let preset = $state<Preset>('tailwind');
	
	let breakpoints = $state({
		sm: 640,
		md: 768,
		lg: 1024,
		xl: 1280,
		'2xl': 1536
	});

	function applyPreset(p: Preset) {
		preset = p;
		if (p === 'tailwind') {
			breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 };
		} else if (p === 'bootstrap') {
			breakpoints = { sm: 576, md: 768, lg: 992, xl: 1200, '2xl': 1400 };
		} else {
			breakpoints = { sm: 480, md: 768, lg: 1024, xl: 1200, '2xl': 1600 };
		}
	}

	let cssOutput = $derived(Object.entries(breakpoints).map(([name, width]) => {
		if (strategy === 'mobile-first') {
			return `/* ${name.toUpperCase()} */
@media (min-width: ${width}px) {
  /* styles */
}`;
		} else {
			return `/* ${name.toUpperCase()} */
@media (max-width: ${width - 1}px) {
  /* styles */
}`;
		}
	}).join('\n\n'));

	let scssOutput = $derived(`// Breakpoints
$breakpoints: (
${Object.entries(breakpoints).map(([name, width]) => `  '${name}': ${width}px`).join(',\n')}
);

@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (${strategy === 'mobile-first' ? 'min' : 'max'}-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}`);

	let tailwindOutput = $derived(`// tailwind.config.js
module.exports = {
  theme: {
    screens: {
${Object.entries(breakpoints).map(([name, width]) => `      '${name}': '${width}px'`).join(',\n')}
    }
  }
}`);

	let outputMode = $state<'css' | 'scss' | 'tailwind'>('css');
	let currentOutput = $derived(outputMode === 'css' ? cssOutput : outputMode === 'scss' ? scssOutput : tailwindOutput);

	const deviceIcons = [
		{ w: 640, icon: '📱' },
		{ w: 768, icon: '📖' },
		{ w: 1024, icon: '💻' },
		{ w: 1280, icon: '🖥️' },
		{ w: 1536, icon: '📺' }
	];
</script>

<ToolWrapper
	title="Responsive Design Helper"
	description="Generate CSS media queries and detailed responsive breakpoints. Supports Mobile-First/Desktop-First and Tailwind configurations."
	keywords={['css media queries', 'responsive design', 'css breakpoints', 'mobile first', 'tailwind screens', 'media query generator']}
>
	<div class="flex flex-col gap-8">
		<!-- Visualizer -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden shadow-sm border border-base-300">
			<div class="card-body p-6">
				<div class="flex justify-between items-center mb-6">
					<h3 class="text-sm font-bold uppercase tracking-wider text-base-content/60">Breakpoint Visualizer</h3>
					<div class="badge badge-neutral text-xs font-mono">scale: 0 - 2000px</div>
				</div>
				
				<div class="relative h-32 bg-gradient-to-r from-base-300 to-base-200 rounded-xl overflow-hidden flex items-end border border-base-content/5">
					<!-- Base -->
					<div class="absolute inset-0 flex items-center justify-center text-xs font-mono text-base-content/20 z-0 select-none">
						Viewport Width
					</div>

					<!-- Breakpoint Maps -->
					{#each Object.entries(breakpoints) as [name, width], i}
						{@const colorClass = ['border-primary', 'border-secondary', 'border-accent', 'border-info', 'border-success'][i % 5]}
						{@const bgClass = ['bg-primary/10', 'bg-secondary/10', 'bg-accent/10', 'bg-info/10', 'bg-success/10'][i % 5]}
						{@const textClass = ['text-primary', 'text-secondary', 'text-accent', 'text-info', 'text-success'][i % 5]}
						
						<div 
							class="absolute top-0 bottom-0 border-l-2 {colorClass} transition-all duration-300 group hover:z-20"
							style="left: {(width / 2000) * 100}%"
						>
							<div class="absolute top-2 left-1 transform -translate-x-1">
								<div class="badge badge-sm font-bold uppercase shadow-sm backdrop-blur-md {textClass} bg-base-100/90 border-current">
									{name}
								</div>
							</div>
							
							<div class="absolute bottom-2 left-1 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-1 z-10">
								<div class="badge badge-sm font-mono shadow-sm bg-base-content text-base-100 border-none">
									{width}px
								</div>
							</div>
							
							<!-- Hover range visual -->
							<div class="absolute inset-0 w-screen {bgClass} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10"></div>
						</div>
					{/each}
				</div>
				
				<!-- Scale -->
				<div class="relative h-6 mt-1 text-[10px] font-mono text-base-content/40 select-none">
					<span class="absolute left-0">0px</span>
					<span class="absolute left-1/4">500px</span>
					<span class="absolute left-1/2">1000px</span>
					<span class="absolute left-3/4">1500px</span>
					<span class="absolute right-0">2000px</span>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid lg:grid-cols-3 gap-8">
			<!-- Configuration Panel -->
			<div class="lg:col-span-2 space-y-6">
				<div class="card bg-base-200 shadow-sm border border-base-300">
					<div class="card-body p-6">
						<h3 class="text-sm font-bold uppercase tracking-wider mb-4">Configuration</h3>
						
						<div class="grid sm:grid-cols-2 gap-6">
							<div class="form-control">
								<label class="label-text font-medium mb-2">Strategy</label>
								<div class="join w-full">
									<button 
										class="btn btn-sm join-item flex-1"
										class:btn-primary={strategy === 'mobile-first'}
										onclick={() => strategy = 'mobile-first'}
									>
										Mobile First
									</button>
									<button 
										class="btn btn-sm join-item flex-1"
										class:btn-primary={strategy === 'desktop-first'}
										onclick={() => strategy = 'desktop-first'}
									>
										Desktop First
									</button>
								</div>
								<label class="label">
									<span class="label-text-alt opacity-60">
										{strategy === 'mobile-first' ? 'Uses min-width' : 'Uses max-width'}
									</span>
								</label>
							</div>

							<div class="form-control">
								<label class="label-text font-medium mb-2">Preset</label>
								<div class="join w-full">
									<button 
										class="btn btn-sm join-item flex-1"
										class:btn-active={preset === 'tailwind'}
										onclick={() => applyPreset('tailwind')}
									>Tailwind</button>
									<button 
										class="btn btn-sm join-item flex-1"
										class:btn-active={preset === 'bootstrap'}
										onclick={() => applyPreset('bootstrap')}
									>Bootstrap</button>
									<button 
										class="btn btn-sm join-item flex-1"
										class:btn-active={preset === 'standard'}
										onclick={() => applyPreset('standard')}
									>Standard</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Custom Values -->
				<div class="card bg-base-200 shadow-sm border border-base-300">
					<div class="card-body p-6">
						<h3 class="text-sm font-bold uppercase tracking-wider mb-4">Breakpoints (px)</h3>
						<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
							{#each Object.entries(breakpoints) as [key, val]}
								<div class="form-control bg-base-100 p-2 rounded-lg border border-base-content/5">
									<label class="label py-1">
										<span class="label-text text-xs uppercase font-bold text-primary">{key}</span>
									</label>
									<input 
										type="number" 
										bind:value={breakpoints[key as keyof typeof breakpoints]} 
										class="input input-sm input-ghost w-full font-mono text-center focus:bg-base-200"
									/>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Output Panel -->
			<div class="lg:col-span-1">
				<div class="card bg-base-200 h-full shadow-sm border border-base-300">
					<div class="card-body p-5 flex flex-col h-full">
						<div class="flex items-center justify-between mb-4">
							<h3 class="text-sm font-bold uppercase tracking-wider">Output</h3>
							<CopyButton text={currentOutput} label="Copy" size="sm" />
						</div>

						<div class="tabs rounded-2xl tabs-boxed bg-base-300 p-1 mb-2">
							<button 
								class="tab tab-xs flex-1" 
								class:tab-active={outputMode === 'css'}
								onclick={() => outputMode = 'css'}
							>CSS</button>
							<button 
								class="tab tab-xs flex-1" 
								class:tab-active={outputMode === 'scss'}
								onclick={() => outputMode = 'scss'}
							>SCSS</button>
							<button 
								class="tab tab-xs flex-1" 
								class:tab-active={outputMode === 'tailwind'}
								onclick={() => outputMode = 'tailwind'}
							>Tailwind</button>
						</div>
						
						<div class=" rounded-2xl bg-base-300 text-xs shadow-none flex-1 overflow-hidden flex flex-col">
							<pre class="px-5 py-4 overflow-auto custom-scrollbar flex-1"><code class="language-{outputMode === 'tailwind' ? 'javascript' : 'css'}">{currentOutput}</code></pre>
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

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: oklch(var(--bc) / 0.2);
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: oklch(var(--bc) / 0.3);
	}
</style>
