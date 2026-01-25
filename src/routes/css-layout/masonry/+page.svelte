<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let columnCount = $state(3);
	let gap = $state(16);
	let useFlexFallback = $state(false);

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

	// Sample heights for masonry items to demonstrate the effect
	const itemHeights = [200, 150, 300, 180, 250, 120, 280, 160, 220, 190, 260, 140];
	const colors = [
		'bg-primary/80', 'bg-secondary/80', 'bg-accent/80', 
		'bg-info/80', 'bg-success/80', 'bg-warning/80',
		'bg-error/80', 'bg-purple-500/80', 'bg-pink-500/80'
	];
</script>

<ToolWrapper
	title="Masonry Layout Generator"
	description="Create Pinterest-style masonry layouts using pure CSS columns. No JavaScript required."
	keywords={['css masonry', 'masonry layout', 'pinterest layout', 'css columns', 'grid layout']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden shadow-sm">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">Live Preview</h3>
					<div class="badge badge-neutral text-xs">Pure CSS Columns</div>
				</div>
				
				<div class="bg-base-100 p-4 rounded-xl border border-base-300 min-h-[400px]">
					<div 
						style="
							column-count: {columnCount};
							column-gap: {gap}px;
						"
					>
						{#each itemHeights as height, i}
							<div 
								class="rounded-xl w-full flex items-center justify-center text-white font-bold text-xl shadow-sm transition-all duration-300 hover:scale-[1.02] mb-4"
								style="
									height: {height}px;
									break-inside: avoid;
									margin-bottom: {gap}px;
									background-color: hsl(var(--p)); /* Fallback */
								"
								class:bg-primary={i % 9 === 0}
								class:bg-secondary={i % 9 === 1}
								class:bg-accent={i % 9 === 2}
								class:bg-neutral={i % 9 === 3}
								class:bg-info={i % 9 === 4}
								class:bg-success={i % 9 === 5}
								class:bg-warning={i % 9 === 6}
								class:bg-error={i % 9 === 7}
							>
								<div class={`w-full h-full rounded-xl ${colors[i % colors.length]} flex items-center justify-center backdrop-blur-sm`}>
									{i + 1}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid md:grid-cols-2 gap-4">
			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex justify-between">
						<span>Column Count</span>
						<span class="text-primary font-mono">{columnCount}</span>
					</h3>
					<input 
						type="range" 
						bind:value={columnCount} 
						min="1" 
						max="6" 
						step="1"
						class="range range-primary"
					/>
					<div class="flex justify-between text-xs text-base-content/50 mt-1 px-1">
						<span>1</span>
						<span>2</span>
						<span>3</span>
						<span>4</span>
						<span>5</span>
						<span>6</span>
					</div>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl shadow-sm">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex justify-between">
						<span>Gap (Gutter)</span>
						<span class="text-secondary font-mono">{gap}px</span>
					</h3>
					<input 
						type="range" 
						bind:value={gap} 
						min="0" 
						max="48" 
						step="4"
						class="range range-secondary"
					/>
					<div class="flex justify-between text-xs text-base-content/50 mt-1 px-1">
						<span>0px</span>
						<span>24px</span>
						<span>48px</span>
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
		
		<!-- Explanation -->
		<div class="card bg-base-100 border border-base-200 shadow-sm">
			<div class="card-body p-6">
				<h3 class="text-lg font-bold mb-2">About Pure CSS Masonry</h3>
				<p class="text-base-content/70 mb-4">
					This layout uses CSS Multi-column Layout (<code>column-count</code>) to create a masonry effect. 
					It works by flowing content down columns rather than rows, which allows items of varying heights to stack perfectly without vertical gaps.
				</p>
				<div class="alert alert-info text-sm flex items-start gap-3">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
					<div>
						<span class="font-bold">Note:</span> Items are ordered top-to-bottom per column, not left-to-right. 
						For left-to-right ordering with masonry (staggered grid), a JavaScript solution like Masonry.js is traditionally used, though true CSS Grid Masonry is part of the future CSS Grid Level 3 spec.
					</div>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
