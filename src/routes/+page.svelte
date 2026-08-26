<script lang="ts">
	import { getActiveCategories, getAllActiveTools } from '$lib/config/tools';
	import { SITE_ORIGIN } from '$lib/config/indexing';
	import logo from '$lib/assets/logo.png';
	import AppIcon from '$lib/components/ui/AppIcon.svelte';
	const categories = getActiveCategories();
	const allTools = getAllActiveTools();
</script>

<svelte:head>
	<title>OneDev Tools — {allTools.length} Free Developer Tools | JSON, XML, CSV, SQL, Dates</title>
	<meta
		name="description"
		content="Free online developer tools: JSON formatter, XML formatter, CSV to JSON converter, SQL formatter, Unix timestamp converter, timezone converter, hash generator, JWT decoder, and more. No signup. Nothing is uploaded."
	/>
	<meta name="author" content="OneDev Tools" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="{SITE_ORIGIN}/" />
	
	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="OneDev Tools" />
	<meta property="og:title" content="OneDev Tools - Free Online Developer Tools" />
	<meta property="og:description" content="Free SQL formatter, XML formatter, CSV to JSON converter, Unix timestamp converter, timezone converter, JSON tools, hashes, JWTs, and more. No sign-up. Input stays in your browser." />
	<meta property="og:url" content="{SITE_ORIGIN}/" />
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="OneDev Tools - Free Online Developer Tools" />
	<meta name="twitter:description" content="Free SQL formatter, XML formatter, CSV to JSON converter, Unix timestamp converter, timezone converter, JSON tools, hashes, and JWTs. No sign-up." />
	
	<!-- Structured Data -->
	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "WebApplication",
		"name": "OneDev Tools",
		"url": "${SITE_ORIGIN}",
		"description": "Free online developer tools: JSON formatter, XML formatter, CSV to JSON converter, SQL formatter, Unix timestamp converter, timezone converter, hashes, JWTs, and more.",
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
			OneDev Tools
		</h1>
		<img src={logo} alt="OneDev Tools Logo" class="w-96 h-60 rounded-lg mx-auto mb-4" />
		<p class="text-lg text-base-content/70 leading-relaxed">
			Free, fast, and privacy-focused developer tools.
			<br />
			No sign-up required. Everything runs in your browser.
		</p>
		<p class="mt-4 text-sm text-muted">{allTools.length} tools · Free · Runs in your browser</p>
	</div>

	<!-- Original copy so the homepage is not only a card grid -->
	<section class="mb-12 rounded-lg border border-base-300 bg-base-100 p-6 sm:p-8 text-left">
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
		<section class="mb-12">
			<h2 class="mb-2 flex items-center gap-3 text-xl font-bold">
				<span class="flex h-9 w-9 items-center justify-center rounded-lg bg-base-200 text-base-content">
					<AppIcon name={category.icon} size={18} />
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
						class="card bg-base-200 border border-base-300 transition-all duration-200 hover:border-base-content/20 hover:shadow-md"
					>
						<div class="card-body p-5">
							<div class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-base-300 text-base-content">
								<AppIcon name={tool.icon} size={20} />
							</div>
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
				<a href="/about" class="hover:text-base-content transition-colors">About</a>
				<a href="/privacy" class="hover:text-base-content transition-colors">Privacy Policy</a>
				<a href="/contact" class="hover:text-base-content transition-colors">Contact</a>
				<a href="/editorial-policy" class="hover:text-base-content transition-colors">Editorial Policy</a>
			</nav>
		</div>
		<p class="mt-6 text-xs text-base-content/30 text-center inline-flex items-center justify-center gap-1 w-full">© {new Date().getFullYear()} OneDev Tools. Built with Svelte, DaisyUI, and <AppIcon name="heart" size={12} class="inline text-error" /></p>
	</footer>
</div>
