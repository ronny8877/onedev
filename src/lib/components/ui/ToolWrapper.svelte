<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		children: Snippet;
	}

	let { title, description = '', children }: Props = $props();
</script>

<svelte:head>
	<title>{title} | OneDev Tools</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	<meta property="og:title" content="{title} | OneDev Tools" />
	<meta property="og:description" content={description} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{title} | OneDev Tools" />
	<meta name="twitter:description" content={description} />
</svelte:head>

<div class="flex h-full flex-col">
	<!-- Tool Header -->
	<div class="mb-8">
		<h2 class="text-2xl font-bold tracking-tight text-base-content">{title}</h2>
		{#if description}
			<p class="mt-2 text-base-content/60 leading-relaxed">{description}</p>
		{/if}
	</div>

	<!-- Tool Content -->
	<div class="flex-1">
		{@render children()}
	</div>
</div>
