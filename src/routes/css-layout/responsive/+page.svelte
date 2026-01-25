<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

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

	// SCSS/Sass Mixin Output
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

	let useScss = $state(false);
</script>

<ToolWrapper
	title="Responsive Design Helper"
	description="Generate CSS media queries and responsive breakpoints. Support for Mobile-First or Desktop-First strategies with common presets."
	keywords={['css media queries', 'responsive design', 'css breakpoints', 'mobile first', 'media query generator']}
>
	<div class="flex flex-col gap-6">
		<!-- Visualizer -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden shadow-sm">
			<div class="card-body p-6">
				<h3 class="text-sm font-semibold mb-6">Breakpoint Visualizer</h3>
				
				<div class="relative h-24 bg-base-300 rounded-xl overflow-hidden flex items-end">
					<!-- Base -->
					<div class="absolute inset-0 flex items-center justify-center text-xs font-mono text-base-content/30 z-0">
						Base (0px)
					</div>

					<!-- Breakpoint Maps -->
					{#each Object.entries(breakpoints) as [name, width], i}
						<div 
							class="absolute top-0 bottom-0 border-l border-primary/50 transition-all duration-300 group"
							style="left: {(width / 2000) * 100}%"
						>
							<div class="absolute top-2 left-1 text-[10px] font-bold uppercase text-primary/70 bg-base-100/80 px-1 rounded shadow-sm backdrop-blur-md">
								{name}
							</div>
							<div class="absolute bottom-2 left-1 text-[10px] font-mono text-base-content/60 bg-base-100/80 px-1 rounded shadow-sm">
								{width}px
							</div>
							
							<!-- Hover range visual -->
							<div class="absolute inset-0 w-screen bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none -z-10"></div>
						</div>
					{/each}
				</div>
				<div class="flex justify-between text-xs font-mono text-base-content/40 mt-2 px-1">
					<span>0px</span>
					<span>2000px</span>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid md:grid-cols-2 gap-4">
			<!-- Strategy & Presets -->
			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Strategy & Presets</h3>
					
					<div class="form-control mb-4">
						<label class="label cursor-pointer justify-start gap-4">
							<span class="label-text font-medium">Strategy:</span>
							<div class="join">
								<button 
									class="btn btn-sm join-item"
									class:btn-primary={strategy === 'mobile-first'}
									onclick={() => strategy = 'mobile-first'}
								>
									Mobile First (min-width)
								</button>
								<button 
									class="btn btn-sm join-item"
									class:btn-primary={strategy === 'desktop-first'}
									onclick={() => strategy = 'desktop-first'}
								>
									Desktop First (max-width)
								</button>
							</div>
						</label>
					</div>

					<div class="form-control">
						<label class="label cursor-pointer justify-start gap-4">
							<span class="label-text font-medium">Preset:</span>
							<div class="join">
								<button 
									class="btn btn-xs sm:btn-sm join-item"
									class:btn-active={preset === 'tailwind'}
									onclick={() => applyPreset('tailwind')}
								>Tailwind</button>
								<button 
									class="btn btn-xs sm:btn-sm join-item"
									class:btn-active={preset === 'bootstrap'}
									onclick={() => applyPreset('bootstrap')}
								>Bootstrap</button>
								<button 
									class="btn btn-xs sm:btn-sm join-item"
									class:btn-active={preset === 'standard'}
									onclick={() => applyPreset('standard')}
								>Standard</button>
							</div>
						</label>
					</div>
				</div>
			</div>

			<!-- Custom Breakpoints -->
			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Customize Breakpoints (px)</h3>
					<div class="grid grid-cols-2 lg:grid-cols-3 gap-2">
						{#each Object.entries(breakpoints) as [key, val]}
							<div class="form-control">
								<label class="label py-0">
									<span class="label-text text-xs uppercase font-bold text-base-content/60">{key}</span>
								</label>
								<input 
									type="number" 
									bind:value={breakpoints[key as keyof typeof breakpoints]} 
									class="input input-sm input-bordered w-full font-mono"
								/>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl shadow-sm">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-3">
						<h3 class="text-sm font-semibold">Code Output</h3>
						<div class="join">
							<button 
								class="btn btn-xs join-item"
								class:btn-active={!useScss}
								onclick={() => useScss = false}
							>CSS</button>
							<button 
								class="btn btn-xs join-item"
								class:btn-active={useScss}
								onclick={() => useScss = true}
							>SCSS</button>
						</div>
					</div>
					<CopyButton text={useScss ? scssOutput : cssOutput} label="Copy Code" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto h-64"><code>{useScss ? scssOutput : cssOutput}</code></pre>
			</div>
		</div>
	</div>
</ToolWrapper>
