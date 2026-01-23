<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';

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

	// Generate UUIDs
	function generate() {
		isGenerating = true;
		generatedUuids = [];

		setTimeout(() => {
			const results: { id: string; timestamp?: Date }[] = [];
			
			for (let i = 0; i < count; i++) {
				const uuid = version === 'v4' ? uuidv4() : uuidv7();
				const timestamp = version === 'v7' ? extractV7Timestamp(uuid) : undefined;
				results.push({ id: uuid, timestamp });
			}

			generatedUuids = results;
			isGenerating = false;
		}, 50);
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
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Version Selection -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body p-4">
				<div class="flex items-center gap-2 mb-3">
					<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
						<span>🔧</span>
					</div>
					<h3 class="font-bold">Configuration</h3>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<!-- Version Toggle -->
					<div>
						<label class="text-sm font-medium mb-2 block">UUID Version</label>
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
				</div>

				<!-- Format Options -->
				<div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-base-300">
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={uppercase} class="toggle toggle-sm" />
						<span class="text-sm">UPPERCASE</span>
					</label>
					<label class="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={withHyphens} class="toggle toggle-sm toggle-primary" />
						<span class="text-sm">With hyphens</span>
					</label>
					<button
						type="button"
						class="btn btn-primary btn-sm ml-auto"
						onclick={generate}
						disabled={isGenerating}
					>
						{#if isGenerating}
							<span class="loading loading-spinner loading-xs"></span>
						{:else}
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
							</svg>
						{/if}
						Generate
					</button>
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

		<!-- Info Cards -->
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2">
						<span class="text-lg">🎲</span>
						<h4 class="font-semibold">UUID v4 (Random)</h4>
					</div>
					<ul class="mt-2 text-sm text-base-content/70 space-y-1">
						<li>• 122 random bits</li>
						<li>• No timestamp or order</li>
						<li>• Best for general unique IDs</li>
						<li>• Collision probability: 1 in 2.71 quintillion</li>
					</ul>
				</div>
			</div>
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2">
						<span class="text-lg">⏱️</span>
						<h4 class="font-semibold">UUID v7 (Time-ordered)</h4>
					</div>
					<ul class="mt-2 text-sm text-base-content/70 space-y-1">
						<li>• 48-bit Unix timestamp (ms)</li>
						<li>• Sortable by creation time</li>
						<li>• Better for databases (index friendly)</li>
						<li>• Modern replacement for v1</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
