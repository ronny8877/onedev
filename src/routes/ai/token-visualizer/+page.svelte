<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { getTokens, formatNumber } from '$lib/utils/tokenizer';
	import { CHAT_MODELS, getChatModel, getTokenizerFactor, PRICING_LAST_UPDATED } from '$lib/config/ai-models';
	import type { TokenInfo } from '$lib/utils/tokenizer';
	import { aiToolsContent } from '$lib/config/content/ai-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = aiToolsContent['token-visualizer'];

	let input = $state('');
	let selectedModel = $state('gpt-5.6-terra');

	const sampleText = `Hello, world! This is a demonstration of how AI models tokenize text. Each colored block represents one token.`;

	// Alternating colors for token visualization
	const tokenColors = [
		'bg-emerald-500/25 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/40',
		'bg-sky-500/25 text-sky-300 border-sky-500/40 hover:bg-sky-500/40',
		'bg-violet-500/25 text-violet-300 border-violet-500/40 hover:bg-violet-500/40',
		'bg-amber-500/25 text-amber-300 border-amber-500/40 hover:bg-amber-500/40',
		'bg-rose-500/25 text-rose-300 border-rose-500/40 hover:bg-rose-500/40',
		'bg-cyan-500/25 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/40'
	];

	let tokens = $derived.by(() => {
		return getTokens(input, selectedModel);
	});

	let tokenizerFactor = $derived(getTokenizerFactor(selectedModel));
	let adjustedCount = $derived(Math.round(tokens.length * tokenizerFactor));
	let providerName = $derived(getChatModel(selectedModel)?.provider ?? 'openai');

	// Tooltip state
	let hoveredToken = $state<TokenInfo | null>(null);
	let tooltipPosition = $state({ x: 0, y: 0 });
	let showTooltip = $state(false);

	function loadSample() {
		input = sampleText;
	}

	function clearAll() {
		input = '';
	}

	function getTokenColor(index: number): string {
		return tokenColors[index % tokenColors.length];
	}

	function formatTokenText(text: string): string {
		// Make whitespace visible
		return text
			.replace(/\n/g, '↵\n')
			.replace(/ /g, '·')
			.replace(/\t/g, '→');
	}

	function handleMouseMove(event: MouseEvent) {
		tooltipPosition = {
			x: event.clientX + 12,
			y: event.clientY - 10
		};
	}

	function handleMouseEnter(event: MouseEvent, token: TokenInfo) {
		hoveredToken = token;
		tooltipPosition = {
			x: event.clientX + 12,
			y: event.clientY - 10
		};
		showTooltip = true;
	}

	function handleMouseLeave() {
		showTooltip = false;
		hoveredToken = null;
	}
</script>

<svelte:window onmousemove={handleMouseMove} />

