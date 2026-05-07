<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { ulid, decodeTime } from 'ulid';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { idToolsContent } from '$lib/config/content/id-tools-content';

	const content = idToolsContent['ulid-generator'];

	// State
	let count = $state(1);
	let generatedUlids = $state<{ id: string; timestamp: Date }[]>([]);
	let isGenerating = $state(false);
	let showSortDemo = $state(false);
	let sortDemoUlids = $state<{ id: string; timestamp: Date; delay: number }[]>([]);

	// Generate ULIDs with chunking
	async function generate() {
		if (isGenerating) {
			isGenerating = false;
			return;
		}

		isGenerating = true;
		generatedUlids = [];
		
		const CHUNK_SIZE = 500;
		const delay = 0;
		let current = 0;

		// Initial batch
		const initialBatchSize = Math.min(50, count);
		const initialBatch = [];
		for (let i = 0; i < initialBatchSize; i++) {
			const id = ulid();
			const timestamp = new Date(decodeTime(id));
			initialBatch.push({ id, timestamp });
		}
		generatedUlids = initialBatch;
		current += initialBatchSize;

		await new Promise(r => setTimeout(r, 10));

		while (current < count && isGenerating) {
			const batchSize = Math.min(CHUNK_SIZE, count - current);
			const batch = [];
			
			for (let i = 0; i < batchSize; i++) {
				const id = ulid();
				const timestamp = new Date(decodeTime(id));
				batch.push({ id, timestamp });
			}
			
			generatedUlids = [...generatedUlids, ...batch];
			current += batchSize;

			if (current < count) {
				await new Promise(r => setTimeout(r, delay));
			}
		}

		isGenerating = false;
	}

	// Run sortable demo - generate ULIDs with delays
	async function runSortDemo() {
		showSortDemo = true;
		sortDemoUlids = [];
		
		const delays = [0, 100, 250, 500, 1000];
		
		for (let i = 0; i < delays.length; i++) {
			if (i > 0) {
				await new Promise(resolve => setTimeout(resolve, delays[i] - delays[i - 1]));
			}
			const id = ulid();
			const timestamp = new Date(decodeTime(id));
			sortDemoUlids = [...sortDemoUlids, { id, timestamp, delay: delays[i] }];
		}
	}

	// Get all ULIDs as text
	function getAllUlidsText(): string {
		return generatedUlids.map(u => u.id).join('\n');
	}

	// Get all ULIDs as JSON
	function getAllUlidsJson(): string {
		return JSON.stringify(generatedUlids.map(u => ({
			ulid: u.id,
			timestamp: u.timestamp.toISOString()
		})), null, 2);
	}

	// Download as file
	function downloadAs(format: 'txt' | 'json') {
		const content = format === 'json' ? getAllUlidsJson() : getAllUlidsText();
		const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `ulids.${format}`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function loadSample() {
		count = 5;
		generate();
	}

	function clearAll() {
		generatedUlids = [];
		sortDemoUlids = [];
		showSortDemo = false;
		count = 1;
	}

	import { onMount } from 'svelte';

	let stats = $derived({
		count: generatedUlids.length > 0 ? generatedUlids.length : undefined
	});

	// Generate on mount
	onMount(() => {
		generate();
	});

	// Format timestamp portion
	function highlightTimestamp(ulidStr: string): { timestamp: string; random: string } {
		return {
			timestamp: ulidStr.substring(0, 10), // First 10 chars are timestamp
			random: ulidStr.substring(10) // Remaining 16 chars are random
		};
	}
	// Calculate collision stats for ULID
	function getCollisionStats() {
		// ULID has 80 bits of randomness per millisecond
		// We focus on the random part for collision probability within the same MS
		const randomBits = 80;
		const totalPossibilities = Math.pow(2, randomBits);
		
		// 1. Collision Probability at 1 Billion IDs (within same ms for worst case, or total for general)
		// For ULID, since it's monotonic, it handles same-ms collisions by incrementing.
		// So purely random collision is only if we generate > 2^80 in a burst or different systems collide.
		// Let's model "Random Collision Risk" for distributed systems.
		
		const n = 1e9; // 1 billion generated
		
		// Prob ≈ n^2 / 2N
		// Using linear approx for such huge N is fine, or exp for correctness
		// P = 1 - exp(-n^2/2N)
		// n^2 = 1e18
		// 2N = 2 * 1.2e24 ≈ 2.4e24
		// Exponent is tiny.
		
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
			timeToCollision: timeString
		};
	}
	
	let collisionInfo = $derived(getCollisionStats());
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Configuration -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center gap-2 mb-3">
					<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
						<span>⚙️</span>
					</div>
					<h3 class="font-bold">Configuration</h3>
				</div>

				<div class="grid gap-4 mb-4">
					<!-- Quantity -->
					<div>
						<div class="flex justify-between items-center mb-2">
							<label class="text-sm font-medium">Quantity</label>
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

					<!-- Demo Button -->
					<div class="flex justify-end">
						<button
							type="button"
							class="btn btn-outline btn-sm"
							onclick={runSortDemo}
							disabled={isGenerating}
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
							</svg>
							Run Sort Demo
						</button>
					</div>
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
								Generating 1 billion IDs
							</p>
						</div>
					</div>

					<div class="p-3 bg-base-300/50 rounded-lg flex items-center gap-3 border border-base-content/5">
						<div class="w-10 h-10 rounded-lg bg-base-100 flex items-center justify-center shrink-0 text-lg shadow-sm">
							⏳
						</div>
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
							Generating... {Math.round((generatedUlids.length / count) * 100)}%
						{:else}
							<svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
							Generate {count > 1 ? `${count.toLocaleString()} ` : ''}ULIDs
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

		<!-- Sort Demo -->
		{#if showSortDemo && sortDemoUlids.length > 0}
			<div class="card bg-success/10 border border-success/30 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
							<span>📊</span>
						</div>
						<h3 class="font-bold text-success">Sortability Demo</h3>
						<span class="badge badge-sm badge-success">Live</span>
					</div>
					
					<p class="text-sm text-base-content/70 mb-3">
						ULIDs generated at different times sort chronologically by string comparison:
					</p>

					<div class="space-y-2">
						{#each sortDemoUlids as { id, timestamp, delay }, i}
							{@const parts = highlightTimestamp(id)}
							<div class="flex items-center gap-2 bg-base-100/50 rounded-lg p-2">
								<span class="text-xs text-base-content/40 w-6">{i + 1}</span>
								<code class="font-mono text-sm">
									<span class="text-success font-bold">{parts.timestamp}</span><span class="text-base-content/70">{parts.random}</span>
								</code>
								<span class="text-xs text-base-content/50 ml-auto">
									+{delay}ms
								</span>
								<span class="text-xs text-base-content/60">
									{timestamp.toLocaleTimeString()}.{timestamp.getMilliseconds().toString().padStart(3, '0')}
								</span>
							</div>
						{/each}
					</div>

					<p class="text-xs text-base-content/60 mt-3">
						Notice: IDs sort correctly when sorted as strings, preserving creation order!
					</p>
				</div>
			</div>
		{/if}

		<!-- Generated ULIDs -->
		{#if generatedUlids.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-info/20 flex items-center justify-center">
								<span>🆔</span>
							</div>
							<h3 class="font-bold">Generated ULIDs</h3>
							<span class="badge badge-sm badge-ghost">{generatedUlids.length}</span>
						</div>
						<div class="flex items-center gap-2">
							<CopyButton text={getAllUlidsText()} size="sm" label="Copy All" />
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
						{#each generatedUlids as { id, timestamp }, i}
							{@const parts = highlightTimestamp(id)}
							<div class="flex items-center gap-2 bg-base-300/50 rounded-lg p-2 group hover:bg-base-300 transition-colors">
								<span class="text-xs text-base-content/40 w-6 text-right">{i + 1}</span>
								<code class="flex-1 font-mono text-sm">
									<span class="text-primary">{parts.timestamp}</span><span>{parts.random}</span>
								</code>
								<span class="text-xs text-base-content/50 hidden sm:block">
									{timestamp.toLocaleString()}
								</span>
								<CopyButton text={id} size="xs" />
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- ULID Anatomy -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-3">ULID Structure</h4>
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<div class="flex font-mono text-lg">
							<span class="bg-primary/20 text-primary px-2 py-1 rounded-l-lg">01ARZ3NDEK</span>
							<span class="bg-base-300 px-2 py-1 rounded-r-lg">R00GW2HJSN</span>
						</div>
					</div>
					<div class="grid gap-2 text-sm">
						<div class="flex items-center gap-3">
							<span class="w-3 h-3 rounded bg-primary/50"></span>
							<span class="font-medium">Timestamp (10 chars)</span>
							<span class="text-base-content/60">48-bit Unix time in milliseconds</span>
						</div>
						<div class="flex items-center gap-3">
							<span class="w-3 h-3 rounded bg-base-content/30"></span>
							<span class="font-medium">Randomness (16 chars)</span>
							<span class="text-base-content/60">80 bits of random data</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Comparison -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-3">ULID vs UUID</h4>
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th></th>
								<th>ULID</th>
								<th>UUID v4</th>
								<th>UUID v7</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="font-medium">Length</td>
								<td>26 chars</td>
								<td>36 chars</td>
								<td>36 chars</td>
							</tr>
							<tr>
								<td class="font-medium">Sortable</td>
								<td class="text-success">✓ Yes</td>
								<td class="text-error">✗ No</td>
								<td class="text-success">✓ Yes</td>
							</tr>
							<tr>
								<td class="font-medium">Timestamp</td>
								<td class="text-success">✓ 48-bit ms</td>
								<td class="text-error">✗ None</td>
								<td class="text-success">✓ 48-bit ms</td>
							</tr>
							<tr>
								<td class="font-medium">Case-sensitive</td>
								<td>No (Crockford Base32)</td>
								<td>No</td>
								<td>No</td>
							</tr>
							<tr>
								<td class="font-medium">Total entropy</td>
								<td>128 bits</td>
								<td>122 bits</td>
								<td>74 bits</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
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
	</div>
</ToolWrapper>
