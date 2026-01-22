<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { countTokens, getModelConfig } from '$lib/utils/tokenizer';
	import { CHAT_MODELS, getChatModel, calculateChatCost, formatCurrency, getProviderColor, formatNumber, getContextUsage, PRICING_LAST_UPDATED } from '$lib/config/ai-models';

	let input = $state('');
	let selectedModel = $state('gpt-4o');
	let showCost = $state(true);

	const sampleText = `You are a helpful AI assistant. Your task is to analyze the following document and provide a comprehensive summary.

Document: The quick brown fox jumps over the lazy dog. This classic pangram contains every letter of the English alphabet at least once. Pangrams are often used for testing typewriters, fonts, and other text-related applications.

Please provide:
1. A brief summary of the main points
2. Key themes or patterns
3. Any recommendations for improvement`;

	let stats = $derived.by(() => {
		const text = input;
		const model = getModelConfig(selectedModel);
		const pricing = getChatModel(selectedModel);
		
		const tokens = countTokens(text, selectedModel);
		const chars = text.length;
		const charsNoSpaces = text.replace(/\s/g, '').length;
		const words = text.trim() ? text.trim().split(/\s+/).length : 0;
		const lines = text ? text.split('\n').length : 0;
		
		const contextUsage = getContextUsage(tokens, selectedModel);
		const cost = pricing ? calculateChatCost(selectedModel, tokens, 0) : null;

		return {
			tokens,
			chars,
			charsNoSpaces,
			words,
			lines,
			contextWindow: model.contextWindow,
			maxOutput: model.maxOutput,
			contextUsage,
			cost,
			provider: model.provider,
			inputPer1M: pricing?.inputPer1M || 0
		};
	});

	function loadSample() {
		input = sampleText;
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper
	keywords={['token counter', 'GPT tokens', 'Claude tokens', 'AI token calculator', 'LLM tokens', 'tokenizer']}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={input} />

		<!-- Model Selector -->
		<div class="flex flex-wrap items-center gap-4">
			<div class="flex-1 min-w-[200px]">
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
							{model.displayName} ({formatNumber(model.contextWindow)} ctx)
						</option>
					{/each}
				</select>
			</div>
			<div class="flex items-center gap-2 pt-8">
				<label class="label cursor-pointer gap-2">
					<span class="label-text">Show cost</span>
					<input type="checkbox" bind:checked={showCost} class="toggle toggle-sm toggle-primary" />
				</label>
			</div>
		</div>

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Enter Text</h3>
			<textarea
				bind:value={input}
				placeholder="Paste or type your text here to count tokens..."
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48 resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/30"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Token Count Display -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Primary: Token Count -->
			<div class="card bg-linear-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
				<div class="card-body py-4 px-5">
					<div class="flex items-center justify-between">
						<span class="text-sm text-base-content/70">Tokens</span>
						<span class="text-2xl">🔢</span>
					</div>
					<div class="text-3xl font-bold text-primary font-mono tracking-tight">
						{formatNumber(stats.tokens)}
					</div>
					<div class="text-xs text-base-content/50">
						{stats.contextUsage.toFixed(1)}% of context
					</div>
				</div>
			</div>

			<!-- Characters -->
			<div class="card bg-base-200 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
				<div class="card-body py-4 px-5">
					<div class="flex items-center justify-between">
						<span class="text-sm text-base-content/70">Characters</span>
						<span class="text-lg">📝</span>
					</div>
					<div class="text-2xl font-bold font-mono">
						{formatNumber(stats.chars)}
					</div>
					<div class="text-xs text-base-content/50">
						{formatNumber(stats.charsNoSpaces)} without spaces
					</div>
				</div>
			</div>

			<!-- Words -->
			<div class="card bg-base-200 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
				<div class="card-body py-4 px-5">
					<div class="flex items-center justify-between">
						<span class="text-sm text-base-content/70">Words</span>
						<span class="text-lg">📄</span>
					</div>
					<div class="text-2xl font-bold font-mono">
						{formatNumber(stats.words)}
					</div>
					<div class="text-xs text-base-content/50">
						{stats.lines} lines
					</div>
				</div>
			</div>

			<!-- Context Window -->
			<div class="card bg-base-200 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
				<div class="card-body py-4 px-5">
					<div class="flex items-center justify-between">
						<span class="text-sm text-base-content/70">Context</span>
						<span class="text-lg">📊</span>
					</div>
					<div class="text-2xl font-bold font-mono">
						{formatNumber(stats.contextWindow - stats.tokens)}
					</div>
					<div class="text-xs text-base-content/50">
						tokens remaining
					</div>
				</div>
			</div>
		</div>

		<!-- Context Usage Bar -->
		<div class="card bg-base-200 rounded-xl p-4">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium">Context Window Usage</span>
				<span class="text-sm font-mono text-base-content/70">
					{formatNumber(stats.tokens)} / {formatNumber(stats.contextWindow)}
				</span>
			</div>
			<div class="w-full bg-base-300 rounded-full h-3 overflow-hidden">
				<div
					class="h-full transition-all duration-500 ease-out rounded-full {stats.contextUsage > 90 ? 'bg-error' : stats.contextUsage > 70 ? 'bg-warning' : 'bg-primary'}"
					style="width: {Math.min(100, stats.contextUsage)}%"
				></div>
			</div>
			{#if stats.contextUsage > 80}
				<div class="mt-2 text-xs text-warning flex items-center gap-1 animate-pulse">
					<span>⚠️</span>
					<span>Approaching context limit. Consider trimming your prompt.</span>
				</div>
			{/if}
		</div>

		<!-- Cost Estimate -->
		{#if showCost && stats.cost}
			<div class="card bg-base-200 rounded-xl transition-all duration-300">
				<div class="card-body py-4">
					<div class="flex items-center justify-between">
						<h3 class="font-semibold flex items-center gap-2">
							💰 Estimated Cost
							<span class="badge badge-ghost badge-sm">approx.</span>
						</h3>
						<span class="badge {getProviderColor(stats.provider)}">{stats.provider}</span>
					</div>
					<div class="grid gap-3 sm:grid-cols-2 mt-3">
						<div class="flex items-center justify-between p-3 rounded-lg bg-base-300/50">
							<span class="text-base-content/70">Input cost</span>
							<span class="font-mono font-medium">{formatCurrency(stats.cost.inputCost)}</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-lg bg-base-300/50">
							<span class="text-base-content/70">Token price</span>
							<span class="font-mono text-sm text-base-content/60">
								${stats.inputPer1M}/1M in
							</span>
						</div>
					</div>
					<div class="text-xs text-base-content/50 mt-2">
						Prices updated: {PRICING_LAST_UPDATED}. Check provider sites for current rates.
					</div>
				</div>
			</div>
		{/if}

		<!-- Info Card -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About Token Counting</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Tokens are pieces of text that AI models process (words, subwords, or characters)</li>
					<li>• Different models have different tokenization methods</li>
					<li>• Claude/Gemini counts are approximations using similar encoding</li>
					<li>• Context window = max tokens for input + output combined</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
