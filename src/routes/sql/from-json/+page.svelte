<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import {
		jsonToSql,
		SAMPLE_JSON_ROWS,
		SQL_DIALECTS,
		editorDialect,
		type SqlDialect
	} from '$lib/utils/sql';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';

	const content = sqlToolsContent['from-json'];

	let input = $state('');
	let tableName = $state('users');
	let dialect = $state<SqlDialect>('postgresql');
	let includeCreate = $state(true);
	let snakeCase = $state(true);

	let result = $derived(
		input.trim()
			? jsonToSql(input, { tableName, dialect, includeCreate, snakeCase })
			: { ok: true, output: '', error: null, rows: 0 }
	);
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		<ToolActions
			onSample={() => (input = SAMPLE_JSON_ROWS)}
			onClear={() => (input = '')}
			copyText={result.output}
			stats={{ lines: result.rows || undefined }}
		/>

		<div class="flex flex-wrap items-center gap-3">
			<label class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Table</span>
				<input bind:value={tableName} class="input input-bordered input-xs w-36 font-mono" />
			</label>
			<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Dialect</span>
				<select bind:value={dialect} class="select select-bordered select-xs w-36">
					{#each SQL_DIALECTS as d}
						<option value={d.value}>{d.label}</option>
					{/each}
				</select>
			</div>
			<label class="flex cursor-pointer items-center gap-2">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={includeCreate} />
				<span class="text-sm">CREATE TABLE</span>
			</label>
			<label class="flex cursor-pointer items-center gap-2">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={snakeCase} />
				<span class="text-sm">snake_case names</span>
			</label>
		</div>

		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">{result.error.message}</div>
		{/if}

		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON</h3>
				<CodeMirrorEditor
					bind:value={input}
					language="json"
					placeholder={'[{ "id": 1, "name": "Ada" }]'}
				/>
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">SQL</h3>
				<CodeMirrorEditor
					value={result.output}
					language="sql"
					sqlDialect={editorDialect(dialect)}
					readonly
					placeholder="INSERT statements..."
				/>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
