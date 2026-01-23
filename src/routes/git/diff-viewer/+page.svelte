<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';

	let textA = $state('');
	let textB = $state('');
	let viewMode = $state<'split' | 'inline'>('split');
	let ignoreWhitespace = $state(false);
	let showLineNumbers = $state(true);

	const sampleA = `function calculateTotal(items) {
  let total = 0;
  for (let item of items) {
    total += item.price;
  }
  return total;
}

// Get user data
function getUser(id) {
  return fetch('/api/users/' + id);
}`;

	const sampleB = `function calculateTotal(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return Math.round(total * 100) / 100;
}

// Get user data with error handling
async function getUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) throw new Error('User not found');
  return response.json();
}`;

	interface DiffLine {
		type: 'same' | 'added' | 'removed' | 'modified';
		lineA?: number;
		lineB?: number;
		contentA?: string;
		contentB?: string;
	}

	function computeDiff(a: string, b: string): DiffLine[] {
		let linesA = a.split('\n');
		let linesB = b.split('\n');
		
		if (ignoreWhitespace) {
			linesA = linesA.map(l => l.trim());
			linesB = linesB.map(l => l.trim());
		}
		
		const result: DiffLine[] = [];
		const maxLen = Math.max(linesA.length, linesB.length);
		
		// Simple line-by-line diff (LCS would be better but this works for visualization)
		let i = 0, j = 0;
		
		while (i < linesA.length || j < linesB.length) {
			if (i >= linesA.length) {
				result.push({ type: 'added', lineB: j + 1, contentB: linesB[j] });
				j++;
			} else if (j >= linesB.length) {
				result.push({ type: 'removed', lineA: i + 1, contentA: linesA[i] });
				i++;
			} else if (linesA[i] === linesB[j]) {
				result.push({ type: 'same', lineA: i + 1, lineB: j + 1, contentA: linesA[i], contentB: linesB[j] });
				i++;
				j++;
			} else {
				// Look ahead for matches
				let foundAinB = linesB.slice(j, j + 5).indexOf(linesA[i]);
				let foundBinA = linesA.slice(i, i + 5).indexOf(linesB[j]);
				
				if (foundAinB !== -1 && (foundBinA === -1 || foundAinB <= foundBinA)) {
					// Line from B was added
					result.push({ type: 'added', lineB: j + 1, contentB: linesB[j] });
					j++;
				} else if (foundBinA !== -1) {
					// Line from A was removed
					result.push({ type: 'removed', lineA: i + 1, contentA: linesA[i] });
					i++;
				} else {
					// Line was modified
					result.push({ type: 'modified', lineA: i + 1, lineB: j + 1, contentA: linesA[i], contentB: linesB[j] });
					i++;
					j++;
				}
			}
		}
		
		return result;
	}

	let diff = $derived(textA || textB ? computeDiff(textA, textB) : []);
	
	let stats = $derived({
		added: diff.filter(d => d.type === 'added').length,
		removed: diff.filter(d => d.type === 'removed').length,
		modified: diff.filter(d => d.type === 'modified').length,
		unchanged: diff.filter(d => d.type === 'same').length
	});

	// Generate unified diff format
	let unifiedDiff = $derived.by(() => {
		if (diff.length === 0) return '';
		
		let output = '--- a/file\n+++ b/file\n';
		let chunk: string[] = [];
		let chunkStart = 1;
		
		for (const line of diff) {
			if (line.type === 'same') {
				chunk.push(` ${line.contentA || ''}`);
			} else if (line.type === 'removed' || line.type === 'modified') {
				chunk.push(`-${line.contentA || ''}`);
			}
			if (line.type === 'added' || line.type === 'modified') {
				chunk.push(`+${line.contentB || ''}`);
			}
		}
		
		output += `@@ -1,${textA.split('\n').length} +1,${textB.split('\n').length} @@\n`;
		output += chunk.join('\n');
		
		return output;
	});

	function loadSample() {
		textA = sampleA;
		textB = sampleB;
	}

	function clearAll() {
		textA = '';
		textB = '';
	}

	function swapTexts() {
		[textA, textB] = [textB, textA];
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<div class="flex flex-wrap items-center gap-2">
			<ToolActions onSample={loadSample} onClear={clearAll} />
			<button type="button" class="btn btn-ghost btn-sm gap-1" onclick={swapTexts}>
				<span>⇄</span>
				Swap
			</button>
		</div>

		<!-- Options -->
		<div class="flex flex-wrap items-center gap-4">
			<div class="join">
				<button
					type="button"
					class="btn btn-sm join-item {viewMode === 'split' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => viewMode = 'split'}
				>
					Side by Side
				</button>
				<button
					type="button"
					class="btn btn-sm join-item {viewMode === 'inline' ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => viewMode = 'inline'}
				>
					Inline
				</button>
			</div>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={ignoreWhitespace} class="checkbox checkbox-sm" />
				<span class="text-sm">Ignore whitespace</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={showLineNumbers} class="checkbox checkbox-sm" />
				<span class="text-sm">Line numbers</span>
			</label>
		</div>

		<!-- Input Areas -->
		<div class="grid md:grid-cols-2 gap-4">
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2 flex items-center gap-2">
					<span class="w-3 h-3 rounded-full bg-error"></span>
					Original
				</h3>
				<textarea
					bind:value={textA}
					placeholder="Paste original text or code..."
					class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48"
					spellcheck="false"
				></textarea>
			</div>
			<div>
				<h3 class="text-sm font-medium text-base-content/70 mb-2 flex items-center gap-2">
					<span class="w-3 h-3 rounded-full bg-success"></span>
					Modified
				</h3>
				<textarea
					bind:value={textB}
					placeholder="Paste modified text or code..."
					class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-48"
					spellcheck="false"
				></textarea>
			</div>
		</div>

		<!-- Stats -->
		{#if diff.length > 0}
			<div class="flex flex-wrap gap-4 text-sm">
				<span class="badge badge-lg badge-success gap-1">
					<span>+{stats.added}</span> added
				</span>
				<span class="badge badge-lg badge-error gap-1">
					<span>-{stats.removed}</span> removed
				</span>
				<span class="badge badge-lg badge-warning gap-1">
					<span>~{stats.modified}</span> modified
				</span>
				<span class="badge badge-lg badge-ghost gap-1">
					<span>{stats.unchanged}</span> unchanged
				</span>
			</div>
		{/if}

		<!-- Diff Output -->
		{#if diff.length > 0}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2">
							<span>📊</span>
							Diff View
						</h3>
						<CopyButton text={unifiedDiff} label="Copy Unified" size="sm" />
					</div>
					
					<div class="overflow-x-auto rounded-xl bg-base-300/50">
						{#if viewMode === 'split'}
							<!-- Side by Side -->
							<div class="grid grid-cols-2 divide-x divide-base-300">
								<div class="p-2">
									{#each diff as line}
										<div class="flex font-mono text-sm {line.type === 'removed' || line.type === 'modified' ? 'bg-error/20' : ''} {line.type === 'added' ? 'opacity-0 h-6' : ''}">
											{#if showLineNumbers && line.lineA}
												<span class="w-8 text-right pr-2 text-base-content/40 select-none shrink-0">{line.lineA}</span>
											{/if}
											<span class="flex-1 px-1 break-all {line.type === 'removed' || line.type === 'modified' ? 'text-error' : ''}">
												{#if line.type === 'removed' || line.type === 'modified' || line.type === 'same'}
													{line.contentA}
												{/if}
											</span>
										</div>
									{/each}
								</div>
								<div class="p-2">
									{#each diff as line}
										<div class="flex font-mono text-sm {line.type === 'added' || line.type === 'modified' ? 'bg-success/20' : ''} {line.type === 'removed' ? 'opacity-0 h-6' : ''}">
											{#if showLineNumbers && line.lineB}
												<span class="w-8 text-right pr-2 text-base-content/40 select-none shrink-0">{line.lineB}</span>
											{/if}
											<span class="flex-1 px-1 break-all {line.type === 'added' || line.type === 'modified' ? 'text-success' : ''}">
												{#if line.type === 'added' || line.type === 'modified' || line.type === 'same'}
													{line.contentB}
												{/if}
											</span>
										</div>
									{/each}
								</div>
							</div>
						{:else}
							<!-- Inline -->
							<div class="p-2">
								{#each diff as line}
									{#if line.type === 'same'}
										<div class="flex font-mono text-sm">
											{#if showLineNumbers}
												<span class="w-8 text-right pr-2 text-base-content/40 select-none shrink-0">{line.lineA}</span>
											{/if}
											<span class="w-4 text-center text-base-content/30"></span>
											<span class="flex-1 px-1">{line.contentA}</span>
										</div>
									{:else if line.type === 'removed'}
										<div class="flex font-mono text-sm bg-error/20">
											{#if showLineNumbers}
												<span class="w-8 text-right pr-2 text-base-content/40 select-none shrink-0">{line.lineA}</span>
											{/if}
											<span class="w-4 text-center text-error">-</span>
											<span class="flex-1 px-1 text-error">{line.contentA}</span>
										</div>
									{:else if line.type === 'added'}
										<div class="flex font-mono text-sm bg-success/20">
											{#if showLineNumbers}
												<span class="w-8 text-right pr-2 text-base-content/40 select-none shrink-0">{line.lineB}</span>
											{/if}
											<span class="w-4 text-center text-success">+</span>
											<span class="flex-1 px-1 text-success">{line.contentB}</span>
										</div>
									{:else if line.type === 'modified'}
										<div class="flex font-mono text-sm bg-error/20">
											{#if showLineNumbers}
												<span class="w-8 text-right pr-2 text-base-content/40 select-none shrink-0">{line.lineA}</span>
											{/if}
											<span class="w-4 text-center text-error">-</span>
											<span class="flex-1 px-1 text-error">{line.contentA}</span>
										</div>
										<div class="flex font-mono text-sm bg-success/20">
											{#if showLineNumbers}
												<span class="w-8 text-right pr-2 text-base-content/40 select-none shrink-0">{line.lineB}</span>
											{/if}
											<span class="w-4 text-center text-success">+</span>
											<span class="flex-1 px-1 text-success">{line.contentB}</span>
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Legend</h4>
				<div class="flex flex-wrap gap-3 mt-2 text-sm">
					<div class="flex items-center gap-2">
						<span class="w-4 h-4 rounded bg-success/30"></span>
						<span>Added</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="w-4 h-4 rounded bg-error/30"></span>
						<span>Removed</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="w-4 h-4 rounded bg-warning/30"></span>
						<span>Modified</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="w-4 h-4 rounded bg-base-300"></span>
						<span>Unchanged</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</ToolWrapper>
