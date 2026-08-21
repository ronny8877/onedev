<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import { explainSql, SAMPLE_SQL_PRETTY } from '$lib/utils/sql';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';

	const content = sqlToolsContent['explainer'];

	let input = $state('');
	let result = $derived(
		input.trim() ? explainSql(input) : { ok: true, explanations: [], error: null }
	);
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		<ToolActions
			onSample={() => (input = SAMPLE_SQL_PRETTY)}
			onClear={() => (input = '')}
			stats={{ lines: input ? input.split('\n').length : undefined }}
		/>

		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">SQL</h3>
			<CodeMirrorEditor
				bind:value={input}
				language="sql"
				placeholder="Paste a SELECT, INSERT, UPDATE, or DELETE..."
				errorLine={result.error?.line}
			/>
		</div>

		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">{result.error.message}</div>
		{:else if result.explanations.length}
			<div class="space-y-6">
				{#each result.explanations as expl, i}
					<div class="rounded-2xl border border-base-300 bg-base-200 p-5">
						<div class="mb-2 flex flex-wrap items-center gap-2">
							<span class="badge badge-primary">{expl.kind}</span>
							{#if result.explanations.length > 1}
								<span class="text-xs text-base-content/50">Statement {i + 1}</span>
							{/if}
						</div>
						<p class="mb-4 text-base-content/80">{expl.summary}</p>
						<ol class="space-y-3">
							{#each expl.steps as step, n}
								<li class="rounded-xl bg-base-100 p-3">
									<div class="text-xs font-semibold uppercase tracking-wide text-primary">
										{n + 1}. {step.title}
									</div>
									<p class="mt-1 text-sm text-base-content/70 font-mono break-words">{step.detail}</p>
								</li>
							{/each}
						</ol>
					</div>
				{/each}
			</div>
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
