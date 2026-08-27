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
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import HowTo from '$lib/components/content/HowTo.svelte';
	import { formatJSON, minifyJSON, validateJSON, type ParseError } from '$lib/utils/json';
	import { jsonToolsContent } from '$lib/config/content/json-tools-content';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	const content = jsonToolsContent.formatter;

	let input = $state('');
	let output = $state('');
	let error = $state<ParseError | null>(null);
	let indentSize = $state(2);
	let formatTimeout: ReturnType<typeof setTimeout> | null = null;

	// Stats
	let stats = $derived(output ? { chars: output.length, bytes: new TextEncoder().encode(output).length } : undefined);

	// Sample JSON
	const sampleJSON = `{
  "name": "OneDev Tools",
  "version": "1.0.0",
  "features": ["JSON", "Base64", "URL", "Text"],
  "config": {
    "theme": "dark",
    "autoFormat": true
  },
  "users": 15420,
  "active": true
}`;

	// Auto-format on paste/input with debounce
	$effect(() => {
		if (formatTimeout) {
			clearTimeout(formatTimeout);
		}

		if (!input.trim()) {
			output = '';
			error = null;
			return;
		}

		// Validate immediately
		const result = validateJSON(input);
		error = result.error || null;

		// Auto-prettify after delay if valid
		if (result.valid) {
			formatTimeout = setTimeout(() => {
				handlePrettify();
			}, 300);
		}

		return () => {
			if (formatTimeout) {
				clearTimeout(formatTimeout);
			}
		};
	});

	function handlePrettify() {
		error = null;
		output = '';

		if (!input.trim()) {
			error = { message: 'Please enter some JSON to format' };
			return;
		}

		try {
			output = formatJSON(input, indentSize);
		} catch (err) {
			const result = validateJSON(input);
			error = result.error || { message: (err as Error).message };
		}
	}

	function handleMinify() {
		error = null;
		output = '';

		if (!input.trim()) {
			error = { message: 'Please enter some JSON to minify' };
			return;
		}

		try {
			output = minifyJSON(input);
		} catch (err) {
			const result = validateJSON(input);
			error = result.error || { message: (err as Error).message };
		}
	}

	function handleSwap() {
		if (output) {
			input = output;
			output = '';
		}
	}

	function loadSample() {
		input = sampleJSON;
	}

	function clearAll() {
		input = '';
		output = '';
		error = null;
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		{#if content.howTo}
			<HowTo lede={content.howTo.lede} steps={content.howTo.steps} breaks={content.howTo.breaks} />
		{/if}

		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={output} stats={stats} />

		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<button type="button" class="btn btn-primary h-8 min-h-8 rounded-lg gap-1.5" onclick={handlePrettify}>
				<AppIcon name="list" class="size-4" />
				Prettify
			</button>

			<button type="button" class="btn btn-ghost h-8 min-h-8 rounded-lg gap-1.5" onclick={handleMinify}>
				<AppIcon name="minus" class="size-4" />
				Minify
			</button>

			<div class="flex items-center gap-2">
				<label for="indent" class="text-sm text-muted">Indent:</label>
				<select id="indent" class="select select-bordered h-8 min-h-8 rounded-lg w-20" bind:value={indentSize}>
					<option value={2}>2</option>
					<option value={4}>4</option>
					<option value={8}>8</option>
				</select>
			</div>

			{#if output}
				<button type="button" class="btn btn-ghost h-8 min-h-8 rounded-lg gap-1.5" onclick={handleSwap}>
					<AppIcon name="arrow-left-right" class="size-4" />
					Use Output as Input
				</button>
			{/if}
		</div>

		<!-- Error Display -->
		<ErrorDisplay {error} />

		<!-- Editors Grid -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Input</h3>
				<CodeMirrorEditor bind:value={input} placeholder="Paste your JSON here..." />
			</div>

			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">Output</h3>
				<CodeMirrorEditor value={output} readonly placeholder="Formatted JSON will appear here..." />
			</div>
		</div>
	</div>

	<!-- Content Sections - Added spacing with mt-12 -->
	<div class="mt-12 space-y-6">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
		{#if content.commonMistakes}
			<CommonMistakes mistakes={content.commonMistakes} />
		{/if}
		<RelatedTools relatedTools={content.relatedTools} />
	</div>
</ToolWrapper>
