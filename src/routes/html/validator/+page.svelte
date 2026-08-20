<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import { validateHTML, type HTMLValidationIssue } from '$lib/utils/html';
	import { htmlToolsContent } from '$lib/config/content/html-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = htmlToolsContent['validator'];

	let input = $state('');
	let issues = $state<HTMLValidationIssue[]>([]);
	let isValid = $state<boolean | null>(null);

	$effect(() => {
		if (!input.trim()) {
			issues = [];
			isValid = null;
			return;
		}

		const result = validateHTML(input);
		issues = result.issues;
		isValid = result.valid;
	});

	const errorCount = $derived(issues.filter(i => i.type === 'error').length);
	const warningCount = $derived(issues.filter(i => i.type === 'warning').length);

	function handleClear() {
		input = '';
	}

	function loadExample() {
		input = `<div class="foo">
  <span>Unclosed span
  <p>Improper nesting</p>
  <div id="duplicate"></div>
  <div id="duplicate"></div>
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
		<ToolActions onSample={loadExample} onClear={handleClear} {stats} />

		<!-- Status Summary -->
		{#if isValid !== null}
			<div class="flex flex-wrap items-center gap-4 p-4 rounded-2xl border transition-all
				{isValid ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'}">
				<div class="flex items-center gap-3">
					{#if isValid}
						<div class="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
							<svg class="h-6 w-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<div>
							<div class="font-semibold text-success">Valid HTML</div>
							<div class="text-sm text-base-content/50">No issues found</div>
						</div>
					{:else}
						<div class="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
							<svg class="h-6 w-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</div>
						<div>
							<div class="font-semibold text-error">Issues Found</div>
							<div class="text-sm text-base-content/50">Review the details below</div>
						</div>
					{/if}
				</div>
				
				<div class="flex-1"></div>
				
				<div class="flex gap-3">
					{#if errorCount > 0}
						<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-error/10">
							<span class="w-2 h-2 rounded-full bg-error"></span>
							<span class="text-sm font-medium">{errorCount} error{errorCount !== 1 ? 's' : ''}</span>
						</div>
					{/if}
					{#if warningCount > 0}
						<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10">
							<span class="w-2 h-2 rounded-full bg-warning"></span>
							<span class="text-sm font-medium">{warningCount} warning{warningCount !== 1 ? 's' : ''}</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}

		<!-- Issues List -->
		{#if issues.length > 0}
			<div class="space-y-2 max-h-60 overflow-y-auto">
				{#each issues as issue, i}
					<div class="flex items-start gap-3 p-3 rounded-xl transition-colors
						{issue.type === 'error' ? 'bg-error/5 hover:bg-error/10' : 'bg-warning/5 hover:bg-warning/10'}">
						<div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0
							{issue.type === 'error' ? 'bg-error/10' : 'bg-warning/10'}">
							{#if issue.type === 'error'}
								<svg class="h-4 w-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							{:else}
								<svg class="h-4 w-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
								</svg>
							{/if}
						</div>
						<div class="flex-1 min-w-0">
							<p class="font-medium text-sm">{issue.message}</p>
							{#if issue.line}
								<p class="text-xs text-base-content/50 mt-0.5">
									Line {issue.line}{issue.column ? `, column ${issue.column}` : ''}
								</p>
							{/if}
						</div>
						<span class="badge badge-ghost badge-sm">#{i + 1}</span>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Editor -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">HTML Input</h3>
			</div>
			<CodeMirrorEditor
				bind:value={input}
				language="html"
				placeholder="Paste your HTML here to validate..."
				errorLine={issues.find(i => i.type === 'error')?.line}
			/>
		</div>

		<!-- Note -->
		<div class="flex items-start gap-3 p-4 bg-base-200/50 rounded-xl border border-base-300/50">
			<div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
				<AppIcon name="triangle-alert" size={18} class="text-warning" />
			</div>
			<div>
				<h4 class="font-medium text-sm">Basic Validation</h4>
				<p class="mt-1 text-sm text-base-content/60">
					This validator checks for common issues like unclosed tags, duplicate IDs, and nesting problems. 
					It supports HTML5, SVG, and MathML elements. <strong>Not W3C-compliant.</strong>
				</p>
			</div>
		</div>
		<!-- Content Sections -->
		<div class="mt-12 space-y-6">
			<Features features={content.features} />
			<UseCases useCases={content.useCases} />
			<ConceptExplainer title={content.concept.title} content={content.concept.content} />
			<Examples examples={content.examples} />
			<FAQSection faqs={content.faqs} />
			{#if content.tips}
				<Tips tips={content.tips} />
			{/if}
			{#if content.commonMistakes}
				<CommonMistakes mistakes={content.commonMistakes} />
			{/if}
			<RelatedTools relatedTools={content.relatedTools} />
		</div>
	</div>
</ToolWrapper>
