<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import yaml from 'js-yaml';

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

	let errorCount = $derived(result.issues.filter(i => i.type === 'error').length);
	let warningCount = $derived(result.issues.filter(i => i.type === 'warning').length);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<div class="grid gap-6 lg:grid-cols-2">
			<!-- Input -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center gap-2 mb-3">
						<div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
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

			<!-- Results -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<div class="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
								<span>🔍</span>
							</div>
							<h3 class="font-bold">Lint Results</h3>
						</div>
						{#if input.trim()}
							<div class="flex gap-2">
								{#if errorCount > 0}
									<span class="badge badge-error badge-sm">{errorCount} error(s)</span>
								{/if}
								{#if warningCount > 0}
									<span class="badge badge-warning badge-sm">{warningCount} warning(s)</span>
								{/if}
								{#if errorCount === 0 && warningCount === 0}
									<span class="badge badge-success badge-sm">All clear!</span>
								{/if}
							</div>
						{/if}
					</div>

					{#if !input.trim()}
						<div class="text-center py-12 text-base-content/50">
							Enter YAML to lint
						</div>
					{:else if result.issues.length === 0}
						<div class="text-center py-12">
							<span class="text-5xl">✓</span>
							<p class="font-bold text-success mt-2">No issues found!</p>
							<p class="text-sm text-base-content/60">Your YAML looks clean</p>
						</div>
					{:else}
						<div class="space-y-2 max-h-64 overflow-y-auto">
							{#each result.issues as issue}
								<div class="flex items-start gap-3 p-2 rounded-lg {issue.type === 'error' ? 'bg-error/10' : 'bg-warning/10'}">
									<span class="badge badge-sm {issue.type === 'error' ? 'badge-error' : 'badge-warning'}">
										L{issue.line}
									</span>
									<span class="text-sm flex-1">{issue.message}</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Lint Checks -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body p-4">
				<h4 class="font-semibold text-sm mb-2">Checks Performed</h4>
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
</ToolWrapper>
