<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { getToolByPath } from '$lib/config/tools';
	import {
		SITE_ORIGIN,
		getLastUpdatedForPath,
		getPageCanonicalUrl,
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
		canonicalHref?: string;
		children: Snippet;
	}

	let { title, description, keywords = [], lastUpdated, noindex = false, canonicalHref, children }: Props = $props();

	const toolData = $derived(getToolByPath($page.url.pathname));
	const finalTitle = $derived(title ?? toolData?.name ?? 'Tool');
	const finalDescription = $derived(description ?? toolData?.description ?? '');
	const finalKeywords = $derived(keywords.length > 0 ? keywords : (toolData?.keywords ?? []));
	const pageNoindex = $derived(noindex || shouldNoindex($page.url.pathname));
	const canonicalUrl = $derived(canonicalHref ?? getPageCanonicalUrl($page.url.pathname));
	const resolvedLastUpdated = $derived(getLastUpdatedForPath($page.url.pathname, lastUpdated));

	const breadcrumbs = $derived.by(() => {
		const segments = $page.url.pathname.split('/').filter(Boolean);
		const crumbs = [{ name: 'Home', item: SITE_ORIGIN + '/', path: '/' }];
		let cumulativePath = '';
		for (const seg of segments) {
			cumulativePath += '/' + seg;
			const label = seg
				.replace(/-/g, ' ')
				.replace(/\b\w/g, (c) => c.toUpperCase());
			crumbs.push({ name: label, item: SITE_ORIGIN + cumulativePath, path: cumulativePath });
		}
		return crumbs;
	});

	const applicationData = $derived({
		name: finalTitle,
		description: finalDescription,
		url: canonicalUrl ?? SITE_ORIGIN + $page.url.pathname
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

	{#if canonicalUrl}
		<link rel="canonical" href={canonicalUrl} />
	{/if}

	<meta property="og:title" content="{finalTitle} | OneDev Tools" />
	<meta property="og:description" content={finalDescription} />
	{#if canonicalUrl}
		<meta property="og:url" content={canonicalUrl} />
	{/if}
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{finalTitle} | OneDev Tools" />
	<meta name="twitter:description" content={finalDescription} />
</svelte:head>

<JsonLd application={applicationData} {breadcrumbs} />

<div class="flex h-full flex-col">
	<!-- Breadcrumb Nav -->
	{#if breadcrumbs.length > 1}
		<nav aria-label="Breadcrumb" class="mb-3 flex items-center gap-1 text-xs text-muted">
			{#each breadcrumbs as crumb, i}
				{#if i < breadcrumbs.length - 1}
					<a href={crumb.path} class="hover:text-primary transition-colors truncate max-w-[120px]">{crumb.name}</a>
					<span aria-hidden="true">/</span>
				{:else}
					<span class="font-medium truncate max-w-[160px]">{crumb.name}</span>
				{/if}
			{/each}
		</nav>
	{/if}

	<!-- Tool Header -->
	<div class="mb-6">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div class="flex items-center gap-3 min-w-0">
				{#if toolData?.icon}
					<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<AppIcon name={toolData.icon} class="size-4" />
					</span>
				{/if}
				<h1 class="text-2xl font-bold tracking-tight text-base-content">{finalTitle}</h1>
			</div>
			{#if lastUpdatedDisplay}
				<span class="inline-flex items-center gap-1 rounded-full bg-base-200 px-3 py-1 text-xs text-muted shrink-0" title="Content last verified">
					<AppIcon name="calendar" class="size-4" />
					Updated {lastUpdatedDisplay}
				</span>
			{/if}
		</div>
		{#if finalDescription}
			<p class="mt-2 text-muted leading-relaxed">{finalDescription}</p>
		{/if}
	</div>

	<!-- Tool Content -->
	<div class="flex-1">
		{@render children()}
	</div>
</div>
