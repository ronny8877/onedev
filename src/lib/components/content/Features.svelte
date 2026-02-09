<script lang="ts">
	interface Props {
		features: string[];
	}

	let { features }: Props = $props();
</script>

<section class="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
	<h2 class="mb-4 text-xl font-bold text-base-content">Features</h2>
	<ul class="grid gap-3 sm:grid-cols-2">
		{#each features as feature}
			<li class="flex items-start gap-2">
				<svg class="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
				</svg>
				<span class="text-sm text-base-content/80">{feature}</span>
			</li>
		{/each}
	</ul>
</section>
