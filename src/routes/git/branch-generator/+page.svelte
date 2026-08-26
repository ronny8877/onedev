<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
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
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import { gitToolsContent } from '$lib/config/content/git-tools-content';

	const content = gitToolsContent['branch-generator'];

	// Branch types with colors and prefixes
	const branchTypes = [
		{ id: 'feature', name: 'Feature', emoji: '✨', color: 'success', prefix: 'feature', description: 'New feature development' },
		{ id: 'bugfix', name: 'Bug Fix', emoji: '🐛', color: 'error', prefix: 'bugfix', description: 'Fixing a bug' },
		{ id: 'hotfix', name: 'Hotfix', emoji: '🚨', color: 'warning', prefix: 'hotfix', description: 'Urgent production fix' },
		{ id: 'release', name: 'Release', emoji: '🚀', color: 'primary', prefix: 'release', description: 'Release preparation' },
		{ id: 'chore', name: 'Chore', emoji: '🔧', color: 'neutral', prefix: 'chore', description: 'Maintenance tasks' },
		{ id: 'docs', name: 'Docs', emoji: '📚', color: 'info', prefix: 'docs', description: 'Documentation updates' },
		{ id: 'refactor', name: 'Refactor', emoji: '♻️', color: 'secondary', prefix: 'refactor', description: 'Code refactoring' },
		{ id: 'test', name: 'Test', emoji: '🧪', color: 'accent', prefix: 'test', description: 'Adding tests' }
	];

	// Segment types for customization
	interface Segment {
		id: string;
		type: 'prefix' | 'username' | 'ticket' | 'description';
		label: string;
		value: string;
	}

	let selectedType = $state('feature');
	let ticketId = $state('');
	let description = $state('');
	let username = $state('');
	let separator = $state('/');
	let slugSeparator = $state('-');
	let lowercase = $state(true);
	let includeUsername = $state(false);

	// Customizable segment order - includes all segments, username visibility controlled by toggle
	let segmentOrder = $state<('prefix' | 'username' | 'ticket' | 'description')[]>(['prefix', 'username', 'ticket', 'description']);

	const sampleData = {
		type: 'feature',
		ticket: 'JIRA-123',
		description: 'add user login functionality',
		username: 'rny'
	};

	// Generate slug from description
	function slugify(text: string): string {
		let slug = text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '')
			.replace(/[\s_]+/g, slugSeparator)
			.replace(new RegExp(`${slugSeparator}+`, 'g'), slugSeparator)
			.replace(new RegExp(`^${slugSeparator}|${slugSeparator}$`, 'g'), '');
		return slug;
	}

	// Generate branch name based on segment order
	let branchName = $derived.by(() => {
		const type = branchTypes.find(t => t.id === selectedType);
		if (!type) return '';
		
		const segments: string[] = [];
		
		for (const segmentType of segmentOrder) {
			switch (segmentType) {
				case 'prefix':
					segments.push(type.prefix);
					break;
				case 'username':
					if (includeUsername && username.trim()) {
						segments.push(username.trim());
					}
					break;
				case 'ticket':
					if (ticketId.trim()) {
						segments.push(ticketId.trim());
					}
					break;
				case 'description':
					if (description.trim()) {
						segments.push(slugify(description));
					}
					break;
			}
		}
		
		// Filter out empty segments and join
		let result = segments.filter(Boolean).join(separator);
		
		return lowercase ? result.toLowerCase() : result;
	});

	let stats = $derived({
		chars: branchName.length
	});

	function loadSample() {
		selectedType = sampleData.type;
		ticketId = sampleData.ticket;
		description = sampleData.description;
		username = sampleData.username;
		includeUsername = true;
	}

	function clearAll() {
		selectedType = 'feature';
		ticketId = '';
		description = '';
		username = '';
		includeUsername = false;
	}

	function moveSegment(index: number, direction: 'up' | 'down') {
		const newOrder = [...segmentOrder];
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= newOrder.length) return;
		[newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
		segmentOrder = newOrder;
	}

	const segmentLabels: Record<string, string> = {
		prefix: 'Type Prefix',
		username: 'Username',
		ticket: 'Ticket ID',
		description: 'Description'
	};
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={branchName} stats={branchName ? stats : undefined} />

		<!-- Branch Type Selection -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-3 flex items-center gap-2">
				<AppIcon name="leaf" size={16} />
				Branch Type
			</h3>
			<div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
				{#each branchTypes as type}
					<button
						type="button"
						class="flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] {selectedType === type.id ? `border-${type.color} bg-${type.color}/10 shadow-md` : 'border-base-300 bg-base-100 hover:border-primary/50'}"
						onclick={() => selectedType = type.id}
					>
						<span class="text-lg">{type.emoji}</span>
						<span class="text-xs font-semibold mt-1">{type.name}</span>
					</button>
				{/each}
			</div>
		</div>

		<!-- Input Fields -->
		<div class="grid md:grid-cols-3 gap-4">
			<div>
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Ticket ID (optional)</label>
				<input
					type="text"
					bind:value={ticketId}
					placeholder="JIRA-123, GH-456"
					class="input input-bordered w-full rounded-xl text-sm font-mono"
				/>
			</div>
			<div class="md:col-span-2">
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Description</label>
				<input
					type="text"
					bind:value={description}
					placeholder="Short description of the work"
					class="input input-bordered w-full rounded-xl text-sm"
				/>
			</div>
		</div>

		<!-- Options -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold mb-3">Options</h4>
				<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
					<!-- Include Username -->
					<div>
						<label class="flex items-center gap-2 cursor-pointer mb-2">
							<input type="checkbox" bind:checked={includeUsername} class="toggle toggle-sm toggle-primary" />
							<span class="text-sm">Include Username</span>
						</label>
						{#if includeUsername}
							<input
								type="text"
								bind:value={username}
								placeholder="your-username"
								class="input input-bordered input-sm w-full rounded-lg text-sm"
							/>
						{/if}
					</div>

					<!-- Separator -->
					<div>
						<label class="text-sm text-base-content/70 mb-2 block">Segment Separator</label>
						<div class="join w-full">
							{#each ['/', '-', '_'] as sep}
								<button
									type="button"
									class="btn btn-sm join-item flex-1 {separator === sep ? 'btn-primary' : 'btn-ghost'}"
									onclick={() => separator = sep}
								>
									<code>{sep}</code>
								</button>
							{/each}
						</div>
					</div>

					<!-- Slug Separator -->
					<div>
						<label class="text-sm text-base-content/70 mb-2 block">Word Separator</label>
						<div class="join w-full">
							{#each ['-', '_'] as sep}
								<button
									type="button"
									class="btn btn-sm join-item flex-1 {slugSeparator === sep ? 'btn-primary' : 'btn-ghost'}"
									onclick={() => slugSeparator = sep}
								>
									<code>{sep}</code>
								</button>
							{/each}
						</div>
					</div>

					<!-- Lowercase -->
					<div class="flex items-end">
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" bind:checked={lowercase} class="toggle toggle-sm toggle-primary" />
							<span class="text-sm">Lowercase</span>
						</label>
					</div>
				</div>
			</div>
		</div>

		<!-- Segment Order Customization -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
					<AppIcon name="shuffle" size={16} />
					Segment Order
					<span class="text-xs font-normal text-base-content/50">(drag or use arrows)</span>
				</h4>
				<div class="flex flex-wrap gap-2">
					{#each segmentOrder as segment, index}
						<div class="flex items-center gap-1 bg-base-300 rounded-lg px-3 py-2">
							<button
								type="button"
								class="btn btn-ghost btn-xs"
								disabled={index === 0}
								onclick={() => moveSegment(index, 'up')}
							>
								←
							</button>
							<span class="text-sm font-medium px-2">
								{index + 1}. {segmentLabels[segment]}
							</span>
							<button
								type="button"
								class="btn btn-ghost btn-xs"
								disabled={index === segmentOrder.length - 1}
								onclick={() => moveSegment(index, 'down')}
							>
								→
							</button>
						</div>
					{/each}
				</div>
				<p class="text-xs text-base-content/50 mt-2">
					Example: {segmentOrder.map(s => `[${segmentLabels[s]}]`).join(separator)}
				</p>
			</div>
		</div>

		<!-- Preview -->
		{#if branchName}
			<div class="card bg-gradient-to-br from-success/10 to-primary/10 rounded-2xl border-2 border-success/30">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2">
							<AppIcon name="leaf" size={16} />
							Branch Name
						</h3>
						<CopyButton text={branchName} label="Copy" size="sm" />
					</div>
					<code class="block text-lg font-mono p-4 bg-base-300/50 rounded-xl break-all">
						{branchName}
					</code>
				</div>
			</div>
		{/if}

		<!-- Git Command -->
		{#if branchName}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-3">
					<div class="flex items-center justify-between">
						<h4 class="text-sm font-medium text-base-content/70">Git Commands</h4>
					</div>
					<div class="grid md:grid-cols-2 gap-3 mt-2">
						<div class="flex items-center justify-between gap-2 p-3 bg-base-300/50 rounded-lg">
							<code class="text-sm font-mono truncate">git checkout -b {branchName}</code>
							<CopyButton text={`git checkout -b ${branchName}`} size="sm" />
						</div>
						<div class="flex items-center justify-between gap-2 p-3 bg-base-300/50 rounded-lg">
							<code class="text-sm font-mono truncate">git switch -c {branchName}</code>
							<CopyButton text={`git switch -c ${branchName}`} size="sm" />
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Quick Presets -->
		<div class="card bg-base-200 rounded-xl">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold mb-3">Example Formats</h4>
				<div class="grid gap-2 text-sm font-mono">
					<div class="p-2 bg-base-300/50 rounded-lg">feature/JIRA-123/add-login</div>
					<div class="p-2 bg-base-300/50 rounded-lg">bugfix/rny/GH-456-fix-auth</div>
					<div class="p-2 bg-base-300/50 rounded-lg">hotfix-urgent-db-fix</div>
					<div class="p-2 bg-base-300/50 rounded-lg">release/v2.0.0</div>
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
