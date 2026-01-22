<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { generateTextShadow, type TextShadowConfig } from '$lib/utils/css-utils';

	let shadows = $state<TextShadowConfig[]>([
		{ x: 2, y: 2, blur: 4, color: 'rgba(0, 0, 0, 0.3)' }
	]);

	let previewText = $state('Hello World');
	let fontSize = $state(48);
	let fontWeight = $state('bold');
	let selectedShadow = $state(0);

	let cssOutput = $derived(generateTextShadow(shadows));

	function addShadow() {
		shadows = [...shadows, { x: 1, y: 1, blur: 2, color: 'rgba(0, 0, 0, 0.2)' }];
		selectedShadow = shadows.length - 1;
	}

	function removeShadow(index: number) {
		if (shadows.length > 1) {
			shadows = shadows.filter((_, i) => i !== index);
			if (selectedShadow >= shadows.length) selectedShadow = shadows.length - 1;
		}
	}

	// Presets
	const presets = [
		{ name: 'Subtle', shadows: [{ x: 1, y: 1, blur: 2, color: 'rgba(0, 0, 0, 0.2)' }] },
		{ name: 'Hard', shadows: [{ x: 3, y: 3, blur: 0, color: 'rgba(0, 0, 0, 0.4)' }] },
		{ name: 'Glow', shadows: [{ x: 0, y: 0, blur: 10, color: 'rgba(59, 130, 246, 0.8)' }] },
		{ name: 'Neon Pink', shadows: [{ x: 0, y: 0, blur: 5, color: '#ff00ff' }, { x: 0, y: 0, blur: 10, color: '#ff00ff' }, { x: 0, y: 0, blur: 20, color: '#ff00ff' }] },
		{ name: 'Neon Cyan', shadows: [{ x: 0, y: 0, blur: 5, color: '#00ffff' }, { x: 0, y: 0, blur: 10, color: '#00ffff' }, { x: 0, y: 0, blur: 20, color: '#00ffff' }] },
		{ name: '3D', shadows: [{ x: 1, y: 1, blur: 0, color: '#666' }, { x: 2, y: 2, blur: 0, color: '#555' }, { x: 3, y: 3, blur: 0, color: '#444' }] },
		{ name: 'Outline', shadows: [{ x: -1, y: -1, blur: 0, color: '#000' }, { x: 1, y: -1, blur: 0, color: '#000' }, { x: -1, y: 1, blur: 0, color: '#000' }, { x: 1, y: 1, blur: 0, color: '#000' }] },
		{ name: 'Emboss', shadows: [{ x: -1, y: -1, blur: 1, color: 'rgba(255,255,255,0.6)' }, { x: 1, y: 1, blur: 1, color: 'rgba(0,0,0,0.3)' }] },
	];

	function applyPreset(preset: typeof presets[0]) {
		shadows = preset.shadows.map(s => ({ ...s }));
		selectedShadow = 0;
	}
</script>

<ToolWrapper
	keywords={['text shadow', 'css text shadow', 'text effects', 'shadow generator', 'text glow', 'neon text']}
