<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { countTokens, trimToTokenLimit } from '$lib/utils/tokenizer';
	import { CHAT_MODELS, formatNumber, PRICING_LAST_UPDATED } from '$lib/config/ai-models';
	import type { TrimMode } from '$lib/utils/tokenizer';
	import { aiToolsContent } from '$lib/config/content/ai-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = aiToolsContent['prompt-trimmer'];

	let input = $state('');
	let targetTokens = $state(1000);
	let selectedModel = $state('gpt-5.6-terra');
	let trimMode = $state<TrimMode>('sentence');
	let trimFromEnd = $state(true);

	const sampleText = `Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence displayed by humans or other animals. Example tasks in which this is done include speech recognition, computer vision, and translation between languages.

AI research has been defined as the field of study of intelligent agents. An intelligent agent is a system that perceives its environment and takes actions that maximize its chances of achieving its goals. The term artificial intelligence was coined in 1956.

Modern AI techniques have become pervasive and are too numerous to list. Frequently, when a technique reaches mainstream use, it is no longer considered artificial intelligence; this phenomenon is described as the AI effect.

High-profile applications of AI include advanced web search engines, recommendation systems, understanding human speech, self-driving cars, automated decision-making, and competing at the highest level in strategic games.`;

	let result = $derived.by(() => {
		if (!input) return null;
		return trimToTokenLimit(input, targetTokens, selectedModel, trimMode, trimFromEnd);
	});

	let inputTokens = $derived(countTokens(input, selectedModel));

	function loadSample() {
		input = sampleText;
	}

	function clearAll() {
		input = '';
	}

	function applyTrimmed() {
		if (result) {
			input = result.trimmed;
		}
	}
</script>

