<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import ToolContent from '$lib/components/content/ToolContent.svelte';
	import Segmented from '$lib/components/ui/Segmented.svelte';
	import {
		quoteSqlText,
		unquoteSqlText,
		SQL_DIALECTS,
		type SqlDialect
	} from '$lib/utils/sql';
	import { sqlToolsContent } from '$lib/config/content/sql-tools-content';

	const content = sqlToolsContent['escape'];

	let input = $state('');
	let dialect = $state<SqlDialect>('postgresql');
	let mode = $state('string');
	const sample = "O'Reilly";

	let output = $derived.by(() => {
		if (!input) return '';
		if (mode === 'unescape') return unquoteSqlText(input, dialect);
		if (mode === 'identifier') return quoteSqlText(input, 'identifier', dialect);
		return quoteSqlText(input, 'string', dialect);
	});
</script>

<ToolWrapper lastUpdated="2026-08-21">
	<div class="flex flex-col gap-6">
		<ToolActions onSample={() => (input = sample)} onClear={() => (input = '')} copyText={output} />

		<div class="flex flex-wrap items-center justify-center gap-3">
			<Segmented
				bind:value={mode}
				options={[
					{ value: 'string', label: 'Escape string' },
					{ value: 'identifier', label: 'Quote identifier' },
					{ value: 'unescape', label: 'Unescape' }
				]}
			/>
			<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
				<span class="text-xs text-base-content/50">Dialect</span>
				<select bind:value={dialect} class="select select-bordered select-xs w-36">
					{#each SQL_DIALECTS as d}
						<option value={d.value}>{d.label}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-2">
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">Input</h3>
					<textarea
						bind:value={input}
						placeholder={mode === 'identifier' ? 'column or table name...' : 'Raw text...'}
						class="textarea textarea-bordered w-full font-mono text-sm min-h-56"
						spellcheck="false"
					></textarea>
				</div>
			</div>
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body p-4">
					<h3 class="font-bold mb-3">SQL</h3>
					<textarea
						value={output}
						readonly
						placeholder="Quoted result..."
						class="textarea textarea-bordered w-full font-mono text-sm min-h-56 bg-base-100"
					></textarea>
				</div>
			</div>
		</div>
	</div>
	<ToolContent {content} />
</ToolWrapper>
