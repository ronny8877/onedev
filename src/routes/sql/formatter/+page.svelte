<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import {
		formatSql,
		SAMPLE_SQL,
		SQL_DIALECTS,
		editorDialect,
		type SqlDialect,
		type KeywordCase
	} from '$lib/utils/sql';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';
	import HowTo from '$lib/components/content/HowTo.svelte';

	const content = sqlToolsContent['formatter'];

	let input = $state('');
	let dialect = $state<SqlDialect>('postgresql');
	let tabWidth = $state(2);
	let keywordCase = $state<KeywordCase>('upper');
	let indentStyle = $state<'standard' | 'tabularLeft'>('standard');

	let result = $derived(
		input.trim()
			? formatSql(input, { dialect, tabWidth, keywordCase, indentStyle })
			: { ok: true, output: '', error: null }
	);

	let stats = $derived({
		lines: input ? input.split('\n').length : undefined,
		bytes: result.output ? new TextEncoder().encode(result.output).length : undefined
	});
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<ToolActions
			onSample={() => (input = SAMPLE_SQL)}
			onClear={() => (input = '')}
			copyText={result.output}
			{stats}
		/>

		<div class="flex flex-wrap items-center gap-3">
			<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Dialect</span>
				<select bind:value={dialect} class="select select-bordered select-xs w-36">
					{#each SQL_DIALECTS as d}
						<option value={d.value}>{d.label}</option>
					{/each}
				</select>
			</div>
			<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Indent</span>
				<select bind:value={tabWidth} class="select select-bordered select-xs w-24">
					<option value={2}>2 spaces</option>
					<option value={4}>4 spaces</option>
				</select>
			</div>
			<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Keywords</span>
				<select bind:value={keywordCase} class="select select-bordered select-xs w-28">
					<option value="upper">UPPER</option>
					<option value="lower">lower</option>
					<option value="preserve">preserve</option>
				</select>
			</div>
			<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Style</span>
				<select bind:value={indentStyle} class="select select-bordered select-xs w-28">
					<option value="standard">Standard</option>
					<option value="tabularLeft">Tabular</option>
				</select>
			</div>
		</div>

		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">
				<div>
					<div class="font-semibold">Could not format</div>
					<div class="mt-1">{result.error.message}</div>
					{#if result.error.line}
						<div class="mt-1 text-xs opacity-80">
							Line {result.error.line}{result.error.column ? `, column ${result.error.column}` : ''}
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Input SQL</h3>
				<CodeMirrorEditor
					bind:value={input}
					language="sql"
					sqlDialect={editorDialect(dialect)}
					placeholder="Paste SQL here..."
					errorLine={result.error?.line}
				/>
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Formatted SQL</h3>
				<CodeMirrorEditor
					value={result.output}
					language="sql"
					sqlDialect={editorDialect(dialect)}
					readonly
					placeholder="Formatted SQL will appear here..."
				/>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
