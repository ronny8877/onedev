<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let pattern = $state('');
	let replacement = $state('');
	let testString = $state('');
	
	// Flags
	let flagG = $state(true);
	let flagI = $state(false);
	let flagM = $state(false);

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

	// Generate diff view
	let diffView = $derived.by(() => {
		if (!pattern || !testString || result === testString) return [];
		
		const originalLines = testString.split('\n');
		const resultLines = result.split('\n');
		const diff: { type: 'same' | 'removed' | 'added'; content: string }[] = [];
		
		const maxLines = Math.max(originalLines.length, resultLines.length);
		for (let i = 0; i < maxLines; i++) {
			const orig = originalLines[i] ?? '';
			const res = resultLines[i] ?? '';
			
			if (orig === res) {
				diff.push({ type: 'same', content: orig });
			} else {
				if (orig) diff.push({ type: 'removed', content: orig });
				if (res) diff.push({ type: 'added', content: res });
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
	}

	function applyReplace() {
		testString = result;
	}

	let stats = $derived({
		chars: testString.length,
		lines: testString ? testString.split('\n').length : 0
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} {stats} />

		<!-- Pattern & Replacement -->
		<div class="grid sm:grid-cols-2 gap-4">
			<div>
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Find Pattern</label>
				<div class="flex items-center gap-2">
					<span class="text-lg text-base-content/50 font-mono">/</span>
					<input
						type="text"
						bind:value={pattern}
						placeholder="Regex pattern..."
						class="input input-bordered flex-1 font-mono text-sm rounded-xl"
						class:input-error={regexError}
						spellcheck="false"
					/>
					<span class="text-lg text-base-content/50 font-mono">/</span>
				</div>
				{#if regexError}
					<p class="text-error text-xs mt-2">{regexError}</p>
				{/if}
			</div>
			
			<div>
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Replace With</label>
				<input
					type="text"
					bind:value={replacement}
					placeholder="Replacement (use $1, $2 for groups)..."
					class="input input-bordered w-full font-mono text-sm rounded-xl"
					spellcheck="false"
				/>
			</div>
		</div>

		<!-- Flags & Actions -->
		<div class="flex flex-wrap items-center justify-between gap-4">
			<div class="flex flex-wrap items-center gap-4">
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" bind:checked={flagG} class="checkbox checkbox-sm" />
					<span class="text-sm">Replace All (g)</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" bind:checked={flagI} class="checkbox checkbox-sm" />
					<span class="text-sm">Case insensitive (i)</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" bind:checked={flagM} class="checkbox checkbox-sm" />
					<span class="text-sm">Multiline (m)</span>
				</label>
			</div>
			
			{#if matchCount > 0}
				<span class="badge badge-info">{matchCount} match{matchCount !== 1 ? 'es' : ''}</span>
			{/if}
		</div>

		<!-- Input Text -->
		<div>
			<label class="text-sm font-medium text-base-content/70 mb-2 block">Input Text</label>
			<textarea
				bind:value={testString}
				placeholder="Enter text to perform replacements on..."
				class="textarea textarea-bordered w-full min-h-[150px] font-mono text-sm rounded-xl resize-y"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Preview -->
		{#if pattern && testString}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2">
							Preview
							{#if result !== testString}
								<span class="badge badge-success badge-sm">Changed</span>
							{:else}
								<span class="badge badge-warning badge-sm">No changes</span>
							{/if}
						</h3>
						<div class="flex items-center gap-2">
							{#if result !== testString}
								<button class="btn btn-primary btn-sm" onclick={applyReplace}>
									Apply Changes
								</button>
							{/if}
							<CopyButton text={result} label="Copy Result" size="sm" />
						</div>
					</div>
					
					<div class="p-4 rounded-xl bg-base-300/50 font-mono text-sm whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
						{result}
					</div>
				</div>
			</div>
		{/if}

		<!-- Diff View -->
		{#if diffView.length > 0 && result !== testString}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Changes</h3>
					<div class="p-4 rounded-xl bg-base-300/50 font-mono text-sm max-h-60 overflow-y-auto space-y-0.5">
						{#each diffView as line}
							{#if line.type === 'removed'}
								<div class="bg-error/20 text-error-content px-2 py-0.5 rounded -mx-1">
									<span class="text-error mr-2">−</span>{line.content}
								</div>
							{:else if line.type === 'added'}
								<div class="bg-success/20 text-success-content px-2 py-0.5 rounded -mx-1">
									<span class="text-success mr-2">+</span>{line.content}
								</div>
							{:else}
								<div class="text-base-content/70 px-2 py-0.5">
									<span class="mr-2 opacity-30"> </span>{line.content}
								</div>
							{/if}
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Tips -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Replacement Patterns</h4>
				<div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
					<div><code class="bg-base-300 px-1 rounded">$1, $2, ...</code> - Capture groups</div>
					<div><code class="bg-base-300 px-1 rounded">$&</code> - Entire match</div>
					<div><code class="bg-base-300 px-1 rounded">$`</code> - Before match</div>
					<div><code class="bg-base-300 px-1 rounded">$'</code> - After match</div>
					<div><code class="bg-base-300 px-1 rounded">$$</code> - Literal $</div>
					<div><code class="bg-base-300 px-1 rounded">$&lt;name&gt;</code> - Named group</div>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
