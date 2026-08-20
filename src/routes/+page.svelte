<script lang="ts">
	import { getActiveCategories, getAllActiveTools, BASE_URL } from '$lib/config/tools';
	import logo from '$lib/assets/logo.png';
	// Get tools from centralized config
	const categories = getActiveCategories();
	const allTools = getAllActiveTools();

	// Category colors and icons
	const categoryStyles: Record<string, { color: string; hoverBorder: string; bgClass: string }> = {
		'JSON': { color: 'primary', hoverBorder: 'hover:border-primary/20', bgClass: 'bg-primary/10' },
		'Base64': { color: 'warning', hoverBorder: 'hover:border-warning/20', bgClass: 'bg-warning/10' },
		'URL': { color: 'info', hoverBorder: 'hover:border-info/20', bgClass: 'bg-info/10' },
		'Image': { color: 'secondary', hoverBorder: 'hover:border-secondary/20', bgClass: 'bg-secondary/10' },
		'System': { color: 'accent', hoverBorder: 'hover:border-accent/20', bgClass: 'bg-accent/10' },
		'Text': { color: 'success', hoverBorder: 'hover:border-success/20', bgClass: 'bg-success/10' },
		'HTML': { color: 'error', hoverBorder: 'hover:border-error/20', bgClass: 'bg-error/10' },
		'Break': { color: 'neutral', hoverBorder: 'hover:border-neutral/20', bgClass: 'bg-neutral/10' },
		'Convert': { color: 'info', hoverBorder: 'hover:border-info/20', bgClass: 'bg-info/10' },
		'CSS': { color: 'secondary', hoverBorder: 'hover:border-secondary/20', bgClass: 'bg-secondary/10' },
		'AI Utilities': { color: 'warning', hoverBorder: 'hover:border-warning/20', bgClass: 'bg-warning/10' },
		'Hash': { color: 'primary', hoverBorder: 'hover:border-primary/20', bgClass: 'bg-primary/10' },
		'QR & Barcode': { color: 'secondary', hoverBorder: 'hover:border-secondary/20', bgClass: 'bg-secondary/10' },
		'XML': { color: 'error', hoverBorder: 'hover:border-error/20', bgClass: 'bg-error/10' },
		'CSV': { color: 'success', hoverBorder: 'hover:border-success/20', bgClass: 'bg-success/10' },
		'Date & Time': { color: 'info', hoverBorder: 'hover:border-info/20', bgClass: 'bg-info/10' },
		'PDF': { color: 'error', hoverBorder: 'hover:border-error/20', bgClass: 'bg-error/10' },
		'YAML': { color: 'warning', hoverBorder: 'hover:border-warning/20', bgClass: 'bg-warning/10' },
		'JWT': { color: 'accent', hoverBorder: 'hover:border-accent/20', bgClass: 'bg-accent/10' },
		'Git': { color: 'secondary', hoverBorder: 'hover:border-secondary/20', bgClass: 'bg-secondary/10' }
	};
</script>

