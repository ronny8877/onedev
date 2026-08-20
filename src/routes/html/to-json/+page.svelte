<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { htmlToJSON } from '$lib/utils/html';
	import { htmlToolsContent } from '$lib/config/content/html-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';

	const content = htmlToolsContent['to-json'];

	let input = $state('');

	const jsonOutput = $derived.by(() => {
		if (!input.trim()) return '';
		try {
			const result = htmlToJSON(input);
			return result ? JSON.stringify(result, null, 2) : '';
		} catch {
			return '';
		}
	});

	function handleClear() {
		input = '';
	}

	function loadExample() {
		input = `<div id="app" class="loaded">
  <header>
    <h1>Title</h1>
  </header>
  <main>
    <p>Hello World</p>
  </main>
</div>`;
	}

	let stats = $derived({
		chars: input.length,
		lines: input.split('\n').length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={handleClear} copyText={jsonOutput} {stats} />

		<!-- Editors -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<h3 class="mb-2 text-sm font-medium text-base-content/70">HTML Input</h3>
				<CodeMirrorEditor bind:value={input} language="html" placeholder="Paste your HTML here..." />
			</div>

			<div>
				<div class="flex items-center justify-between mb-2">
					<h3 class="text-sm font-medium text-base-content/70">JSON Output</h3>
					<span class="text-xs text-base-content/50">
						{jsonOutput ? jsonOutput.split('\n').length : 0} lines
					</span>
				</div>
				<CodeMirrorEditor value={jsonOutput} language="json" readonly placeholder="JSON will appear here..." />
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
	</div>
</ToolWrapper>
