<script lang="ts">
	import { getActiveCategories, getAllActiveTools, BASE_URL } from '$lib/config/tools';

	// Get tools from centralized config
	const categories = getActiveCategories();
	const allTools = getAllActiveTools();

	// Category colors and icons
	const categoryStyles: Record<string, { color: string; hoverBorder: string; bgClass: string }> = {
		'JSON': { color: 'primary', hoverBorder: 'hover:border-primary/20', bgClass: 'bg-primary/10' },
		'Base64': { color: 'warning', hoverBorder: 'hover:border-warning/20', bgClass: 'bg-warning/10' },
		'URL': { color: 'info', hoverBorder: 'hover:border-info/20', bgClass: 'bg-info/10' }
	};
</script>

<svelte:head>
	<title>OneDev Tools - Free Online Developer Tools | JSON, Base64, URL Utilities</title>
	<meta
		name="description"
		content="Free, fast, and privacy-focused developer tools. JSON formatter, validator, diff checker, Base64 encoder, URL parser, and more. No sign-up required. All processing happens locally in your browser."
	/>
	<meta name="keywords" content="developer tools, JSON formatter, JSON validator, Base64 encoder, Base64 decoder, URL encoder, URL decoder, query string parser, URL builder, slug generator, free online tools, privacy-focused tools" />
	<meta name="author" content="OneDev Tools" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="{BASE_URL}/" />
	
	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="OneDev Tools" />
	<meta property="og:title" content="OneDev Tools - Free Online Developer Tools" />
	<meta property="og:description" content="Free, fast, and privacy-focused developer tools. JSON formatter, Base64 encoder, URL utilities, and more. No sign-up required." />
	<meta property="og:url" content="{BASE_URL}/" />
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="OneDev Tools - Free Online Developer Tools" />
	<meta name="twitter:description" content="Free, fast, and privacy-focused developer tools. JSON formatter, Base64 encoder, URL utilities, and more." />
	
	<!-- Structured Data -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "OneDev Tools",
		"url": "${BASE_URL}",
		"description": "Free, fast, and privacy-focused developer tools for JSON, Base64, and URL manipulation.",
		"applicationCategory": "DeveloperApplication",
		"operatingSystem": "Any",
		"offers": {
			"@type": "Offer",
			"price": "0",
			"priceCurrency": "USD"
		},
		"featureList": ${JSON.stringify(allTools.slice(0, 10).map(t => t.name))}
	}
	</script>`}
</svelte:head>

<div class="mx-auto max-w-4xl">
	<!-- Hero Section -->
	<div class="mb-12 text-center">
		<h1 class="mb-4 text-4xl font-bold tracking-tight text-base-content lg:text-5xl">
			<span class="text-primary">One</span>Dev Tools
		</h1>
		<p class="text-lg text-base-content/70 leading-relaxed">
			Free, fast, and privacy-focused developer tools.
			<br />
			No sign-up required. Everything runs in your browser.
		</p>
	</div>

	<!-- Features -->
	<div class="mb-12 flex flex-wrap justify-center gap-4">
		<div class="flex items-center gap-2">
			<div class="badge badge-success gap-1.5 px-3 py-3">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					></path>
				</svg>
				100% Free
			</div>
		</div>
		<div class="flex items-center gap-2">
			<div class="badge badge-info gap-1.5 px-3 py-3">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					></path>
				</svg>
				Privacy First
			</div>
		</div>
		<div class="flex items-center gap-2">
			<div class="badge badge-warning gap-1.5 px-3 py-3">
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 10V3L4 14h7v7l9-11h-7z"
					></path>
				</svg>
				Lightning Fast
			</div>
		</div>
	</div>

	<!-- Tool Categories (from centralized config) -->
	{#each categories as category}
		{@const style = categoryStyles[category.name] || categoryStyles['JSON']}
		<section class="mb-12">
			<h2 class="mb-6 flex items-center gap-3 text-xl font-bold">
				<span class="flex h-9 w-9 items-center justify-center rounded-lg {style.bgClass} text-lg">
					{category.icon}
				</span>
				{category.name} Tools
			</h2>

			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each category.items as tool}
					<a
						href={tool.href}
						class="card bg-base-200 border border-base-300/50 transition-all duration-200 hover:-translate-y-1 hover:bg-base-200/80 hover:shadow-lg {style.hoverBorder}"
					>
						<div class="card-body p-5">
							<div class="mb-2 text-2xl">{tool.icon || '🔧'}</div>
							<h3 class="card-title text-base font-semibold">{tool.name}</h3>
							<p class="text-sm text-base-content/60 leading-relaxed">{tool.description || ''}</p>
						</div>
					</a>
				{/each}
			</div>
		</section>
	{/each}

	<!-- Footer -->
	<footer class="mt-16 border-t border-base-300/50 py-8 text-center text-sm text-base-content/50">
		<p>Built with Svelte, DaisyUI, and ❤️</p>
		<p class="mt-2">All processing happens locally in your browser. Your data never leaves your device.</p>
	</footer>
</div>
