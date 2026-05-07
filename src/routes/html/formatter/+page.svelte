<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { formatHTML, minifyHTML } from '$lib/utils/html';
	import { htmlToolsContent } from '$lib/config/content/html-tools-content';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';

	const content = htmlToolsContent['formatter'];

	let input = $state('');
	let output = $state('');
	let indentSize = $state(2);
	let error = $state<string | null>(null);
	let lastAction = $state<'prettify' | 'minify' | null>(null);

	function handlePrettify() {
		error = null;
		if (!input.trim()) {
			error = 'Please enter some HTML to format';
			return;
		}
		try {
			output = formatHTML(input, indentSize);
			lastAction = 'prettify';
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function handleMinify() {
		error = null;
		if (!input.trim()) {
			error = 'Please enter some HTML to minify';
			return;
		}
		try {
			output = minifyHTML(input);
			lastAction = 'minify';
		} catch (err) {
			error = (err as Error).message;
		}
	}

	function handleSwap() {
		if (output) {
			input = output;
			output = '';
			lastAction = null;
		}
	}

	function handleClear() {
		input = '';
		output = '';
		error = null;
		lastAction = null;
	}

	function loadExample() {
		input = `<div class="container"><header><h1>Title</h1></header><main><p>Content with <b>bold</b> text.</p><ul><li>Item 1</li><li>Item 2</li></ul></main><footer><p>&copy; 2024</p></footer></div>`;
		setTimeout(handlePrettify, 0);
	}

	// Stats
	const inputStats = $derived({
		chars: input.length,
		lines: input.split('\n').length
	});
	
	const outputStats = $derived({
		chars: output.length,
		lines: output.split('\n').length,
		savings: input.length > 0 ? Math.round((1 - output.length / input.length) * 100) : 0
	});

	// Auto-format on paste with debounce
	$effect(() => {
		if (input.trim() && !output) {
			const timer = setTimeout(() => {
				try {
					output = formatHTML(input, indentSize);
					lastAction = 'prettify';
				} catch {
					// Ignore auto-format errors
				}
			}, 500);
			return () => clearTimeout(timer);
		}
	});

	let stats = $derived({
		chars: input.length,
		lines: input.split('\n').length
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={handleClear} copyText={output} {stats} />

		<!-- Controls -->
		<div class="flex flex-wrap items-center gap-3">
			<div class="join">
				<button 
					type="button" 
					class="btn join-item {lastAction === 'prettify' ? 'btn-primary' : 'btn-ghost'}"
					onclick={handlePrettify}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
					</svg>
					Prettify
				</button>
				<button 
					type="button" 
					class="btn join-item {lastAction === 'minify' ? 'btn-secondary' : 'btn-ghost'}"
					onclick={handleMinify}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
					</svg>
					Minify
				</button>
			</div>

			<div class="flex items-center gap-2 px-3 py-1.5 bg-base-200 rounded-lg">
				<label for="indent" class="text-xs text-base-content/50">Indent:</label>
				<select id="indent" class="select select-ghost select-xs w-16" bind:value={indentSize}>
					<option value={2}>2</option>
					<option value={4}>4</option>
					<option value={8}>8</option>
				</select>
			</div>

			<div class="flex-1"></div>

			{#if output}
				<button type="button" class="btn btn-ghost btn-sm gap-1" onclick={handleSwap}>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
					</svg>
					Use Output
				</button>
			{/if}
		</div>

		<!-- Stats Bar (Minify) -->
		{#if output && lastAction === 'minify'}
			<div class="flex items-center gap-4 p-3 bg-success/5 border border-success/20 rounded-xl">
				<div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
					<svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
					</svg>
				</div>
				<div>
					<div class="font-medium text-success">
						{outputStats.savings > 0 ? `Reduced by ${outputStats.savings}%` : 'Already minimal'}
					</div>
					<div class="text-xs text-base-content/50">
						{inputStats.chars.toLocaleString()} → {outputStats.chars.toLocaleString()} characters
					</div>
				</div>
			</div>
		{/if}

		<!-- Error -->
		{#if error}
			<div class="flex items-center gap-3 p-3 bg-error/5 border border-error/20 rounded-xl">
				<svg class="h-5 w-5 text-error shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span class="text-sm">{error}</span>
			</div>
		{/if}

		<!-- Editors -->
		<div class="grid gap-6 lg:grid-cols-2">
			<div>
				<div class="flex items-center justify-between mb-2">
					<h3 class="text-sm font-medium text-base-content/70">Input</h3>
					<span class="text-xs text-base-content/40">{inputStats.lines} lines</span>
				</div>
				<CodeMirrorEditor bind:value={input} placeholder="Paste your HTML here..." />
			</div>

			<div>
				<div class="flex items-center justify-between mb-2">
					<h3 class="text-sm font-medium text-base-content/70">Output</h3>
					<span class="text-xs text-base-content/40">{outputStats.lines} lines</span>
				</div>
				<CodeMirrorEditor value={output} readonly placeholder="Formatted HTML will appear here..." />
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