<svelte:head>
	<title>OneDev Tools — {allTools.length} Free Developer Tools | JSON, XML, CSV, Dates, AI</title>
	<meta
		name="description"
		content="Client-side developer tools for JSON, XML, CSV, Unix timestamps, hashes, JWTs, regex, PDFs, QR codes, and more. No signup. Tool input stays in your browser."
	/>
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
		<img src={logo} alt="OneDev Tools Logo" class="w-96 h-60 rounded-3xl mx-auto mb-4" />
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

	<!-- Tool Count -->
	<div class="mb-8 text-center">
		<div class="inline-flex items-center gap-2 bg-base-200 px-4 py-2 rounded-full border border-base-300">
			<span class="text-2xl font-bold text-primary">{allTools.length}</span>
			<span class="text-base-content/70">tools and counting</span>
		</div>
	</div>

	<!-- Original copy so the homepage is not only a card grid -->
	<section class="mb-12 rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8 text-left">
		<h2 class="text-2xl font-bold text-base-content mb-4">Developer tools that stay on your machine</h2>
		<div class="prose prose-sm sm:prose-base max-w-none text-base-content/80">
			<p>
				OneDev Tools is a collection of utilities for everyday engineering work: formatting JSON, decoding JWTs, hashing files, generating QR codes, converting units, drafting CSP headers, and more. Every tool runs as JavaScript in this tab. We do not operate a processing API that receives your paste.
			</p>
			<p>
				That design is the product. Paste an access token into a JWT decoder, a customer export into a JSON formatter, or a private key into a Base64 tool and you should not have to wonder which log file on someone else's server now has a copy. Hosted formatters that upload the payload are convenient until the payload is production data.
			</p>
			<p>
				The site is free, has no accounts, and does not gate features. Google Analytics records page views so we can see which tools people open. Tool input stays in the browser. Read the <a href="/privacy">privacy policy</a> and <a href="/about">about page</a> if you want the full picture, including how we handle explanatory copy and AI pricing tables in the <a href="/editorial-policy">editorial policy</a>.
			</p>
		</div>

		<h3 class="text-lg font-semibold text-base-content mt-6 mb-3">How to pick a tool</h3>
		<ul class="space-y-2 text-sm text-base-content/80">
			<li><strong class="text-base-content">Start from the category</strong> if you know the job (JSON, Hash, Regex, PDF). Each category page explains when to use the suite and which mistakes to avoid, then links into the individual tools.</li>
			<li><strong class="text-base-content">Use search in the sidebar</strong> if you remember the name (slug generator, cron explainer, HMAC).</li>
			<li><strong class="text-base-content">Prefer a local CLI</strong> for multi-hundred-megabyte files or air-gapped policy. A browser tab will run out of memory before a well-written command-line tool does.</li>
			<li><strong class="text-base-content">Do not treat encoding as encryption.</strong> Base64, JWT decode, and URL encode are not a vault. Hash tools verify integrity; they do not hide secrets.</li>
		</ul>

		<h3 class="text-lg font-semibold text-base-content mt-6 mb-3">What we will not do</h3>
		<p class="text-sm text-base-content/80 leading-relaxed">
			We will not ask you to sign in to format JSON. We will not upload your PDF to compress it. We will not run your prompt against a hosted model from the AI token counters. Those pages estimate tokens and cost from published tokenizers and price lists. If a page cannot do the job honestly in the browser, we would rather omit the feature than fake a server round-trip.
		</p>
	</section>

	<!-- Tool Categories (from centralized config) -->
	{#each categories as category}
		{@const style = categoryStyles[category.name] || categoryStyles['JSON']}
		<section class="mb-12">
			<h2 class="mb-2 flex items-center gap-3 text-xl font-bold">
				<span class="flex h-9 w-9 items-center justify-center rounded-lg {style.bgClass} text-lg">
					{category.icon}
				</span>
				{category.name} Tools
			</h2>
			{#if category.description}
				<p class="mb-6 text-sm text-base-content/60 leading-relaxed max-w-2xl">{category.description}</p>
			{/if}

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
	<footer class="mt-16 border-t border-base-300/50 pt-8 pb-10">
		<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
			<div>
				<p class="font-semibold text-base-content/80 mb-1">OneDev Tools</p>
				<p class="text-sm text-base-content/50">All processing happens locally in your browser. Your data never leaves your device.</p>
			</div>
			<nav class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-base-content/50">
				<a href="/about" class="hover:text-primary transition-colors">About</a>
				<a href="/privacy" class="hover:text-primary transition-colors">Privacy Policy</a>
				<a href="/contact" class="hover:text-primary transition-colors">Contact</a>
				<a href="/editorial-policy" class="hover:text-primary transition-colors">Editorial Policy</a>
			</nav>
		</div>
		<p class="mt-6 text-xs text-base-content/30 text-center">© {new Date().getFullYear()} OneDev Tools. Built with Svelte, DaisyUI, and ❤️</p>
	</footer>
</div>
