<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import * as yaml from 'js-yaml';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { yamlToolsContent } from '$lib/config/content/yaml-tools-content';

	const content = yamlToolsContent['linter'];

	// State
	let input = $state('');

	// Sample YAML with issues
	const sampleYaml = `name: my-app
version: 1.0.0
name: duplicate-key
database:
	host: localhost
  port: 5432
settings:
  debug: true  
  maxConnections: 100
features:
- auth
-  logging`;

	interface LintIssue {
		line: number;
		type: 'error' | 'warning';
		message: string;
	}

	// Lint YAML
	function lintYaml(): { issues: LintIssue[]; isValid: boolean; parseError?: string } {
		if (!input.trim()) {
			return { issues: [], isValid: true };
		}

		const issues: LintIssue[] = [];
		const lines = input.split('\n');

		// Check for tabs
		lines.forEach((line, i) => {
			if (line.includes('\t')) {
				issues.push({
					line: i + 1,
					type: 'error',
					message: 'Use spaces instead of tabs for indentation'
				});
			}
		});

		// Check for trailing whitespace
		lines.forEach((line, i) => {
			if (line.endsWith(' ') || line.endsWith('\t')) {
				issues.push({
					line: i + 1,
					type: 'warning',
					message: 'Trailing whitespace detected'
				});
			}
		});

		// Check for inconsistent indentation
		let expectedIndent = 2;
		lines.forEach((line, i) => {
			if (line.trim() && !line.startsWith('#')) {
				const indent = line.match(/^( *)/)?.[1].length || 0;
				if (indent > 0 && indent % 2 !== 0 && indent % 4 !== 0) {
					issues.push({
						line: i + 1,
						type: 'warning',
						message: `Unusual indentation (${indent} spaces)`
					});
				}
			}
		});

		// Check for duplicate keys by parsing
		try {
			const seen = new Map<string, number>();
			lines.forEach((line, i) => {
				const match = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_-]*):\s*/);
				if (match) {
					const indent = match[1].length;
					const key = `${indent}:${match[2]}`;
					if (seen.has(key)) {
						issues.push({
							line: i + 1,
							type: 'error',
							message: `Duplicate key "${match[2]}" (first seen on line ${seen.get(key)})`
						});
					} else {
						seen.set(key, i + 1);
					}
				}
			});
		} catch {}

		// Try to parse for syntax errors
		try {
			yaml.load(input);
		} catch (e) {
			const err = e as yaml.YAMLException;
			if (err.mark) {
				issues.unshift({
					line: err.mark.line + 1,
					type: 'error',
					message: `Syntax error: ${err.reason}`
				});
			}
			return { issues, isValid: false, parseError: err.reason };
		}

		return { issues, isValid: true };
	}

	let result = $derived(lintYaml());

	function loadSample() {
		input = sampleYaml;
	}

	function clearAll() {
		input = '';
	}

	let stats = $derived({
		lines: input ? input.split('\n').length : undefined
	});

	let errorCount = $derived(result.issues.filter((i) => i.type === 'error').length);
	let warningCount = $derived(result.issues.filter((i) => i.type === 'warning').length);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card rounded-2xl bg-base-200">
				<div class="card-body p-4">
					<div class="mb-3 flex items-center gap-2">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
							<AppIcon name="file-text" size={16} />
						</div>
						<h3 class="font-bold">YAML Input</h3>
					</div>

					<textarea
						bind:value={input}
						placeholder="Paste your YAML here..."
						class="textarea-bordered textarea min-h-64 w-full font-mono text-sm leading-relaxed"
						spellcheck="false"></textarea>
				</div>
			</div>

			<!-- Results -->
			<div class="card rounded-2xl bg-base-200">
				<div class="card-body p-4">
					<div class="mb-3 flex items-center justify-between">
						<div class="flex items-center gap-2">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/20">
								<AppIcon name="search" size={16} />
							</div>
							<h3 class="font-bold">Lint Results</h3>
						</div>
						{#if input.trim()}
							<div class="flex gap-2">
								{#if errorCount > 0}
									<span class="badge badge-sm badge-error">{errorCount} error(s)</span>
								{/if}
								{#if warningCount > 0}
									<span class="badge badge-sm badge-warning">{warningCount} warning(s)</span>
								{/if}
								{#if errorCount === 0 && warningCount === 0}
									<span class="badge badge-sm badge-success">All clear!</span>
								{/if}
							</div>
						{/if}
					</div>

					{#if !input.trim()}
						<div class="py-12 text-center text-base-content/50">Enter YAML to lint</div>
					{:else if result.issues.length === 0}
						<div class="py-12 text-center">
							<AppIcon name="check" size={16} />
							<p class="mt-2 font-bold text-success">No issues found!</p>
							<p class="text-sm text-base-content/60">Your YAML looks clean</p>
						</div>
					{:else}
						<div class="max-h-64 space-y-2 overflow-y-auto">
							{#each result.issues as issue}
								<div
									class="flex items-start gap-3 rounded-lg p-2 {issue.type === 'error'
										? 'bg-error/10'
										: 'bg-warning/10'}"
								>
									<span
										class="badge badge-sm {issue.type === 'error'
											? 'badge-error'
											: 'badge-warning'}"
									>
										L{issue.line}
									</span>
									<span class="flex-1 text-sm">{issue.message}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Lint Checks -->
		<div class="card rounded-xl bg-base-200">
			<div class="card-body p-4">
				<h4 class="mb-2 text-sm font-semibold">Checks Performed</h4>
				<div class="flex flex-wrap gap-2 text-xs">
					<span class="badge badge-ghost">Syntax validation</span>
					<span class="badge badge-ghost">Duplicate keys</span>
					<span class="badge badge-ghost">Tab characters</span>
					<span class="badge badge-ghost">Trailing whitespace</span>
					<span class="badge badge-ghost">Indentation</span>
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
