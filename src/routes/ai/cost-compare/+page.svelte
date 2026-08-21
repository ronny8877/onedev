<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { aiToolsContent } from '$lib/config/content/ai-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	import { CHAT_MODELS, calculateChatCost, formatCurrency, getProviderColor, formatNumber, PRICING_LAST_UPDATED } from '$lib/config/ai-models';

	const content = aiToolsContent['cost-compare'];

	// Slider bounds
	const maxTokensSlider = 100000;
	const maxDailyRequestsSlider = 10000;

	// User inputs
	let inputTokens = $state(1000);
	let outputTokens = $state(500);
	let dailyRequests = $state(10);
	let selectedProviders = $state<string[]>(['openai', 'anthropic', 'google', 'deepseek', 'meta', 'x', 'moonshot']);

	const allProviders = Array.from(new Set(CHAT_MODELS.map(m => m.provider)));

	function toggleProvider(p: string) {
		if (selectedProviders.includes(p)) {
			selectedProviders = selectedProviders.filter(x => x !== p);
		} else {
			selectedProviders = [...selectedProviders, p];
		}
	}

	function reset() {
		inputTokens = 1000;
		outputTokens = 500;
		dailyRequests = 10;
		selectedProviders = [...allProviders];
	}

	let modelCosts = $derived.by(() => {
		const result = CHAT_MODELS
			.filter(m => selectedProviders.includes(m.provider))
			.map(model => {
				const costPerReq = calculateChatCost(model.name, inputTokens, outputTokens);
				const dailyCost = (costPerReq?.totalCost || 0) * dailyRequests;
				const monthlyCost = dailyCost * 30;
				
				return {
					...model,
					costPerReq: costPerReq?.totalCost || 0,
					dailyCost,
					monthlyCost
				};
			});
		
		// Sort by monthly cost ascending
		return result.sort((a, b) => a.monthlyCost - b.monthlyCost);
	});

</script>

<ToolWrapper
	keywords={['AI cost comparison', 'LLM pricing', 'GPT-5.6 cost', 'Claude Opus 5 pricing', 'Gemini 3.7 Flash cost', 'DeepSeek V4 pricing']}
	lastUpdated={PRICING_LAST_UPDATED}
>
	<div class="flex flex-col gap-6">
		<ToolActions onClear={reset} />

		<!-- Interactive Controllers -->
		<div class="card bg-base-200/50 backdrop-blur-md border border-base-content/10 shadow-sm rounded-2xl p-6">
			<div class="grid gap-8 lg:grid-cols-3">
				<!-- Input Tokens -->
				<div class="form-control">
					<div class="flex items-center justify-between mb-2">
						<label class="font-semibold text-sm flex items-center gap-2" for="input-slider">
							<div class="w-2 h-2 rounded-full bg-blue-500"></div> Input Tokens / Req
						</label>
						<span class="font-mono text-sm bg-base-100 px-2 py-0.5 rounded border border-base-content/10">{formatNumber(inputTokens)}</span>
					</div>
					<input 
						id="input-slider"
						type="range" 
						min="100" 
						max={maxTokensSlider} 
						bind:value={inputTokens} 
						class="range range-xs range-info" 
					/>
					<div class="text-xs text-base-content/50 flex justify-between mt-1 px-1">
						<span>100</span>
						<span>{formatNumber(maxTokensSlider)}</span>
					</div>
				</div>

				<!-- Output Tokens -->
				<div class="form-control">
					<div class="flex items-center justify-between mb-2">
						<label class="font-semibold text-sm flex items-center gap-2" for="output-slider">
							<div class="w-2 h-2 rounded-full bg-purple-500"></div> Output Tokens / Req
						</label>
						<span class="font-mono text-sm bg-base-100 px-2 py-0.5 rounded border border-base-content/10">{formatNumber(outputTokens)}</span>
					</div>
					<input 
						id="output-slider"
						type="range" 
						min="10" 
						max={maxTokensSlider} 
						bind:value={outputTokens} 
						class="range range-xs range-secondary" 
					/>
					<div class="text-xs text-base-content/50 flex justify-between mt-1 px-1">
						<span>10</span>
						<span>{formatNumber(maxTokensSlider)}</span>
					</div>
				</div>

				<!-- Daily Requests -->
				<div class="form-control">
					<div class="flex items-center justify-between mb-2">
						<label class="font-semibold text-sm flex items-center gap-2" for="requests-slider">
							<div class="w-2 h-2 rounded-full bg-green-500"></div> Daily API Calls
						</label>
						<span class="font-mono text-sm bg-base-100 px-2 py-0.5 rounded border border-base-content/10">{formatNumber(dailyRequests)}</span>
					</div>
					<input 
						id="requests-slider"
						type="range" 
						min="1" 
						max={maxDailyRequestsSlider} 
						bind:value={dailyRequests} 
						class="range range-xs range-success" 
					/>
					<div class="text-xs text-base-content/50 flex justify-between mt-1 px-1">
						<span>1</span>
						<span>{formatNumber(maxDailyRequestsSlider)}</span>
					</div>
				</div>
			</div>

			<!-- Provider Filters -->
			<div class="mt-6 pt-5 border-t border-base-content/10">
				<div class="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3">Filter Providers</div>
				<div class="flex flex-wrap gap-2">
					{#each allProviders as provider}
						<button 
							type="button"
							class="btn btn-xs transition-all {selectedProviders.includes(provider) ? getProviderColor(provider) : 'btn-outline border-base-content/20 text-base-content/50'}"
							onclick={() => toggleProvider(provider)}
						>
							{provider}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Main Comparison Grid (Bento Style) -->
		{#if modelCosts.length === 0}
			<div class="alert alert-warning">
				<span>Please select at least one provider to view costs.</span>
			</div>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each modelCosts as model, i (model.name)}
					<div class="card bg-base-100 border border-base-content/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md {i === 0 ? 'ring-2 ring-success/50 bg-success/5' : ''}">
						<div class="card-body p-5">
							<div class="flex justify-between items-start mb-2">
								<h3 class="font-bold text-base leading-tight">
									{model.displayName}
								</h3>
								<span class="badge {getProviderColor(model.provider)} badge-xs ml-2 opacity-80">{model.provider}</span>
							</div>

							<div class="text-3xl font-black font-mono tracking-tight my-2 {i === 0 ? 'text-success' : ''}">
								{formatCurrency(model.monthlyCost)}<span class="text-base font-semibold text-base-content/50 tracking-normal">/mo</span>
							</div>

							<div class="flex flex-col gap-1.5 mt-2 text-xs font-mono text-base-content/70">
								<div class="flex justify-between items-center bg-base-200/50 px-2 py-1 rounded">
									<span>Per Request:</span>
									<span class="font-semibold text-base-content">{formatCurrency(model.costPerReq, 4)}</span>
								</div>
								<div class="flex justify-between items-center bg-base-200/50 px-2 py-1 rounded">
									<span>Daily:</span>
									<span class="font-semibold text-base-content">{formatCurrency(model.dailyCost, 2)}</span>
								</div>
							</div>

							{#if model.notes}
								<div class="mt-4 pt-3 border-t border-base-content/10 text-[10px] leading-snug text-base-content/60 italic">
									{model.notes}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}

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
