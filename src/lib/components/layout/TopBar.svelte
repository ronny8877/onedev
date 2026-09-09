<script lang="ts">
	import { resolve } from '$app/paths';
	import { getTheme, toggleTheme } from '$lib/stores/theme.svelte';
	import { REPOSITORY_URL } from '$lib/config/site';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	interface Props {
		toolName?: string;
		onSearchClick?: () => void;
	}

	let { toolName = 'Dev Tools', onSearchClick }: Props = $props();

	let currentTheme = $derived(getTheme());

	function getShortcutKey(): string {
		if (typeof navigator !== 'undefined' && navigator.platform?.includes('Mac')) {
			return '⌘K';
		}
		return 'Ctrl+K';
	}
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 flex h-[var(--topbar-height)] items-center border-b border-base-300 bg-base-100 px-6 lg:left-80"
>
	<div class="flex w-full items-center justify-between">
		<div class="flex items-center gap-3 pl-12 md:pl-0">
			<h1 class="text-lg font-semibold text-base-content">{toolName}</h1>
		</div>

		<div class="flex items-center gap-3">
			<button
				class="btn h-8 min-h-8 w-8 min-w-8 rounded-lg btn-ghost p-0"
				onclick={toggleTheme}
				aria-label={currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
				title={currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
			>
				{#if currentTheme === 'dark'}
					<AppIcon name="sun" class="size-4" />
				{:else}
					<AppIcon name="moon" class="size-4" />
				{/if}
			</button>

			<a
				href={resolve('/mcp')}
				class="btn h-8 min-h-8 gap-2 rounded-lg border border-base-300 btn-ghost px-3 font-normal"
				aria-label="Open MCP server"
			>
				<AppIcon name="bot" class="size-4 text-primary" />
				<span class="text-sm text-base-content">MCP</span>
			</a>

			<a
				href={REPOSITORY_URL}
				target="_blank"
				rel="noopener noreferrer"
				class="btn hidden h-8 min-h-8 gap-2 rounded-lg border border-base-300 btn-ghost px-3 font-normal md:inline-flex"
				aria-label="View OneDev Tools source on GitHub"
			>
				<span class="text-sm text-base-content">GitHub</span>
			</a>

			<button
				class="btn hidden h-8 min-h-8 rounded-lg border border-base-300 btn-ghost px-3 font-normal sm:inline-flex"
				onclick={onSearchClick}
			>
				<AppIcon name="search" class="text-muted size-4" />
				<span class="text-muted text-sm">Search tools...</span>
				<kbd class="text-muted kbd kbd-sm">{getShortcutKey()}</kbd>
			</button>

			<button
				class="btn h-8 min-h-8 w-8 min-w-8 rounded-lg btn-ghost p-0 sm:hidden"
				onclick={onSearchClick}
				aria-label="Search"
			>
				<AppIcon name="search" class="size-4" />
			</button>
		</div>
	</div>
</header>

<style>
	@media (max-width: 768px) {
		header {
			left: 0;
		}
	}
</style>
