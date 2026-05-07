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

	const content = yamlToolsContent['formatter'];

	// State
	let input = $state('');
	let indent = $state(2);
	let flowLevel = $state(-1); // -1 = block style

	// Sample YAML
	const sampleYaml = `name: my-app
version: "1.0.0"
database:
  host: 'localhost'
  port: 5432
features: [authentication, logging, caching]
settings:
    debug: true
    maxConnections: 100`;

	// Format YAML
	function formatYaml(): { success: boolean; output: string; error?: string } {
		if (!input.trim()) {
			return { success: true, output: '' };
		}

		try {
			const parsed = yaml.load(input);
			const formatted = yaml.dump(parsed, {
				indent: indent,
				lineWidth: -1, // No line wrapping
				noRefs: true,
				sortKeys: false,
				flowLevel: flowLevel
			});
			return { success: true, output: formatted };
		} catch (e) {
			const err = e as yaml.YAMLException;
			return { success: false, output: '', error: err.reason || err.message };
		}
	}

	let result = $derived(formatYaml());

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	function copyOutput() {
		if (result.output) {
			navigator.clipboard.writeText(result.output);
		}
	}

	function downloadOutput() {
		if (result.output) {
			const blob = new Blob([result.output], { type: 'text/yaml' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'formatted.yaml';
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
			<div class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Indent:</span>
				<select bind:value={indent} class="select select-sm select-ghost">
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
				</select>
			</div>
			<div class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Style:</span>
				<select bind:value={flowLevel} class="select select-sm select-ghost">
					<option value={-1}>Block (expanded)</option>
					<option value={0}>Inline arrays</option>
				</select>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
							<span>📝</span>
						</div>
						<h3 class="font-bold">Input YAML</h3>
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
							<div class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
								<span>✨</span>
							</div>
							<h3 class="font-bold">Formatted YAML</h3>
						</div>
						{#if result.success && result.output}
							<div class="flex gap-1">
								<button class="btn btn-xs btn-ghost" onclick={copyOutput}>Copy</button>
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
						placeholder="Formatted YAML will appear here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed bg-base-100"
					></textarea>
				</div>
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
