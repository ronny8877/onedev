<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { countTokens } from '$lib/utils/tokenizer';
	import { aiToolsContent } from '$lib/config/content/ai-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = aiToolsContent['cost-estimator'];
	import { CHAT_MODELS, getChatModel, calculateChatCost, formatCurrency, getProviderColor, formatNumber, getTokenizerFactor, PRICING_LAST_UPDATED } from '$lib/config/ai-models';

	let selectedModel = $state('gpt-5.6-terra');
	let inputTokens = $state(1000);
	let outputTokens = $state(500);
	let batchSize = $state(1);
	let inputMode = $state<'manual' | 'paste'>('manual');
	let pastedInput = $state('');
	let pastedOutput = $state('');

	// Comparison models (up to 3)
	let compareModels = $state<string[]>([]);

	let stats = $derived.by(() => {
		// If paste mode, calculate tokens from text
		const finalInputTokens = inputMode === 'paste' ? countTokens(pastedInput, selectedModel) : inputTokens;
		const finalOutputTokens = inputMode === 'paste' ? countTokens(pastedOutput, selectedModel) : outputTokens;

		const cost = calculateChatCost(selectedModel, finalInputTokens, finalOutputTokens);
		const pricing = getChatModel(selectedModel);

		const comparisons = compareModels.map(modelName => {
			const compCost = calculateChatCost(modelName, finalInputTokens, finalOutputTokens);
			const compPricing = getChatModel(modelName);
			return {
				name: modelName,
				displayName: compPricing?.displayName || modelName,
				provider: compPricing?.provider || 'openai',
				cost: compCost
			};
		});

		return {
			inputTokens: finalInputTokens,
			outputTokens: finalOutputTokens,
			totalTokens: finalInputTokens + finalOutputTokens,
			inputCost: cost?.inputCost || 0,
			outputCost: cost?.outputCost || 0,
			totalCost: cost?.totalCost || 0,
			batchCost: (cost?.totalCost || 0) * batchSize,
			inputPer1M: pricing?.inputPer1M || 0,
			outputPer1M: pricing?.outputPer1M || 0,
			provider: pricing?.provider || 'openai',
			tokenizerFactor: getTokenizerFactor(selectedModel),
			comparisons
		};
	});

	function toggleCompare(modelName: string) {
		if (compareModels.includes(modelName)) {
			compareModels = compareModels.filter(m => m !== modelName);
		} else if (compareModels.length < 3) {
			compareModels = [...compareModels, modelName];
		}
	}

	function clearAll() {
		inputTokens = 1000;
		outputTokens = 500;
		batchSize = 1;
		pastedInput = '';
		pastedOutput = '';
		compareModels = [];
	}
</script>

