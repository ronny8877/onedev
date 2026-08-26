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

	const content = gitToolsContent['commit-generator'];

	// Conventional Commit Types with colors and emojis
	const commitTypes = [
		{ id: 'feat', name: 'Feature', emoji: '✨', color: 'success', description: 'A new feature' },
		{ id: 'fix', name: 'Bug Fix', emoji: '🐛', color: 'error', description: 'A bug fix' },
		{ id: 'docs', name: 'Docs', emoji: '📚', color: 'info', description: 'Documentation only changes' },
		{ id: 'style', name: 'Style', emoji: '💎', color: 'secondary', description: 'Code style changes (formatting, etc.)' },
		{ id: 'refactor', name: 'Refactor', emoji: '♻️', color: 'warning', description: 'Code refactoring without feature change' },
		{ id: 'perf', name: 'Performance', emoji: '⚡', color: 'accent', description: 'Performance improvements' },
		{ id: 'test', name: 'Test', emoji: '🧪', color: 'primary', description: 'Adding missing tests' },
		{ id: 'build', name: 'Build', emoji: '🏗️', color: 'neutral', description: 'Build system or dependencies' },
		{ id: 'ci', name: 'CI', emoji: '🤖', color: 'info', description: 'CI configuration' },
		{ id: 'chore', name: 'Chore', emoji: '🔧', color: 'neutral', description: 'Other changes (non-code)' },
		{ id: 'revert', name: 'Revert', emoji: '⏪', color: 'error', description: 'Reverts a previous commit' }
	];

	const commonScopes = ['api', 'ui', 'core', 'auth', 'db', 'config', 'deps', 'docs', 'tests', 'ci'];

	let selectedType = $state('feat');
	let scope = $state('');
	let description = $state('');
	let body = $state('');
	let footer = $state('');
	let isBreaking = $state(false);
	let breakingDescription = $state('');
	let issueRef = $state('');
	let useEmoji = $state(true);
	let showAdvanced = $state(false);

	const sampleData = {
		type: 'feat',
		scope: 'auth',
		description: 'add OAuth2 login support',
		body: 'Implemented Google and GitHub OAuth2 providers.\nAdded session management with secure cookies.',
		isBreaking: false,
		issueRef: '#123'
	};

	// Generate the commit message
	let commitMessage = $derived.by(() => {
		const type = commitTypes.find(t => t.id === selectedType);
		if (!type || !description.trim()) return '';
		
		let message = '';
		
		// Header line
		const emoji = useEmoji ? type.emoji + ' ' : '';
		const scopeStr = scope.trim() ? `(${scope.trim()})` : '';
		const breakingMark = isBreaking ? '!' : '';
		message += `${emoji}${type.id}${scopeStr}${breakingMark}: ${description.trim()}`;
		
		// Body
		if (body.trim()) {
			message += '\n\n' + body.trim();
		}
		
		// Breaking change footer
		if (isBreaking && breakingDescription.trim()) {
			message += '\n\nBREAKING CHANGE: ' + breakingDescription.trim();
		}
		
		// Issue reference
		if (issueRef.trim()) {
			const refs = issueRef.split(',').map(r => r.trim()).filter(Boolean);
			if (refs.length > 0) {
				message += '\n\n' + refs.map(r => {
					if (r.startsWith('#') || r.startsWith('http')) return r;
					return `#${r}`;
				}).join(', ');
			}
		}
		
		// Other footer
		if (footer.trim()) {
			message += '\n\n' + footer.trim();
		}
		
		return message;
	});

	let stats = $derived({
		chars: commitMessage.length,
		lines: commitMessage.split('\n').length
	});

	let headerLength = $derived(commitMessage.split('\n')[0]?.length || 0);
	let headerValid = $derived(headerLength <= 72);

	function loadSample() {
		selectedType = sampleData.type;
		scope = sampleData.scope;
		description = sampleData.description;
		body = sampleData.body;
		isBreaking = sampleData.isBreaking;
		issueRef = sampleData.issueRef;
	}

	function clearAll() {
		selectedType = 'feat';
		scope = '';
		description = '';
		body = '';
		footer = '';
		isBreaking = false;
		breakingDescription = '';
		issueRef = '';
	}
</script>

