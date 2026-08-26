<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import Features from '$lib/components/content/Features.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import Examples from '$lib/components/content/Examples.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import RelatedTools from '$lib/components/content/RelatedTools.svelte';
	import Tips from '$lib/components/content/Tips.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['workflow'];

	type WorkflowType = 'gitflow' | 'trunk' | 'github' | 'feature';
	let activeWorkflow = $state<WorkflowType>('gitflow');

	const workflows = {
		gitflow: {
			name: 'Git Flow',
			icon: 'waves-horizontal',
			description: 'A branching model with dedicated branches for features, releases, and hotfixes.',
			branches: [
				{ name: 'main', color: 'success', description: 'Production-ready code' },
				{ name: 'develop', color: 'primary', description: 'Integration branch for features' },
				{ name: 'feature/*', color: 'info', description: 'New features in development' },
				{ name: 'release/*', color: 'warning', description: 'Release preparation' },
				{ name: 'hotfix/*', color: 'error', description: 'Urgent production fixes' }
			],
			commands: [
				{ desc: 'Start a feature', cmd: 'git checkout -b feature/my-feature develop' },
				{ desc: 'Finish a feature', cmd: 'git checkout develop && git merge --no-ff feature/my-feature' },
				{ desc: 'Start a release', cmd: 'git checkout -b release/1.0.0 develop' },
				{ desc: 'Finish a release', cmd: 'git checkout main && git merge --no-ff release/1.0.0 && git tag -a 1.0.0' },
				{ desc: 'Start a hotfix', cmd: 'git checkout -b hotfix/fix-bug main' },
				{ desc: 'Finish a hotfix', cmd: 'git checkout main && git merge --no-ff hotfix/fix-bug && git checkout develop && git merge --no-ff hotfix/fix-bug' }
			],
			pros: ['Clear separation of concerns', 'Parallel development', 'Versioned releases'],
			cons: ['Complex workflow', 'Many branches to manage', 'Slower releases']
		},
		trunk: {
			name: 'Trunk-Based Development',
			icon: 'tree-deciduous',
			description: 'Developers collaborate on a single branch with short-lived feature branches.',
			branches: [
				{ name: 'main/trunk', color: 'success', description: 'Single source of truth' },
				{ name: 'short-lived branches', color: 'info', description: 'Live max 1-2 days' }
			],
			commands: [
				{ desc: 'Create short-lived branch', cmd: 'git checkout -b feat/quick-change' },
				{ desc: 'Commit frequently', cmd: 'git commit -m "small incremental change"' },
				{ desc: 'Merge quickly', cmd: 'git checkout main && git merge feat/quick-change' },
				{ desc: 'Use feature flags', cmd: '// Code: if (featureFlags.newFeature) { ... }' }
			],
			pros: ['Fast CI/CD', 'Fewer merge conflicts', 'Simple workflow'],
			cons: ['Requires feature flags', 'Needs strong CI', 'Less isolation']
		},
		github: {
			name: 'GitHub Flow',
			icon: 'bug',
			description: 'A lightweight workflow focused on pull requests and continuous deployment.',
			branches: [
				{ name: 'main', color: 'success', description: 'Always deployable' },
				{ name: 'feature branches', color: 'info', description: 'All development work' }
			],
			commands: [
				{ desc: 'Create branch', cmd: 'git checkout -b feature/add-login' },
				{ desc: 'Push and open PR', cmd: 'git push -u origin feature/add-login' },
				{ desc: 'After review, merge', cmd: 'git checkout main && git pull && git merge feature/add-login' },
				{ desc: 'Deploy from main', cmd: '# Deploy automatically after merge' }
			],
			pros: ['Simple to learn', 'Fast iteration', 'Great for CD'],
			cons: ['No release branches', 'Less suited for versioned releases']
		},
		feature: {
			name: 'Feature Branch',
			icon: 'leaf',
			description: 'Basic workflow where each feature is developed in its own branch.',
			branches: [
				{ name: 'main', color: 'success', description: 'Stable code' },
				{ name: 'feature/*', color: 'info', description: 'Feature development' }
			],
			commands: [
				{ desc: 'Create feature branch', cmd: 'git checkout -b feature/new-component main' },
				{ desc: 'Work on feature', cmd: 'git add . && git commit -m "feat: add component"' },
				{ desc: 'Keep up to date', cmd: 'git fetch origin && git rebase origin/main' },
				{ desc: 'Merge when ready', cmd: 'git checkout main && git merge feature/new-component' }
			],
			pros: ['Easy to understand', 'Isolated development', 'Flexible'],
			cons: ['No release process', 'Can lead to long-lived branches']
		}
	};

	const currentWorkflow = $derived(workflows[activeWorkflow]);
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Workflow Selector -->
		<div class="flex flex-wrap gap-2">
			{#each Object.entries(workflows) as [key, workflow]}
				<button
					type="button"
					class="btn gap-2 {activeWorkflow === key ? 'btn-primary' : 'btn-ghost'}"
					onclick={() => activeWorkflow = key as WorkflowType}
				>
					<span><AppIcon name={workflow.icon} size={16} /></span>
					{workflow.name}
				</button>
			{/each}
		</div>

		<!-- Workflow Overview -->
		<div class="card bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
			<div class="card-body">
				<h2 class="card-title flex items-center gap-2">
					<span class="text-2xl"><AppIcon name={currentWorkflow.icon} size={24} /></span>
					{currentWorkflow.name}
				</h2>
				<p class="text-base-content/70">{currentWorkflow.description}</p>
			</div>
		</div>

		<!-- Branch Structure -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<AppIcon name="leaf" size={16} />
					Branch Structure
				</h3>
				<div class="space-y-3">
					{#each currentWorkflow.branches as branch}
						<div class="flex items-center gap-4 p-3 rounded-xl bg-base-300/50">
							<div class="w-3 h-3 rounded-full bg-{branch.color}"></div>
							<div class="flex-1">
								<code class="font-mono font-semibold text-{branch.color}">{branch.name}</code>
								<p class="text-sm text-base-content/60 mt-0.5">{branch.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Visual Diagram -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<AppIcon name="chart-column" size={16} />
					Visual Flow
				</h3>
				<div class="overflow-x-auto">
					{#if activeWorkflow === 'gitflow'}
						<div class="min-w-[600px] p-4 bg-base-300/50 rounded-xl">
							<svg viewBox="0 0 600 200" class="w-full h-48">
								<!-- Main branch -->
								<line x1="50" y1="30" x2="550" y2="30" stroke="#22c55e" stroke-width="4"/>
								<circle cx="50" cy="30" r="8" fill="#22c55e"/>
								<circle cx="250" cy="30" r="8" fill="#22c55e"/>
								<circle cx="550" cy="30" r="8" fill="#22c55e"/>
								<text x="20" y="35" class="text-xs" fill="currentColor">main</text>
								
								<!-- Develop branch -->
								<line x1="50" y1="70" x2="450" y2="70" stroke="#3b82f6" stroke-width="3"/>
								<circle cx="100" cy="70" r="6" fill="#3b82f6"/>
								<circle cx="200" cy="70" r="6" fill="#3b82f6"/>
								<circle cx="350" cy="70" r="6" fill="#3b82f6"/>
								<text x="20" y="75" class="text-xs" fill="currentColor">develop</text>
								
								<!-- Feature branch -->
								<path d="M100 70 Q120 110 200 70" stroke="#06b6d4" stroke-width="2" fill="none"/>
								<circle cx="150" cy="100" r="5" fill="#06b6d4"/>
								<text x="130" y="120" class="text-xs" fill="currentColor">feature</text>
								
								<!-- Release branch -->
								<path d="M350 70 Q400 50 450 30" stroke="#f59e0b" stroke-width="2" fill="none" stroke-dasharray="5,3"/>
								<text x="380" y="45" class="text-xs" fill="currentColor">release</text>
								
								<!-- Hotfix branch -->
								<path d="M250 30 Q300 60 350 30" stroke="#ef4444" stroke-width="2" fill="none"/>
								<circle cx="300" cy="50" r="5" fill="#ef4444"/>
								<text x="285" y="65" class="text-xs" fill="currentColor">hotfix</text>
							</svg>
						</div>
					{:else if activeWorkflow === 'trunk'}
						<div class="min-w-[400px] p-4 bg-base-300/50 rounded-xl">
							<svg viewBox="0 0 400 120" class="w-full h-32">
								<!-- Trunk -->
								<line x1="50" y1="60" x2="350" y2="60" stroke="#22c55e" stroke-width="6"/>
								<circle cx="100" cy="60" r="8" fill="#22c55e"/>
								<circle cx="175" cy="60" r="8" fill="#22c55e"/>
								<circle cx="250" cy="60" r="8" fill="#22c55e"/>
								<circle cx="325" cy="60" r="8" fill="#22c55e"/>
								<text x="20" y="65" class="text-xs" fill="currentColor">trunk</text>
								
								<!-- Short branches -->
								<path d="M100 60 Q115 35 130 60" stroke="#06b6d4" stroke-width="2" fill="none"/>
								<path d="M175 60 Q190 35 205 60" stroke="#06b6d4" stroke-width="2" fill="none"/>
								<path d="M250 60 Q265 85 280 60" stroke="#06b6d4" stroke-width="2" fill="none"/>
								<text x="150" y="25" class="text-xs" fill="currentColor">short-lived</text>
							</svg>
						</div>
					{:else}
						<div class="min-w-[400px] p-4 bg-base-300/50 rounded-xl">
							<svg viewBox="0 0 400 150" class="w-full h-36">
								<!-- Main -->
								<line x1="50" y1="40" x2="350" y2="40" stroke="#22c55e" stroke-width="4"/>
								<circle cx="50" cy="40" r="8" fill="#22c55e"/>
								<circle cx="200" cy="40" r="8" fill="#22c55e"/>
								<circle cx="350" cy="40" r="8" fill="#22c55e"/>
								<text x="20" y="45" class="text-xs" fill="currentColor">main</text>
								
								<!-- Feature branch -->
								<path d="M50 40 L100 90 L150 90 L200 40" stroke="#06b6d4" stroke-width="2" fill="none"/>
								<circle cx="100" cy="90" r="5" fill="#06b6d4"/>
								<circle cx="150" cy="90" r="5" fill="#06b6d4"/>
								<text x="110" y="110" class="text-xs" fill="currentColor">feature</text>
								
								<!-- Another feature -->
								<path d="M200 40 L250 90 L300 90 L350 40" stroke="#8b5cf6" stroke-width="2" fill="none"/>
								<circle cx="250" cy="90" r="5" fill="#8b5cf6"/>
								<circle cx="300" cy="90" r="5" fill="#8b5cf6"/>
							</svg>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Common Commands -->
		<div class="card bg-base-200 rounded-2xl">
			<div class="card-body py-4">
				<h3 class="font-semibold mb-4 flex items-center gap-2">
					<AppIcon name="keyboard" size={16} />
					Common Commands
				</h3>
				<div class="space-y-3">
					{#each currentWorkflow.commands as cmd}
						<div class="p-3 rounded-xl bg-base-300/50">
							<p class="text-sm text-base-content/70 mb-1">{cmd.desc}</p>
							<code class="block font-mono text-sm break-all">{cmd.cmd}</code>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Pros and Cons -->
		<div class="grid md:grid-cols-2 gap-4">
			<div class="card bg-success/10 border border-success/30 rounded-xl">
				<div class="card-body py-4">
					<h4 class="font-semibold text-success flex items-center gap-2">
						<span>✅</span>
						Pros
					</h4>
					<ul class="mt-2 space-y-1 text-sm">
						{#each currentWorkflow.pros as pro}
							<li class="flex items-center gap-2">
								<span class="text-success">•</span>
								{pro}
							</li>
						{/each}
					</ul>
				</div>
			</div>
			<div class="card bg-warning/10 border border-warning/30 rounded-xl">
				<div class="card-body py-4">
					<h4 class="font-semibold text-warning flex items-center gap-2">
						<span>⚠️</span>
						Cons
					</h4>
					<ul class="mt-2 space-y-1 text-sm">
						{#each currentWorkflow.cons as con}
							<li class="flex items-center gap-2">
								<span class="text-warning">•</span>
								{con}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>

		<!-- Quick Reference -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold mb-3">When to Use Each Workflow</h4>
				<div class="grid gap-2 text-sm">
					<div class="flex items-center gap-3 p-2 rounded-lg bg-base-300/50">
						<AppIcon name="waves-horizontal" size={16} />
						<span><strong>Git Flow</strong> - Large teams, versioned releases, enterprise</span>
					</div>
					<div class="flex items-center gap-3 p-2 rounded-lg bg-base-300/50">
						<AppIcon name="tree-deciduous" size={16} />
						<span><strong>Trunk-Based</strong> - CI/CD focused, experienced teams, web apps</span>
					</div>
					<div class="flex items-center gap-3 p-2 rounded-lg bg-base-300/50">
						<AppIcon name="bug" size={16} />
						<span><strong>GitHub Flow</strong> - Small teams, continuous deployment, SaaS</span>
					</div>
					<div class="flex items-center gap-3 p-2 rounded-lg bg-base-300/50">
						<AppIcon name="leaf" size={16} />
						<span><strong>Feature Branch</strong> - Simple projects, beginners, small teams</span>
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
