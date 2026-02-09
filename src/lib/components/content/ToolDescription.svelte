<script lang="ts">
	interface Props {
		title: string;
		description: string;
		features?: string[];
		useCases?: string[];
	}

	let { title, description, features = [], useCases = [] }: Props = $props();
</script>

<div class="mb-8 rounded-xl border border-base-300 bg-base-200/50 p-6">
	<div class="prose prose-sm max-w-none">
		<h2 class="mt-0 text-2xl font-bold text-base-content">{title}</h2>
		<p class="text-base-content/80">{description}</p>

		{#if features.length > 0}
			<h3 class="mb-3 text-lg font-semibold text-base-content">Key Features</h3>
			<ul class="grid gap-2 sm:grid-cols-2">
				{#each features as feature}
					<li class="flex items-start gap-2">
						<svg class="mt-1 h-5 w-5 flex-shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
						<span>{feature}</span>
					</li>
				{/each}
			</ul>
		{/if}

		{#if useCases.length > 0}
			<h3 class="mb-3 text-lg font-semibold text-base-content">Common Use Cases</h3>
			<ul class="space-y-2">
				{#each useCases as useCase}
					<li class="flex items-start gap-2">
						<svg class="mt-1 h-5 w-5 flex-shrink-0 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
						</svg>
						<span>{useCase}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
