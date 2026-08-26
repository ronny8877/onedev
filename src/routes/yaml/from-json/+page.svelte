<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
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

	const content = yamlToolsContent['from-json'];

	// State
	let input = $state('');
	let yamlIndent = $state(2);

	// Sample JSON
	const sampleJson = `{
  "name": "my-app",
  "version": "1.0.0",
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "features": ["authentication", "logging"],
  "settings": {
    "debug": true,
    "maxConnections": 100
  }
}`;

	// Convert JSON to YAML
	function convertToYaml(): { success: boolean; output: string; error?: string } {
		if (!input.trim()) {
			return { success: true, output: '' };
		}

		try {
			const parsed = JSON.parse(input);
			const yamlOutput = yaml.dump(parsed, {
				indent: yamlIndent,
				lineWidth: -1,
				noRefs: true,
				sortKeys: false
			});
			return { success: true, output: yamlOutput };
		} catch (e) {
			return { success: false, output: '', error: (e as Error).message };
		}
	}

	let result = $derived(convertToYaml());

	function loadSample() {
		input = sampleJson;
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
			a.download = 'converted.yaml';
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
		<div class="flex justify-center">
			<div class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">YAML Indent:</span>
				<select bind:value={yamlIndent} class="select select-sm select-bordered bg-base-100">
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
				</select>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input JSON -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
							<span class="font-mono font-bold text-xs">JS</span>
						</div>
						<h3 class="font-bold">JSON Input</h3>
					</div>

					<textarea
						bind:value={input}
						placeholder="Paste your JSON here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Output YAML -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
								<AppIcon name="file-text" size={16} />
							</div>
							<h3 class="font-bold">YAML Output</h3>
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
						placeholder="YAML will appear here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed bg-base-100"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Visual Indicator -->
		<div class="flex justify-center">
			<div class="flex items-center gap-4 text-sm text-base-content/60">
				<span class="badge badge-lg badge-primary">JSON</span>
				<AppIcon name="arrow-right" size={20} />
				<span class="badge badge-lg badge-ghost">YAML</span>
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