<ToolWrapper
	keywords={['AI cost estimator', 'GPT pricing', 'Claude pricing', 'LLM cost calculator', 'API cost']}
	lastUpdated={PRICING_LAST_UPDATED}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onClear={clearAll} />

		<!-- Model Selector -->
		<div class="grid gap-4 sm:grid-cols-2">
			<div>
				<label class="label" for="model-select">
					<span class="label-text font-medium">Model</span>
				</label>
				<select
					id="model-select"
					bind:value={selectedModel}
					class="select select-bordered w-full transition-all duration-200"
				>
					{#each CHAT_MODELS as model}
						<option value={model.name}>
							{model.displayName}
						</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="label" for="batch-size">
					<span class="label-text font-medium">Number of Requests</span>
				</label>
				<input
					id="batch-size"
					type="number"
					bind:value={batchSize}
					min="1"
					max="1000000"
					class="input input-bordered w-full font-mono transition-all duration-200"
				/>
			</div>
		</div>

		<!-- Pricing Display -->
		<div class="flex flex-wrap items-center gap-3 p-3 bg-base-200 rounded-xl transition-all duration-300">
			<span class="badge {getProviderColor(stats.provider)}">{stats.provider}</span>
			<span class="text-sm">
				Input: <span class="font-mono font-medium">${stats.inputPer1M}/1M</span>
			</span>
			<span class="text-base-content/30">|</span>
			<span class="text-sm">
				Output: <span class="font-mono font-medium">${stats.outputPer1M}/1M</span>
			</span>
		</div>

		<!-- Tokenizer Adjustment Note -->
		{#if stats.tokenizerFactor !== 1}
			<div class="alert bg-warning/10 border border-warning/30 text-sm">
				<AppIcon name={'🔤'} size={16} />
				<span>
					<span class="font-semibold capitalize">{stats.provider}</span>'s tokenizer uses about
					<span class="font-mono font-semibold">{Math.round((stats.tokenizerFactor - 1) * 100)}%</span>
					more tokens than OpenAI's. In <span class="font-semibold">Paste Text</span> mode token counts (and cost) are adjusted automatically; in manual mode, remember your real token counts will be higher for this model.
				</span>
			</div>
		{/if}

		<!-- Input Mode Toggle -->
		<div class="flex gap-2">
			<button
				type="button"
				class="btn btn-sm {inputMode === 'manual' ? 'btn-primary' : 'btn-ghost'} transition-all duration-200"
				onclick={() => inputMode = 'manual'}
			>
				Enter Token Counts
			</button>
			<button
				type="button"
				class="btn btn-sm {inputMode === 'paste' ? 'btn-primary' : 'btn-ghost'} transition-all duration-200"
				onclick={() => inputMode = 'paste'}
			>
				Paste Text to Count
			</button>
		</div>

		<!-- Token Input -->
		{#if inputMode === 'manual'}
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<label class="label" for="input-tokens">
						<span class="label-text font-medium">Input Tokens</span>
					</label>
					<input
						id="input-tokens"
						type="number"
						bind:value={inputTokens}
						min="0"
						class="input input-bordered w-full font-mono transition-all duration-200"
					/>
				</div>
				<div>
					<label class="label" for="output-tokens">
						<span class="label-text font-medium">Output Tokens</span>
					</label>
					<input
						id="output-tokens"
						type="number"
						bind:value={outputTokens}
						min="0"
						class="input input-bordered w-full font-mono transition-all duration-200"
					/>
				</div>
			</div>

			<!-- Quick presets -->
			<div class="flex flex-wrap gap-2">
				<span class="text-sm text-base-content/60">Quick presets:</span>
				<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => { inputTokens = 500; outputTokens = 250; }}>Small</button>
				<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => { inputTokens = 2000; outputTokens = 1000; }}>Medium</button>
				<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => { inputTokens = 8000; outputTokens = 4000; }}>Large</button>
				<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => { inputTokens = 32000; outputTokens = 8000; }}>XL</button>
			</div>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2">
				<div>
					<div class="flex items-center justify-between mb-2">
						<label class="label-text font-medium" for="paste-input">Input Text</label>
						<span class="badge badge-ghost font-mono text-xs">{formatNumber(stats.inputTokens)} tokens</span>
					</div>
					<textarea
						id="paste-input"
						bind:value={pastedInput}
						placeholder="Paste your prompt/input..."
						class="textarea textarea-bordered w-full font-mono text-sm h-24 transition-all duration-200 focus:ring-2 focus:ring-primary/30"
					></textarea>
				</div>
				<div>
					<div class="flex items-center justify-between mb-2">
						<label class="label-text font-medium" for="paste-output">Expected Output</label>
						<span class="badge badge-ghost font-mono text-xs">{formatNumber(stats.outputTokens)} tokens</span>
					</div>
					<textarea
						id="paste-output"
						bind:value={pastedOutput}
						placeholder="Paste expected response..."
						class="textarea textarea-bordered w-full font-mono text-sm h-24 transition-all duration-200 focus:ring-2 focus:ring-primary/30"
					></textarea>
				</div>
			</div>
		{/if}

		<!-- Cost Breakdown -->
		<div class="card bg-linear-to-br from-success/15 to-success/5 border border-success/20 rounded-2xl">
			<div class="card-body py-5">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div class="text-center transition-all duration-200 hover:scale-105">
						<div class="text-sm text-base-content/60">Input Cost</div>
						<div class="text-2xl font-bold font-mono">{formatCurrency(stats.inputCost)}</div>
						<div class="text-xs text-base-content/50">{formatNumber(stats.inputTokens)} tokens</div>
					</div>
					<div class="text-center transition-all duration-200 hover:scale-105">
						<div class="text-sm text-base-content/60">Output Cost</div>
						<div class="text-2xl font-bold font-mono">{formatCurrency(stats.outputCost)}</div>
						<div class="text-xs text-base-content/50">{formatNumber(stats.outputTokens)} tokens</div>
					</div>
					<div class="text-center transition-all duration-200 hover:scale-105">
						<div class="text-sm text-base-content/60">Total per Request</div>
						<div class="text-2xl font-bold font-mono text-success">{formatCurrency(stats.totalCost)}</div>
						<div class="text-xs text-base-content/50">{formatNumber(stats.totalTokens)} tokens</div>
					</div>
					{#if batchSize > 1}
						<div class="text-center transition-all duration-200 hover:scale-105">
							<div class="text-sm text-base-content/60">Total ({formatNumber(batchSize)} reqs)</div>
							<div class="text-2xl font-bold font-mono text-primary">{formatCurrency(stats.batchCost, 2)}</div>
							<div class="text-xs text-base-content/50">{formatNumber(stats.totalTokens * batchSize)} tokens</div>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Compare Models -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3">Compare Models (select up to 3)</h3>
				<div class="flex flex-wrap gap-2 mb-4">
					{#each CHAT_MODELS.filter(m => m.name !== selectedModel) as model}
						<button
							type="button"
							class="btn btn-xs {compareModels.includes(model.name) ? 'btn-primary' : 'btn-ghost'} transition-all duration-200 hover:scale-105"
							onclick={() => toggleCompare(model.name)}
						>
							{model.displayName}
						</button>
					{/each}
				</div>

				{#if stats.comparisons.length > 0}
					<div class="overflow-x-auto">
						<table class="table table-sm">
							<thead>
								<tr>
									<th>Model</th>
									<th class="text-right">Input Cost</th>
									<th class="text-right">Output Cost</th>
									<th class="text-right">Total</th>
									<th class="text-right">vs Selected</th>
								</tr>
							</thead>
							<tbody>
								<tr class="bg-primary/10">
									<td class="font-medium">{getChatModel(selectedModel)?.displayName} (selected)</td>
									<td class="text-right font-mono">{formatCurrency(stats.inputCost)}</td>
									<td class="text-right font-mono">{formatCurrency(stats.outputCost)}</td>
									<td class="text-right font-mono font-bold">{formatCurrency(stats.totalCost)}</td>
									<td class="text-right">—</td>
								</tr>
								{#each stats.comparisons as comp}
									{@const diff = stats.totalCost > 0 ? ((comp.cost?.totalCost || 0) - stats.totalCost) / stats.totalCost * 100 : 0}
									<tr class="transition-colors duration-200 hover:bg-base-300">
										<td class="font-medium">
											{comp.displayName}
											<span class="badge {getProviderColor(comp.provider)} badge-xs ml-1">{comp.provider}</span>
										</td>
										<td class="text-right font-mono">{formatCurrency(comp.cost?.inputCost || 0)}</td>
										<td class="text-right font-mono">{formatCurrency(comp.cost?.outputCost || 0)}</td>
										<td class="text-right font-mono font-bold">{formatCurrency(comp.cost?.totalCost || 0)}</td>
										<td class="text-right font-mono {diff < 0 ? 'text-success' : diff > 0 ? 'text-error' : ''}">
											{diff > 0 ? '+' : ''}{diff.toFixed(0)}%
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>

		<!-- Disclaimer -->
		<div class="alert">
			<span>⚠️</span>
			<div>
				<div class="font-semibold">Approximate Pricing</div>
				<div class="text-sm">
					Prices last updated: {PRICING_LAST_UPDATED}. Always check provider websites for current rates. 
					Actual costs may vary based on region, volume discounts, and API version.
				</div>
			</div>
		</div>

		<!-- Monthly Estimate Calculator -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Quick Monthly Estimates</h4>
				<div class="grid gap-2 sm:grid-cols-4 mt-3 text-sm">
					{#each [100, 1000, 10000, 100000] as daily}
						{@const monthlyCost = stats.totalCost * daily * 30}
						<div class="p-3 rounded-lg bg-base-300/50 text-center transition-all duration-200 hover:bg-base-300 hover:scale-[1.02]">
							<div class="font-medium">{formatNumber(daily)}/day</div>
							<div class="font-mono text-lg">{formatCurrency(monthlyCost, 2)}</div>
							<div class="text-xs text-base-content/50">/month</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
