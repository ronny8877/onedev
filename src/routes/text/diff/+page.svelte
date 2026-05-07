<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { textToolsContent } from '$lib/config/content/text-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = textToolsContent['diff'];

	let textA = $state('');
	let textB = $state('');
	let diffMode = $state<'word' | 'char'>('word');
	let ignoreWhitespace = $state(false);
	let ignoreCase = $state(false);

	const sampleA = `The quick brown fox jumps over the lazy dog.
This is an example of text comparison.
Some lines will remain unchanged.`;

	const sampleB = `The quick red fox leaps over the lazy dog.
This is a demo of text comparison.
Some lines will remain unchanged.`;

	interface DiffPart {
		type: 'same' | 'added' | 'removed';
		value: string;
	}

	function computeDiff(a: string, b: string): DiffPart[] {
		let strA = a;
		let strB = b;

		if (ignoreCase) {
			strA = strA.toLowerCase();
			strB = strB.toLowerCase();
		}

		if (ignoreWhitespace) {
			strA = strA.replace(/\s+/g, ' ').trim();
			strB = strB.replace(/\s+/g, ' ').trim();
		}

		const partsA = diffMode === 'word' ? strA.split(/(\s+)/) : strA.split('');
		const partsB = diffMode === 'word' ? strB.split(/(\s+)/) : strB.split('');

		const result: DiffPart[] = [];
		let i = 0, j = 0;

		while (i < partsA.length || j < partsB.length) {
			if (i >= partsA.length) {
				result.push({ type: 'added', value: partsB[j] });
				j++;
			} else if (j >= partsB.length) {
				result.push({ type: 'removed', value: partsA[i] });
				i++;
			} else if (partsA[i] === partsB[j]) {
				result.push({ type: 'same', value: partsA[i] });
				i++;
				j++;
			} else {
				let foundInB = partsB.slice(j, j + 10).indexOf(partsA[i]);
				let foundInA = partsA.slice(i, i + 10).indexOf(partsB[j]);

				if (foundInB !== -1 && (foundInA === -1 || foundInB <= foundInA)) {
					result.push({ type: 'added', value: partsB[j] });
					j++;
				} else if (foundInA !== -1) {
					result.push({ type: 'removed', value: partsA[i] });
					i++;
				} else {
					result.push({ type: 'removed', value: partsA[i] });
					result.push({ type: 'added', value: partsB[j] });
					i++;
					j++;
				}
			}
		}

		return result;
	}

	let diff = $derived(textA || textB ? computeDiff(textA, textB) : []);
	let stats = $derived({
		added: diff.filter(d => d.type === 'added').length,
		removed: diff.filter(d => d.type === 'removed').length,
		same: diff.filter(d => d.type === 'same').length
	});

	function loadSample() {
		textA = sampleA;
		textB = sampleB;
	}

	function clearAll() {
		textA = '';
		textB = '';
	}

	function swapTexts() {
		[textA, textB] = [textB, textA];
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<div class="flex items-center gap-2">
				<span class="text-sm text-base-content/70">Mode:</span>
				<div class="join">
					<button class="btn btn-sm join-item {diffMode === 'word' ? 'btn-primary' : 'btn-ghost'}" onclick={() => diffMode = 'word'}>Word</button>
					<button class="btn btn-sm join-item {diffMode === 'char' ? 'btn-primary' : 'btn-ghost'}" onclick={() => diffMode = 'char'}>Character</button>
				</div>
			</div>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={ignoreWhitespace} class="checkbox checkbox-sm" />
				<span class="text-sm">Ignore whitespace</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={ignoreCase} class="checkbox checkbox-sm" />
				<span class="text-sm">Ignore case</span>
			</label>
			<button class="btn btn-ghost btn-sm" onclick={swapTexts}>⇄ Swap</button>
		</div>

		<!-- Input Areas -->
		<div class="grid md:grid-cols-2 gap-4">
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">Original</h3>
				<textarea
					bind:value={textA}
					placeholder="Paste original text here..."
					class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-40"
					spellcheck="false"
				></textarea>
			</div>
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">Modified</h3>
				<textarea
					bind:value={textB}
					placeholder="Paste modified text here..."
					class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-40"
					spellcheck="false"
				></textarea>
			</div>
		</div>

		<!-- Stats -->
		{#if diff.length > 0}
			<div class="flex gap-4 text-sm">
				<span class="text-success"><strong>+{stats.added}</strong> added</span>
				<span class="text-error"><strong>-{stats.removed}</strong> removed</span>
				<span class="text-base-content/70"><strong>{stats.same}</strong> unchanged</span>
			</div>
		{/if}

		<!-- Diff Output -->
		{#if diff.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Differences</h3>
					<div class="p-4 rounded-xl bg-base-300/50 font-mono text-sm whitespace-pre-wrap break-words">
						{#each diff as part}
							{#if part.type === 'added'}
								<span class="bg-success/30 text-success-content px-0.5">{part.value}</span>
							{:else if part.type === 'removed'}
								<span class="bg-error/30 text-error-content px-0.5 line-through">{part.value}</span>
							{:else}
								<span>{part.value}</span>
							{/if}
						{/each}
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
