<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import {
		validateSql,
		SAMPLE_SQL,
		SQL_DIALECTS,
		editorDialect,
		type SqlDialect
	} from '$lib/utils/sql';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';

	const content = sqlToolsContent['validator'];

	let input = $state('');
	let dialect = $state<SqlDialect>('postgresql');
	let result = $derived(
		input.trim()
			? validateSql(input, dialect)
			: { ok: true, error: null, stats: null }
	);
	let lineStats = $derived({ lines: input ? input.split('\n').length : undefined });
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		<ToolActions
			onSample={() => (input = SAMPLE_SQL)}
			onClear={() => (input = '')}
			stats={lineStats}
		/>

		<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5 w-fit">
			<span class="text-xs text-base-content/50">Dialect</span>
			<select bind:value={dialect} class="select select-bordered select-xs w-36">
				{#each SQL_DIALECTS as d}
					<option value={d.value}>{d.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">SQL</h3>
			<CodeMirrorEditor
				bind:value={input}
				language="sql"
				sqlDialect={editorDialect(dialect)}
				placeholder="Paste SQL to validate..."
				errorLine={result.error?.line}
			/>
		</div>

		{#if input.trim()}
			{#if result.ok}
				<div class="alert alert-success rounded-xl">
					<span>Syntax looks valid for {SQL_DIALECTS.find((d) => d.value === dialect)?.label}.</span>
				</div>
				{#if result.stats}
					<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<div class="stat bg-base-200 rounded-xl">
							<div class="stat-title">Statements</div>
							<div class="stat-value text-2xl">{result.stats.statements}</div>
						</div>
						<div class="stat bg-base-200 rounded-xl">
							<div class="stat-title">SELECT</div>
							<div class="stat-value text-2xl">{result.stats.selects}</div>
						</div>
						<div class="stat bg-base-200 rounded-xl">
							<div class="stat-title">JOIN</div>
							<div class="stat-value text-2xl">{result.stats.joins}</div>
						</div>
						<div class="stat bg-base-200 rounded-xl">
							<div class="stat-title">Comments</div>
							<div class="stat-value text-2xl">{result.stats.comments}</div>
						</div>
						<div class="stat bg-base-200 rounded-xl">
							<div class="stat-title">Lines</div>
							<div class="stat-value text-2xl">{result.stats.lines}</div>
						</div>
						<div class="stat bg-base-200 rounded-xl">
							<div class="stat-title">Tables</div>
							<div class="stat-value text-lg truncate">
								{result.stats.tables.length ? result.stats.tables.join(', ') : 'none detected'}
							</div>
						</div>
					</div>
				{/if}
			{:else}
				<div class="alert alert-error rounded-xl">
					<div>
						<div class="font-semibold">Not valid SQL</div>
						<div class="mt-1 text-sm">{result.error?.message}</div>
						{#if result.error?.line}
							<div class="mt-1 text-xs opacity-80">
								Line {result.error.line}{result.error.column ? `, column ${result.error.column}` : ''}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
