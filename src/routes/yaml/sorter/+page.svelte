<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import yaml from 'js-yaml';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { yamlToolsContent } from '$lib/config/content/yaml-tools-content';

	const content = yamlToolsContent['sorter'];

	// State
	let input = $state('');
	let recursive = $state(true);
	let indent = $state(2);

	// Sample YAML with unsorted keys at multiple levels
	const sampleYaml = `zebra: animal
apple: fruit
mango: fruit
database:
  port: 5432
  host: localhost
  connection_timeout: 30
  credentials:
    password: secret
    username: admin
    api_key: xyz123
config:
  z_setting: true
  a_setting: false
  m_setting: 100
features:
  - logging
  - authentication
  - caching`;

	// Sort keys recursively or at top level only
	function sortKeysDeep(obj: unknown): unknown {
		if (obj === null || obj === undefined) {
			return obj;
		}
		
		// Handle arrays - sort contents if recursive
		if (Array.isArray(obj)) {
			return recursive ? obj.map(item => sortKeysDeep(item)) : obj;
		}
		
		// Handle objects - sort keys
		if (typeof obj === 'object') {
			const sorted: Record<string, unknown> = {};
			const keys = Object.keys(obj as Record<string, unknown>);
			
			// Sort keys alphabetically (case-insensitive)
			keys.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
			
			for (const key of keys) {
				const value = (obj as Record<string, unknown>)[key];
				// Recursively sort nested objects if recursive is enabled
				sorted[key] = recursive ? sortKeysDeep(value) : value;
			}
			return sorted;
		}
		
		// Return primitives as-is
		return obj;
	}

	function sortYaml(): { success: boolean; output: string; error?: string; keysSorted: number } {
		if (!input.trim()) {
			return { success: true, output: '', keysSorted: 0 };
		}

		try {
			const parsed = yaml.load(input);
			
			if (parsed === null || parsed === undefined || typeof parsed !== 'object') {
				return { success: true, output: yaml.dump(parsed, { indent }), keysSorted: 0 };
			}
			
			const sorted = sortKeysDeep(parsed);
			
			const output = yaml.dump(sorted, {
				indent: indent,
				lineWidth: -1,
				noRefs: true,
				quotingType: '"',
				forceQuotes: false
			});
			
			// Count how many keys were in the original
			const countKeys = (o: unknown): number => {
				if (!o || typeof o !== 'object') return 0;
				if (Array.isArray(o)) return o.reduce((sum, item) => sum + countKeys(item), 0);
				const keys = Object.keys(o as Record<string, unknown>);
				return keys.length + keys.reduce((sum, k) => sum + countKeys((o as Record<string, unknown>)[k]), 0);
			};
			
			return { success: true, output, keysSorted: countKeys(parsed) };
		} catch (e) {
			const err = e as yaml.YAMLException;
			return { success: false, output: '', error: err.reason || err.message, keysSorted: 0 };
		}
	}

	let result = $derived(sortYaml());

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	function downloadOutput() {
		if (result.output) {
			const blob = new Blob([result.output], { type: 'text/yaml' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'sorted.yaml';
			a.click();
			URL.revokeObjectURL(url);
		}
	}

	let stats = $derived({
		lines: input ? input.split('\n').length : undefined
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Settings -->
		<div class="flex flex-wrap gap-4 items-center justify-center">
			<label class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2 cursor-pointer">
				<input type="checkbox" bind:checked={recursive} class="checkbox checkbox-sm checkbox-primary" />
				<span class="text-sm font-medium">Sort recursively (nested objects)</span>
			</label>
			<div class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Indent:</span>
				<select bind:value={indent} class="select select-sm select-ghost">
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
				</select>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<h3 class="font-bold">Original YAML</h3>
					</div>

					<textarea
						bind:value={input}
						placeholder="Paste your YAML here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Output -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<h3 class="font-bold">Sorted YAML</h3>
							{#if result.keysSorted > 0}
								<span class="badge badge-ghost badge-sm">{result.keysSorted} keys</span>
							{/if}
						</div>
						{#if result.success && result.output}
							<div class="flex gap-1">
								<CopyButton text={result.output} size="sm" />
								<button class="btn btn-xs btn-ghost" onclick={downloadOutput}>Download</button>
							</div>
						{/if}
					</div>

					{#if result.error}
						<div class="alert alert-error rounded-lg mb-3">
							<span class="text-sm">{result.error}</span>
						</div>
					{/if}

					<textarea
						value={result.output}
						readonly
						placeholder="Sorted YAML will appear here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed bg-base-100"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-info/10 border border-info/20 rounded-xl">
			<div class="card-body p-3">
				<p class="text-sm text-base-content/70">
					<strong>How it works:</strong> Keys are sorted alphabetically (case-insensitive). 
					{#if recursive}
						Nested objects are also sorted recursively.
					{:else}
						Only top-level keys are sorted.
					{/if}
				</p>
			</div>
		</div>
	</div>
	<div class="mt-12 space-y-12">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
		<RelatedTools relatedTools={content.relatedTools} />
		{#if content.tips}
			<Tips tips={content.tips} />
		{/if}
	</div>
</ToolWrapper>
