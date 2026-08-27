<script lang="ts">
	import { getTheme, toggleTheme } from '$lib/stores/theme.svelte.ts';
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
	class="bg-base-100 fixed top-0 right-0 left-0 lg:left-80 z-50 flex h-[var(--topbar-height)] items-center border-b border-base-300 px-6"
>
	<div class="flex w-full items-center justify-between">
		<div class="flex items-center gap-3 pl-12 md:pl-0">
			<h1 class="text-lg font-semibold text-base-content">{toolName}</h1>
		</div>

		<div class="flex items-center gap-3">
			<button
				class="btn btn-ghost h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg"
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

			<button
				class="btn btn-ghost hidden h-8 min-h-8 rounded-lg border border-base-300 px-3 font-normal sm:inline-flex"
				onclick={onSearchClick}
			>
				<AppIcon name="search" class="size-4 text-muted" />
				<span class="text-sm text-muted">Search tools...</span>
				<kbd class="kbd kbd-sm text-muted">{getShortcutKey()}</kbd>
			</button>

			<button
				class="btn btn-ghost h-8 w-8 min-h-8 min-w-8 p-0 rounded-lg sm:hidden"
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
