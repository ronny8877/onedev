<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ErrorDisplay from '$lib/components/ui/ErrorDisplay.svelte';
	import SyntaxHighlighter from '$lib/components/ui/SyntaxHighlighter.svelte';
	import { generateTypeScript, generateGoStruct, type ParseError } from '$lib/utils/json';

	let input = $state('');
	let output = $state('');
	let error = $state<ParseError | null>(null);
	let language = $state<'typescript' | 'go'>('typescript');
	let typeName = $state('Root');
	let generateTimeout: ReturnType<typeof setTimeout> | null = null;

	// Auto-generate types with debounce
	$effect(() => {
		if (generateTimeout) {
			clearTimeout(generateTimeout);
		}

		if (!input.trim()) {
			output = '';
			error = null;
			return;
		}

		generateTimeout = setTimeout(() => {
			handleGenerate();
		}, 400);

		return () => {
			if (generateTimeout) {
				clearTimeout(generateTimeout);
			}
		};
	});

	// Re-generate when language or typeName changes
	$effect(() => {
		const _ = language;
		const __ = typeName;
		if (input.trim()) {
			handleGenerate();
		}
	});

	function handleGenerate() {
		error = null;
		output = '';

		if (!input.trim()) {
			error = { message: 'Please enter JSON to generate types from' };
			return;
		}

		try {
			if (language === 'typescript') {
				output = generateTypeScript(input, typeName);
			} else {
				output = generateGoStruct(input, typeName);
			}
		} catch (err) {
			error = { message: (err as Error).message };
		}
	}

	async function copyOutput() {
		await navigator.clipboard.writeText(output);
	}
</script>

<ToolWrapper
	title="JSON Type Generator"
	description="Generate TypeScript interfaces or Go structs from your JSON data"
>
	<div class="flex flex-col gap-6">
		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button type="button" class="btn btn-primary" onclick={handleGenerate}>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
					></path>
				</svg>
				Generate
			</button>

			<div class="join">
				<button
					type="button"
					class="btn join-item btn-sm"
					class:btn-active={language === 'typescript'}
					onclick={() => (language = 'typescript')}
				>
					TypeScript
				</button>
				<button
					type="button"
					class="btn join-item btn-sm"
					class:btn-active={language === 'go'}
					onclick={() => (language = 'go')}
				>
					Go
				</button>
			</div>

			<div class="flex items-center gap-2">
				<label for="typeName" class="text-sm text-base-content/70">Type Name:</label>
				<input
					id="typeName"
					type="text"
					class="input input-bordered input-sm w-32"
					bind:value={typeName}
					placeholder="Root"
				/>
			</div>
		</div>

		<!-- Error Display -->
		<ErrorDisplay {error} />

		<!-- Editors -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">JSON Input</h3>
				<CodeMirrorEditor
					bind:value={input}
					placeholder={'{"name": "John", "age": 30, "active": true}'}
				/>
			</div>

			<div>
				<div class="mb-2 flex items-center justify-between">
					<h3 class="text-sm font-medium text-base-content/70">
						Generated {language === 'typescript' ? 'TypeScript' : 'Go'}
					</h3>
					{#if output}
						<button type="button" class="btn btn-ghost btn-xs" onclick={copyOutput}>
							Copy
						</button>
					{/if}
				</div>
				<div class="min-h-[300px] max-h-[500px] overflow-auto rounded-xl border border-base-300 bg-base-200">
					{#if output}
						<SyntaxHighlighter 
							code={output} 
							language={language === 'typescript' ? 'typescript' : 'go'} 
						/>
					{:else}
						<div class="p-4 text-base-content/50 font-mono text-sm">
							Generated types will appear here...
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Language Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">
					{language === 'typescript' ? 'TypeScript' : 'Go'} Output Features:
				</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					{#if language === 'typescript'}
						<li>• Generates interfaces with proper property types</li>
						<li>• Handles nested objects by creating separate interfaces</li>
						<li>• Arrays are typed based on first element</li>
						<li>• Quotes keys that aren't valid identifiers</li>
					{:else}
						<li>• Generates structs with json tags</li>
						<li>• Uses proper Go types (int, float64, bool, string)</li>
						<li>• Capitalizes field names for export</li>
						<li>• Handles nested objects as separate structs</li>
					{/if}
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