>
	<div class="flex flex-col gap-6">
		<!-- Preview -->
		<div class="card bg-base-200 rounded-2xl overflow-hidden">
			<div class="card-body p-8">
				<h3 class="text-sm font-semibold mb-4 text-center">Live Preview</h3>
				<div class="flex justify-center py-8 bg-base-300 rounded-xl">
					<span 
						class="transition-all duration-300"
						style="
							text-shadow: {cssOutput};
							font-size: {fontSize}px;
							font-weight: {fontWeight};
						"
					>
						{previewText || 'Preview'}
					</span>
				</div>
				<div class="grid sm:grid-cols-3 gap-4 mt-4">
					<input 
						type="text" 
						bind:value={previewText}
						placeholder="Preview text"
						class="input input-bordered input-sm"
					/>
					<div class="flex items-center gap-2">
						<span class="text-sm shrink-0">Size:</span>
						<input 
							type="range" 
							bind:value={fontSize} 
							min="16" 
							max="72"
							class="range range-sm flex-1"
						/>
						<span class="font-mono text-sm w-12">{fontSize}px</span>
					</div>
					<select bind:value={fontWeight} class="select select-bordered select-sm">
						<option value="normal">Normal</option>
						<option value="bold">Bold</option>
						<option value="100">100</option>
						<option value="300">300</option>
						<option value="500">500</option>
						<option value="700">700</option>
						<option value="900">900</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Presets -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<h3 class="text-sm font-semibold mb-3">Presets</h3>
				<div class="flex flex-wrap gap-2">
					{#each presets as preset}
						<button
							class="btn btn-sm btn-ghost"
							onclick={() => applyPreset(preset)}
						>
							{preset.name}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<div class="grid lg:grid-cols-2 gap-6">
			<!-- Shadow List -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="text-sm font-semibold">Layers ({shadows.length})</h3>
						<button class="btn btn-sm btn-primary" onclick={addShadow}>+ Add</button>
					</div>
					<div class="space-y-2">
						{#each shadows as shadow, index}
							<div 
								class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors {selectedShadow === index ? 'bg-primary/15 ring-2 ring-primary/30' : 'bg-base-300 hover:bg-base-300/70'}"
								onclick={() => selectedShadow = index}
								role="button"
								tabindex="0"
							>
								<div class="flex items-center gap-3">
									<div 
										class="w-10 h-10 bg-base-100 rounded-lg flex items-center justify-center text-lg font-bold"
										style="text-shadow: {shadow.x}px {shadow.y}px {shadow.blur}px {shadow.color};"
									>
										A
									</div>
									<div>
										<div class="text-sm font-medium">Layer {index + 1}</div>
										<div class="text-xs text-base-content/50 font-mono">{shadow.x}, {shadow.y}, {shadow.blur}</div>
									</div>
								</div>
								<button 
									class="btn btn-xs btn-ghost text-error"
									onclick={(e) => { e.stopPropagation(); removeShadow(index); }}
									disabled={shadows.length <= 1}
								>
									✕
								</button>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Visual Controls -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="text-sm font-semibold mb-4">Layer {selectedShadow + 1} Controls</h3>
					
					<div class="space-y-4">
						<!-- X Offset -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">X Offset</span>
								<span class="font-mono text-sm text-primary">{shadows[selectedShadow].x}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].x} min="-20" max="20" class="range range-primary range-sm"/>
						</div>

						<!-- Y Offset -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">Y Offset</span>
								<span class="font-mono text-sm text-primary">{shadows[selectedShadow].y}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].y} min="-20" max="20" class="range range-primary range-sm"/>
						</div>

						<!-- Blur -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">Blur</span>
								<span class="font-mono text-sm text-secondary">{shadows[selectedShadow].blur}px</span>
							</div>
							<input type="range" bind:value={shadows[selectedShadow].blur} min="0" max="30" class="range range-secondary range-sm"/>
						</div>

						<!-- Color -->
						<div>
							<div class="flex justify-between mb-1">
								<span class="text-sm">Color</span>
							</div>
							<div class="flex gap-2">
								<input type="text" bind:value={shadows[selectedShadow].color} class="input input-bordered input-sm flex-1 font-mono"/>
								<input type="color" value="#000000" onchange={(e) => {
									shadows[selectedShadow].color = (e.target as HTMLInputElement).value;
								}} class="w-10 h-8 rounded cursor-pointer"/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Output -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold">CSS Output</h3>
					<CopyButton text={`text-shadow: ${cssOutput};`} label="Copy" size="sm" />
				</div>
				<pre class="bg-base-300 p-4 rounded-xl font-mono text-sm overflow-x-auto whitespace-pre-wrap break-all">text-shadow: {cssOutput};</pre>
			</div>
		</div>
	</div>
</ToolWrapper>
