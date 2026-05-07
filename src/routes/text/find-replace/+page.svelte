<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { textToolsContent } from '$lib/config/content/text-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = textToolsContent['find-replace'];

	let input = $state('');
	let findText = $state('');
	let replaceText = $state('');
	let useRegex = $state(false);
	let caseSensitive = $state(false);
	let highlightOnly = $state(false);

	const sampleInput = `The quick brown fox jumps over the lazy dog.
The quick brown fox is fast.
Foxes are clever animals.`;

	let matches = $derived.by(() => {
		if (!findText || !input) return [];
		try {
			const flags = caseSensitive ? 'g' : 'gi';
			const regex = useRegex ? new RegExp(findText, flags) : new RegExp(escapeRegex(findText), flags);
			const results: { start: number; end: number; text: string }[] = [];
			let match;
			while ((match = regex.exec(input)) !== null) {
				results.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
				if (!regex.global) break;
			}
			return results;
		} catch {
			return [];
		}
	});

	function escapeRegex(str: string): string {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function replaceAll() {
		if (!findText || highlightOnly) return;
		try {
			const flags = caseSensitive ? 'g' : 'gi';
			const regex = useRegex ? new RegExp(findText, flags) : new RegExp(escapeRegex(findText), flags);
			input = input.replace(regex, replaceText);
		} catch {
			// Invalid regex
		}
	}

	function replaceFirst() {
		if (!findText || highlightOnly) return;
		try {
			const flags = caseSensitive ? '' : 'i';
			const regex = useRegex ? new RegExp(findText, flags) : new RegExp(escapeRegex(findText), flags);
			input = input.replace(regex, replaceText);
		} catch {
			// Invalid regex
		}
	}

	let highlightedText = $derived.by(() => {
		if (!findText || !input || matches.length === 0) return input;
		let result = '';
		let lastEnd = 0;
		for (const match of matches) {
			result += escapeHtml(input.slice(lastEnd, match.start));
			result += `<mark class="bg-warning/50 px-0.5">${escapeHtml(match.text)}</mark>`;
			lastEnd = match.end;
		}
		result += escapeHtml(input.slice(lastEnd));
		return result;
	});

	function escapeHtml(str: string): string {
		return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function loadSample() {
		input = sampleInput;
		findText = 'fox';
		replaceText = 'cat';
	}

	function clearAll() {
		input = '';
		findText = '';
		replaceText = '';
	}

	let regexError = $derived.by(() => {
		if (!useRegex || !findText) return null;
		try {
			new RegExp(findText);
			return null;
		} catch (e) {
			return (e as Error).message;
		}
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={input} />

		<!-- Find/Replace Inputs -->
		<div class="grid sm:grid-cols-2 gap-4">
			<div>
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Find</label>
				<input
					type="text"
					bind:value={findText}
					placeholder={useRegex ? 'Regular expression...' : 'Text to find...'}
					class="input input-bordered w-full font-mono text-sm rounded-xl"
					class:input-error={regexError}
				/>
				{#if regexError}
					<p class="text-error text-xs mt-1">{regexError}</p>
				{/if}
			</div>
			<div>
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Replace with</label>
				<input
					type="text"
					bind:value={replaceText}
					placeholder="Replacement text..."
					class="input input-bordered w-full font-mono text-sm rounded-xl"
					disabled={highlightOnly}
				/>
			</div>
		</div>

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={useRegex} class="checkbox checkbox-sm" />
				<span class="text-sm">Use regex</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={caseSensitive} class="checkbox checkbox-sm" />
				<span class="text-sm">Case sensitive</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={highlightOnly} class="checkbox checkbox-sm" />
				<span class="text-sm">Highlight only (no replace)</span>
			</label>
		</div>

		<!-- Tool Actions -->
		<div class="flex flex-wrap gap-2">
			<button class="btn btn-primary btn-sm" onclick={replaceAll} disabled={!findText || !input || highlightOnly}>
				Replace All
			</button>
			<button class="btn btn-secondary btn-sm" onclick={replaceFirst} disabled={!findText || !input || highlightOnly}>
				Replace First
			</button>
			{#if matches.length > 0}
				<span class="badge badge-info">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
			{/if}
		</div>

		<!-- Text Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Text</h3>
			<textarea
				bind:value={input}
				placeholder="Enter or paste your text here..."
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Highlighted Preview -->
		{#if matches.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold">Preview ({matches.length} matches)</h3>
						<CopyButton text={highlightedText.replace(/<[^>]*>/g, '')} size="sm" />
					</div>
					<div class="p-4 rounded-xl bg-base-300/50 font-mono text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
						{@html highlightedText}
					</div>
				</div>
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
