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
	import { compareJSON, type DiffResult, type ParseError } from '$lib/utils/json';
	import { jsonToolsContent } from '$lib/config/content/json-tools-content';

	const content = jsonToolsContent.diff;

	let leftInput = $state('');
	let rightInput = $state('');
	let diffs = $state<DiffResult[]>([]);
	let error = $state<ParseError | null>(null);
	let viewMode = $state<'side-by-side' | 'inline'>('side-by-side');
	let ignoreKeyOrder = $state(false);
	let compareTimeout: ReturnType<typeof setTimeout> | null = null;

	const sampleLeft = `{
  "name": "OneDev Tools",
  "version": "1.0.0",
  "features": ["JSON", "Base64"],
  "config": {
    "theme": "light"
  }
}`;

	const sampleRight = `{
  "name": "OneDev Tools",
  "version": "2.0.0",
  "features": ["JSON", "Base64", "URL"],
  "config": {
    "theme": "dark",
    "notifications": true
  }
}`;

	// Auto-compare with debounce when both inputs have content
	$effect(() => {
		const _left = leftInput;
		const _right = rightInput;
		const _ignoreOrder = ignoreKeyOrder;

		if (compareTimeout) {
			clearTimeout(compareTimeout);
		}

		if (!_left.trim() || !_right.trim()) {
			diffs = [];
			error = null;
			return;
		}

		compareTimeout = setTimeout(() => {
			handleCompare();
		}, 500);

		return () => {
			if (compareTimeout) {
				clearTimeout(compareTimeout);
			}
		};
	});

	function handleCompare() {
		error = null;
		diffs = [];

		if (!leftInput.trim() || !rightInput.trim()) {
			error = { message: 'Please enter JSON in both panels' };
			return;
		}

		try {
			diffs = compareJSON(leftInput, rightInput, ignoreKeyOrder);
		} catch (err) {
			error = { message: (err as Error).message };
		}
	}

	function loadSample() {
		leftInput = sampleLeft;
		rightInput = sampleRight;
	}

	function clearAll() {
		leftInput = '';
		rightInput = '';
		diffs = [];
		error = null;
	}

	function getTypeColor(type: DiffResult['type']): string {
		switch (type) {
			case 'added':
				return 'text-success';
			case 'removed':
				return 'text-error';
			case 'changed':
				return 'text-warning';
			default:
				return 'text-base-content';
		}
	}

	function getTypeBadge(type: DiffResult['type']): string {
		switch (type) {
			case 'added':
				return 'badge-success';
			case 'removed':
				return 'badge-error';
			case 'changed':
				return 'badge-warning';
			default:
				return 'badge-ghost';
		}
	}

	function formatValue(value: unknown): string {
		if (value === undefined) return 'undefined';
		return JSON.stringify(value, null, 2);
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} />

		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button type="button" class="btn btn-primary" onclick={handleCompare}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5l7 7-7 7"
					></path>
				</svg>
				Compare
			</button>

			<label class="label cursor-pointer gap-2">
				<input type="checkbox" class="checkbox checkbox-sm" bind:checked={ignoreKeyOrder} />
				<span class="label-text">Ignore key order</span>
			</label>
		</div>

		<!-- Error Display -->
		<ErrorDisplay {error} />

		<!-- Editors -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Left JSON</h3>
				<CodeMirrorEditor bind:value={leftInput} placeholder="Paste first JSON here..." />
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Right JSON</h3>
				<CodeMirrorEditor bind:value={rightInput} placeholder="Paste second JSON here..." />
			</div>
		</div>

		<!-- Diff Results -->
		{#if diffs.length > 0}
			<div class="rounded-xl border border-base-300 bg-base-200 p-4">
				<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
					<h3 class="font-semibold">
						Differences Found: {diffs.length}
					</h3>
					<!-- View Mode Toggle - Only visible when diff is shown -->
					<div class="join">
						<button
							type="button"
							class="btn join-item btn-sm"
							class:btn-active={viewMode === 'side-by-side'}
							onclick={() => (viewMode = 'side-by-side')}
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"></path>
							</svg>
							Side by Side
						</button>
						<button
							type="button"
							class="btn join-item btn-sm"
							class:btn-active={viewMode === 'inline'}
							onclick={() => (viewMode = 'inline')}
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
							</svg>
							Inline
						</button>
					</div>
				</div>

				{#key viewMode}
					<div class="space-y-3">
						{#each diffs as diff}
							<div class="rounded-xl bg-base-100 p-4">
								<div class="flex items-center gap-2">
									<span class="badge {getTypeBadge(diff.type)} badge-sm">
										{diff.type}
									</span>
									<code class="text-sm font-mono {getTypeColor(diff.type)}">{diff.path}</code>
								</div>

								{#if diff.type === 'changed'}
									{#if viewMode === 'side-by-side'}
										<div class="mt-3 grid gap-3 lg:grid-cols-2">
											<div class="rounded-lg bg-error/10 p-3">
												<span class="text-xs font-medium text-base-content/60">Old Value</span>
												<pre class="mt-2 overflow-auto text-sm text-error">{formatValue(diff.oldValue)}</pre>
											</div>
											<div class="rounded-lg bg-success/10 p-3">
												<span class="text-xs font-medium text-base-content/60">New Value</span>
												<pre class="mt-2 overflow-auto text-sm text-success">{formatValue(diff.newValue)}</pre>
											</div>
										</div>
									{:else}
										<div class="mt-3 flex flex-col gap-2">
											<div class="rounded-lg bg-error/10 p-3">
												<span class="text-xs font-medium text-base-content/60">- Old Value</span>
												<pre class="mt-2 overflow-auto text-sm text-error">{formatValue(diff.oldValue)}</pre>
											</div>
											<div class="rounded-lg bg-success/10 p-3">
												<span class="text-xs font-medium text-base-content/60">+ New Value</span>
												<pre class="mt-2 overflow-auto text-sm text-success">{formatValue(diff.newValue)}</pre>
											</div>
										</div>
									{/if}
								{:else if diff.type === 'added'}
									<div class="mt-3 rounded-lg bg-success/10 p-3">
										<span class="text-xs font-medium text-base-content/60">+ Added</span>
										<pre class="mt-2 overflow-auto text-sm text-success">{formatValue(diff.newValue)}</pre>
									</div>
								{:else if diff.type === 'removed'}
									<div class="mt-3 rounded-lg bg-error/10 p-3">
										<span class="text-xs font-medium text-base-content/60">- Removed</span>
										<pre class="mt-2 overflow-auto text-sm text-error">{formatValue(diff.oldValue)}</pre>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/key}
			</div>
		{:else if leftInput && rightInput && !error}
			<div class="alert alert-success rounded-xl">
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<span>Both JSON objects are identical!</span>
			</div>
		{/if}
	</div>

	<!-- Content Sections -->
	<div class="mt-12 space-y-6">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
	</div>
</ToolWrapper>
```
