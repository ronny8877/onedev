<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import {
		diffSql,
		SAMPLE_SQL,
		SAMPLE_SQL_PRETTY,
		SQL_DIALECTS,
		editorDialect,
		type SqlDialect
	} from '$lib/utils/sql';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';

	const content = sqlToolsContent['diff'];
	const sampleRight = SAMPLE_SQL_PRETTY.replace('TRUE', 'FALSE').replace('LIMIT 10', 'LIMIT 25');

	let left = $state('');
	let right = $state('');
	let dialect = $state<SqlDialect>('postgresql');
	let result = $derived(
		left.trim() && right.trim()
			? diffSql(left, right, dialect)
			: { ok: true, hunks: [], error: null, identical: false }
	);

	const typeClass: Record<string, string> = {
		added: 'bg-success/15 text-success',
		removed: 'bg-error/15 text-error',
		unchanged: 'text-base-content/70'
	};
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		<ToolActions
			onSample={() => {
				left = SAMPLE_SQL;
				right = sampleRight;
			}}
			onClear={() => {
				left = '';
				right = '';
			}}
		/>

		<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5 w-fit">
			<span class="text-xs text-base-content/50">Dialect</span>
			<select bind:value={dialect} class="select select-bordered select-xs w-36">
				{#each SQL_DIALECTS as d}
					<option value={d.value}>{d.label}</option>
				{/each}
			</select>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Left SQL</h3>
				<CodeMirrorEditor
					bind:value={left}
					language="sql"
					sqlDialect={editorDialect(dialect)}
					placeholder="Paste SQL..."
				/>
			</div>
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Right SQL</h3>
				<CodeMirrorEditor
					bind:value={right}
					language="sql"
					sqlDialect={editorDialect(dialect)}
					placeholder="Paste SQL..."
				/>
			</div>
		</div>

		{#if result.error}
			<div class="alert alert-error rounded-xl text-sm">{result.error.message}</div>
		{:else if left.trim() && right.trim()}
			{#if result.identical}
				<div class="alert alert-success rounded-xl">No differences after formatting.</div>
			{:else}
				<pre class="overflow-x-auto rounded-xl border border-base-300 bg-base-200 p-3 font-mono text-xs leading-6"><code
					>{#each result.hunks as hunk}<span class="block {typeClass[hunk.type]}"
							>{hunk.type === 'added' ? '+' : hunk.type === 'removed' ? '-' : ' '} {hunk.text}</span
						>{/each}</code
				></pre>
			{/if}
		{/if}
	</div>
	<ToolContent {content} />
</ToolWrapper>
