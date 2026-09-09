<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { idToolsContent } from '$lib/config/content/id-tools-content';
	import HowTo from '$lib/components/content/HowTo.svelte';

	const content = idToolsContent['uuid-generator'];

	// State
	let version = $state<'v4' | 'v7'>('v4');
	let count = $state(1);
	let uppercase = $state(false);
	let withHyphens = $state(true);
	let generatedUuids = $state<{ id: string; timestamp?: Date }[]>([]);
	let isGenerating = $state(false);

	// Version info
	const versionInfo = {
		v4: {
			name: 'Version 4 (Random)',
			description: 'Randomly generated UUID. Most common choice.',
			badge: 'popular',
			color: 'primary'
		},
		v7: {
			name: 'Version 7 (Time-ordered)',
			description: 'Timestamp-based UUID. Sortable by creation time.',
			badge: 'modern',
			color: 'success'
		}
	};

	// Format UUID based on settings
	function formatUuid(uuid: string): string {
		let formatted = withHyphens ? uuid : uuid.replace(/-/g, '');
		return uppercase ? formatted.toUpperCase() : formatted.toLowerCase();
	}

	// Extract timestamp from v7 UUID
	function extractV7Timestamp(uuid: string): Date | undefined {
		try {
			// v7 UUID: first 48 bits are unix timestamp in milliseconds
			const hex = uuid.replace(/-/g, '').substring(0, 12);
			const timestamp = parseInt(hex, 16);
			return new Date(timestamp);
		} catch {
			return undefined;
		}
	}

	// Generate UUIDs with chunking
	async function generate() {
		if (isGenerating) {
			isGenerating = false;
			return;
		}

		isGenerating = true;
		generatedUuids = [];

		const CHUNK_SIZE = 500;
		const delay = 0; // ms
		let current = 0;

		// Initial small chunk for immediate feedback
		const initialBatchSize = Math.min(50, count);
		const initialBatch = [];
		for (let i = 0; i < initialBatchSize; i++) {
			const uuid = version === 'v4' ? uuidv4() : uuidv7();
			const timestamp = version === 'v7' ? extractV7Timestamp(uuid) : undefined;
			initialBatch.push({ id: uuid, timestamp });
		}
		generatedUuids = initialBatch;
		current += initialBatchSize;

		await new Promise(r => setTimeout(r, 10));

		while (current < count && isGenerating) {
			const batchSize = Math.min(CHUNK_SIZE, count - current);
			const batch = [];
			
			// Process chunk
			for (let i = 0; i < batchSize; i++) {
				const uuid = version === 'v4' ? uuidv4() : uuidv7();
				const timestamp = version === 'v7' ? extractV7Timestamp(uuid) : undefined;
				batch.push({ id: uuid, timestamp });
			}

			// Update state
			generatedUuids = [...generatedUuids, ...batch];
			current += batchSize;

			// Yield to main thread
			if (current < count) {
				await new Promise(r => setTimeout(r, delay));
			}
		}

		isGenerating = false;
	}

	// Get all UUIDs as formatted text
	function getAllUuidsText(): string {
		return generatedUuids.map(u => formatUuid(u.id)).join('\n');
	}

	// Get all UUIDs as JSON
	function getAllUuidsJson(): string {
		return JSON.stringify(generatedUuids.map(u => formatUuid(u.id)), null, 2);
	}

	// Download as file
	function downloadAs(format: 'txt' | 'json') {
		const content = format === 'json' ? getAllUuidsJson() : getAllUuidsText();
		const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `uuids-${version}.${format}`;
		a.click();
		URL.revokeObjectURL(url);
	}

	// Clear and generate sample
	function loadSample() {
		count = 5;
		generate();
	}

	function clearAll() {
		generatedUuids = [];
		count = 1;
	}

	import { onMount } from 'svelte';

	// Stats
	let stats = $derived({
		count: generatedUuids.length > 0 ? generatedUuids.length : undefined
	});

	// Generate on mount
	onMount(() => {
		generate();
	});
	// Calculate collision stats for UUID
	function getCollisionStats() {
		// v4 has 122 random bits
		// v7 has 74 random bits (plus 48 bits timestamp)
		
		const randomBits = version === 'v4' ? 122 : 74;
		const totalPossibilities = Math.pow(2, randomBits);
		
		// 1. Random Collision Probability at 1 Billion IDs
		// For v7, this is assuming collision within the SAME millisecond.
		// For v4, this is general collision probability.
		
		const n = 1e9; // 1 billion generated
		
		// Prob ≈ n^2 / 2N
		const exponent = - (n * n) / (2 * totalPossibilities);
		let probability = 1 - Math.exp(exponent);
		
		if (-exponent < 1e-9) probability = -exponent;

		let probString: string;
		
		if (probability < 1e-15) {
			probString = '< 1e-15%'; 
		} else if (probability < 0.000001) {
			probString = '< 0.0001%';
		} else {
			const percentage = probability * 100;
			if (percentage < 0.01) {
				probString = '~' + percentage.toFixed(6) + '%';
			} else {
				probString = '~' + percentage.toFixed(4) + '%';
			}
		}

		// 2. Time to 1% Collision Probability (Random component only)
		// Rate: 1,000 IDs per second
		const pTarget = 0.01;
		const idsFor1Percent = Math.sqrt(2 * totalPossibilities * -Math.log(1 - pTarget));
		const ratePerSecond = 1000;
		const secondsTo1Percent = idsFor1Percent / ratePerSecond;
		
		let timeString = '';
		const years = secondsTo1Percent / 31536000;
		if (years > 1e12) {
			timeString = 'Trillions of years';
		} else if (years > 1e9) {
			timeString = 'Billions of years';
		} else if (years > 1e6) {
			timeString = 'Millions of years';
		} else {
			timeString = `${Math.floor(years).toLocaleString()} years`;
		}

		return {
			probability: probString,
			timeToCollision: timeString,
			description: version === 'v7' ? 'Risk within same ms' : 'Global risk'
		};
	}
	
	let collisionInfo = $derived(getCollisionStats());
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Version Selection -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center gap-2 mb-3">
					<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
						<AppIcon name="wrench" size={16} />
					</div>
					<h3 class="font-bold">Configuration</h3>
				</div>

				<div class="grid gap-4 sm:grid-cols-2 mb-4">
					<!-- Version Toggle -->
					<div>
						<div class="text-sm font-medium mb-2 block">UUID Version</div>
						<div class="flex gap-2">
							{#each ['v4', 'v7'] as v}
								{@const info = versionInfo[v as 'v4' | 'v7']}
								<button
									type="button"
									class="btn btn-sm flex-1 {version === v ? `btn-${info.color}` : 'btn-ghost'}"
									onclick={() => version = v as 'v4' | 'v7'}
								>
									{v.toUpperCase()}
									<span class="badge badge-xs {version === v ? 'badge-neutral' : 'badge-ghost'}">{info.badge}</span>
								</button>
							{/each}
						</div>
						<p class="text-xs text-base-content/60 mt-1">{versionInfo[version].description}</p>
					</div>

					<!-- Count -->
					<div>
						<div class="flex justify-between items-center mb-2">
							<span class="text-sm font-medium">Quantity</span>
							<input 
								type="number" 
								bind:value={count} 
								min="1" 
								max="10000" 
								class="input input-xs input-bordered w-20 text-right font-mono"
							/>
						</div>
						<input
							type="range"
							bind:value={count}
							min="1"
							max="10000"
							step="1"
							class="range range-sm range-primary w-full"
						/>
						<div class="flex justify-between text-xs text-base-content/50 mt-1">
							<span>1</span>
							<span>5k</span>
							<span>10k</span>
						</div>
					</div>
				</div>

				<!-- Format Options -->
				<div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-base-300">
					<label class="flex items-center gap-2 cursor-pointer select-none hover:text-base-content transition-colors">
						<input type="checkbox" bind:checked={uppercase} class="toggle toggle-sm" />
						<span class="text-sm">UPPERCASE</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer select-none hover:text-base-content transition-colors">
						<input type="checkbox" bind:checked={withHyphens} class="toggle toggle-sm toggle-primary" />
						<span class="text-sm">With hyphens</span>
					</label>
				</div>
				
				<!-- Stats Cards -->
				<div class="mt-4 grid md:grid-cols-2 gap-3">
					<div class="p-3 bg-base-300/50 rounded-lg flex items-center gap-3 border border-base-content/5">
						<div class="w-10 h-10 rounded-lg bg-base-100 flex items-center justify-center shrink-0 text-lg shadow-sm">
							🎲
						</div>
						<div>
							<p class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Collision Probability</p>
							<div class="font-bold text-lg leading-tight">
								{collisionInfo.probability}
							</div>
							<p class="text-[10px] text-base-content/50">
								{collisionInfo.description} (1B IDs)
							</p>
						</div>
					</div>

					<div class="p-3 bg-base-300/50 rounded-lg flex items-center gap-3 border border-base-content/5">
						<div class="w-10 h-10 rounded-lg bg-base-100 flex items-center justify-center shrink-0 text-lg shadow-sm">
							<AppIcon name="hourglass" size={18} /></div>
						<div>
							<p class="text-xs font-medium text-base-content/60 uppercase tracking-wide">Time to 1% Risk</p>
							<div class="font-bold text-lg leading-tight">
								{collisionInfo.timeToCollision}
							</div>
							<p class="text-[10px] text-base-content/50">
								at 1,000 IDs/second
							</p>
						</div>
					</div>
				</div>

				<!-- Generate Button -->
				<div class="mt-4 flex gap-2">
					<button
						type="button"
						class="btn btn-primary flex-1"
						onclick={generate}
						disabled={isGenerating}
					>
						{#if isGenerating}
							<span class="loading loading-spinner loading-sm"></span>
							Generating... {Math.round((generatedUuids.length / count) * 100)}%
						{:else}
							<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							Generate {count > 1 ? `${count.toLocaleString()} ` : ''}UUIDs
						{/if}
					</button>
					
					{#if isGenerating}
						<button 
							type="button" 
							class="btn btn-error btn-outline"
							onclick={() => isGenerating = false}
						>
							Stop
						</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Generated UUIDs -->
		{#if generatedUuids.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
								<span>🎲</span>
							</div>
							<h3 class="font-bold">Generated UUIDs</h3>
							<span class="badge badge-sm badge-ghost">{generatedUuids.length}</span>
						</div>
						<div class="flex items-center gap-2">
							<CopyButton text={getAllUuidsText()} size="sm" label="Copy All" />
							<div class="dropdown dropdown-end">
								<button type="button" class="btn btn-sm btn-ghost">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
									</svg>
									Export
								</button>
								<ul class="dropdown-content menu bg-base-100 rounded-box w-40 p-2 shadow-xl z-10">
									<li><button onclick={() => downloadAs('txt')}>As .txt</button></li>
									<li><button onclick={() => downloadAs('json')}>As .json</button></li>
								</ul>
							</div>
						</div>
					</div>

					<div class="space-y-2 max-h-[400px] overflow-y-auto">
						{#each generatedUuids as { id, timestamp }, i}
							<div class="flex items-center gap-2 bg-base-300/50 rounded-lg p-2 group hover:bg-base-300 transition-colors">
								<span class="text-xs text-base-content/40 w-6 text-right">{i + 1}</span>
								<code class="flex-1 font-mono text-sm break-all">{formatUuid(id)}</code>
								{#if timestamp}
									<span class="text-xs text-base-content/50 hidden sm:block" title={timestamp.toISOString()}>
										{timestamp.toLocaleTimeString()}
									</span>
								{/if}
								<CopyButton text={formatUuid(id)} size="xs" />
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<div class="mt-12 space-y-12">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
		<RelatedTools relatedTools={content.relatedTools} />
		{#if content.tips}
			<Tips tips={content.tips} />
		{/if}
		{#if content.commonMistakes}
			<CommonMistakes mistakes={content.commonMistakes} />
		{/if}
	</div>
</ToolWrapper>
