<script lang="ts">
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	interface Props {
		tips: string[];
	}

	let { tips }: Props = $props();
</script>

<section class="rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
	<h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-base-content">
		<AppIcon name="lightbulb" size={20} class="text-warning" />
		Tips
	</h2>
	<ul class="grid gap-3 sm:grid-cols-2">
		{#each tips as tip}
			<li class="flex items-start gap-2">
				<svg class="mt-1 h-5 w-5 shrink-0 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
				</svg>
				<span class="text-sm text-base-content/80">{tip}</span>
			</li>
		{/each}
	</ul>
</section>
