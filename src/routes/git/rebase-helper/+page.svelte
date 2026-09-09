<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
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

	const content = gitToolsContent['rebase-helper'];

	const rebaseActions = [
		{ id: 'pick', short: 'p', name: 'Pick', description: 'Use commit as-is', color: 'success' },
		{ id: 'reword', short: 'r', name: 'Reword', description: 'Use commit, but edit message', color: 'info' },
		{ id: 'edit', short: 'e', name: 'Edit', description: 'Use commit, but stop for amending', color: 'warning' },
		{ id: 'squash', short: 's', name: 'Squash', description: 'Meld into previous commit, edit message', color: 'primary' },
		{ id: 'fixup', short: 'f', name: 'Fixup', description: 'Meld into previous commit, discard message', color: 'secondary' },
		{ id: 'drop', short: 'd', name: 'Drop', description: 'Remove commit entirely', color: 'error' }
	];

	const rebaseSteps = [
		{ step: 1, title: 'Start Interactive Rebase', cmd: 'git rebase -i HEAD~3', description: 'Opens editor with last 3 commits' },
		{ step: 2, title: 'Edit the Todo List', cmd: '# Change "pick" to desired action', description: 'Modify actions for each commit' },
		{ step: 3, title: 'Save and Close', cmd: ':wq (vim) or Ctrl+S, Ctrl+W (VS Code)', description: 'Git processes your changes' },
		{ step: 4, title: 'Resolve Conflicts', cmd: 'git add . && git rebase --continue', description: 'If any conflicts arise' },
		{ step: 5, title: 'Complete or Abort', cmd: 'git rebase --continue OR git rebase --abort', description: 'Finish or cancel the rebase' }
	];

	const commonScenarios = [
		{
			title: 'Squash Last 3 Commits',
			icon: 'package',
			steps: [
				'git rebase -i HEAD~3',
				'Change 2nd and 3rd line to "squash" or "s"',
				'Save and edit combined commit message'
			]
		},
		{
			title: 'Reword a Commit Message',
			icon: 'pencil',
			steps: [
				'git rebase -i HEAD~n (where n includes your commit)',
				'Change "pick" to "reword" for target commit',
				'Edit the message when prompted'
			]
		},
		{
			title: 'Remove a Commit',
			icon: 'trash-2',
			steps: [
				'git rebase -i HEAD~n',
				'Change "pick" to "drop" or delete the line',
				'Save and let rebase complete'
			]
		},
		{
			title: 'Reorder Commits',
			icon: 'shuffle',
			steps: [
				'git rebase -i HEAD~n',
				'Rearrange the lines in desired order',
				'Save (may need to resolve conflicts)'
			]
		}
	];

	let targetBranch = $state('main');
	let commitCount = $state(3);
	let showInteractive = $state(true);

	let rebaseCommand = $derived(
		showInteractive
			? `git rebase -i HEAD~${commitCount}`
			: `git rebase ${targetBranch}`
	);

	let exampleTodoList = $derived(`pick a1b2c3d feat: add user authentication
pick b2c3d4e fix: resolve login bug  
pick c3d4e5f docs: update API documentation`);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Mode Toggle -->
		<div class="flex items-center gap-4">
			<div class="join">
				<button
					type="button"
					class="btn join-item {showInteractive ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => showInteractive = true}
				>
					Interactive
				</button>
				<button
					type="button"
					class="btn join-item {!showInteractive ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => showInteractive = false}
				>
					Standard
				</button>
			</div>
		</div>

		<!-- Command Builder -->
		{#if showInteractive}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Interactive Rebase</h3>
					<div class="flex items-center gap-4">
						<span class="text-sm text-base-content/70">Number of commits:</span>
						<input
							type="number"
							bind:value={commitCount}
							min="1"
							max="50"
							class="input input-bordered input-sm w-24 rounded-lg"
						/>
					</div>
				</div>
			</div>
		{:else}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3">Standard Rebase</h3>
					<div class="flex items-center gap-4">
						<span class="text-sm text-base-content/70">Target branch:</span>
						<input
							type="text"
							bind:value={targetBranch}
							placeholder="main, origin/main"
							class="input input-bordered input-sm w-48 rounded-lg font-mono"
						/>
					</div>
				</div>
			</div>
		{/if}

		<!-- Command Output -->
		<div class="card bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border-2 border-primary/30">
			<div class="card-body py-4">
				<div class="flex items-center justify-between mb-3">
					<h3 class="font-semibold flex items-center gap-2">
						<AppIcon name="keyboard" size={16} />
						Command
					</h3>
					<CopyButton text={rebaseCommand} label="Copy" size="sm" />
				</div>
				<code class="block font-mono text-lg p-4 bg-base-300/50 rounded-xl">
					{rebaseCommand}
				</code>
			</div>
		</div>

		<!-- Rebase Actions Reference -->
		{#if showInteractive}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-4 flex items-center gap-2">
						<AppIcon name="clipboard" size={16} />
						Interactive Rebase Actions
					</h3>
					<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{#each rebaseActions as action}
							<div class="p-3 rounded-xl bg-base-300/50 border-l-4 border-{action.color}">
								<div class="flex items-center gap-2 mb-1">
									<code class="font-mono font-bold text-{action.color}">{action.id}</code>
									<span class="text-xs text-base-content/50">({action.short})</span>
								</div>
								<p class="text-sm text-base-content/70">{action.description}</p>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Example Todo List -->
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<h3 class="font-semibold mb-3 flex items-center gap-2">
						<AppIcon name="file-pen" size={16} />
						Example Todo List
					</h3>
					<pre class="font-mono text-sm p-4 bg-base-300/50 rounded-xl whitespace-pre-wrap">{exampleTodoList}</pre>
					<p class="text-sm text-base-content/60 mt-2">
						Change <code class="px-1 bg-base-300 rounded">pick</code> to any action above, then save and close.
					</p>
				</div>
			</div>
		{/if}

		<!-- Step by Step Guide -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<span>📚</span>
					Step-by-Step Guide
				</h3>
				<div class="relative">
					{#each rebaseSteps as step, i}
						<div class="flex gap-4 pb-6 {i < rebaseSteps.length - 1 ? 'border-l-2 border-base-300 ml-4' : 'ml-4'}">
							<div class="absolute -left-0 w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold text-sm">
								{step.step}
							</div>
							<div class="ml-8 flex-1">
								<h4 class="font-semibold">{step.title}</h4>
								<code class="block font-mono text-sm mt-1 p-2 bg-base-300/50 rounded-lg">{step.cmd}</code>
								<p class="text-sm text-base-content/60 mt-1">{step.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Common Scenarios -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<span>💡</span>
					Common Scenarios
				</h3>
				<div class="grid md:grid-cols-2 gap-4">
					{#each commonScenarios as scenario}
						<div class="p-4 rounded-xl bg-base-300/50">
							<h4 class="font-semibold flex items-center gap-2">
								<span><AppIcon name={scenario.icon} size={16} /></span>
								{scenario.title}
							</h4>
							<ol class="mt-2 space-y-1 text-sm text-base-content/70 list-decimal list-inside">
								{#each scenario.steps as step}
									<li>{step}</li>
								{/each}
							</ol>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Visual Branch Diagram -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<AppIcon name="leaf" size={16} />
					Before vs After Rebase
				</h3>
				<div class="grid md:grid-cols-2 gap-4">
					<div class="p-4 bg-base-300/50 rounded-xl">
						<h4 class="text-sm font-semibold mb-3 text-error">Before</h4>
						<svg viewBox="0 0 200 80" class="w-full h-20">
							<line x1="20" y1="20" x2="180" y2="20" stroke="#22c55e" stroke-width="3"/>
							<circle cx="40" cy="20" r="6" fill="#22c55e"/>
							<circle cx="80" cy="20" r="6" fill="#22c55e"/>
							<circle cx="120" cy="20" r="6" fill="#22c55e"/>
							<text x="120" y="12" class="text-xs" fill="currentColor">main</text>
							
							<path d="M80 20 L100 50 L140 50" stroke="#3b82f6" stroke-width="2" fill="none"/>
							<circle cx="100" cy="50" r="5" fill="#3b82f6"/>
							<circle cx="140" cy="50" r="5" fill="#3b82f6"/>
							<text x="140" y="65" class="text-xs" fill="currentColor">feature</text>
						</svg>
					</div>
					<div class="p-4 bg-base-300/50 rounded-xl">
						<h4 class="text-sm font-semibold mb-3 text-success">After Rebase</h4>
						<svg viewBox="0 0 200 80" class="w-full h-20">
							<line x1="20" y1="35" x2="180" y2="35" stroke="#22c55e" stroke-width="3"/>
							<circle cx="40" cy="35" r="6" fill="#22c55e"/>
							<circle cx="80" cy="35" r="6" fill="#22c55e"/>
							<circle cx="120" cy="35" r="6" fill="#22c55e"/>
							<circle cx="140" cy="35" r="5" fill="#3b82f6"/>
							<circle cx="160" cy="35" r="5" fill="#3b82f6"/>
							<text x="160" y="50" class="text-xs" fill="currentColor">feature</text>
						</svg>
					</div>
				</div>
			</div>
		</div>

		<!-- Safety Tips -->
		<div class="card bg-warning/10 border border-warning/30 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold text-warning flex items-center gap-2">
					<span>⚠️</span>
					Important Warnings
				</h4>
				<ul class="mt-2 space-y-1 text-sm text-base-content/70">
					<li>• <strong>Never</strong> rebase commits that have been pushed to shared branches</li>
					<li>• Use <code class="px-1 bg-base-300 rounded">git rebase --abort</code> if something goes wrong</li>
					<li>• Create a backup branch before rebasing: <code class="px-1 bg-base-300 rounded">git branch backup</code></li>
					<li>• Force push is required after rebasing: <code class="px-1 bg-base-300 rounded">git push --force-with-lease</code></li>
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
