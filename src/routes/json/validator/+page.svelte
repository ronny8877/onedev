<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import { validateJSON, type ParseError } from '$lib/utils/json';

	let input = $state('');
	let isValid = $state<boolean | null>(null);
	let error = $state<ParseError | null>(null);

	$effect(() => {
		if (!input.trim()) {
			isValid = null;
			error = null;
			return;
		}

		const result = validateJSON(input);
		isValid = result.valid;
		error = result.error || null;
	});
</script>

<ToolWrapper
	title="JSON Validator"
	description="Check if your JSON is valid and get detailed error messages with line numbers"
>
	<div class="flex flex-col gap-6">
		<!-- Status Badge -->
		{#if isValid !== null}
			<div class="flex items-center gap-3">
				{#if isValid}
					<div class="badge badge-success gap-2 p-4 text-lg">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path>
						</svg>
						Valid JSON
					</div>
				{:else}
					<div class="badge badge-error gap-2 p-4 text-lg">
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
						Invalid JSON
					</div>
				{/if}
			</div>
		{/if}

		<!-- Error Details -->
		{#if error}
			<div class="alert alert-error shadow-lg">
				<svg class="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				<div>
					<h3 class="font-bold">Parse Error</h3>
					<p class="text-sm">{error.message}</p>
					{#if error.line !== undefined}
						<p class="mt-1 text-xs opacity-80">
							📍 Line {error.line}{error.column !== undefined ? `, Column ${error.column}` : ''}
						</p>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Editor -->
		<div>
			<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON Input</h3>
			<CodeMirrorEditor
				bind:value={input}
				placeholder="Paste your JSON here to validate..."
			/>
		</div>

		<!-- Tips -->
		<div class="card bg-base-200">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Common JSON Errors:</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Missing or extra commas</li>
					<li>• Unquoted property names</li>
					<li>• Single quotes instead of double quotes</li>
					<li>• Trailing commas after last item</li>
					<li>• Unescaped special characters in strings</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
