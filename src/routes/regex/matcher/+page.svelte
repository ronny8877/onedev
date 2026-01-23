<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let pattern = $state('');
	let testString = $state('');
	
	// Flags
	let flagG = $state(true);
	let flagI = $state(false);
	let flagM = $state(false);

	const samplePattern = '(\\w+)@(\\w+)\\.(\\w+)';
	const sampleText = `user1@gmail.com
admin@company.org
test.user@domain.co
support@helpdesk.net`;

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
		groups: { index: number; value: string }[];
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
				const groups: { index: number; value: string }[] = [];
				for (let i = 1; i < match.length; i++) {
					if (match[i] !== undefined) {
						groups.push({ index: i, value: match[i] });
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

	// Export formats
	function exportAsJSON(): string {
		return JSON.stringify(matches.map(m => ({
			match: m.fullMatch,
			index: m.index,
			groups: m.groups.reduce((acc, g) => ({ ...acc, [`$${g.index}`]: g.value }), {})
		})), null, 2);
	}

	function exportAsCSV(): string {
		if (matches.length === 0) return '';
		
		const maxGroups = Math.max(...matches.map(m => m.groups.length), 0);
		const headers = ['Match', 'Index', ...Array.from({ length: maxGroups }, (_, i) => `Group ${i + 1}`)];
		
		const rows = matches.map(m => {
			const groups = Array.from({ length: maxGroups }, (_, i) => {
				const group = m.groups.find(g => g.index === i + 1);
				return group ? `"${group.value.replace(/"/g, '""')}"` : '';
			});
			return [`"${m.fullMatch.replace(/"/g, '""')}"`, m.index, ...groups].join(',');
		});
		
		return [headers.join(','), ...rows].join('\n');
	}

	function exportAsPlain(): string {
		return matches.map(m => m.fullMatch).join('\n');
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
		expandedMatches = new Set(matches.map((_, i) => i));
	}

	function collapseAll() {
		expandedMatches = new Set();
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Pattern Input -->
		<div>
			<label class="text-sm font-medium text-base-content/70 mb-2 block">Regular Expression</label>
			<div class="flex items-center gap-2">
				<span class="text-lg text-base-content/50 font-mono">/</span>
				<input
					type="text"
					bind:value={pattern}
					placeholder="Enter regex with capture groups, e.g. (\\w+)@(\\w+)"
					class="input input-bordered flex-1 font-mono text-sm rounded-xl"
					class:input-error={regexError}
					spellcheck="false"
				/>
				<span class="text-lg text-base-content/50 font-mono">/{flags}</span>
			</div>
			{#if regexError}
				<p class="text-error text-xs mt-2">{regexError}</p>
			{/if}
		</div>

		<!-- Flags -->
		<div class="flex flex-wrap items-center gap-4">
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={flagI} class="checkbox checkbox-sm" />
				<span class="text-sm">Case insensitive (i)</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={flagM} class="checkbox checkbox-sm" />
				<span class="text-sm">Multiline (m)</span>
			</label>
		</div>

		<!-- Test String -->
		<div>
			<label class="text-sm font-medium text-base-content/70 mb-2 block">Test String</label>
			<textarea
				bind:value={testString}
				placeholder="Enter text to extract matches from..."
				class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-y"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Results Summary -->
		{#if pattern && testString && !regexError}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex flex-wrap items-center justify-between gap-3">
						<h3 class="font-semibold flex items-center gap-2">
							Extracted Matches
							{#if matches.length > 0}
								<span class="badge badge-success">{matches.length}</span>
							{:else}
								<span class="badge badge-warning">None</span>
							{/if}
						</h3>
						
						{#if matches.length > 0}
							<div class="flex flex-wrap items-center gap-2">
								<button class="btn btn-ghost btn-xs" onclick={expandAll}>Expand All</button>
								<button class="btn btn-ghost btn-xs" onclick={collapseAll}>Collapse All</button>
								<div class="divider divider-horizontal mx-0"></div>
								<div class="dropdown dropdown-end">
									<button tabindex="0" class="btn btn-primary btn-sm gap-1">
										<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
										</svg>
										Export
									</button>
									<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
									<ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48">
										<li>
											<button onclick={() => downloadFile(exportAsJSON(), 'matches.json', 'application/json')}>
												JSON
											</button>
										</li>
										<li>
											<button onclick={() => downloadFile(exportAsCSV(), 'matches.csv', 'text/csv')}>
												CSV
											</button>
										</li>
										<li>
											<button onclick={() => downloadFile(exportAsPlain(), 'matches.txt', 'text/plain')}>
												Plain Text
											</button>
										</li>
									</ul>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Match List -->
		{#if matches.length > 0}
			<div class="space-y-3">
				{#each matches as m, i}
					<div class="card bg-base-200 rounded-xl overflow-hidden">
						<button
							class="w-full text-left p-4 flex items-center justify-between hover:bg-base-300/50 transition-colors"
							onclick={() => toggleMatch(i)}
						>
							<div class="flex items-center gap-3">
								<span class="badge badge-neutral font-mono">{i + 1}</span>
								<code class="font-mono text-sm bg-base-300 px-2 py-1 rounded">{m.fullMatch}</code>
								{#if m.groups.length > 0}
									<span class="text-xs text-base-content/50">{m.groups.length} group{m.groups.length !== 1 ? 's' : ''}</span>
								{/if}
							</div>
							<svg 
								class="h-5 w-5 transition-transform" 
								class:rotate-180={expandedMatches.has(i)}
								fill="none" 
								stroke="currentColor" 
								viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
						
						{#if expandedMatches.has(i)}
							<div class="px-4 pb-4 border-t border-base-300">
								<div class="mt-3 space-y-2">
									<div class="flex items-center justify-between">
										<span class="text-sm text-base-content/70">Full Match</span>
										<div class="flex items-center gap-2">
											<code class="font-mono text-sm">{m.fullMatch}</code>
											<CopyButton text={m.fullMatch} size="xs" />
										</div>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-sm text-base-content/70">Position</span>
										<code class="font-mono text-sm text-base-content/60">{m.index}</code>
									</div>
									{#if m.groups.length > 0}
										<div class="divider my-2"></div>
										<h4 class="text-sm font-medium text-base-content/70">Capture Groups</h4>
										<div class="grid gap-2 mt-2">
											{#each m.groups as group}
												<div class="flex items-center justify-between bg-base-300/50 p-2 rounded-lg">
													<span class="badge badge-sm badge-outline font-mono">${group.index}</span>
													<div class="flex items-center gap-2">
														<code class="font-mono text-sm">{group.value}</code>
														<CopyButton text={group.value} size="xs" />
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Copy All Section -->
		{#if matches.length > 0}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h4 class="text-sm font-semibold mb-3">Quick Copy</h4>
					<div class="grid sm:grid-cols-3 gap-3">
						<div>
							<label class="text-xs text-base-content/50 mb-1 block">All Matches</label>
							<CopyButton text={exportAsPlain()} label="Copy List" size="sm" class="w-full" />
						</div>
						<div>
							<label class="text-xs text-base-content/50 mb-1 block">JSON Format</label>
							<CopyButton text={exportAsJSON()} label="Copy JSON" size="sm" class="w-full" />
						</div>
						<div>
							<label class="text-xs text-base-content/50 mb-1 block">CSV Format</label>
							<CopyButton text={exportAsCSV()} label="Copy CSV" size="sm" class="w-full" />
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Tips -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Tips</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• Use <code class="bg-base-300 px-1 rounded">()</code> to create capture groups</li>
					<li>• Named groups: <code class="bg-base-300 px-1 rounded">(?&lt;name&gt;pattern)</code></li>
					<li>• Non-capturing groups: <code class="bg-base-300 px-1 rounded">(?:pattern)</code></li>
					<li>• Export to JSON for structured data, CSV for spreadsheets</li>
				</ul>
			</div>
		</div>
	</div>
</ToolWrapper>
