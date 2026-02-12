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
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['alias-generator'];

	interface Alias {
		id: string;
		alias: string;
		command: string;
		description: string;
		category: string;
		selected: boolean;
	}

	let aliases = $state<Alias[]>([
		// Shortcuts
		{ id: '1', alias: 'co', command: 'checkout', description: 'Shorthand for checkout', category: 'Shortcuts', selected: true },
		{ id: '2', alias: 'br', command: 'branch', description: 'Shorthand for branch', category: 'Shortcuts', selected: true },
		{ id: '3', alias: 'ci', command: 'commit', description: 'Shorthand for commit', category: 'Shortcuts', selected: true },
		{ id: '4', alias: 'st', command: 'status', description: 'Shorthand for status', category: 'Shortcuts', selected: true },
		{ id: '5', alias: 'sw', command: 'switch', description: 'Shorthand for switch', category: 'Shortcuts', selected: false },
		{ id: '6', alias: 'df', command: 'diff', description: 'Shorthand for diff', category: 'Shortcuts', selected: false },
		{ id: '7', alias: 'pl', command: 'pull', description: 'Shorthand for pull', category: 'Shortcuts', selected: false },
		{ id: '8', alias: 'ps', command: 'push', description: 'Shorthand for push', category: 'Shortcuts', selected: false },
		
		// Logging
		{ id: '10', alias: 'lg', command: "log --oneline --graph --decorate", description: 'Pretty log with graph', category: 'Logging', selected: true },
		{ id: '11', alias: 'last', command: 'log -1 HEAD --stat', description: 'Last commit with stats', category: 'Logging', selected: true },
		{ id: '12', alias: 'hist', command: "log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short", description: 'Compact history', category: 'Logging', selected: false },
		{ id: '13', alias: 'today', command: "log --since=midnight --author='$(git config user.name)'", description: "Today's commits", category: 'Logging', selected: false },
		{ id: '14', alias: 'll', command: 'log --oneline -n 15', description: 'Last 15 commits oneline', category: 'Logging', selected: false },
		{ id: '15', alias: 'changes', command: 'log --oneline --stat', description: 'Log with file changes', category: 'Logging', selected: false },
		{ id: '16', alias: 'who', command: 'shortlog -sn --all', description: 'Contributors by commits', category: 'Logging', selected: false },
		
		// Workflow
		{ id: '20', alias: 'undo', command: 'reset HEAD~1 --mixed', description: 'Undo last commit (keep changes)', category: 'Workflow', selected: true },
		{ id: '21', alias: 'amend', command: 'commit --amend --no-edit', description: 'Amend without edit message', category: 'Workflow', selected: true },
		{ id: '22', alias: 'unstage', command: 'reset HEAD --', description: 'Unstage files', category: 'Workflow', selected: true },
		{ id: '23', alias: 'discard', command: 'checkout --', description: 'Discard changes in file', category: 'Workflow', selected: false },
		{ id: '24', alias: 'save', command: 'stash push -m', description: 'Stash with message', category: 'Workflow', selected: false },
		{ id: '25', alias: 'pop', command: 'stash pop', description: 'Pop stashed changes', category: 'Workflow', selected: false },
		{ id: '26', alias: 'wip', command: "commit -am 'WIP'", description: 'Quick WIP commit', category: 'Workflow', selected: false },
		{ id: '27', alias: 'unwip', command: 'reset HEAD~1 --mixed', description: 'Undo WIP commit', category: 'Workflow', selected: false },
		{ id: '28', alias: 'cp', command: 'cherry-pick', description: 'Cherry pick shorthand', category: 'Workflow', selected: false },
		{ id: '29', alias: 'aa', command: 'add --all', description: 'Add all files', category: 'Workflow', selected: false },
		{ id: '35', alias: 'cam', command: 'commit -am', description: 'Add all and commit', category: 'Workflow', selected: false },
		
		// Branching
		{ id: '30', alias: 'main', command: 'checkout main', description: 'Switch to main', category: 'Branching', selected: false },
		{ id: '31', alias: 'master', command: 'checkout master', description: 'Switch to master', category: 'Branching', selected: false },
		{ id: '32', alias: 'dev', command: 'checkout develop', description: 'Switch to develop', category: 'Branching', selected: false },
		{ id: '33', alias: 'nb', command: 'checkout -b', description: 'New branch', category: 'Branching', selected: false },
		{ id: '34', alias: 'del', command: 'branch -d', description: 'Delete branch', category: 'Branching', selected: false },
		
		// Info
		{ id: '40', alias: 'aliases', command: "config --get-regexp '^alias\\.'", description: 'List all aliases', category: 'Info', selected: true },
		{ id: '41', alias: 'branches', command: 'branch -a', description: 'List all branches', category: 'Info', selected: false },
		{ id: '42', alias: 'tags', command: 'tag -l', description: 'List all tags', category: 'Info', selected: false },
		{ id: '43', alias: 'remotes', command: 'remote -v', description: 'List remotes', category: 'Info', selected: false },
		{ id: '44', alias: 'conf', command: 'config --list', description: 'List all config', category: 'Info', selected: false },
		{ id: '45', alias: 'whoami', command: 'config user.email', description: 'Show git email', category: 'Info', selected: false },
		
		// Advanced
		{ id: '50', alias: 'squash', command: 'rebase -i HEAD~', description: 'Interactive rebase', category: 'Advanced', selected: false },
		{ id: '51', alias: 'cleanup', command: "branch --merged | grep -v 'main\\|master' | xargs -n 1 git branch -d", description: 'Delete merged branches', category: 'Advanced', selected: false },
		{ id: '52', alias: 'sync', command: 'fetch --all --prune', description: 'Fetch and prune', category: 'Advanced', selected: false },
		{ id: '53', alias: 'fpush', command: 'push --force-with-lease', description: 'Safe force push', category: 'Advanced', selected: false },
		{ id: '54', alias: 'reb', command: 'rebase', description: 'Rebase shorthand', category: 'Advanced', selected: false },
		{ id: '55', alias: 'reba', command: 'rebase --abort', description: 'Abort rebase', category: 'Advanced', selected: false },
		{ id: '56', alias: 'rebc', command: 'rebase --continue', description: 'Continue rebase', category: 'Advanced', selected: false },
		{ id: '57', alias: 'rebs', command: 'rebase --skip', description: 'Skip rebase step', category: 'Advanced', selected: false },
		{ id: '58', alias: 'fix', command: 'commit --fixup', description: 'Fixup commit', category: 'Advanced', selected: false },
		{ id: '59', alias: 'aliases-edit', command: 'config --global --edit', description: 'Edit global config', category: 'Advanced', selected: false }
	]);

	let customAlias = $state('');
	let customCommand = $state('');

	const categories = ['Shortcuts', 'Logging', 'Workflow', 'Branching', 'Info', 'Advanced'];
	const categoryIcons: Record<string, string> = {
		'Shortcuts': '⚡',
		'Logging': '📜',
		'Workflow': '🔄',
		'Branching': '🌿',
		'Info': 'ℹ️',
		'Advanced': '🔧'
	};

	function toggleAlias(id: string) {
		aliases = aliases.map(a => a.id === id ? { ...a, selected: !a.selected } : a);
	}

	function selectCategory(category: string) {
		aliases = aliases.map(a => a.category === category ? { ...a, selected: true } : a);
	}

	function clearCategory(category: string) {
		aliases = aliases.map(a => a.category === category ? { ...a, selected: false } : a);
	}

	let selectedAliases = $derived(aliases.filter(a => a.selected));

	let commands = $derived(
		selectedAliases.map(a => `git config --global alias.${a.alias} '${a.command}'`).join('\n')
	);

	function addCustomAlias() {
		if (customAlias.trim() && customCommand.trim()) {
			aliases = [...aliases, {
				id: `custom-${Date.now()}`,
				alias: customAlias.trim(),
				command: customCommand.trim(),
				description: 'Custom alias',
				category: 'Custom',
				selected: true
			}];
			customAlias = '';
			customCommand = '';
		}
	}

	function loadSample() {
		aliases = aliases.map(a => ({
			...a,
			selected: ['co', 'br', 'ci', 'st', 'lg', 'last', 'undo', 'amend', 'unstage', 'aliases', 'aa'].includes(a.alias)
		}));
	}

	function clearAll() {
		aliases = aliases.map(a => ({ ...a, selected: false }));
	}

	function selectAll() {
		aliases = aliases.map(a => ({ ...a, selected: true }));
	}

	let hasCustom = $derived(aliases.some(a => a.category === 'Custom'));
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<div class="flex flex-wrap items-center gap-2">
			<ToolActions onSample={loadSample} onClear={clearAll} copyText={commands} stats={selectedAliases.length > 0 ? { lines: selectedAliases.length } : undefined} />
			<button type="button" class="btn btn-ghost btn-sm gap-1" onclick={selectAll}>
				<span>✅</span>
				Select All ({aliases.length})
			</button>
		</div>

		<!-- Category Tabs -->
		{#each categories as category}
			{@const categoryAliases = aliases.filter(a => a.category === category)}
			{#if categoryAliases.length > 0}
				<div class="card bg-base-200 rounded-xl">
					<div class="card-body py-4">
						<div class="flex items-center justify-between mb-3">
							<h3 class="font-semibold flex items-center gap-2">
								{categoryIcons[category] || '📦'}
								{category}
								<span class="badge badge-sm">{categoryAliases.length}</span>
							</h3>
							<div class="flex gap-2">
								<button type="button" class="btn btn-xs btn-ghost" onclick={() => selectCategory(category)}>
									Select All
								</button>
								<button type="button" class="btn btn-xs btn-ghost" onclick={() => clearCategory(category)}>
									Clear
								</button>
							</div>
						</div>
						<div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
							{#each categoryAliases as alias}
								<button
									type="button"
									class="flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all {alias.selected ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'}"
									onclick={() => toggleAlias(alias.id)}
								>
									<div class="shrink-0 mt-0.5">
										{#if alias.selected}
											<svg class="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
											</svg>
										{:else}
											<div class="h-5 w-5 rounded border-2 border-base-300"></div>
										{/if}
									</div>
									<div class="flex-1 min-w-0">
										<code class="font-mono font-semibold text-sm text-primary">{alias.alias}</code>
										<code class="block text-xs text-base-content/60 truncate mt-0.5">{alias.command}</code>
										<span class="text-xs text-base-content/50">{alias.description}</span>
									</div>
								</button>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		{/each}

		<!-- Custom Category (if any) -->
		{#if hasCustom}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-4">
					<h3 class="font-semibold flex items-center gap-2 mb-3">
						✨ Custom
					</h3>
					<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
						{#each aliases.filter(a => a.category === 'Custom') as alias}
							<button
								type="button"
								class="flex items-start gap-3 p-3 rounded-lg border-2 text-left transition-all {alias.selected ? 'border-primary bg-primary/10' : 'border-base-300 hover:border-primary/50'}"
								onclick={() => toggleAlias(alias.id)}
							>
								<div class="shrink-0 mt-0.5">
									{#if alias.selected}
										<svg class="h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
										</svg>
									{:else}
										<div class="h-5 w-5 rounded border-2 border-base-300"></div>
									{/if}
								</div>
								<div class="flex-1 min-w-0">
									<code class="font-mono font-semibold text-sm">{alias.alias}</code>
									<code class="block text-xs text-base-content/60 truncate mt-0.5">{alias.command}</code>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Custom Alias -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-3 flex items-center gap-2">
					<span>✨</span>
					Add Custom Alias
				</h3>
				<div class="flex flex-wrap gap-3">
					<input
						type="text"
						bind:value={customAlias}
						placeholder="Alias (e.g., cm)"
						class="input input-bordered input-sm rounded-lg font-mono flex-1 min-w-[120px]"
					/>
					<input
						type="text"
						bind:value={customCommand}
						placeholder="Command (e.g., commit -m)"
						class="input input-bordered input-sm rounded-lg font-mono flex-[2] min-w-[200px]"
					/>
					<button
						type="button"
						class="btn btn-sm btn-primary"
						onclick={addCustomAlias}
						disabled={!customAlias.trim() || !customCommand.trim()}
					>
						Add
					</button>
				</div>
			</div>
		</div>

		<!-- Output -->
		{#if selectedAliases.length > 0}
			<div class="card bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl border-2 border-success/30">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2">
							<span>📋</span>
							Commands ({selectedAliases.length} aliases)
						</h3>
						<CopyButton text={commands} label="Copy All" size="sm" />
					</div>
					<div class="space-y-2 max-h-80 overflow-auto">
						{#each selectedAliases as alias}
							<div class="flex items-center justify-between gap-2 p-2 bg-base-300/50 rounded-lg">
								<code class="font-mono text-sm truncate flex-1">git config --global alias.{alias.alias} '{alias.command}'</code>
								<CopyButton text={`git config --global alias.${alias.alias} '${alias.command}'`} size="sm" />
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}

		<!-- Usage Examples -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold">Usage Examples</h4>
				<div class="grid gap-2 mt-2 text-sm font-mono">
					<div class="p-2 bg-base-300/50 rounded-lg">git co main <span class="text-base-content/50"># checkout main</span></div>
					<div class="p-2 bg-base-300/50 rounded-lg">git lg <span class="text-base-content/50"># pretty log graph</span></div>
					<div class="p-2 bg-base-300/50 rounded-lg">git aa && git ci -m "msg" <span class="text-base-content/50"># add all & commit</span></div>
					<div class="p-2 bg-base-300/50 rounded-lg">git undo <span class="text-base-content/50"># undo last commit</span></div>
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
