<script lang="ts">
	import { goto } from '$app/navigation';
	import { getAllActiveTools, type ToolItem, getActiveCategories } from '$lib/config/tools';
	import { fade } from 'svelte/transition';
	import { trackEvent, trackToolSelect } from '$lib/utils/analytics';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	interface Props {
		open?: boolean;
		onClose?: () => void;
	}

	let { open = $bindable(false), onClose }: Props = $props();

	let searchQuery = $state('');
	let selectedIndex = $state(0);
	let inputRef: HTMLInputElement;

	const allTools = getAllActiveTools();
	const categories = getActiveCategories();

	// Create a mapping of tool href to category name
	const toolCategoryMap = new Map<string, string>();
	for (const cat of categories) {
		for (const tool of cat.items) {
			toolCategoryMap.set(tool.href, cat.name);
		}
	}

	let filteredTools = $derived(() => {
		if (!searchQuery.trim()) return allTools.slice(0, 8);

		const query = searchQuery.toLowerCase();
		
		return allTools
			.map(tool => {
				const name = tool.name.toLowerCase();
				const description = tool.description?.toLowerCase() || '';
				const category = toolCategoryMap.get(tool.href)?.toLowerCase() || '';
				
				let score = 0;
				if (name === query) score += 100;
				else if (name.startsWith(query)) score += 50;
				else if (name.includes(query)) score += 20;
				else if (description.includes(query)) score += 10;
				else if (category.includes(query)) score += 5;
				
				return { tool, score };
			})
			.filter(item => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.map(item => item.tool)
			.slice(0, 8);
	});

	function handleKeydown(event: KeyboardEvent) {
		const tools = filteredTools();

		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, tools.length - 1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				break;
			case 'Enter':
				event.preventDefault();
				if (tools[selectedIndex]) {
					navigateTo(tools[selectedIndex]);
				}
				break;
			case 'Escape':
				event.preventDefault();
				closeModal();
				break;
		}
	}

	function navigateTo(tool: ToolItem) {
		if (searchQuery.trim()) {
			trackEvent('search', { search_term: searchQuery.trim() });
		}
		trackToolSelect(tool.name, toolCategoryMap.get(tool.href), 'search');
		closeModal();
		goto(tool.href);
	}

	function closeModal() {
		open = false;
		searchQuery = '';
		selectedIndex = 0;
		onClose?.();
	}

	// Reset selected index when search changes
	$effect(() => {
		searchQuery;
		selectedIndex = 0;
	});

	// Focus input when modal opens
	$effect(() => {
		if (open && inputRef) {
			setTimeout(() => inputRef?.focus(), 50);
		}
	});
	let resultsContainer: HTMLDivElement;

	// Scroll selected item into view
	$effect(() => {
		// Depend on selectedIndex
		selectedIndex; 
		if (resultsContainer) {
			const selectedElement = resultsContainer.children[selectedIndex] as HTMLElement;
			if (selectedElement) {
				selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
			}
		}
	});
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 bg-black/50 z-100"
		transition:fade={{ duration: 100 }}
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
		role="button"
		tabindex="-1"
	></div>

	<!-- Modal -->
	<div
		class="command-palette bg-base-100"
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-label="Search tools"
	>
		<!-- Search Input -->
		<div class="flex items-center gap-3 px-4 py-3 border-b border-base-300">
			<AppIcon name="search" class="size-4 text-muted" />
			<input
				bind:this={inputRef}
				bind:value={searchQuery}
				type="text"
				placeholder="Search tools..."
				class="flex-1 bg-transparent outline-none text-base-content input input-ghost"
			/>
			<kbd class="kbd kbd-sm">ESC</kbd>
		</div>

		<!-- Results -->
		<div 
			class="max-h-80 overflow-y-auto p-2"
			bind:this={resultsContainer}
		>
			{#if filteredTools().length > 0}
				{#each filteredTools() as tool, i}
					<button
						class="result-item {i === selectedIndex ? 'bg-base-300 text-base-content' : 'hover:bg-base-200'}"
						onclick={() => navigateTo(tool)}
						onmouseenter={() => selectedIndex = i}
					>
						<div class="flex items-center gap-3">
							<AppIcon name={tool.icon} class="size-4" />
							<div class="text-left">
								<div class="font-medium text-sm">{tool.name}</div>
								<div class="text-xs text-base-content/50">{toolCategoryMap.get(tool.href)}</div>
							</div>
						</div>
						{#if i === selectedIndex}
							<kbd class="kbd kbd-xs">↵</kbd>
						{/if}
					</button>
				{/each}
			{:else}
				<div class="py-8 text-center text-base-content/50 text-sm">
					No tools found for "{searchQuery}"
				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="px-4 py-2 border-t border-base-300 flex items-center justify-between text-xs text-base-content/50">
			<div class="flex items-center gap-3">
				<span class="flex items-center gap-1"><kbd class="kbd kbd-xs">↑</kbd><kbd class="kbd kbd-xs">↓</kbd> navigate</span>
				<span class="flex items-center gap-1"><kbd class="kbd kbd-xs">↵</kbd> select</span>
			</div>
			<span>{allTools.length} tools available</span>
		</div>
	</div>
{/if}

<style>
	.command-palette {
		position: fixed;
		top: 15%;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		max-width: 32rem;
		border: 1px solid var(--color-base-300);
		border-radius: 0.5rem;
		box-shadow: 0 8px 24px -8px rgb(0 0 0 / 0.35);
		z-index: 101;
		overflow: hidden;
	}

	.result-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.1s ease;
	}
</style>
