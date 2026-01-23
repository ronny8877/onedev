<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { nanoid, customAlphabet } from 'nanoid';

	// State
	let length = $state(21);
	let alphabetPreset = $state<'default' | 'urlsafe' | 'hex' | 'numbers' | 'custom'>('default');
	let customAlphabetInput = $state('');
	let count = $state(1);
	let generatedIds = $state<string[]>([]);
	let isGenerating = $state(false);

	// Alphabet presets
	const alphabetPresets = {
		default: {
			name: 'Default',
			chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_-',
			description: 'URL-safe, 64 characters (A-Za-z0-9_-)'
		},
		urlsafe: {
			name: 'URL-Safe',
			chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
			description: 'Alphanumeric only, 62 characters'
		},
		hex: {
			name: 'Hexadecimal',
			chars: '0123456789abcdef',
			description: '16 characters (0-9, a-f)'
		},
		numbers: {
			name: 'Numbers Only',
			chars: '0123456789',
			description: '10 characters (0-9)'
		},
		custom: {
			name: 'Custom',
			chars: '',
			description: 'Define your own character set'
		}
	};

	// Get current alphabet
	function getCurrentAlphabet(): string {
		if (alphabetPreset === 'custom') {
			return customAlphabetInput || alphabetPresets.default.chars;
		}
		return alphabetPresets[alphabetPreset].chars;
	}

	// Calculate collision probability
	function getCollisionProbability(): { probability: string; description: string } {
		const alphabet = getCurrentAlphabet();
		const alphabetSize = alphabet.length;
		
		// Using birthday paradox approximation
		// For n IDs, probability ≈ n² / (2 * totalPossibilities)
		// totalPossibilities = alphabetSize^length
		
		const totalPossibilities = Math.pow(alphabetSize, length);
		const oneBillion = 1e9;
		
		// Probability of collision when generating 1 billion IDs
		const probPerBillion = (oneBillion * oneBillion) / (2 * totalPossibilities);
		
		if (probPerBillion < 1e-15) {
			return { probability: '< 0.000001%', description: 'Virtually impossible collision at 1 billion IDs' };
		} else if (probPerBillion < 1e-9) {
			return { probability: '~0.0000001%', description: 'Extremely unlikely at 1 billion IDs' };
		} else if (probPerBillion < 1e-6) {
			return { probability: '~0.0001%', description: 'Very unlikely at 1 billion IDs' };
		} else if (probPerBillion < 0.01) {
			return { probability: `~${(probPerBillion * 100).toFixed(4)}%`, description: 'Low probability at 1 billion IDs' };
		} else {
			return { probability: `~${(probPerBillion * 100).toFixed(2)}%`, description: '⚠️ Consider increasing length' };
		}
	}

	// Generate IDs
	function generate() {
		isGenerating = true;
		
		setTimeout(() => {
			const alphabet = getCurrentAlphabet();
			const results: string[] = [];
			
			// Use default nanoid or custom alphabet
			const generator = alphabetPreset === 'default' 
				? () => nanoid(length)
				: customAlphabet(alphabet, length);
			
			for (let i = 0; i < count; i++) {
				results.push(generator());
			}
			
			generatedIds = results;
			isGenerating = false;
		}, 50);
	}

	// Get all IDs as text
	function getAllIdsText(): string {
		return generatedIds.join('\n');
	}

	// Get all IDs as JSON
	function getAllIdsJson(): string {
		return JSON.stringify(generatedIds, null, 2);
	}

	// Download as file
	function downloadAs(format: 'txt' | 'json') {
		const content = format === 'json' ? getAllIdsJson() : getAllIdsText();
		const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `nanoids.${format}`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function loadSample() {
		count = 5;
		length = 21;
		alphabetPreset = 'default';
		generate();
	}

	function clearAll() {
		generatedIds = [];
		count = 1;
		length = 21;
		alphabetPreset = 'default';
	}

	import { onMount } from 'svelte';

	let stats = $derived({
		count: generatedIds.length > 0 ? generatedIds.length : undefined
	});

	let collisionInfo = $derived(getCollisionProbability());

	// Generate on mount
	onMount(() => {
		generate();
	});
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
					<!-- Length -->
					<div>
						<label class="text-sm font-medium mb-2 block">Length: {length} characters</label>
						<input
							type="range"
							bind:value={length}
							min="8"
							max="64"
							class="range range-sm range-primary"
						/>
						<div class="flex justify-between text-xs text-base-content/50 mt-1">
							<span>8 (short)</span>
							<span>21 (default)</span>
							<span>64 (long)</span>
						</div>
					</div>

					<!-- Quantity -->
					<div>
						<label class="text-sm font-medium mb-2 block">Quantity: {count}</label>
						<input
							type="range"
							bind:value={count}
							min="1"
							max="100"
							class="range range-sm"
						/>
						<div class="flex justify-between text-xs text-base-content/50 mt-1">
							<span>1</span>
							<span>100</span>
						</div>
					</div>
				</div>

				<!-- Alphabet Selection -->
				<div class="mt-4">
					<label class="text-sm font-medium mb-2 block">Alphabet</label>
					<div class="flex flex-wrap gap-2">
						{#each Object.entries(alphabetPresets) as [key, preset]}
							<button
								type="button"
								class="btn btn-sm {alphabetPreset === key ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => alphabetPreset = key as typeof alphabetPreset}
							>
								{preset.name}
								{#if key !== 'custom'}
									<span class="badge badge-xs">{preset.chars.length}</span>
								{/if}
							</button>
						{/each}
					</div>
					<p class="text-xs text-base-content/60 mt-2">
						{alphabetPresets[alphabetPreset].description}
					</p>
				</div>

				<!-- Custom Alphabet Input -->
				{#if alphabetPreset === 'custom'}
					<div class="mt-3">
						<input
							type="text"
							bind:value={customAlphabetInput}
							placeholder="Enter custom characters (min 2)..."
							class="input input-bordered input-sm w-full font-mono"
						/>
						{#if customAlphabetInput.length > 0}
							<p class="text-xs text-base-content/60 mt-1">
								Using {new Set(customAlphabetInput).size} unique characters
							</p>
						{/if}
					</div>
				{/if}

				<!-- Collision Probability -->
				<div class="mt-4 p-3 bg-base-300/50 rounded-lg">
					<div class="flex items-center gap-2">
						<span class="text-lg">🎲</span>
						<div>
							<p class="text-sm font-medium">Collision Probability</p>
							<p class="text-xs text-base-content/70">
								{collisionInfo.probability} — {collisionInfo.description}
							</p>
						</div>
					</div>
				</div>

				<!-- Generate Button -->
				<button
					type="button"
					class="btn btn-primary mt-4"
					onclick={generate}
					disabled={isGenerating || (alphabetPreset === 'custom' && customAlphabetInput.length < 2)}
				>
					{#if isGenerating}
						<span class="loading loading-spinner loading-sm"></span>
					{:else}
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
					{/if}
					Generate NanoIDs
				</button>
			</div>
		</div>

		<!-- Generated IDs -->
		{#if generatedIds.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
								<span>⚡</span>
							</div>
							<h3 class="font-bold">Generated NanoIDs</h3>
							<span class="badge badge-sm badge-ghost">{generatedIds.length}</span>
						</div>
						<div class="flex items-center gap-2">
							<CopyButton text={getAllIdsText()} size="sm" label="Copy All" />
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
						{#each generatedIds as id, i}
							<div class="flex items-center gap-2 bg-base-300/50 rounded-lg p-2 group hover:bg-base-300 transition-colors">
								<span class="text-xs text-base-content/40 w-6 text-right">{i + 1}</span>
								<code class="flex-1 font-mono text-sm break-all">{id}</code>
								<span class="text-xs text-base-content/40">{id.length}ch</span>
								<CopyButton text={id} size="xs" />
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Comparison with UUID -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-3">NanoID vs UUID</h4>
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th></th>
								<th>NanoID (21)</th>
								<th>UUID v4</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="font-medium">Length</td>
								<td>21 chars</td>
								<td>36 chars</td>
							</tr>
							<tr>
								<td class="font-medium">Entropy</td>
								<td>126 bits</td>
								<td>122 bits</td>
							</tr>
							<tr>
								<td class="font-medium">URL-safe</td>
								<td class="text-success">✓ Yes</td>
								<td class="text-warning">With encoding</td>
							</tr>
							<tr>
								<td class="font-medium">Customizable</td>
								<td class="text-success">✓ Length & alphabet</td>
								<td class="text-error">✗ Fixed format</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
