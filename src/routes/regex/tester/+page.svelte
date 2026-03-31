<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import { browser } from '$app/environment';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import { regexToolsContent } from '$lib/config/content/regex-tools-content';

	const content = regexToolsContent['tester'];

	let pattern = $state('');
	let testString = $state('');
	
	// Flags
	let flagG = $state(true);
	let flagI = $state(false);
	let flagM = $state(false);
	let flagS = $state(false);
	let flagU = $state(false);

	// Pattern history
	let patternHistory = $state<string[]>([]);
	let showHistory = $state(false);

	// Quick templates
	const quickTemplates = [
		{ name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
		{ name: 'URL', pattern: 'https?://[\\w.-]+(?:/[\\w./-]*)?' },
		{ name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}' },
		{ name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' },
		{ name: 'IP Address', pattern: '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}' },
		{ name: 'Hex Color', pattern: '#[0-9a-fA-F]{3,6}' },
		{ name: 'Digits Only', pattern: '\\d+' },
		{ name: 'Words Only', pattern: '\\w+' }
	];

	const samplePattern = '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b';
	const sampleText = `Contact us at:
hello@example.com
support@company.org
invalid.email@
john.doe@subdomain.domain.co.uk
test123@test.io`;

	let flags = $derived.by(() => {
		let f = '';
		if (flagG) f += 'g';
		if (flagI) f += 'i';
		if (flagM) f += 'm';
		if (flagS) f += 's';
		if (flagU) f += 'u';
		return f;
	});

	let regexError = $state<string | null>(null);

	// Performance tracking
	let executionTime = $state(0);

	// Compute matches without mutating state
	let matchResult = $derived.by(() => {
		if (!pattern || !testString) {
			return { matches: [] as { match: string; index: number; groups: string[] }[], error: null as string | null, time: 0 };
		}

		const start = performance.now();
		try {
			const regex = new RegExp(pattern, flags);
			const results: { match: string; index: number; groups: string[] }[] = [];
			
			if (flagG) {
				let match;
				while ((match = regex.exec(testString)) !== null) {
					results.push({
						match: match[0],
						index: match.index,
						groups: match.slice(1)
					});
					// Prevent infinite loop for zero-length matches
					if (match[0].length === 0) regex.lastIndex++;
				}
			} else {
				const match = regex.exec(testString);
				if (match) {
					results.push({
						match: match[0],
						index: match.index,
						groups: match.slice(1)
					});
				}
			}
			const elapsed = performance.now() - start;
			return { matches: results, error: null, time: elapsed };
		} catch (e) {
			return { matches: [], error: (e as Error).message, time: 0 };
		}
	});

	let matches = $derived(matchResult.matches);
	
	// Sync error state in effect
	$effect(() => {
		regexError = matchResult.error;
		executionTime = matchResult.time;
	});

	// Save to history when pattern changes
	$effect(() => {
		if (browser && pattern && pattern.length > 2 && !matchResult.error) {
			const saved = localStorage.getItem('regex-history');
			const history: string[] = saved ? JSON.parse(saved) : [];
			if (!history.includes(pattern)) {
				const newHistory = [pattern, ...history].slice(0, 10);
				localStorage.setItem('regex-history', JSON.stringify(newHistory));
				patternHistory = newHistory;
			}
		}
	});

	// Load history on mount
	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('regex-history');
			if (saved) {
				patternHistory = JSON.parse(saved);
			}
		}
	});

	let highlightedText = $derived.by(() => {
		if (!pattern || !testString || matches.length === 0) return escapeHtml(testString);
		
		let result = '';
		let lastEnd = 0;
		
		for (let i = 0; i < matches.length; i++) {
			const m = matches[i];
			result += escapeHtml(testString.slice(lastEnd, m.index));
			// Alternate colors for consecutive matches
			const colorClass = i % 2 === 0 
				? 'bg-gradient-to-r from-success/40 to-success/30' 
				: 'bg-gradient-to-r from-primary/40 to-primary/30';
			result += `<mark class="${colorClass} text-base-content px-0.5 rounded animate-pulse-subtle">${escapeHtml(m.match)}</mark>`;
			lastEnd = m.index + m.match.length;
		}
		result += escapeHtml(testString.slice(lastEnd));
		return result;
	});

	function escapeHtml(str: string): string {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function loadSample() {
		pattern = samplePattern;
		testString = sampleText;
	}

	function clearAll() {
		pattern = '';
		testString = '';
		flagG = true;
		flagI = false;
		flagM = false;
		flagS = false;
		flagU = false;
	}

	function loadTemplate(p: string) {
		pattern = p;
	}

	function loadFromHistory(p: string) {
		pattern = p;
		showHistory = false;
	}

	function clearHistory() {
		if (browser) {
			localStorage.removeItem('regex-history');
			patternHistory = [];
		}
	}

	let stats = $derived({
		chars: testString.length,
		lines: testString ? testString.split('\n').length : 0
	});

	// Flag button configuration
	const flagButtons = [
		{ key: 'g', label: 'g', title: 'Global - find all matches', icon: '🌐' },
		{ key: 'i', label: 'i', title: 'Case insensitive', icon: '🔤' },
		{ key: 'm', label: 'm', title: 'Multiline - ^ and $ match line starts/ends', icon: '📝' },
		{ key: 's', label: 's', title: 'Dotall - . matches newlines', icon: '⏎' },
		{ key: 'u', label: 'u', title: 'Unicode - enable unicode support', icon: '🌍' }
	];

	function toggleFlag(key: string) {
		switch (key) {
			case 'g': flagG = !flagG; break;
			case 'i': flagI = !flagI; break;
			case 'm': flagM = !flagM; break;
			case 's': flagS = !flagS; break;
			case 'u': flagU = !flagU; break;
		}
	}

	function getFlagState(key: string): boolean {
		switch (key) {
			case 'g': return flagG;
			case 'i': return flagI;
			case 'm': return flagM;
			case 's': return flagS;
			case 'u': return flagU;
			default: return false;
		}
	}

	// Pattern validity
	let isPatternValid = $derived(!regexError && pattern.length > 0);

	// Copy shareable URL
	function copyShareUrl() {
		if (browser) {
			const url = new URL(window.location.href);
			url.searchParams.set('p', encodeURIComponent(pattern));
			url.searchParams.set('t', encodeURIComponent(testString));
			url.searchParams.set('f', flags);
			navigator.clipboard.writeText(url.toString());
		}
	}

	// Load from URL params on mount
	$effect(() => {
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			const p = params.get('p');
			const t = params.get('t');
			const f = params.get('f');
			if (p) pattern = decodeURIComponent(p);
			if (t) testString = decodeURIComponent(t);
			if (f) {
				flagG = f.includes('g');
				flagI = f.includes('i');
				flagM = f.includes('m');
				flagS = f.includes('s');
				flagU = f.includes('u');
			}
		}
	});
