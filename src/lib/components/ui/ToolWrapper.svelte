<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { BASE_URL, getToolByPath } from '$lib/config/tools';
	import {
		getCanonicalUrl,
		getLastUpdatedForPath,
		shouldNoindex
	} from '$lib/config/indexing';
	import JsonLd from '$lib/components/content/JsonLd.svelte';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	interface Props {
		title?: string;
		description?: string;
		keywords?: string[];
		lastUpdated?: string;
		noindex?: boolean;
		children: Snippet;
	}

	let { title, description, keywords = [], lastUpdated, noindex = false, children }: Props = $props();

	const toolData = $derived(getToolByPath($page.url.pathname));
	const finalTitle = $derived(title ?? toolData?.name ?? 'Tool');
	const finalDescription = $derived(description ?? toolData?.description ?? '');
	const finalKeywords = $derived(keywords.length > 0 ? keywords : (toolData?.keywords ?? []));
	const pageNoindex = $derived(noindex || shouldNoindex($page.url.pathname));
	const canonicalUrl = $derived(getCanonicalUrl(BASE_URL, $page.url.pathname));
	const resolvedLastUpdated = $derived(getLastUpdatedForPath($page.url.pathname, lastUpdated));

	// Build breadcrumb from URL path e.g. /json/formatter → Home > JSON > Formatter
	const breadcrumbs = $derived.by(() => {
		const segments = $page.url.pathname.split('/').filter(Boolean);
		const crumbs = [{ name: 'Home', item: BASE_URL + '/', path: '/' }];
		let cumulativePath = '';
		for (const seg of segments) {
			cumulativePath += '/' + seg;
			const label = seg
				.replace(/-/g, ' ')
				.replace(/\b\w/g, (c) => c.toUpperCase());
			crumbs.push({ name: label, item: BASE_URL + cumulativePath, path: cumulativePath });
		}
		return crumbs;
	});

	const applicationData = $derived({
		name: finalTitle,
		description: finalDescription,
		url: canonicalUrl
	});

	// Format lastUpdated for display
	const lastUpdatedDisplay = $derived.by(() => {
		if (!resolvedLastUpdated) return null;
		try {
			return new Date(resolvedLastUpdated).toLocaleDateString('en-US', {
				year: 'numeric', month: 'long', day: 'numeric'
			});
		} catch {
			return resolvedLastUpdated;
		}
	});

	// Category label from first URL segment
	const categoryLabel = $derived.by(() => {
		const seg = $page.url.pathname.split('/').filter(Boolean)[0];
		return seg ? seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : null;
	});

	const categoryPath = $derived.by(() => {
		const seg = $page.url.pathname.split('/').filter(Boolean)[0];
		return seg ? '/' + seg : '/';
	});
</script>

<svelte:head>
	<title>{finalTitle} | OneDev Tools</title>
	<meta name="robots" content={pageNoindex ? 'noindex, follow' : 'index, follow'} />
	{#if finalDescription}
		<meta name="description" content={finalDescription} />
	{/if}
	{#if finalKeywords.length > 0}
		<meta name="keywords" content={finalKeywords.join(', ')} />
	{/if}

	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalUrl} />

	<!-- Open Graph -->
	<meta property="og:title" content="{finalTitle} | OneDev Tools" />
	<meta property="og:description" content={finalDescription} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{finalTitle} | OneDev Tools" />
	<meta name="twitter:description" content={finalDescription} />
</svelte:head>

<JsonLd application={applicationData} {breadcrumbs} />

<div class="flex h-full flex-col">
	<!-- Breadcrumb Nav -->
	{#if breadcrumbs.length > 1}
		<nav aria-label="Breadcrumb" class="mb-3 flex items-center gap-1 text-xs text-base-content/40">
			{#each breadcrumbs as crumb, i}
				{#if i < breadcrumbs.length - 1}
					<a href={crumb.path} class="hover:text-primary transition-colors truncate max-w-[120px]">{crumb.name}</a>
					<span aria-hidden="true">/</span>
				{:else}
					<span class="text-base-content/60 font-medium truncate max-w-[160px]">{crumb.name}</span>
				{/if}
			{/each}
		</nav>
	{/if}

	<!-- Tool Header -->
	<div class="mb-6">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div class="flex items-center gap-3 min-w-0">
				{#if toolData?.icon}
					<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
						<AppIcon name={toolData.icon} size={20} />
					</span>
				{/if}
				<h1 class="text-2xl font-bold tracking-tight text-base-content">{finalTitle}</h1>
			</div>
			{#if lastUpdatedDisplay}
				<span class="inline-flex items-center gap-1 rounded-full bg-base-200 px-3 py-1 text-xs text-base-content/50 shrink-0" title="Content last verified">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					Updated {lastUpdatedDisplay}
				</span>
			{/if}
		</div>
		{#if finalDescription}
			<p class="mt-2 text-base-content/60 leading-relaxed">{finalDescription}</p>
		{/if}
	</div>

	<!-- Tool Content -->
	<div class="flex-1">
		{@render children()}
	</div>
</div>
