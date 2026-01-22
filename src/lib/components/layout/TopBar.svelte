<script lang="ts">
	interface Props {
		toolName?: string;
		onSearchClick?: () => void;
	}

	let { toolName = 'Dev Tools', onSearchClick }: Props = $props();

	function getShortcutKey(): string {
		if (typeof navigator !== 'undefined' && navigator.platform?.includes('Mac')) {
			return '⌘K';
		}
		return 'Ctrl+K';
	}
</script>

<header
	class="bg-base-100/80 fixed top-0 right-0 left-0 lg:left-80 z-50 flex h-[var(--topbar-height)] items-center border-b border-base-300 px-6 backdrop-blur-md"
>
	<div class="flex w-full items-center justify-between">
		<!-- Tool Name / Left Side -->
		<div class="flex items-center gap-3 pl-12 md:pl-0">
			<h1 class="text-lg font-semibold text-base-content">{toolName}</h1>
		</div>

		<!-- Right Side - Search Bar -->
		<div class="flex items-center gap-3">
			<button
				class="hidden sm:flex items-center gap-3 px-4 py-2 bg-base-200 hover:bg-base-300 rounded-lg border border-base-300 transition-all duration-200 cursor-pointer group"
				onclick={onSearchClick}
			>
				<svg class="w-4 h-4 text-base-content/50 group-hover:text-base-content/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<span class="text-sm text-base-content/50 group-hover:text-base-content/70">Search tools...</span>
				<kbd class="kbd kbd-sm text-base-content/40">{getShortcutKey()}</kbd>
			</button>

			<!-- Mobile Search Button -->
			<button
				class="btn btn-ghost btn-circle btn-sm sm:hidden"
				onclick={onSearchClick}
				aria-label="Search"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</button>
		</div>
	</div>
</header>

<!-- Mobile adjustments -->
<style>
	@media (max-width: 768px) {
		header {
			left: 0;
		}
	}
</style>