<ToolWrapper>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadSample} onClear={clearAll} copyText={commitMessage} stats={commitMessage ? stats : undefined} />

		<!-- Type Selection -->
		<div>
			<h3 class="text-sm font-medium text-base-content/70 mb-3 flex items-center gap-2">
				<AppIcon name="clipboard" size={16} />
				Commit Type
			</h3>
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
				{#each commitTypes as type}
					<button
						type="button"
						class="flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] {selectedType === type.id ? `border-${type.color} bg-${type.color}/10 shadow-md` : 'border-base-300 bg-base-100 hover:border-primary/50'}"
						onclick={() => selectedType = type.id}
					>
						<span class="text-xl mb-1">{type.emoji}</span>
						<span class="text-xs font-semibold">{type.id}</span>
					</button>
				{/each}
			</div>
			<p class="text-xs text-base-content/50 mt-2">
				{commitTypes.find(t => t.id === selectedType)?.description}
			</p>
		</div>

		<!-- Scope and Description -->
		<div class="grid md:grid-cols-4 gap-4">
			<div>
				<label class="text-sm font-medium text-base-content/70 mb-2 block">Scope (optional)</label>
				<input
					type="text"
					bind:value={scope}
					placeholder="e.g., auth, api"
					class="input input-bordered w-full rounded-xl text-sm"
					list="common-scopes"
				/>
				<datalist id="common-scopes">
					{#each commonScopes as s}
						<option value={s}></option>
					{/each}
				</datalist>
			</div>
			<div class="md:col-span-3">
				<label class="text-sm font-medium text-base-content/70 mb-2 flex items-center justify-between">
					<span>Description</span>
					<span class="font-mono text-xs {headerLength > 72 ? 'text-error' : headerLength > 50 ? 'text-warning' : 'text-success'}">{headerLength}/72</span>
				</label>
				<input
					type="text"
					bind:value={description}
					placeholder="A short description of the change"
					class="input input-bordered w-full rounded-xl text-sm {!headerValid ? 'input-error' : ''}"
					maxlength="100"
				/>
			</div>
		</div>

		<!-- Options Row -->
		<div class="flex flex-wrap items-center gap-4">
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={useEmoji} class="toggle toggle-sm toggle-primary" />
				<span class="text-sm">Use Emoji</span>
			</label>
			<label class="flex items-center gap-2 cursor-pointer">
				<input type="checkbox" bind:checked={isBreaking} class="toggle toggle-sm toggle-error" />
				<span class="text-sm {isBreaking ? 'text-error font-semibold' : ''}">Breaking Change</span>
			</label>
			<button
				type="button"
				class="btn btn-sm btn-ghost gap-1"
				onclick={() => showAdvanced = !showAdvanced}
			>
				{showAdvanced ? '▲ Less' : '▼ More Options'}
			</button>
		</div>

		<!-- Breaking Change Description -->
		{#if isBreaking}
			<div class="alert alert-error/20 rounded-xl border border-error/30">
				<div class="w-full">
					<h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
						<span>⚠️</span>
						Breaking Change Description
					</h4>
					<textarea
						bind:value={breakingDescription}
						placeholder="Describe what breaks and how to migrate..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-20 bg-base-100"
						spellcheck="false"
					></textarea>
				</div>
			</div>
		{/if}

		<!-- Advanced Options -->
		{#if showAdvanced}
			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<label class="text-sm font-medium text-base-content/70 mb-2 block">Body (optional)</label>
					<textarea
						bind:value={body}
						placeholder="Detailed description of the change..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-24"
						spellcheck="false"
					></textarea>
				</div>
				<div>
					<label class="text-sm font-medium text-base-content/70 mb-2 block">Issue References</label>
					<input
						type="text"
						bind:value={issueRef}
						placeholder="#123, #456 or JIRA-123"
						class="input input-bordered w-full rounded-xl text-sm mb-3"
					/>
					<label class="text-sm font-medium text-base-content/70 mb-2 block">Footer (optional)</label>
					<textarea
						bind:value={footer}
						placeholder="Additional footers like Co-authored-by..."
						class="textarea textarea-bordered w-full font-mono text-sm rounded-xl h-16"
						spellcheck="false"
					></textarea>
				</div>
			</div>
		{/if}

		<!-- Preview -->
		{#if commitMessage}
			<div class="card bg-base-200 rounded-2xl">
				<div class="card-body py-4">
					<div class="flex items-center justify-between mb-3">
						<h3 class="font-semibold flex items-center gap-2">
							<AppIcon name="file-pen" size={16} />
							Commit Message
							{#if !headerValid}
								<span class="badge badge-sm badge-error">Header too long</span>
							{/if}
						</h3>
						<CopyButton text={commitMessage} label="Copy" size="sm" />
					</div>
					<div class="bg-base-300/50 rounded-xl p-4">
						<pre class="font-mono text-sm whitespace-pre-wrap break-words">{commitMessage}</pre>
					</div>
				</div>
			</div>
		{/if}

		<!-- Git Command -->
		{#if commitMessage}
			<div class="card bg-base-200 rounded-xl">
				<div class="card-body py-3">
					<div class="flex items-center justify-between">
						<h4 class="text-sm font-medium text-base-content/70">Git Command</h4>
						<CopyButton text={`git commit -m "${commitMessage.replace(/"/g, '\\"').replace(/\n/g, '" -m "')}"`} size="sm" />
					</div>
					<code class="block mt-2 p-3 bg-base-300/50 rounded-lg text-sm font-mono break-all">
						git commit -m "{commitMessage.split('\n')[0]}"
						{#if commitMessage.split('\n').length > 1}
							<span class="text-base-content/50"> -m "..."</span>
						{/if}
					</code>
				</div>
			</div>
		{/if}

		<!-- Info -->
		<div class="card bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
			<div class="card-body py-4">
				<h4 class="text-sm font-semibold flex items-center gap-2">
					<AppIcon name="book-open" size={16} />
					Conventional Commits Format
				</h4>
				<div class="mt-2 grid gap-2 text-sm text-base-content/70">
					<code class="block p-2 bg-base-300/50 rounded-lg font-mono">
						&lt;type&gt;[optional scope][!]: &lt;description&gt;
					</code>
					<ul class="space-y-1 mt-2">
						<li>• <strong>feat</strong> triggers a MINOR version bump</li>
						<li>• <strong>fix</strong> triggers a PATCH version bump</li>
						<li>• <strong>BREAKING CHANGE</strong> or <strong>!</strong> triggers a MAJOR version bump</li>
					</ul>
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
