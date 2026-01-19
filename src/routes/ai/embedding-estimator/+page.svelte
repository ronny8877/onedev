<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { countTokens } from '$lib/utils/tokenizer';
	import { EMBEDDING_MODELS, getEmbeddingModel, calculateEmbeddingCost, estimateVectorBytes, formatCurrency, getProviderColor, formatNumber, PRICING_LAST_UPDATED } from '$lib/config/ai-models';

	let input = $state('');
	let selectedModel = $state('text-embedding-3-small');
	let batchCount = $state(1);

	const sampleText = `Machine learning is a branch of artificial intelligence that focuses on building applications that learn from data and improve their accuracy over time without being programmed to do so.`;

	let stats = $derived.by(() => {
		const tokens = countTokens(input, 'gpt-4o'); // Embeddings use similar tokenization
		const model = getEmbeddingModel(selectedModel);
		const cost = calculateEmbeddingCost(selectedModel, tokens);
		const vectorBytes = estimateVectorBytes(selectedModel);

		return {
			tokens,
			dimensions: model?.dimensions || 0,
			vectorBytes: vectorBytes || 0,
			costPerEmbed: cost || 0,
			batchCost: (cost || 0) * batchCount,
			provider: model?.provider || 'openai',
			totalVectorBytes: (vectorBytes || 0) * batchCount,
			totalTokens: tokens * batchCount
		};
	});

	function loadSample() {
		input = sampleText;
	}

	function clearAll() {
		input = '';
	}

	function formatBytes(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	}
</script>

<ToolWrapper
	title="Embedding Size Estimator"
	description="Estimate tokens and vector dimensions for embedding models. Great for vector DB planning."
	keywords={['embedding estimator', 'vector size', 'embedding tokens', 'vector database', 'embedding dimensions']}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Model & Batch -->
		<div class="grid gap-4 sm:grid-cols-2">
			<div>
				<label class="label" for="model-select">
					<span class="label-text font-medium">Embedding Model</span>
				</label>
				<select
					id="model-select"
					bind:value={selectedModel}
					class="select select-bordered w-full transition-all duration-200"
				>
					{#each EMBEDDING_MODELS as model}
						<option value={model.name}>
							{model.displayName} ({model.dimensions}d)
						</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="label" for="batch-count">
					<span class="label-text font-medium">Batch Size (number of texts)</span>
				</label>
				<input
					id="batch-count"
					type="number"
					bind:value={batchCount}
					min="1"
					max="1000000"
					class="input input-bordered w-full font-mono transition-all duration-200"
				/>
			</div>
		</div>

		<!-- Input -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Sample Text (for token estimation)</h3>
				<span class="badge badge-ghost font-mono">{formatNumber(stats.tokens)} tokens</span>
			</div>
			<textarea
				bind:value={input}
				placeholder="Enter sample text to estimate embedding size..."
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-32 resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/30"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Stats Display -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Tokens -->
			<div class="card bg-base-200 rounded-xl transition-all duration-300 hover:scale-[1.02]">
				<div class="card-body py-4 px-4">
					<div class="text-sm text-base-content/60">Tokens</div>
					<div class="text-2xl font-bold font-mono">{formatNumber(stats.tokens)}</div>
					<div class="text-xs text-base-content/50">per text</div>
				</div>
			</div>

			<!-- Dimensions -->
			<div class="card bg-linear-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
				<div class="card-body py-4 px-4">
					<div class="text-sm text-base-content/60">Vector Dimensions</div>
					<div class="text-2xl font-bold font-mono text-primary">{formatNumber(stats.dimensions)}</div>
					<div class="text-xs text-base-content/50">float32 values</div>
				</div>
			</div>

			<!-- Vector Size -->
			<div class="card bg-base-200 rounded-xl transition-all duration-300 hover:scale-[1.02]">
				<div class="card-body py-4 px-4">
					<div class="text-sm text-base-content/60">Vector Size</div>
					<div class="text-2xl font-bold font-mono">{formatBytes(stats.vectorBytes)}</div>
					<div class="text-xs text-base-content/50">per embedding</div>
				</div>
			</div>

			<!-- Cost -->
			<div class="card bg-base-200 rounded-xl transition-all duration-300 hover:scale-[1.02]">
				<div class="card-body py-4 px-4">
					<div class="text-sm text-base-content/60">Cost per Embed</div>
					<div class="text-2xl font-bold font-mono">{formatCurrency(stats.costPerEmbed)}</div>
					<div class="text-xs text-base-content/50">
						<span class="badge {getProviderColor(stats.provider)} badge-xs">{stats.provider}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Batch Estimates -->
		{#if batchCount > 1}
			<div class="card bg-linear-to-br from-secondary/15 to-secondary/5 border border-secondary/20 rounded-2xl transition-all duration-300">
				<div class="card-body py-5">
					<h3 class="font-semibold mb-4 flex items-center gap-2">
						📦 Batch Estimate ({formatNumber(batchCount)} texts)
					</h3>
					<div class="grid gap-4 sm:grid-cols-3">
						<div class="text-center transition-all duration-200 hover:scale-105">
							<div class="text-sm text-base-content/60">Total Tokens</div>
							<div class="text-2xl font-bold font-mono">{formatNumber(stats.totalTokens)}</div>
						</div>
						<div class="text-center transition-all duration-200 hover:scale-105">
							<div class="text-sm text-base-content/60">Total Storage</div>
							<div class="text-2xl font-bold font-mono">{formatBytes(stats.totalVectorBytes)}</div>
						</div>
						<div class="text-center transition-all duration-200 hover:scale-105">
							<div class="text-sm text-base-content/60">Total Cost</div>
							<div class="text-2xl font-bold font-mono text-secondary">{formatCurrency(stats.batchCost, 4)}</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Model Comparison -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3">Model Comparison</h3>
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th>Model</th>
								<th class="text-right">Dimensions</th>
								<th class="text-right">Size/Vector</th>
								<th class="text-right">$/1M tokens</th>
							</tr>
						</thead>
						<tbody>
							{#each EMBEDDING_MODELS as model}
								<tr class="{model.name === selectedModel ? 'bg-primary/10' : ''} transition-colors duration-200 hover:bg-base-300">
									<td class="font-medium">
										{model.displayName}
										<span class="badge {getProviderColor(model.provider)} badge-xs ml-1">{model.provider}</span>
									</td>
									<td class="text-right font-mono">{formatNumber(model.dimensions)}</td>
									<td class="text-right font-mono">{formatBytes(model.dimensions * 4)}</td>
									<td class="text-right font-mono">${model.pricePerMillion}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About Embeddings</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Embeddings convert text to fixed-size vectors for similarity search</li>
					<li>• Higher dimensions often mean better quality but more storage</li>
					<li>• Vectors are stored as float32 (4 bytes per dimension)</li>
					<li>• Pricing as of {PRICING_LAST_UPDATED} - check providers for current rates</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
