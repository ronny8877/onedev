<script lang="ts">
	import type { ToolCategory, ToolItem } from '$lib/config/tools';
	import { BASE_URL, getCategorySlug } from '$lib/config/tools';
	import JsonLd from '$lib/components/content/JsonLd.svelte';
	import { page } from '$app/stores';

	interface Props {
		category: ToolCategory;
	}

	let { category }: Props = $props();

	const slug = $derived(getCategorySlug(category));
	const canonicalUrl = $derived(`${BASE_URL}/${slug}`);

	const title = $derived(`${category.name} Tools — Free Online ${category.name} Utilities`);
	const description = $derived(category.description ?? `Free online ${category.name.toLowerCase()} tools. ${category.items.length} utilities running entirely in your browser — no signup, no uploads.`);

	const breadcrumbs = $derived([
		{ name: 'Home', item: BASE_URL + '/' },
		{ name: category.name, item: canonicalUrl }
	]);

	const applicationData = $derived({
		name: title,
		description,
		url: canonicalUrl
	});
</script>

<svelte:head>
	<title>{title} | OneDev Tools</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<JsonLd application={applicationData} {breadcrumbs} />

<div class="mx-auto max-w-5xl animate-fade-in">

	<!-- Breadcrumb -->
	<nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-1 text-xs text-base-content/40">
		<a href="/" class="hover:text-primary transition-colors">Home</a>
		<span>/</span>
		<span class="text-base-content/60 font-medium">{category.name}</span>
	</nav>

	<!-- Header -->
	<div class="mb-8">
		<div class="mb-3 flex items-center gap-3">
			<span class="text-4xl">{category.icon}</span>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">{category.name} Tools</h1>
		</div>
		{#if category.description}
			<p class="text-base-content/70 leading-relaxed max-w-3xl">{category.description}</p>
		{/if}

		<!-- Privacy badge -->
		<div class="mt-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm text-success">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
			</svg>
			{category.items.filter(i => i.active !== false).length} tools · 100% browser-based · No uploads · No signup
		</div>
	</div>

	<!-- Tools Grid -->
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each category.items.filter(i => i.active !== false) as tool}
			<a
				href={tool.href}
				class="group card bg-base-100 border border-base-300/60 p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
			>
				<div class="flex items-start gap-3">
					{#if tool.icon}
						<span class="mt-0.5 text-xl shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">{tool.icon}</span>
					{/if}
					<div class="min-w-0">
						<h2 class="font-semibold text-base-content group-hover:text-primary transition-colors leading-snug">
							{tool.name}
						</h2>
						{#if tool.description}
							<p class="mt-1 text-xs text-base-content/55 leading-relaxed line-clamp-2">
								{tool.description}
							</p>
						{/if}
					</div>
				</div>
				<div class="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
					Open tool <span aria-hidden="true">→</span>
				</div>
			</a>
		{/each}
	</div>

	<!-- Related Categories -->
	<div class="mt-16 pt-8 border-t border-base-300/50">
		<p class="text-sm text-base-content/50 mb-3">Related tools on OneDev Tools</p>
		<div class="flex flex-wrap gap-2">
			{#each [
				{ name: 'JSON', slug: 'json' },
				{ name: 'Base64', slug: 'base64' },
				{ name: 'Hash', slug: 'hash' },
				{ name: 'Security', slug: 'security' },
				{ name: 'Regex', slug: 'regex' },
				{ name: 'YAML', slug: 'yaml' },
				{ name: 'AI Utilities', slug: 'ai' },
				{ name: 'Git', slug: 'git' },
			].filter(c => c.slug !== slug) as cat}
				<a href="/{cat.slug}" class="badge badge-ghost border border-base-300 hover:border-primary hover:text-primary transition-colors text-xs py-2.5 px-3">
					{cat.name}
				</a>
			{/each}
		</div>
	</div>

	<!-- Footer trust links -->
	<div class="mt-8 flex flex-wrap gap-4 text-xs text-base-content/40">
		<a href="/about" class="hover:text-primary transition-colors">About</a>
		<a href="/privacy" class="hover:text-primary transition-colors">Privacy Policy</a>
		<a href="/contact" class="hover:text-primary transition-colors">Contact</a>
		<a href="/" class="hover:text-primary transition-colors">← All Tools</a>
	</div>
</div>
