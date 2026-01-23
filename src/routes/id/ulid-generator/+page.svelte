<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { ulid, decodeTime } from 'ulid';

	// State
	let count = $state(1);
	let generatedUlids = $state<{ id: string; timestamp: Date }[]>([]);
	let isGenerating = $state(false);
	let showSortDemo = $state(false);
	let sortDemoUlids = $state<{ id: string; timestamp: Date; delay: number }[]>([]);

	// Generate ULIDs
	function generate() {
		isGenerating = true;
		
		setTimeout(() => {
			const results: { id: string; timestamp: Date }[] = [];
			
			for (let i = 0; i < count; i++) {
				const id = ulid();
				const timestamp = new Date(decodeTime(id));
				results.push({ id, timestamp });
			}
			
			generatedUlids = results;
			isGenerating = false;
		}, 50);
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

				<div class="grid gap-4 sm:grid-cols-2">
					<!-- Quantity -->
					<div>
						<label class="text-sm font-medium mb-2 block">Quantity: {count}</label>
						<input
							type="range"
							bind:value={count}
							min="1"
							max="100"
							class="range range-sm range-primary"
						/>
						<div class="flex justify-between text-xs text-base-content/50 mt-1">
							<span>1</span>
							<span>100</span>
						</div>
					</div>

					<!-- Demo Button -->
					<div class="flex items-end">
						<button
							type="button"
							class="btn btn-outline btn-sm"
							onclick={runSortDemo}
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
							</svg>
							Run Sort Demo
						</button>
					</div>
				</div>

				<!-- Generate Button -->
				<button
					type="button"
					class="btn btn-primary mt-4"
					onclick={generate}
					disabled={isGenerating}
				>
					{#if isGenerating}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					{/if}
					Generate ULIDs
				</button>
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
</ToolWrapper>
