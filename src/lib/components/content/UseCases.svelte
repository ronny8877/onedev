<script lang="ts">
	interface Props {
		useCases: string[];
	}

	let { useCases }: Props = $props();
</script>

<section class="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
	<h2 class="mb-4 text-xl font-bold text-base-content">Common Use Cases</h2>
	<ul class="space-y-2">
		{#each useCases as useCase}
			<li class="flex items-start gap-2">
				<svg class="mt-1 h-5 w-5 flex-shrink-0 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
				</svg>
				<span class="text-sm text-base-content/80">{useCase}</span>
			</li>
		{/each}
	</ul>
</section>
