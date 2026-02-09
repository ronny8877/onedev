<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ErrorDisplay from '$lib/components/ui/ErrorDisplay.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import { jsonToTable, tableToCSV, type TableData, type ParseError } from '$lib/utils/json';
	import { jsonToolsContent } from '$lib/config/content/json-tools-content';

	const content = jsonToolsContent.table;

	let input = $state('');
	let tableData = $state<TableData | null>(null);
	let error = $state<ParseError | null>(null);

	const sampleJSON = `[
  { "id": 1, "name": "Alice", "email": "alice@example.com", "role": "Admin" },
  { "id": 2, "name": "Bob", "email": "bob@example.com", "role": "User" },
  { "id": 3, "name": "Charlie", "email": "charlie@example.com", "role": "User" }
]`;

	function handleConvert() {
		error = null;
		tableData = null;

		if (!input.trim()) {
			error = { message: 'Please enter a JSON array to convert' };
			return;
		}

		try {
			tableData = jsonToTable(input);
		} catch (err) {
			error = { message: (err as Error).message };
		}
	}

	function handleExportCSV() {
		if (!tableData) return;

		const csv = tableToCSV(tableData);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'data.csv';
		link.click();
		URL.revokeObjectURL(link.href);
	}

	function formatCellValue(value: unknown): string {
		if (value === null) return 'null';
		if (value === undefined) return '';
		if (typeof value === 'object') return JSON.stringify(value);
		return String(value);
	}

	function loadSample() {
		input = sampleJSON;
		handleConvert();
	}

	function clearAll() {
		input = '';
		tableData = null;
		error = null;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button type="button" class="btn btn-primary" onclick={handleConvert}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					></path>
				</svg>
				Convert to Table
			</button>

			{#if tableData && tableData.rows.length > 0}
				<button type="button" class="btn btn-secondary" onclick={handleExportCSV}>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						></path>
					</svg>
					Export CSV
				</button>
			{/if}
		</div>

		<!-- Error Display -->
		<ErrorDisplay {error} />

		<!-- Input Editor -->
		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON Array Input</h3>
			<CodeMirrorEditor
				bind:value={input}
				placeholder={'Paste your JSON array here, e.g: [{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'}
			/>
		</div>

		<!-- Table Output -->
		{#if tableData}
			<div class="rounded-lg border border-base-300 bg-base-200 p-4">
				<h3 class="mb-4 font-semibold">
					Table Preview ({tableData.rows.length} rows × {tableData.headers.length} columns)
				</h3>

				{#if tableData.rows.length === 0}
					<p class="text-base-content/60">Empty array - no data to display</p>
				{:else}
					<div class="overflow-x-auto">
						<table class="table table-zebra w-full">
							<thead>
								<tr>
									<th class="bg-base-300">#</th>
									{#each tableData.headers as header}
										<th class="bg-base-300">{header}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each tableData.rows as row, i}
									<tr>
										<td class="text-base-content/50">{i + 1}</td>
										{#each row as cell}
											<td class="max-w-xs truncate" title={formatCellValue(cell)}>
												{formatCellValue(cell)}
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Usage Tips -->
		<div class="card bg-base-200">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Usage Tips:</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Input must be a JSON array of objects</li>
					<li>• Each object becomes a row in the table</li>
					<li>• Object keys become column headers</li>
					<li>• Nested objects are displayed as JSON strings</li>
				</ul>
			</div>
		</div>
	</div>

	<!-- Content Sections -->
	<div class="mt-12 space-y-6">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
