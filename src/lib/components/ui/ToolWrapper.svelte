<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { BASE_URL, getToolByPath } from '$lib/config/tools';

	interface Props {
		title?: string;
		description?: string;
		keywords?: string[];
		children: Snippet;
	}

	let { title, description, keywords = [], children }: Props = $props();

	// Auto-fetch from tools.ts if not provided
	const toolData = $derived(getToolByPath($page.url.pathname));
	const finalTitle = $derived(title ?? toolData?.name ?? 'Tool');
	const finalDescription = $derived(description ?? toolData?.description ?? '');

	let canonicalUrl = $derived(`${BASE_URL}${$page.url.pathname}`);
	
	// Structured Data for SoftwareApplication
	let jsonLd = $derived(JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		"name": finalTitle,
		"description": finalDescription,
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
	<title>{finalTitle} | OneDev Tools</title>
	{#if finalDescription}
		<meta name="description" content={finalDescription} />
	{/if}
	{#if keywords.length > 0}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	
	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:title" content="{finalTitle} | OneDev Tools" />
	<meta property="og:description" content={finalDescription} />
	<meta property="og:url" content={canonicalUrl} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="{finalTitle} | OneDev Tools" />
	<meta name="twitter:description" content={finalDescription} />

	<!-- Structured Data -->
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<div class="flex h-full flex-col">
	<!-- Tool Header -->
	<div class="mb-6">
		<h1 class="text-2xl font-bold tracking-tight text-base-content">{finalTitle}</h1>
		{#if finalDescription}
			<p class="mt-2 text-base-content/60 leading-relaxed">{finalDescription}</p>
		{/if}
	</div>

	<!-- Tool Content -->
	<div class="flex-1">
		{@render children()}
	</div>
</div>