<ToolWrapper
	keywords={['bpe split', 'token id leading space', 'openai bpe visualizer', 'camelcase tokens', 'not a token counter']}
	lastUpdated={PRICING_LAST_UPDATED}
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
					class="select select-bordered w-full"
				>
					{#each CHAT_MODELS as model}
						<option value={model.name}>{model.displayName}</option>
					{/each}
				</select>
			</div>
			{#if tokens.length > 0}
				<div class="flex items-center gap-2 pt-8">
					<span class="badge badge-lg badge-primary font-mono animate-pulse">{formatNumber(tokens.length)} tokens</span>
				</div>
			{/if}
		</div>

		{#if tokenizerFactor !== 1 && tokens.length > 0}
			<div class="alert bg-warning/10 border border-warning/30 text-sm">
				<AppIcon name={'🔤'} size={16} />
				<span>
					The blocks below show OpenAI's BPE tokenization. <span class="font-semibold capitalize">{providerName}</span>'s
					own tokenizer is denser — this text is closer to
					<span class="font-mono font-semibold">{formatNumber(adjustedCount)} tokens</span> on that model
					(~{Math.round((tokenizerFactor - 1) * 100)}% more).
				</span>
			</div>
		{/if}

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Enter Text</h3>
			<textarea
				bind:value={input}
				placeholder="Type or paste text to see how it gets tokenized..."
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-32 resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/30"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Token Visualization -->
		{#if tokens.length > 0}
			<div class="card bg-base-200 rounded-2xl overflow-hidden">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-semibold flex items-center gap-2">
							<AppIcon name={'🎨'} size={16} /> Token Breakdown
						</h3>
						<div class="text-sm text-base-content/60">
							Hover over tokens to see details
						</div>
					</div>
					
					<!-- Token chips -->
					<div class="flex flex-wrap gap-1 font-mono text-sm leading-relaxed">
						{#each tokens as token, i}
							<button
								type="button"
								class="px-1.5 py-0.5 rounded border transition-all duration-200 cursor-default transform hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg {getTokenColor(i)}"
								onmouseenter={(e) => handleMouseEnter(e, token)}
								onmouseleave={handleMouseLeave}
							>
								<span class="whitespace-pre">{formatTokenText(token.text)}</span>
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- Statistics -->
			<div class="grid gap-4 sm:grid-cols-3">
				<div class="card bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]">
					<div class="text-sm text-base-content/60">Total Tokens</div>
					<div class="text-2xl font-bold font-mono text-primary">{formatNumber(tokens.length)}</div>
				</div>
				<div class="card bg-base-200 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]">
					<div class="text-sm text-base-content/60">Total Characters</div>
					<div class="text-2xl font-bold font-mono">{formatNumber(input.length)}</div>
				</div>
				<div class="card bg-base-200 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02]">
					<div class="text-sm text-base-content/60">Avg Chars/Token</div>
					<div class="text-2xl font-bold font-mono">
						{tokens.length > 0 ? (input.length / tokens.length).toFixed(2) : '0'}
					</div>
				</div>
			</div>
		{:else if input}
			<div class="text-center py-8 text-base-content/50">
				<div class="loading loading-dots loading-lg"></div>
				<div class="mt-2">Processing...</div>
			</div>
		{:else}
			<div class="text-center py-12 text-base-content/50 border-2 border-dashed border-base-300 rounded-2xl">
				<AppIcon name={'✨'} size={32} />
				<div>Enter text above to see how it tokenizes</div>
			</div>
		{/if}

		<!-- Educational Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">How this encoding splits text</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Not a token counter.</strong> The colors are cuts. The number is a side effect.</li>
					<li>• <code>"Hello"</code> and <code>" Hello"</code> are different ids. The space is fused.</li>
					<li>• Claude/Gemini rows scale the count. The blocks are still OpenAI BPE.</li>
					<li>• CamelCase, digits, CJK, and emoji fragment. English words often do not.</li>
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
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>

<!-- Floating Tooltip (follows mouse cursor) -->
{#if showTooltip && hoveredToken}
	<div 
		class="fixed z-50 pointer-events-none animate-in fade-in duration-100"
		style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px; transform: translateY(-100%);"
	>
		<div class="bg-base-300 border border-base-content/20 rounded-lg shadow-xl p-3 font-mono text-sm max-w-xs">
			<div class="grid gap-1.5">
				<div class="flex items-center justify-between gap-4">
					<span class="text-base-content/60 text-xs">Token ID</span>
					<span class="font-bold text-primary">{hoveredToken.id}</span>
				</div>
				<div class="flex items-center justify-between gap-4">
					<span class="text-base-content/60 text-xs">Characters</span>
					<span>{hoveredToken.text.length}</span>
				</div>
				<div class="flex items-center justify-between gap-4">
					<span class="text-base-content/60 text-xs">Position</span>
					<span>{hoveredToken.startIndex}–{hoveredToken.endIndex}</span>
				</div>
			</div>
			<div class="mt-2 pt-2 border-t border-base-content/10">
				<div class="text-base-content/60 text-xs mb-1">Raw text:</div>
				<code class="block px-2 py-1 rounded bg-base-content/10 text-xs break-all">{JSON.stringify(hoveredToken.text)}</code>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from { opacity: 0; transform: translateY(-90%); }
		to { opacity: 1; transform: translateY(-100%); }
	}
	.animate-in {
		animation: fade-in 0.1s ease-out forwards;
	}
</style>
