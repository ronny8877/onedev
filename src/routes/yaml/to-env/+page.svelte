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

	const content = yamlToolsContent['to-env'];

	// State
	let input = $state('');
	let separator = $state('_');
	let prefix = $state('');

	// Sample YAML
	const sampleYaml = `app:
  name: myapp
  version: 1.0.0
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret
features:
  logging: true
  caching: enabled`;

	// Flatten YAML to ENV
	function flattenToEnv(obj: unknown, currentPath: string = ''): string[] {
		const lines: string[] = [];

		if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
			for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
				const newPath = currentPath ? `${currentPath}${separator}${key}` : key;
				if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
					lines.push(...flattenToEnv(value, newPath));
				} else {
					const envKey = (prefix ? `${prefix}${separator}` : '') + newPath.toUpperCase();
					const envValue = typeof value === 'string' ? value : JSON.stringify(value);
					lines.push(`${envKey}=${envValue}`);
				}
			}
		}

		return lines;
	}

	function convertToEnv(): { success: boolean; output: string; error?: string; keyCount: number } {
		if (!input.trim()) {
			return { success: true, output: '', keyCount: 0 };
		}

		try {
			const parsed = yaml.load(input);
			const lines = flattenToEnv(parsed);
			return { success: true, output: lines.join('\n'), keyCount: lines.length };
		} catch (e) {
			const err = e as yaml.YAMLException;
			return { success: false, output: '', error: err.reason || err.message, keyCount: 0 };
		}
	}

	let result = $derived(convertToEnv());

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	function downloadOutput() {
		if (result.output) {
			const blob = new Blob([result.output], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = '.env';
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
				<span class="text-sm font-medium">Separator:</span>
				<select bind:value={separator} class="select select-sm select-bordered bg-base-100">
					<option value="_">Underscore (_)</option>
					<option value="__">Double underscore (__)</option>
					<option value=".">Dot (.)</option>
				</select>
			</div>
			<div class="flex items-center gap-2 bg-base-200 rounded-xl px-4 py-2">
				<span class="text-sm font-medium">Prefix:</span>
				<input
					type="text"
					bind:value={prefix}
					placeholder="Optional"
					class="input input-sm input-bordered w-24 bg-base-100"
				/>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input YAML -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
							<span>📄</span>
						</div>
						<h3 class="font-bold">YAML Input</h3>
					</div>

					<textarea
						bind:value={input}
						placeholder="Paste your YAML here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Output ENV -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
								<span>📝</span>
							</div>
							<h3 class="font-bold">.env Output</h3>
							{#if result.keyCount > 0}
								<span class="badge badge-sm badge-ghost">{result.keyCount} keys</span>
							{/if}
						</div>
						{#if result.success && result.output}
							<div class="flex gap-1">
								<CopyButton text={result.output} size="sm" />
								<button class="btn btn-xs btn-ghost" onclick={downloadOutput}>Download .env</button>
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
						placeholder="Environment variables will appear here..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-64 leading-relaxed bg-base-100"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Info -->
		<div class="card bg-info/10 border border-info/20 rounded-xl">
			<div class="card-body p-4">
				<div class="flex items-start gap-3">
					<span class="text-info">💡</span>
					<div class="text-sm">
						<p class="font-semibold text-info">How it works</p>
						<p class="text-base-content/70">Nested YAML keys are flattened with the separator. For example, <code>database.host</code> becomes <code>DATABASE_HOST</code>.</p>
					</div>
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
