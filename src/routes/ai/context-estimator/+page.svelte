<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { countTokens, getModelConfig } from '$lib/utils/tokenizer';
	import { CHAT_MODELS, formatNumber, getContextUsage } from '$lib/config/ai-models';

	let systemMessage = $state('');
	let userPrompt = $state('');
	let chatHistory = $state('');
	let selectedModel = $state('gpt-4o');

	const sampleData = {
		system: `You are a helpful AI assistant. You are polite, concise, and always try to provide accurate information. You should refuse to answer harmful or unethical questions.`,
		prompt: `Can you explain how neural networks work in simple terms?`,
		history: `User: Hi there!
Assistant: Hello! How can I help you today?
User: I'm learning about AI.
Assistant: That's great! AI is a fascinating field. What aspect would you like to learn about?`
	};

	let stats = $derived.by(() => {
		const model = getModelConfig(selectedModel);
		
		const systemTokens = countTokens(systemMessage, selectedModel);
		const promptTokens = countTokens(userPrompt, selectedModel);
		const historyTokens = countTokens(chatHistory, selectedModel);
		
		// Add overhead for message formatting (approximately 4 tokens per message)
		const messageCount = (systemMessage ? 1 : 0) + (userPrompt ? 1 : 0) + 
			(chatHistory ? chatHistory.split('\n').filter(l => l.trim().startsWith('User:') || l.trim().startsWith('Assistant:')).length : 0);
		const overhead = messageCount * 4;
		
		const totalTokens = systemTokens + promptTokens + historyTokens + overhead;
		const remainingTokens = Math.max(0, model.contextWindow - totalTokens);
		const recommendedResponse = Math.min(model.maxOutput, Math.floor(remainingTokens * 0.8));
		const contextUsage = getContextUsage(totalTokens, selectedModel);

		return {
			systemTokens,
			promptTokens,
			historyTokens,
			overhead,
			totalTokens,
			remainingTokens,
			recommendedResponse,
			contextWindow: model.contextWindow,
			maxOutput: model.maxOutput,
			contextUsage
		};
	});

	function loadSample() {
		systemMessage = sampleData.system;
		userPrompt = sampleData.prompt;
		chatHistory = sampleData.history;
	}

	function clearAll() {
		systemMessage = '';
		userPrompt = '';
		chatHistory = '';
	}
</script>

