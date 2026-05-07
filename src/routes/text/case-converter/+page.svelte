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

	const content = textToolsContent['case-converter'];

	let input = $state('');
	let selectedCase = $state('camelCase');

	const sampleInput = 'getUserProfileData';

	const cases = [
		{ id: 'camelCase', name: 'camelCase', example: 'myVariableName' },
		{ id: 'PascalCase', name: 'PascalCase', example: 'MyVariableName' },
		{ id: 'snake_case', name: 'snake_case', example: 'my_variable_name' },
		{ id: 'kebab-case', name: 'kebab-case', example: 'my-variable-name' },
		{ id: 'CONSTANT_CASE', name: 'CONSTANT_CASE', example: 'MY_VARIABLE_NAME' },
		{ id: 'Title Case', name: 'Title Case', example: 'My Variable Name' },
		{ id: 'lowercase', name: 'lowercase', example: 'my variable name' },
		{ id: 'UPPERCASE', name: 'UPPERCASE', example: 'MY VARIABLE NAME' },
		{ id: 'Sentence case', name: 'Sentence case', example: 'My variable name' }
	];

	function toWords(str: string): string[] {
		return str
			.replace(/([a-z])([A-Z])/g, '$1 $2')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
			.replace(/[-_]/g, ' ')
			.toLowerCase()
			.split(/\s+/)
			.filter(Boolean);
	}

	function convert(text: string, targetCase: string): string {
		const words = toWords(text);
		if (words.length === 0) return '';

		switch (targetCase) {
			case 'camelCase':
				return words[0] + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
			case 'PascalCase':
				return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
			case 'snake_case':
				return words.join('_');
			case 'kebab-case':
				return words.join('-');
			case 'CONSTANT_CASE':
				return words.join('_').toUpperCase();
			case 'Title Case':
				return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
			case 'lowercase':
				return words.join(' ').toLowerCase();
			case 'UPPERCASE':
				return words.join(' ').toUpperCase();
			case 'Sentence case':
				const joined = words.join(' ');
				return joined.charAt(0).toUpperCase() + joined.slice(1);
			default:
				return text;
		}
	}

	let output = $derived(convert(input, selectedCase));
	let stats = $derived(input ? { chars: input.length } : undefined);

	function loadSample() {
		input = sampleInput;
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={output} stats={stats} />

		<!-- Input -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Input Text</h3>
			<textarea
				bind:value={input}
				placeholder="Enter text to convert (e.g., myVariableName, my-variable-name)"
				class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-24"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Case Selection -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-3">Target Case</h3>
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
				{#each cases as caseOption}
					<button
						class="btn btn-sm {selectedCase === caseOption.id ? 'btn-primary' : 'btn-ghost'}"
						onclick={() => selectedCase = caseOption.id}
					>
						{caseOption.name}
					</button>
				{/each}
			</div>
		</div>

		<!-- Output -->
		{#if input.trim()}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-2">
						<h3 class="font-semibold">{selectedCase}</h3>
						<CopyButton text={output} size="sm" />
					</div>
					<code class="text-lg font-mono break-all">{output}</code>
				</div>
			</div>

			<!-- All Conversions Preview -->
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h3 class="text-sm font-semibold mb-3">All Conversions</h3>
					<div class="grid gap-2">
						{#each cases as caseOption}
							<div class="flex items-center justify-between p-2 rounded-lg bg-base-300/50 text-sm gap-4 min-w-0">
								<span class="text-base-content/70 shrink-0">{caseOption.name}</span>
								<div class="flex items-center gap-2 min-w-0 flex-1 justify-end">
									<code class="font-mono truncate" title={convert(input, caseOption.id)}>{convert(input, caseOption.id)}</code>
									<CopyButton text={convert(input, caseOption.id)} size="xs" showFormats={false} class="shrink-0" />
								</div>
							</div>
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
