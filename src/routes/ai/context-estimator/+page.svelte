<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { countTokens, getModelConfig } from '$lib/utils/tokenizer';
	import { aiToolsContent } from '$lib/config/content/ai-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';

	const content = aiToolsContent['context-estimator'];
	import { CHAT_MODELS, formatNumber, getContextUsage } from '$lib/config/ai-models';

	let systemMessage = $state('');
	let userPrompt = $state('');
	let chatHistory = $state('');
	let selectedModel = $state('gpt-4o');
	
	let customContextWindow = $state(128000);
	let customMaxOutput = $state(8192);

	const sampleData = {
		system: `You are a helpful AI assistant. You are polite, concise, and always try to provide accurate information. You should refuse to answer harmful or unethical questions.`,
		prompt: `Can you explain how neural networks work in simple terms?`,
		history: `User: Hi there!\nAssistant: Hello! How can I help you today?\nUser: I'm learning about AI.\nAssistant: That's great! AI is a fascinating field. What aspect would you like to learn about?`
	};

	$effect(() => {
		if (selectedModel !== 'custom') {
			const m = getModelConfig(selectedModel);
			customContextWindow = m.contextWindow;
			customMaxOutput = m.maxOutput;
		}
	});

	let stats = $derived.by(() => {
		const isCustom = selectedModel === 'custom';
		const model = { contextWindow: customContextWindow, maxOutput: customMaxOutput };
		
		const systemTokens = countTokens(systemMessage, isCustom ? 'gpt-4o' : selectedModel);
		const promptTokens = countTokens(userPrompt, isCustom ? 'gpt-4o' : selectedModel);
		const historyTokens = countTokens(chatHistory, isCustom ? 'gpt-4o' : selectedModel);
		
		// Add overhead for message formatting (approximately 4 tokens per message)
		const messageCount = (systemMessage ? 1 : 0) + (userPrompt ? 1 : 0) + 
			(chatHistory ? chatHistory.split('\n').filter(l => l.trim().startsWith('User:') || l.trim().startsWith('Assistant:')).length : 0);
		const overhead = messageCount * 4;
		
		const totalTokens = systemTokens + promptTokens + historyTokens + overhead;
		const remainingTokens = Math.max(0, model.contextWindow - totalTokens);
		const recommendedResponse = Math.min(model.maxOutput, Math.floor(remainingTokens * 0.8));
		
		const contextUsage = Math.min(100, (totalTokens / model.contextWindow) * 100);

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

		<!-- Model Configuration -->
		<div class="card bg-base-200/50 backdrop-blur-md border border-base-content/10 shadow-sm rounded-2xl p-6">
			<div class="flex flex-col lg:flex-row gap-8 items-start">
				<!-- Preset Dropdown -->
				<div class="flex-1 w-full">
					<label class="label pt-0 pb-2" for="model-select">
						<span class="label-text font-semibold text-base flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
							AI Model Presets
						</span>
					</label>
					<select
						id="model-select"
						bind:value={selectedModel}
						class="select select-bordered select-lg w-full transition-all duration-200 bg-base-100 shadow-sm hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
					>
						<optgroup label="Presets">
							{#each CHAT_MODELS as model}
								<option value={model.name}>
									{model.displayName} - {formatNumber(model.contextWindow)} context
								</option>
							{/each}
						</optgroup>
						<optgroup label="Custom">
							<option value="custom">Custom Configuration...</option>
						</optgroup>
					</select>
					<p class="text-sm text-base-content/60 mt-3 px-1">Select a model to auto-fill the constraints, or enter custom ones for local LLMs.</p>
				</div>

				<div class="hidden lg:block w-px h-24 bg-base-content/10 mt-6 pt-2"></div>
				<div class="block lg:hidden h-px w-full bg-base-content/10"></div>

				<!-- Custom Inputs (Always Visible) -->
				<div class="flex-[1.5] w-full">
					<div class="grid sm:grid-cols-2 gap-5 mt-auto">
						<div class="form-control">
							<label class="text-xs font-bold text-base-content/70 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2" for="custom-context">
								<div class="w-2 h-2 rounded-full bg-primary/70"></div> Total Context Limit
							</label>
							<label class="input input-bordered input-lg flex items-center gap-3 bg-base-100 shadow-sm hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
								<input
									id="custom-context"
									type="number"
									min="1"
									step="1000"
									bind:value={customContextWindow}
									oninput={() => selectedModel = 'custom'}
									class="grow font-mono"
								/>
								<span class="badge badge-primary badge-sm font-mono opacity-80 pointer-events-none">tokens</span>
							</label>
						</div>
						<div class="form-control">
							<label class="text-xs font-bold text-base-content/70 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2" for="custom-output">
								<div class="w-2 h-2 rounded-full bg-secondary/70"></div> Maximum Output
							</label>
							<label class="input input-bordered input-lg flex items-center gap-3 bg-base-100 shadow-sm hover:border-secondary/50 focus-within:ring-2 focus-within:ring-secondary/20 focus-within:border-secondary transition-all">
								<input
									id="custom-output"
									type="number"
									min="1"
									step="1000"
									bind:value={customMaxOutput}
									oninput={() => selectedModel = 'custom'}
									class="grow font-mono"
								/>
								<span class="badge badge-secondary badge-sm font-mono opacity-80 pointer-events-none">tokens</span>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Input Sections (Bento Grid) -->
		<div class="grid gap-6 lg:grid-cols-3">
			<!-- System Message -->
			<div class="card bg-base-200/50 backdrop-blur-md border border-base-content/10 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-blue-500/30 group">
				<div class="card-body py-5 px-5">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2 text-base">
							<div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-lg shadow-sm">⚙️</div>
							System Message
						</h3>
						<span class="badge badge-ghost font-mono text-xs border-base-content/20 group-hover:border-blue-500/30 transition-colors">
							{formatNumber(stats.systemTokens)} tokens
						</span>
					</div>
					<textarea
						bind:value={systemMessage}
						placeholder="Enter your system prompt..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-36 resize-y transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 bg-base-100/80"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- User Prompt -->
			<div class="card bg-base-200/50 backdrop-blur-md border border-base-content/10 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-green-500/30 group">
				<div class="card-body py-5 px-5">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2 text-base">
							<div class="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center text-lg shadow-sm">💬</div>
							User Prompt
						</h3>
						<span class="badge badge-ghost font-mono text-xs border-base-content/20 group-hover:border-green-500/30 transition-colors">
							{formatNumber(stats.promptTokens)} tokens
						</span>
					</div>
					<textarea
						bind:value={userPrompt}
						placeholder="Enter the current user message..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-36 resize-y transition-all duration-200 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 bg-base-100/80"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Chat History -->
			<div class="card bg-base-200/50 backdrop-blur-md border border-base-content/10 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md hover:border-purple-500/30 group">
				<div class="card-body py-5 px-5">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2 text-base">
							<div class="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center text-lg shadow-sm">📜</div>
							Chat History
						</h3>
						<span class="badge badge-ghost font-mono text-xs border-base-content/20 group-hover:border-purple-500/30 transition-colors">
							{formatNumber(stats.historyTokens)} tokens
						</span>
					</div>
					<textarea
						bind:value={chatHistory}
						placeholder="Paste previous conversation...&#10;User: ...&#10;Assistant: ..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-36 resize-y transition-all duration-200 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 bg-base-100/80"
						spellcheck="false"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Token Summary Dashboard -->
		<div class="card bg-base-200/50 backdrop-blur-md border border-base-content/10 shadow-sm rounded-2xl overflow-hidden mt-2">
			<div class="card-body p-6 md:p-8 relative z-10">
				<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-base-content/10">
					<!-- Total Used -->
					<div class="flex flex-col items-center justify-center pt-4 sm:pt-0 transition-all duration-300 hover:scale-[1.02] group">
						<div class="text-sm font-medium text-base-content/70 mb-2 uppercase tracking-wider flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary/70 group-hover:text-primary transition-colors"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
							Total Used
						</div>
						<div class="text-4xl font-black font-mono text-base-content drop-shadow-sm">
							{formatNumber(stats.totalTokens)}
						</div>
						<div class="badge badge-ghost badge-sm mt-3 font-mono opacity-80 border-base-content/20">
							+{stats.overhead} overhead
						</div>
					</div>

					<!-- Remaining -->
					<div class="flex flex-col items-center justify-center pt-6 sm:pt-0 transition-all duration-300 hover:scale-[1.02] group">
						<div class="text-sm font-medium text-base-content/70 mb-2 uppercase tracking-wider flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="{stats.remainingTokens < 1000 ? 'text-error/70 group-hover:text-error' : stats.remainingTokens < 5000 ? 'text-warning/70 group-hover:text-warning' : 'text-success/70 group-hover:text-success'} transition-colors"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M12 8v4l3 3"/></svg>
							Remaining
						</div>
						<div class="text-4xl font-black font-mono drop-shadow-sm {stats.remainingTokens < 1000 ? 'text-error' : stats.remainingTokens < 5000 ? 'text-warning' : 'text-success'}">
							{formatNumber(stats.remainingTokens)}
						</div>
						<div class="text-xs font-semibold text-base-content/50 mt-3 uppercase tracking-wider">
							Safe Budget
						</div>
					</div>

					<!-- Recommended Response -->
					<div class="flex flex-col items-center justify-center pt-6 sm:pt-0 transition-all duration-300 hover:scale-[1.02] group">
						<div class="text-sm font-medium text-base-content/70 mb-2 uppercase tracking-wider flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-base-content/50 group-hover:text-base-content/80 transition-colors"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
							Max Output
						</div>
						<div class="text-4xl font-black font-mono text-base-content drop-shadow-sm">
							{formatNumber(stats.recommendedResponse)}
						</div>
						<div class="text-xs font-semibold text-base-content/50 mt-3 uppercase tracking-wider">
							Limit: {formatNumber(stats.maxOutput)}
						</div>
					</div>

					<!-- Usage -->
					<div class="flex flex-col items-center justify-center pt-6 sm:pt-0 transition-all duration-300 hover:scale-[1.02] group">
						<div class="text-sm font-medium text-base-content/70 mb-2 uppercase tracking-wider flex items-center gap-1.5">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-base-content/50 group-hover:text-base-content/80 transition-colors"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
							Window Used
						</div>
						<div class="text-4xl font-black font-mono drop-shadow-sm {stats.contextUsage > 90 ? 'text-error' : stats.contextUsage > 70 ? 'text-warning' : 'text-base-content'}">
							{stats.contextUsage.toFixed(1)}%
						</div>
						<div class="text-xs font-semibold text-base-content/50 mt-3 uppercase tracking-wider">
							Capacity
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Context Usage Glow Bar -->
		<div class="card bg-base-200/50 backdrop-blur-md border border-base-content/10 shadow-sm rounded-2xl p-6">
			<div class="flex items-center justify-between mb-4">
				<span class="text-base font-semibold flex items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
					Context Capacity
				</span>
				<span class="text-sm font-bold font-mono px-3 py-1 bg-base-100 rounded-lg border border-base-content/10">
					{formatNumber(stats.totalTokens)} <span class="text-base-content/40 mx-1">/</span> {formatNumber(stats.contextWindow)}
				</span>
			</div>
			
			<div class="w-full bg-base-300/50 rounded-full h-5 overflow-hidden flex ring-1 ring-base-content/5 shadow-inner relative">
				<div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmZiZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50"></div>
				
				{#if stats.systemTokens > 0}
					<div
						class="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-700 ease-out"
						style="width: {(stats.systemTokens / stats.contextWindow) * 100}%"
						title="System: {formatNumber(stats.systemTokens)}"
					></div>
				{/if}
				{#if stats.historyTokens > 0}
					<div
						class="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-700 ease-out"
						style="width: {(stats.historyTokens / stats.contextWindow) * 100}%"
						title="History: {formatNumber(stats.historyTokens)}"
					></div>
				{/if}
				{#if stats.promptTokens > 0}
					<div
						class="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-700 ease-out"
						style="width: {(stats.promptTokens / stats.contextWindow) * 100}%"
						title="Prompt: {formatNumber(stats.promptTokens)}"
					></div>
				{/if}
			</div>
			
			<div class="flex flex-wrap gap-6 mt-4 justify-center sm:justify-start">
				<div class="flex items-center gap-2 group cursor-default">
					<div class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] group-hover:scale-125 transition-transform"></div> 
					<span class="text-sm font-medium text-base-content/80 group-hover:text-base-content transition-colors">System</span>
				</div>
				<div class="flex items-center gap-2 group cursor-default">
					<div class="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] group-hover:scale-125 transition-transform"></div> 
					<span class="text-sm font-medium text-base-content/80 group-hover:text-base-content transition-colors">History</span>
				</div>
				<div class="flex items-center gap-2 group cursor-default">
					<div class="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] group-hover:scale-125 transition-transform"></div> 
					<span class="text-sm font-medium text-base-content/80 group-hover:text-base-content transition-colors">Prompt</span>
				</div>
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
		<div class="card bg-base-200/50 backdrop-blur-md border border-base-content/10 shadow-sm rounded-2xl">
			<div class="card-body py-5 px-6">
				<h4 class="text-sm font-bold flex items-center gap-2 mb-3">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
					About Context Windows
				</h4>
				<ul class="space-y-2 text-sm text-base-content/80">
					<li class="flex items-start gap-2">
						<span class="text-primary/70 mt-1">•</span>
						<span><strong class="font-medium text-base-content">Context window</strong> represents the maximum sum of input tokens + output tokens a model can handle in one request.</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary/70 mt-1">•</span>
						<span><strong class="font-medium text-base-content">Message formatting</strong> (such as conversational headers) adds approximately 4 tokens overhead per message behind the scenes.</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary/70 mt-1">•</span>
						<span>Always leave sufficient headroom for the model's <strong class="font-medium text-base-content">Max Output</strong> generation.</span>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary/70 mt-1">•</span>
						<span>Longer contexts may increase latency and API token costs proportionally.</span>
					</li>
				</ul>
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
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
