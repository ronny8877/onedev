<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
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

	const content = yamlToolsContent['diff'];

	// State
	let leftInput = $state('');
	let rightInput = $state('');

	// Sample YAML
	const sampleLeft = `name: my-app
version: 1.0.0
database:
  host: localhost
  port: 5432
features:
  - authentication
  - logging`;

	const sampleRight = `name: my-app
version: 1.1.0
database:
  host: production.db
  port: 5432
  ssl: true
features:
  - authentication
  - logging
  - caching`;

	// Compare YAML structures
	function compareYaml(): { success: boolean; differences: Difference[]; error?: string } {
		if (!leftInput.trim() || !rightInput.trim()) {
			return { success: true, differences: [] };
		}

		try {
			const left = yaml.load(leftInput) as Record<string, unknown>;
			const right = yaml.load(rightInput) as Record<string, unknown>;
			const differences = findDifferences(left, right, '');
			return { success: true, differences };
		} catch (e) {
			return { success: false, differences: [], error: (e as Error).message };
		}
	}

	interface Difference {
		path: string;
		type: 'added' | 'removed' | 'changed';
		leftValue?: unknown;
		rightValue?: unknown;
	}

	function findDifferences(left: unknown, right: unknown, path: string): Difference[] {
		const diffs: Difference[] = [];

		if (typeof left !== typeof right) {
			diffs.push({ path: path || 'root', type: 'changed', leftValue: left, rightValue: right });
			return diffs;
		}

		if (Array.isArray(left) && Array.isArray(right)) {
			const maxLen = Math.max(left.length, right.length);
			for (let i = 0; i < maxLen; i++) {
				const itemPath = `${path}[${i}]`;
				if (i >= left.length) {
					diffs.push({ path: itemPath, type: 'added', rightValue: right[i] });
				} else if (i >= right.length) {
					diffs.push({ path: itemPath, type: 'removed', leftValue: left[i] });
				} else {
					diffs.push(...findDifferences(left[i], right[i], itemPath));
				}
			}
		} else if (typeof left === 'object' && left !== null && typeof right === 'object' && right !== null) {
			const leftObj = left as Record<string, unknown>;
			const rightObj = right as Record<string, unknown>;
			const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);
			
			for (const key of allKeys) {
				const keyPath = path ? `${path}.${key}` : key;
				if (!(key in leftObj)) {
					diffs.push({ path: keyPath, type: 'added', rightValue: rightObj[key] });
				} else if (!(key in rightObj)) {
					diffs.push({ path: keyPath, type: 'removed', leftValue: leftObj[key] });
				} else {
					diffs.push(...findDifferences(leftObj[key], rightObj[key], keyPath));
				}
			}
		} else if (left !== right) {
			diffs.push({ path: path || 'root', type: 'changed', leftValue: left, rightValue: right });
		}

		return diffs;
	}

	let result = $derived(compareYaml());

	function loadSample() {
		leftInput = sampleLeft;
		rightInput = sampleRight;
	}

	function clearAll() {
		leftInput = '';
		rightInput = '';
	}

	function formatValue(val: unknown): string {
		if (typeof val === 'object') return JSON.stringify(val);
		return String(val);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Side by Side Inputs -->
		<div class="grid gap-4 lg:grid-cols-2">
			<!-- Left -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-8 h-8 rounded-lg bg-error/20 flex items-center justify-center">
							<AppIcon name={'📄'} size={16} />
						</div>
						<h3 class="font-bold">Original YAML</h3>
					</div>
					<textarea
						bind:value={leftInput}
						placeholder="Paste first YAML..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-48 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>

			<!-- Right -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
							<AppIcon name={'📄'} size={16} />
						</div>
						<h3 class="font-bold">Modified YAML</h3>
					</div>
					<textarea
						bind:value={rightInput}
						placeholder="Paste second YAML..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-48 leading-relaxed"
						spellcheck="false"
					></textarea>
				</div>
			</div>
		</div>

		<!-- Error -->
		{#if result.error}
			<div class="alert alert-error rounded-xl">
				<span>{result.error}</span>
			</div>
		{/if}

		<!-- Differences -->
		{#if result.success && leftInput.trim() && rightInput.trim()}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-4">
						<h3 class="font-bold">Differences</h3>
						<span class="badge badge-ghost">{result.differences.length} change(s)</span>
					</div>

					{#if result.differences.length === 0}
						<div class="text-center py-8 text-success">
							<AppIcon name={'✓'} size={32} />
							<p class="font-medium mt-2">Files are identical</p>
						</div>
					{:else}
						<div class="space-y-2">
							{#each result.differences as diff}
								<div class="flex items-start gap-3 p-3 rounded-lg {
									diff.type === 'added' ? 'bg-success/10 border border-success/20' :
									diff.type === 'removed' ? 'bg-error/10 border border-error/20' :
									'bg-warning/10 border border-warning/20'
								}">
									<span class="badge badge-sm {
										diff.type === 'added' ? 'badge-success' :
										diff.type === 'removed' ? 'badge-error' :
										'badge-warning'
									}">
										{diff.type === 'added' ? '+' : diff.type === 'removed' ? '-' : '~'}
									</span>
									<div class="flex-1 min-w-0">
										<code class="text-sm font-mono font-bold">{diff.path}</code>
										<div class="text-sm mt-1">
											{#if diff.type === 'added'}
												<span class="text-success">Added: {formatValue(diff.rightValue)}</span>
											{:else if diff.type === 'removed'}
												<span class="text-error">Removed: {formatValue(diff.leftValue)}</span>
											{:else}
												<span class="text-error line-through">{formatValue(diff.leftValue)}</span>
												<AppIcon name={'→'} size={16} />
												<span class="text-success">{formatValue(diff.rightValue)}</span>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
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
