<script lang="ts">
	import ToolWrapper from '$lib/components/ui/ToolWrapper.svelte';
	import CodeMirrorEditor from '$lib/components/ui/CodeMirrorEditor.svelte';
	import ToolActions from '$lib/components/ui/ToolActions.svelte';
	import { countTags, type TagCount } from '$lib/utils/html';

	let input = $state('');
	let sortBy = $state<'count' | 'name'>('count');
	let viewMode = $state<'bars' | 'grid'>('bars');

	function handleClear() {
		input = '';
	}

	function loadExample() {
		input = `<!DOCTYPE html>
<html>
<head>
    <title>Sample</title>
</head>
<body>
    <div class="container">
        <h1>Header</h1>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
        </ul>
        <div class="footer">
            <span>Footer</span>
        </div>
    </div>
</body>
</html>`;
	}

	const tags = $derived.by(() => {
		if (!input.trim()) return [];
		const result = countTags(input);
		if (sortBy === 'name') {
			return result.sort((a, b) => a.tag.localeCompare(b.tag));
		}
		return result;
	});

	const totalCount = $derived(tags.reduce((sum, t) => sum + t.count, 0));
	const maxCount = $derived(tags.length > 0 ? Math.max(...tags.map(t => t.count)) : 0);

	function getPercentage(count: number): number {
		return maxCount > 0 ? (count / maxCount) * 100 : 0;
	}

	function getTagColor(tag: string): string {
		const hue = tag.split('').reduce((h, c) => h + c.charCodeAt(0), 0) % 360;
		return `hsl(${hue}, 65%, 55%)`;
	}

	let stats = $derived({
		chars: input.length,
		lines: input.split('\n').length
	});
</script>

<ToolWrapper
	title="Tag Counter"
	description="Count and analyze HTML elements by tag type"
>
	<div class="flex flex-col gap-6">
		<!-- Actions -->
		<ToolActions onSample={loadExample} onClear={handleClear} {stats} />

		<!-- Summary Cards -->
		{#if tags.length > 0}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div class="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
							<span class="text-2xl">🔢</span>
						</div>
						<div>
							<div class="text-2xl font-bold text-primary">{totalCount.toLocaleString()}</div>
							<div class="text-xs text-base-content/50">total elements</div>
						</div>
					</div>
				</div>
				
				<div class="p-4 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl border border-secondary/20">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
							<span class="text-2xl">🏷️</span>
						</div>
						<div>
							<div class="text-2xl font-bold text-secondary">{tags.length}</div>
							<div class="text-xs text-base-content/50">unique tags</div>
						</div>
					</div>
				</div>
				
				{#if tags[0]}
					<div class="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20">
						<div class="flex items-center gap-3">
							<div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
								<span class="text-2xl">🥇</span>
							</div>
							<div>
								<div class="text-2xl font-bold text-accent font-mono">&lt;{tags[0].tag}&gt;</div>
								<div class="text-xs text-base-content/50">most used ({tags[0].count})</div>
							</div>
						</div>
					</div>
				{/if}
				
				<div class="p-4 bg-gradient-to-br from-info/10 to-info/5 rounded-2xl border border-info/20">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
							<span class="text-2xl">📊</span>
						</div>
						<div>
							<div class="text-2xl font-bold text-info">{(totalCount / tags.length).toFixed(1)}</div>
							<div class="text-xs text-base-content/50">avg per tag</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Input -->
		<div>
			<div class="flex items-center justify-between mb-2">
				<h3 class="text-sm font-medium text-base-content/70">HTML Input</h3>
			</div>
			<CodeMirrorEditor bind:value={input} placeholder="Paste your HTML here..." />
		</div>

		<!-- Results -->
		{#if tags.length > 0}
			<div class="space-y-4">
				<!-- Controls -->
				<div class="flex items-center justify-between">
					<h3 class="font-semibold">Tag Distribution</h3>
					<div class="flex items-center gap-2">
						<div class="join">
							<button
								type="button"
								class="btn btn-xs join-item {sortBy === 'count' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => sortBy = 'count'}
							>
								By Count
							</button>
							<button
								type="button"
								class="btn btn-xs join-item {sortBy === 'name' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => sortBy = 'name'}
							>
								A-Z
							</button>
						</div>
						<div class="join">
							<button
								type="button"
								class="btn btn-xs join-item {viewMode === 'bars' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => viewMode = 'bars'}
								title="Bar view"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
								</svg>
							</button>
							<button
								type="button"
								class="btn btn-xs join-item {viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}"
								onclick={() => viewMode = 'grid'}
								title="Grid view"
							>
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>

				<!-- Bar View -->
				{#if viewMode === 'bars'}
					<div class="space-y-2">
						{#each tags as { tag, count }}
							<div class="flex items-center gap-3 p-2 hover:bg-base-200/50 rounded-lg transition-colors">
								<code class="font-mono text-sm min-w-16 font-medium" style="color: {getTagColor(tag)}">&lt;{tag}&gt;</code>
								<div class="flex-1 h-6 bg-base-200 rounded-full overflow-hidden">
									<div
										class="h-full rounded-full transition-all duration-500 ease-out"
										style="width: {getPercentage(count)}%; background: linear-gradient(90deg, {getTagColor(tag)}, {getTagColor(tag)}88)"
									></div>
								</div>
								<span class="font-mono font-bold min-w-8 text-right">{count}</span>
							</div>
						{/each}
					</div>
				{/if}

				<!-- Grid View -->
				{#if viewMode === 'grid'}
					<div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{#each tags as { tag, count }}
							<div 
								class="flex items-center justify-between p-3 rounded-xl border transition-all hover:scale-[1.02]"
								style="background: {getTagColor(tag)}10; border-color: {getTagColor(tag)}30"
							>
								<code class="font-mono font-medium" style="color: {getTagColor(tag)}">&lt;{tag}&gt;</code>
								<span class="text-lg font-bold" style="color: {getTagColor(tag)}">{count}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Quick Tags -->
			<div class="flex flex-wrap gap-2 pt-2">
				{#each tags.slice(0, 12) as { tag, count }}
					<span 
						class="px-3 py-1.5 rounded-full font-mono text-sm transition-transform hover:scale-105"
						style="background: {getTagColor(tag)}20; color: {getTagColor(tag)}"
					>
						{tag} <span class="opacity-60">×{count}</span>
					</span>
				{/each}
				{#if tags.length > 12}
					<span class="px-3 py-1.5 rounded-full bg-base-200 text-sm text-base-content/50">
						+{tags.length - 12} more
					</span>
				{/if}
			</div>
		{:else if input.trim()}
			<div class="flex flex-col items-center justify-center py-12 text-center">
				<div class="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-4">
					<span class="text-3xl">📊</span>
				</div>
				<p class="text-base-content/50">No HTML elements found</p>
			</div>
		{/if}
	</div>
</ToolWrapper>
