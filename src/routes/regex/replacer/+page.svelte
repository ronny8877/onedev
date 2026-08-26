<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { regexToolsContent } from '$lib/config/content/regex-tools-content';

	const content = regexToolsContent['replacer'];

	let pattern = $state('');
	let replacement = $state('');
	let testString = $state('');
	
	// Flags
	let flagG = $state(true);
	let flagI = $state(false);
	let flagM = $state(false);

	// View options
	let viewMode = $state<'preview' | 'sidebyside' | 'diff'>('preview');

	// Replacement history (undo stack)
	let undoStack = $state<string[]>([]);

	// Replacement templates
	const replacementTemplates = [
		{ name: '$1, $2 - Capture groups', value: '$1-$2' },
		{ name: '$& - Entire match', value: '[$&]' },
		{ name: '$` - Before match', value: '$`' },
		{ name: '$\' - After match', value: '$\'' },
		{ name: 'Uppercase wrapper', value: '<<$&>>' },
		{ name: 'Remove match', value: '' }
	];

	const samplePattern = '\\b(\\w+)@(\\w+\\.\\w+)\\b';
	const sampleReplacement = '[$1 at $2]';
	const sampleText = `Contact: john@example.com
Support: help@company.org
Sales: sales@business.net`;

	let flags = $derived.by(() => {
		let f = '';
		if (flagG) f += 'g';
		if (flagI) f += 'i';
		if (flagM) f += 'm';
		return f;
	});

	let regexError = $state<string | null>(null);

	let matchCount = $derived.by(() => {
		if (!pattern || !testString) return 0;
		try {
			const regex = new RegExp(pattern, 'g' + (flagI ? 'i' : '') + (flagM ? 'm' : ''));
			const matches = testString.match(regex);
			return matches ? matches.length : 0;
		} catch {
			return 0;
		}
	});

	// Compute result without mutating state
	let replaceResult = $derived.by(() => {
		if (!pattern || !testString) {
			return { result: testString, error: null as string | null };
		}

		try {
			const regex = new RegExp(pattern, flags);
			return { result: testString.replace(regex, replacement), error: null };
		} catch (e) {
			return { result: testString, error: (e as Error).message };
		}
	});

	let result = $derived(replaceResult.result);
	
	// Sync error state in effect
	$effect(() => {
		regexError = replaceResult.error;
	});

	// Statistics
	let statistics = $derived({
		matchCount,
		charsChanged: Math.abs(result.length - testString.length),
		percentChanged: testString.length > 0 
			? Math.round((Math.abs(result.length - testString.length) / testString.length) * 100)
			: 0
	});

	// Generate inline diff
	let inlineDiff = $derived.by(() => {
		if (!pattern || !testString || result === testString) return [];
		
		try {
			const regex = new RegExp(pattern, flags);
			const parts: { type: 'same' | 'removed' | 'added'; text: string }[] = [];
			let lastIndex = 0;
			
			// Get all matches
			const matches: { index: number; match: string; replacement: string }[] = [];
			let match;
			const globalRegex = new RegExp(pattern, 'g' + (flagI ? 'i' : '') + (flagM ? 'm' : ''));
			while ((match = globalRegex.exec(testString)) !== null) {
				const rep = match[0].replace(new RegExp(pattern, flags.replace('g', '')), replacement);
				matches.push({ index: match.index, match: match[0], replacement: rep });
				if (match[0].length === 0) globalRegex.lastIndex++;
			}
			
			for (const m of matches) {
				// Text before match
				if (m.index > lastIndex) {
					parts.push({ type: 'same', text: testString.slice(lastIndex, m.index) });
				}
				// Removed (original)
				parts.push({ type: 'removed', text: m.match });
				// Added (replacement)
				if (m.replacement) {
					parts.push({ type: 'added', text: m.replacement });
				}
				lastIndex = m.index + m.match.length;
			}
			
			// Remaining text
			if (lastIndex < testString.length) {
				parts.push({ type: 'same', text: testString.slice(lastIndex) });
			}
			
			return parts;
		} catch {
			return [];
		}
	});

	// Generate line-by-line diff
	let lineDiff = $derived.by(() => {
		if (!pattern || !testString || result === testString) return [];
		
		const originalLines = testString.split('\n');
		const resultLines = result.split('\n');
		const diff: { type: 'same' | 'removed' | 'added' | 'modified'; original?: string; modified?: string }[] = [];
		
		const maxLines = Math.max(originalLines.length, resultLines.length);
		for (let i = 0; i < maxLines; i++) {
			const orig = originalLines[i];
			const res = resultLines[i];
			
			if (orig === res) {
				if (orig !== undefined) {
					diff.push({ type: 'same', original: orig });
				}
			} else if (orig !== undefined && res !== undefined) {
				diff.push({ type: 'modified', original: orig, modified: res });
			} else if (orig !== undefined) {
				diff.push({ type: 'removed', original: orig });
			} else if (res !== undefined) {
				diff.push({ type: 'added', modified: res });
			}
		}
		return diff;
	});

	function loadSample() {
		pattern = samplePattern;
		replacement = sampleReplacement;
		testString = sampleText;
	}

	function clearAll() {
		pattern = '';
		replacement = '';
		testString = '';
		flagG = true;
		flagI = false;
		flagM = false;
		undoStack = [];
	}

	function applyReplace() {
		undoStack = [...undoStack, testString];
		testString = result;
	}

	function undo() {
		if (undoStack.length > 0) {
			const prev = undoStack[undoStack.length - 1];
			undoStack = undoStack.slice(0, -1);
			testString = prev;
		}
	}

	function useTemplate(value: string) {
		replacement = value;
	}

	let stats = $derived({
		chars: testString.length,
		lines: testString ? testString.split('\n').length : 0
	});

	let hasChanges = $derived(result !== testString);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Pattern & Replacement Section -->
		<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-2xl">
			<div class="card-body">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
						<AppIcon name="refresh-cw" size={20} />
					</div>
					<div>
						<h3 class="font-bold">Find & Replace</h3>
						<p class="text-xs text-base-content/50">Use regex patterns with capture group replacements</p>
					</div>
				</div>

				<div class="grid sm:grid-cols-2 gap-4">
					<!-- Find Pattern -->
					<div>
						<label class="text-sm font-medium text-base-content/70 mb-2 block">Find Pattern</label>
						<div class="flex items-center gap-2 bg-base-100 rounded-xl p-2">
							<span class="text-xl text-warning/70 font-mono font-bold pl-2">/</span>
							<input
								type="text"
								bind:value={pattern}
								placeholder="Regex pattern..."
								class="input input-ghost flex-1 font-mono text-sm focus:outline-none bg-transparent"
								class:text-error={regexError}
								spellcheck="false"
							/>
							<span class="text-xl text-warning/70 font-mono font-bold">/</span>
						</div>
					</div>
					
					<!-- Replace With -->
					<div>
						<label class="text-sm font-medium text-base-content/70 mb-2 block">Replace With</label>
						<div class="flex items-center gap-2 bg-base-100 rounded-xl p-2">
							<input
								type="text"
								bind:value={replacement}
								placeholder="Use $1, $2 for groups..."
								class="input input-ghost flex-1 font-mono text-sm focus:outline-none bg-transparent"
								spellcheck="false"
							/>
							<div class="dropdown dropdown-end">
								<button tabindex="0" class="btn btn-ghost btn-xs">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
									</svg>
								</button>
								<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
								<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-56">
									{#each replacementTemplates as tmpl}
										<li>
											<button onclick={() => useTemplate(tmpl.value)} class="text-sm">
												<code class="bg-base-300 px-1 rounded text-xs">{tmpl.value || '(empty)'}</code>
												{tmpl.name.split(' - ')[0]}
											</button>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				</div>

				{#if regexError}
					<div class="mt-2 p-3 rounded-lg bg-error/10 border border-error/20">
						<p class="text-error text-sm">{regexError}</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Flags & Stats -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="flex flex-wrap items-center gap-3">
				<label class="flex items-center gap-2 cursor-pointer bg-base-200 px-4 py-2 rounded-xl hover:bg-base-300 transition-colors">
					<input type="checkbox" bind:checked={flagG} class="checkbox checkbox-sm checkbox-warning" />
					<span class="text-sm">Replace All</span>
					<span class="badge badge-ghost badge-sm font-mono">g</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer bg-base-200 px-4 py-2 rounded-xl hover:bg-base-300 transition-colors">
					<input type="checkbox" bind:checked={flagI} class="checkbox checkbox-sm checkbox-warning" />
					<span class="text-sm">Case insensitive</span>
					<span class="badge badge-ghost badge-sm font-mono">i</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer bg-base-200 px-4 py-2 rounded-xl hover:bg-base-300 transition-colors">
					<input type="checkbox" bind:checked={flagM} class="checkbox checkbox-sm checkbox-warning" />
					<span class="text-sm">Multiline</span>
					<span class="badge badge-ghost badge-sm font-mono">m</span>
				</label>
			</div>
			
			{#if matchCount > 0}
				<div class="flex items-center gap-2">
					<span class="badge badge-warning badge-lg">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
				</div>
			{/if}
		</div>

		<!-- Input Text -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<label class="text-sm font-medium text-base-content/70">Input Text</label>
				{#if undoStack.length > 0}
					<button class="btn btn-ghost btn-xs gap-1" onclick={undo}>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
						</svg>
						Undo ({undoStack.length})
					</button>
				{/if}
			</div>
			<textarea
				bind:value={testString}
				placeholder="Enter text to perform replacements on..."
				class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-y focus:border-warning transition-colors"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Statistics Pills -->
		{#if hasChanges}
			<div class="flex flex-wrap gap-2">
				<div class="badge badge-lg badge-outline gap-1">
					<svg class="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
					</svg>
					{statistics.matchCount} replacement{statistics.matchCount !== 1 ? 's' : ''}
				</div>
				<div class="badge badge-lg badge-outline gap-1">
					{#if result.length > testString.length}
						<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
						</svg>
					{:else if result.length < testString.length}
						<svg class="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
						</svg>
					{:else}
						<svg class="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
						</svg>
					{/if}
					{statistics.charsChanged} chars {result.length > testString.length ? 'added' : result.length < testString.length ? 'removed' : 'changed'}
				</div>
				<div class="badge badge-lg badge-outline">
					{statistics.percentChanged}% size change
				</div>
			</div>
		{/if}

		<!-- View Mode Toggle -->
		{#if pattern && testString}
			<div class="flex items-center justify-between">
				<div class="join">
					<button 
						class="join-item btn btn-sm"
						class:btn-active={viewMode === 'preview'}
						onclick={() => viewMode = 'preview'}
					>
						Preview
					</button>
					<button 
						class="join-item btn btn-sm"
						class:btn-active={viewMode === 'sidebyside'}
						onclick={() => viewMode = 'sidebyside'}
					>
						Side by Side
					</button>
					<button 
						class="join-item btn btn-sm"
						class:btn-active={viewMode === 'diff'}
						onclick={() => viewMode = 'diff'}
					>
						Diff
					</button>
				</div>
				
				<div class="flex items-center gap-2">
					{#if hasChanges}
						<button class="btn btn-warning btn-sm gap-1" onclick={applyReplace}>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
							</svg>
							Apply Changes
						</button>
					{/if}
					<CopyButton text={result} label="Copy Result" size="sm" />
				</div>
			</div>
		{/if}

		<!-- Preview Mode -->
		{#if pattern && testString && viewMode === 'preview'}
			<div class="card bg-gradient-to-br from-base-200 via-base-200 to-base-300 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center gap-2 mb-3">
						<h3 class="font-bold">Result Preview</h3>
						{#if hasChanges}
							<span class="badge badge-success badge-sm">Changed</span>
						{:else}
							<span class="badge badge-warning badge-sm">No changes</span>
						{/if}
					</div>
					
					<div class="p-4 rounded-xl bg-base-100 font-mono text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto border border-base-300">
						{result || testString}
					</div>
				</div>
			</div>
		{/if}

		<!-- Side by Side View -->
		{#if pattern && testString && viewMode === 'sidebyside'}
			<div class="grid md:grid-cols-2 gap-4">
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body py-4">
						<h3 class="font-semibold text-error/80 flex items-center gap-2 mb-3">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Original
						</h3>
						<div class="p-3 rounded-lg bg-error/5 border border-error/20 font-mono text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
							{testString}
						</div>
					</div>
				</div>
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body py-4">
						<h3 class="font-semibold text-success/80 flex items-center gap-2 mb-3">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Result
						</h3>
						<div class="p-3 rounded-lg bg-success/5 border border-success/20 font-mono text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
							{result}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Diff View -->
		{#if pattern && testString && viewMode === 'diff' && hasChanges}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3 flex items-center gap-2">
						<svg class="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
						Inline Changes
					</h3>
					
					<div class="p-4 rounded-xl bg-base-100 font-mono text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto border border-base-300">
						{#each inlineDiff as part}
							{#if part.type === 'same'}
								<span>{part.text}</span>
							{:else if part.type === 'removed'}
								<span class="bg-error/30 text-error-content line-through px-0.5 rounded">{part.text}</span>
							{:else if part.type === 'added'}
								<span class="bg-success/30 text-success-content px-0.5 rounded">{part.text}</span>
							{/if}
						{/each}
					</div>

					<!-- Line-by-Line Diff -->
					<div class="divider text-xs text-base-content/50">Line Changes</div>
					
					<div class="p-4 rounded-xl bg-base-300/50 font-mono text-sm max-h-60 overflow-y-auto space-y-0.5">
						{#each lineDiff as line}
							{#if line.type === 'same'}
								<div class="text-base-content/70 px-2 py-0.5">
									<span class="mr-2 opacity-30">&nbsp;</span>{line.original}
								</div>
							{:else if line.type === 'removed'}
								<div class="bg-error/20 text-error-content px-2 py-0.5 rounded">
									<span class="text-error mr-2">−</span>{line.original}
								</div>
							{:else if line.type === 'added'}
								<div class="bg-success/20 text-success-content px-2 py-0.5 rounded">
									<span class="text-success mr-2">+</span>{line.modified}
								</div>
							{:else if line.type === 'modified'}
								<div class="bg-error/20 text-error-content px-2 py-0.5 rounded">
									<span class="text-error mr-2">−</span>{line.original}
								</div>
								<div class="bg-success/20 text-success-content px-2 py-0.5 rounded">
									<span class="text-success mr-2">+</span>{line.modified}
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Replacement Patterns Reference -->
		<div class="card bg-gradient-to-r from-base-200 to-base-300 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<AppIcon name="file-pen" size={16} /> Replacement Patterns
				</h4>
				<div class="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
					<div class="bg-base-100 p-2 rounded-lg flex items-center gap-2">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-primary">$1, $2</code>
						<span class="text-base-content/70 text-xs">Capture groups</span>
					</div>
					<div class="bg-base-100 p-2 rounded-lg flex items-center gap-2">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-primary">$&</code>
						<span class="text-base-content/70 text-xs">Entire match</span>
					</div>
					<div class="bg-base-100 p-2 rounded-lg flex items-center gap-2">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-primary">$`</code>
						<span class="text-base-content/70 text-xs">Before match</span>
					</div>
					<div class="bg-base-100 p-2 rounded-lg flex items-center gap-2">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-primary">$'</code>
						<span class="text-base-content/70 text-xs">After match</span>
					</div>
					<div class="bg-base-100 p-2 rounded-lg flex items-center gap-2">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-primary">$$</code>
						<span class="text-base-content/70 text-xs">Literal $</span>
					</div>
					<div class="bg-base-100 p-2 rounded-lg flex items-center gap-2">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-primary">$&lt;name&gt;</code>
						<span class="text-base-content/70 text-xs">Named group</span>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-12 space-y-12">
		<Features features={content.features} />
		<UseCases useCases={content.useCases} />
		<ConceptExplainer title={content.concept.title} content={content.concept.content} />
		<Examples examples={content.examples} />
		<FAQSection faqs={content.faqs} />
		<RelatedTools relatedTools={content.relatedTools} />
		{#if content.tips}
			<Tips tips={content.tips} />
		{/if}
	</div>
</ToolWrapper>
