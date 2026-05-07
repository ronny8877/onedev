<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CopyButton from '$lib/components/ui/CopyButton.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['reset-helper'];

	const resetTypes = [
		{
			id: 'soft',
			name: 'Soft Reset',
			icon: '🟢',
			color: 'success',
			flag: '--soft',
			description: 'Keeps changes staged (in index)',
			affects: { workingDir: false, staging: false, head: true },
			useCase: 'Undo commit but keep changes ready to recommit',
			example: 'Combine multiple commits into one'
		},
		{
			id: 'mixed',
			name: 'Mixed Reset',
			icon: '🟡',
			color: 'warning',
			flag: '--mixed',
			description: 'Keeps changes unstaged (default)',
			affects: { workingDir: false, staging: true, head: true },
			useCase: 'Undo commit and unstage changes',
			example: 'Split a commit into smaller ones'
		},
		{
			id: 'hard',
			name: 'Hard Reset',
			icon: '🔴',
			color: 'error',
			flag: '--hard',
			description: 'Discards all changes (DESTRUCTIVE)',
			affects: { workingDir: true, staging: true, head: true },
			useCase: 'Completely discard commits and changes',
			example: 'Abandon recent work and start fresh'
		}
	];

	let selectedReset = $state('mixed');
	let target = $state('HEAD~1');
	let customRef = $state('');

	const targetOptions = [
		{ value: 'HEAD~1', label: 'Last commit (HEAD~1)' },
		{ value: 'HEAD~2', label: '2 commits ago (HEAD~2)' },
		{ value: 'HEAD~3', label: '3 commits ago (HEAD~3)' },
		{ value: 'HEAD^', label: 'Parent commit (HEAD^)' },
		{ value: 'origin/main', label: 'origin/main' },
		{ value: 'custom', label: 'Custom SHA/ref...' }
	];

	const activeReset = $derived(resetTypes.find(r => r.id === selectedReset)!);
	const actualTarget = $derived(target === 'custom' ? customRef : target);
	
	let command = $derived(
		`git reset ${activeReset.flag} ${actualTarget}`
	);

	let undoCommand = $derived.by(() => {
		if (selectedReset === 'hard') {
			return 'git reflog\ngit reset --hard <SHA> # from reflog';
		}
		return 'git reset HEAD@{1} # undo last reset';
	});
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Warning Banner -->
		<div class="alert alert-warning rounded-xl">
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			<span>Git reset rewrites history. Use with caution on shared branches!</span>
		</div>

		<!-- Reset Type Selection -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-3 flex items-center gap-2">
				<span>🔧</span>
				Reset Type
			</h3>
			<div class="grid md:grid-cols-3 gap-4">
				{#each resetTypes as reset}
					<button
						type="button"
						class="flex flex-col p-4 rounded-2xl border-2 transition-all text-left {selectedReset === reset.id ? `border-${reset.color} bg-${reset.color}/10 shadow-lg` : 'border-base-300 hover:border-primary/50'}"
						onclick={() => selectedReset = reset.id}
					>
						<div class="flex items-center gap-2 mb-2">
							<span class="text-2xl">{reset.icon}</span>
							<span class="font-semibold">{reset.name}</span>
						</div>
						<p class="text-sm text-base-content/70 mb-2">{reset.description}</p>
						<code class="text-xs font-mono bg-base-300/50 px-2 py-1 rounded">git reset {reset.flag}</code>
					</button>
				{/each}
			</div>
		</div>

		<!-- Visual Diagram -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<span>📊</span>
					What Gets Affected
				</h3>
				<div class="overflow-x-auto">
					<table class="table table-sm">
						<thead>
							<tr>
								<th></th>
								<th class="text-center">Working Directory</th>
								<th class="text-center">Staging Area</th>
								<th class="text-center">HEAD</th>
							</tr>
						</thead>
						<tbody>
							{#each resetTypes as reset}
								<tr class="{selectedReset === reset.id ? `bg-${reset.color}/10` : ''}">
									<td class="font-semibold">{reset.icon} {reset.name}</td>
									<td class="text-center">
										{#if reset.affects.workingDir}
											<span class="text-error">✗ Reset</span>
										{:else}
											<span class="text-success">✓ Kept</span>
										{/if}
									</td>
									<td class="text-center">
										{#if reset.affects.staging}
											<span class="text-error">✗ Reset</span>
										{:else}
											<span class="text-success">✓ Kept</span>
										{/if}
									</td>
									<td class="text-center">
										<span class="text-warning">↩ Moved</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Visual Flow -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4">Visual Explanation</h3>
				<div class="flex items-center justify-center gap-4 p-4 bg-base-300/50 rounded-xl overflow-x-auto">
					<!-- Working Directory -->
					<div class="flex flex-col items-center min-w-[100px]">
						<div class="w-20 h-20 rounded-lg border-2 flex items-center justify-center {activeReset.affects.workingDir ? 'border-error bg-error/10' : 'border-success bg-success/10'}">
							<span class="text-2xl">📁</span>
						</div>
						<span class="text-xs mt-2 text-center">Working<br/>Directory</span>
						{#if activeReset.affects.workingDir}
							<span class="badge badge-error badge-xs mt-1">Reset</span>
						{:else}
							<span class="badge badge-success badge-xs mt-1">Safe</span>
						{/if}
					</div>
					
					<span class="text-2xl">→</span>
					
					<!-- Staging -->
					<div class="flex flex-col items-center min-w-[100px]">
						<div class="w-20 h-20 rounded-lg border-2 flex items-center justify-center {activeReset.affects.staging ? 'border-error bg-error/10' : 'border-success bg-success/10'}">
							<span class="text-2xl">📋</span>
						</div>
						<span class="text-xs mt-2 text-center">Staging<br/>Area</span>
						{#if activeReset.affects.staging}
							<span class="badge badge-error badge-xs mt-1">Reset</span>
						{:else}
							<span class="badge badge-success badge-xs mt-1">Safe</span>
						{/if}
					</div>
					
					<span class="text-2xl">→</span>
					
					<!-- HEAD -->
					<div class="flex flex-col items-center min-w-[100px]">
						<div class="w-20 h-20 rounded-lg border-2 border-warning bg-warning/10 flex items-center justify-center">
							<span class="text-2xl">🔖</span>
						</div>
						<span class="text-xs mt-2 text-center">HEAD<br/>Pointer</span>
						<span class="badge badge-warning badge-xs mt-1">Moved</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Target Selection -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-2">Reset Target</h3>
			<div class="grid md:grid-cols-2 gap-4">
				<select bind:value={target} class="select select-bordered w-full rounded-xl">
					{#each targetOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
				{#if target === 'custom'}
					<input
						type="text"
						bind:value={customRef}
						placeholder="Enter commit SHA or ref..."
						class="input input-bordered w-full rounded-xl font-mono"
					/>
				{/if}
			</div>
		</div>

		<!-- Command Output -->
		<div class="card bg-gradient-to-br from-{activeReset.color}/10 to-primary/10 rounded-2xl border-2 border-{activeReset.color}/30">
			<div class="card-body py-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-semibold flex items-center gap-2">
						<span>{activeReset.icon}</span>
						Command
					</h3>
					<CopyButton text={command} label="Copy" size="sm" />
				</div>
				<code class="block font-mono text-lg p-4 bg-base-300/50 rounded-xl">
					{command}
				</code>
			</div>
		</div>

		<!-- Use Case -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<span>💡</span>
					When to Use {activeReset.name}
				</h4>
				<p class="text-sm text-base-content/70 mt-2">{activeReset.useCase}</p>
				<p class="text-sm mt-2"><strong>Example:</strong> {activeReset.example}</p>
			</div>
		</div>

		<!-- Undo Instructions -->
		<div class="card bg-info/10 border border-info/30 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold text-info flex items-center gap-2">
					<span>↩️</span>
					How to Undo
				</h4>
				<pre class="font-mono text-sm mt-2 p-3 bg-base-300/50 rounded-lg">{undoCommand}</pre>
			</div>
		</div>

		<!-- Safety Tips -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">⚠️ Safety Tips</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Never</strong> use <code class="px-1 bg-base-300 rounded">--hard</code> on shared branches</li>
					<li>• Use <code class="px-1 bg-base-300 rounded">git reflog</code> to recover from mistakes</li>
					<li>• Consider <code class="px-1 bg-base-300 rounded">git revert</code> for shared branches instead</li>
					<li>• Always commit or stash changes before resetting</li>
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
