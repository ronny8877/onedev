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
	let flagS = $state(false);
	let flagU = $state(false);

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

	// Compute matches without mutating state
	let matchResult = $derived.by(() => {
		if (!pattern || !testString) {
			return { matches: [] as { match: string; index: number; groups: string[] }[], error: null as string | null };
		}

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

	let highlightedText = $derived.by(() => {
		if (!pattern || !testString || matches.length === 0) return escapeHtml(testString);
		
		let result = '';
		let lastEnd = 0;
		
		for (const m of matches) {
			result += escapeHtml(testString.slice(lastEnd, m.index));
			result += `<mark class="bg-success/40 text-success-content px-0.5 rounded">${escapeHtml(m.match)}</mark>`;
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

	let stats = $derived({
		chars: testString.length,
		lines: testString ? testString.split('\n').length : 0
	});

	// Flag button component data
	const flagButtons = [
		{ key: 'g', label: 'g', title: 'Global - find all matches', get: () => flagG, set: (v: boolean) => flagG = v },
		{ key: 'i', label: 'i', title: 'Case insensitive', get: () => flagI, set: (v: boolean) => flagI = v },
		{ key: 'm', label: 'm', title: 'Multiline - ^ and $ match line starts/ends', get: () => flagM, set: (v: boolean) => flagM = v },
		{ key: 's', label: 's', title: 'Dotall - . matches newlines', get: () => flagS, set: (v: boolean) => flagS = v },
		{ key: 'u', label: 'u', title: 'Unicode - enable unicode support', get: () => flagU, set: (v: boolean) => flagU = v }
	];
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
					placeholder="Enter your regex pattern..."
					class="input input-bordered flex-1 font-mono text-sm rounded-xl"
					class:input-error={regexError}
					spellcheck="false"
				/>
				<span class="text-lg text-base-content/50 font-mono">/{flags}</span>
			</div>
			{#if regexError}
				<p class="text-error text-xs mt-2 flex items-center gap-1">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<circle cx="12" cy="12" r="10" stroke-width="2" />
						<path stroke-linecap="round" stroke-width="2" d="M12 8v4m0 4h.01" />
					</svg>
					{regexError}
				</p>
			{/if}
		</div>

		<!-- Flags -->
		<div>
			<label class="text-sm font-medium text-base-content/70 mb-2 block">Flags</label>
			<div class="flex flex-wrap gap-2">
				{#each flagButtons as flag}
					<button
						type="button"
						class="btn btn-sm font-mono min-w-12"
						class:btn-primary={flag.get()}
						class:btn-ghost={!flag.get()}
						onclick={() => flag.set(!flag.get())}
						title={flag.title}
					>
						{flag.label}
					</button>
				{/each}
			</div>
			<p class="text-xs text-base-content/50 mt-2">
				{#if flagG}global{/if}
				{#if flagI}{flagG ? ', ' : ''}case-insensitive{/if}
				{#if flagM}{flagG || flagI ? ', ' : ''}multiline{/if}
				{#if flagS}{flagG || flagI || flagM ? ', ' : ''}dotall{/if}
				{#if flagU}{flagG || flagI || flagM || flagS ? ', ' : ''}unicode{/if}
			</p>
		</div>

		<!-- Test String -->
		<div>
			<label class="text-sm font-medium text-base-content/70 mb-2 block">Test String</label>
			<textarea
				bind:value={testString}
				placeholder="Enter text to test against..."
				class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-y"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Match Results -->
		{#if pattern && testString}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2">
							Match Results
							{#if matches.length > 0}
								<span class="badge badge-success">{matches.length} match{matches.length !== 1 ? 'es' : ''}</span>
							{:else if !regexError}
								<span class="badge badge-warning">No matches</span>
							{/if}
						</h3>
						{#if matches.length > 0}
							<CopyButton text={matches.map(m => m.match).join('\n')} label="Copy Matches" size="sm" />
						{/if}
					</div>
					
					<!-- Highlighted Text -->
					<div class="p-4 rounded-xl bg-base-300/50 font-mono text-sm whitespace-pre-wrap break-words max-h-72 overflow-y-auto">
						{@html highlightedText || '<span class="text-base-content/40">Enter pattern and text to see matches</span>'}
					</div>
				</div>
			</div>
		{/if}

		<!-- Match Details -->
		{#if matches.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Match Details</h3>
					<div class="overflow-x-auto">
						<table class="table table-sm">
							<thead>
								<tr>
									<th class="w-12">#</th>
									<th>Match</th>
									<th class="w-24">Index</th>
									{#if matches.some(m => m.groups.length > 0)}
										<th>Groups</th>
									{/if}
								</tr>
							</thead>
							<tbody>
								{#each matches as m, i}
									<tr>
										<td class="font-mono text-base-content/50">{i + 1}</td>
										<td class="font-mono">
											<code class="bg-base-300 px-2 py-1 rounded">{m.match}</code>
										</td>
										<td class="font-mono text-base-content/60">{m.index}</td>
										{#if matches.some(m => m.groups.length > 0)}
											<td class="font-mono">
												{#each m.groups as group, gi}
													<span class="badge badge-sm badge-outline mr-1">${gi + 1}: {group}</span>
												{/each}
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
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Quick Reference</h4>
				<div class="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs font-mono">
					<span><code class="bg-base-300 px-1 rounded">.</code> any char</span>
					<span><code class="bg-base-300 px-1 rounded">\d</code> digit</span>
					<span><code class="bg-base-300 px-1 rounded">\w</code> word char</span>
					<span><code class="bg-base-300 px-1 rounded">\s</code> whitespace</span>
					<span><code class="bg-base-300 px-1 rounded">^</code> start</span>
					<span><code class="bg-base-300 px-1 rounded">$</code> end</span>
					<span><code class="bg-base-300 px-1 rounded">*</code> 0 or more</span>
					<span><code class="bg-base-300 px-1 rounded">+</code> 1 or more</span>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