</script>

<style>
	@keyframes pulse-subtle {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.85; }
	}
	:global(.animate-pulse-subtle) {
		animation: pulse-subtle 2s ease-in-out infinite;
	}
</style>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Pattern Section -->
		<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-2xl">
			<div class="card-body">
				<!-- Pattern Header -->
				<div class="flex items-center justify-between mb-4">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
							<span class="text-xl">🧪</span>
						</div>
						<div>
							<h3 class="font-bold">Regular Expression</h3>
							<p class="text-xs text-base-content/50">Enter your pattern below</p>
						</div>
					</div>
					<!-- Pattern Status Indicator -->
					<div class="flex items-center gap-2">
						{#if pattern}
							{#if isPatternValid}
								<div class="flex items-center gap-1.5 text-success text-sm">
									<svg class="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Valid
								</div>
							{:else}
								<div class="flex items-center gap-1.5 text-error text-sm">
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Invalid
								</div>
							{/if}
						{/if}
					</div>
				</div>

				<!-- Pattern Input with Decorators -->
				<div class="flex items-center gap-2 bg-base-100 rounded-xl p-2">
					<span class="text-2xl text-primary/70 font-mono font-bold pl-2">/</span>
					<input
						type="text"
						bind:value={pattern}
						placeholder="Enter your regex pattern..."
						class="input input-ghost flex-1 font-mono text-sm focus:outline-none bg-transparent"
						class:text-error={regexError}
						spellcheck="false"
					/>
					<span class="text-2xl text-primary/70 font-mono font-bold">/{flags}</span>
					<CopyButton text={pattern} size="sm" />
				</div>

				{#if regexError}
					<div class="mt-2 p-3 rounded-lg bg-error/10 border border-error/20">
						<p class="text-error text-sm flex items-center gap-2">
							<svg class="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<circle cx="12" cy="12" r="10" stroke-width="2" />
								<path stroke-linecap="round" stroke-width="2" d="M12 8v4m0 4h.01" />
							</svg>
							{regexError}
						</p>
					</div>
				{/if}

				<!-- Quick Templates & History -->
				<div class="flex flex-wrap gap-2 mt-3">
					<div class="dropdown">
						<button tabindex="0" class="btn btn-sm btn-outline gap-1">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
							</svg>
							Templates
						</button>
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-56">
							{#each quickTemplates as tmpl}
								<li>
									<button onclick={() => loadTemplate(tmpl.pattern)} class="text-sm">
										{tmpl.name}
									</button>
								</li>
							{/each}
						</ul>
					</div>

					{#if patternHistory.length > 0}
						<div class="dropdown">
							<button tabindex="0" class="btn btn-sm btn-outline gap-1">
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								History
							</button>
							<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
							<ul tabindex="0" class="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-box w-72">
								{#each patternHistory as h}
									<li>
										<button onclick={() => loadFromHistory(h)} class="font-mono text-xs truncate">
											{h}
										</button>
									</li>
								{/each}
								<div class="divider my-1"></div>
								<li>
									<button onclick={clearHistory} class="text-error text-sm">
										Clear History
									</button>
								</li>
							</ul>
						</div>
					{/if}

					{#if pattern && testString}
						<button 
							class="btn btn-sm btn-ghost gap-1"
							onclick={copyShareUrl}
							title="Copy shareable URL"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
							</svg>
							Share
						</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Flags -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold text-base-content/70 mb-3">Pattern Flags</h4>
				<div class="flex flex-wrap gap-2">
					{#each flagButtons as flag}
						<button
							type="button"
							class="btn gap-2 transition-all duration-200"
							class:btn-primary={getFlagState(flag.key)}
							class:btn-ghost={!getFlagState(flag.key)}
							class:shadow-lg={getFlagState(flag.key)}
							class:scale-105={getFlagState(flag.key)}
							onclick={() => toggleFlag(flag.key)}
							title={flag.title}
						>
							<span>{flag.icon}</span>
							<span class="font-mono font-bold">{flag.label}</span>
						</button>
					{/each}
				</div>
				<p class="text-xs text-base-content/50 mt-3">
					Active flags:
					{#if flags}
						<code class="ml-1 px-2 py-0.5 bg-base-300 rounded font-mono">/{flags}</code>
					{:else}
						<span class="ml-1 text-warning">none</span>
					{/if}
				</p>
			</div>
		</div>

		<!-- Test String -->
		<div>
			<label class="text-sm font-medium text-base-content/70 mb-2 block">Test String</label>
			<textarea
				bind:value={testString}
				placeholder="Enter text to test against..."
				class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-y focus:border-primary transition-colors"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Match Results -->
		{#if pattern && testString}
			<div class="card bg-gradient-to-br from-base-200 via-base-200 to-base-300 rounded-2xl overflow-hidden">
				<div class="card-body py-4">
					<!-- Results Header -->
					<div class="flex flex-wrap items-center justify-between gap-3 mb-4">
						<div class="flex items-center gap-3">
							<h3 class="font-bold text-lg">Match Results</h3>
							{#if matches.length > 0}
								<div class="badge badge-success badge-lg gap-1 animate-pulse">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
									</svg>
									{matches.length} match{matches.length !== 1 ? 'es' : ''}
								</div>
							{:else if !regexError}
								<div class="badge badge-warning badge-lg gap-1">
									<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
										<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
									</svg>
									No matches
								</div>
							{/if}
						</div>
						<div class="flex items-center gap-3">
							{#if executionTime > 0}
								<span class="text-xs text-base-content/50 flex items-center gap-1">
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
									</svg>
									{executionTime.toFixed(2)}ms
								</span>
							{/if}
							{#if matches.length > 0}
								<CopyButton text={matches.map(m => m.match).join('\n')} label="Copy All" size="sm" />
							{/if}
						</div>
					</div>
					
					<!-- Highlighted Text Preview -->
					<div class="p-4 rounded-xl bg-base-100 font-mono text-sm whitespace-pre-wrap break-words max-h-72 overflow-y-auto border border-base-300">
						{@html highlightedText || '<span class="text-base-content/40">Enter pattern and text to see matches</span>'}
					</div>
				</div>
			</div>
		{/if}

		<!-- Match Details Table -->
		{#if matches.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3 flex items-center gap-2">
						<svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
						</svg>
						Match Details
					</h3>
					<div class="overflow-x-auto">
						<table class="table table-sm table-zebra">
							<thead>
								<tr>
									<th class="w-12">#</th>
									<th>Match</th>
									<th class="w-24">Position</th>
									<th class="w-20">Length</th>
									{#if matches.some(m => m.groups.length > 0)}
										<th>Groups</th>
									{/if}
								</tr>
							</thead>
							<tbody>
								{#each matches as m, i}
									<tr class="hover">
										<td class="font-mono text-base-content/50">{i + 1}</td>
										<td class="font-mono">
											<div class="flex items-center gap-2">
												<code class="bg-success/20 px-2 py-1 rounded text-success-content">{m.match}</code>
												<CopyButton text={m.match} size="xs" />
											</div>
										</td>
										<td class="font-mono text-base-content/60">{m.index}</td>
										<td class="font-mono text-base-content/60">{m.match.length}</td>
										{#if matches.some(m => m.groups.length > 0)}
											<td class="font-mono">
												<div class="flex flex-wrap gap-1">
													{#each m.groups as group, gi}
														<span class="badge badge-sm badge-outline gap-1">
															${gi + 1}: {group}
														</span>
													{/each}
												</div>
											</td>
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- Quick Reference -->
		<div class="card bg-gradient-to-r from-base-200 to-base-300 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<span>📚</span> Quick Reference
				</h4>
				<div class="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
					<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-success">.</code>
						<span class="text-base-content/70">any char</span>
					</div>
					<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-success">\d</code>
						<span class="text-base-content/70">digit</span>
					</div>
					<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-success">\w</code>
						<span class="text-base-content/70">word char</span>
					</div>
					<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-success">\s</code>
						<span class="text-base-content/70">whitespace</span>
					</div>
					<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-info">^</code>
						<span class="text-base-content/70">start</span>
					</div>
					<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-info">$</code>
						<span class="text-base-content/70">end</span>
					</div>
					<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-warning">*</code>
						<span class="text-base-content/70">0 or more</span>
					</div>
					<div class="flex items-center gap-2 p-2 bg-base-100 rounded-lg">
						<code class="bg-base-300 px-1.5 py-0.5 rounded font-bold text-warning">+</code>
						<span class="text-base-content/70">1 or more</span>
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