<ToolWrapper
	keywords={['context window', 'token budget', 'LLM context', 'prompt tokens', 'AI context limit']}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Model Selector -->
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
						{model.displayName} ({formatNumber(model.contextWindow)} context)
					</option>
				{/each}
			</select>
		</div>

		<!-- Input Sections -->
		<div class="grid gap-4 lg:grid-cols-3">
			<!-- System Message -->
			<div class="card bg-base-200 rounded-xl transition-all duration-300 hover:shadow-md">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-medium flex items-center gap-2">
							<span class="text-lg">⚙️</span> System Message
						</h3>
						<span class="badge badge-ghost font-mono text-xs">
							{formatNumber(stats.systemTokens)} tokens
						</span>
					</div>
					<textarea
						bind:value={systemMessage}
						placeholder="Enter your system prompt..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-lg h-32 resize-y transition-all duration-200 focus:ring-2 focus:ring-blue-500/30"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- User Prompt -->
			<div class="card bg-base-200 rounded-xl transition-all duration-300 hover:shadow-md">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-medium flex items-center gap-2">
							<span class="text-lg">💬</span> User Prompt
						</h3>
						<span class="badge badge-ghost font-mono text-xs">
							{formatNumber(stats.promptTokens)} tokens
						</span>
					</div>
					<textarea
						bind:value={userPrompt}
						placeholder="Enter the current user message..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-lg h-32 resize-y transition-all duration-200 focus:ring-2 focus:ring-green-500/30"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Chat History -->
			<div class="card bg-base-200 rounded-xl transition-all duration-300 hover:shadow-md">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-medium flex items-center gap-2">
							<span class="text-lg">📜</span> Chat History
						</h3>
						<span class="badge badge-ghost font-mono text-xs">
							{formatNumber(stats.historyTokens)} tokens
						</span>
					</div>
					<textarea
						bind:value={chatHistory}
						placeholder="Paste previous conversation...&#10;User: ...&#10;Assistant: ..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-lg h-32 resize-y transition-all duration-200 focus:ring-2 focus:ring-purple-500/30"
						spellcheck="false"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Token Summary -->
		<div class="card bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl">
			<div class="card-body py-5">
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<!-- Total Used -->
					<div class="text-center transition-all duration-300 hover:scale-105">
						<div class="text-sm text-base-content/60 mb-1">Total Used</div>
						<div class="text-3xl font-bold font-mono text-primary">
							{formatNumber(stats.totalTokens)}
						</div>
						<div class="text-xs text-base-content/50 mt-1">
							+{stats.overhead} overhead
						</div>
					</div>

					<!-- Remaining -->
					<div class="text-center transition-all duration-300 hover:scale-105">
						<div class="text-sm text-base-content/60 mb-1">Remaining</div>
						<div class="text-3xl font-bold font-mono {stats.remainingTokens < 1000 ? 'text-error' : stats.remainingTokens < 5000 ? 'text-warning' : 'text-success'}">
							{formatNumber(stats.remainingTokens)}
						</div>
						<div class="text-xs text-base-content/50 mt-1">
							for response
						</div>
					</div>

					<!-- Recommended Response -->
					<div class="text-center transition-all duration-300 hover:scale-105">
						<div class="text-sm text-base-content/60 mb-1">Safe Response</div>
						<div class="text-3xl font-bold font-mono">
							{formatNumber(stats.recommendedResponse)}
						</div>
						<div class="text-xs text-base-content/50 mt-1">
							max: {formatNumber(stats.maxOutput)}
						</div>
					</div>

					<!-- Usage -->
					<div class="text-center transition-all duration-300 hover:scale-105">
						<div class="text-sm text-base-content/60 mb-1">Usage</div>
						<div class="text-3xl font-bold font-mono {stats.contextUsage > 90 ? 'text-error' : stats.contextUsage > 70 ? 'text-warning' : ''}">
							{stats.contextUsage.toFixed(1)}%
						</div>
						<div class="text-xs text-base-content/50 mt-1">
							of context
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Context Usage Bar -->
		<div class="card bg-base-200 rounded-xl p-4">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm font-medium">Context Window</span>
				<span class="text-sm font-mono text-base-content/70">
					{formatNumber(stats.totalTokens)} / {formatNumber(stats.contextWindow)}
				</span>
			</div>
			<div class="w-full bg-base-300 rounded-full h-4 overflow-hidden flex">
				{#if stats.systemTokens > 0}
					<div
						class="h-full bg-blue-500 transition-all duration-500"
						style="width: {(stats.systemTokens / stats.contextWindow) * 100}%"
						title="System: {formatNumber(stats.systemTokens)}"
					></div>
				{/if}
				{#if stats.historyTokens > 0}
					<div
						class="h-full bg-purple-500 transition-all duration-500"
						style="width: {(stats.historyTokens / stats.contextWindow) * 100}%"
						title="History: {formatNumber(stats.historyTokens)}"
					></div>
				{/if}
				{#if stats.promptTokens > 0}
					<div
						class="h-full bg-green-500 transition-all duration-500"
						style="width: {(stats.promptTokens / stats.contextWindow) * 100}%"
						title="Prompt: {formatNumber(stats.promptTokens)}"
					></div>
				{/if}
			</div>
			<div class="flex gap-4 mt-2 text-xs text-base-content/60">
				<span class="flex items-center gap-1">
					<span class="w-3 h-3 rounded bg-blue-500"></span> System
				</span>
				<span class="flex items-center gap-1">
					<span class="w-3 h-3 rounded bg-purple-500"></span> History
				</span>
				<span class="flex items-center gap-1">
					<span class="w-3 h-3 rounded bg-green-500"></span> Prompt
				</span>
			</div>
		</div>

		<!-- Warnings -->
		{#if stats.contextUsage > 80}
			<div class="alert alert-warning animate-pulse">
				<span>⚠️</span>
				<span>Context usage is high ({stats.contextUsage.toFixed(0)}%). Consider summarizing chat history or reducing system prompt.</span>
			</div>
		{/if}

		{#if stats.remainingTokens < stats.maxOutput}
			<div class="alert alert-info">
				<span>ℹ️</span>
				<span>Response may be truncated. Only {formatNumber(stats.remainingTokens)} tokens available, but model can output up to {formatNumber(stats.maxOutput)}.</span>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">About Context Windows</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Context window = maximum tokens for input + output combined</li>
					<li>• Message formatting adds ~4 tokens overhead per message</li>
					<li>• Leave headroom for the model's response</li>
					<li>• Longer contexts may increase latency and cost</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
