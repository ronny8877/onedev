<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isFullscreen: boolean;
		onExit: () => void;
		children: Snippet;
		controls?: Snippet;
	}

	let { isFullscreen, onExit, children, controls }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isFullscreen) {
			onExit();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isFullscreen}
	<div class="fixed inset-0 z-[9999] bg-black">
		<!-- Main content area -->
		<div class="absolute inset-0">
			{@render children()}
		</div>

		<!-- Controls overlay (top right) -->
		{#if controls}
			<div class="absolute top-4 right-4 z-10 flex gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
				{@render controls()}
				<button class="btn btn-sm btn-ghost bg-black/50 text-white hover:bg-black/70" onclick={onExit}>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
					Exit
				</button>
			</div>
		{:else}
			<button 
				class="absolute top-4 right-4 z-10 btn btn-sm btn-ghost bg-black/50 text-white hover:bg-black/70 opacity-0 hover:opacity-100 transition-opacity duration-300"
				onclick={onExit}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
				</svg>
				Exit
			</button>
		{/if}
	</div>
{/if}
