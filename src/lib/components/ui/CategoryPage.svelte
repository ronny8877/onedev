<script lang="ts">
	import type { ToolCategory } from '$lib/config/tools';
	import { getCategorySlug, getActiveCategories } from '$lib/config/tools';
	import { SITE_ORIGIN, getPageCanonicalUrl, shouldNoindex } from '$lib/config/indexing';
	import { getCategoryGuide } from '$lib/config/content/category-guides';
	import JsonLd from '$lib/components/content/JsonLd.svelte';
	import FAQSection from '$lib/components/content/FAQSection.svelte';
	import ConceptExplainer from '$lib/components/content/ConceptExplainer.svelte';
	import UseCases from '$lib/components/content/UseCases.svelte';
	import CommonMistakes from '$lib/components/content/CommonMistakes.svelte';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';

	interface Props {
		category: ToolCategory;
	}

	let { category }: Props = $props();

	const slug = $derived(getCategorySlug(category));
	const canonicalUrl = $derived(getPageCanonicalUrl(`/${slug}`));
	const pageNoindex = $derived(shouldNoindex(`/${slug}`));
	const guide = $derived(getCategoryGuide(slug));

	const title = $derived(
		category.seoTitle ?? `${category.name} Tools — Free Online ${category.name} Utilities`
	);
	const description = $derived(
		category.description ??
			`Free online ${category.name.toLowerCase()} tools. ${category.items.length} utilities running entirely in your browser — no signup, no uploads.`
	);

	const breadcrumbs = $derived([
		{ name: 'Home', item: SITE_ORIGIN + '/' },
		{ name: category.name, item: canonicalUrl ?? `${SITE_ORIGIN}/${slug}` }
	]);

	const applicationData = $derived({
		name: title,
		description,
		url: canonicalUrl ?? `${SITE_ORIGIN}/${slug}`
	});

	const relatedCategories = $derived(
		getActiveCategories()
			.filter((c) => getCategorySlug(c) !== slug)
			.slice(0, 12)
	);
</script>

<svelte:head>
	<title>{title} | OneDev Tools</title>
	<meta name="robots" content={pageNoindex ? 'noindex, follow' : 'index, follow'} />
	<meta name="description" content={description} />
	{#if canonicalUrl}
		<link rel="canonical" href={canonicalUrl} />
	{/if}
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if canonicalUrl}
		<meta property="og:url" content={canonicalUrl} />
	{/if}
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<JsonLd application={applicationData} breadcrumbs={breadcrumbs} />

<div class="mx-auto max-w-5xl animate-fade-in">

	<!-- Breadcrumb -->
	<nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-1 text-xs text-muted">
		<a href="/" class="hover:text-primary transition-colors">Home</a>
		<span>/</span>
		<span class="font-medium">{category.name}</span>
	</nav>

	<!-- Header -->
	<div class="mb-8">
		<div class="mb-3 flex items-center gap-3">
			<span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
				<AppIcon name={category.icon} size={24} />
			</span>
			<h1 class="text-3xl font-bold tracking-tight text-base-content">{category.name} Tools</h1>
		</div>
		{#if category.description}
			<p class="text-base-content/70 leading-relaxed max-w-3xl">{category.description}</p>
		{/if}

		<!-- Privacy badge -->
		<div class="mt-4 inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-1.5 text-sm text-success">
			<AppIcon name="shield" class="size-4" />
			{category.items.filter(i => i.active !== false).length} tools · 100% browser-based · No uploads · No signup
		</div>
	</div>

	{#if guide}
		<section class="mb-10 rounded-xl border border-base-300 bg-base-100 p-6 shadow-sm">
			<h2 class="mb-3 text-xl font-bold text-base-content">About these {category.name} tools</h2>
			<div class="prose prose-sm max-w-none prose-p:text-base-content/80 prose-code:text-primary">
				{@html guide.intro}
			</div>
		</section>
	{/if}

	<!-- Tools Grid -->
	<h2 class="mb-4 text-xl font-bold text-base-content">Tools in this category</h2>
	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each category.items.filter(i => i.active !== false) as tool}
			<a
				href={tool.href}
				class="group card bg-base-100 border border-base-300/60 p-5 hover:border-primary/40 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
			>
				<div class="flex items-start gap-3">
					{#if tool.icon}
						<span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-base-200 text-primary group-hover:bg-primary/10 transition-colors">
							<AppIcon name={tool.icon} size={18} />
						</span>
					{/if}
					<div class="min-w-0">
						<h3 class="font-semibold text-base-content group-hover:text-primary transition-colors leading-snug">
							{tool.name}
						</h3>
						{#if tool.description}
							<p class="mt-1 text-xs text-base-content/55 leading-relaxed line-clamp-2">
								{tool.description}
							</p>
						{/if}
					</div>
				</div>
				<div class="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
					Open tool <AppIcon name="arrow-right" class="size-4" />
				</div>
			</a>
		{/each}
	</div>

	{#if guide}
		<div class="mt-12 space-y-6">
			<ConceptExplainer title="How these tools run in your browser" content={guide.howItWorks} />
			<UseCases useCases={guide.whenToUse} />
			<CommonMistakes mistakes={guide.pitfalls} />
			<FAQSection faqs={guide.faqs} />
		</div>
	{/if}

	<!-- Related Categories -->
	<div class="mt-16 pt-8 border-t border-base-300/50">
		<p class="text-sm text-base-content/50 mb-3">Related tools on OneDev Tools</p>
		<div class="flex flex-wrap gap-2">
			{#each relatedCategories as cat}
				<a href="/{getCategorySlug(cat)}" class="badge badge-ghost border border-base-300 hover:border-primary hover:text-primary transition-colors text-xs py-2.5 px-3">
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
		<a href="/editorial-policy" class="hover:text-primary transition-colors">Editorial Policy</a>
		<a href="/" class="hover:text-primary transition-colors">← All Tools</a>
	</div>
</div>
