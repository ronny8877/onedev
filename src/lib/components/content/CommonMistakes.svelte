<script lang="ts">
	interface Props {
		mistakes: string[];
	}

	let { mistakes }: Props = $props();
</script>

{#if mistakes && mistakes.length > 0}
	<div class="mb-8">
		<h2 class="mb-4 text-xl font-bold tracking-tight text-base-content flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
			</svg>
			Common Mistakes
		</h2>
		<div class="grid gap-3 sm:grid-cols-2">
			{#each mistakes as mistake}
				<div class="flex items-start gap-3 rounded-xl border border-error/20 bg-error/5 p-4">
					<svg class="mt-0.5 h-5 w-5 shrink-0 text-error/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
					<span class="text-sm leading-relaxed text-base-content/80">{mistake}</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
