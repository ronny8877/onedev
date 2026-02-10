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

	const content = textToolsContent['string-compare'];

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
		const originalA = a;
		const originalB = b;

		if (ignoreCase) {
			strA = strA.toLowerCase();
			strB = strB.toLowerCase();
		}

		if (ignoreWhitespace) {
			strA = strA.replace(/\s+/g, ' ').trim();
			strB = strB.replace(/\s+/g, ' ').trim();
		}

		// Split based on mode
		// For word mode, we split by whitespace but keep delimiters to preserve spacing in output
		// However, for pure string comparison, user might want to see specific word changes
		const partsA = diffMode === 'word' ? strA.split(/(\s+)/) : strA.split('');
		const partsB = diffMode === 'word' ? strB.split(/(\s+)/) : strB.split('');

		const result: DiffPart[] = [];
		
		// Simple LCS (Longest Common Subsequence) based diff approach
		// We'll use a simple greedy approach for now or a basic patience diff if needed
		// details: this is a simple O(N*M) or similar diff algorithm
		
		// Let's use a standard diff algorithm approach
		const matrix: number[][] = [];
		for (let i = 0; i <= partsA.length; i++) {
			matrix[i] = new Array(partsB.length + 1).fill(0);
		}

		for (let i = 1; i <= partsA.length; i++) {
			for (let j = 1; j <= partsB.length; j++) {
				if (partsA[i - 1] === partsB[j - 1]) {
					matrix[i][j] = matrix[i - 1][j - 1] + 1;
				} else {
					matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
				}
			}
		}

		let i = partsA.length;
		let j = partsB.length;
		const tempResult: DiffPart[] = [];

		while (i > 0 || j > 0) {
			if (i > 0 && j > 0 && partsA[i - 1] === partsB[j - 1]) {
				tempResult.unshift({ type: 'same', value: partsA[i - 1] });
				i--;
				j--;
			} else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
				tempResult.unshift({ type: 'added', value: partsB[j - 1] });
				j--;
			} else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
				tempResult.unshift({ type: 'removed', value: partsA[i - 1] });
				i--;
			}
		}
		
		return tempResult;
	}

	let diff = $derived(textA || textB ? computeDiff(textA, textB) : []);
	
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
				<h3 class="text-sm font-medium text-base-content/70 mb-2">Original String</h3>
				<textarea
					bind:value={textA}
					placeholder="Paste original string here..."
					class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-32"
					spellcheck="false"
				></textarea>
			</div>
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2">Modified String</h3>
				<textarea
					bind:value={textB}
					placeholder="Paste modified string here..."
					class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-32"
					spellcheck="false"
				></textarea>
			</div>
		</div>

		<!-- Diff Output -->
		{#if diff.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Comparison Result</h3>
					<div class="p-4 rounded-xl bg-base-300/50 font-mono text-sm whitespace-pre-wrap wrap-break-word leading-relaxed">
						{#each diff as part}
							{#if part.type === 'added'}
								<span class="bg-success/30 text-success-content px-1 rounded mx-0.5 border-b-2 border-success">{part.value}</span>
							{:else if part.type === 'removed'}
								<span class="bg-error/30 text-error-content px-1 rounded mx-0.5 line-through decoration-error/50 opacity-70">{part.value}</span>
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
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