<ToolWrapper
	keywords={['prompt trimmer', 'token limit', 'text trimmer', 'LLM prompt limit', 'truncate text']}
	lastUpdated={PRICING_LAST_UPDATED}
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Settings Row -->
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<!-- Model -->
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
						<option value={model.name}>{model.displayName}</option>
					{/each}
				</select>
			</div>

			<!-- Target Tokens -->
			<div>
				<label class="label" for="target-tokens">
					<span class="label-text font-medium">Target Tokens</span>
				</label>
				<input
					id="target-tokens"
					type="number"
					bind:value={targetTokens}
					min="1"
					max="1000000"
					class="input input-bordered w-full font-mono transition-all duration-200"
				/>
			</div>

			<!-- Trim Mode -->
			<div>
				<label class="label" for="trim-mode">
					<span class="label-text font-medium">Trim Mode</span>
				</label>
				<select
					id="trim-mode"
					bind:value={trimMode}
					class="select select-bordered w-full transition-all duration-200"
				>
					<option value="hard">Hard cut (exact)</option>
					<option value="sentence">Sentence-aware</option>
					<option value="paragraph">Paragraph-aware</option>
				</select>
			</div>

			<!-- Direction -->
			<div>
				<label class="label" for="trim-direction">
					<span class="label-text font-medium">Trim From</span>
				</label>
				<select
					id="trim-direction"
					bind:value={trimFromEnd}
					class="select select-bordered w-full transition-all duration-200"
				>
					<option value={true}>End (keep start)</option>
					<option value={false}>Start (keep end)</option>
				</select>
			</div>
		</div>

		<!-- Quick presets -->
		<div class="flex flex-wrap gap-2">
			<span class="text-sm text-base-content/60">Quick presets:</span>
			<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => targetTokens = 500}>500</button>
			<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => targetTokens = 1000}>1K</button>
			<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => targetTokens = 2000}>2K</button>
			<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => targetTokens = 4000}>4K</button>
			<button type="button" class="btn btn-xs btn-ghost transition-all hover:scale-105" onclick={() => targetTokens = 8000}>8K</button>
		</div>

		<!-- Input -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Input Text</h3>
				<span class="badge {inputTokens > targetTokens ? 'badge-error' : 'badge-success'} font-mono transition-all duration-300">
					{formatNumber(inputTokens)} tokens
				</span>
			</div>
			<textarea
				bind:value={input}
				placeholder="Paste or type text to trim..."
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-40 resize-y transition-all duration-200 focus:ring-2 focus:ring-primary/30"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Result -->
		{#if result}
			<div class="grid gap-4 lg:grid-cols-2">
				<!-- Trimmed Output -->
				<div class="card bg-base-200 rounded-xl transition-all duration-300 hover:shadow-md">
					<div class="card-body py-4">
						<div class="flex items-center justify-between mb-2">
							<h3 class="font-medium flex items-center gap-2">
								✂️ Trimmed Result
							</h3>
							<span class="badge badge-success font-mono">
								{formatNumber(result.trimmedTokens)} tokens
							</span>
						</div>
						<div class="bg-base-300 rounded-lg p-3 font-mono text-sm max-h-48 overflow-auto whitespace-pre-wrap">
							{result.trimmed || '(empty)'}
						</div>
						<div class="flex gap-2 mt-3">
							<CopyButton text={result.trimmed} label="Copy" size="sm" />
							<button 
								type="button" 
								class="btn btn-sm btn-primary transition-all duration-200 hover:scale-105"
								onclick={applyTrimmed}
							>
								Apply to Input
							</button>
						</div>
					</div>
				</div>

				<!-- Removed Content -->
				<div class="card bg-base-200 rounded-xl transition-all duration-300 hover:shadow-md">
					<div class="card-body py-4">
						<div class="flex items-center justify-between mb-2">
							<h3 class="font-medium flex items-center gap-2 text-error/80">
								🗑️ Removed
							</h3>
							<span class="badge badge-error font-mono">
								{formatNumber(result.originalTokens - result.trimmedTokens)} tokens
							</span>
						</div>
						<div class="bg-error/10 border border-error/20 rounded-lg p-3 font-mono text-sm max-h-48 overflow-auto whitespace-pre-wrap text-error/70">
							{result.removed || '(nothing removed)'}
						</div>
					</div>
				</div>
			</div>

			<!-- Summary -->
			<div class="flex flex-wrap gap-4 p-4 bg-base-200 rounded-xl transition-all duration-300">
				<div class="flex items-center gap-2">
					<span class="text-base-content/60">Original:</span>
					<span class="font-mono font-medium">{formatNumber(result.originalTokens)} tokens</span>
				</div>
				<AppIcon name="arrow-right" size={16} />
				<div class="flex items-center gap-2">
					<span class="text-base-content/60">Trimmed:</span>
					<span class="font-mono font-medium text-success">{formatNumber(result.trimmedTokens)} tokens</span>
				</div>
				<span class="text-base-content/30">|</span>
				<div class="flex items-center gap-2">
					<span class="text-base-content/60">Saved:</span>
					<span class="font-mono font-medium text-error">{formatNumber(result.originalTokens - result.trimmedTokens)} tokens</span>
					<span class="text-base-content/50">({((1 - result.trimmedTokens / result.originalTokens) * 100).toFixed(1)}%)</span>
				</div>
			</div>
		{:else if input}
			<div class="text-center py-8">
				<div class="badge badge-success badge-lg font-mono animate-pulse">
					✓ Already within {formatNumber(targetTokens)} token limit
				</div>
			</div>
		{:else}
			<div class="text-center py-12 text-base-content/50 border-2 border-dashed border-base-300 rounded-2xl">
				<AppIcon name="scissors" size={32} />
				<div>Enter text above to trim</div>
			</div>
		{/if}

		<!-- Trim modes explanation -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Trim Modes</h4>
				<div class="mt-2 grid gap-2 sm:grid-cols-3 text-sm">
					<div class="p-3 rounded-lg bg-base-300/50 transition-all duration-200 hover:bg-base-300">
						<div class="font-medium">Hard Cut</div>
						<div class="text-base-content/60 text-xs mt-1">Cuts exactly at token boundary. May break mid-word.</div>
					</div>
					<div class="p-3 rounded-lg bg-base-300/50 transition-all duration-200 hover:bg-base-300">
						<div class="font-medium">Sentence-Aware</div>
						<div class="text-base-content/60 text-xs mt-1">Keeps complete sentences. Cleaner output.</div>
					</div>
					<div class="p-3 rounded-lg bg-base-300/50 transition-all duration-200 hover:bg-base-300">
						<div class="font-medium">Paragraph-Aware</div>
						<div class="text-base-content/60 text-xs mt-1">Keeps complete paragraphs. Best for structured text.</div>
					</div>
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
