<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';

	let input = $state('');
	let selectedCase = $state('camelCase');

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
		// Split by common delimiters and camelCase
		return str
			.replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // XMLParser -> XML Parser
			.replace(/[-_]/g, ' ') // kebab and snake
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

	function copyOutput() {
		navigator.clipboard.writeText(output);
	}

	function clearAll() {
		input = '';
	}
</script>

<ToolWrapper
	title="Case Converter"
	description="Convert text between camelCase, PascalCase, snake_case, kebab-case, and more."
>
	<div class="flex flex-col gap-6">
		<!-- Input -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">Input Text</h3>
				<button class="btn btn-ghost btn-xs" onclick={clearAll}>Clear</button>
			</div>
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
						<button class="btn btn-ghost btn-sm gap-1" onclick={copyOutput}>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
							</svg>
							Copy
						</button>
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
								<code class="font-mono truncate min-w-0" title={convert(input, caseOption.id)}>{convert(input, caseOption.id)}</code>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Supported Cases</h4>
				<div class="mt-2 grid gap-1 text-sm text-base-content/70">
					{#each cases as caseOption}
						<div><strong>{caseOption.name}:</strong> {caseOption.example}</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
