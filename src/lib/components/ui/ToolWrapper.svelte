<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { BASE_URL } from '$lib/config/tools';

	interface Props {
		title: string;
		description?: string;
		keywords?: string[];
		children: Snippet;
	}

	let { title, description = '', keywords = [], children }: Props = $props();

	let canonicalUrl = $derived(`${BASE_URL}${$page.url.pathname}`);
	
	// Structured Data for SoftwareApplication
	let jsonLd = $derived(JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": title,
		"description": description,
		"applicationCategory": "DeveloperApplication",
		"operatingSystem": "Any",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		},
		"url": canonicalUrl
	}));
</script>

<svelte:head>
	<title>{title} | OneDev Tools</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
	{#if keywords.length > 0}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	
	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:title" content="{title} | OneDev Tools" />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{title} | OneDev Tools" />
	<meta name="twitter:description" content={description} />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="flex h-full flex-col">
	<!-- Tool Header -->
	<div class="mb-6">
		<h1 class="text-2xl font-bold tracking-tight text-base-content">{title}</h1>
		{#if description}
			<p class="mt-2 text-base-content/60 leading-relaxed">{description}</p>
		{/if}
	</div>

	<!-- Tool Content -->
	<div class="flex-1">
		{@render children()}
	</div>
</div>
