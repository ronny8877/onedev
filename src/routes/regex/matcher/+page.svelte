<script lang="ts">
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
	import { regexToolsContent } from '$lib/config/content/regex-tools-content';

	const content = regexToolsContent['matcher'];

	let pattern = $state('');
	let testString = $state('');
	
	// Flags
	let flagG = $state(true);
	let flagI = $state(false);
	let flagM = $state(false);

	// View mode
	let viewMode = $state<'cards' | 'table'>('cards');
	let showUniqueOnly = $state(false);
	let sortBy = $state<'position' | 'length' | 'alpha'>('position');

	const samplePattern = '(?<user>\\w+)@(?<domain>\\w+)\\.(?<tld>\\w+)';
	const sampleText = `user1@gmail.com
admin@company.org
test.user@domain.co
support@helpdesk.net
user1@gmail.com
contact@business.io`;

	let flags = $derived.by(() => {
		let f = 'g'; // Always global for matcher
		if (flagI) f += 'i';
		if (flagM) f += 'm';
		return f;
	});

	let regexError = $state<string | null>(null);

	interface MatchResult {
		fullMatch: string;
		index: number;
		groups: { index: number; name: string | null; value: string }[];
	}

	// Compute matches without mutating state
	let matchResult = $derived.by(() => {
		if (!pattern || !testString) {
			return { matches: [] as MatchResult[], error: null as string | null };
		}

		try {
			const regex = new RegExp(pattern, flags);
			const results: MatchResult[] = [];
			
			let match;
			while ((match = regex.exec(testString)) !== null) {
				const groups: { index: number; name: string | null; value: string }[] = [];
				
				// Handle named groups
				if (match.groups) {
					Object.entries(match.groups).forEach(([name, value]) => {
						if (value !== undefined) {
							groups.push({ index: groups.length + 1, name, value });
						}
					});
				} else {
					for (let i = 1; i < match.length; i++) {
						if (match[i] !== undefined) {
							groups.push({ index: i, name: null, value: match[i] });
						}
					}
				}
				
				results.push({
					fullMatch: match[0],
					index: match.index,
					groups
				});
				if (match[0].length === 0) regex.lastIndex++;
			}
			return { matches: results, error: null };
		} catch (e) {
			return { matches: [], error: (e as Error).message };
		}
	});

	let matches = $derived(matchResult.matches);
	
	// Sync error state in effect
	$effect(() => {
		regexError = matchResult.error;
	});

	// Filtered and sorted matches
	let processedMatches = $derived.by(() => {
		let result = [...matches];
		
		// Filter unique
		if (showUniqueOnly) {
			const seen = new Set<string>();
			result = result.filter(m => {
				if (seen.has(m.fullMatch)) return false;
				seen.add(m.fullMatch);
				return true;
			});
		}
		
		// Sort
		switch (sortBy) {
			case 'length':
				result.sort((a, b) => b.fullMatch.length - a.fullMatch.length);
				break;
			case 'alpha':
				result.sort((a, b) => a.fullMatch.localeCompare(b.fullMatch));
				break;
			case 'position':
			default:
				result.sort((a, b) => a.index - b.index);
		}
		
		return result;
	});

	// Statistics
	let statistics = $derived({
		totalMatches: matches.length,
		uniqueMatches: new Set(matches.map(m => m.fullMatch)).size,
		totalGroups: matches.reduce((sum, m) => sum + m.groups.length, 0),
		avgMatchLength: matches.length > 0 
			? Math.round(matches.reduce((sum, m) => sum + m.fullMatch.length, 0) / matches.length)
			: 0,
		longestMatch: matches.length > 0
			? matches.reduce((max, m) => m.fullMatch.length > max.length ? m.fullMatch : max, '')
			: '',
		shortestMatch: matches.length > 0
			? matches.reduce((min, m) => m.fullMatch.length < min.length ? m.fullMatch : min, matches[0]?.fullMatch || '')
			: ''
	});

	// Export formats
	function exportAsJSON(): string {
		return JSON.stringify(processedMatches.map(m => ({
			match: m.fullMatch,
			index: m.index,
			groups: m.groups.reduce((acc, g) => ({ 
				...acc, 
				[g.name || `$${g.index}`]: g.value 
			}), {})
		})), null, 2);
	}

	function exportAsCSV(): string {
		if (processedMatches.length === 0) return '';
		
		const maxGroups = Math.max(...processedMatches.map(m => m.groups.length), 0);
		const headers = ['Match', 'Index', ...Array.from({ length: maxGroups }, (_, i) => `Group ${i + 1}`)];
		
		const rows = processedMatches.map(m => {
			const groups = Array.from({ length: maxGroups }, (_, i) => {
				const group = m.groups.find(g => g.index === i + 1);
				return group ? `"${group.value.replace(/"/g, '""')}"` : '';
			});
			return [`"${m.fullMatch.replace(/"/g, '""')}"`, m.index, ...groups].join(',');
		});
		
		return [headers.join(','), ...rows].join('\n');
	}

	function exportAsPlain(): string {
		return processedMatches.map(m => m.fullMatch).join('\n');
	}

	function downloadFile(content: string, filename: string, mimeType: string) {
		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}

	function loadSample() {
		pattern = samplePattern;
		testString = sampleText;
	}

	function clearAll() {
		pattern = '';
		testString = '';
		flagI = false;
		flagM = false;
	}

	let stats = $derived({
		chars: testString.length,
		lines: testString ? testString.split('\n').length : 0
	});

	let expandedMatches = $state<Set<number>>(new Set());

	function toggleMatch(index: number) {
		const newSet = new Set(expandedMatches);
		if (newSet.has(index)) {
			newSet.delete(index);
		} else {
			newSet.add(index);
		}
		expandedMatches = newSet;
	}

	function expandAll() {
		expandedMatches = new Set(processedMatches.map((_, i) => i));
	}

	function collapseAll() {
		expandedMatches = new Set();
	}

	// Color palette for match cards
	const cardColors = [
		'from-primary/10 to-primary/5',
		'from-secondary/10 to-secondary/5',
		'from-accent/10 to-accent/5',
		'from-success/10 to-success/5',
		'from-info/10 to-info/5'
	];
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Pattern Input Section -->
		<div class="card bg-gradient-to-br from-base-200 to-base-300 rounded-2xl">
			<div class="card-body">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
						<span class="text-xl">🎯</span>
					</div>
					<div>
						<h3 class="font-bold">Pattern with Capture Groups</h3>
						<p class="text-xs text-base-content/50">Use (...) for groups, (?&lt;name&gt;...) for named groups</p>
					</div>
				</div>

				<div class="flex items-center gap-2 bg-base-100 rounded-xl p-2">
					<span class="text-2xl text-accent/70 font-mono font-bold pl-2">/</span>
					<input
						type="text"
						bind:value={pattern}
						placeholder="Enter regex with capture groups, e.g. (\\w+)@(\\w+)"
						class="input input-ghost flex-1 font-mono text-sm focus:outline-none bg-transparent"
						class:text-error={regexError}
						spellcheck="false"
					/>
					<span class="text-2xl text-accent/70 font-mono font-bold">/{flags}</span>
				</div>
				
				{#if regexError}
					<div class="mt-2 p-3 rounded-lg bg-error/10 border border-error/20">
						<p class="text-error text-sm">{regexError}</p>
					</div>
				{/if}
			</div>
		</div>

		<!-- Flags -->
		<div class="flex flex-wrap items-center gap-4 px-1">
			<label class="flex items-center gap-2 cursor-pointer bg-base-200 px-4 py-2 rounded-xl hover:bg-base-300 transition-colors">
				<input type="checkbox" bind:checked={flagI} class="checkbox checkbox-sm checkbox-primary" />
				<span class="text-sm">Case insensitive</span>
				<span class="badge badge-ghost badge-sm font-mono">i</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer bg-base-200 px-4 py-2 rounded-xl hover:bg-base-300 transition-colors">
				<input type="checkbox" bind:checked={flagM} class="checkbox checkbox-sm checkbox-primary" />
				<span class="text-sm">Multiline</span>
				<span class="badge badge-ghost badge-sm font-mono">m</span>
			</label>
		</div>

		<!-- Test String -->
		<div>
			<label class="text-sm font-medium text-base-content/70 mb-2 block">Test String</label>
			<textarea
				bind:value={testString}
				placeholder="Enter text to extract matches from..."
				class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-y focus:border-accent transition-colors"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Statistics Dashboard -->
		{#if matches.length > 0}
			<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
				<div class="card bg-gradient-to-br from-success/20 to-success/10 rounded-xl p-4 text-center">
					<div class="text-2xl font-bold text-success">{statistics.totalMatches}</div>
					<div class="text-xs text-base-content/60">Total Matches</div>
				</div>
				<div class="card bg-gradient-to-br from-info/20 to-info/10 rounded-xl p-4 text-center">
					<div class="text-2xl font-bold text-info">{statistics.uniqueMatches}</div>
					<div class="text-xs text-base-content/60">Unique</div>
				</div>
				<div class="card bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl p-4 text-center">
					<div class="text-2xl font-bold text-primary">{statistics.totalGroups}</div>
					<div class="text-xs text-base-content/60">Groups Found</div>
				</div>
				<div class="card bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl p-4 text-center">
					<div class="text-2xl font-bold text-secondary">{statistics.avgMatchLength}</div>
					<div class="text-xs text-base-content/60">Avg Length</div>
				</div>
				<div class="card bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl p-4 text-center col-span-2 sm:col-span-1 lg:col-span-2">
					<div class="text-sm font-mono font-bold text-accent truncate" title={statistics.longestMatch}>
						{statistics.longestMatch.length > 15 ? statistics.longestMatch.slice(0, 15) + '...' : statistics.longestMatch}
					</div>
					<div class="text-xs text-base-content/60">Longest Match</div>
				</div>
			</div>
		{/if}

		<!-- Results Controls -->
		{#if pattern && testString && !regexError}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex flex-wrap items-center justify-between gap-4">
						<div class="flex items-center gap-2">
							<h3 class="font-bold flex items-center gap-2">
								Extracted Matches
								{#if processedMatches.length > 0}
									<span class="badge badge-success">{processedMatches.length}</span>
								{:else}
									<span class="badge badge-warning">None</span>
								{/if}
							</h3>
						</div>
						
						{#if matches.length > 0}
							<div class="flex flex-wrap items-center gap-2">
								<!-- View Mode Toggle -->
								<div class="join">
									<button 
										class="join-item btn btn-sm"
										class:btn-active={viewMode === 'cards'}
										onclick={() => viewMode = 'cards'}
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
										</svg>
									</button>
									<button 
										class="join-item btn btn-sm"
										class:btn-active={viewMode === 'table'}
										onclick={() => viewMode = 'table'}
									>
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
										</svg>
									</button>
								</div>

								<!-- Unique Toggle -->
								<label class="label cursor-pointer gap-2 px-3 py-1.5 bg-base-300 rounded-lg">
									<span class="label-text text-xs">Unique only</span>
									<input type="checkbox" bind:checked={showUniqueOnly} class="toggle toggle-xs toggle-primary" />
								</label>

								<!-- Sort -->
								<select 
									bind:value={sortBy}
									class="select select-bordered select-sm"
								>
									<option value="position">By Position</option>
									<option value="length">By Length</option>
									<option value="alpha">Alphabetical</option>
								</select>

								<!-- Export -->
								<div class="dropdown dropdown-end">
									<button tabindex="0" class="btn btn-primary btn-sm gap-1">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
										</svg>
										Export
									</button>
									<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
									<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48">
										<li><button onclick={() => downloadFile(exportAsJSON(), 'matches.json', 'application/json')}>JSON</button></li>
										<li><button onclick={() => downloadFile(exportAsCSV(), 'matches.csv', 'text/csv')}>CSV</button></li>
										<li><button onclick={() => downloadFile(exportAsPlain(), 'matches.txt', 'text/plain')}>Plain Text</button></li>
									</ul>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Match Cards View -->
		{#if processedMatches.length > 0 && viewMode === 'cards'}
			<div class="flex gap-2 mb-2">
				<button class="btn btn-ghost btn-xs" onclick={expandAll}>Expand All</button>
				<button class="btn btn-ghost btn-xs" onclick={collapseAll}>Collapse All</button>
			</div>
			<div class="space-y-3">
				{#each processedMatches as m, i}
					{@const colorClass = cardColors[i % cardColors.length]}
					<div class="card bg-gradient-to-r {colorClass} rounded-xl overflow-hidden border border-base-300">
						<button
							class="w-full text-left p-4 flex items-center justify-between hover:bg-base-100/50 transition-colors"
							onclick={() => toggleMatch(i)}
						>
							<div class="flex items-center gap-3">
								<span class="badge badge-neutral font-mono text-lg w-8 h-8 flex items-center justify-center">{i + 1}</span>
								<code class="font-mono text-sm bg-base-100 px-3 py-1.5 rounded-lg shadow-sm">{m.fullMatch}</code>
								{#if m.groups.length > 0}
									<span class="badge badge-outline badge-sm">{m.groups.length} group{m.groups.length !== 1 ? 's' : ''}</span>
								{/if}
							</div>
							<svg 
								class="h-5 w-5 transition-transform duration-200" 
								class:rotate-180={expandedMatches.has(i)}
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						
						{#if expandedMatches.has(i)}
							<div class="px-4 pb-4 border-t border-base-300 bg-base-100/30">
								<div class="mt-3 grid gap-3 sm:grid-cols-2">
									<div class="bg-base-100 p-3 rounded-lg">
										<div class="text-xs text-base-content/50 mb-1">Full Match</div>
										<div class="flex items-center justify-between gap-2">
											<code class="font-mono text-sm">{m.fullMatch}</code>
											<CopyButton text={m.fullMatch} size="xs" />
										</div>
									</div>
									<div class="bg-base-100 p-3 rounded-lg">
										<div class="text-xs text-base-content/50 mb-1">Position</div>
										<code class="font-mono text-sm">index {m.index} (length: {m.fullMatch.length})</code>
									</div>
								</div>
								
								{#if m.groups.length > 0}
									<div class="mt-3">
										<div class="text-xs text-base-content/50 mb-2 font-semibold">Capture Groups</div>
										<div class="grid gap-2">
											{#each m.groups as group}
												<div class="flex items-center justify-between bg-base-100 p-3 rounded-lg border border-base-300">
													<div class="flex items-center gap-2">
														<span class="badge badge-primary badge-sm font-mono">
															{group.name ? `${group.name}` : `$${group.index}`}
														</span>
														<code class="font-mono text-sm">{group.value}</code>
													</div>
													<CopyButton text={group.value} size="xs" />
												</div>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Match Table View -->
		{#if processedMatches.length > 0 && viewMode === 'table'}
			<div class="card bg-base-200 rounded-xl overflow-hidden">
				<div class="overflow-x-auto">
					<table class="table table-sm table-zebra">
						<thead>
							<tr>
								<th class="w-12">#</th>
								<th>Match</th>
								<th class="w-24">Position</th>
								<th class="w-24">Length</th>
								{#if processedMatches.some(m => m.groups.length > 0)}
									<th>Groups</th>
								{/if}
								<th class="w-12"></th>
							</tr>
						</thead>
						<tbody>
							{#each processedMatches as m, i}
								<tr class="hover">
									<td class="font-mono text-base-content/50">{i + 1}</td>
									<td class="font-mono">
										<code class="bg-base-300 px-2 py-1 rounded">{m.fullMatch}</code>
									</td>
									<td class="font-mono text-base-content/60">{m.index}</td>
									<td class="font-mono text-base-content/60">{m.fullMatch.length}</td>
									{#if processedMatches.some(m => m.groups.length > 0)}
										<td>
											<div class="flex flex-wrap gap-1">
												{#each m.groups as group}
													<span class="badge badge-sm badge-primary">
														{group.name || `$${group.index}`}: {group.value}
													</span>
												{/each}
											</div>
										</td>
									{/if}
									<td>
										<CopyButton text={m.fullMatch} size="xs" />
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}

		<!-- Quick Copy Section -->
		{#if matches.length > 0}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
						<span>📋</span> Quick Copy
					</h4>
					<div class="grid sm:grid-cols-3 gap-3">
						<div class="bg-base-100 p-3 rounded-lg">
							<label class="text-xs text-base-content/50 mb-2 block">All Matches</label>
							<CopyButton text={exportAsPlain()} label="Copy List" size="sm" class="w-full" />
						</div>
						<div class="bg-base-100 p-3 rounded-lg">
							<label class="text-xs text-base-content/50 mb-2 block">JSON Format</label>
							<CopyButton text={exportAsJSON()} label="Copy JSON" size="sm" class="w-full" />
						</div>
						<div class="bg-base-100 p-3 rounded-lg">
							<label class="text-xs text-base-content/50 mb-2 block">CSV Format</label>
							<CopyButton text={exportAsCSV()} label="Copy CSV" size="sm" class="w-full" />
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Tips -->
		<div class="card bg-gradient-to-r from-base-200 to-base-300 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<span>💡</span> Tips
				</h4>
				<ul class="mt-2 space-y-2 text-sm text-base-content/70">
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						Use <code class="bg-base-300 px-1.5 py-0.5 rounded text-xs">()</code> to create capture groups
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						Named groups: <code class="bg-base-300 px-1.5 py-0.5 rounded text-xs">(?&lt;name&gt;pattern)</code>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						Non-capturing groups: <code class="bg-base-300 px-1.5 py-0.5 rounded text-xs">(?:pattern)</code>
					</li>
					<li class="flex items-start gap-2">
						<span class="text-primary">•</span>
						Export to JSON for structured data, CSV for spreadsheets
					</li>
				</ul>
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
