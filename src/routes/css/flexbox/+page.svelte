<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateFlexbox, type FlexboxConfig } from '$lib/utils/css-utils';

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
	title="Flexbox Playground"
	description="Visual CSS flexbox generator. Configure direction, justify, align, wrap, and gap with live preview."
	keywords={['flexbox', 'css flexbox', 'flex generator', 'flexbox playground', 'css layout']}
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
							max="10"
							class="input input-bordered input-sm w-16 font-mono"
						/>
					</div>
				</div>
				<div 
					class="min-h-48 p-4 bg-base-300 rounded-xl border-2 border-dashed border-base-content/20"
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
							class="flex items-center justify-center text-white font-bold rounded-lg {boxColors[i % boxColors.length]}"
							style="width: {config.direction.includes('column') ? '80px' : (40 + (i * 10))}px; height: 50px;"
						>
							{i + 1}
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Controls -->
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Direction</h3>
					<div class="flex flex-wrap gap-2">
						{#each directions as dir}
							<button
								class="btn btn-sm"
								class:btn-primary={config.direction === dir}
								onclick={() => config.direction = dir}
							>
								{dir}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Justify Content</h3>
					<select bind:value={config.justifyContent} class="select select-bordered w-full">
						{#each justifyOptions as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Align Items</h3>
					<select bind:value={config.alignItems} class="select select-bordered w-full">
						{#each alignOptions as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3">Flex Wrap</h3>
					<div class="flex flex-wrap gap-2">
						{#each wrapOptions as wrap}
							<button
								class="btn btn-sm"
								class:btn-primary={config.flexWrap === wrap}
								onclick={() => config.flexWrap = wrap}
							>
								{wrap}
							</button>
						{/each}
					</div>
				</div>
			</div>

			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-3 flex justify-between">
						<span>Gap</span>
						<span class="text-primary font-mono">{config.gap}px</span>
					</h3>
					<input 
						type="range" 
						bind:value={config.gap} 
						min="0" 
						max="48" 
						step="4"
						class="range range-primary"
					/>
				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={`.container {\n${cssOutput}\n}`} label="Copy" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm">.container {'{\n'}{cssOutput}{'\n}'}</pre>
			</div>
		</div>
	</div>
</ToolWrapper>
