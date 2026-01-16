<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		icon?: string;
		children: Snippet;
	}

	let { title, description = '', icon = '', children }: Props = $props();
</script>

<div class="card bg-base-200 rounded-2xl overflow-hidden">
	<div class="card-body p-4">
		<div class="flex items-center gap-2 mb-3">
			{#if icon}
				<span class="text-xl">{icon}</span>
			{/if}
			<div>
				<h3 class="font-semibold text-base-content">{title}</h3>
				{#if description}
					<p class="text-xs text-base-content/60">{description}</p>
				{/if}
			</div>
		</div>
		<div class="space-y-1">
			{@render children()}
		</div>
	</div>
</div>
